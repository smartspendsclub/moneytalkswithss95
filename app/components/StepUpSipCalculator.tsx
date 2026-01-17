'use client';

import React, { useMemo, useState } from 'react';

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

/**
 * Simulate a step-up SIP:
 *  - monthly SIP increases by stepUpRate% every 12 months
 *  - return compounded monthly at expectedReturn% p.a.
 */
function runStepUpSip(
  startingSip: number,
  years: number,
  expectedReturn: number,
  stepUpRate: number
) {
  if (years <= 0 || startingSip <= 0) {
    return {
      corpus: 0,
      totalInvested: 0,
      growth: 0,
      growthShare: 0,
      finalSip: startingSip,
      avgSip: 0,
    };
  }

  const rMonthly = expectedReturn / 12 / 100;
  const totalMonths = years * 12;

  let corpus = 0;
  let totalInvested = 0;
  let sip = startingSip;

  for (let m = 0; m < totalMonths; m++) {
    if (m > 0 && m % 12 === 0) {
      sip = sip * (1 + stepUpRate / 100);
    }
    corpus = corpus * (1 + rMonthly) + sip;
    totalInvested += sip;
  }

  const growth = Math.max(corpus - totalInvested, 0);
  const growthShare = corpus > 0 ? (growth / corpus) * 100 : 0;
  const avgSip = totalInvested / totalMonths;

  return {
    corpus: Math.round(corpus),
    totalInvested: Math.round(totalInvested),
    growth: Math.round(growth),
    growthShare,
    finalSip: Math.round(sip),
    avgSip: Math.round(avgSip),
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
    accent === 'emerald'
      ? 'ring-emerald-500/40'
      : accent === 'sky'
      ? 'ring-sky-500/40'
      : accent === 'indigo'
      ? 'ring-indigo-500/40'
      : 'ring-amber-500/40';

  return (
    <div className={`space-y-2 rounded-xl bg-slate-950/40 p-3.5 ring-1 ${ring}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-100">{label}</p>
          <p className="text-[11px] text-slate-400">{hint}</p>
        </div>
        <p className="text-[11px] font-medium text-sky-200">{valueLabel}</p>
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
          ? 'border-emerald-400 bg-emerald-500/15 text-emerald-50 shadow-sm shadow-emerald-500/40'
          : 'border-slate-700 bg-slate-950/40 text-slate-100'
      }`}
    >
      <p
        className={`text-[11px] ${
          highlight ? 'text-emerald-100/80' : 'text-slate-400'
        }`}
      >
        {label}
      </p>
      <p className="mt-1 text-base font-semibold">{value}</p>
      <p className="mt-1 text-[10px] text-slate-400">{helper}</p>
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
    <div className="flex items-start gap-2">
      <span className={`mt-[3px] h-2.5 w-2.5 rounded-full ${color}`} />
      <div>
        <p className="text-[11px] font-medium text-slate-100">{label}</p>
        <p className="text-[11px] text-slate-300">{value}</p>
        <p className="text-[10px] text-slate-500">{percent}</p>
      </div>
    </div>
  );
}

// =================================================================
// 3. MAIN CALCULATOR (DEFAULT EXPORT)
// =================================================================

export default function StepUpSipCalculator() {
  const [startingSip, setStartingSip] = useState(15000);
  const [years, setYears] = useState(15);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [stepUpRate, setStepUpRate] = useState(10);

  const {
    corpus,
    totalInvested,
    growth,
    growthShare,
    avgSip,
    finalSip,
  } = useMemo(
    () => runStepUpSip(startingSip, years, expectedReturn, stepUpRate),
    [startingSip, years, expectedReturn, stepUpRate]
  );

  const startingSipDisplay = startingSip === 0 ? '' : String(startingSip);
  const yearsDisplay = years === 0 ? '' : String(years);
  const expectedDisplay = expectedReturn === 0 ? '' : String(expectedReturn);
  const stepUpDisplay = stepUpRate === 0 ? '' : String(stepUpRate);
  const investedShare = Math.max(0, 100 - growthShare);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 shadow-xl shadow-slate-900/30 md:mx-2 lg:mx-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 md:px-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-medium text-emerald-100 ring-1 ring-emerald-400/60">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            SIP · Step-up strategy
          </div>
          <h2 className="text-lg font-semibold md:text-xl">Step-up SIP Projection</h2>
          <p className="text-[11px] text-slate-300 md:text-xs">
            Start with a base SIP and increase it every year. See how small yearly
            jumps change your final corpus.
          </p>
        </div>

        <div className="flex flex-col items-end text-right text-[11px] text-slate-300 md:text-xs">
          <span className="text-slate-400">Projected corpus (step-up SIP)</span>
          <span className="text-base font-semibold text-emerald-300 md:text-lg">
            ₹ {formatNumber(corpus)}
          </span>
          <span className="text-[11px] text-slate-400">
            Over {years} years at {expectedReturn}% p.a.
          </span>
        </div>
      </div>

      <div className="grid gap-6 border-t border-white/5 bg-slate-950/40 px-5 py-5 backdrop-blur md:grid-cols-[3fr,2.4fr] md:px-8 md:py-7">
        {/* LEFT: inputs */}
        <div className="space-y-5 rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/5 md:p-5">
          <ControlBlock
            label="Starting monthly SIP"
            hint="The base SIP amount you’re comfortable starting with today."
            valueLabel={`₹ ${formatNumber(startingSip)}`}
            accent="emerald"
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={2000}
                max={200000}
                step={1000}
                value={startingSip}
                onChange={(e) =>
                  setStartingSip(parseInt(e.target.value || '0') || 0)
                }
                className="h-1 w-full cursor-pointer rounded-full bg-slate-700 accent-emerald-400"
              />
              <input
                type="number"
                min={1000}
                max={500000}
                step={500}
                className="w-32 rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-50 outline-none ring-emerald-500/40 focus:border-emerald-400 focus:ring"
                value={startingSipDisplay}
                onChange={(e) => {
                  const cleaned = stripLeadingZeros(e.target.value);
                  if (!cleaned) {
                    setStartingSip(0);
                    return;
                  }
                  const num = parseInt(cleaned, 10);
                  setStartingSip(Number.isNaN(num) ? 0 : num);
                }}
              />
            </div>
          </ControlBlock>

          <ControlBlock
            label="Investment period"
            hint="Roughly how long you plan to continue the SIP & step-ups."
            valueLabel={`${years} years`}
            accent="sky"
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={5}
                max={40}
                step={1}
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value || '0') || 0)}
                className="h-1 w-full cursor-pointer rounded-full bg-slate-700 accent-sky-400"
              />
              <input
                type="number"
                min={1}
                max={50}
                className="w-20 rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-50 outline-none ring-sky-500/40 focus:border-sky-400 focus:ring"
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
            label="Expected annual return"
            hint="Use a realistic return for your long-term equity / hybrid portfolio."
            valueLabel={`${expectedReturn}% p.a.`}
            accent="indigo"
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={6}
                max={20}
                step={0.5}
                value={expectedReturn}
                onChange={(e) =>
                  setExpectedReturn(parseFloat(e.target.value || '0') || 0)
                }
                className="h-1 w-full cursor-pointer rounded-full bg-slate-700 accent-indigo-400"
              />
              <input
                type="number"
                min={0}
                max={30}
                step={0.5}
                className="w-20 rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-50 outline-none ring-indigo-500/40 focus:border-indigo-400 focus:ring"
                value={expectedDisplay}
                onChange={(e) => {
                  const cleaned = stripLeadingZeros(e.target.value);
                  if (!cleaned) {
                    setExpectedReturn(0);
                    return;
                  }
                  const num = parseFloat(cleaned);
                  setExpectedReturn(Number.isNaN(num) ? 0 : num);
                }}
              />
            </div>
          </ControlBlock>

          <ControlBlock
            label="Yearly step-up in SIP"
            hint="Percentage by which your SIP increases every 12 months."
            valueLabel={`${stepUpRate}% per year`}
            accent="amber"
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={25}
                step={1}
                value={stepUpRate}
                onChange={(e) =>
                  setStepUpRate(parseFloat(e.target.value || '0') || 0)
                }
                className="h-1 w-full cursor-pointer rounded-full bg-slate-700 accent-amber-400"
              />
              <input
                type="number"
                min={0}
                max={30}
                step={1}
                className="w-20 rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-50 outline-none ring-amber-500/40 focus:border-amber-400 focus:ring"
                value={stepUpDisplay}
                onChange={(e) => {
                  const cleaned = stripLeadingZeros(e.target.value);
                  if (!cleaned) {
                    setStepUpRate(0);
                    return;
                  }
                  const num = parseFloat(cleaned);
                  setStepUpRate(Number.isNaN(num) ? 0 : num);
                }}
              />
            </div>
          </ControlBlock>
        </div>

        {/* RIGHT: results */}
        <div className="flex flex-col gap-4 rounded-2xl bg-slate-900/70 p-4 ring-1 ring-white/5 md:p-5">
          <div className="grid gap-3 text-sm md:grid-cols-3">
            <ResultCard
              label="Average SIP across period"
              value={`₹ ${formatNumber(avgSip)}/month`}
              helper="If you smooth all step-ups into a single average monthly SIP."
              highlight
            />
            <ResultCard
              label="Total amount you invest"
              value={`₹ ${formatNumber(totalInvested)}`}
              helper="Sum of all SIP contributions over the full period."
            />
            <ResultCard
              label="Estimated growth (returns)"
              value={`₹ ${formatNumber(growth)}`}
              helper="Corpus minus your own total contributions."
            />
          </div>

          <div className="space-y-3 rounded-xl bg-slate-950/60 p-4">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>How much is you vs growth?</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative h-32 w-32">
                <div
                  className="h-32 w-32 rounded-full"
                  style={{
                    background: `conic-gradient(#22c55e 0 ${growthShare}%, #0ea5e9 ${growthShare}% 100%)`,
                  }}
                />
                <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-slate-950">
                  <span className="text-[10px] text-slate-400">Final value</span>
                  <span className="text-xs font-semibold text-slate-50">
                    ₹ {formatNumber(corpus)}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-[11px]">
                <LegendItem
                  color="bg-sky-400"
                  label="You invest"
                  value={`₹ ${formatNumber(totalInvested)}`}
                  percent={`${investedShare.toFixed(0)}% of final value`}
                />
                <LegendItem
                  color="bg-emerald-400"
                  label="Growth / returns"
                  value={`₹ ${formatNumber(growth)}`}
                  percent={`${growthShare.toFixed(0)}% of final value`}
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Your SIP starts at{' '}
                  <span className="font-semibold text-slate-100">
                    ₹ {formatNumber(startingSip)}
                  </span>{' '}
                  and ends around{' '}
                  <span className="font-semibold text-slate-100">
                    ₹ {formatNumber(finalSip)}
                  </span>{' '}
                  per month after {years} years of step-ups.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3 text-[11px] text-slate-300">
            <p className="text-xs font-semibold text-emerald-300">How to read this</p>
            <p className="mt-1 text-slate-300">
              Step-up SIPs try to match your growing income – small annual increases can
              meaningfully boost your corpus. Use this as a planning guide, not a
              guarantee. Actual returns vary and taxes / costs are ignored here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
