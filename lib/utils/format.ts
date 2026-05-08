import { format } from "date-fns";

export function formatCurrency(value: number) {
  return `INR ${value.toFixed(2)}`;
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(1)}%`;
}

export function formatDateTime(value: string) {
  return format(new Date(value), "dd MMM yyyy, HH:mm");
}

export function formatDateOnly(value: string) {
  return format(new Date(value), "dd MMM yyyy");
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
