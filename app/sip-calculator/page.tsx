import { Suspense } from 'react';
import SipCalculator from '@/components/SipCalculator';

export default function SipCalculatorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SipCalculator />
    </Suspense>
  );
}

