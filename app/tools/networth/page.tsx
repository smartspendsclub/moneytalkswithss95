import Link from "next/link";
import NetWorthCalculator from "@/components/NetWorthCalculator";

export const metadata = {
  title: "Net Worth Calculator | MoneyTalks with SS",
  description:
    "Track what you own and what you owe in one clean view and see how your net worth evolves over time.",
};

export default function NetWorthPage() {
  return (
    <main className="min-h-screen bg-slate-950/90 px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-4">
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
              Net Worth Calculator
            </h1>
            <p className="text-xs text-slate-400">
              Add up your assets and loans to see a calm, planner-style view of
              your current net worth and asset mix.
            </p>
          </div>
        </header>

        <NetWorthCalculator />
      </div>
    </main>
  );
}
