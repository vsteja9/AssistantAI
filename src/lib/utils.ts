import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isToday, isTomorrow, isYesterday } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateString(dateStr?: string, formatPattern = 'MMM d, yyyy'): string {
  if (!dateStr) return '';
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) return `Today, ${format(date, 'h:mm a')}`;
    if (isTomorrow(date)) return `Tomorrow, ${format(date, 'h:mm a')}`;
    if (isYesterday(date)) return `Yesterday, ${format(date, 'h:mm a')}`;
    return format(date, formatPattern);
  } catch {
    return dateStr;
  }
}

export function formatTimeOnly(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const date = parseISO(dateStr);
    return format(date, 'h:mm a');
  } catch {
    return dateStr;
  }
}
