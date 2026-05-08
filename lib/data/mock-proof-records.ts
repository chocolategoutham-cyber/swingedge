import type { ProofRecord } from "@/lib/types";
import {
  mockBreakdownSignals,
  mockBreakoutSignals,
  mockMomentumSignals,
  mockPreBreakoutSignals,
} from "@/lib/data/mock-scanner-runs";
import { createProofRecordFromSignal } from "@/lib/scanners/proof";

const allSignals = [
  ...mockPreBreakoutSignals.slice(0, 8),
  ...mockBreakoutSignals.slice(0, 6),
  ...mockBreakdownSignals.slice(0, 4),
  ...mockMomentumSignals.slice(0, 6),
];

export const mockProofRecords: ProofRecord[] = allSignals.map((signal, index) =>
  createProofRecordFromSignal(signal, index)
);
