'use client';

import React from 'react';

type Scenario = {
  label: string;
  rate: number;
  corpus: number;
};

interface LumpsumPdfReportProps {
  amount: number;
  years: number;
  rate: number;
  corpus: number;
  growth: number;
  investedShare: number;
  returnsShare: number;
  scenarios: Scenario[];
}

const formatCurrency = (n: number) =>
  `₹ ${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const formatPercent = (n: number) => `${n.toFixed(0)}%`;

export const LumpsumPdfReport: React.FC<LumpsumPdfReportProps> = ({
  amount,
  years,
  rate,
  corpus,
  growth,
  investedShare,
  returnsShare,
  scenarios,
}) => {
  // --- Safe percentages ------------------------------------------------------
  const safeGrowthShare =
    typeof returnsShare === 'number' && Number.isFinite(returnsShare)
      ? Math.min(Math.max(returnsShare, 0), 100)
      : 0;

  const safeInvestedShare = 100 - safeGrowthShare;

  // --- Donut geometry --------------------------------------------------------
  const radius = 52;
  const strokeWidth = 14;
  const center = 70;

  const circumferenceRaw = 2 * Math.PI * radius;
  const circumference = Number.isFinite(circumferenceRaw) ? circumferenceRaw : 0;

  const growthLenRaw = (safeGrowthShare / 100) * circumference;
  const growthLength = Number.isFinite(growthLenRaw) ? growthLenRaw : 0;

  const baseDashArray = circumference > 0 ? `${circumference} ${circumference}` : '0 0';
  const growthDashArray = circumference > 0 ? `${growthLength} ${circumference - growthLength}` : '0 0';

  const reportDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      className="pdf-page"
      style={{
        width: '794px',
        minHeight: '1123px',
        padding: '32px 40px',
        boxSizing: 'border-box',
        background: 'radial-gradient(circle at top, #020617 0, #020617 100%)',
        color: '#e5e7eb',
        fontFamily: '-apple-system,BlinkMacSystemFont,system-ui,Segoe UI,Roboto,sans-serif',
        fontSize: '12px',
      }}
    >
      {/* HEADER (SIP Style) */}
      <header
        style={{
          borderRadius: '16px',
          padding: '16px 20px',
          background: 'linear-gradient(135deg,#020617,#020617)',
          border: '1px solid rgba(148, 163, 184, 0.4)',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#38bdf8' }}>
            MoneyTalks <span style={{ color: '#a5b4fc' }}>with SS</span>
          </div>
          <div style={{ marginTop: '4px', fontSize: '18px', fontWeight: 600 }}>
            Lumpsum Investment Plan
          </div>
          <div style={{ marginTop: '2px', fontSize: '10px', color: '#94a3b8' }}>
            One-time investment projection – personalised illustration
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '10px' }}>
          <div style={{ color: '#94a3b8' }}>Report date</div>
          <div style={{ fontWeight: 600, color: '#e5e7eb', marginTop: '2px' }}>{reportDate}</div>
        </div>
      </header>

      {/* TOP SUMMARY (SIP Style Grid) */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '16px', marginBottom: '16px' }}>
        <div style={{ borderRadius: '16px', padding: '14px 16px', background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(148,163,184,0.35)' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>Lumpsum Details</div>
          <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '8px' }}>Assumptions for this growth projection.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '8px', fontSize: '11px' }}>
            <div>
              <div style={{ color: '#9ca3af' }}>Initial Investment</div>
              <div style={{ fontWeight: 600, color: '#a5b4fc' }}>{formatCurrency(amount)}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af' }}>Time Horizon</div>
              <div style={{ fontWeight: 600, color: '#a5b4fc' }}>{years} years</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af' }}>Expected Return</div>
              <div style={{ fontWeight: 600, color: '#22c55e' }}>{rate}% p.a.</div>
            </div>
          </div>
        </div>

        <div style={{ borderRadius: '16px', padding: '14px 16px', background: 'linear-gradient(135deg,rgba(16,185,129,0.18),rgba(6,182,212,0.12))', border: '1px solid rgba(16,185,129,0.45)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6ee7b7', marginBottom: '4px' }}>
            Projected Value
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#bbf7d0' }}>{formatCurrency(corpus)}</div>
          <div style={{ fontSize: '10px', color: '#e5e7eb', marginTop: '4px' }}>
            Estimated value after {years} years based on {rate}% annual growth.
          </div>
        </div>
      </section>

      {/* VISUAL BREAKDOWN (Donut Style) */}
      <section style={{ borderRadius: '16px', padding: '16px 18px', background: 'radial-gradient(circle at top left,#020617,#020617)', border: '1px solid rgba(148,163,184,0.35)', marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Visual breakdown — principal vs growth</div>
        <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '10px' }}>
          One part shows your original capital, and the other shows what compounding adds on top.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 140, height: 140 }}>
            <svg width={140} height={140} viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={center} cy={center} r={radius} fill="none" stroke="#0f172a" strokeWidth={strokeWidth} />
              <circle cx={center} cy={center} r={radius} fill="none" stroke="#0ea5e9" strokeWidth={strokeWidth} strokeDasharray={baseDashArray} strokeDashoffset={0} strokeLinecap="round" />
              <circle cx={center} cy={center} r={radius} fill="none" stroke="#22c55e" strokeWidth={strokeWidth} strokeDasharray={growthDashArray} strokeDashoffset={0} strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', pointerEvents: 'none' }}>
              <div style={{ fontSize: '10px', color: '#9ca3af' }}>Total Value</div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{formatCurrency(corpus)}</div>
            </div>
          </div>

          <div style={{ fontSize: '11px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              <LegendRow color="#0ea5e9" label="Initial Investment" amount={amount} share={safeInvestedShare} />
              <LegendRow color="#22c55e" label="Growth / Returns" amount={growth} share={safeGrowthShare} />
            </div>
            <div style={{ fontSize: '10px', color: '#9ca3af', lineHeight: '1.4' }}>
              The blue portion represents your initial investment capital. The green portion is the wealth created through market returns over the chosen period.
            </div>
          </div>
        </div>
      </section>

      {/* SCENARIO TABLE (SIP Style) */}
      <section style={{ borderRadius: '16px', padding: '14px 16px', background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(148,163,184,0.35)', marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Scenario Comparison</div>
        <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '8px' }}>
          See how your final wealth changes if returns are slightly lower or higher than expected.
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid rgba(51,65,85,0.9)', color: '#9ca3af' }}>Scenario</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid rgba(51,65,85,0.9)', color: '#9ca3af' }}>Return (% p.a.)</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid rgba(51,65,85,0.9)', color: '#9ca3af' }}>Projected Value</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s, index) => (
              <tr key={index}>
                <td style={{ padding: '8px', borderBottom: '1px solid rgba(31,41,55,0.85)' }}>{s.label}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid rgba(31,41,55,0.85)', color: '#a5b4fc' }}>{s.rate}%</td>
                <td style={{ padding: '8px', borderBottom: '1px solid rgba(31,41,55,0.85)', color: '#6ee7b7', fontWeight: 600 }}>{formatCurrency(s.corpus)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* FOOTER (SIP Style) */}
      <section style={{ borderRadius: '16px', padding: '12px 14px', background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(55,65,81,0.9)', fontSize: '9px', color: '#9ca3af', lineHeight: '1.5' }}>
        <p>
          This is an educational illustration, not a promise of guaranteed returns. Actual investment performance varies based on market conditions. 
          Lumpsum investing requires a long-term perspective to navigate market volatility. Review your plan regularly.
        </p>
      </section>
    </div>
  );
};

function LegendRow({ color, label, amount, share }: { color: string; label: string; amount: number; share: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, marginTop: 4 }} />
      <div>
        <div style={{ fontSize: '11px', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: '10px', color: '#e5e7eb' }}>{formatCurrency(amount)}</div>
        <div style={{ fontSize: '9px', color: '#9ca3af' }}>{formatPercent(share)} of final value</div>
      </div>
    </div>
  );
}

export default LumpsumPdfReport;