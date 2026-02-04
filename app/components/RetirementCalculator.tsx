'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { downloadComponentPdf } from '@/lib/pdf-utils';
import RetirementPdfReport from '@/components/RetirementPdfReport';

/* ---------------- utils ---------------- */

function formatNumber(num: number | undefined) {
  if (num === undefined || Number.isNaN(num)) return '0';
  return num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function parseNumber(val: string) {
  const clean = val.replace(/[^0-9.]/g, '');
  if (clean === '') return 0;
  const n = Number(clean);
  return Number.isNaN(n) ? 0 : n;
}

/* ---------------- calculation ---------------- */

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

  if (Math.abs(realReturn) < 0.0001) {
    return expenseAtRetirement * 12 * n;
  }

  const annual = expenseAtRetirement * 12;
  return (annual * (1 - Math.pow(1 + realReturn, -n))) / realReturn;
}

/* -------- NEW: Required SIP calculation -------- */

function calculateRequiredSip(
  targetCorpus: number,
  years: number,
  expectedReturn: number
) {
  const n = years * 12;
  const rMonthly = expectedReturn / 12 / 100;

  if (n <= 0) return 0;

  if (rMonthly > 0) {
    return (
      targetCorpus /
      ((((1 + rMonthly) ** n - 1) / rMonthly) * (1 + rMonthly))
    );
  } else {
    return targetCorpus / n;
  }
}

type Scenario = {
  label: string;
  inflation: number;
  returnRate: number;
  corpus: number;
  note: string;
};

/* ---------------- component ---------------- */

