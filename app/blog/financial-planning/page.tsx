import Link from "next/link";

export default function FinancialJournal() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-14">
      <div className="mx-auto max-w-5xl space-y-8">
        <Link href="/blog" className="text-xs text-slate-400 hover:text-emerald-300">
          ← Back to Journal
        </Link>

        <h1 className="text-3xl font-bold text-slate-50">
          Financial Planning Journal
        </h1>

        <p className="text-sm text-slate-400 max-w-3xl">
          Understanding money behaviour, SIP psychology, FIRE realism and
          net-worth thinking — without hype or product pushing.
        </p>

        <div className="rounded-3xl border border-emerald-500/40 bg-emerald-900/10 p-6">
          <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
            <li>SIP behaviour — why consistency beats timing</li>
            <li>Inflation math — retirement reality check</li>
            <li>FIRE planning — timelines vs emotions</li>
            <li>Net-worth psychology — asset mix thinking</li>
            <li>Monthly money notes — behavioural finance</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
