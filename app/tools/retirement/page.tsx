import Link from "next/link";
import RetirementCalculator from "@/components/RetirementCalculator";

export const metadata = {
  title: "Retirement Corpus Planner | MoneyTalks with SS",
  description:
    "Estimate the retirement corpus you may need based on today’s expenses, years to retirement, inflation and returns — with scenarios and premium report.",
};

export default function RetirementPage() {
  return (
    <main className="min-h-screen bg-slate-950/90 px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-4">
        {/* Breadcrumb / heading */}
        <header className="space-y-2">
          <Link
            href="/tools"
            className="inline-flex items-center text-[11px] text-slate-400 hover:text-sky-300"
          >
            <span className="mr-1">←</span>
            Back to all tools
          </Link>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-slate-50">
              Retirement Corpus Planner
            </h1>
            <p className="text-xs text-slate-400">
              Estimate how much you may need at retirement to support your
              lifestyle, with inflation-aware projections, scenario comparison
              and a professional PDF report layout.
            </p>
          </div>
        </header>

        {/* Tool */}
        <RetirementCalculator />
      </div>
    </main>
  );
}
