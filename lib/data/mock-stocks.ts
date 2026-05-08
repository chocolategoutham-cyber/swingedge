import { stockSchema, type Stock } from "@/lib/types";

const sectorMap: Array<[string, string[]]> = [
  ["Technology", ["INFONEXT", "DIGICORE", "LOGISYS", "MINDPULSE", "SOFTWAVE"]],
  ["Banking", ["PRIMEBANK", "FUSIONBANK", "CAPITALBK", "METROBANK", "LOTUSBANK"]],
  ["Financials", ["LENDWELL", "NEXFIN", "ALPHAFIN", "TRUSTCAP", "MERIDIAN"]],
  ["Pharma", ["HEALIX", "VITALABS", "BIOZEN", "MEDIFORGE", "CURENIX"]],
  ["FMCG", ["PUREHARV", "URBANLEAF", "GRAINPLUS", "DAILYHOME", "NUTRIVA"]],
  ["Metals", ["STEELARC", "ALUMAX", "COPPERON", "FORGEMET", "MINEMECH"]],
  ["Energy", ["SOLGRID", "POWERMINT", "THERMIX", "GREENVAULT", "OILNOVA"]],
  ["Infrastructure", ["BUILDCON", "ROADMESH", "MEGACIV", "PORTLINK", "BRIDGEX"]],
  ["Auto", ["MOTORA", "EVTRON", "AXLEWORK", "RIDERA", "TORQMAX"]],
  ["Telecom", ["SIGNETEL", "BANDWAVE", "FIBRENET", "TOWERCOM", "VOXIND"]],
  ["Real Estate", ["SKYLINE", "URBANTERRA", "METROEST", "BLOCKHIVE", "LIVINGRIDGE"]],
  ["Utilities", ["GRIDFLOW", "AQUAPOWER", "CIVILWATT", "NORTHGRID", "RIVERUTIL"]],
];

const bucketByIndex = (index: number): Stock["marketCapBucket"] => {
  if (index < 24) return "Large-Mid";
  if (index < 48) return "Small Cap";
  return "Micro Cap";
};

export const mockStocks: Stock[] = sectorMap
  .flatMap(([sector, symbols]) =>
    symbols.map((symbol, index) => ({
      symbol,
      companyName: `${symbol} Industries Limited`,
      sector,
      marketCapBucket: bucketByIndex(index + sector.length),
      exchange: "NSE" as const,
      isin: `INE${(100000 + index + sector.length).toString().padStart(6, "0")}`,
      isWatchlisted: (index + sector.length) % 4 === 0,
    }))
  )
  .map((stock, index) =>
    stockSchema.parse({
      ...stock,
      marketCapBucket: bucketByIndex(index),
    })
  );
