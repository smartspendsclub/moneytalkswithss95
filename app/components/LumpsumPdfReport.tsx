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

function formatNumber(num: number | undefined) {
  if (!num || Number.isNaN(num)) return '0';
  // Use Indian rupee formatting
  return num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

const thStyle: React.CSSProperties = {
  borderBottom: '1px solid rgba(148,163,184,0.5)',
  padding: '4px 6px',
  textAlign: 'left',
  color: '#cbd5f5',
  fontWeight: 500,
};

const tdStyle: React.CSSProperties = {
  padding: '3px 6px',
  borderBottom: '1px solid rgba(30,41,59,0.9)',
  color: '#e5e7eb',
};

export default function LumpsumPdfReport({
  amount,
  years,
  rate,
  corpus,
  growth,
  investedShare,
  returnsShare,
  scenarios,
}: LumpsumPdfReportProps) {
  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Ensure percentages are safe and between 0 and 100
  const investPct = Math.min(Math.max(investedShare, 0), 100);
  const growthPct = Math.min(Math.max(returnsShare, 0), 100);

  // --- Donut geometry (SVG based) --------------------------------------------
  const radius = 52;
  const strokeWidth = 14;
  const center = 70; // 52 (radius) + 18 (margin/padding) + 0/2 (stroke-width)
  const svgSize = center * 2; // 140x140

  // Guard against NaN
  const circumferenceRaw = 2 * Math.PI * radius;
  const circumference = Number.isFinite(circumferenceRaw) ? circumferenceRaw : 0;

  // Length for the growth arc (green overlay)
  const growthLenRaw = (growthPct / 100) * circumference;
  const growthLength = Number.isFinite(growthLenRaw) ? growthLenRaw : 0;

  // Invested (blue) full ring dasharray (just full circle)
  const investedDashArray =
    circumference > 0 ? `${circumference} ${circumference}` : '0 0';

  // Growth arc dasharray (green overlay)
  const growthDashArray =
    circumference > 0
      ? `${growthLength} ${circumference - growthLength}`
      : '0 0';
  // ---------------------------------------------------------------------------

  return (
    <div
      style={{
        width: '794px', // A4 width at ~96dpi
        backgroundColor: '#020617',
        color: '#e5e7eb',
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: '11px',
      }}
    >
      <div
        className="pdf-page"
        style={{
          minHeight: '1123px',
          padding: '16px',
          borderRadius: '16px',
          background:
            'radial-gradient(circle at top, #0f172a 0, #020617 60%, #020617 100%)',
          boxShadow: '0 20px 50px rgba(15,23,42,0.8)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(148,163,184,0.4)',
            paddingBottom: '8px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#22c55e',
                }}
              >
                Money<span style={{ color: '#38bdf8' }}>Talks</span>
              </span>
              <span
                style={{
                  fontSize: '9px',
                  color: '#9ca3af',
                }}
              >
                with SS
              </span>
            </div>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#e5e7eb',
              }}
            >
              Lumpsum Investment Plan
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px' }}>
            <p style={{ color: '#94a3b8' }}>Report date</p>
            <p style={{ color: '#e5e7eb', fontWeight: 500 }}>{today}</p>
          </div>
        </div>

        {/* Snapshot */}
        <div
          style={{
            borderRadius: '16px',
            border: '1px solid rgba(56,189,248,0.6)',
            background:
              'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(8,47,73,0.98))',
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ maxWidth: '60%' }}>
            <p
              style={{
                fontSize: '10px',
                color: '#7dd3fc',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Lumpsum snapshot
            </p>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#f9fafb',
                marginTop: '4px',
              }}
            >
              One-time investment of ₹ {formatNumber(amount)} for {years} years
            </p>
            <p
              style={{
                fontSize: '10px',
                color: '#cbd5f5',
                marginTop: '2px',
              }}
            >
              At an expected return of {rate}% per year.
            </p>

            <div style={{ marginTop: '8px', fontSize: '10px' }}>
              <p>
                Principal invested:{' '}
                <span style={{ fontWeight: 500 }}>
                  ₹ {formatNumber(amount)}
                </span>
              </p>
              <p>
                Estimated future value:{' '}
                <span style={{ fontWeight: 500 }}>
                  ₹ {formatNumber(corpus)}
                </span>
              </p>
              <p>
                Approximate growth / returns:{' '}
                <span style={{ fontWeight: 500 }}>
                  ₹ {formatNumber(growth)}
                </span>
              </p>
            </div>
          </div>

          <div
            style={{
              minWidth: '40%',
              textAlign: 'right',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '10px',
                  color: '#bae6fd',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Projected value
              </p>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#7dd3fc',
                }}
              >
                ₹ {formatNumber(corpus)}
              </p>
              <p
                style={{
                  fontSize: '9px',
                  color: '#9ca3af',
                }}
              >
                After {years} years at {rate}% p.a.
              </p>
            </div>
          </div>
        </div>

        {/* Scenario comparison */}
        <div
          style={{
            borderRadius: '12px',
            border: '1px solid rgba(148,163,184,0.4)',
            background:
              'linear-gradient(135deg, rgba(15,23,42,0.97), rgba(15,23,42,0.9))',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#e5e7eb',
              }}
            >
              Scenario comparison
            </p>
            <p
              style={{
                fontSize: '9px',
                color: '#9ca3af',
              }}
            >
              These scenarios show how the final value changes for slightly lower /
              higher returns.
            </p>
          </div>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '9px',
              marginTop: '4px',
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Scenario</th>
                <th style={thStyle}>Return (% p.a.)</th>
                <th style={thStyle}>Projected value (₹)</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((s) => (
                <tr key={s.label}>
                  <td style={tdStyle}>{s.label}</td>
                  <td style={tdStyle}>{s.rate}</td>
                  <td style={tdStyle}>₹ {formatNumber(s.corpus)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual breakdown — principal vs growth (FIXED & IMPROVED) */}
        <div
          style={{
            borderRadius: '12px',
            border: '1px solid rgba(56,189,248,0.7)',
            background:
              'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(8,47,73,0.98))',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#e0f2fe',
            }}
          >
            Visual breakdown — principal vs growth
          </p>
          <p
            style={{
              fontSize: '9px',
              color: '#bae6fd',
            }}
          >
            This mirrors the split view in the Lumpsum calculator. One part shows your
            original capital, the other shows what compounding adds on top.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '26px',
              marginTop: '6px',
            }}
          >
            {/* Donut chart – using SVG for reliable rendering */}
            <div
              style={{
                position: 'relative',
                width: `${svgSize}px`,
                height: `${svgSize}px`,
              }}
            >
              <svg
                width={svgSize}
                height={svgSize}
                viewBox={`0 0 ${svgSize} ${svgSize}`}
                style={{ transform: 'rotate(-90deg)' }}
              >
                {/* base ring (dark background) */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth={strokeWidth}
                />
                {/* invested (blue) full ring – background/main segment */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth={strokeWidth}
                  strokeDasharray={investedDashArray}
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
                <span
                  style={{
                    fontSize: '9px',
                    color: '#9ca3af',
                  }}
                >
                  Final value
                </span>
                <span
                  style={{
                    fontSize: '13px', // Slightly larger than before
                    fontWeight: 600,
                    color: '#e5e7eb',
                  }}
                >
                  ₹ {formatNumber(corpus)}
                </span>
                <span
                  style={{
                    marginTop: '4px',
                    fontSize: '9px',
                    color: '#cbd5f5',
                  }}
                >
                  {investPct.toFixed(0)}% principal
                </span>
                <span
                  style={{
                    fontSize: '9px',
                    color: '#cbd5f5',
                  }}
                >
                  {growthPct.toFixed(0)}% growth
                </span>
              </div>
            </div>

            {/* Legend / stats */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px', // Increased gap for clarity
                fontSize: '10px',
              }}
            >
              <LegendItem
                color="#38bdf8"
                label="You invest (principal)"
                value={`₹ ${formatNumber(amount)}`}
                percent={`${investPct.toFixed(0)}% of final value`}
              />
              <LegendItem
                color="#22c55e"
                label="Growth / returns"
                value={`₹ ${formatNumber(growth)}`}
                percent={`${growthPct.toFixed(0)}% of final value`}
              />
              <LegendItem
                color="#a855f7"
                label="Total value"
                value={`₹ ${formatNumber(corpus)}`}
                percent={'100% of final value'}
              />
            </div>
          </div>

          <p
            style={{
              fontSize: '9px',
              color: '#cbd5f5',
              marginTop: '4px',
            }}
          >
            The blue slice is the money you put in. The green slice is the extra wealth
            created by compounding at the assumed return. The longer you give the money, the more powerful
            this growth portion becomes.
          </p>
        </div>

        {/* Explanation & detailed guidance */}
        <div
          style={{
            borderRadius: '12px',
            border: '1px solid rgba(148,163,184,0.5)',
            background: 'rgba(15,23,42,0.95)',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#e5e7eb',
            }}
          >
            How to read this lumpsum projection
          </p>

          <p
            style={{
              fontSize: '9px',
              color: '#d1d5db',
            }}
          >
            This projection assumes you invest{' '}
            <span style={{ fontWeight: 500 }}>
              ₹ {formatNumber(amount)} once and stay invested for {years} years
            </span>{' '}
            without withdrawing, and that your investment earns an average of{' '}
            <span style={{ fontWeight: 500 }}>{rate}% per year</span>. Under these
            assumptions, the investment could grow to about{' '}
            <span style={{ fontWeight: 500 }}>
              ₹ {formatNumber(corpus)} at the end of the period.
            </span>
          </p>

          <p
            style={{
              fontSize: '9px',
              color: '#d1d5db',
            }}
          >
            Out of this, your original capital is{' '}
            <span style={{ fontWeight: 500 }}>
              ₹ {formatNumber(amount)} ({investPct.toFixed(0)}% of the final value)
            </span>
            , while the remaining{' '}
            <span style={{ fontWeight: 500 }}>
              ₹ {formatNumber(growth)} ({growthPct.toFixed(0)}%)
            </span>{' '}
            comes from compounding. The longer you give the money, the more powerful
            this growth portion becomes.
          </p>

          <p
            style={{
              fontSize: '9px',
              color: '#d1d5db',
            }}
          >
            Actual market returns will be uneven and may be higher or lower than{' '}
            {rate}% in any given year. This report is a planning guide, not a promise.
            Large one-time investments should match your risk profile, time horizon and
            liquidity needs.
          </p>

          <p
            style={{
              fontSize: '9px',
              color: '#d1d5db',
            }}
          >
            You can reduce risk by:
          </p>
          <ul
            style={{
              fontSize: '9px',
              color: '#d1d5db',
              paddingLeft: '14px',
              marginTop: '0px',
            }}
          >
            <li>Spreading your lumpsum across suitable funds instead of one product.</li>
            <li>Avoiding panic selling during short-term market falls.</li>
            <li>
              Reviewing this plan whenever your goal, time horizon or risk comfort
              changes.
            </li>
          </ul>

          <p
            style={{
              fontSize: '9px',
              color: '#9ca3af',
              marginTop: '4px',
            }}
          >
            This report is for educational use only. It is not individual investment,
            tax or legal advice.
          </p>
          <p
            style={{
              fontSize: '9px',
              color: '#cbd5f5',
            }}
          >
            For personalised guidance, you can reach out at:{' '}
            <span style={{ fontWeight: 500 }}>smartspendsclub@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function LegendItem({
  color,
  label,
  value,
  percent,
}: {
  color: string;
  label: string;
  value: string;
  percent: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '6px',
      }}
    >
      <span
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '999px',
          backgroundColor: color,
          marginTop: '3px',
        }}
      />
      <div>
        <p
          style={{
            fontSize: '10px',
            fontWeight: 600,
            color: '#e5e7eb',
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: '9px',
            color: '#d1d5db',
          }}
        >
          {value}
        </p>
        <p
          style={{
            fontSize: '9px',
            color: '#9ca3af',
          }}
        >
          {percent}
        </p>
      </div>
    </div>
  );
}