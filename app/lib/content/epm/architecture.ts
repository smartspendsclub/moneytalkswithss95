export type ArchitectureModule = {
  id: "fccs" | "epbcs" | "eprcs" | "arcs" | "pcmcs" | "trcs" | "edmcs";
  title: string;
  tag:
    | "CONSOLIDATION"
    | "PLANNING"
    | "RECON"
    | "GOVERNANCE"
    | "ALLOCATIONS"
    | "TAX COMPLIANCE"
    | "REPORTING";
  description: string;
  colorHex: string;
};

export const architectureModules: ArchitectureModule[] = [
  {
    id: "fccs",
    title: "FCCS: Financial Consolidation & Close",
    tag: "CONSOLIDATION",
    description:
      "Ownership, eliminations, translation, movement design, and the enterprise close engine.",
    colorHex: "#38bdf8"
  },
  {
    id: "epbcs",
    title: "EPBCS: Planning & Forecasting",
    tag: "PLANNING",
    description:
      "Workforce, Capital, Projects, and Financials frameworks.",
    colorHex: "#34d399"
  },
  {
    id: "arcs",
    title: "ARCS: Account Reconciliation",
    tag: "RECON",
    description:
      "Transaction matching, certification, and compliance controls.",
    colorHex: "#fbbf24"
  },
  {
    id: "edmcs",
    title: "EDMCS: Master Data Management",
    tag: "GOVERNANCE",
    description:
      "Hierarchy governance, workflows, and multi-application syncing.",
    colorHex: "#a78bfa"
  },
  {
    id: "pcmcs",
    title: "PCMCS: Profitability & Cost Management",
    tag: "ALLOCATIONS",
    description:
      "Driver-based costing and multi-stage allocation engines.",
    colorHex: "#fb7185"
  },
  {
    id: "trcs",
    title: "TRCS: Tax Reporting",
    tag: "TAX COMPLIANCE",
    description:
      "Automated tax provision and regulatory reporting.",
    colorHex: "#fb923c"
  },
  {
    id: "eprcs",
    title: "EPRCS: Narrative Reporting",
    tag: "REPORTING",
    description:
      "Collaborative reporting with full audit trails.",
    colorHex: "#818cf8"
  }
];
