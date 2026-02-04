'use client';

import React, { useState, useMemo, FormEvent, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

import { downloadComponentPdf } from '../lib/pdf-utils';
import SipPdfReport from './SipPdfReport';

ChartJS.register(ArcElement, Tooltip, Legend);

type ScenarioKey = 'conservative' | 'base' | 'optimistic';

const SCENARIOS: Record<
  ScenarioKey,
  { label: string; returnRate: number; description: string }
> = {
  conservative: {
    label: 'Conservative',
    returnRate: 10,
    description: 'Lower return assumption, closer to debt-heavy portfolios.',
  },
  base: {
    label: 'Base case',
    returnRate: 12,
    description: 'Common long-term equity SIP assumption in India.',
  },
  optimistic: {
    label: 'Optimistic',
    returnRate: 14,
    description: 'Higher return assumption for more aggressive portfolios.',
  },
};

const Doughnut = dynamic(
  () => import('react-chartjs-2').then((m) => m.Doughnut),
  { ssr: false }
);

export default function SipCalculator() {
  const searchParams = useSearchParams(); // ✅ CORRECT POSITION (inside component)

  const [monthlyInvestment, setMonthlyInvestment] = useState(15000);
  const [years, setYears] = useState(15);
  const [expectedReturn, setExpectedReturn] = useState(12);

  /* ---------------- Auto-calc from Retirement Planner ---------------- */

  useEffect(() => {
  const target = searchParams.get('target');
  const yearsParam = searchParams.get('years');
  const returnParam = searchParams.get('return');

  if (!target || !yearsParam) return;

  const targetCorpus = Number(target);
  const investmentYears = Number(yearsParam);
  const returnRate = returnParam ? Number(returnParam) : 12;

  const monthlyReturn = returnRate / 12 / 100;
  const months = investmentYears * 12;

  if (monthlyReturn <= 0 || months <= 0) return;

  const requiredSIP =
    targetCorpus /
    ((((1 + monthlyReturn) ** months - 1) / monthlyReturn) *
      (1 + monthlyReturn));

  if (!Number.isNaN(requiredSIP) && requiredSIP > 0) {
    setYears(investmentYears);
    setExpectedReturn(returnRate);
    setMonthlyInvestment(Math.round(requiredSIP));
  }
}, [searchParams.toString()]);

 // ✅ added expectedReturn dependency

  const [selectedScenario, setSelectedScenario] =
    useState<ScenarioKey>('base');

  const [copiedLink, setCopiedLink] = useState(false);

  function formatNumber(num: number | undefined) {
    if (!num || Number.isNaN(num)) return '0';
    return num.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  /* ---- Rest of your file remains EXACTLY SAME ---- */



  // Main SIP projection
  const mainResults = useMemo(() => {
    const P = monthlyInvestment;
    const n = years * 12;
    const rMonthly = expectedReturn / 12 / 100;

    if (P <= 0 || n <= 0) {
      return null;
    }

    let corpus = 0;

    if (rMonthly > 0) {
      corpus =
        P *
        (((1 + rMonthly) ** n - 1) / rMonthly) *
        (1 + rMonthly);
    } else {
      corpus = P * n;
    }

    const invested = P * n;
    const growth = corpus - invested;
    const growthShare = corpus > 0 ? (growth / corpus) * 100 : 0;

    return {
      monthlyInvestment: P,
      years,
      expectedReturn,
      projectedCorpus: corpus,
      totalInvested: invested,
      growthAmount: growth,
      growthShare,
    };
  }, [monthlyInvestment, years, expectedReturn]);

  // Scenario comparison
  const scenarioResults = useMemo(() => {
    if (!monthlyInvestment || !years) return null;

    const calc = (returnRate: number) => {
      const P = monthlyInvestment;
      const n = years * 12;
      const rMonthly = returnRate / 12 / 100;

      if (P <= 0 || n <= 0) {
        return { projectedCorpus: 0 };
      }

      let corpus = 0;
      if (rMonthly > 0) {
        corpus =
          P *
          (((1 + rMonthly) ** n - 1) / rMonthly) *
          (1 + rMonthly);
      } else {
        corpus = P * n;
      }
      return { projectedCorpus: corpus };
    };

    return {
      conservative: calc(SCENARIOS.conservative.returnRate),
      base: calc(SCENARIOS.base.returnRate),
      optimistic: calc(SCENARIOS.optimistic.returnRate),
    };
  }, [monthlyInvestment, years]);

  const doughnutData = useMemo(() => {
    if (!mainResults) {
      return {
        labels: [],
        datasets: [],
      };
    }

    return {
      labels: ['Total invested', 'Estimated returns'],
      datasets: [
        {
          data: [
            mainResults.totalInvested,
            mainResults.growthAmount,
          ],
          backgroundColor: ['#0ea5e9', '#22c55e'],
          hoverBackgroundColor: ['#38bdf8', '#4ade80'],
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    };
  }, [mainResults]);


  const doughnutOptions: any = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          font: { size: 11 },
        },
      },
      tooltip: {
        bodyFont: { size: 11 },
        titleFont: { size: 11 },
      },
    },
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: false,
  };

  async function handleShareLink() {
    try {
      if (typeof window === 'undefined') return;
      const url = new URL(window.location.href);
      url.searchParams.set(
        'monthly',
        String(monthlyInvestment)
      );
      url.searchParams.set('years', String(years));
      url.searchParams.set(
        'return',
        String(expectedReturn)
      );
      await navigator.clipboard.writeText(url.toString());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }

  // PDF download – uses same engine as Goal Planner
  async function handleDownloadPdf() {
    if (!mainResults || !scenarioResults) return;

    const fileName = 'SIP_plan.pdf';

    const pdfScenarios = [
      {
        key: 'conservative' as const,
        label: SCENARIOS.conservative.label,
        returnRate: SCENARIOS.conservative.returnRate,
        projectedCorpus: scenarioResults.conservative.projectedCorpus,
      },
      {
        key: 'base' as const,
        label: SCENARIOS.base.label,
        returnRate: SCENARIOS.base.returnRate,
        projectedCorpus: scenarioResults.base.projectedCorpus,
      },
      {
        key: 'optimistic' as const,
        label: SCENARIOS.optimistic.label,
        returnRate: SCENARIOS.optimistic.returnRate,
        projectedCorpus: scenarioResults.optimistic.projectedCorpus,
      },
    ];

    await downloadComponentPdf(
      SipPdfReport,
      {
        planTitle: 'SIP Growth Plan',
        monthlyInvestment: mainResults.monthlyInvestment,
        years: mainResults.years,
        expectedReturn: mainResults.expectedReturn,
        projectedCorpus: mainResults.projectedCorpus,
        totalInvested: mainResults.totalInvested,
        growthAmount: mainResults.growthAmount,
        growthShare: mainResults.growthShare,
        scenarios: pdfScenarios,
      },
      fileName
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 shadow-xl shadow-slate-900/30 md:mx-2 lg:mx-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 md:px-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-medium text-emerald-100 ring-1 ring-emerald-400/60">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            SIP · Rupee cost averaging
          </div>
          <h2 className="text-lg font-semibold md:text-xl">
            SIP Growth Projection
          </h2>
          <p className="text-[11px] text-slate-300 md:text-xs">
            Tune your monthly SIP, time horizon and return assumptions
            to see how your corpus could compound.
          </p>
        </div>

        {mainResults && (
          <div className="flex flex-col items-end text-right text-[11px] text-slate-300 md:text-xs">
            <span className="text-slate-400">Projected corpus</span>
            <span className="text-base font-semibold text-emerald-300 md:text-lg">
              ₹ {formatNumber(mainResults.projectedCorpus)}
            </span>
            <span className="text-[11px] text-slate-400">
              Over {mainResults.years} years at{' '}
              {mainResults.expectedReturn}% p.a.
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-6 border-t border-white/5 bg-slate-950/40 px-5 py-5 backdrop-blur md:grid-cols-[3fr,2.4fr] md:px-8 md:py-7">
        {/* LEFT: Controls */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/5 md:p-5"
        >
          {/* Monthly investment */}
          <div className="space-y-2 rounded-xl bg-slate-950/40 p-3.5 ring-1 ring-emerald-500/40">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-100">
                  Monthly investment
                </p>
                <p className="text-[11px] text-slate-400">
                  How much you can comfortably invest every month.
                </p>
              </div>
              <p className="text-[11px] font-medium text-emerald-200">
                ₹ {formatNumber(monthlyInvestment)}
              </p>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <input
                type="range"
                min={1000}
                max={200000}
                step={1000}
                value={monthlyInvestment}
                onChange={(e) =>
                  setMonthlyInvestment(Number(e.target.value))
                }
                className="h-1 w-full cursor-pointer rounded-full bg-slate-700 accent-emerald-400"
              />
              <input
                type="number"
                min={500}
                max={500000}
                step={500}
                value={
                  monthlyInvestment === 0
                    ? ''
                    : monthlyInvestment
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    setMonthlyInvestment(0);
                  } else {
                    const num = Number(val);
                    setMonthlyInvestment(
                      Number.isNaN(num) ? 0 : num
                    );
                  }
                }}
                onFocus={(e) => {
                  setMonthlyInvestment(0);
                  e.target.select();
                }}
                className="w-32 rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-50 outline-none ring-emerald-500/40 focus:border-emerald-400 focus:ring"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
              {[5000, 10000, 25000, 50000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setMonthlyInvestment(amt)}
                  className={`rounded-full border px-3 py-1 ${
                    monthlyInvestment === amt
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                      : 'border-slate-700 bg-slate-900/80 text-slate-200 hover:border-slate-500 hover:bg-slate-800'
                  }`}
                >
                  ₹ {amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Investment period */}
          <div className="space-y-2 rounded-xl bg-slate-950/40 p-3.5 ring-1 ring-sky-500/40">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-100">
                  Investment period
                </p>
                <p className="text-[11px] text-slate-400">
                  Longer periods smooth out volatility and boost
                  compounding.
                </p>
              </div>
              <p className="text-[11px] font-medium text-sky-200">
                {years} years
              </p>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={40}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="h-1 w-full cursor-pointer rounded-full bg-slate-700 accent-sky-400"
              />
              <input
                type="number"
                min={1}
                max={50}
                value={years === 0 ? '' : years}
                onChange={(e) =>
                  setYears(Number(e.target.value) || 0)
                }
                onFocus={(e) => {
                  setYears(0);
                  e.target.select();
                }}
                className="w-20 rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-50 outline-none ring-sky-500/40 focus:border-sky-400 focus:ring"
              />
            </div>
          </div>

          {/* Expected return + scenarios */}
          <div className="space-y-3 rounded-xl bg-slate-950/40 p-3.5 ring-1 ring-indigo-500/40">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-100">
                  Expected annual return
                </p>
                <p className="text-[11px] text-slate-400">
                  Equity-heavy portfolios historically return in this
                  range over long periods.
                </p>
              </div>
              <p className="text-[11px] font-medium text-indigo-200">
                {expectedReturn}% p.a.
              </p>
            </div>

            <div className="mt-1 flex items-center gap-3">
              <input
                type="range"
                min={4}
                max={20}
                step={0.5}
                value={expectedReturn}
                onChange={(e) =>
                  setExpectedReturn(Number(e.target.value))
                }
                className="h-1 w-full cursor-pointer rounded-full bg-slate-700 accent-indigo-400"
              />
              <input
                type="number"
                min={0}
                max={30}
                step={0.5}
                value={expectedReturn === 0 ? '' : expectedReturn}
                onChange={(e) =>
                  setExpectedReturn(Number(e.target.value) || 0)
                }
                onFocus={(e) => {
                  setExpectedReturn(0);
                  e.target.select();
                }}
                className="w-20 rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-50 outline-none ring-indigo-500/40 focus:border-indigo-400 focus:ring"
              />
            </div>

            <div className="grid gap-2 text-xs md:grid-cols-3">
              {(Object.keys(
                SCENARIOS
              ) as ScenarioKey[]).map((key) => {
                const s = SCENARIOS[key];
                const active = selectedScenario === key;
                const sResult = scenarioResults?.[key];

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedScenario(key);
                      setExpectedReturn(s.returnRate);
                    }}
                    className={`flex flex-col items-start rounded-xl border px-3 py-2 text-left transition ${
                      active
                        ? 'border-indigo-400 bg-indigo-500/20 text-indigo-50 shadow-sm shadow-indigo-500/30'
                        : 'border-slate-700 bg-slate-950/40 text-slate-200 hover:border-slate-500 hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-xs font-semibold">
                      {s.label}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {s.description}
                    </span>
                    <span className="mt-1 text-[10px] text-slate-400">
                      Return {s.returnRate}% p.a.
                    </span>
                    {sResult && (
                      <span className="mt-1 text-[11px] font-medium text-indigo-100">
                        Corpus ~ ₹{' '}
                        {formatNumber(sResult.projectedCorpus)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] text-slate-400">
            <p className="max-w-xs">
              This is an illustration, not a promise. Real-world returns
              are uneven and may differ from these assumptions.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleShareLink}
                className="inline-flex items-center gap-1 rounded-full border border-sky-400 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-100 hover:bg-sky-500/20"
              >
                <span>🔗</span>
                <span>
                  {copiedLink ? 'Link copied!' : 'Share this result'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1 rounded-full border border-emerald-500 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-100 hover:bg-emerald-500/20"
              >
                <span>📄</span>
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </form>

        {/* RIGHT: Results + chart */}
        <div className="flex flex-col gap-4 rounded-2xl bg-slate-900/70 p-4 ring-1 ring-white/5 md:p-5">
          <div className="grid gap-3 text-sm md:grid-cols-3">
            <ResultCard
              label="Monthly SIP needed"
              value={
                mainResults
                  ? `₹ ${formatNumber(
                      mainResults.monthlyInvestment
                    )}`
                  : '₹ 0'
              }
              helper="Based on your current inputs and assumptions."
              highlight
            />
            <ResultCard
              label="Total amount you invest"
              value={
                mainResults
                  ? `₹ ${formatNumber(
                      mainResults.totalInvested
                    )}`
                  : '₹ 0'
              }
              helper="Approximate total you contribute over the full period."
            />
            <ResultCard
              label="Estimated returns (growth)"
              value={
                mainResults
                  ? `₹ ${formatNumber(
                      mainResults.growthAmount
                    )}`
                  : '₹ 0'
              }
              helper="Difference between your contributions and final corpus."
            />
          </div>
          {/* SIP explanation section */}
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5 text-sm text-slate-300">
            <h3 className="text-base font-semibold text-slate-100">
              What this SIP result means
            </h3>

            <p className="mt-2">
              This projection estimates how your monthly SIP investment could grow
              over time if you invest consistently and the chosen return assumption
              holds over the long term. It assumes disciplined investing and the
              power of compounding working quietly in the background.
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5 text-[13px]">
              <li>
                <span className="font-medium text-slate-100">
                  Total invested
                </span>{' '}
                is the amount you actually put in through monthly SIPs.
              </li>
              <li>
                <span className="font-medium text-slate-100">
                  Estimated returns
                </span>{' '}
                represent growth generated by compounding, not guaranteed profits.
              </li>
              <li>
                The final corpus is an estimate — real market returns move unevenly
                and differ year to year.
              </li>
            </ul>

            <div className="mt-4 rounded-xl bg-slate-900/60 p-4 ring-1 ring-white/5">
              <p className="font-medium text-slate-100">
                How to use this insight
              </p>
              <p className="mt-1">
                If the projected corpus feels lower than your goal, consider
                increasing the SIP amount gradually or extending the investment
                duration rather than assuming higher returns. Time and consistency
                usually matter more than chasing aggressive numbers.
              </p>
            </div>
          </div>    

          <div className="mt-2 flex flex-1 flex-col gap-3">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>How much is you vs growth?</span>
              <span className="hidden text-[10px] text-slate-400 sm:inline">
                Visual breakdown
              </span>
            </div>

            {/* 1. Use a strict check to prevent "possibly null" errors found in your terminal */}
            {mainResults && doughnutData ? (
              <div className="rounded-2xl bg-slate-950/60 p-5 ring-1 ring-white/5">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Investment Breakdown
                  </h3>
                  <span className="text-[10px] text-slate-500 uppercase">Visual breakdown</span>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* LEFT COLUMN */}
                  <div className="w-full md:w-1/2 space-y-6">
                    <div>
                      {/* Change: Final Corpus label is now thick solid white */}
                      <p className="text-[11px] font-bold uppercase tracking-wider text-white mb-1">
                        Final Corpus
                      </p>
                      <p className="text-4xl font-extrabold text-emerald-400 leading-tight">
                        ₹ {formatNumber(mainResults.projectedCorpus)}
                      </p>
                    </div>

                    {/* Compact Data Pills */}
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-between rounded-xl bg-slate-900/60 p-3.5 ring-1 ring-white/5">
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full bg-[#0ea5e9]" />
                          <span className="text-sm font-medium text-slate-300">Total Invested</span>
                        </div>
                        <span className="text-sm font-bold text-white">
                          ₹ {formatNumber(mainResults.totalInvested)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-slate-900/60 p-3.5 ring-1 ring-white/5">
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full bg-[#22c55e]" />
                          <span className="text-sm font-medium text-slate-300">Estimated Returns</span>
                        </div>
                        <span className="text-sm font-bold text-white">
                          ₹ {formatNumber(mainResults.growthAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Insight Box */}
                    <div className="border-l-4 border-emerald-500 bg-emerald-500/5 py-3 px-5 rounded-r-xl">
                      <p className="text-[13px] leading-relaxed text-slate-200">
                        <span className="font-bold text-emerald-400">
                          {mainResults.growthShare.toFixed(0)}% growth.
                        </span> Compounding is doing the heavy lifting for your wealth.
                      </p>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Interactive Donut */}
                  <div className="relative h-56 w-full md:w-1/2 flex items-center justify-center">
                    <Doughnut 
                      data={doughnutData} 
                      options={{
                        ...doughnutOptions,
                        cutout: '82%', 
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            enabled: true,
                            backgroundColor: '#0f172a',
                            padding: 12,
                            cornerRadius: 8,
                          }
                        },
                        maintainAspectRatio: false,
                      }} 
                    />
                    {/* Center Text: Removed "Yield", only showing percentage */}
                    <div className="absolute pointer-events-none flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-white tracking-tighter">
                        {mainResults.growthShare.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}


            <div className="rounded-xl bg-slate-950/60 p-3 text-[11px] text-slate-300">
              <p className="text-xs font-semibold text-emerald-300">
                Educational only
              </p>
              <p className="mt-1 text-slate-300">
                Use this as a planning guide. Align actual funds with
                your risk profile and revisit your plan regularly as
                your income and responsibilities change.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultCard({
  label,
  value,
  helper,
  highlight,
}: {
  label: string;
  value: string;
  helper: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-3 ${
        highlight
          ? 'border-emerald-400 bg-emerald-500/15 text-emerald-50 shadow-sm shadow-emerald-500/40'
          : 'border-slate-700 bg-slate-950/40 text-slate-100'
      }`}
    >
      <p
        className={`text-[11px] ${
          highlight
            ? 'text-emerald-100/80'
            : 'text-slate-400'
        }`}
      >
        {label}
      </p>
      <p className="mt-1 text-base font-semibold">{value}</p>
      <p className="mt-1 text-[10px] text-slate-400">{helper}</p>
    </div>
  );
}
