// app/components/RetirementCalculator.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { downloadComponentPdf } from '@/lib/pdf-utils';
import RetirementPdfReport from '@/components/RetirementPdfReport';

function formatNumber(num: number | undefined) {
  if (!num || Number.isNaN(num)) return '0';
  return num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function stripLeadingZeros(value: string) {
  if (!value) return '';
  return value.replace(/^0+(?=\d)/, '');
}

// very simplified retirement corpus estimate
function retirementCorpus(
  monthlyExpenseToday: number,
  yearsToRetirement: number,
  yearsAfterRetirement: number,
  inflation: number,
  postReturn: number
) {
  const infl = inflation / 100;
  const r = postReturn / 100;

  const expenseAtRetirement =
    monthlyExpenseToday * Math.pow(1 + infl, yearsToRetirement);

  const realReturn = (1 + r) / (1 + infl) - 1;
  const n = yearsAfterRetirement;

  if (realReturn <= 0) {
    return expenseAtRetirement * 12 * n;
  }

  const annual = expenseAtRetirement * 12;
  return (annual * (1 - Math.pow(1 + realReturn, -n))) / realReturn;
}

type Scenario = {
  label: string;
  inflation: number;
  returnRate: number;
  corpus: number;
};

export default function RetirementCalculator() {
  const [monthlyExpense, setMonthlyExpense] = useState(60000);
  const [yearsToRetirement, setYearsToRetirement] = useState(20);
  const [yearsAfterRetirement, setYearsAfterRetirement] = useState(25);
  const [inflation, setInflation] = useState(6);
  const [postReturn, setPostReturn] = useState(8);

  const { corpus, scenarios } = useMemo(() => {
    const baseCorpus = retirementCorpus(
      monthlyExpense,
      yearsToRetirement,
      yearsAfterRetirement,
      inflation,
      postReturn
    );

    const sc: Scenario[] = [
      {
        label: 'Conservative',
        inflation: inflation + 1,
        returnRate: postReturn - 1,
        corpus: retirementCorpus(
          monthlyExpense,
          yearsToRetirement,
          yearsAfterRetirement,
          inflation + 1,
          postReturn - 1
        ),
      },
      {
        label: 'Base case',
        inflation,
        returnRate: postReturn,
        corpus: baseCorpus,
      },
      {
        label: 'Optimistic',
        inflation: inflation - 1,
        returnRate: postReturn + 1,
        corpus: retirementCorpus(
          monthlyExpense,
          yearsToRetirement,
          yearsAfterRetirement,
          inflation - 1,
          postReturn + 1
        ),
      },
    ];

    return { corpus: baseCorpus, scenarios: sc };
  }, [
    monthlyExpense,
    yearsToRetirement,
    yearsAfterRetirement,
    inflation,
    postReturn,
  ]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert(
        'Link copied. You can paste and share this retirement plan.'
      );
    } catch {
      alert(
        'Unable to copy the link. You can share this page URL manually.'
      );
    }
  };

  const handleDownloadPdf = async () => {
    // Use Component + props + filename (same pattern as SIP & Lumpsum)
    await downloadComponentPdf(
      RetirementPdfReport,
      {
        monthlyExpense,
        yearsToRetirement,
        yearsAfterRetirement,
        inflation,
        postReturn,
        corpus,
        scenarios: scenarios.map((s) => ({
          label: s.label,
          inflation: s.inflation,
          returnRate: s.returnRate,
          corpus: s.corpus,
        })),
      },
      'Retirement_plan.pdf'
    );
  };

  const monthlyDisplay =
    monthlyExpense === 0 ? '' : String(monthlyExpense);
  const yToDisplay =
    yearsToRetirement === 0 ? '' : String(yearsToRetirement);
  const yAfterDisplay =
    yearsAfterRetirement === 0 ? '' : String(yearsAfterRetirement);
  const inflDisplay = inflation === 0 ? '' : String(inflation);
  const returnDisplay = postReturn === 0 ? '' : String(postReturn);

  return (
    <div
      id="retirement-tool-root"
      className="mx-auto max-w-6xl space-y-6 rounded-2xl bg-slate-950/60 p-5 shadow-2xl shadow-sky-500/20 ring-1 ring-slate-800"
    >
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.15em] text-sky-400">
          Retirement · Corpus planning
        </p>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold text-slate-50">
              Retirement Corpus Planner
            </h1>
            <p className="text-xs text-slate-400">
              Estimate the lump sum you may need at retirement to
              support your desired lifestyle.
            </p>
          </div>
          <div className="text-right text-xs text-emerald-300">
            <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-400">
              Target corpus at retirement
            </p>
            <p className="text-lg font-semibold text-emerald-300">
              ₹ {formatNumber(corpus)}
            </p>
            <p className="text-[11px] text-slate-400">
              At age in {yearsToRetirement} years (approx).
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Inputs */}
        <div className="space-y-4">
          <ControlBlock
            label="Monthly expenses today"
            hint="All essential expenses for your household in today’s terms."
            valueLabel={`₹ ${formatNumber(monthlyExpense)}`}
            accent="sky"
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={20000}
                max={300000}
                step={5000}
                value={monthlyExpense}
                onChange={(e) =>
                  setMonthlyExpense(
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
                  value={monthlyDisplay}
                  onChange={(e) => {
                    const cleaned = stripLeadingZeros(
                      e.target.value
                    );
                    if (cleaned === '') {
                      setMonthlyExpense(0);
                      return;
                    }
                    const val = parseInt(cleaned, 10);
                    setMonthlyExpense(
                      Number.isNaN(val) ? 0 : val
                    );
                  }}
                />
              </div>
            </div>
          </ControlBlock>

          <ControlBlock
            label="Years until retirement"
            hint="Roughly how many years you have to prepare."
            valueLabel={`${yearsToRetirement} years`}
            accent="emerald"
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={40}
                value={yearsToRetirement}
                onChange={(e) =>
                  setYearsToRetirement(
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
                value={yToDisplay}
                onChange={(e) => {
                  const cleaned = stripLeadingZeros(
                    e.target.value
                  );
                  if (cleaned === '') {
                    setYearsToRetirement(0);
                    return;
                  }
                  const v = parseInt(cleaned, 10);
                  setYearsToRetirement(
                    Number.isNaN(v) ? 0 : v
                  );
                }}
              />
            </div>
          </ControlBlock>

          <ControlBlock
            label="Years in retirement (life after)"
            hint="How long you want your money to last after retirement."
            valueLabel={`${yearsAfterRetirement} years`}
            accent="emerald"
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={10}
                max={40}
                value={yearsAfterRetirement}
                onChange={(e) =>
                  setYearsAfterRetirement(
                    parseInt(e.target.value || '0') || 0
                  )
                }
                className="h-1.5 w-full cursor-pointer rounded-full bg-slate-700 accent-emerald-400"
              />
              <input
                type="number"
                min={5}
                max={50}
                className="w-20 rounded-md border border-slate-600 bg-slate-900 px-3 py-1 text-xs text-slate-50 outline-none focus:border-emerald-400"
                value={yAfterDisplay}
                onChange={(e) => {
                  const cleaned = stripLeadingZeros(
                    e.target.value
                  );
                  if (cleaned === '') {
                    setYearsAfterRetirement(0);
                    return;
                  }
                  const v = parseInt(cleaned, 10);
                  setYearsAfterRetirement(
                    Number.isNaN(v) ? 0 : v
                  );
                }}
              />
            </div>
          </ControlBlock>

          <ControlBlock
            label="Inflation (per year)"
            hint="How fast you expect expenses to grow."
            valueLabel={`${inflation}%`}
            accent="amber"
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={3}
                max={10}
                step={0.5}
                value={inflation}
                onChange={(e) =>
                  setInflation(
                    parseFloat(e.target.value || '0') || 0
                  )
                }
                className="h-1.5 w-full cursor-pointer rounded-full bg-slate-700 accent-amber-400"
              />
              <input
                type="number"
                min={1}
                max={15}
                step={0.5}
                className="w-20 rounded-md border border-slate-600 bg-slate-900 px-3 py-1 text-xs text-slate-50 outline-none focus:border-amber-400"
                value={inflDisplay}
                onChange={(e) => {
                  const cleaned = stripLeadingZeros(
                    e.target.value
                  );
                  if (cleaned === '') {
                    setInflation(0);
                    return;
                  }
                  const v = parseFloat(cleaned);
                  setInflation(
                    Number.isNaN(v) ? inflation : v
                  );
                }}
              />
            </div>
          </ControlBlock>

          <ControlBlock
            label="Return during retirement"
            hint="Net return from your retirement portfolio after expenses."
            valueLabel={`${postReturn}% p.a.`}
            accent="amber"
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={4}
                max={12}
                step={0.5}
                value={postReturn}
                onChange={(e) =>
                  setPostReturn(
                    parseFloat(e.target.value || '0') || 0
                  )
                }
                className="h-1.5 w-full cursor-pointer rounded-full bg-slate-700 accent-amber-400"
              />
              <input
                type="number"
                min={1}
                max={20}
                step={0.5}
                className="w-20 rounded-md border border-slate-600 bg-slate-900 px-3 py-1 text-xs text-slate-50 outline-none focus:border-amber-400"
                value={returnDisplay}
                onChange={(e) => {
                  const cleaned = stripLeadingZeros(
                    e.target.value
                  );
                  if (cleaned === '') {
                    setPostReturn(0);
                    return;
                  }
                  const v = parseFloat(cleaned);
                  setPostReturn(
                    Number.isNaN(v) ? postReturn : v
                  );
                }}
              />
            </div>
          </ControlBlock>
        </div>

        {/* Explanation panel */}
        <div className="space-y-3 rounded-xl bg-slate-950/60 p-4 ring-1 ring-slate-800">
          <p className="text-xs font-medium text-slate-100">
            What this corpus represents
          </p>
          <p className="text-[11px] text-slate-300">
            This is an estimate of the amount you would need at
            retirement so that, with the chosen inflation and return
            assumptions, you can draw an inflation-linked income for{' '}
            <span className="font-medium text-slate-50">
              {yearsAfterRetirement} years
            </span>{' '}
            after you stop working.
          </p>
          <p className="text-[11px] text-slate-400">
            It is not a perfect number, but a starting point for
            planning your investments and checking if you&apos;re
            broadly on track.
          </p>
        </div>
      </div>

      {/* Scenario comparison */}
      <section className="space-y-3 rounded-xl bg-slate-950/60 p-4 ring-1 ring-slate-800">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs font-medium text-slate-100">
            Scenario comparison
          </p>
          <p className="text-[10px] text-slate-400">
            See how your target corpus changes with slightly different
            inflation and returns.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {scenarios.map((s) => (
            <div
              key={s.label}
              className="space-y-1 rounded-lg bg-slate-950/80 p-3 ring-1 ring-slate-800"
            >
              <p className="text-[11px] font-semibold text-slate-50">
                {s.label}
              </p>
              <p className="text-[10px] text-slate-400">
                Inflation:{' '}
                <span className="font-medium text-sky-300">
                  {s.inflation}% p.a.
                </span>
              </p>
              <p className="text-[10px] text-slate-400">
                Return:{' '}
                <span className="font-medium text-emerald-300">
                  {s.returnRate}% p.a.
                </span>
              </p>
              <p className="text-[11px] text-slate-300">
                Target corpus:{' '}
                <span className="font-semibold text-emerald-300">
                  ₹ {formatNumber(s.corpus)}
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer actions */}
      <section className="space-y-4 rounded-xl bg-slate-950/60 p-4 ring-1 ring-slate-800">
        <p className="text-[11px] text-slate-400">
          This is an educational projection, not a guarantee. Real-life
          inflation, returns and spending can be higher or lower.
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[10px] text-slate-500">
            Revisit this plan once a year or when a major life event
            occurs. Adjust the inputs as your income, expenses and
            responsibilities change.
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
          <p className="text-xs font-medium text-slate-100">
            {label}
          </p>
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
