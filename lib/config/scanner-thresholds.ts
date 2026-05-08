export const scannerThresholds = {
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
