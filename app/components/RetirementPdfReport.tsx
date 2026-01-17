// app/components/RetirementPdfReport.tsx
"use client";

import React from "react";

type Scenario = {
  label: string;
  inflation: number;
  returnRate: number;
  corpus: number;
};

interface RetirementPdfReportProps {
  monthlyExpense: number;
  yearsToRetirement: number;
  yearsAfterRetirement: number;
  inflation: number;
  postReturn: number;
  corpus: number;
  scenarios: Scenario[];
}

function formatNumber(num: number | undefined) {
  if (!num || Number.isNaN(num)) return "0";
  return num.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

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

export default function RetirementPdfReport({
  monthlyExpense,
  yearsToRetirement,
  yearsAfterRetirement,
  inflation,
  postReturn,
  corpus,
  scenarios,
}: RetirementPdfReportProps) {
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      style={{
        width: "794px",
        backgroundColor: "#020617",
        color: "#e5e7eb",
        padding: "24px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: "11px",
      }}
    >
      <div
        className="pdf-page"
        style={{
          minHeight: "1123px",
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
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#22c55e",
                }}
              >
                Money<span style={{ color: "#38bdf8" }}>Talks</span>
              </span>
              <span
                style={{
                  fontSize: "9px",
                  color: "#9ca3af",
                }}
              >
                with SS
              </span>
            </div>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#e5e7eb",
              }}
            >
              Retirement Corpus Plan
            </p>
          </div>
          <div style={{ textAlign: "right", fontSize: "10px" }}>
            <p style={{ color: "#94a3b8" }}>Report date</p>
            <p style={{ color: "#e5e7eb", fontWeight: 500 }}>{today}</p>
          </div>
        </div>

        {/* Snapshot */}
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
              Retirement snapshot
            </p>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#f9fafb",
                marginTop: "4px",
              }}
            >
              Monthly expenses today: ₹ {formatNumber(monthlyExpense)}
            </p>
            <p
              style={{
                fontSize: "10px",
                color: "#cbd5f5",
                marginTop: "2px",
              }}
            >
              Planned retirement in {yearsToRetirement} years, with income needed for{" "}
              {yearsAfterRetirement} years after retirement.
            </p>
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
                Target corpus at retirement
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#7dd3fc",
                }}
              >
                ₹ {formatNumber(corpus)}
              </p>
              <p
                style={{
                  fontSize: "9px",
                  color: "#9ca3af",
                }}
              >
                In {yearsToRetirement} years (approx).
              </p>
            </div>
          </div>
        </div>

        {/* Assumptions table */}
        <div
          style={{
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.4)",
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.97), rgba(15,23,42,0.9))",
            padding: "10px 12px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#e5e7eb",
              marginBottom: "4px",
            }}
          >
            Assumptions used in this plan
          </p>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "9px",
            }}
          >
            <tbody>
              <tr>
                <td style={tdStyle}>Monthly expenses today</td>
                <td style={tdStyle}>₹ {formatNumber(monthlyExpense)}</td>
              </tr>
              <tr>
                <td style={tdStyle}>Years until retirement</td>
                <td style={tdStyle}>{yearsToRetirement} years</td>
              </tr>
              <tr>
                <td style={tdStyle}>Years in retirement</td>
                <td style={tdStyle}>{yearsAfterRetirement} years</td>
              </tr>
              <tr>
                <td style={tdStyle}>Inflation (per year)</td>
                <td style={tdStyle}>{inflation}% p.a.</td>
              </tr>
              <tr>
                <td style={tdStyle}>Return during retirement</td>
                <td style={tdStyle}>{postReturn}% p.a.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Scenario comparison */}
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
              See how your required corpus changes with slightly different inflation
              and returns.
            </p>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "9px",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Scenario</th>
                <th style={thStyle}>Inflation (% p.a.)</th>
                <th style={thStyle}>Return (% p.a.)</th>
                <th style={thStyle}>Target corpus (₹)</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((s) => (
                <tr key={s.label}>
                  <td style={tdStyle}>{s.label}</td>
                  <td style={tdStyle}>{s.inflation}</td>
                  <td style={tdStyle}>{s.returnRate}</td>
                  <td style={tdStyle}>₹ {formatNumber(s.corpus)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Explanation & "what it means" */}
        <div
          style={{
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.5)",
            background: "rgba(15,23,42,0.95)",
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#e5e7eb",
            }}
          >
            What this corpus means for you
          </p>

          <p
            style={{
              fontSize: "9px",
              color: "#d1d5db",
            }}
          >
            This projection estimates the amount you may need at retirement so that, with
            the chosen inflation and return assumptions, you can draw an inflation-linked
            income for{" "}
            <span style={{ fontWeight: 500 }}>
              {yearsAfterRetirement} years after retiring
            </span>
            .
          </p>

          <p
            style={{
              fontSize: "9px",
              color: "#d1d5db",
            }}
          >
            In today&apos;s terms, it aims to preserve the purchasing power of monthly
            expenses roughly equivalent to{" "}
            <span style={{ fontWeight: 500 }}>
              ₹ {formatNumber(monthlyExpense)} per month
            </span>{" "}
            (your current expenses), adjusted for inflation until and during retirement.
          </p>

          <p
            style={{
              fontSize: "9px",
              color: "#d1d5db",
            }}
          >
            Actual inflation, returns and spending may be higher or lower than assumed.
            This is a starting point to check whether you&apos;re broadly on track, not a
            perfect number. As life changes, your required corpus will also change.
          </p>

          <p
            style={{
              fontSize: "9px",
              color: "#d1d5db",
            }}
          >
            How to interpret the scenarios:
          </p>
          <ul
            style={{
              fontSize: "9px",
              color: "#d1d5db",
              paddingLeft: "14px",
              marginTop: "0px",
            }}
          >
            <li>
              If inflation turns out <strong>higher</strong> than assumed, you may need a{" "}
              <strong>larger corpus</strong> or may need to spend less.
            </li>
            <li>
              If your investments earn <strong>lower returns</strong> than assumed, you
              will need to save more before retirement.
            </li>
            <li>
              If your lifestyle expenses grow faster than expected, revisit the plan and
              increase contributions where possible.
            </li>
          </ul>

          <p
            style={{
              fontSize: "9px",
              color: "#d1d5db",
              marginTop: "4px",
            }}
          >
            Suggested next steps:
          </p>
          <ul
            style={{
              fontSize: "9px",
              color: "#d1d5db",
              paddingLeft: "14px",
              marginTop: "0px",
            }}
          >
            <li>
              Check if your current retirement investments are on track for this target
              corpus.
            </li>
            <li>Increase contributions when your income rises.</li>
            <li>
              Review this plan every year, or after major life events (job change,
              marriage, children, etc.).
            </li>
            <li>
              Discuss product selection and taxation with a qualified advisor before
              implementing.
            </li>
          </ul>

          <p
            style={{
              fontSize: "9px",
              color: "#9ca3af",
              marginTop: "4px",
            }}
          >
            This report is for educational use only and is not personalised financial,
            tax or legal advice.
          </p>
          <p
            style={{
              fontSize: "9px",
              color: "#cbd5f5",
            }}
          >
            For personalised planning assistance, you can reach out at:{" "}
            <span style={{ fontWeight: 500 }}>smartspendsclub@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
