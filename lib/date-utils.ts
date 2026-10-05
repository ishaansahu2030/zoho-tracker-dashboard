/**
 * Utility functions for parsing and comparing dates from Zoho Google Sheet format
 * Handles:
 *  - "DD-MMM-YYYY HH:MM:SS AM/PM" (e.g. "12-Mar-2021 11:30:00 AM")
 *  - "M/D/YYYY HH:MM:SS" or "MM/DD/YYYY"
 *  - "MM/DD/YY HH:MM AM/PM"
 */

const MONTH_MAP: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
};

export function parseZohoDate(dateStr: string | undefined | null): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // Format 1: 12-Mar-2021 11:30:00 AM or 03-Aug-2021 07:30:00 PM
  const matchDMMMYYYY = trimmed.match(
    /^(\d{1,2})-([a-zA-Z]{3})-(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?$/i
  );
  if (matchDMMMYYYY) {
    const day = parseInt(matchDMMMYYYY[1], 10);
    const monthStr = matchDMMMYYYY[2].toLowerCase();
    const month = MONTH_MAP[monthStr];
    const year = parseInt(matchDMMMYYYY[3], 10);

    let hours = matchDMMMYYYY[4] ? parseInt(matchDMMMYYYY[4], 10) : 0;
    const minutes = matchDMMMYYYY[5] ? parseInt(matchDMMMYYYY[5], 10) : 0;
    const seconds = matchDMMMYYYY[6] ? parseInt(matchDMMMYYYY[6], 10) : 0;
    const meridiem = matchDMMMYYYY[7] ? matchDMMMYYYY[7].toUpperCase() : null;

    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    if (month !== undefined) {
      const d = new Date(year, month, day, hours, minutes, seconds);
      if (!isNaN(d.getTime())) return d;
    }
  }

  // Format 2: M/D/YYYY HH:MM:SS or MM/DD/YY HH:MM AM/PM
  const matchSlash = trimmed.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?$/i
  );
  if (matchSlash) {
    const month = parseInt(matchSlash[1], 10) - 1;
    const day = parseInt(matchSlash[2], 10);
    let year = parseInt(matchSlash[3], 10);
    if (year < 100) year += 2000;

    let hours = matchSlash[4] ? parseInt(matchSlash[4], 10) : 0;
    const minutes = matchSlash[5] ? parseInt(matchSlash[5], 10) : 0;
    const seconds = matchSlash[6] ? parseInt(matchSlash[6], 10) : 0;
    const meridiem = matchSlash[7] ? matchSlash[7].toUpperCase() : null;

    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    const d = new Date(year, month, day, hours, minutes, seconds);
    if (!isNaN(d.getTime())) return d;
  }

  // Standard fallback
  const fallback = new Date(trimmed);
  return isNaN(fallback.getTime()) ? null : fallback;
}

/**
 * Parses individual hours string like "5:00", "2:30", "8" into numeric hours (e.g. 5, 2.5, 8)
 */
export function parseHours(hoursStr: string | number | undefined | null): number {
  if (hoursStr === null || hoursStr === undefined) return 0;
  if (typeof hoursStr === 'number') return isNaN(hoursStr) ? 0 : hoursStr;

  const trimmed = hoursStr.toString().trim();
  if (!trimmed) return 0;

  // Pattern "HH:MM" e.g. "5:30" or "02:00"
  if (trimmed.includes(':')) {
    const [h, m] = trimmed.split(':');
    const hours = parseFloat(h) || 0;
    const minutes = parseFloat(m) || 0;
    return Math.round((hours + minutes / 60) * 10) / 10;
  }

  const num = parseFloat(trimmed);
  return isNaN(num) ? 0 : num;
}

/**
 * Returns YYYY-MM-DD string in local time
 */
export function toISODateString(date: Date | null): string | null {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if a date string is today
 */
export function isTodayDate(dateStr: string | undefined | null): boolean {
  const d = parseZohoDate(dateStr);
  if (!d) return false;

  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

/**
 * Check if a date string is yesterday
 */
export function isYesterdayDate(dateStr: string | undefined | null): boolean {
  const d = parseZohoDate(dateStr);
  if (!d) return false;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate()
  );
}

/**
 * Check if a date string is in the current week (Sunday to Saturday)
 */
export function isThisWeekDate(dateStr: string | undefined | null): boolean {
  const d = parseZohoDate(dateStr);
  if (!d) return false;

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return d >= startOfWeek && d <= endOfWeek;
}

/**
 * Format date for friendly UI presentation
 */
export function formatFriendlyDate(dateStr: string | undefined | null): string {
  const d = parseZohoDate(dateStr);
  if (!d) return dateStr || 'N/A';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return dateStr || 'N/A';
  }
}
