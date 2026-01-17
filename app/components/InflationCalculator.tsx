'use client';

import React, { useMemo, useState } from 'react';

function formatNumber(num: number | undefined) {
  if (!num || Number.isNaN(num)) return '0';
  return num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function stripLeadingZeros(v: string) {
  if (!v) return '';
  return v.replace(/^0+(?=\d)/, '');
}

export default function InflationCalculator() {
  const [amountToday, setAmountToday] = useState(500000);
  const [years, setYears] = useState(10);
  const [inflation, setInflation] = useState(6);

  const result = useMemo(() => {
    const infl = inflation / 100;
    const futureCost = amountToday * Math.pow(1 + infl, years);
    const doubleYears =
      inflation > 0 ? Math.log(2) / Math.log(1 + infl) : Infinity;

    return { futureCost, doubleYears };
  }, [amountToday, years, inflation]);

  const amountDisplay = amountToday === 0 ? '' : String(amountToday);
  const yearsDisplay = years === 0 ? '' : String(years);
  const inflationDisplay = inflation === 0 ? '' : String(inflation);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 shadow-xl shadow-slate-900/30 md:mx-2 lg:mx-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 md:px-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/15 px-3 py-1 text-[11px] font-medium text-sky-100 ring-1 ring-sky-400/60">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-400" />
            Inflation · Future cost
          </div>
          <h2 className="text-lg font-semibold md:text-xl">
            Inflation Impact Calculator
          </h2>
          <p className="text-[11px] text-slate-300 md:text-xs">
            See how today’s amount grows in rupee terms if prices rise
            every year.
          </p>
        </div>

        <div className="flex flex-col items-end text-right text-[11px] text-slate-300 md:text-xs">
          <span className="text-slate-400">Future cost estimate</span>
          <span className="text-base font-semibold text-emerald-300 md:text-lg">
            ₹ {formatNumber(result.futureCost)}
          </span>
          <span className="text-[11px] text-slate-400">
            In {years} years at {inflation}% inflation
          </span>
        </div>
      </div>

      <div className="grid gap-6 border-t border-white/5 bg-slate-950/40 px-5 py-5 backdrop-blur md:grid-cols-[3fr,2.4fr] md:px-8 md:py-7">
        {/* Left – inputs */}
        <div className="space-y-5 rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/5 md:p-5">
          <ControlBlock
            label="Cost today"
            hint="Approximate amount in today’s terms."
            valueLabel={`₹ ${formatNumber(amountToday)}`}
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={50000}
                max={10000000}
                step={25000}
                value={amountToday}
                onChange={(e) =>
                  setAmountToday(parseInt(e.target.value || '0') || 0)
                }
                className="h-1.5 w-full cursor-pointer rounded-full bg-slate-700 accent-sky-400"
              />
              <input
                type="number"
                className="w-32 rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-50 outline-none ring-sky-500/40 focus:border-sky-400 focus:ring"
                value={amountDisplay}
                onChange={(e) => {
                  const cleaned = stripLeadingZeros(e.target.value);
                  if (!cleaned) {
                    setAmountToday(0);
                    return;
                  }
                  const num = parseInt(cleaned, 10);
                  setAmountToday(Number.isNaN(num) ? 0 : num);
                }}
              />
            </div>
          </ControlBlock>

          <ControlBlock
            label="Years until you need the money"
            hint="Longer horizons magnify the effect of inflation."
            valueLabel={`${years} years`}
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={40}
                value={years}
                onChange={(e) =>
                  setYears(parseInt(e.target.value || '0') || 0)
                }
                className="h-1.5 w-full cursor-pointer rounded-full bg-slate-700 accent-emerald-400"
              />
              <input
                type="number"
                min={1}
                max={50}
                className="w-20 rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-50 outline-none ring-emerald-500/40 focus:border-emerald-400 focus:ring"
                value={yearsDisplay}
                onChange={(e) => {
                  const cleaned = stripLeadingZeros(e.target.value);
                  if (!cleaned) {
                    setYears(0);
                    return;
                  }
                  const num = parseInt(cleaned, 10);
                  setYears(Number.isNaN(num) ? 0 : num);
                }}
              />
            </div>
          </ControlBlock>

          <ControlBlock
            label="Inflation (per year)"
            hint="Your guess for long-term price increase."
            valueLabel={`${inflation}% p.a.`}
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={3}
                max={10}
                step={0.5}
                value={inflation}
                onChange={(e) =>
                  setInflation(parseFloat(e.target.value || '0') || 0)
                }
                className="h-1.5 w-full cursor-pointer rounded-full bg-slate-700 accent-amber-400"
              />
              <input
                type="number"
                min={0}
                max={20}
                step={0.5}
                className="w-20 rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-50 outline-none ring-amber-500/40 focus:border-amber-400 focus:ring"
                value={inflationDisplay}
                onChange={(e) => {
                  const cleaned = stripLeadingZeros(e.target.value);
                  if (!cleaned) {
                    setInflation(0);
                    return;
                  }
                  const num = parseFloat(cleaned);
                  setInflation(Number.isNaN(num) ? 0 : num);
                }}
              />
            </div>
          </ControlBlock>
        </div>

        {/* Right – explanation */}
        <div className="space-y-3 rounded-2xl bg-slate-900/70 p-4 ring-1 ring-white/5 md:p-5">
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <ResultCard
              label="Future cost"
              value={`₹ ${formatNumber(result.futureCost)}`}
              helper="Amount you’d roughly need in the future to match today’s purchasing power."
              highlight
            />
            <ResultCard
              label="Rupee doubling time"
              value={
                result.doubleYears === Infinity
                  ? '—'
                  : `${result.doubleYears.toFixed(1)} years`
              }
              helper="At this inflation, prices roughly double in this many years."
            />
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3 text-[11px] text-slate-300">
            <p className="text-xs font-semibold text-sky-300">
              How to use this with your goals
            </p>
            <p className="mt-1 text-slate-300">
              Take any future goal amount in today’s rupees, plug it in
              here, and use the future cost in your SIP / lumpsum /
              goal-planner tools. It keeps your planning consistent with
              inflation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ControlBlock({
  label,
  hint,
  valueLabel,
  children,
}: {
  label: string;
  hint: string;
  valueLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 rounded-xl bg-slate-950/40 p-3.5 ring-1 ring-sky-500/30">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-100">{label}</p>
          <p className="text-[11px] text-slate-400">{hint}</p>
        </div>
        <p className="text-[11px] font-medium text-sky-200">
          {valueLabel}
        </p>
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
    <div
      className={`rounded-xl border px-3 py-3 ${
        highlight
          ? 'border-sky-400 bg-sky-500/15 text-sky-50 shadow-sm shadow-sky-500/40'
          : 'border-slate-700 bg-slate-950/40 text-slate-100'
      }`}
    >
      <p
        className={`text-[11px] ${
          highlight ? 'text-sky-100/80' : 'text-slate-400'
        }`}
      >
        {label}
      </p>
      <p className="mt-1 text-base font-semibold">{value}</p>
      <p className="mt-1 text-[10px] text-slate-400">{helper}</p>
    </div>
  );
}
