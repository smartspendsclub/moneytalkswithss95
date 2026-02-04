'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Doughnut = dynamic(
  () => import('react-chartjs-2').then((m) => m.Doughnut),
  { ssr: false }
);

// =================================================================
// 1. HELPERS
// =================================================================

function formatNumber(num: number | undefined) {
  if (num === undefined || num === null || Number.isNaN(num)) return '0';
  return num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function stripLeadingZeros(value: string) {
  if (!value) return '';
  return value.replace(/^0+(?=\d)/, '');
}

function runStepUpSip(
  startingSip: number,
  years: number,
  expectedReturn: number,
  stepUpRate: number
) {
  if (years <= 0 || startingSip <= 0) {
    return {
      corpus: 0, totalInvested: 0, growth: 0, growthShare: 0,
      finalSip: startingSip, avgSip: 0, yearlyBreakdown: []
    };
  }

  const rMonthly = expectedReturn / 12 / 100;
  const totalMonths = years * 12;
  let corpus = 0;
  let totalInvested = 0;
  let sip = startingSip;
  const yearlyBreakdown = [];

  for (let m = 0; m < totalMonths; m++) {
    if (m > 0 && m % 12 === 0) {
      sip = sip * (1 + stepUpRate / 100);
    }
    corpus = (corpus + sip) * (1 + rMonthly);
    totalInvested += sip;

    // Capture data at the end of every 12th month
    if ((m + 1) % 12 === 0) {
      yearlyBreakdown.push({
        year: (m + 1) / 12,
        cumulativeInvestment: Math.round(totalInvested),
        expectedWealth: Math.round(corpus),
        monthlySip: Math.round(sip),
      });
    }
  }

  const growth = Math.max(corpus - totalInvested, 0);
  const growthShare = corpus > 0 ? Number(((growth / corpus) * 100).toFixed(2)) : 0;

  return {
    corpus: Math.round(corpus),
    totalInvested: Math.round(totalInvested),
    growth: Math.round(growth),
    growthShare,
    finalSip: Math.round(sip),
    avgSip: Math.round(totalInvested / totalMonths),
    yearlyBreakdown,
  };
}

// =================================================================
// 2. UI SUB-COMPONENTS
// =================================================================

function ControlBlock({
  label,
  hint,
  valueLabel,
  accent,
  children,
}: {
  label: string;
  hint: string;
  valueLabel: string;
  accent: 'emerald' | 'sky' | 'indigo' | 'amber';
  children: React.ReactNode;
}) {
  const ring =
    accent === 'emerald' ? 'ring-emerald-500/40' : 
    accent === 'sky' ? 'ring-sky-500/40' : 
    accent === 'indigo' ? 'ring-indigo-500/40' : 'ring-amber-500/40';

  return (
    <div className={`space-y-3 rounded-xl bg-slate-950/40 p-5 ring-1 ${ring}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-white">{label}</p>
          <p className="text-sm text-slate-300 leading-snug">{hint}</p>
        </div>
        <p className="text-sm font-bold text-sky-300 bg-sky-500/10 px-2 py-1 rounded">{valueLabel}</p>
      </div>
      {children}
    </div>
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
    <div className={`rounded-xl border px-4 py-4 ${
      highlight ? 'border-emerald-400 bg-linear-to-br from-emerald-500/20 to-emerald-400/5 shadow-[0_0_25px_rgba(16,185,129,0.15)] text-emerald-50' : 'border-slate-700 bg-slate-950/40 text-slate-100'
    }`}>
      <p className={`text-sm font-medium ${highlight ? 'text-emerald-200' : 'text-slate-300'}`}>{label}</p>
      <p className="mt-2 text-xl font-bold">{value}</p>
      <p className={`mt-1 text-xs ${highlight ? 'text-emerald-100/60' : 'text-slate-400'}`}>{helper}</p>
    </div>
  );
}

function LegendItem({
  color,
  label,
  value,
  percent,
}: {
  color: string;
  label: string;
  value: string;
  percent: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className={`mt-1 h-3 w-3 rounded-full ${color} shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-sm font-medium text-slate-200">{value}</p>
        <p className="text-sm font-semibold text-slate-300">{percent}</p>
      </div>
    </div>
  );
}

// =================================================================
// 3. MAIN CALCULATOR
// =================================================================

export default function StepUpSipCalculator() {
  const [startingSip, setStartingSip] = useState(15000);
  const [years, setYears] = useState(15);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [stepUpRate, setStepUpRate] = useState(10);

  const results = useMemo(
    () => runStepUpSip(startingSip, years, expectedReturn, stepUpRate),
    [startingSip, years, expectedReturn, stepUpRate]
  );

  const { corpus, totalInvested, growth, growthShare, avgSip, finalSip, yearlyBreakdown } = results;
  const investedShare = Math.max(0, 100 - growthShare);

  const doughnutData = useMemo(() => ({
    labels: ['Total invested', 'Estimated returns'],
    datasets: [{
      data: [totalInvested, growth],
      backgroundColor: ['#0ea5e9', '#10b981'],
      hoverBackgroundColor: ['#38bdf8', '#34d399'],
      borderWidth: 0,
      hoverOffset: 12,
    }],
  }), [totalInvested, growth]);

  const doughnutOptions: any = {
    plugins: {
      legend: { display: false },
      tooltip: {
        bodyFont: { size: 13, weight: '600' },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => ` ₹ ${formatNumber(context.raw)}`
        }
      },
    },
    cutout: '75%',
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-700 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 shadow-2xl md:mx-2 lg:mx-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-8 md:px-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/30 uppercase tracking-wide">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            SIP · Step-up strategy
          </div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Step-up SIP Projection</h2>
          <p className="text-sm text-slate-300 md:text-base max-w-md">
            Start with a base SIP and increase it every year to accelerate your wealth creation.
          </p>
        </div>

        <div className="flex flex-col items-end text-right">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Projected corpus</span>
          <span className="text-2xl font-bold text-emerald-400 md:text-3xl transition-all duration-300 ease-out">
            ₹{formatNumber(corpus)}
          </span>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Over {years} years at {expectedReturn}% p.a.
          </p>
        </div>
      </div>

      <div className="grid gap-8 border-t border-white/5 bg-slate-950/40 px-6 py-8 backdrop-blur-md md:grid-cols-[1.1fr,1fr] md:px-10">
        {/* LEFT: Inputs */}
        <div className="space-y-6">
          <ControlBlock
            label="Starting monthly SIP"
            hint="The base SIP amount you're starting with."
            valueLabel={`₹ ${formatNumber(startingSip)}`}
            accent="emerald"
          >
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range" min={2000} max={200000} step={1000}
                value={startingSip}
                onChange={(e) => setStartingSip(Number(e.target.value))}
                className="h-2 w-full cursor-pointer rounded-full bg-slate-800 accent-emerald-400"
              />
              <input
                type="number"
                className="w-32 rounded-lg border-2 border-slate-700 bg-slate-900 px-3 py-2 text-lg font-bold text-white outline-none focus:border-emerald-500"
                value={startingSip === 0 ? '' : startingSip}
                onChange={(e) => setStartingSip(Number(stripLeadingZeros(e.target.value)) || 0)}
              />
            </div>
          </ControlBlock>

          <ControlBlock
            label="Investment period"
            hint="The total duration of your investment."
            valueLabel={`${years} years`}
            accent="sky"
          >
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range" min={1} max={40} step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="h-2 w-full cursor-pointer rounded-full bg-slate-800 accent-sky-400"
              />
              <input
                type="number"
                className="w-24 rounded-lg border-2 border-slate-700 bg-slate-900 px-3 py-2 text-lg font-bold text-white outline-none focus:border-sky-500"
                value={years === 0 ? '' : years}
                onChange={(e) => setYears(Number(stripLeadingZeros(e.target.value)) || 0)}
              />
            </div>
          </ControlBlock>

          <ControlBlock
            label="Expected annual return (%)"
            hint="Anticipated average yearly growth rate."
            valueLabel={`${expectedReturn}% p.a.`}
            accent="indigo"
          >
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range" min={1} max={30} step={0.5}
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
                className="h-2 w-full cursor-pointer rounded-full bg-slate-800 accent-indigo-400"
              />
              <input
                type="number"
                className="w-24 rounded-lg border-2 border-slate-700 bg-slate-900 px-3 py-2 text-lg font-bold text-white outline-none focus:border-indigo-500"
                value={expectedReturn === 0 ? '' : expectedReturn}
                onChange={(e) => setExpectedReturn(parseFloat(stripLeadingZeros(e.target.value)) || 0)}
              />
            </div>
          </ControlBlock>

          <ControlBlock
            label="Yearly step-up (%)"
            hint="How much you'll increase your SIP every year."
            valueLabel={`${stepUpRate}% increase`}
            accent="amber"
          >
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range" min={0} max={50} step={1}
                value={stepUpRate}
                onChange={(e) => setStepUpRate(parseFloat(e.target.value))}
                className="h-2 w-full cursor-pointer rounded-full bg-slate-800 accent-amber-400"
              />
              <input
                type="number"
                className="w-24 rounded-lg border-2 border-slate-700 bg-slate-900 px-3 py-2 text-lg font-bold text-white outline-none focus:border-amber-500"
                value={stepUpRate === 0 ? '' : stepUpRate}
                onChange={(e) => setStepUpRate(parseFloat(stripLeadingZeros(e.target.value)) || 0)}
              />
            </div>
          </ControlBlock>
        </div>

        {/* RIGHT: Results & Chart */}
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultCard label="Avg. SIP" value={`₹${formatNumber(avgSip)}`} helper="Monthly average" />
            <ResultCard label="Total Invested" value={`₹${formatNumber(totalInvested)}`} helper="Principal amount" />
            <ResultCard label="Est. Growth" value={`₹${formatNumber(growth)}`} helper="Wealth generated" highlight />
          </div>


          <div className="flex-1 space-y-6 rounded-2xl bg-slate-900/50 backdrop-blur-lg p-6 ring-1 ring-white/5 shadow-inner">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">Investment Breakdown</h3>
            
            <div className="flex flex-col items-center gap-10 lg:flex-row lg:justify-center">
              <div className="relative h-56 w-56 transition-transform hover:scale-105 duration-300 drop-shadow-[0_0_25px_rgba(16,185,129,0.25)]">
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Final Corpus</span>
                  <span className="text-xl font-black text-white">₹{formatNumber(corpus)}</span>
                </div>
              </div>

              <div className="space-y-6 min-w-[180px]">
                <LegendItem color="bg-sky-500" label="Principal" value={`₹ ${formatNumber(totalInvested)}`} percent={`${investedShare.toFixed(1)}%`} />
                <LegendItem color="bg-emerald-500" label="Returns" value={`₹ ${formatNumber(growth)}`} percent={`${growthShare.toFixed(1)}%`} />
              </div>
            </div>
            
            <div className="mt-8 border-t border-white/10 pt-4 text-center">
               <p className="text-sm text-slate-300 italic leading-relaxed">
                Your SIP grows from ₹{formatNumber(startingSip)} to <span className="text-emerald-300 font-bold">₹{formatNumber(finalSip)}</span> over {years} years.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-linear-to-br from-emerald-500/15 to-emerald-400/5 border border-emerald-500/30 p-6">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-emerald-500 rounded text-slate-900">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <p className="text-base font-extrabold text-emerald-300 uppercase tracking-wider">Power of Compounding</p>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              Increasing your contribution by {stepUpRate}% annually takes advantage of exponential growth, resulting in significantly more wealth than a static SIP.
            </p>
          </div>
          {/* Yearly Projection Table Section */}
          <div className="border-t border-white/10 bg-slate-950/20 px-6 py-8 md:px-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Yearly Growth Projection</h3>
                <p className="text-sm text-slate-400 mt-1">Detailed wealth accumulation breakdown</p>
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 shadow-inner">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-800/50 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="px-6 py-4 border-b border-slate-700">Year</th>
                    <th className="px-6 py-4 border-b border-slate-700">Monthly SIP</th>
                    <th className="px-6 py-4 border-b border-slate-700">Total Invested</th>
                    <th className="px-6 py-4 border-b border-slate-700 text-right">Wealth (Corpus)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {yearlyBreakdown.map((row) => (
                    <tr key={row.year} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 font-bold text-sky-400">Year {row.year}</td>
                      <td className="px-6 py-4 text-slate-300 font-medium">₹{formatNumber(row.monthlySip)}</td>
                      <td className="px-6 py-4 text-slate-400">₹{formatNumber(row.cumulativeInvestment)}</td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-400 group-hover:scale-105 transition-transform origin-right">
                        ₹{formatNumber(row.expectedWealth)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}