export default function RetirementCalculator() {
  const router = useRouter();

  const [monthlyExpense, setMonthlyExpense] = useState(60000);
  const [yearsToRetirement, setYearsToRetirement] = useState(20);
  const [yearsAfterRetirement, setYearsAfterRetirement] = useState(25);
  const [inflation, setInflation] = useState(6);
  const [postReturn, setPostReturn] = useState(8);

  const [monthlyStr, setMonthlyStr] = useState('60000');
  const [yToStr, setYToStr] = useState('20');
  const [yAfterStr, setYAfterStr] = useState('25');
  const [inflStr, setInflStr] = useState('6');
  const [returnStr, setReturnStr] = useState('8');

  const { corpus, expenseAtRetirement, scenarios } = useMemo(() => {
    const baseCorpus = retirementCorpus(
      monthlyExpense,
      yearsToRetirement,
      yearsAfterRetirement,
      inflation,
      postReturn
    );

    const expenseAtRet =
      monthlyExpense * Math.pow(1 + inflation / 100, yearsToRetirement);

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
        note:
          'Higher inflation and lower returns. Useful if markets underperform or expenses rise faster than expected.',
      },
      {
        label: 'Base case',
        inflation,
        returnRate: postReturn,
        corpus: baseCorpus,
        note:
          'Balanced assumptions based on long-term averages. Most realistic planning estimate.',
      },
      {
        label: 'Optimistic',
        inflation: Math.max(0, inflation - 1),
        returnRate: postReturn + 1,
        corpus: retirementCorpus(
          monthlyExpense,
          yearsToRetirement,
          yearsAfterRetirement,
          Math.max(0, inflation - 1),
          postReturn + 1
        ),
        note:
          'Lower inflation and better portfolio returns. Represents a favourable environment.',
      },
    ];

    return {
      corpus: baseCorpus,
      expenseAtRetirement: expenseAtRet,
      scenarios: sc,
    };
  }, [
    monthlyExpense,
    yearsToRetirement,
    yearsAfterRetirement,
    inflation,
    postReturn,
  ]);

  /* ---------------- navigation ---------------- */

  const goToSIP = () => {
  router.push(
    `/sip-calculator?target=${corpus}&years=${yearsToRetirement}&return=${postReturn}`
    );
  };

  const goToGoalPlanner = () => {
      router.push(
      `/goal-planner?goalType=retirement&goal=Retirement&target=${corpus}&years=${yearsToRetirement}&return=${postReturn}`
    );
  };



  const handleDownloadPdf = async () => {
    await downloadComponentPdf(
      RetirementPdfReport,
      {
        monthlyExpense,
        yearsToRetirement,
        yearsAfterRetirement,
        inflation,
        postReturn,
        corpus,
        scenarios,
      },
      'Retirement_plan.pdf'
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="mx-auto max-w-6xl space-y-8 rounded-3xl bg-linear-to-b from-slate-950/80 to-slate-900/70 p-8 shadow-2xl shadow-sky-900/20 ring-1 ring-slate-800 backdrop-blur-xl">
      
      {/* HEADER */}
      <header className="space-y-4 border-b border-slate-800 pb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-sky-400/80">
          Retirement · Corpus Planning
        </p>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
              Retirement Corpus Planner
            </h1>
            <p className="mt-2 text-base text-slate-400 max-w-xl">
              Estimate the lump sum required to sustain your lifestyle in
              retirement, adjusted for inflation and portfolio returns.
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-400/80">
              Target Corpus
            </p>
            <p className="mt-1 text-2xl font-semibold text-sky-300">
              ₹ {formatNumber(corpus)}
            </p>
            <p className="text-xs text-slate-500">
              In {yearsToRetirement} years (approx.)
            </p>
          </div>
        </div>
      </header>

      {/* GRID */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">

        {/* LEFT INPUTS */}
        <div className="space-y-5">
          <ControlBlock 
          label="Monthly expenses today"
          value={`₹ ${formatNumber(monthlyExpense)}`}
          >
            <RangeWithInput
              value={monthlyExpense}
              display={monthlyStr}
              setDisplay={setMonthlyStr}
              onChange={setMonthlyExpense}
              min={1000}
              max={300000}
            />
          </ControlBlock>

          <ControlBlock 
          label="Years until retirement"
          value={`${yearsToRetirement} years`}
          >
            <RangeWithInput
              value={yearsToRetirement}
              display={yToStr}
              setDisplay={setYToStr}
              onChange={setYearsToRetirement}
              min={1}
              max={60}
            />
          </ControlBlock>

          <ControlBlock 
          label="Years in retirement"
          value={`${yearsAfterRetirement} years`}
          >
            <RangeWithInput
              value={yearsAfterRetirement}
              display={yAfterStr}
              setDisplay={setYAfterStr}
              onChange={setYearsAfterRetirement}
              min={5}
              max={50}
            />
          </ControlBlock>

          <ControlBlock 
          label="Inflation rate (%)"
          value={`${inflation}%`}
          >
            <RangeWithInput
              value={inflation}
              display={inflStr}
              setDisplay={setInflStr}
              onChange={setInflation}
              min={3}
              max={10}
              step={0.5}
            />
          </ControlBlock>

          <ControlBlock 
          label="Return during retirement (%)"
          value={`${postReturn}%`}
          >
            <RangeWithInput
              value={postReturn}
              display={returnStr}
              setDisplay={setReturnStr}
              onChange={setPostReturn}
              min={4}
              max={12}
              step={0.5}
            />
          </ControlBlock>
        </div>

        {/* RIGHT PANEL */}
        <div className="rounded-2xl bg-linear-to-br from-slate-950/80 to-slate-900/70 p-6 ring-1 ring-slate-800 shadow-lg space-y-6">

          <div>
            <h3 className="text-lg font-semibold text-slate-50 mb-4">
              What this corpus means for you
            </h3>

            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Monthly expense today: ₹ {formatNumber(monthlyExpense)}</li>
              <li>
                • Estimated monthly expense at retirement:{' '}
                <span className="text-sky-300 font-medium">
                  ₹ {formatNumber(expenseAtRetirement)}
                </span>
              </li>
              <li>• Years until retirement: {yearsToRetirement}</li>
              <li>• Years in retirement: {yearsAfterRetirement}</li>
              <li>• Inflation assumed: {inflation}%</li>
              <li>• Expected post-retirement return: {postReturn}%</li>
            </ul>
          </div>

          <div className="border-t border-slate-800 pt-6 space-y-4">
            <h4 className="text-base font-semibold text-slate-100">
              How to reach this corpus
            </h4>

            <p className="text-sm text-slate-400">
              Build ₹ {formatNumber(corpus)} in the next {yearsToRetirement} years
              using disciplined investing.
            </p>

            <button
              onClick={goToSIP}
              className="w-full rounded-full border border-sky-500/60 px-4 py-2 text-sm text-sky-200 hover:bg-sky-500/10"
            >
              Calculate Monthly SIP
            </button>
          </div>
        </div>
      </div>

      {/* SCENARIOS */}
      <section className="rounded-2xl bg-linear-to-br from-slate-950/80 to-slate-900/60 p-6 ring-1 ring-slate-800 shadow-lg">
        <div className="flex justify-between mb-6">
          <p className="text-base font-semibold text-slate-100">
            Scenario Comparison
          </p>
          <p className="text-xs text-slate-400">
            Impact of inflation & returns
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {scenarios.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-linear-to-br from-slate-950/80 to-slate-900/60 p-5 ring-1 ring-slate-800 shadow-lg hover:scale-[1.02] transition-all"
            >
              <p className="text-base font-medium text-slate-100">
                {s.label}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Inflation {s.inflation}% · Return {s.returnRate}%
              </p>
              <p className="mt-3 text-xl font-semibold text-sky-300">
                ₹ {formatNumber(s.corpus)}
              </p>
              <p className="mt-3 text-xs text-slate-400">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <section className="flex justify-between items-center rounded-2xl bg-linear-to-r from-slate-950/80 to-slate-900/70 p-5 ring-1 ring-slate-800">
        <p className="text-xs text-slate-400">
          Review this plan periodically as income and goals evolve.
        </p>
        <button
          onClick={handleDownloadPdf}
          className="rounded-full border border-sky-500/60 px-5 py-2 text-sm text-sky-200 hover:bg-sky-500/10"
        >
          Download PDF
        </button>
      </section>
    </div>
  );
}

/* ---------------- reusable ---------------- */

function ControlBlock({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-linear-to-br from-slate-950/70 to-slate-900/60 p-5 ring-1 ring-slate-800 shadow-inner">
      
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-slate-100">
          {label}
        </p>

        {value && (
          <span className="text-sm font-semibold text-sky-300">
            {value}
          </span>
        )}
      </div>

      {children}
    </div>
  );
}


type RangeWithInputProps = {
  value: number;
  display: string;
  setDisplay: (v: string) => void;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
};

function RangeWithInput({
  value,
  display,
  setDisplay,
  onChange,
  min,
  max,
  step = 1,
}: RangeWithInputProps) {
  const handleBlur = () => {
    const n = parseNumber(display);
    const clamped = Math.max(min, Math.min(max, n));
    setDisplay(String(clamped));
    onChange(clamped);
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          setDisplay(String(v));
          onChange(v);
        }}
        className="w-full cursor-pointer accent-sky-400"
      />
      <input
        type="text"
        value={display}
        onBlur={handleBlur}
        onChange={(e) => {
          setDisplay(e.target.value);
          onChange(parseNumber(e.target.value));
        }}
        className="w-24 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none focus:border-sky-500"
      />
    </div>
  );
}
