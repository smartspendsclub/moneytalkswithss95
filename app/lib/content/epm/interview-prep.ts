export const interviewPrep = [
  // ==========================
  // FOUNDATION CONCEPTS
  // ==========================
  {
    id: "f1",
    question: "What is the primary difference between a Member Name and an Alias?",
    category: "Metadata",
    difficulty: "Foundation",
    answer: "A Member Name is a unique system identifier (code) that cannot contain spaces or special characters. An Alias is a user-friendly display name (e.g., 'Total_Rev' vs 'Total Revenue'). Logic and scripts should always use Member Names because Aliases can change without notice."
  },
  {
    id: "f2",
    question: "Explain the 'POV' in the context of a multidimensional cube.",
    category: "Architecture",
    difficulty: "Foundation",
    answer: "The POV (Point of View) represents the 'GPS coordinates' of a data cell. Since EPM is multidimensional, a single data point only exists at the intersection of one member from every dimension. The POV sets the background context (Year, Scenario, Entity) for the data you are viewing."
  },

  // ==========================
  // INTERMEDIATE CONCEPTS
  // ==========================
  {
    id: "i1",
    question: "When would you use a 'Two-Pass' calculation property on a member?",
    category: "Logic",
    difficulty: "Intermediate",
    answer: "You use Two-Pass for members that contain ratios or percentages (like Gross Margin %). It tells Essbase to calculate the total values first, then perform the division at the parent level, preventing the incorrect summing of percentages (e.g., 10% + 10% = 20%)."
  },
  {
    id: "i2",
    question: "What is the difference between a Replicated and a Transparent Partition?",
    category: "Architecture",
    difficulty: "Intermediate",
    answer: "A Transparent Partition allows a 'Target' cube to view data from a 'Source' cube in real-time without storing it. A Replicated Partition physically copies data from source to target. Use Transparent for live updates and Replicated for better local performance."
  },

  // ==========================
  // ADVANCED CONCEPTS
  // ==========================
  {
    id: "a1",
    question: "Describe the impact of a 'Dense Restructure' on server resources.",
    category: "Management",
    difficulty: "Advanced",
    answer: "A Dense Restructure is a major renovation. Essbase must open every single data block to add/remove member slots. This requires 2x temporary disk space and significant CPU time. It is a 'high-risk' operation that should never be performed during active user windows."
  },
  {
    id: "a2",
    question: "How do you choose a 'Driver Dimension' for a FIXPARALLEL statement to optimize speed?",
    category: "Logic",
    difficulty: "Advanced",
    answer: "The Driver Dimension should be a Sparse dimension with a high number of members. This ensures the calculation task is split into enough 'chunks' to keep all CPU threads busy. Choosing a dimension that is too small (like 'Scenario') will result in threads sitting idle."
  },
  {
    id: "i4",
    question: "What is the difference between Functional Roles and Data Security?",
    category: "Management",
    difficulty: "Intermediate",
    module: "Common",
    answer: "Functional Roles define 'actions' (e.g., Admin, Power User, Viewer). Data Security defines 'access' to specific members (e.g., seeing only 'New York' entity data)."
  },
  {
    id: "a4",
    question: "Explain Solve Order in ASO and how it impacts calculations.",
    category: "Architecture",
    difficulty: "Advanced",
    module: "Essbase",
    answer: "Solve Order determines the priority of calculations in ASO. Members with higher solve orders are calculated last, ensuring that complex formulas (like Ratios) use the results of previously aggregated data."
  },
  {
    id: "i5",
    question: "Why would you use a 'UDA' (User Defined Attribute) in a Calc Script?",
    category: "Metadata",
    difficulty: "Intermediate",
    module: "Essbase",
    answer: "UDAs are high-performance strings used for 'FIX' statements. Unlike Attribute Dimensions, they have no impact on reporting hierarchies, making them perfect for grouping members for logic execution."
  }

];