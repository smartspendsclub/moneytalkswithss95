'use client';

import React, { useMemo, useState } from 'react';

// ======================================================
// Helpers
// ======================================================

function formatNumber(num: number | undefined) {
  if (num === undefined || num === null || Number.isNaN(num)) return '0';
  return num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function stripLeadingZeros(v: string) {
  if (!v) return '';
  return v.replace(/^0+(?=\d)/, '');
}

/**
 * FIRE simulation
 */
function simulateFire(
  monthlyExpenses: number,
  currentCorpus: number,
  monthlyInvest: number,
  returnRate: number,
  withdrawalRate: number
) {
  const annualExpenses = monthlyExpenses * 12;
  const targetCorpus =
    withdrawalRate > 0
      ? (annualExpenses * 100) / withdrawalRate
      : Infinity;

  const rMonthly = returnRate / 12 / 100;

  let corpus = currentCorpus;
  let months = 0;
  const maxMonths = 60 * 12; // 60 years safety cap

  while (corpus < targetCorpus && months < maxMonths) {
    corpus = corpus * (1 + rMonthly) + monthlyInvest;
    months++;
  }

  return {
    targetCorpus,
    yearsToFire: corpus >= targetCorpus ? months / 12 : Infinity,
  };
}

// ======================================================
// Main Component
// ======================================================

export default function FireCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState(60000);
  const [currentCorpus, setCurrentCorpus] = useState(1500000);
  const [monthlyInvest, setMonthlyInvest] = useState(40000);
  const [returnRate, setReturnRate] = useState(11);
  const [withdrawalRate, setWithdrawalRate] = useState(4);

  const sim = useMemo(
    () =>
      simulateFire(
        monthlyExpenses,
        currentCorpus,
        monthlyInvest,
        returnRate,
        withdrawalRate
      ),
    [
      monthlyExpenses,
      currentCorpus,
      monthlyInvest,
      returnRate,
      withdrawalRate,
    ]
  );

  const annualExpenses = monthlyExpenses * 12;
  const fireMultiple =
    withdrawalRate > 0 ? Math.round(100 / withdrawalRate) : 0;

  const fireProgress =
    sim.targetCorpus > 0
      ? Math.min((currentCorpus / sim.targetCorpus) * 100, 100)
      : 0;

  const reached =
    sim.yearsToFire !== Infinity && !Number.isNaN(sim.yearsToFire);
  // FIRE tiers
  const leanExpenses = monthlyExpenses * 0.7;
  const fatExpenses = monthlyExpenses * 2;

  const leanSim = simulateFire(
    leanExpenses,
    currentCorpus,
    monthlyInvest,
    returnRate,
    withdrawalRate
  );

  const fatSim = simulateFire(
    fatExpenses,
    currentCorpus,
    monthlyInvest,
    returnRate,
    withdrawalRate
  );

  // ======================================================
// FIRE Acceleration Insights
// ======================================================

const baseYears = sim.yearsToFire;

// 10% more investment
const investBoostAmount = monthlyInvest * 0.1;
const investBoostSim = simulateFire(
  monthlyExpenses,
  currentCorpus,
  monthlyInvest * 1.1,
  returnRate,
  withdrawalRate
);

const investYearsFaster =
  baseYears !== Infinity && investBoostSim.yearsToFire !== Infinity
    ? baseYears - investBoostSim.yearsToFire
    : 0;

// 10% expense reduction
const reducedExpenseSim = simulateFire(
  monthlyExpenses * 0.9,
  currentCorpus,
  monthlyInvest,
  returnRate,
  withdrawalRate
);

const expenseYearsFaster =
  baseYears !== Infinity && reducedExpenseSim.yearsToFire !== Infinity
    ? baseYears - reducedExpenseSim.yearsToFire
    : 0;

// Show only if meaningful
const showAcceleration =
  baseYears > 5 &&
  (investYearsFaster > 0.3 || expenseYearsFaster > 0.3);



  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 text-base shadow-xl shadow-slate-900/30 md:mx-2 lg:mx-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 md:px-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/15 px-3 py-1 text-[11px] font-medium text-purple-100 ring-1 ring-purple-400/60">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-purple-400" />
            FIRE · Financial independence
          </div>
          <h2 className="text-lg font-semibold md:text-xl">
            Fire Calculator
          </h2>
          <p className="text-[11px] text-slate-300 md:text-xs">
            Estimate how long it may take to achieve financial independence
            based on your lifestyle, savings and expected returns.
          </p>
        </div>

        <div className="flex flex-col items-end text-right text-[11px] text-slate-300 md:text-xs">
          <span className="text-slate-400">Target FIRE corpus</span>
          <span className="text-base font-semibold text-emerald-300 md:text-lg">
            ₹ {formatNumber(sim.targetCorpus)}
          </span>
          <span className="text-[11px] text-slate-400">
            Based on ₹ {formatNumber(monthlyExpenses)} / month &{' '}
            {withdrawalRate}% rule
          </span>
        </div>
      </div>

      <div className="grid gap-6 border-t border-white/5 bg-slate-950/40 px-5 py-5 backdrop-blur md:grid-cols-[3fr,2.4fr] md:px-8 md:py-7">
        {/* Inputs */}
        <div className="space-y-4 rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/5 md:p-5">
          <Control
            label="Monthly expenses"
            value={monthlyExpenses}
            onChange={setMonthlyExpenses}
          />
          <Control
            label="Current investment corpus"
            value={currentCorpus}
            onChange={setCurrentCorpus}
          />
          <Control
            label="Monthly investing capacity"
            value={monthlyInvest}
            onChange={setMonthlyInvest}
          />

          <div className="grid gap-3 md:grid-cols-2">
            <Control
              label="Expected return (p.a.)"
              value={returnRate}
              onChange={setReturnRate}
              isPercent
            />
            <Control
              label="Withdrawal rate"
              value={withdrawalRate}
              onChange={setWithdrawalRate}
              isPercent
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4 rounded-2xl bg-slate-900/70 p-4 ring-1 ring-white/5 md:p-5">
          <p className="text-sm font-semibold text-purple-300">
            FIRE Milestones
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Lean FIRE */}
            <MilestoneCard
              title="Lean FIRE"
              subtitle="Essentials covered"
              years={leanSim.yearsToFire}
              target={leanSim.targetCorpus}
            />

            {/* Standard FIRE */}
            <MilestoneCard
              title="Standard FIRE"
              subtitle="Current lifestyle"
              years={sim.yearsToFire}
              target={sim.targetCorpus}
              highlight
            />

            {/* Fat FIRE */}
            <MilestoneCard
              title="Fat FIRE"
              subtitle="Luxury freedom"
              years={fatSim.yearsToFire}
              target={fatSim.targetCorpus}
            />
          </div>

          <Result
            label="Annual expenses"
            value={`₹ ${formatNumber(annualExpenses)}`}
          />

          {/* How to reach FIRE faster */}
          {showAcceleration && (
            <div className="space-y-3 rounded-xl bg-purple-500/10 p-4 ring-1 ring-purple-400/30">
              <p className="text-sm font-semibold text-purple-300">
                How to reach FIRE faster
              </p>

              <div className="space-y-1 text-sm text-slate-300">
                {investYearsFaster > 0.3 && (
                  <p>
                    • Invest ₹ {formatNumber(investBoostAmount)} more/month →{" "}
                    <span className="font-semibold text-purple-200">
                      {investYearsFaster.toFixed(1)} years faster
                    </span>
                  </p>
                )}

                {expenseYearsFaster > 0.3 && (
                  <p>
                    • Reduce expenses by 10% →{" "}
                    <span className="font-semibold text-purple-200">
                      {expenseYearsFaster.toFixed(1)} years faster
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}


          {/* FIRE Explanation */}
          <div className="space-y-3 rounded-xl bg-slate-950/60 p-4">
            <p className="text-xs font-semibold text-purple-300">
              Your FIRE number explained
            </p>
            <p className="text-[11px] text-slate-400">
              <span className="font-semibold text-purple-200">Lean FIRE</span> focuses on covering essential living costs with minimal lifestyle upgrades.
              <br />
              <span className="font-semibold text-purple-200">Standard FIRE</span> maintains your current lifestyle comfortably.
              <br />
              <span className="font-semibold text-purple-200">Fat FIRE</span> allows luxury, flexibility, and higher discretionary spending.
            </p>

            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              At a {withdrawalRate}% withdrawal rate, your portfolio typically needs to be about{' '}
              <span className="font-semibold text-slate-100">{fireMultiple}×</span> your annual expenses.
            </p>


            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Progress to FIRE</span>
                <span className="font-medium text-purple-200">
                  {fireProgress.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-purple-400 to-emerald-400"
                  style={{ width: `${fireProgress}%` }}
                />
              </div>
              <p className="text-sm text-slate-400">
                ₹ {formatNumber(currentCorpus)} of ₹{' '}
                {formatNumber(sim.targetCorpus)}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3 text-[11px] text-slate-400">
            This is a simplified illustration. Inflation, taxes, and real-world
            risks are not included. Use this as a planning compass, not a
            guarantee.
          </div>
        </div>
      </div>
    </section>
  );
}

// ======================================================
// Small Components
// ======================================================

function Control({
  label,
  value,
  onChange,
  isPercent,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  isPercent?: boolean;
}) {
  return (
    <div className="space-y-1 rounded-xl bg-slate-950/40 p-3 ring-1 ring-purple-500/30">
      <div className="flex justify-between text-sm text-slate-300">
        <span>{label}</span>
        <span className="text-purple-200">
          {isPercent ? `${value}%` : `₹ ${formatNumber(value)}`}
        </span>
      </div>
      <input
        type="number"
        value={value === 0 ? '' : value}
        onChange={(e) =>
          onChange(
            Number(
              stripLeadingZeros(e.target.value)
            ) || 0
          )
        }
        className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-xs text-slate-50 outline-none focus:border-purple-400"
      />
    </div>
  );
}

function Result({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-3 ${
        highlight
          ? 'border-purple-400 bg-purple-500/15 text-purple-50'
          : 'border-slate-700 bg-slate-950/40 text-slate-100'
      }`}
    >
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  );
}

function MilestoneCard({
  title,
  subtitle,
  years,
  target,
  highlight,
}: {
  title: string;
  subtitle: string;
  years: number;
  target: number;
  highlight?: boolean;
}) {
  const reached =
    years !== Infinity && !Number.isNaN(years);

  return (
    <div
      className={`rounded-2xl p-4 ring-1 ${
        highlight
          ? 'bg-purple-500/15 ring-purple-400/40'
          : 'bg-slate-950/60 ring-white/5'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-base font-semibold text-slate-100">
            {title}
          </p>
          <p className="text-sm text-slate-400">
            {subtitle}
          </p>
        </div>

        <div className="text-right">
          <p className="text-base font-semibold text-slate-100">
            {reached
              ? `${years.toFixed(1)} yrs`
              : 'Not reached'}
          </p>
          <p className="text-sm text-slate-400">
            ₹ {formatNumber(target)}
          </p>
        </div>
      </div>
    </div>
  );
}
