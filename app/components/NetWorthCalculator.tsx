'use client';

import React, { useMemo, useState } from 'react';

// ---------- helpers ----------

function formatNumber(num: number | undefined) {
  if (num === undefined || num === null || Number.isNaN(num)) return '0';
  return num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function stripLeadingZeros(value: string) {
  if (!value) return '';
  return value.replace(/^0+(?=\d)/, '');
}

type NetWorthRowProps = {
  label: string;
  hint: string;
  value: number;
  onChange: (next: number) => void;
};

function NetWorthRow({ label, hint, value, onChange }: NetWorthRowProps) {
  const display = value > 0 ? `₹ ${formatNumber(value)}` : '—';

  return (
    <div className="space-y-1 rounded-xl bg-slate-950/50 p-2.5 ring-1 ring-slate-800 transition-all hover:ring-slate-700">
      <div className="flex items-center justify-between gap-2.5">
        <div>
          {/* FONT INCREASE: text-xs -> text-sm */}
          <p className="text-sm font-semibold text-slate-100">{label}</p>
          <p className="text-[11px] text-slate-400">{hint}</p>
        </div>
        {/* FONT INCREASE: text-[11px] -> text-sm */}
        <p className="text-sm font-bold text-emerald-300">{display}</p>
      </div>
      <input
        type="number"
        className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-50 outline-none focus:border-emerald-400 transition-colors"
        value={value === 0 ? '' : String(value)}
        onChange={(e) => {
          const cleaned = stripLeadingZeros(e.target.value);
          if (!cleaned) {
            onChange(0);
            return;
          }
          const num = Number(cleaned);
          onChange(Number.isNaN(num) ? 0 : num);
        }}
      />
    </div>
  );
}

type MixRowProps = {
  label: string;
  value: number;
  share: number;
};

function MixRow({ label, value, share }: MixRowProps) {
  return (
    <div className="space-y-1 text-[11px]">
      <div className="flex items-center justify-between">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-200">
          ₹ {formatNumber(value)}{' '}
          <span className="text-slate-500">· {share.toFixed(0)}%</span>
        </span>
      </div>
      <div className="h-1 rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-400"
          style={{ width: `${Math.min(100, Math.max(0, share))}%` }}
        />
      </div>
    </div>
  );
}

// ---------- main component ----------

export default function NetWorthCalculator() {
  // assets
  const [cash, setCash] = useState(150000);
  const [investments, setInvestments] = useState(800000);
  const [propertyGold, setPropertyGold] = useState(3000000);
  const [otherAssets, setOtherAssets] = useState(100000);
  const [customAsset, setCustomAsset] = useState(0);

  // liabilities
  const [homeLoan, setHomeLoan] = useState(1500000);
  const [carLoan, setCarLoan] = useState(300000);
  const [personalLoans, setPersonalLoans] = useState(50000);
  const [creditCards, setCreditCards] = useState(25000);
  const [otherLiabilities, setOtherLiabilities] = useState(0);

  const {
    totalAssets,
    totalLiabilities,
    netWorth,
    assetMix,
  } = useMemo(() => {
    const assetValues = { cash, investments, propertyGold, otherAssets, customAsset };
    const liabilityValues = { homeLoan, carLoan, personalLoans, creditCards, otherLiabilities };

    const totalAssets = Object.values(assetValues).reduce((sum, v) => sum + (Number.isFinite(v) ? v : 0), 0);
    const totalLiabilities = Object.values(liabilityValues).reduce((sum, v) => sum + (Number.isFinite(v) ? v : 0), 0);
    const netWorth = totalAssets - totalLiabilities;

    const mix = totalAssets > 0
        ? {
            cash: { value: cash, share: (cash / totalAssets) * 100 },
            investments: { value: investments, share: (investments / totalAssets) * 100 },
            propertyGold: { value: propertyGold, share: (propertyGold / totalAssets) * 100 },
            otherAssets: { value: otherAssets, share: (otherAssets / totalAssets) * 100 },
            customAsset: { value: customAsset, share: (customAsset / totalAssets) * 100 },
          }
        : {
            cash: { value: cash, share: 0 },
            investments: { value: investments, share: 0 },
            propertyGold: { value: propertyGold, share: 0 },
            otherAssets: { value: otherAssets, share: 0 },
            customAsset: { value: customAsset, share: 0 },
          };

    return { totalAssets, totalLiabilities, netWorth, assetMix: mix };
  }, [cash, investments, propertyGold, otherAssets, customAsset, homeLoan, carLoan, personalLoans, creditCards, otherLiabilities]);

  const netWorthPositive = netWorth >= 0;

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 shadow-xl shadow-slate-950/60">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 px-5 py-4 md:px-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-medium text-emerald-100 ring-1 ring-emerald-400/60">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Net worth · Calculator
          </div>
          <h2 className="text-xl font-bold md:text-2xl">
            Net Worth Overview
          </h2>
          <p className="text-xs text-slate-400">
            Add up what you own and what you owe to see a clean net worth picture.
          </p>
        </div>

        <div className="space-y-1 text-right">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-bold">
            Net worth today
          </p>
          <p className={`text-2xl font-bold ${netWorthPositive ? 'text-emerald-300' : 'text-rose-300'}`}>
            ₹ {formatNumber(Math.abs(netWorth))}
          </p>
          <p className="text-[11px] text-slate-400">
            Assets ₹ {formatNumber(totalAssets)} · Liabilities ₹ {formatNumber(totalLiabilities)}
          </p>
        </div>
      </div>

      {/* body */}
      <div className="space-y-4 px-5 py-4 md:px-8 md:py-6">
        <div className="grid gap-5 lg:grid-cols-2">
          {/* assets */}
          <div className="space-y-3 rounded-2xl bg-slate-950/70 p-4 ring-1 ring-slate-800">
            {/* FONT INCREASE: text-[11px] -> text-base */}
            <p className="text-base font-bold uppercase tracking-[0.12em] text-emerald-400/90">
              Assets
            </p>
            <div className="grid gap-2.5">
              <NetWorthRow label="Cash & savings" hint="Bank, emergency funds, FDs." value={cash} onChange={setCash} />
              <NetWorthRow label="Investments" hint="Mutual funds, stocks, EPF/PPF." value={investments} onChange={setInvestments} />
              <NetWorthRow label="Property & gold" hint="Home, plots, jewellery value." value={propertyGold} onChange={setPropertyGold} />
              <NetWorthRow label="Other assets" hint="Vehicles, business stakes." value={otherAssets} onChange={setOtherAssets} />
              <NetWorthRow label="Custom asset" hint="ESOPs, crypto, collectibles." value={customAsset} onChange={setCustomAsset} />
            </div>
          </div>

          {/* liabilities */}
          <div className="space-y-3 rounded-2xl bg-slate-950/70 p-5 ring-1 ring-slate-800">
            {/* FONT INCREASE: text-[11px] -> text-base */}
            <p className="text-base font-bold uppercase tracking-[0.12em] text-rose-400/90">
              Liabilities
            </p>
            <div className="grid gap-2.5">
              <NetWorthRow label="Home loan outstanding" hint="Current principal balance." value={homeLoan} onChange={setHomeLoan} />
              <NetWorthRow label="Car / vehicle loans" hint="Outstanding on auto loans." value={carLoan} onChange={setCarLoan} />
              <NetWorthRow label="Personal / other loans" hint="Education, personal, consumer loans." value={personalLoans} onChange={setPersonalLoans} />
              <NetWorthRow label="Credit card balances" hint="Unpaid statement balances." value={creditCards} onChange={setCreditCards} />
              <NetWorthRow label="Other liabilities" hint="Tax due, margin loans, etc." value={otherLiabilities} onChange={setOtherLiabilities} />
            </div>
          </div>
        </div>

        {/* totals + asset mix */}
        <div className="grid gap-3 md:grid-cols-[1.2fr,1.8fr]">
          <div className="space-y-3">
            <div className="rounded-xl bg-emerald-500/15 p-3 ring-1 ring-emerald-500/50">
              <p className="text-sm font-bold text-emerald-100">Total assets</p>
              <p className="mt-1 text-xl font-bold text-emerald-50">₹ {formatNumber(totalAssets)}</p>
            </div>

            <div className="rounded-xl bg-slate-950/80 p-3 ring-1 ring-slate-800">
              <p className="text-sm font-bold text-slate-300">Total liabilities</p>
              <p className="mt-1 text-xl font-bold text-slate-50">₹ {formatNumber(totalLiabilities)}</p>
            </div>
          </div>

          <div className="space-y-3 rounded-xl bg-slate-950/80 p-5 ring-1 ring-slate-800">
            <p className="text-sm font-bold text-slate-200 uppercase tracking-wider">Asset mix</p>
            <div className="space-y-3">
              <MixRow label="Cash & savings" value={assetMix.cash.value} share={assetMix.cash.share} />
              <MixRow label="Investments" value={assetMix.investments.value} share={assetMix.investments.share} />
              <MixRow label="Property & gold" value={assetMix.propertyGold.value} share={assetMix.propertyGold.share} />
              <MixRow label="Other assets" value={assetMix.otherAssets.value} share={assetMix.otherAssets.share} />
              <MixRow label="Custom asset" value={assetMix.customAsset.value} share={assetMix.customAsset.share} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}