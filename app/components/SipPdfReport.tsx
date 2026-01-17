'use client';

import React from 'react';

type ScenarioRow = {
  key: 'conservative' | 'base' | 'optimistic';
  label: string;
  returnRate: number;
  projectedCorpus: number;
};

type SipPdfReportProps = {
  planTitle: string;
  monthlyInvestment: number;
  years: number;
  expectedReturn: number;
  projectedCorpus: number;
  totalInvested: number;
  growthAmount: number;
  growthShare: number; // % of final corpus that is growth
  scenarios: ScenarioRow[];
};

const formatCurrency = (n: number) =>
  `₹ ${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const formatPercent = (n: number) => `${n.toFixed(0)}%`;

export const SipPdfReport: React.FC<SipPdfReportProps> = ({
  planTitle,
  monthlyInvestment,
  years,
  expectedReturn,
  projectedCorpus,
  totalInvested,
  growthAmount,
  growthShare,
  scenarios,
}) => {
  // --- Safe percentages ------------------------------------------------------
  const safeGrowthShare =
    typeof growthShare === 'number' && Number.isFinite(growthShare)
      ? Math.min(Math.max(growthShare, 0), 100)
      : 0;

  const investedShare = 100 - safeGrowthShare;

  // --- Donut geometry (guard every step against NaN) -------------------------
  const radius = 52;
  const strokeWidth = 14;
  const center = 70;

  const circumferenceRaw = 2 * Math.PI * radius;
  const circumference = Number.isFinite(circumferenceRaw)
    ? circumferenceRaw
    : 0;

  const growthLenRaw = (safeGrowthShare / 100) * circumference;
  const growthLength = Number.isFinite(growthLenRaw) ? growthLenRaw : 0;

  // base ring dasharray (just full circle)
  const baseDashArray =
    circumference > 0 ? `${circumference} ${circumference}` : '0 0';

  // growth arc dasharray (green overlay)
  const growthDashArray =
    circumference > 0
      ? `${growthLength} ${circumference - growthLength}`
      : '0 0';

  const reportDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      className="pdf-page"
      style={{
        width: '794px', // A4 width at ~96dpi
        minHeight: '1123px',
        padding: '32px 40px',
        boxSizing: 'border-box',
        background:
          'radial-gradient(circle at top, #020617 0, #020617 35%, #020617 60%, #020617 100%)',
        color: '#e5e7eb',
        fontFamily:
          '-apple-system,BlinkMacSystemFont,system-ui,Segoe UI,Roboto,sans-serif',
        fontSize: '12px',
      }}
    >
      {/* HEADER ---------------------------------------------------------------- */}
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
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#38bdf8',
            }}
          >
            MoneyTalks <span style={{ color: '#a5b4fc' }}>with SS</span>
          </div>
          <div
            style={{
              marginTop: '4px',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            {planTitle}
          </div>
          <div
            style={{
              marginTop: '2px',
              fontSize: '10px',
              color: '#94a3b8',
            }}
          >
            SIP projection summary – personalised illustration
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '10px' }}>
          <div style={{ color: '#94a3b8' }}>Report date</div>
          <div
            style={{
              fontWeight: 600,
              color: '#e5e7eb',
              marginTop: '2px',
            }}
          >
            {reportDate}
          </div>
        </div>
      </header>

      {/* TOP SUMMARY ----------------------------------------------------------- */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1.4fr',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        {/* Left: plan inputs */}
        <div
          style={{
            borderRadius: '16px',
            padding: '14px 16px',
            background: 'rgba(15,23,42,0.95)',
            border: '1px solid rgba(148,163,184,0.35)',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              marginBottom: '6px',
            }}
          >
            Your SIP plan
          </div>
          <div
            style={{
              fontSize: '10px',
              color: '#9ca3af',
              marginBottom: '8px',
            }}
          >
            These are the assumptions used to build this projection.
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
              gap: '8px',
              fontSize: '11px',
            }}
          >
            <div>
              <div style={{ color: '#9ca3af' }}>Monthly SIP</div>
              <div
                style={{
                  fontWeight: 600,
                  color: '#a5b4fc',
                }}
              >
                {formatCurrency(monthlyInvestment)}
              </div>
            </div>
            <div>
              <div style={{ color: '#9ca3af' }}>Investment period</div>
              <div
                style={{
                  fontWeight: 600,
                  color: '#a5b4fc',
                }}
              >
                {years} years
              </div>
            </div>
            <div>
              <div style={{ color: '#9ca3af' }}>Expected return</div>
              <div
                style={{
                  fontWeight: 600,
                  color: '#22c55e',
                }}
              >
                {expectedReturn}% p.a.
              </div>
            </div>
          </div>
        </div>

        {/* Right: projected corpus */}
        <div
          style={{
            borderRadius: '16px',
            padding: '14px 16px',
            background:
              'linear-gradient(135deg,rgba(16,185,129,0.18),rgba(6,182,212,0.12))',
            border: '1px solid rgba(16,185,129,0.45)',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#6ee7b7',
              marginBottom: '4px',
            }}
          >
            Projected corpus
          </div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#bbf7d0',
            }}
          >
            {formatCurrency(projectedCorpus)}
          </div>
          <div
            style={{
              fontSize: '10px',
              color: '#e5e7eb',
              marginTop: '4px',
            }}
          >
            At the end of {years} years, assuming a constant {expectedReturn}%
            p.a. return and uninterrupted SIP contributions.
          </div>
        </div>
      </section>

      {/* SPLIT VIEW – YOU vs GROWTH ------------------------------------------- */}
      <section
        style={{
          borderRadius: '16px',
          padding: '16px 18px',
          background: 'radial-gradient(circle at top left,#020617,#020617)',
          border: '1px solid rgba(148,163,184,0.35)',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '4px',
          }}
        >
          Visual breakdown — you vs growth
        </div>
        <div
          style={{
            fontSize: '10px',
            color: '#9ca3af',
            marginBottom: '10px',
          }}
        >
          This donut mirrors the split-view chart in the SIP calculator. One
          part shows what you invest, and the other shows what growth is doing
          for you.
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          {/* Donut */}
          <div style={{ position: 'relative', width: 140, height: 140 }}>
            <svg
              width={140}
              height={140}
              viewBox="0 0 140 140"
              style={{ transform: 'rotate(-90deg)' }}
            >
              {/* base ring */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#0f172a"
                strokeWidth={strokeWidth}
              />
              {/* invested (blue) full ring – background */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#0ea5e9"
                strokeWidth={strokeWidth}
                strokeDasharray={baseDashArray}
                strokeDashoffset={0}
                strokeLinecap="round"
              />
              {/* growth overlay (green) */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#22c55e"
                strokeWidth={strokeWidth}
                strokeDasharray={growthDashArray}
                strokeDashoffset={0}
                strokeLinecap="round"
              />
            </svg>

            {/* Center label (not rotated) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  color: '#9ca3af',
                }}
              >
                Final value
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                {formatCurrency(projectedCorpus)}
              </div>
            </div>
          </div>

          {/* Legend + explanation */}
          <div style={{ fontSize: '11px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                marginBottom: 10,
              }}
            >
              <LegendRow
                color="#0ea5e9"
                label="You invest"
                amount={totalInvested}
                share={investedShare}
              />
              <LegendRow
                color="#22c55e"
                label="Growth / returns"
                amount={growthAmount}
                share={safeGrowthShare}
              />
            </div>
            <div style={{ fontSize: '10px', color: '#9ca3af' }}>
              The blue portion is the total amount you contribute over the
              years. The green portion is the extra amount that comes from
              compounding at the assumed return rate.
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '10px',
            fontSize: '9px',
            color: '#6b7280',
          }}
        >
          In the live tool, this appears as an interactive chart. This report
          uses a static view so you can keep a record or share it easily.
        </div>
      </section>

      {/* SCENARIO TABLE -------------------------------------------------------- */}
      <section
        style={{
          borderRadius: '16px',
          padding: '14px 16px',
          background: 'rgba(15,23,42,0.95)',
          border: '1px solid rgba(148,163,184,0.35)',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '4px',
          }}
        >
          What this means for you
        </div>
        <div
          style={{
            fontSize: '10px',
            color: '#9ca3af',
            marginBottom: '8px',
          }}
        >
          These scenarios show how your final corpus changes if long-term
          returns end up a bit lower or higher than your current assumption.
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '10px',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'left',
                  padding: '6px',
                  borderBottom: '1px solid rgba(51,65,85,0.9)',
                  color: '#9ca3af',
                }}
              >
                Scenario
              </th>
              <th
                style={{
                  textAlign: 'left',
                  padding: '6px',
                  borderBottom: '1px solid rgba(51,65,85,0.9)',
                  color: '#9ca3af',
                }}
              >
                Return assumption
              </th>
              <th
                style={{
                  textAlign: 'left',
                  padding: '6px',
                  borderBottom: '1px solid rgba(51,65,85,0.9)',
                  color: '#9ca3af',
                }}
              >
                Projected corpus
              </th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s, index) => (
              <tr key={s.key || index}>
                <td
                  style={{
                    padding: '6px',
                    borderBottom: '1px solid rgba(31,41,55,0.85)',
                  }}
                >
                  {s.label}
                </td>
                <td
                  style={{
                    padding: '6px',
                    borderBottom: '1px solid rgba(31,41,55,0.85)',
                    color: '#a5b4fc',
                  }}
                >
                  {s.returnRate}% p.a.
                </td>
                <td
                  style={{
                    padding: '6px',
                    borderBottom: '1px solid rgba(31,41,55,0.85)',
                    color: '#6ee7b7',
                    fontWeight: 600,
                  }}
                >
                  {formatCurrency(s.projectedCorpus)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* FOOTER NOTE ---------------------------------------------------------- */}
      <section
        style={{
          borderRadius: '16px',
          padding: '12px 14px',
          background: 'rgba(15,23,42,0.95)',
          border: '1px solid rgba(55,65,81,0.9)',
          fontSize: '9px',
          color: '#9ca3af',
        }}
      >
        <p>
          This is an educational illustration, not a promise. Actual returns can
          be higher or lower, and real SIP investing involves market ups and
          downs, taxes and costs. Use this report as a starting point to discuss
          your plan and review it regularly as your income and responsibilities
          change.
        </p>
        <p style={{ marginTop: '4px' }}>
          For more clarity or a personalised review, feel free to reach out
          using the contact details shared in the tool.
        </p>
      </section>
    </div>
  );
};

function LegendRow({
  color,
  label,
  amount,
  share,
}: {
  color: string;
  label: string;
  amount: number;
  share: number;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 6,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '999px',
          backgroundColor: color,
          marginTop: 3,
        }}
      />
      <div>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 600, 
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: '10px',
            color: '#e5e7eb',
          }}
        >
          {formatCurrency(amount)}
        </div>
        <div
          style={{
            fontSize: '9px',
            color: '#9ca3af',
          }}
        >
          {formatPercent(Number.isFinite(share) ? share : 0)} of final corpus
        </div>
      </div>
    </div>
  );
}

export default SipPdfReport;