'use client';

import React, { useState, useMemo, FormEvent } from 'react';
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
  const [monthlyInvestment, setMonthlyInvestment] = useState(15000);
  const [years, setYears] = useState(15);
  const [expectedReturn, setExpectedReturn] = useState(12);
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
    if (!mainResults) return null;

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
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 shadow-xl shadow-slate-900/30 md:mx-2 lg:mx-4">
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

          <div className="mt-2 flex flex-1 flex-col gap-3">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>How much is you vs growth?</span>
              <span className="hidden text-[10px] text-slate-400 sm:inline">
                Visual breakdown
              </span>
            </div>

            <div className="flex-1">
              {doughnutData ? (
                <div className="relative h-56 rounded-2xl bg-slate-950/60 p-4">
                  <Doughnut
                    data={doughnutData}
                    options={doughnutOptions}
                  />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-2xl bg-slate-950/60 text-xs text-slate-500">
                  Fill in your SIP details to see invested vs growth.
                </div>
              )}
            </div>

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
