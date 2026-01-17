import Link from "next/link";

type Tool = {
  slug: string;
  title: string;
  description: string;
  status: "Available" | "Planned";
  tag: string;
};

const tools: Tool[] = [
  {
    slug: "sip",
    title: "SIP Calculator",
    description:
      "Project SIP growth with sliders, charts and a clean breakdown of invested amount vs returns.",
    status: "Available",
    tag: "Live",
  },
  {
    slug: "lumpsum",
    title: "Lumpsum Investment Calculator",
    description:
      "See how a one-time investment compounds over time across different return assumptions.",
    status: "Available",
    tag: "Live",
  },
  {
    slug: "retirement",
    title: "Retirement Corpus Planner",
    description:
      "Estimate your retirement expenses, inflation impact and the corpus you may need to sustain them.",
    status: "Available",
    tag: "Live",
  },
  {
    slug: "goals",
    title: "Goal-based Financial Planner",
    description:
      "Plan a specific life goal by mapping today’s cost, inflation and expected returns to a monthly investment.",
    status: "Available",
    tag: "Live",
  },

  // NEW TOOLS
  {
    slug: "stepup-sip",
    title: "Step-up SIP Calculator",
    description:
      "Start with a base SIP and increase it every year to see how small step-ups can dramatically change your final corpus.",
    status: "Available",
    tag: "Live",
  },
  {
    slug: "inflation",
    title: "Inflation Impact Calculator",
    description:
      "Convert today’s goal cost into a future value by factoring in yearly inflation – a clean bridge into your SIP and goal tools.",
    status: "Available",
    tag: "Live",
  },
  {
    slug: "networth",
    title: "Net Worth Snapshot",
    description:
      "Add up what you own and what you owe to get a calm, planner-style view of your current net worth and asset mix.",
    status: "Available",
    tag: "Live",
  },
  {
    slug: "fire",
    title: "FIRE Timeline Estimator",
    description:
      "Combine expenses, existing corpus and monthly investing capacity to get a directional timeline for financial independence.",
    status: "Available",
    tag: "Beta",
  },
  {
    slug: "tax",
    title: "Income Tax Estimator (New Regime – India)",
    description:
      "Quick, simplified estimate of your tax outgo under the latest new-regime slabs. Rounded and educational – not for filing.",
    status: "Available",
    tag: "Beta",
  },
];

function ToolCard({ tool }: { tool: Tool }) {
  const isAvailable = tool.status === "Available";
  const href = isAvailable ? `/tools/${tool.slug}` : undefined;

  const content = (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-700/70 bg-slate-950/70 p-4 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:border-emerald-400/60">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[15px] font-semibold text-slate-50">
            {tool.title}
          </h2>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
              isAvailable
                ? "bg-emerald-500/15 text-emerald-200 border border-emerald-400/60"
                : "bg-slate-800 text-slate-300 border border-slate-600/70"
            }`}
          >
            {tool.tag}
          </span>
        </div>
        <p className="text-xs text-slate-300">{tool.description}</p>
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
        <span>
          {isAvailable
            ? "Click to open the calculator"
            : "This tool is on the roadmap"}
        </span>
        {isAvailable && <span className="text-emerald-300">→</span>}
      </div>
    </article>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}

export default function ToolsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Financial Planning Tools
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Explore premium calculators for SIPs, step-up SIPs, lumpsum investing,
          retirement, goal-based planning, net worth, FIRE timelines and tax –
          designed to feel like a calm conversation with a financial planner,
          not a spreadsheet.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      <p className="text-[11px] text-slate-400">
        All tools are for educational use only and rely on simplified
        assumptions. They&apos;re not personalised financial, investment, tax or
        legal advice.
      </p>
    </section>
  );
}
