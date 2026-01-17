import Link from "next/link";
import InflationCalculator from "@/components/InflationCalculator";

export const metadata = {
  title: "Inflation Impact Calculator | MoneyTalks with SS",
  description:
    "See how inflation changes the future cost of your goals so you can plan SIPs and lumpsum investments in real terms.",
};

export default function InflationPage() {
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
              Inflation Impact Calculator
            </h1>
            <p className="text-xs text-slate-400">
              Convert today’s goal cost into a future cost by factoring in
              inflation, and plug that number into your SIP, lumpsum or goal-
              planner tools.
            </p>
          </div>
        </header>

        <InflationCalculator />
      </div>
    </main>
  );
}
