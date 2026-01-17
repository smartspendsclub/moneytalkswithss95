import Link from "next/link";
import StepUpSipCalculator from "@/components/StepUpSipCalculator";

export const metadata = {
  title: "Step-up SIP Calculator | MoneyTalks with SS",
  description:
    "Premium step-up SIP calculator to see how increasing your SIP every year changes your final corpus.",
};

export default function StepUpSipPage() {
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
              Step-up SIP Calculator
            </h1>
            <p className="text-xs text-slate-400">
              Start with a base SIP and increase it every year to see how
              small, regular step-ups can change your final corpus over time.
            </p>
          </div>
        </header>

        {/* Tool body */}
        <StepUpSipCalculator />
      </div>
    </main>
  );
}
