import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateUTC(dateInput: string | number | Date, locale: string, options: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateInput)
  // Force UTC by adjusting to the same absolute instant but formatting in UTC
  return new Intl.DateTimeFormat(locale, { timeZone: "UTC", ...options }).format(date)
}
