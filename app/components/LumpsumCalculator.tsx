// app/components/LumpsumCalculator.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { downloadComponentPdf } from '@/lib/pdf-utils';
import LumpsumPdfReport from '@/components/LumpsumPdfReport';

function formatNumber(num: number | undefined) {
  if (!num || Number.isNaN(num)) return '0';
  return num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function stripLeadingZeros(value: string) {
  if (!value) return '';
  return value.replace(/^0+(?=\d)/, '');
}

// Lumpsum FV: P * (1 + r)^n
function lumpsumFutureValue(
  amount: number,
  years: number,
  annualRate: number
) {
  const r = annualRate / 100;
  return amount * Math.pow(1 + r, years);
}

type Scenario = {
  label: string;
  rate: number;
  corpus: number;
};

export default function LumpsumCalculator() {
  const [amount, setAmount] = useState(500000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  const {
    corpus,
    growth,
    investedShare,
    returnsShare,
    scenarios,
  } = useMemo(() => {
    const fv = lumpsumFutureValue(amount, years, rate);
    const g = Math.max(fv - amount, 0);
    const share = fv === 0 ? 0 : (g / fv) * 100;
    const investedShare = Math.max(0, 100 - share);

    const sc: Scenario[] = [
      {
        label: 'Conservative',
        rate: rate - 2,
        corpus: lumpsumFutureValue(amount, years, rate - 2),
      },
      { label: 'Base case', rate, corpus: fv },
      {
        label: 'Optimistic',
        rate: rate + 2,
        corpus: lumpsumFutureValue(amount, years, rate + 2),
      },
    ];

    return {
      corpus: fv,
      growth: g,
      investedShare,
      returnsShare: share,
      scenarios: sc,
    };
  }, [amount, years, rate]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert(
        'Link copied. You can paste and share this lumpsum calculation.'
      );
    } catch {
      alert(
        'Unable to copy the link. You can share this page URL manually.'
      );
    }
  };

  const handleDownloadPdf = async () => {
    // Use the shared engine: Component + props + filename
    await downloadComponentPdf(
      LumpsumPdfReport,
      {
        amount,
        years,
        rate,
        corpus,
        growth,
        investedShare,
        returnsShare,
        scenarios: scenarios.map((s) => ({
          label: s.label,
          rate: s.rate,
          corpus: s.corpus,
        })),
      },
      'Lumpsum_plan.pdf'
    );
  };

  const amountDisplay = amount === 0 ? '' : String(amount);
  const yearsDisplay = years === 0 ? '' : String(years);
  const rateDisplay = rate === 0 ? '' : String(rate);

  return (
    <div
      id="lumpsum-tool-root"
      className="mx-auto max-w-6xl space-y-6 rounded-2xl bg-slate-950/60 p-5 shadow-2xl shadow-sky-500/20 ring-1 ring-slate-800"
    >
      <header className="pb-4">
        <div className="flex items-center justify-between">
          {/* LEFT */}
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.15em] text-sky-400">
              One-time investment · Growth projection
            </p>

            <h1 className="text-xl font-semibold text-slate-50">
              Lumpsum Investment Projection
            </h1>

            <p className="text-xs text-slate-400 max-w-xl">
              See how a one-time investment can grow over time at different
              return assumptions.
            </p>
          </div>

          {/* RIGHT */}
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-400">
              Projected value
            </p>
            <p className="text-lg font-semibold text-emerald-300">
              ₹ {formatNumber(corpus)}
            </p>
            <p className="text-[11px] text-slate-400">
              After {years} years at {rate}% p.a.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Inputs */}
        <div className="space-y-4">
          <ControlBlock
            label="Initial investment"
            hint="A one-time amount you invest today."
            valueLabel={`₹ ${formatNumber(amount)}`}
            accent="sky"
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={10000}
                max={5000000}
                step={10000}
                value={amount}
                onChange={(e) =>
                  setAmount(
                    parseInt(e.target.value || '0') || 0
                  )
                }
                className="h-1.5 w-full cursor-pointer rounded-full bg-slate-700 accent-sky-400"
              />
              <div className="relative w-32">
                <span className="pointer-events-none absolute left-2 top-1.5 text-[11px] text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  className="w-full rounded-md border border-slate-600 bg-slate-900 px-5 py-1 text-xs text-slate-50 outline-none ring-0 focus:border-sky-400"
                  value={amountDisplay}
                  onChange={(e) => {
                    const cleaned = stripLeadingZeros(
                      e.target.value
                    );
                    if (cleaned === '') {
                      setAmount(0);
                      return;
                    }
                    const val = parseInt(cleaned, 10);
                    setAmount(Number.isNaN(val) ? 0 : val);
                  }}
                />
              </div>
            </div>
          </ControlBlock>

          <ControlBlock
            label="Time horizon"
            hint="How long you plan to stay invested."
            valueLabel={`${years} years`}
            accent="emerald"
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={40}
                value={years}
                onChange={(e) =>
                  setYears(
                    parseInt(e.target.value || '0') || 0
                  )
                }
                className="h-1.5 w-full cursor-pointer rounded-full bg-slate-700 accent-emerald-400"
              />
              <input
                type="number"
                min={1}
                max={40}
                className="w-20 rounded-md border border-slate-600 bg-slate-900 px-3 py-1 text-xs text-slate-50 outline-none focus:border-emerald-400"
                value={yearsDisplay}
                onChange={(e) => {
                  const cleaned = stripLeadingZeros(
                    e.target.value
                  );
                  if (cleaned === '') {
                    setYears(0);
                    return;
                  }
                  const v = parseInt(cleaned, 10);
                  setYears(Number.isNaN(v) ? 0 : v);
                }}
              />
            </div>
          </ControlBlock>

          <ControlBlock
            label="Expected annual return"
            hint="Use a realistic range for your chosen investments."
            valueLabel={`${rate}% p.a.`}
            accent="amber"
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={4}
                max={18}
                step={0.5}
                value={rate}
                onChange={(e) =>
                  setRate(
                    parseFloat(e.target.value || '0') || 0
                  )
                }
                className="h-1.5 w-full cursor-pointer rounded-full bg-slate-700 accent-amber-400"
              />
              <input
                type="number"
                min={1}
                max={30}
                step={0.5}
                className="w-20 rounded-md border border-slate-600 bg-slate-900 px-3 py-1 text-xs text-slate-50 outline-none focus:border-amber-400"
                value={rateDisplay}
                onChange={(e) => {
                  const cleaned = stripLeadingZeros(
                    e.target.value
                  );
                  if (cleaned === '') {
                    setRate(0);
                    return;
                  }
                  const v = parseFloat(cleaned);
                  setRate(Number.isNaN(v) ? rate : v);
                }}
              />
            </div>
          </ControlBlock>
        </div>

        {/* Visual */}
        <div className="space-y-3 rounded-xl bg-slate-950/60 p-4 ring-1 ring-slate-800">
          <p className="text-sm font-medium text-slate-100">
            How much is principal vs growth?
          </p>
          <div className="flex items-center gap-4">
            <div className="relative h-32 w-32">
              <div
                className="h-32 w-32 rounded-full"
                style={{
                  background: `conic-gradient(#22c55e 0 ${returnsShare}%, #0ea5e9 ${returnsShare}% 100%)`,
                }}
              />
              <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-slate-950">
                <span className="text-[10px] text-slate-400">
                  Final value
                </span>
                <span className="text-xs font-semibold text-slate-50">
                  ₹ {formatNumber(corpus)}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-[11px]">
              <LegendItem
                color="bg-sky-400"
                label="You invest (principal)"
                value={`₹ ${formatNumber(amount)}`}
                percent={`${investedShare.toFixed(
                  0
                )}% of final value`}
              />
              <LegendItem
                color="bg-emerald-400"
                label="Growth / returns"
                value={`₹ ${formatNumber(growth)}`}
                percent={`${returnsShare.toFixed(
                  0
                )}% of final value`}
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            The blue portion is your initial capital. The green portion
            is what the market adds on top over the chosen time period.
          </p>
        </div>
      </div>

      {/* Scenario comparison */}
      <section className="space-y-3 rounded-xl bg-slate-950/60 p-4 ring-1 ring-slate-800">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-base font-medium text-slate-100">
            Scenario comparison
          </p>
          <p className="text-sm text-slate-400">
            See how the final value changes for slightly lower / higher
            returns.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {scenarios.map((s) => (
            <div
              key={s.label}
              className="space-y-1 rounded-lg bg-slate-950/80 p-3 ring-1 ring-slate-800"
            >
              <p className="text-sm font-semibold text-slate-50">
                {s.label}
              </p>
              <p className="text-xs text-slate-400">
                Return:{' '}
                <span className="font-medium text-sky-300">
                  {s.rate}% p.a.
                </span>
              </p>
              <p className="text-sm text-slate-300">
                Projected value:{' '}
                <span className="font-semibold text-emerald-300">
                  ₹ {formatNumber(s.corpus)}
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer actions */}
      {/* Footer guidance */}
      <section className="space-y-4 rounded-xl bg-slate-950/60 p-4 ring-1 ring-slate-800">
        {/* Disclaimer */}
        <p className="text-[11px] text-slate-400">
          This is an educational illustration, not a guarantee. Actual market returns
          fluctuate and may be higher or lower than shown here.
        </p>

        {/* Guidance */}
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-slate-200">
              When a lumpsum investment works well
            </p>
            <ul className="mt-1 list-disc pl-4 text-[11px] text-slate-400 space-y-0.5">
              <li>You have surplus capital and a long-term horizon</li>
              <li>You can stay invested through market ups and downs</li>
              <li>Your asset allocation matches your risk comfort</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-200">
              Things to keep in mind
            </p>
            <ul className="mt-1 list-disc pl-4 text-[11px] text-slate-400 space-y-0.5">
              <li>Markets can be volatile in the short term</li>
              <li>Large investments benefit from diversification</li>
              <li>Review your plan when goals or income change</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <p className="text-[11px] text-slate-400">
            Use this as a planning guide and revisit it periodically.
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center rounded-full border border-sky-500/70 bg-sky-500/10 px-3 py-1.5 text-[11px] font-medium text-sky-100 hover:bg-sky-500/20"
            >
              Share this result
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-100 hover:bg-emerald-500/20"
            >
              Download PDF
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

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
  accent: 'amber' | 'emerald' | 'sky';
  children: React.ReactNode;
}) {
  const accentRing =
    accent === 'amber'
      ? 'ring-amber-500/40'
      : accent === 'emerald'
      ? 'ring-emerald-500/40'
      : 'ring-sky-500/40';

  return (
    <div
      className={`space-y-2 rounded-xl bg-slate-950/60 p-3.5 ring-1 ${accentRing}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-100">
            {label}
          </p>
          <p className="text-xs text-slate-300">{hint}</p>
        </div>
        <p className="text-xs font-medium text-sky-200">
          {valueLabel}
        </p>
      </div>
      {children}
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
        <p className="text-sm font-medium text-slate-100">
          {label}
        </p>
        <p className="text-xs text-slate-300">{value}</p>
        <p className="text-[11px] text-slate-500">{percent}</p>
      </div>
    </div>
  );
}
