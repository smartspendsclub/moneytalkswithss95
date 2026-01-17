import Link from "next/link";
import TaxCalculator from "@/components/TaxCalculator";

export const metadata = {
  title: "Income Tax Estimator (New Regime) | MoneyTalks with SS",
  description:
    "Quick, planner-style view of estimated income-tax under the latest Indian new-regime slabs. Educational only.",
};

export default function TaxPage() {
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
              Income Tax Estimator (New Regime)
            </h1>
            <p className="text-xs text-slate-400">
              Rough calculation of your tax outgo under the new regime slabs,
              including cess. Rounded and simplified – always cross-check before
              filing.
            </p>
          </div>
        </header>

        <TaxCalculator />
      </div>
    </main>
  );
}
