export type LearnLesson = {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  tags: string[];
  sections: Array<{
    title: string;
    body: string[];
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
};

export const learnLessons: LearnLesson[] = [
  {
    id: "intro-swing-vs-day",
    title: "Swing Research vs Intraday Research",
    category: "Foundations",
    readTime: "6 min",
    summary: "Understand why holding period, market context, and risk framing change the way swing traders read scanner output.",
    tags: ["beginner", "market structure", "risk basics"],
    sections: [
      {
        title: "Why the holding period changes the workflow",
        body: [
          "Intraday participants care about minute-by-minute flow, liquidity pockets, and same-session volatility. Swing researchers usually care more about multi-day structure, where price sits versus support or pivot zones, and whether volume behavior supports the broader trend.",
          "That means a swing scanner can surface a constructive base even if nothing actionable happens today. The purpose is to identify research candidates, not to force an immediate decision.",
        ],
      },
      {
        title: "How index context fits in",
        body: [
          "A strong symbol can still underperform when the index backdrop is weak, narrow, or highly volatile. That is why SignalLens keeps Nifty context, breadth, and sector leadership close to the scanner experience.",
          "Pairing symbol-level structure with market-level context creates a more balanced research process than treating every chart in isolation.",
        ],
      },
      {
        title: "What not to infer from a scanner row",
        body: [
          "A high score does not mean certainty, and a lower score does not automatically invalidate a symbol. Scores are only a compact summary of structure, relative strength, participation, and risk clues at a point in time.",
        ],
      },
    ],
    faq: [
      {
        question: "Does swing research avoid intraday risk?",
        answer: "No. It changes the time horizon, but gap risk, event risk, and liquidity risk still matter.",
      },
      {
        question: "Can the same symbol appear in both swing and momentum research?",
        answer: "Yes. A symbol may first appear as pre-breakout, then breakout, then momentum if follow-through stays healthy.",
      },
    ],
  },
  {
    id: "reading-pre-breakout-setups",
    title: "Reading Pre-Breakout Setups",
    category: "Scanner Methodology",
    readTime: "7 min",
    summary: "Learn what a constructive base looks like and why relative strength and quiet volume matter before a breakout.",
    tags: ["pre-breakout", "base quality", "volume dry-up"],
    sections: [
      {
        title: "What the scanner is looking for",
        body: [
          "The pre-breakout model looks for consolidation quality, improving relative strength, and proximity to a reference pivot. It prefers orderly ranges instead of noisy, wide, unstable swings.",
          "A row can score well even before price clears resistance, because the goal is early research context rather than confirmation after the fact.",
        ],
      },
      {
        title: "Why quiet volume matters",
        body: [
          "Falling activity inside a base can suggest that weaker supply is being absorbed. The model uses volume dry-up and volume-quality logic to avoid overvaluing bases with erratic participation.",
        ],
      },
    ],
    faq: [
      {
        question: "Why can a strong pre-breakout row still fail?",
        answer: "Market context, weak follow-through, and false clears can still invalidate the structure after the scan.",
      },
    ],
  },
  {
    id: "volume-confirmation",
    title: "Volume Confirmation and Participation",
    category: "Patterns",
    readTime: "5 min",
    summary: "Learn how participation changes the confidence of breakout and continuation research.",
    tags: ["volume", "breakouts", "participation"],
    sections: [
      {
        title: "Why participation matters",
        body: [
          "A price move without broad participation can be fragile. Volume ratio, z-score, and dry-up behavior help measure whether the move was well supported or simply thin.",
        ],
      },
      {
        title: "How SignalLens uses it",
        body: [
          "The model blends raw volume expansion, volume-quality scoring, and failure-risk penalties. A symbol with weak participation can still appear, but it will usually rank lower or carry a weaker label.",
        ],
      },
    ],
    faq: [
      {
        question: "Is one big volume spike enough?",
        answer: "Not by itself. The broader structure and follow-through still matter.",
      },
    ],
  },
  {
    id: "relative-strength-basics",
    title: "Relative Strength Basics",
    category: "Relative Strength",
    readTime: "5 min",
    summary: "Relative strength helps compare leadership versus the benchmark rather than looking only at a symbol in isolation.",
    tags: ["relative strength", "leadership", "benchmark"],
    sections: [
      {
        title: "What RS is measuring here",
        body: [
          "SignalLens uses rolling returns and trend behavior to rank symbols against the broader market. Stronger RS ranks generally highlight names that are already outperforming their benchmark context.",
        ],
      },
      {
        title: "Why RS is not enough alone",
        body: [
          "Leadership without structure can still be extended or unstable. The scanner therefore combines RS with proximity, volume, and risk clues before surfacing a candidate.",
        ],
      },
    ],
    faq: [
      {
        question: "Can a low RS symbol become interesting later?",
        answer: "Yes. RS can improve as a base matures, which is why scans refresh and rankings change over time.",
      },
    ],
  },
  {
    id: "breadth-and-sector-rotation",
    title: "Breadth and Sector Rotation",
    category: "Market Breadth",
    readTime: "6 min",
    summary: "Breadth shows how broad the market move is, while sector rotation highlights where leadership is concentrating.",
    tags: ["breadth", "sectors", "nifty"],
    sections: [
      {
        title: "Reading breadth",
        body: [
          "Advance-decline data, percentages above key moving averages, and new highs versus new lows help frame whether participation is broad, mixed, or narrow.",
        ],
      },
      {
        title: "Why sector rotation matters",
        body: [
          "Even when the index is flat, some sectors may be strengthening while others weaken. Pairing the scanner with sector rotation helps you avoid treating every setup as equal.",
        ],
      },
    ],
    faq: [
      {
        question: "Can breadth be weak while a few scanners still look strong?",
        answer: "Yes. That often means leadership is narrow, which can increase fragility.",
      },
    ],
  },
];

export const learnCategories = [
  "Foundations",
  "Scanner Methodology",
  "Patterns",
  "Market Breadth",
  "Relative Strength",
];

export const featuredLessonIds = [
  "intro-swing-vs-day",
  "reading-pre-breakout-setups",
  "volume-confirmation",
  "relative-strength-basics",
];
