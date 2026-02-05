import { Suspense } from 'react';
import GoalPlanner from '@/components/GoalPlanner';

export default function GoalPlannerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoalPlanner />
    </Suspense>
  );
}
