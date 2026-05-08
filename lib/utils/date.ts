import { addDays, differenceInCalendarDays, subDays, subMinutes } from "date-fns";

export function daysAgo(days: number) {
  return subDays(new Date(), days).toISOString();
}

export function minutesAgo(minutes: number) {
  return subMinutes(new Date(), minutes).toISOString();
}

export function inDays(date: string, days: number) {
  return addDays(new Date(date), days).toISOString();
}

export function holdingDays(fromDate: string, toDate: string) {
  return differenceInCalendarDays(new Date(toDate), new Date(fromDate));
}
