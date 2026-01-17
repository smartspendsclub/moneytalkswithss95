"use client";

import React from "react";

type InvestMode = "sip" | "lumpsum";

type ScenarioRow = {
  key: "base" | "optimistic" | "conservative";
  label: string;
  inflation: number;
  returns: number;
  requiredAmount: number;
};

interface PdfReportProps {
  goalName: string;
  goalTypeLabel: string;
  yearsToGoal: number;
  costToday: number;
  futureCost: number;
  mode: InvestMode;
  requiredAmount: number;
  totalInvested: number;
  growthAmount: number;
  returnsShare: number;
  inflationRate: number;
  returnRate: number;
  scenarios: ScenarioRow[];
}

function formatNumber(num: number | undefined) {
  if (!num || Number.isNaN(num)) return "0";
  return num.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
}

export const PdfReport: React.FC<PdfReportProps> = ({
  goalName,
  goalTypeLabel,
  yearsToGoal,
  costToday,
  futureCost,
  mode,
  requiredAmount,
  totalInvested,
  growthAmount,
  returnsShare,
  inflationRate,
  returnRate,
  scenarios,
}) => {
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const investedShare = Math.max(0, 100 - returnsShare);

  let riskLabel = "Balanced projection";
  if (returnsShare < 40) riskLabel = "Conservative projection";
  else if (returnsShare > 60) riskLabel = "Aggressive projection";

  // clamp for safety
  const investPct = Math.min(Math.max(investedShare, 0), 100);
  const growthPct = Math.min(Math.max(returnsShare, 0), 100);

  // donut geometry
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const investLength = (investPct / 100) * circumference;
  const growthLength = (growthPct / 100) * circumference;

  return (
    <div
      className="pdf-report font-sans text-[11px]"
      style={{
        width: "794px", // about A4 width at 96dpi
        backgroundColor: "#020617",
        color: "#e5e7eb",
        padding: "24px",
      }}
    >
      {/* PAGE 1 ------------------------------------------------------------ */}
      <div
        className="pdf-page"
        style={{
          minHeight: "1123px", // about A4 height at 96dpi
          padding: "16px",
          borderRadius: "16px",
          background:
            "radial-gradient(circle at top, #0f172a 0, #020617 60%, #020617 100%)",
          boxShadow: "0 20px 50px rgba(15,23,42,0.8)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(148,163,184,0.4)",
            paddingBottom: "8px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#94a3b8",
              }}
            >
              MoneyTalks with SS
            </p>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#e5e7eb",
              }}
            >
              Goal Investment Plan
            </p>
          </div>
          <div style={{ textAlign: "right", fontSize: "10px" }}>
            <p style={{ color: "#94a3b8" }}>Report date</p>
            <p style={{ color: "#e5e7eb", fontWeight: 500 }}>{today}</p>
          </div>
        </div>

        {/* Goal snapshot hero */}
        <div
          style={{
            borderRadius: "16px",
            border: "1px solid rgba(56,189,248,0.6)",
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(8,47,73,0.98))",
            padding: "14px 16px",
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ maxWidth: "60%" }}>
            <p
              style={{
                fontSize: "10px",
                color: "#7dd3fc",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Goal snapshot
            </p>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#f9fafb",
                marginTop: "4px",
              }}
            >
              {goalName}
            </p>
            <p
              style={{
                fontSize: "10px",
                color: "#cbd5f5",
                marginTop: "2px",
              }}
            >
              {goalTypeLabel} · {yearsToGoal} years
            </p>

            <div style={{ marginTop: "8px", fontSize: "10px" }}>
              <p>
                Cost today:{" "}
                <span style={{ fontWeight: 500 }}>
                  ₹ {formatNumber(costToday)}
                </span>
              </p>
              <p>
                Estimated future cost (at goal year):{" "}
                <span style={{ fontWeight: 500 }}>
                  ₹ {formatNumber(futureCost)}
                </span>
              </p>
              <p>
                Inflation assumption:{" "}
                <span style={{ fontWeight: 500 }}>{inflationRate}% p.a.</span>
              </p>
            </div>
          </div>

          <div
            style={{
              minWidth: "40%",
              textAlign: "right",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "10px",
                  color: "#bae6fd",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Investment plan
              </p>
              <p
                style={{
                  fontSize: "10px",
                  color: "#93c5fd",
                  marginTop: "2px",
                }}
              >
                Mode: {mode === "sip" ? "Monthly SIP" : "One-time lumpsum"}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "10px",
                  color: "#e5e7eb",
                }}
              >
                {mode === "sip"
                  ? "Required monthly SIP"
                  : "Required one-time amount"}
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#7dd3fc",
                }}
              >
                ₹ {formatNumber(requiredAmount)}
              </p>
              <p
                style={{
                  fontSize: "9px",
                  color: "#9ca3af",
                }}
              >
                Based on your inputs and assumptions today.
              </p>
            </div>
          </div>
        </div>

        {/* Three mini cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "10px",
          }}
        >
          <MiniCard
            title="You invest"
            value={`₹ ${formatNumber(totalInvested)}`}
            subtitle={`Total amount you invest over ${yearsToGoal} years.`}
          />
          <MiniCard
            title="Growth / returns"
            value={`₹ ${formatNumber(growthAmount)}`}
            subtitle="Approximate amount coming from compounding."
            accent="green"
          />
          <MiniCard
            title="Contribution mix"
            value=""
            subtitle=""
            extra={
              <div style={{ fontSize: "9px", color: "#e5e7eb" }}>
                <p>
                  From your investment:{" "}
                  <span style={{ fontWeight: 500 }}>
                    {investedShare.toFixed(0)}%
                  </span>
                </p>
                <p>
                  From growth / returns:{" "}
                  <span style={{ fontWeight: 500 }}>
                    {returnsShare.toFixed(0)}%
                  </span>
                </p>
              </div>
            }
          />
        </div>

        {/* Scenario comparison table */}
        <div
          style={{
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.4)",
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.97), rgba(15,23,42,0.9))",
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#e5e7eb",
              }}
            >
              Scenario comparison
            </p>
            <p
              style={{
                fontSize: "9px",
                color: "#9ca3af",
              }}
            >
              These scenarios illustrate how different assumptions change the
              required amount.
            </p>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "9px",
              marginTop: "4px",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Scenario</th>
                <th style={thStyle}>Inflation (% p.a.)</th>
                <th style={thStyle}>Return (% p.a.)</th>
                <th style={thStyle}>
                  {mode === "sip"
                    ? "Required SIP (₹ / month)"
                    : "Required lumpsum (₹)"}
                </th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((s) => (
                <tr key={s.key}>
                  <td style={tdStyle}>{s.label}</td>
                  <td style={tdStyle}>{s.inflation}</td>
                  <td style={tdStyle}>{s.returns}</td>
                  <td style={tdStyle}>₹ {formatNumber(s.requiredAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual breakdown — split view mirror (SVG donut) */}
        <div
          style={{
            borderRadius: "12px",
            border: "1px solid rgba(56,189,248,0.7)",
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(8,47,73,0.98))",
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#e0f2fe",
            }}
          >
            Visual breakdown — you vs growth
          </p>
          <p
            style={{
              fontSize: "9px",
              color: "#bae6fd",
            }}
          >
            This donut mirrors the split-view chart in the Goal Investment
            Planner. One part shows what you invest, and the other shows what
            growth is doing for you.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "22px",
              marginTop: "6px",
            }}
          >
            {/* SVG donut with two coloured arcs */}
            <div
              style={{
                position: "relative",
                width: 160,
                height: 160,
                marginLeft: 4,
                filter: "drop-shadow(0 0 18px rgba(0,184,255,0.4))",
              }}
            >
              <svg
                width={160}
                height={160}
                viewBox="0 0 160 160"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              >
                <g transform="translate(80,80) rotate(-90)">
                  {/* background ring */}
                  <circle
                    r={radius}
                    fill="none"
                    stroke="#020617"
                    strokeWidth={18}
                  />
                  {/* invest arc (blue) */}
                  <circle
                    r={radius}
                    fill="none"
                    stroke="#00b0ff"
                    strokeWidth={18}
                    strokeLinecap="round"
                    strokeDasharray={`${investLength} ${
                      circumference - investLength
                    }`}
                    strokeDashoffset={0}
                  />
                  {/* growth arc (green), starting where invest ends */}
                  <circle
                    r={radius}
                    fill="none"
                    stroke="#00e676"
                    strokeWidth={18}
                    strokeLinecap="round"
                    strokeDasharray={`${growthLength} ${
                      circumference - growthLength
                    }`}
                    strokeDashoffset={-investLength}
                  />
                </g>
              </svg>

              {/* inner label */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 92,
                  height: 92,
                  borderRadius: "999px",
                  background:
                    "linear-gradient(135deg, #071222 0%, #0a203e 100%)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    color: "#d4eaff",
                  }}
                >
                  Final value
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  ₹ {formatNumber(futureCost)}
                </span>
              </div>
            </div>

            {/* Legend + explanation (3-part breakdown) */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <LegendItem
                  color="#00b0ff"
                  label="You invest"
                  value={`₹ ${formatNumber(totalInvested)}`}
                  percent={`${investPct.toFixed(0)}% of goal`}
                />
                <LegendItem
                  color="#00e676"
                  label="Growth / returns"
                  value={`₹ ${formatNumber(growthAmount)}`}
                  percent={`${growthPct.toFixed(0)}% of goal`}
                />
                <LegendItem
                  color="#a855f7"
                  label="Total goal value"
                  value={`₹ {formatNumber(futureCost)}`}
                  percent={"100% of goal"}
                />
              </div>
              <p
                style={{
                  fontSize: "9px",
                  color: "#cbd5f5",
                  marginTop: "4px",
                }}
              >
                The blue portion is the total money you contribute over the
                years. The green portion is the extra amount that comes from
                compounding at the assumed return rate. Together they add up to
                the final goal value shown in the center.
              </p>
            </div>
          </div>

          <p
            style={{
              fontSize: "9px",
              color: "#cbd5f5",
              marginTop: "2px",
            }}
          >
            In the live tool, this appears as an interactive chart. This report
            uses a static view so you can keep a record or share it easily.
          </p>
        </div>

        {/* What this means for you */}
        <div
          style={{
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.5)",
            background: "rgba(15,23,42,0.95)",
            padding: "10px 12px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#e5e7eb",
            }}
          >
            What this means for you
          </p>
          <p
            style={{
              fontSize: "9px",
              color: "#d1d5db",
              marginTop: "4px",
            }}
          >
            At these assumptions, around{" "}
            <span style={{ fontWeight: 500 }}>
              {returnsShare.toFixed(0)}%
            </span>{" "}
            of the final goal value is expected to come from investment growth
            and about{" "}
            <span style={{ fontWeight: 500 }}>
              {investedShare.toFixed(0)}%
            </span>{" "}
            from your own contributions.
          </p>
          <p
            style={{
              fontSize: "9px",
              color: "#e5e7eb",
              marginTop: "4px",
              fontWeight: 500,
            }}
          >
            {riskLabel}
          </p>
          <p
            style={{
              fontSize: "9px",
              color: "#d1d5db",
              marginTop: "2px",
            }}
          >
            If this balance does not feel comfortable, you can adjust the goal
            amount, the time horizon, or the expected return in the Goal
            Investment Planner and generate a fresh plan.
          </p>
        </div>
      </div>

      {/* PAGE 2 ------------------------------------------------------------ */}
      <div
        className="pdf-page"
        style={{
          minHeight: "1123px",
          padding: "16px",
          marginTop: "24px",
          borderRadius: "16px",
          background:
            "radial-gradient(circle at top, #020617 0, #020617 40%, #020617 100%)",
          boxShadow: "0 20px 50px rgba(15,23,42,0.8)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {/* Detailed inputs */}
        <div
          style={{
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.4)",
            background: "rgba(15,23,42,0.96)",
            padding: "10px 12px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#e5e7eb",
            }}
          >
            Detailed inputs and assumptions
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "8px",
              marginTop: "6px",
              fontSize: "9px",
            }}
          >
            <div>
              <p style={detailLabel}>Goal details</p>
              <p>Goal name: {goalName}</p>
              <p>Goal type: {goalTypeLabel}</p>
              <p>Time horizon: {yearsToGoal} years</p>
              <p>Cost today: ₹ {formatNumber(costToday)}</p>
              <p>Estimated future cost: ₹ {formatNumber(futureCost)}</p>
            </div>
            <div>
              <p style={detailLabel}>Plan inputs</p>
              <p>
                Mode:{" "}
                {mode === "sip"
                  ? "Monthly SIP (systematic investment)"
                  : "One-time lumpsum"}
              </p>
              <p>
                {mode === "sip"
                  ? "Required monthly SIP"
                  : "Required one-time amount"}
                : ₹ {formatNumber(requiredAmount)}
              </p>
              <p>
                Total amount you invest: ₹ {formatNumber(totalInvested)}
              </p>
              <p>
                Estimated growth / returns: ₹ {formatNumber(growthAmount)}
              </p>
              <p>Share from growth: {returnsShare.toFixed(0)}%</p>
            </div>
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "9px",
            }}
          >
            <p style={detailLabel}>Assumptions</p>
            <p>Inflation: {inflationRate}% per year</p>
            <p>Expected return: {returnRate}% per year</p>
            <p>
              The actual numbers can differ; this is a planning estimate, not a
              guarantee.
            </p>
          </div>
        </div>

        {/* Goal description & suggestions */}
        <div
          style={{
            borderRadius: "12px",
            border: "1px solid rgba(56,189,248,0.7)",
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(8,47,73,0.96))",
            padding: "10px 12px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#e0f2fe",
            }}
          >
            Goal description
          </p>
          <p
            style={{
              fontSize: "9px",
              color: "#d1d5db",
              marginTop: "4px",
            }}
          >
            This plan is built for the goal{" "}
            <span style={{ fontWeight: 500 }}>{goalName}</span> with a target of
            accumulating around{" "}
            <span style={{ fontWeight: 500 }}>
              ₹ {formatNumber(futureCost)}
            </span>{" "}
            in{" "}
            <span style={{ fontWeight: 500 }}>{yearsToGoal} years</span>, based
            on today&apos;s estimated cost of{" "}
            <span style={{ fontWeight: 500 }}>
              ₹ {formatNumber(costToday)}
            </span>
            .
          </p>

          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#bbf7d0",
              marginTop: "8px",
            }}
          >
            Suggestions and general recommendations
          </p>
          <ul
            style={{
              fontSize: "9px",
              color: "#d1d5db",
              marginTop: "4px",
              paddingLeft: "14px",
            }}
          >
            <li>
              Try to keep this goal separate from short-term spending or
              emergency money so it stays focused on{" "}
              {goalTypeLabel.toLowerCase()}.
            </li>
            <li>
              If the suggested amount feels high, you can adjust the goal in the
              planner by:
              <ul style={{ paddingLeft: "14px", marginTop: "2px" }}>
                <li>extending the time horizon,</li>
                <li>slightly lowering the goal amount, or</li>
                <li>
                  starting with a smaller amount and increasing it as income
                  grows.
                </li>
              </ul>
            </li>
            <li>
              For goals with longer horizons, many investors use more
              growth-oriented assets in early years and move gradually to safer
              options as the goal date comes closer.
            </li>
            <li>
              It is helpful to review this plan once a year and update the
              numbers if costs, income or family responsibilities change.
            </li>
          </ul>
        </div>

        {/* How to use this report */}
        <div
          style={{
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.5)",
            background: "rgba(15,23,42,0.97)",
            padding: "10px 12px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#e5e7eb",
            }}
          >
            How to use this report
          </p>
          <ul
            style={{
              fontSize: "9px",
              color: "#d1d5db",
              marginTop: "4px",
              paddingLeft: "14px",
            }}
          >
            <li>
              Treat this as a starting point for conversation and reflection,
              not a final answer.
            </li>
            <li>
              You can return to the MoneyTalks with SS Goal Investment Planner
              at any time and change the goal amount, time horizon, return
              assumptions or investment style.
            </li>
            <li>
              If your income, expenses or priorities change, it is completely
              normal to adjust the plan.
            </li>
          </ul>
        </div>

        {/* Disclaimers & contact */}
        <div
          style={{
            marginTop: "6px",
            fontSize: "9px",
            color: "#9ca3af",
            borderTop: "1px solid rgba(75,85,99,0.8)",
            paddingTop: "8px",
          }}
        >
          <p>
            This projection is for education and awareness only. It is not a
            guarantee of returns or a personalised financial recommendation.
            Actual inflation, investment returns and costs can be different from
            the assumptions used here.
          </p>
          <p style={{ marginTop: "4px" }}>
            For deeper discussion and a personalised plan, you can reach out at:
          </p>
          <p
            style={{
              color: "#e5e7eb",
              fontWeight: 500,
              marginTop: "2px",
            }}
          >
            smartspendsclub@gmail.com
          </p>
          <p
            style={{
              marginTop: "4px",
              fontSize: "9px",
              color: "#cbd5f5",
            }}
          >
            MoneyTalks with SS
          </p>
        </div>
      </div>
    </div>
  );
};

