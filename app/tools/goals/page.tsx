import Link from 'next/link';
import { Suspense } from 'react';
import GoalPlanner from '../../components/GoalPlanner';

export default function GoalsPage() {
  return (
    <section className="space-y-6">
      <div className="text-xs">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200"
        >
          <span>←</span>
          <span>Back to all tools</span>
        </Link>
      </div>

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Goal-based Investment Planner
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Take a single goal – like education, house, travel or financial freedom –
          and turn it into a number, a timeline and a monthly investment plan.
        </p>
      </header>

      <Suspense fallback={<div>Loading...</div>}>
        <GoalPlanner />
      </Suspense>
    </section>
  );
}
