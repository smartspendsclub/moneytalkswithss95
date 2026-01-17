import Link from "next/link";
import LumpsumCalculator from "@/components/LumpsumCalculator";

export const metadata = {
  title: "Lumpsum Investment Calculator | MoneyTalks with SS",
  description:
    "Project how a one-time lumpsum investment can grow over time with different return scenarios and premium visual breakdown.",
};

export default function LumpsumPage() {
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
              Lumpsum Investment Calculator
            </h1>
            <p className="text-xs text-slate-400">
              Explore how a one-time investment can compound over different
              time periods and return assumptions, with a split view of
              principal vs growth and downloadable report.
            </p>
          </div>
        </header>

        {/* Tool */}
        <LumpsumCalculator />
      </div>
    </main>
  );
}
