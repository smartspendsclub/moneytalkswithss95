'use client';

import React, {
  useState,
  useMemo,
  useEffect,
  FormEvent,
} from 'react';
import dynamic from 'next/dynamic';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { useSearchParams } from 'next/navigation';
import { PdfReport } from './PdfReport';
import { downloadComponentPdf } from '../lib/pdf-utils';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Doughnut = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Doughnut),
  { ssr: false }
);

const Bar = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Bar),
  { ssr: false }
);

type GoalType =
  | 'marriage'
  | 'education'
  | 'travel'
  | 'freedom'
  | 'house'
  | 'car'
  | 'emergency'
  | 'business'
  | 'parents'
  | 'custom';

type InvestMode = 'sip' | 'lumpsum';

type ScenarioKey = 'base' | 'optimistic' | 'conservative' | null;

const GOAL_PRESETS: {
  id: GoalType;
  label: string;
  defaultName: string;
  defaultYears: number;
  helper: string;
}[] = [
  {
    id: 'marriage',
    label: 'Marriage',
    defaultName: 'Marriage',
    defaultYears: 7,
    helper: 'Planning for wedding-related expenses.',
  },
  {
    id: 'education',
    label: 'Children education',
    defaultName: 'Child education',
    defaultYears: 10,
    helper:
      'Future education cost for your child (college, higher studies, etc.).',
  },
  {
    id: 'travel',
    label: 'Travel',
    defaultName: 'Major travel goal',
    defaultYears: 5,
    helper: 'A major trip you want to plan in advance.',
  },
  {
    id: 'freedom',
    label: 'Financial freedom',
    defaultName: 'Financial freedom',
    defaultYears: 20,
    helper: 'When you want work to be optional, not compulsory.',
  },
  {
    id: 'house',
    label: 'House / Home purchase',
    defaultName: 'Home purchase',
    defaultYears: 8,
    helper: 'Down payment or full amount for a home purchase.',
  },
  {
    id: 'car',
    label: 'Car / Vehicle upgrade',
    defaultName: 'Car purchase',
    defaultYears: 4,
    helper: 'Buying or upgrading to a new car/vehicle.',
  },
  {
    id: 'emergency',
    label: 'Emergency fund',
    defaultName: 'Emergency fund',
    defaultYears: 1,
    helper: 'Building 6–12 months of living expenses as a safety buffer.',
  },
  {
    id: 'business',
    label: 'Business / Startup fund',
    defaultName: 'Business fund',
    defaultYears: 6,
    helper: 'Capital needed to start or expand a business.',
  },
  {
    id: 'parents',
    label: "Parent's retirement support",
    defaultName: "Parent's retirement support",
    defaultYears: 12,
    helper: 'Helping parents with retirement or medical support funds.',
  },
  {
    id: 'custom',
    label: 'Custom goal',
    defaultName: 'Custom goal',
    defaultYears: 10,
    helper: 'Any other goal that matters to you.',
  },
];

const SCENARIOS: Record<
  Exclude<ScenarioKey, null>,
  { label: string; inflation: number; returns: number; description: string }
> = {
  base: {
    label: 'Base case',
    inflation: 6,
    returns: 12,
    description: 'Balanced assumptions for many long-term goals.',
  },
  optimistic: {
    label: 'Optimistic',
    inflation: 5,
    returns: 14,
    description: 'Slightly better returns and lower inflation than base.',
  },
  conservative: {
    label: 'Conservative',
    inflation: 7,
    returns: 10,
    description: 'More cautious – higher inflation and lower returns.',
  },
};

