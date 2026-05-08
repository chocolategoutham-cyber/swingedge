const { analyzeUniverse } = require("../lib/analyzer");

const analysis = analyzeUniverse();

module.exports = {
  meta: {
    name: "Swing Edge Replica",
    generatedAt: "2026-05-08",
    disclaimer:
      "Technical analysis and screening tool only. Data shown here is demo/sample research context and not investment advice."
  },
  scannerWins: {
    updatedAt: "2026-05-07",
    window: "2026-05-01 to 2026-05-07",
    items: [
      { rank: 1, symbol: "DBREALTY", company: "Valor Estate Ltd.", identifiedBy: "Pre-Breakout", identifiedOn: "2026-05-03", priceThen: "₹103.6", bestPrice: "₹144.3", moved: "+39.3%" },
      { rank: 2, symbol: "GRWRHITECH", company: "Garware Hi-Tech Films Ltd.", identifiedBy: "Pre-Breakout", identifiedOn: "2026-05-03", priceThen: "₹3999.0", bestPrice: "₹5560.0", moved: "+39.0%" },
      { rank: 3, symbol: "TEJASNET", company: "Tejas Networks Ltd.", identifiedBy: "Pre-Breakout", identifiedOn: "2026-05-03", priceThen: "₹415.1", bestPrice: "₹555.0", moved: "+33.7%" },
      { rank: 4, symbol: "CARTRADE", company: "Cartrade Tech Ltd.", identifiedBy: "Pre-Breakout", identifiedOn: "2026-05-03", priceThen: "₹1623.4", bestPrice: "₹2115.0", moved: "+30.3%" },
      { rank: 5, symbol: "GODREJIND", company: "Godrej Industries Ltd.", identifiedBy: "Pre-Breakout", identifiedOn: "2026-05-03", priceThen: "₹959.0", bestPrice: "₹1226.8", moved: "+27.9%" }
    ]
  },
  preBreakout: {
    universeSize: analysis.eligibleUniverseSize,
    items: analysis.preBreakout
  },
  breakouts: {
    universeSize: analysis.eligibleUniverseSize,
    items: analysis.breakouts
  },
  breakdowns: {
    universeSize: analysis.eligibleUniverseSize,
    items: analysis.breakdowns
  },
  insights: {
    pulse: "Bullish",
    advanceDecline: "2.1",
    strongest: ["Capital Goods", "Defense", "Chemicals"],
    weakest: ["IT Services", "FMCG"]
  },
  methodology: {
    principles: [
      "Research candidates, not calls",
      "Multiple clues, not one indicator",
      "Process stays protected"
    ]
  }
};
