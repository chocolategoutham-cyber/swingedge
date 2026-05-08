import type { ProofRecord } from "@/lib/types";
import { buildResearchEngine } from "@/lib/server/research-engine";

export const mockProofRecords: ProofRecord[] = buildResearchEngine().scanners.proof;
