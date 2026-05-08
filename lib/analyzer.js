const universe = require("../data/market-universe");

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function liquidityPass(stock) {
  return stock.averageDailyValueCr >= 30 && stock.stalePrintRisk <= 0.2;
}

function breakoutDistancePct(stock) {
  return round(((stock.currentPrice - stock.pivot) / stock.pivot) * 100);
}

function from52wHighPct(stock) {
  return round(((stock.currentPrice - stock.high52w) / stock.high52w) * 100);
}

function volumeScore(stock) {
  const dryUpBonus = stock.volumeDryUp ? 12 : 0;
  const breakoutParticipation = clamp((stock.volumeTodayVs50d - 1) * 40, 0, 35);
  return clamp(Math.round(40 + breakoutParticipation + dryUpBonus), 0, 100);
}

function failureRiskScore(stock) {
  const dmaPenalty = stock.dmaStack === "bearish" ? 24 : 0;
  const stagePenalty = stock.stage >= 4 ? 20 : stock.stage <= 1 ? 10 : 0;
  const supportPenalty = stock.supportLost ? 25 : 0;
  const weakClosePenalty = stock.weakCloses * 6;
  const distributionPenalty = stock.distributionDays * 5;
  const stalePenalty = Math.round(stock.stalePrintRisk * 30);
  return clamp(dmaPenalty + stagePenalty + supportPenalty + weakClosePenalty + distributionPenalty + stalePenalty, 0, 100);
}

function stageLabel(stage) {
  if (stage >= 4) return "4";
  if (stage >= 2) return "2";
  return "1-late";
}

function preBreakoutScore(stock) {
  const proximity = Math.max(0, 100 - Math.abs(breakoutDistancePct(stock)) * 12);
  const stageScore = stock.stage === 2 ? 100 : stock.stage === 1 ? 70 : 25;
  const vcpScore = clamp(stock.contractions * 18, 0, 100);
  const riskInverse = 100 - failureRiskScore(stock);

  const score =
    stock.baseQuality * 0.28 +
    volumeScore(stock) * 0.16 +
    stock.rsRank * 0.2 +
    proximity * 0.18 +
    stageScore * 0.08 +
    vcpScore * 0.05 +
    riskInverse * 0.05;

  return Math.round(clamp(score, 0, 100));
}

function breakoutScore(stock) {
  const extensionPenalty = Math.max(0, Math.abs(from52wHighPct(stock)) - 2) * 2;
  const momentumScore = clamp(stock.rsi * 0.9 + stock.adx * 0.7, 0, 100);
  const riskInverse = 100 - failureRiskScore(stock);
  const score =
    stock.baseQuality * 0.22 +
    volumeScore(stock) * 0.23 +
    stock.rsRank * 0.22 +
    momentumScore * 0.16 +
    riskInverse * 0.12 -
    extensionPenalty;

  return Math.round(clamp(score, 0, 100));
}

function classifyPreBreakout(stock, score) {
  if (score >= 80) return "Very Strong";
  if (score >= 65) return "Strong";
  return "Watchlist";
}

function classifyBreakout(score) {
  return score >= 70 ? "Strong" : "Moderate";
}

function classifyBreakoutPattern(stock) {
  if (stock.htfCandidate) return "HTF";
  if (stock.activeBreakout) return "Active BO";
  if (stock.continuation) return "Continuation";
  return "Fresh BO";
}

function classifyRisk(riskScore) {
  if (riskScore >= 70) return "Severe";
  if (riskScore >= 45) return "High";
  if (riskScore >= 25) return "Moderate";
  return "Low";
}

function analyzeUniverse() {
  const eligible = universe.filter(liquidityPass);
  const preBreakout = eligible
    .filter((stock) => !stock.breakoutConfirmed && stock.stage >= 1 && stock.stage <= 2)
    .map((stock) => {
      const score = preBreakoutScore(stock);
      return {
        symbol: stock.symbol,
        company: stock.company,
        score,
        signal: classifyPreBreakout(stock, score),
        fromPivot: `${breakoutDistancePct(stock)}%`,
        stage: stageLabel(stock.stage),
        rsRank: stock.rsRank,
        base: stock.baseQuality,
        volume: volumeScore(stock),
        risk: classifyRisk(failureRiskScore(stock)),
        marketCap: stock.marketCapBucket,
        vcp: stock.contractions >= 3,
        volDry: stock.volumeDryUp
      };
    })
    .sort((a, b) => b.score - a.score);

  const breakouts = eligible
    .filter((stock) => stock.breakoutConfirmed)
    .map((stock) => {
      const score = breakoutScore(stock);
      return {
        symbol: stock.symbol,
        company: stock.company,
        score,
        pattern: classifyBreakoutPattern(stock),
        signal: classifyBreakout(score),
        gain10d: `${stock.gainSinceAppeared >= 0 ? "+" : ""}${round(stock.gainSinceAppeared)}%`,
        price: stock.currentPrice,
        vol50d: `${round(stock.volumeTodayVs50d)}×`,
        volQ: volumeScore(stock),
        risk: classifyRisk(failureRiskScore(stock)),
        rs: stock.rsRank,
        from52wH: `${from52wHighPct(stock) >= 0 ? "+" : ""}${from52wHighPct(stock)}%`
      };
    })
    .sort((a, b) => b.score - a.score);

  const breakdowns = universe
    .map((stock) => {
      const riskScore = failureRiskScore(stock);
      return {
        symbol: stock.symbol,
        company: stock.company,
        riskScore,
        risk: classifyRisk(riskScore),
        pattern: stock.supportLost ? "Support Loss" : stock.dmaStack === "bearish" ? "Bearish DMA" : "Distribution",
        price: stock.currentPrice,
        support: stock.support,
        fromSupport: `${round(((stock.currentPrice - stock.support) / stock.support) * 100)}%`,
        dmaState: stock.dmaStack,
        rsi: stock.rsi,
        rs: stock.rsRank,
        distribution: `${stock.distributionDays} days`
      };
    })
    .filter((stock) => stock.riskScore >= 45)
    .sort((a, b) => b.riskScore - a.riskScore);

  return {
    eligibleUniverseSize: eligible.length,
    preBreakout,
    breakouts,
    breakdowns
  };
}

module.exports = {
  analyzeUniverse,
  liquidityPass,
  breakoutDistancePct,
  from52wHighPct,
  volumeScore,
  failureRiskScore
};