// ---------- small helpers ----------------------------------------------------

const thStyle: React.CSSProperties = {
  borderBottom: "1px solid rgba(148,163,184,0.5)",
  padding: "4px 6px",
  textAlign: "left",
  color: "#cbd5f5",
  fontWeight: 500,
};

const tdStyle: React.CSSProperties = {
  padding: "3px 6px",
  borderBottom: "1px solid rgba(30,41,59,0.9)",
  color: "#e5e7eb",
};

const detailLabel: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 600,
  color: "#bae6fd",
  marginBottom: "2px",
};

function MiniCard({
  title,
  value,
  subtitle,
  extra,
  accent = "blue",
}: {
  title: string;
  value: string;
  subtitle?: string;
  extra?: React.ReactNode;
  accent?: "blue" | "green";
}) {
  const accentColor = accent === "green" ? "#22c55e" : "#38bdf8";

  return (
    <div
      style={{
        borderRadius: "12px",
        border: "1px solid rgba(148,163,184,0.5)",
        background: "rgba(15,23,42,0.96)",
        padding: "8px 10px",
        minHeight: "68px",
      }}
    >
      <p
        style={{
          fontSize: "10px",
          fontWeight: 500,
          color: accentColor,
        }}
      >
        {title}
      </p>
      {value && (
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#f9fafb",
            marginTop: "2px",
          }}
        >
          {value}
        </p>
      )}
      {subtitle && (
        <p
          style={{
            fontSize: "9px",
            color: "#d1d5db",
            marginTop: "2px",
          }}
        >
          {subtitle}
        </p>
      )}
      {extra && <div style={{ marginTop: "2px" }}>{extra}</div>}
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
        display: "flex",
        alignItems: "flex-start",
        gap: "6px",
        minWidth: "120px",
      }}
    >
      <span
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "999px",
          backgroundColor: color,
          marginTop: "3px",
        }}
      />
      <div>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 600,
            color: "#e5e7eb",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: "9px",
            color: "#d1d5db",
          }}
        >
          {value}
        </p>
        <p
          style={{
            fontSize: "9px",
            color: "#9ca3af",
          }}
        >
          {percent}
        </p>
      </div>
    </div>
  );
}
