import Link from "next/link";
import FireCalculator from "@/components/FireCalculator";

export const metadata = {
  title: "FIRE Calculator | MoneyTalks with SS",
  description:
    "Estimate how large a corpus you may need for financial independence and how long it might take to get there.",
};

export default function FirePage() {
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
              FIRE Number Calculator
            </h1>
            <p className="text-xs text-slate-400">
              Combine your expenses, current corpus and monthly investing
              capacity to get a directional timeline for financial independence.
            </p>
          </div>
        </header>

        <FireCalculator />
      </div>
    </main>
  );
}
