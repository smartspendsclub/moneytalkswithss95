import Link from "next/link";
import { Suspense } from "react";
import SipCalculator from "@/components/SipCalculator";

export const metadata = {
  title: "SIP Calculator | MoneyTalks with SS",
  description:
    "Premium SIP calculator to project your mutual fund SIP growth with scenarios, visuals and downloadable report.",
};

export default function SipPage() {
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
              SIP Calculator
            </h1>
            <p className="text-xs text-slate-400">
              Adjust your SIP amount, time horizon and expected return to see
              how your monthly investments could grow. Includes scenario
              comparison and a clean downloadable PDF report.
            </p>
          </div>
        </header>

        {/* Tool */}
        <Suspense fallback={<div>Loading...</div>}>
          <SipCalculator />
        </Suspense>
      </div>
    </main>
  );
}
