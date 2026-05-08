export const scannerThresholds = {
  universe: {
    minAverageDailyValue20: {
      "Nifty 500": 2.2e8,
      "Nifty SmallCap 250": 1.25e8,
      "Nifty MicroCap 250": 5.5e7,
    },
    minParticipationScore: 45,
    maxStaleSessions20d: 3,
  },
  preBreakout: {
    veryStrong: 80,
    strong: 65,
    watch: 50,
  },
  breakout: {
    strong: 70,
    moderate: 50,
    volumeRatioMin: 1.4,
  },
  breakdown: {
    severe: 80,
    high: 65,
    moderate: 50,
    supportLossPct: 1.2,
  },
  nifty: {
    positive: 8,
    constructive: 2,
    caution: -2,
    negative: -8,
  },
};