export default function GoalPlanner() {
  const searchParams = useSearchParams();

  const [goalType, setGoalType] = useState<GoalType>('education');
  const [goalName, setGoalName] = useState('Child education');
  const [yearsToGoal, setYearsToGoal] = useState(10);
  const [currentCost, setCurrentCost] = useState(2_000_000);
  const [inflationRate, setInflationRate] = useState(7);
  const [returnRate, setReturnRate] = useState(12);
  const [mode, setMode] = useState<InvestMode>('sip');

  const [selectedScenario, setSelectedScenario] =
    useState<ScenarioKey>('base');

  const [chartMode, setChartMode] =
    useState<'split' | 'timeline'>('split');
  const [activeSlice, setActiveSlice] = useState<
    'invested' | 'returns' | null
  >(null);

  const [copiedLink, setCopiedLink] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (!searchParams) return;

    const type = searchParams.get('goalType') as GoalType | null;
    const name = searchParams.get('goal');
    const cost = searchParams.get('cost');
    const yrs = searchParams.get('years');
    const infl = searchParams.get('inflation');
    const ret = searchParams.get('return');
    const modeParam = searchParams.get('mode') as InvestMode | null;
    const scenarioParam = searchParams.get('scenario') as ScenarioKey;

    if (type && GOAL_PRESETS.some((g) => g.id === type)) {
      setGoalType(type);
      const preset = GOAL_PRESETS.find((g) => g.id === type);
      if (preset) {
        setGoalName(preset.defaultName);
        setYearsToGoal(preset.defaultYears);
      }
    }

    if (name) setGoalName(name);

    if (cost) {
      const num = Number(cost);
      if (!Number.isNaN(num) && num > 0) setCurrentCost(num);
    }
    if (yrs) {
      const num = Number(yrs);
      if (!Number.isNaN(num) && num > 0) setYearsToGoal(num);
    }
    if (infl) {
      const num = Number(infl);
      if (!Number.isNaN(num) && num >= 0) setInflationRate(num);
    }
    if (ret) {
      const num = Number(ret);
      if (!Number.isNaN(num) && num >= 0) setReturnRate(num);
    }
    if (modeParam === 'sip' || modeParam === 'lumpsum') {
      setMode(modeParam);
    }

    if (
      scenarioParam === 'base' ||
      scenarioParam === 'optimistic' ||
      scenarioParam === 'conservative'
    ) {
      setSelectedScenario(scenarioParam);
    } else {
      setSelectedScenario(null);
    }
  }, [searchParams]);

  const mainResults = useMemo(() => {
    const cost = currentCost;
    const yrs = yearsToGoal;
    const infl = inflationRate;
    const ret = returnRate;

    if (!cost || !yrs) return null;

    const inflDecimal = infl / 100;
    const futureCost = cost * (1 + inflDecimal) ** yrs;

    if (futureCost <= 0) return null;

    if (mode === 'sip') {
      const n = yrs * 12;
      const rMonthly = ret / 12 / 100;

      if (n <= 0) return null;

      let monthlyInvestment = 0;
      if (rMonthly > 0) {
        monthlyInvestment =
          futureCost *
          (rMonthly / ((1 + rMonthly) ** n - 1) / (1 + rMonthly));
      } else {
        monthlyInvestment = futureCost / n;
      }

      const totalInvested = monthlyInvestment * n;
      const returns = futureCost - totalInvested;
      const returnsShare =
        futureCost > 0 ? (returns / futureCost) * 100 : 0;

      return {
        mode,
        futureCost,
        keyAmount: monthlyInvestment,
        totalInvested,
        returns,
        returnsShare,
        n,
      };
    } else {
      const n = yrs;
      const r = ret / 100;

      let lumpsum = 0;
      if (r > 0 && n > 0) {
        lumpsum = futureCost / (1 + r) ** n;
      } else {
        lumpsum = futureCost;
      }

      const totalInvested = lumpsum;
      const returns = futureCost - lumpsum;
      const returnsShare =
        futureCost > 0 ? (returns / futureCost) * 100 : 0;

      return {
        mode,
        futureCost,
        keyAmount: lumpsum,
        totalInvested,
        returns,
        returnsShare,
        n,
      };
    }
  }, [currentCost, yearsToGoal, inflationRate, returnRate, mode]);

  const scenarioResults = useMemo(() => {
    const cost = currentCost;
    const yrs = yearsToGoal;

    if (!cost || !yrs) return null;

    const calcFor = (infl: number, ret: number) => {
      const inflDecimal = infl / 100;
      const futureCost = cost * (1 + inflDecimal) ** yrs;

      if (mode === 'sip') {
        const n = yrs * 12;
        const rMonthly = ret / 12 / 100;
        if (n <= 0) return { futureCost, keyAmount: 0 };

        let monthlyInvestment = 0;
        if (rMonthly > 0) {
          monthlyInvestment =
            futureCost *
            (rMonthly / ((1 + rMonthly) ** n - 1) / (1 + rMonthly));
        } else {
          monthlyInvestment = futureCost / n;
        }
        return { futureCost, keyAmount: monthlyInvestment };
      } else {
        const n = yrs;
        const r = ret / 100;
        let lumpsum = 0;
        if (r > 0 && n > 0) {
          lumpsum = futureCost / (1 + r) ** n;
        } else {
          lumpsum = futureCost;
        }
        return { futureCost, keyAmount: lumpsum };
      }
    };

    return {
      base: calcFor(SCENARIOS.base.inflation, SCENARIOS.base.returns),
      optimistic: calcFor(
        SCENARIOS.optimistic.inflation,
        SCENARIOS.optimistic.returns
      ),
      conservative: calcFor(
        SCENARIOS.conservative.inflation,
        SCENARIOS.conservative.returns
      ),
    };
  }, [currentCost, yearsToGoal, mode]);

  const chartData = useMemo(() => {
    if (!mainResults) return null;

    return {
      labels: ['Total invested', 'Estimated returns'],
      datasets: [
        {
          data: [mainResults.totalInvested, mainResults.returns],
          backgroundColor: ['#0ea5e9', '#22c55e'],
          hoverBackgroundColor: ['#38bdf8', '#4ade80'],
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    };
  }, [mainResults]);

  const timelineData = useMemo(() => {
    if (!mainResults || yearsToGoal <= 0) return null;

    const yrs = yearsToGoal;
    const labels: string[] = [];
    const investedData: number[] = [];
    const valueData: number[] = [];

    const sampleYears: number[] = [];
    if (yrs <= 4) {
      for (let y = 1; y <= yrs; y++) sampleYears.push(y);
    } else {
      const fractions = [0.25, 0.5, 0.75, 1];
      fractions.forEach((f) => {
        const y = Math.max(1, Math.round(yrs * f));
        if (!sampleYears.includes(y)) sampleYears.push(y);
      });
    }

    if (mode === 'sip') {
      const monthly = mainResults.keyAmount;
      const rMonthly = returnRate / 12 / 100;

      sampleYears.forEach((y) => {
        const n = y * 12;
        let fv = 0;
        if (rMonthly > 0) {
          fv =
            monthly *
            (((1 + rMonthly) ** n - 1) / rMonthly) *
            (1 + rMonthly);
        } else {
          fv = monthly * n;
        }
        const invested = monthly * n;
        labels.push(`Year ${y}`);
        investedData.push(Math.round(invested));
        valueData.push(Math.round(fv));
      });
    } else {
      const lumpsum = mainResults.keyAmount;
      const r = returnRate / 100;

      sampleYears.forEach((y) => {
        const fv = lumpsum * (1 + r) ** y;
        labels.push(`Year ${y}`);
        investedData.push(Math.round(lumpsum));
        valueData.push(Math.round(fv));
      });
    }

    return {
      labels,
      datasets: [
        {
          label: 'Total invested',
          data: investedData,
          backgroundColor: '#0ea5e9',
        },
        {
          label: 'Estimated value',
          data: valueData,
          backgroundColor: '#22c55e',
        },
      ],
    };
  }, [mainResults, yearsToGoal, returnRate, mode]);

  const doughnutOptions: any = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        bodyFont: { size: 11 },
        titleFont: { size: 11 },
      },
    },
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: false,
  };

  const timelineOptions: any = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 10,
          },
        },
      },
      tooltip: {
        bodyFont: { size: 10 },
        titleFont: { size: 10 },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        ticks: {
          font: { size: 10 },
          callback: (value: any) => {
            if (typeof value === 'number') {
              if (value >= 1_00_00_000) {
                return `${Math.round(value / 1_00_00_000)}Cr`;
              }
              if (value >= 1_00_000) {
                return `${Math.round(value / 1_00_000)}L`;
              }
            }
            return value;
          },
        },
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
      },
    },
  };

  function formatNumber(num: number | undefined) {
    if (!num || Number.isNaN(num)) return '0';
    return num.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  function handleScenarioClick(key: Exclude<ScenarioKey, null>) {
    const scenario = SCENARIOS[key];
    setSelectedScenario(key);
    setInflationRate(scenario.inflation);
    setReturnRate(scenario.returns);
  }

  function handleInflationChange(value: string) {
    const num = Number(value);
    setInflationRate(Number.isNaN(num) ? 0 : num);
    setSelectedScenario(null);
  }

  function handleReturnChange(value: string) {
    const num = Number(value);
    setReturnRate(Number.isNaN(num) ? 0 : num);
    setSelectedScenario(null);
  }

  async function handleShareLink() {
    try {
      if (typeof window === 'undefined') return;
      const url = new URL(window.location.href);
      url.searchParams.set('goalType', goalType);
      url.searchParams.set('goal', goalName);
      url.searchParams.set('cost', String(currentCost));
      url.searchParams.set('years', String(yearsToGoal));
      url.searchParams.set('inflation', String(inflationRate));
      url.searchParams.set('return', String(returnRate));
      url.searchParams.set('mode', mode);
      if (selectedScenario) {
        url.searchParams.set('scenario', selectedScenario);
      }

      await navigator.clipboard.writeText(url.toString());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }

  // rows for PDF scenarios
  const pdfScenarioRows =
    scenarioResults && mainResults
      ? (['base', 'optimistic', 'conservative'] as Exclude<
          ScenarioKey,
          null
        >[]).map((key) => ({
          key,
          label: SCENARIOS[key].label,
          inflation: SCENARIOS[key].inflation,
          returns: SCENARIOS[key].returns,
          requiredAmount: scenarioResults[key].keyAmount,
        }))
      : [];

  async function handleDownloadPdf() {
    if (!mainResults || !scenarioResults) return;

    const safeName = goalName.trim() || 'goal';
    const fileName = `${safeName.replace(/\s+/g, '_')}_plan.pdf`;

    await downloadComponentPdf(
      PdfReport,
      {
        goalName,
        goalTypeLabel:
          GOAL_PRESETS.find((g) => g.id === goalType)?.label ??
          goalType,
        yearsToGoal,
        costToday: currentCost,
        futureCost: mainResults.futureCost,
        mode,
        requiredAmount: mainResults.keyAmount,
        totalInvested: mainResults.totalInvested,
        growthAmount: mainResults.returns,
        returnsShare: mainResults.returnsShare,
        inflationRate,
        returnRate,
        scenarios: pdfScenarioRows,
      },
      fileName
    );
  }

  function getComfortText() {
    if (!mainResults) return null;
    const share = mainResults.returnsShare;

    if (share < 40) {
      return {
        tone: 'Conservative plan',
        text: 'This looks like a conservative plan. A larger portion of the goal is coming from what you invest, rather than market growth. That usually means less risk but higher savings effort.',
        color: 'text-emerald-300',
      };
    }
    if (share <= 60) {
      return {
        tone: 'Balanced plan',
        text: 'This plan appears fairly balanced. Both your contributions and expected growth are contributing meaningfully towards this goal. Staying consistent will matter more than chasing very high returns.',
        color: 'text-sky-300',
      };
    }
    return {
      tone: 'Aggressive plan',
      text: 'This projection leans on the aggressive side. A big portion of the goal depends on high returns. You may want to review the timeline, return expectation or goal cost so that you are comfortable with the risk.',
      color: 'text-amber-300',
    };
  }

  const comfort = getComfortText();

  const presetForCurrentType = GOAL_PRESETS.find(
    (g) => g.id === goalType
  );

  const centerInfo = useMemo(() => {
    if (!mainResults) return null;

    if (activeSlice === 'invested') {
      const pct = 100 - mainResults.returnsShare;
      return {
        title: 'You invest',
        amount: mainResults.totalInvested,
        percent: pct,
      };
    }
    if (activeSlice === 'returns') {
      const pct = mainResults.returnsShare;
      return {
        title: 'Growth / returns',
        amount: mainResults.returns,
        percent: pct,
      };
    }
    return {
      title: 'Final goal value',
      amount: mainResults.futureCost,
      percent: 100,
    };
  }, [mainResults, activeSlice]);

  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 shadow-xl shadow-slate-900/30 md:mx-2 lg:mx-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 md:px-8">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/15 px-3 py-1 text-[11px] font-medium text-sky-100 ring-1 ring-sky-400/60">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-400" />
              Goal-based · Single goal planner
            </div>
            <h2 className="text-lg font-semibold md:text-xl">
              Goal Investment Planner
            </h2>
            <p className="text-[11px] text-slate-300 md:text-xs">
              Translate a future goal into a monthly SIP or one-time investment, with
              inflation and return assumptions that you can adjust.
            </p>
          </div>

          {mainResults && (
            <div className="flex flex-col items-end text-right text-[11px] text-slate-300 md:text-xs">
              <span className="text-slate-400">
                Estimated future cost
              </span>
              <span className="text-base font-semibold text-sky-200 md:text-lg">
                ₹ {formatNumber(mainResults.futureCost)}
              </span>
              <span className="text-[11px] text-slate-400">
                In {yearsToGoal} years · Inflation {inflationRate}% p.a.
              </span>
            </div>
          )}
        </div>

        <div className="grid gap-6 border-t border-white/5 bg-slate-950/40 px-5 py-5 backdrop-blur md:grid-cols-[3fr,2.4fr] md:px-8 md:py-7">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/5 md:p-5"
          >
            <ControlBlock
              label={
                <div className="inline-flex items-center gap-1">
                  <span>Choose your goal</span>
                  <span
                    className="cursor-default text-[10px] text-slate-400"
                    title="Pick a goal type to start. We’ll prefill a name and time horizon for you."
                  >
                    ⓘ
                  </span>
                </div>
              }
              hint="Pick a goal type to start. You can always adjust the name and years."
              valueLabel={presetForCurrentType?.label ?? ''}
              accent="sky"
            >
              <div className="text-xs">
                <select
                  value={goalType}
                  onChange={(e) => {
                    const value = e.target.value as GoalType;
                    setGoalType(value);
                    const preset = GOAL_PRESETS.find(
                      (g) => g.id === value
                    );
                    if (preset) {
                      setGoalName(preset.defaultName);
                      setYearsToGoal(preset.defaultYears);
                    }
                  }}
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-50 outline-none ring-sky-500/40 focus:border-sky-400 focus:ring"
                >
                  {GOAL_PRESETS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
                {presetForCurrentType && (
                  <p className="mt-1 text-[10px] text-slate-500">
                    {presetForCurrentType.helper}
                  </p>
                )}
              </div>
            </ControlBlock>

            <ControlBlock
              label="Goal & timeline"
              hint="Describe what this goal is and when you’d like the money ready."
              valueLabel={`${goalName} · ${yearsToGoal} years`}
              accent="sky"
            >
              <div className="grid gap-3 text-xs md:grid-cols-[2fr,1fr]">
                <div>
                  <p className="mb-1 text-slate-300">Goal name</p>
                  <input
                    type="text"
                    value={goalName}
                    onChange={(e) =>
                      setGoalName(e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-50 outline-none ring-sky-500/40 focus:border-sky-400 focus:ring"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    You can rename this to something meaningful, e.g.
                    “Daughter’s college fund”.
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-slate-300">
                    Years to goal
                  </p>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={yearsToGoal === 0 ? '' : yearsToGoal}
                    onChange={(e) =>
                      setYearsToGoal(
                        Number(e.target.value) || 0
                      )
                    }
                    onFocus={(e) => {
                      setYearsToGoal(0);
                      e.target.select();
                    }}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-50 outline-none ring-sky-500/40 focus:border-sky-400 focus:ring"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Longer timelines usually need a lower monthly
                    investment for the same goal.
                  </p>
                </div>
              </div>
            </ControlBlock>

            <ControlBlock
              label="How do you want to invest?"
              hint="Choose whether you want to invest monthly via SIP or as a one-time lumpsum."
              valueLabel={
                mode === 'sip'
                  ? 'Monthly SIP'
                  : 'One-time lumpsum'
              }
              accent="sky"
            >
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setMode('sip')}
                  className={`flex-1 rounded-full border px-3 py-1.5 text-center ${
                    mode === 'sip'
                      ? 'border-sky-400 bg-sky-500/20 text-sky-50 shadow-sm shadow-sky-500/30'
                      : 'border-slate-700 bg-slate-950/40 text-slate-200 hover:border-slate-500 hover:bg-slate-900'
                  }`}
                >
                  Monthly SIP
                  <span className="block text-[10px] text-slate-400">
                    Invest a fixed amount every month.
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('lumpsum')}
                  className={`flex-1 rounded-full border px-3 py-1.5 text-center ${
                    mode === 'lumpsum'
                      ? 'border-sky-400 bg-sky-500/20 text-sky-50 shadow-sm shadow-sky-500/30'
                      : 'border-slate-700 bg-slate-950/40 text-slate-200 hover:border-slate-500 hover:bg-slate-900'
                  }`}
                >
                  One-time lumpsum
                  <span className="block text-[10px] text-slate-400">
                    Invest once now and let it grow.
                  </span>
                </button>
              </div>
            </ControlBlock>

            <ControlBlock
              label="Cost of this goal today"
              hint="If this goal happened today, roughly how much would you need? Approximation is okay."
              valueLabel={`₹ ${formatNumber(currentCost)}`}
              accent="sky"
            >
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={200000}
                  max={20000000}
                  step={50000}
                  value={currentCost}
                  onChange={(e) =>
                    setCurrentCost(Number(e.target.value))
                  }
                  className="h-1 w-full cursor-pointer rounded-full bg-slate-700 accent-sky-400"
                />
                <input
                  type="number"
                  min={100000}
                  max={50000000}
                  step={50000}
                  value={
                    currentCost === 0 ? '' : currentCost
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setCurrentCost(0);
                    } else {
                      const num = Number(val);
                      setCurrentCost(
                        Number.isNaN(num) ? 0 : num
                      );
                    }
                  }}
                  onFocus={(e) => e.target.select()}
                  className="w-32 rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-50 outline-none ring-sky-500/40 focus:border-sky-400 focus:ring"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                {[1_000_000, 2_000_000, 5_000_000, 10_000_000].map(
                  (amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCurrentCost(amt)}
                      className={`rounded-full border px-3 py-1 ${
                        currentCost === amt
                          ? 'border-sky-400 bg-sky-500/20 text-sky-100'
                          : 'border-slate-700 bg-slate-900/80 text-slate-200 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      ₹ {amt.toLocaleString('en-IN')}
                    </button>
                  )
                )}
              </div>
            </ControlBlock>

            <ControlBlock
              label="Inflation & expected return"
              hint="Inflation increases the goal cost; expected return determines how hard your money works."
              valueLabel={`${inflationRate}% inflation · ${returnRate}% return`}
              accent="sky"
            >
              <div className="mb-3 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300">
                    Scenario comparison
                  </span>
                  <span className="text-slate-500">
                    These are starting points – you can still fine-tune.
                  </span>
                </div>
                <div className="grid gap-2 text-xs md:grid-cols-3">
                  {(Object.keys(
                    SCENARIOS
                  ) as Exclude<ScenarioKey, null>[]).map(
                    (key) => {
                      const s = SCENARIOS[key];
                      const active =
                        selectedScenario === key;
                      const scenarioRes =
                        scenarioResults?.[key];

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            handleScenarioClick(key)
                          }
                          className={`flex flex-col items-start rounded-xl border px-3 py-2 text-left transition ${
                            active
                              ? 'border-sky-400 bg-sky-500/20 text-sky-50 shadow-sm shadow-sky-500/30'
                              : 'border-slate-700 bg-slate-950/40 text-slate-200 hover:border-slate-500 hover:bg-slate-900'
                          }`}
                        >
                          <span className="text-xs font-semibold">
                            {s.label}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {s.description}
                          </span>
                          <span className="mt-1 text-[10px] text-slate-400">
                            Inflation {s.inflation}% · Return{' '}
                            {s.returns}%
                          </span>
                          {scenarioRes && (
                            <span className="mt-1 text-[11px] font-medium text-sky-200">
                              {mode === 'sip'
                                ? `SIP ~ ₹ ${formatNumber(
                                    scenarioRes.keyAmount
                                  )} / month`
                                : `Lumpsum ~ ₹ ${formatNumber(
                                    scenarioRes.keyAmount
                                  )}`}
                            </span>
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="mb-1 text-slate-300">
                    Inflation (per year)
                  </p>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    step={0.5}
                    value={
                      inflationRate === 0 ? '' : inflationRate
                    }
                    onChange={(e) =>
                      handleInflationChange(
                        e.target.value
                      )
                    }
                    onFocus={(e) => {
                      setInflationRate(0);
                      setSelectedScenario(null);
                      e.target.select();
                    }}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-50 outline-none ring-sky-500/40 focus:border-sky-400 focus:ring"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Many long-term Indian plans assume 5–7%
                    inflation.
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-slate-300">
                    Expected return (per year)
                  </p>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    step={0.5}
                    value={returnRate === 0 ? '' : returnRate}
                    onChange={(e) =>
                      handleReturnChange(e.target.value)
                    }
                    onFocus={(e) => {
                      setReturnRate(0);
                      setSelectedScenario(null);
                      e.target.select();
                    }}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-50 outline-none ring-sky-500/40 focus:border-sky-400 focus:ring"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Equity-heavy portfolios are often modelled
                    around 10–12% over long periods, but actual
                    returns can be higher or lower.
                  </p>
                </div>
              </div>
            </ControlBlock>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] text-slate-400">
              <p className="max-w-xs">
                These projections are educational. They’re a starting
                point to think about your goal, not a guarantee or
                personal recommendation.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleShareLink}
                  className="inline-flex items-center gap-1 rounded-full border border-sky-400 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-100 hover:bg-sky-500/20"
                >
                  <span>🔗</span>
                  <span>
                    {copiedLink
                      ? 'Link copied!'
                      : 'Share this result'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-500 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-100 hover:bg-emerald-500/20"
                >
                  <span>📄</span>
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </form>

          <div className="flex flex-col gap-4 rounded-2xl bg-slate-900/70 p-4 ring-1 ring-white/5 md:p-5">
            <div className="grid gap-3 text-sm md:grid-cols-3">
              <ResultCard
                label={
                  mode === 'sip'
                    ? 'Monthly investment needed'
                    : 'One-time investment needed'
                }
                value={
                  mainResults
                    ? `₹ ${formatNumber(
                        mainResults.keyAmount
                      )}`
                    : '₹ 0'
                }
                highlight
                helper="Based on your current inputs and assumptions."
              />
              <ResultCard
                label="Total amount you invest"
                value={
                  mainResults
                    ? `₹ ${formatNumber(
                        mainResults.totalInvested
                      )}`
                    : '₹ 0'
                }
                helper="Approximate total that you contribute over the full period."
              />
              <ResultCard
                label="Estimated returns (growth)"
                value={
                  mainResults
                    ? `₹ ${formatNumber(
                        mainResults.returns
                      )}`
                    : '₹ 0'
                }
                helper="Difference between your contributions and the future value of the goal."
              />
            </div>

            <div className="mt-2 flex flex-1 flex-col gap-3">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>How much is you vs growth?</span>
                <div className="flex items-center gap-2">
                  <span className="hidden text-[10px] text-slate-400 sm:inline">
                    Visual breakdown
                  </span>
                  <div className="inline-flex rounded-full bg-slate-800 p-0.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() =>
                        setChartMode('split')
                      }
                      className={`rounded-full px-2 py-0.5 ${
                        chartMode === 'split'
                          ? 'bg-sky-500 text-slate-950'
                          : 'text-slate-300'
                      }`}
                    >
                      Split view
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setChartMode('timeline')
                      }
                      className={`rounded-full px-2 py-0.5 ${
                        chartMode === 'timeline'
                          ? 'bg-sky-500 text-slate-950'
                          : 'text-slate-300'
                      }`}
                    >
                      Timeline view
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                {chartMode === 'split' ? (
                  chartData ? (
                    <div className="relative h-56 rounded-2xl bg-slate-950/60 p-4">
                      {centerInfo && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-[11px]">
                            <p className="text-slate-400">
                              {centerInfo.title}
                            </p>
                            <p className="mt-0.5 text-base font-semibold text-slate-50">
                              ₹{' '}
                              {formatNumber(
                                centerInfo.amount
                              )}
                            </p>
                            {centerInfo.percent !==
                              100 && (
                              <p className="mt-0.5 text-[10px] text-slate-500">
                                {centerInfo.percent.toFixed(
                                  0
                                )}
                                % of goal
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      <Doughnut
                        data={chartData}
                        options={{
                          ...doughnutOptions,
                          onHover: (
                            _event: any,
                            elements: any[]
                          ) => {
                            if (
                              elements &&
                              elements.length > 0
                            ) {
                              const index =
                                elements[0].index;
                              setActiveSlice(
                                index === 0
                                  ? 'invested'
                                  : 'returns'
                              );
                            } else {
                              setActiveSlice(null);
                            }
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-2xl bg-slate-950/60 text-xs text-slate-500">
                      Fill in your goal details to see invested
                      amount vs returns.
                    </div>
                  )
                ) : timelineData ? (
                  <div className="h-56 rounded-2xl bg-slate-950/60 p-4">
                    <Bar
                      data={timelineData}
                      options={timelineOptions}
                    />
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-2xl bg-slate-950/60 text-xs text-slate-500">
                    Add years and return assumptions to see a
                    simple growth timeline.
                  </div>
                )}
              </div>

              {comfort && (
                <div className="rounded-xl bg-slate-950/60 p-3 text-[11px] text-slate-300">
                  <p
                    className={`text-xs font-semibold ${comfort.color}`}
                  >
                    {comfort.tone}
                  </p>
                  <p className="mt-1 text-slate-300">
                    {comfort.text}
                  </p>
                </div>
              )}

              <div className="rounded-xl bg-slate-950/60 p-3 text-[11px] text-slate-300">
                <button
                  type="button"
                  onClick={() =>
                    setShowReport((prev) => !prev)
                  }
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="font-medium text-slate-100">
                    View detailed report
                  </span>
                  <span className="text-slate-400">
                    {showReport ? '−' : '+'}
                  </span>
                </button>

                {showReport && mainResults && (
                  <div className="mt-3 space-y-3">
                    <div>
                      <p className="mb-1 text-[11px] font-semibold text-slate-200">
                        Goal summary
                      </p>
                      <p className="text-[11px] text-slate-300">
                        You are planning for{' '}
                        <span className="font-medium text-slate-100">
                          {goalName}
                        </span>{' '}
                        over the next{' '}
                        <span className="font-medium text-slate-100">
                          {yearsToGoal} years
                        </span>
                        . At that point, the estimated cost of this
                        goal is around{' '}
                        <span className="font-medium text-slate-100">
                          ₹{' '}
                          {formatNumber(
                            mainResults.futureCost
                          )}
                        </span>
                        , assuming inflation of{' '}
                        <span className="font-medium text-slate-100">
                          {inflationRate}% per year
                        </span>
                        .
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-[11px] font-semibold text-slate-200">
                        Investment plan based on your inputs
                      </p>
                      {mode === 'sip' ? (
                        <p className="text-[11px] text-slate-300">
                          To work towards this goal, the model
                          suggests a monthly SIP of around{' '}
                          <span className="font-medium text-slate-100">
                            ₹{' '}
                            {formatNumber(
                              mainResults.keyAmount
                            )}
                          </span>{' '}
                          for{' '}
                          <span className="font-medium text-slate-100">
                            {yearsToGoal} years
                          </span>
                          . Over this period, you would invest about{' '}
                          <span className="font-medium text-slate-100">
                            ₹{' '}
                            {formatNumber(
                              mainResults.totalInvested
                            )}
                          </span>
                          , and the remaining{' '}
                          <span className="font-medium text-slate-100">
                            ₹{' '}
                            {formatNumber(
                              mainResults.returns
                            )}
                          </span>{' '}
                          is expected from investment growth, assuming
                          average annual returns of{' '}
                          <span className="font-medium text-slate-100">
                            {returnRate}%.
                          </span>
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-300">
                          To work towards this goal using a one-time
                          investment, the model suggests investing
                          around{' '}
                          <span className="font-medium text-slate-100">
                            ₹{' '}
                            {formatNumber(
                              mainResults.keyAmount
                            )}{' '}
                            today
                          </span>
                          . This is projected to grow to{' '}
                          <span className="font-medium text-slate-100">
                            ₹{' '}
                            {formatNumber(
                              mainResults.futureCost
                            )}
                          </span>{' '}
                          over{' '}
                          <span className="font-medium text-slate-100">
                            {yearsToGoal} years
                          </span>
                          , assuming average annual returns of{' '}
                          <span className="font-medium text-slate-100">
                            {returnRate}%.
                          </span>
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="mb-1 text-[11px] font-semibold text-slate-200">
                        How to read this projection
                      </p>
                      <ul className="space-y-1 text-[11px] text-slate-400">
                        <li>
                          • This is an educational projection, not a
                          guarantee. Actual inflation and returns can be
                          higher or lower.
                        </li>
                        <li>
                          • The tool assumes regular investing without
                          breaks and does not factor in taxes or
                          transaction costs.
                        </li>
                        <li>
                          • It&apos;s normal to revisit your plan once a
                          year and update the goal amount, timeline or
                          monthly contribution.
                        </li>
                        <li>
                          • If markets are volatile, focus on staying
                          consistent with your plan instead of reacting
                          to short-term moves.
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ControlBlock({
  label,
  hint,
  valueLabel,
  accent,
  children,
}: {
  label: React.ReactNode;
  hint: string;
  valueLabel: string;
  accent: 'amber' | 'emerald' | 'sky' | 'default';
  children: React.ReactNode;
}) {
  const accentClass =
    accent === 'amber'
      ? 'ring-amber-500/40'
      : accent === 'emerald'
      ? 'ring-emerald-500/40'
      : accent === 'sky'
      ? 'ring-sky-500/40'
      : 'ring-white/10';

  return (
    <div
      className={`space-y-2 rounded-xl bg-slate-950/40 p-3.5 ring-1 ${accentClass}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          {/* label can contain div/span/etc */}
          <div className="text-xs font-medium text-slate-100">
            {label}
          </div>
          <p className="text-[11px] text-slate-400">{hint}</p>
        </div>
        {valueLabel && (
          <p className="text-[11px] font-medium text-sky-200">
            {valueLabel}
          </p>
        )}
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
          highlight
            ? 'text-sky-100/80'
            : 'text-slate-400'
        }`}
      >
        {label}
      </p>
      <p className="mt-1 text-base font-semibold">{value}</p>
      <p className="mt-1 text-[10px] text-slate-400">
        {helper}
      </p>
    </div>
  );
}