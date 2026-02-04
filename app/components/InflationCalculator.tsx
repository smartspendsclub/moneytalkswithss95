'use client';

import React, { useMemo, useState } from 'react';

// =================================================================
// 1. HELPERS
// =================================================================

function formatNumber(num?: number) {
  if (num === undefined || num === null || Number.isNaN(num)) return '0';
  return num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function stripLeadingZeros(v: string) {
  if (!v) return '';
  return v.replace(/^0+(?=\d)/, '');
}

// =================================================================
// 2. MAIN CALCULATOR
// =================================================================

export default function InflationCalculator() {
  const [amountToday, setAmountToday] = useState(500000);
  const [years, setYears] = useState(10);
  const [inflation, setInflation] = useState(6);

  const result = useMemo(() => {
    const infl = inflation / 100;
    const futureCost = amountToday * Math.pow(1 + infl, years);
    const doubleYears = inflation > 0 ? Math.log(2) / Math.log(1 + infl) : Infinity;

    // Generate yearly data for the table
    const breakdown = [];
    for (let i = 1; i <= years; i++) {
      breakdown.push({
        year: i,
        futureValue: Math.round(amountToday * Math.pow(1 + infl, i)),
        lossOfValue: Math.round(amountToday - (amountToday / Math.pow(1 + infl, i))),
      });
    }

    return { futureCost, doubleYears, breakdown };
  }, [amountToday, years, inflation]);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 shadow-2xl md:mx-2 lg:mx-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-8 md:px-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-4 py-1.5 text-xs font-bold text-sky-300 ring-1 ring-sky-400/30 uppercase tracking-wide">
            <span className="inline-block h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            Inflation · Future Value
          </div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Inflation Impact</h2>
          <p className="text-sm text-slate-300 md:text-base max-w-md">
            Calculate the future cost of your goals and see how inflation erodes your wealth over time.
          </p>
        </div>

        <div className="flex flex-col items-end text-right">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Future Cost</span>
          <span className="text-3xl font-bold text-emerald-400 md:text-4xl transition-all duration-300 ease-out">
            ₹{formatNumber(result.futureCost)}
          </span>
          <p className="text-sm font-medium text-slate-400 mt-1">
            In {years} years at {inflation}% inflation
          </p>
        </div>
      </div>

      <div className="grid gap-8 border-t border-white/5 bg-slate-950/40 px-6 py-8 backdrop-blur-md md:grid-cols-[1.1fr,1fr] md:px-10">
        {/* LEFT: Inputs */}
        <div className="space-y-6">
          <ControlBlock
            label="Cost in today's terms"
            hint="Amount required for the goal today."
            valueLabel={`₹ ${formatNumber(amountToday)}`}
            accent="sky"
          >
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range" min={50000} max={10000000} step={50000}
                value={amountToday}
                onChange={(e) => setAmountToday(Number(e.target.value))}
                className="h-2 w-full cursor-pointer rounded-full bg-slate-800 accent-sky-400"
              />
              <input
                type="number"
                className="w-32 rounded-lg border-2 border-slate-700 bg-slate-900 px-3 py-2 text-lg font-bold text-white outline-none focus:border-sky-500"
                value={amountToday === 0 ? '' : amountToday}
                onChange={(e) => setAmountToday(Number(stripLeadingZeros(e.target.value)) || 0)}
              />
            </div>
          </ControlBlock>

          <ControlBlock
            label="Years to Goal"
            hint="Time horizon for this expenditure."
            valueLabel={`${years} years`}
            accent="emerald"
          >
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range" min={1} max={40} step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="h-2 w-full cursor-pointer rounded-full bg-slate-800 accent-emerald-400"
              />
              <input
                type="number"
                className="w-24 rounded-lg border-2 border-slate-700 bg-slate-900 px-3 py-2 text-lg font-bold text-white outline-none focus:border-emerald-500"
                value={years === 0 ? '' : years}
                onChange={(e) => setYears(Number(stripLeadingZeros(e.target.value)) || 0)}
              />
            </div>
          </ControlBlock>

          <ControlBlock
            label="Annual Inflation Rate (%)"
            hint="Average yearly price increase (usually 6-7%)."
            valueLabel={`${inflation}% p.a.`}
            accent="amber"
          >
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range" min={1} max={15} step={0.1}
                value={inflation}
                onChange={(e) => setInflation(parseFloat(e.target.value))}
                className="h-2 w-full cursor-pointer rounded-full bg-slate-800 accent-amber-400"
              />
              <input
                type="number"
                className="w-24 rounded-lg border-2 border-slate-700 bg-slate-900 px-3 py-2 text-lg font-bold text-white outline-none focus:border-amber-500"
                value={inflation === 0 ? '' : inflation}
                onChange={(e) => setInflation(parseFloat(stripLeadingZeros(e.target.value)) || 0)}
              />
            </div>
          </ControlBlock>
        </div>

        {/* RIGHT: Summary Cards & Info */}
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard 
              label="Future Value" 
              value={`₹${formatNumber(result.futureCost)}`} 
              helper="Budget needed later" 
              highlight 
            />
            <ResultCard 
              label="Price Doubling" 
              value={result.doubleYears === Infinity ? '—' : `${result.doubleYears.toFixed(1)} Yrs`} 
              helper="Time for prices to 2x" 
            />
          </div>

          <div className="flex-1 space-y-4 rounded-2xl bg-slate-900/60 p-6 ring-1 ring-white/5 shadow-inner">
             <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-sky-500/20 rounded-lg text-sky-400">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest">Purchasing Power Note</h3>
             </div>
             <p className="text-sm text-slate-300 leading-relaxed">
               At <span className="text-amber-400 font-bold">{inflation}%</span> inflation, what costs <span className="text-white font-semibold">₹{formatNumber(amountToday)}</span> today will require <span className="text-emerald-400 font-bold">₹{formatNumber(result.futureCost)}</span> in {years} years just to maintain the same standard of living.
             </p>
             <div className="mt-4 p-4 rounded-xl bg-slate-950/50 border border-white/5">
                <p className="text-xs text-slate-400 italic">
                  *This calculation assumes inflation is compounded annually. Use this future value as your "Target Amount" in your SIP or Goal planning.
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Yearly Projection Table */}
      <div className="border-t border-white/10 bg-slate-950/20 px-6 py-8 md:px-10">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white">Yearly Price Progression</h3>
          <p className="text-sm text-slate-400 mt-1">See how much more you'll pay year-over-year.</p>
        </div>
        
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-inner">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-800/50 text-xs font-bold uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-6 py-4 border-b border-slate-700">Year</th>
                <th className="px-6 py-4 border-b border-slate-700">Estimated Cost</th>
                <th className="px-6 py-4 border-b border-slate-700 text-right">Value Eroded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {result.breakdown.map((row) => (
                <tr key={row.year} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-bold text-sky-400">Year {row.year}</td>
                  <td className="px-6 py-4 text-slate-200 font-semibold">₹{formatNumber(row.futureValue)}</td>
                  <td className="px-6 py-4 text-right font-medium text-rose-400 group-hover:scale-105 transition-transform origin-right">
                    - ₹{formatNumber(row.lossOfValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// =================================================================
// 3. UI SUB-COMPONENTS
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
  accent: 'emerald' | 'sky' | 'amber';
  children: React.ReactNode;
}) {
  const ring =
    accent === 'emerald' ? 'ring-emerald-500/40' : 
    accent === 'sky' ? 'ring-sky-500/40' : 'ring-amber-500/40';

  return (
    <div className={`space-y-3 rounded-xl bg-slate-950/40 p-5 ring-1 ${ring}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-white">{label}</p>
          <p className="text-sm text-slate-400 leading-snug">{hint}</p>
        </div>
        <p className="text-sm font-bold text-sky-300 bg-sky-500/10 px-2 py-1 rounded whitespace-nowrap">{valueLabel}</p>
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
      highlight ? 'border-emerald-400 bg-emerald-500/15 text-emerald-50 shadow-sm shadow-emerald-500/40' : 'border-slate-700 bg-slate-950/40 text-slate-100'
    }`}>
      <p className={`text-sm font-medium ${highlight ? 'text-emerald-200' : 'text-slate-400'}`}>{label}</p>
      <p className="mt-2 text-xl font-bold">{value}</p>
      <p className={`mt-1 text-xs ${highlight ? 'text-emerald-100/60' : 'text-slate-500'}`}>{helper}</p>
    </div>
  );
}