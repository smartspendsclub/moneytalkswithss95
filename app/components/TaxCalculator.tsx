'use client';

import React, { useMemo, useState } from 'react';

const NEW_REGIME_SLABS: { upTo: number | null; rate: number }[] = [
  { upTo: 400000, rate: 0 },
  { upTo: 800000, rate: 5 },
  { upTo: 1200000, rate: 10 },
  { upTo: 1600000, rate: 15 },
  { upTo: 2000000, rate: 20 },
  { upTo: 2400000, rate: 25 },
  { upTo: null, rate: 30 }, // above 24L
];

function formatNumber(num: number | undefined) {
  if (!num || Number.isNaN(num)) return '0';
  return num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function stripLeadingZeros(v: string) {
  if (!v) return '';
  return v.replace(/^0+(?=\d)/, '');
}

function calcNewRegimeTax(income: number) {
  let remaining = income;
  let tax = 0;
  let lastLimit = 0;

  for (const slab of NEW_REGIME_SLABS) {
    const upper = slab.upTo;
    if (upper === null) {
      const slabIncome = Math.max(0, remaining);
      tax += (slabIncome * slab.rate) / 100;
      break;
    } else {
      const slabIncome = Math.min(
        Math.max(0, upper - lastLimit),
        remaining
      );
      tax += (slabIncome * slab.rate) / 100;
      remaining -= slabIncome;
      lastLimit = upper;
      if (remaining <= 0) break;
    }
  }

  return tax;
}

export default function TaxCalculator() {
  const [grossIncome, setGrossIncome] = useState(1200000);
  const [deductions, setDeductions] = useState(0); // for old regime if you add later
  const [surchargeRate] = useState(0); // keep 0 for now; advanced users can edit code
  const [cessRate] = useState(4); // health & education cess %

  const taxableIncome = Math.max(grossIncome - deductions, 0);

  const { baseTax, cess, surcharge, totalTax, effectiveRate } =
    useMemo(() => {
      const baseTax = calcNewRegimeTax(taxableIncome);
      const surcharge = (baseTax * surchargeRate) / 100;
      const taxPlusSurcharge = baseTax + surcharge;
      const cess = (taxPlusSurcharge * cessRate) / 100;
      const totalTax = taxPlusSurcharge + cess;
      const effectiveRate =
        taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;

      return {
        baseTax,
        surcharge,
        cess,
        totalTax,
        effectiveRate,
      };
    }, [taxableIncome, surchargeRate, cessRate]);

  const incomeDisplay =
    grossIncome === 0 ? '' : String(grossIncome);
  const deductionDisplay =
    deductions === 0 ? '' : String(deductions);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 shadow-xl shadow-slate-900/30 md:mx-2 lg:mx-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 md:px-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-medium text-amber-100 ring-1 ring-amber-400/60">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
            Tax · India · New regime
          </div>
          <h2 className="text-lg font-semibold md:text-xl">
            Income Tax Estimator (New Regime)
          </h2>
          <p className="text-[11px] text-slate-300 md:text-xs">
            Quick view of estimated tax under the latest new-regime
            slab structure. Rounded, for education only.
          </p>
        </div>

        <div className="flex flex-col items-end text-right text-[11px] text-slate-300 md:text-xs">
          <span className="text-slate-400">Total estimated tax</span>
          <span className="text-base font-semibold text-emerald-300 md:text-lg">
            ₹ {formatNumber(totalTax)}
          </span>
          <span className="text-[11px] text-slate-400">
            Effective rate ~ {effectiveRate.toFixed(1)}% of taxable income
          </span>
        </div>
      </div>

      <div className="grid gap-6 border-t border-white/5 bg-slate-950/40 px-5 py-5 backdrop-blur md:grid-cols-[3fr,2.4fr] md:px-8 md:py-7">
        {/* Left – inputs */}
        <div className="space-y-4 rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/5 md:p-5">
          <ControlBlock
            label="Annual gross income"
            hint="Salary + bonus + other taxable income before deductions."
            valueLabel={`₹ ${formatNumber(grossIncome)}`}
          >
            <NumberInput
              value={grossIncome}
              onChange={setGrossIncome}
              display={incomeDisplay}
            />
          </ControlBlock>

          <ControlBlock
            label="Deductions (if any)"
            hint="EPF/PPF/ELSS etc. For new regime this is usually minimal."
            valueLabel={`₹ ${formatNumber(deductions)}`}
          >
            <NumberInput
              value={deductions}
              onChange={setDeductions}
              display={deductionDisplay}
            />
          </ControlBlock>

          <div className="rounded-xl bg-slate-950/60 p-3 text-[11px] text-slate-300">
            <p className="text-xs font-semibold text-amber-300">
              Note
            </p>
            <p className="mt-1 text-slate-300">
              This tool focuses on the new regime slabs only and
              ignores rebates, exemptions, special income (LTCG, STCG
              etc.) and surcharge variations. Always cross-check with a
              CA or official e-filing portal before filing.
            </p>
          </div>
        </div>

        {/* Right – breakdown */}
        <div className="space-y-4 rounded-2xl bg-slate-900/70 p-4 ring-1 ring-white/5 md:p-5">
          <div className="space-y-2 rounded-xl bg-slate-950/60 p-3 text-[11px]">
            <Row
              label="Taxable income"
              value={`₹ ${formatNumber(taxableIncome)}`}
            />
            <Row
              label="Income-tax as per slabs"
              value={`₹ ${formatNumber(baseTax)}`}
            />
            <Row
              label="Surcharge (approx.)"
              value={`₹ ${formatNumber(surcharge)}`}
            />
            <Row
              label={`Cess @ ${cessRate}%`}
              value={`₹ ${formatNumber(cess)}`}
            />
            <Row
              label="Total tax outgo"
              value={`₹ ${formatNumber(totalTax)}`}
              highlight
            />
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3 text-[11px] text-slate-300">
            <p className="text-xs font-semibold text-slate-100">
              Slab overview (new regime)
            </p>
            <ul className="mt-1 space-y-1 text-[11px] text-slate-400">
              {NEW_REGIME_SLABS.map((s, i) => {
                const lower = i === 0 ? 0 : NEW_REGIME_SLABS[i - 1].upTo!;
                const upper =
                  s.upTo === null
                    ? 'and above'
                    : `to ₹ ${formatNumber(s.upTo)}`;
                return (
                  <li key={i}>
                    • ₹ {formatNumber(lower)} {upper}: {s.rate}%{' '}
                    rate
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function NumberInput({
  value,
  onChange,
  display,
}: {
  value: number;
  onChange: (val: number) => void;
  display: string;
}) {
  return (
    <input
      type="number"
      className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-xs text-slate-50 outline-none ring-amber-500/30 focus:border-amber-400 focus:ring"
      value={display}
      onChange={(e) => {
        const cleaned = stripLeadingZeros(e.target.value);
        if (!cleaned) {
          onChange(0);
          return;
        }
        const num = parseInt(cleaned, 10);
        onChange(Number.isNaN(num) ? 0 : num);
      }}
    />
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
    <div className="space-y-2 rounded-xl bg-slate-950/40 p-3.5 ring-1 ring-amber-500/30">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-100">{label}</p>
          <p className="text-[11px] text-slate-400">{hint}</p>
        </div>
        <p className="text-[11px] font-medium text-amber-200">
          {valueLabel}
        </p>
      </div>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span
        className={
          highlight ? 'font-semibold text-emerald-300' : 'text-slate-300'
        }
      >
        {label}
      </span>
      <span
        className={
          highlight ? 'font-semibold text-emerald-300' : 'text-slate-200'
        }
      >
        {value}
      </span>
    </div>
  );
}
