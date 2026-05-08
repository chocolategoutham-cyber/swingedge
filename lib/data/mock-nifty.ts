import { niftyContextSchema, type NiftyContext } from "@/lib/types";

const intraday = Array.from({ length: 30 }, (_, index) => ({
  time: `${String(9 + Math.floor(index / 4)).padStart(2, "0")}:${String((index % 4) * 15).padStart(2, "0")}`,
  close: Number((22410 + index * 6 + Math.sin(index / 2) * 11).toFixed(2)),
  vwap: Number((22402 + index * 5.1).toFixed(2)),
}));

export const mockNiftyContext: NiftyContext = niftyContextSchema.parse({
  dateTime: new Date().toISOString(),
  score: 6,
  label: "Constructive",
  trendScore: 3,
  breadthScore: 2,
  momentumScore: 1.5,
  volatilityScore: -0.5,
  vwapState: "above",
  notes: "Index is constructive, but leadership remains concentrated in select sectors.",
  breadthRatio: 1.22,
  latestPrice: 22584.2,
  previousClose: 22511.7,
  intraday,
  supportResistanceZones: [
    { strike: 22400, callOi: 5100000, putOi: 9200000, context: "High put open interest base", label: "support" },
    { strike: 22500, callOi: 6600000, putOi: 6400000, context: "Near-term balance zone", label: "resistance" },
    { strike: 22600, callOi: 9800000, putOi: 4200000, context: "Heavy call writing zone", label: "resistance" },
  ],
});
