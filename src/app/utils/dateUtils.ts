/**
 * Utility functions for handling festival dates
 */

interface ParsedDate {
  month: number;
  day: number;
  year: number;
}

/**
 * Month mapping for both abbreviated and full month names
 * Returns month index (0-11) for JavaScript Date constructor
 */
const MONTH_MAP: { [key: string]: number } = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

/**
 * Normalize date strings before parsing:
 *   - Strip trailing parenthetical annotations like "(TBC)", "(TBA)",
 *     "(Fall Edition)" — they aren't load-bearing for date parsing.
 *   - Normalize hyphen spacing: "Feb 26-March 1" / "Feb 26- March 1" /
 *     "Feb 26 -March 1" all become "Feb 26 - March 1".
 *   - Cross-month date ranges without spaces ("Oct 31-Nov 2") get a
 *     proper " - " for the existing parsers.
 */
function normalizeDateString(dateString: string): string {
  let s = dateString;
  // 1. Strip parenthetical annotations anywhere in the string.
  s = s.replace(/\s*\([^)]*\)/g, '').trim();
  // 2. Cross-month range with no spaces around the dash:
  //    "Oct 31-Nov 2" → "Oct 31 - Nov 2"
  s = s.replace(/([A-Za-z]{3,})\s+(\d{1,2})-([A-Za-z]{3,})\s+(\d{1,2})/g, '$1 $2 - $3 $4');
  // 3. Cross-month range with one-sided spacing:
  //    "Feb 26- March 1" or "Feb 26 -March 1" → "Feb 26 - March 1"
  s = s.replace(/(\d)\s*-\s*([A-Za-z]{3,})/g, '$1 - $2');
  // 4. Collapse any double spaces left over.
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

/**
 * Last-resort: if a date string contains a month name but no day we
 * can parse, return either the first day (kind='start') or the last
 * day (kind='end') of that month. Handles soft dates like:
 *   "April 2026"            → 2026-04-01 / 2026-04-30
 *   "Mid-April 2026"        → same
 *   "Late September 2026"   → same
 *   "Early November 2026"   → same
 */
function fallbackMonthOnlyDate(
  cleanDateString: string,
  finalYear: number,
  kind: 'start' | 'end',
): Date | null {
  const tokens = cleanDateString.split(/[^A-Za-z]+/).filter(Boolean);
  for (const token of tokens) {
    const month = MONTH_MAP[token];
    if (month === undefined) continue;
    if (kind === 'start') return new Date(finalYear, month, 1, 0, 0, 0);
    const lastDay = new Date(finalYear, month + 1, 0).getDate();
    return new Date(finalYear, month, lastDay, 23, 59, 59);
  }
  return null;
}

/**
 * Parse festival date strings and return the START date
 * Returns the start date of the festival for comparison
 */
export function parseFestivalStartDate(
  dateString: string,
  currentYear: number = new Date().getFullYear(),
): Date | null {
  try {
    // Handle empty or invalid date strings
    if (!dateString || dateString.trim() === '-' || dateString.trim() === '') {
      return null;
    }

    // Normalize the date string
    const normalizedDateString = normalizeDateString(dateString.trim());
    const cleanDateString = normalizedDateString.trim();

    // Extract explicit year if present, otherwise use current year
    const explicitYear = extractYearFromDateString(cleanDateString);
    const finalYear = explicitYear || currentYear;

    // Remove year from string for parsing
    const dateWithoutYear = cleanDateString
      .replace(/,?\s*\b(20\d{2})\b/g, "")
      .trim();

    // Handle format like "26-29 Mar" (day range BEFORE month)
    const dayRangeFirstMatch = dateWithoutYear.match(
      /^(\d{1,2})-(\d{1,2})\s+([A-Za-z]{3,})$/,
    );
    if (dayRangeFirstMatch) {
      const startDay = parseInt(dayRangeFirstMatch[1]);
      const month = MONTH_MAP[dayRangeFirstMatch[3]];

      if (month !== undefined && startDay >= 1 && startDay <= 31) {
        return new Date(finalYear, month, startDay, 0, 0, 0);
      }
    }

    // Handle cross-month festivals like "Feb 28 - Mar 2"
    if (dateWithoutYear.includes(" - ")) {
      const parts = dateWithoutYear.split(" - ");
      const startPart = parts[0].trim();

      // Parse start date
      const startMatch = startPart.match(/^([A-Za-z]{3,})\s+(\d{1,2})$/);
      if (!startMatch) {
        console.warn(`Invalid start date format: ${startPart}`);
        return null;
      }

      const startMonth = MONTH_MAP[startMatch[1]];
      const startDay = parseInt(startMatch[2]);

      if (startMonth === undefined || startDay < 1 || startDay > 31) {
        console.warn(`Invalid start date values: ${startPart}`);
        return null;
      }

      return new Date(finalYear, startMonth, startDay, 0, 0, 0);
    }

    // Handle single month festivals like "Jan 10-12"
    const singleMonthMatch = dateWithoutYear.match(
      /^([A-Za-z]{3,})\s+(\d{1,2})-(\d{1,2})$/,
    );
    if (singleMonthMatch) {
      const month = MONTH_MAP[singleMonthMatch[1]];
      const startDay = parseInt(singleMonthMatch[2]);

      if (month !== undefined && startDay >= 1 && startDay <= 31) {
        return new Date(finalYear, month, startDay, 0, 0, 0);
      }
    }

    // Handle single day festivals like "Apr 25"
    const singleDayMatch = dateWithoutYear.match(
      /^([A-Za-z]{3,})\s+(\d{1,2})$/,
    );
    if (singleDayMatch) {
      const month = MONTH_MAP[singleDayMatch[1]];
      const day = parseInt(singleDayMatch[2]);

      if (month !== undefined && day >= 1 && day <= 31) {
        return new Date(finalYear, month, day, 0, 0, 0);
      }
    }

    // Soft-date fallback: month name with no parseable day. Treat as
    // first of that month, e.g. "Mid-April 2026" → 2026-04-01.
    const fallback = fallbackMonthOnlyDate(dateWithoutYear, finalYear, 'start');
    if (fallback) return fallback;

    return null;
  } catch (error) {
    console.warn("Error parsing festival start date:", dateString, error);
    return null;
  }
}

/**
 * Parse festival date strings like "Jan 10-12", "Feb 28 - Mar 2", "Dec 29 - Jan 2"
 * Returns the end date of the festival for comparison
 * Properly handles year-crossing scenarios
 */
export function parseFestivalEndDate(
  dateString: string,
  currentYear: number = new Date().getFullYear(),
): Date | null {
  try {
    // Handle empty or invalid date strings - silently return null for "-" which indicates TBA
    if (!dateString || dateString.trim() === '-' || dateString.trim() === '') {
      return null;
    }

    // Normalize the date string to ensure consistent spacing (e.g., "Oct 31-Nov 2" -> "Oct 31 - Nov 2")
    const normalizedDateString = normalizeDateString(dateString.trim());
    
    // Clean the date string and remove any existing year info
    const cleanDateString = normalizedDateString.trim();

    // Extract explicit year if present, otherwise use current year
    const explicitYear =
      extractYearFromDateString(cleanDateString);
    const finalYear = explicitYear || currentYear;

    // Remove year from string for parsing (and also remove comma before year if present)
    const dateWithoutYear = cleanDateString
      .replace(/,?\s*\b(20\d{2})\b/g, "")
      .trim();

    // Handle format like "26-29 Mar 2026" or "3-5 Apr" (day range BEFORE month)
    const dayRangeFirstMatch = dateWithoutYear.match(
      /^(\d{1,2})-(\d{1,2})\s+([A-Za-z]{3,})$/,
    );
    if (dayRangeFirstMatch) {
      const startDay = parseInt(dayRangeFirstMatch[1]);
      const endDay = parseInt(dayRangeFirstMatch[2]);
      const month = MONTH_MAP[dayRangeFirstMatch[3]];

      if (
        month !== undefined &&
        startDay >= 1 &&
        startDay <= 31 &&
        endDay >= 1 &&
        endDay <= 31
      ) {
        // Validate that end day is after start day
        if (endDay < startDay) {
          console.warn(
            `Invalid date range: ${dateString} - end day ${endDay} is before start day ${startDay}`,
          );
          return new Date(
            finalYear,
            month,
            startDay,
            23,
            59,
            59,
          ); // Return start date as fallback
        }

        return new Date(finalYear, month, endDay, 23, 59, 59);
      }
    }

    // Handle cross-month festivals like "Feb 28 - Mar 2" or "Oct 26 - Nov 4" or "October 26 - November 4"
    if (dateWithoutYear.includes(" - ")) {
      const parts = dateWithoutYear.split(" - ");
      const startPart = parts[0].trim();
      const endPart = parts[1].trim();

      // Parse start date - match both abbreviated (3+ chars) and full month names
      const startMatch = startPart.match(
        /^([A-Za-z]{3,})\s+(\d{1,2})$/,
      );
      if (!startMatch) {
        console.warn(`Invalid start date format: ${startPart}`);
        return null;
      }

      const startMonth = MONTH_MAP[startMatch[1]];
      const startDay = parseInt(startMatch[2]);

      if (
        startMonth === undefined ||
        startDay < 1 ||
        startDay > 31
      ) {
        console.warn(`Invalid start date values: ${startPart}`);
        return null;
      }

      // Check if the end part has a month (like "Mar 2" or "November 4") or just a day (like "2")
      const endMatch = endPart.match(
        /^([A-Za-z]{3,})\s+(\d{1,2})$/,
      );

      if (endMatch) {
        // Cross-month festival (e.g., "Feb 28 - Mar 2" or "Oct 26 - Nov 4" or "October 26 - November 4")
        const endMonth = MONTH_MAP[endMatch[1]];
        const endDay = parseInt(endMatch[2]);

        if (
          endMonth === undefined ||
          endDay < 1 ||
          endDay > 31
        ) {
          console.warn(`Invalid end date values: ${endPart}`);
          return null;
        }

        // Determine if we need to use next year for the end date
        let endYear = finalYear;

        // Handle year-crossing festivals
        if (startMonth === 11 && endMonth === 0) {
          // December to January - always next year
          endYear = finalYear + 1;
        } else if (startMonth > endMonth) {
          // Any other case where start month > end month (crosses year boundary)
          endYear = finalYear + 1;
        }

        return new Date(endYear, endMonth, endDay, 23, 59, 59);
      } else {
        // Same month festival (e.g., "Jan 10 - 12")
        const endDayOnly = parseInt(endPart);

        if (
          isNaN(endDayOnly) ||
          endDayOnly < 1 ||
          endDayOnly > 31
        ) {
          console.warn(`Invalid end day: ${endPart}`);
          return null;
        }

        // Validate that end day is after start day for same month festivals
        if (endDayOnly < startDay) {
          console.warn(
            `Invalid date range: ${dateString} - end day ${endDayOnly} is before start day ${startDay}`,
          );
          return new Date(
            finalYear,
            startMonth,
            startDay,
            23,
            59,
            59,
          ); // Return start date as fallback
        }

        return new Date(
          finalYear,
          startMonth,
          endDayOnly,
          23,
          59,
          59,
        );
      }
    }

    // Handle single month festivals like "Jan 10-12" or "December 15-18"
    const singleMonthMatch = dateWithoutYear.match(
      /^([A-Za-z]{3,})\s+(\d{1,2})-(\d{1,2})$/,
    );
    if (singleMonthMatch) {
      const month = MONTH_MAP[singleMonthMatch[1]];
      const startDay = parseInt(singleMonthMatch[2]);
      const endDay = parseInt(singleMonthMatch[3]);

      if (
        month !== undefined &&
        startDay >= 1 &&
        startDay <= 31 &&
        endDay >= 1 &&
        endDay <= 31
      ) {
        // Validate that end day is after start day
        if (endDay < startDay) {
          console.warn(
            `Invalid date range: ${dateString} - end day ${endDay} is before start day ${startDay}`,
          );
          return new Date(
            finalYear,
            month,
            startDay,
            23,
            59,
            59,
          ); // Return start date as fallback
        }

        return new Date(finalYear, month, endDay, 23, 59, 59);
      }
    }

    // Handle single day festivals like "Apr 25" or "April 25"
    const singleDayMatch = dateWithoutYear.match(
      /^([A-Za-z]{3,})\s+(\d{1,2})$/,
    );
    if (singleDayMatch) {
      const month = MONTH_MAP[singleDayMatch[1]];
      const day = parseInt(singleDayMatch[2]);

      if (month !== undefined && day >= 1 && day <= 31) {
        return new Date(finalYear, month, day, 23, 59, 59);
      }
    }

    // Soft-date fallback: month name with no parseable day. Treat as
    // "end of that month" so isFestivalPast still has something to
    // compare against, e.g. "Mid-April 2026" → 2026-04-30.
    const fallback = fallbackMonthOnlyDate(dateWithoutYear, finalYear, 'end');
    if (fallback) return fallback;

    return null;
  } catch (error) {
    console.warn(
      "Error parsing festival date:",
      dateString,
      error,
    );
    return null;
  }
}

/**
 * Check if a festival has passed based on its date string
 * A festival is considered past if its END date is before today
 */
export function isFestivalPast(dateString: string): boolean {
  try {
    const currentDate = new Date();
    // Set to start of today to compare dates without time
    currentDate.setHours(0, 0, 0, 0);
    const currentYear = currentDate.getFullYear();

    // Check if the date string contains an explicit year
    const explicitYear = extractYearFromDateString(dateString);
    
    if (explicitYear) {
      // If there's an explicit year, use it directly
      const festivalEndDate = parseFestivalEndDate(dateString, explicitYear);
      
      if (!festivalEndDate) {
        return false; // Can't parse, show the festival
      }
      
      // Check if the festival end date has passed (is before today)
      return festivalEndDate < currentDate;
    } else {
      // No explicit year - try current year first
      let festivalEndDate = parseFestivalEndDate(dateString, currentYear);

      if (!festivalEndDate) {
        return false; // Can't parse, show the festival
      }

      // If the festival end date is in the past for this year, it has passed
      if (festivalEndDate < currentDate) {
        return true;
      }

      // Festival hasn't ended yet this year
      return false;
    }
  } catch (error) {
    console.warn(
      "Error checking if festival is past:",
      dateString,
      error,
    );
    return false; // Default to showing the festival if we can't determine
  }
}

/**
 * Get the next occurrence of a festival (this year or next year)
 */
export function getNextFestivalDate(
  dateString: string,
): Date | null {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Try this year first
  let festivalEndDate = parseFestivalEndDate(
    dateString,
    currentYear,
  );

  if (festivalEndDate && festivalEndDate >= currentDate) {
    return festivalEndDate;
  }

  // Try next year
  return parseFestivalEndDate(dateString, currentYear + 1);
}

/**
 * Format a date range for display with end date
 */
export function formatDateRange(dateString: string): string {
  try {
    // Normalize the date string to ensure consistent spacing (e.g., "Oct 31-Nov 2" -> "Oct 31 - Nov 2")
    const normalizedDateString = normalizeDateString(dateString.trim());
    const cleanDateString = normalizedDateString.trim();

    // Month abbreviations mapping (handles both abbreviated and full month names)
    const monthMap: { [key: string]: string } = {
      Jan: "January",
      Feb: "February",
      Mar: "March",
      Apr: "April",
      May: "May",
      Jun: "June",
      Jul: "July",
      Aug: "August",
      Sep: "September",
      Oct: "October",
      Nov: "November",
      Dec: "December",
      January: "January",
      February: "February",
      March: "March",
      April: "April",
      June: "June",
      July: "July",
      August: "August",
      September: "September",
      October: "October",
      November: "November",
      December: "December",
    };

    // Handle cross-month festivals like "Feb 28 - Mar 2" or "October 26 - November 4"
    if (cleanDateString.includes(" - ")) {
      const parts = cleanDateString.split(" - ");
      const startPart = parts[0].trim();
      const endPart = parts[1].trim();

      // Parse start date - match both abbreviated and full month names
      const startMatch = startPart.match(
        /^([A-Za-z]{3,})\s+(\d{1,2})$/,
      );
      const endMatch = endPart.match(
        /^([A-Za-z]{3,})\s+(\d{1,2})$/,
      );

      if (startMatch && endMatch) {
        const startMonth = monthMap[startMatch[1]];
        const startDay = parseInt(startMatch[2]);
        const endMonth = monthMap[endMatch[1]];
        const endDay = parseInt(endMatch[2]);

        return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
      } else if (startMatch) {
        const startMonth = monthMap[startMatch[1]];
        const startDay = parseInt(startMatch[2]);
        const endDay = parseInt(endPart);

        return `${startMonth} ${startDay} - ${endDay}`;
      }
    }

    // Handle single month festivals like "Jan 10-12" or "December 15-18"
    const singleMonthMatch = cleanDateString.match(
      /^([A-Za-z]{3,})\s+(\d{1,2})-(\d{1,2})$/,
    );
    if (singleMonthMatch) {
      const month = monthMap[singleMonthMatch[1]];
      const startDay = parseInt(singleMonthMatch[2]);
      const endDay = parseInt(singleMonthMatch[3]);

      return `${month} ${startDay} - ${endDay}`;
    }

    // Handle single day festivals like "Apr 25" or "April 25"
    const singleDayMatch = cleanDateString.match(
      /^([A-Za-z]{3,})\s+(\d{1,2})$/,
    );
    if (singleDayMatch) {
      const month = monthMap[singleDayMatch[1]];
      const day = parseInt(singleDayMatch[2]);

      return `${month} ${day}`;
    }

    // Return original string if no pattern matches
    return dateString;
  } catch (error) {
    console.warn(
      "Error formatting date range:",
      dateString,
      error,
    );
    return dateString;
  }
}

/**
 * Get the year for a festival based on current date and festival timing
 * Returns predictable year assignments for chronological ordering
 */
export function getFestivalYear(dateString: string): number {
  // Check if date string already contains a year
  const yearMatch = dateString.match(/\b(20\d{2})\b/);
  if (yearMatch) {
    return parseInt(yearMatch[1]);
  }

  // For festivals without explicit years, default to 2025
  // This ensures consistent chronological ordering
  return 2025;
}

/**
 * Extract year from date string if present, otherwise return null
 */
export function extractYearFromDateString(
  dateString: string,
): number | null {
  const yearMatch = dateString.match(/\b(20\d{2})\b/);
  return yearMatch ? parseInt(yearMatch[1]) : null;
}

/**
 * Add or update year in a date string
 */
export function setYearInDateString(
  dateString: string,
  year: number,
): string {
  // Remove existing year if present
  const cleanedString = dateString
    .replace(/\b(20\d{2})\b/g, "")
    .trim();

  // Add the new year to the end
  return `${cleanedString} ${year}`.trim();
}

/**
 * Get festival sorting priority based on year, month, and date
 * Returns a number that can be used for sorting (lower = earlier)
 */
export function getFestivalSortPriority(
  dateString: string,
): number {
  try {
    const year = getFestivalYear(dateString);
    const primaryMonth = getPrimaryMonth(dateString);

    // Month order for sorting
    const monthOrder = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    const monthNum =
      monthOrder[primaryMonth as keyof typeof monthOrder] || 13;

    // Try to get the specific start day for more precise sorting
    let dayNum = 1; // Default to 1st of month
    try {
      const dateRange = getFestivalDateRange(dateString, year);
      dayNum = dateRange.start.getDate();
    } catch (error) {
      console.warn(
        "Could not extract day from date string:",
        dateString,
      );
    }

    // Create a sortable number: YYYYMMDD format
    return year * 10000 + monthNum * 100 + dayNum;
  } catch (error) {
    console.warn(
      "Error calculating sort priority for:",
      dateString,
      error,
    );
    // Return a very high number so problematic dates sort to the end
    return 99999999;
  }
}

/**
 * Get the primary month for a festival based on its start date
 * This ensures festivals only appear in one month section
 */
export function getPrimaryMonth(
  dateString: string,
): string | null {
  try {
    // Normalize the date string to ensure consistent spacing (e.g., "Oct 31-Nov 2" -> "Oct 31 - Nov 2")
    const normalizedDateString = normalizeDateString(dateString.trim());
    const cleanDateString = normalizedDateString.trim();

    // Month abbreviations mapping to full names (handles both abbreviated and full month names)
    const monthMap: { [key: string]: string } = {
      Jan: "January",
      Feb: "February",
      Mar: "March",
      Apr: "April",
      May: "May",
      Jun: "June",
      Jul: "July",
      Aug: "August",
      Sep: "September",
      Oct: "October",
      Nov: "November",
      Dec: "December",
      January: "January",
      February: "February",
      March: "March",
      April: "April",
      June: "June",
      July: "July",
      August: "August",
      September: "September",
      October: "October",
      November: "November",
      December: "December",
    };

    // Find the FIRST month name anywhere in the string. This naturally
    // handles:
    //   - normal entries: "April 10-12, 2026" → April
    //   - cross-month: "Feb 28 - Mar 2, 2026" → February (start month wins
    //     because it appears first)
    //   - soft-date prefixes: "Mid-April 2026", "Late September 2026",
    //     "Early November 2026", "TBC March 2026" → April / September /
    //     November / March
    // Entries with no month name at all (e.g. "TBC 2026") still return
    // null so they fall out of `isDisplayableFestival`.
    const tokens = cleanDateString.split(/[^A-Za-z]+/).filter(Boolean);
    for (const token of tokens) {
      const month = monthMap[token];
      if (month) return month;
    }
    return null;
  } catch (error) {
    console.warn(
      "Error getting primary month:",
      dateString,
      error,
    );
    return null;
  }
}

/**
 * Parse festival date string and return start and end dates
 * For global calendar view
 */
export function getFestivalDateRange(
  dateString: string,
  year: number = 2025,
): { start: Date; end: Date } {
  try {
    // Normalize the date string to ensure consistent spacing (e.g., "Oct 31-Nov 2" -> "Oct 31 - Nov 2")
    const normalizedDateString = normalizeDateString(dateString.trim());
    
    const cleanDateString = normalizedDateString.trim();

    // Extract explicit year if present, otherwise use provided year
    const explicitYear =
      extractYearFromDateString(cleanDateString);
    const finalYear = explicitYear || year;

    // Remove year from string for parsing (and also remove comma before year if present)
    const dateWithoutYear = cleanDateString
      .replace(/,?\s*\b(20\d{2})\b/g, "")
      .trim();

    // Handle cross-month festivals like "Feb 28 - Mar 2" or "Oct 26 - Nov 4" or "October 26 - November 4"
    if (dateWithoutYear.includes(" - ")) {
      const parts = dateWithoutYear.split(" - ");
      const startPart = parts[0].trim();
      const endPart = parts[1].trim();

      // Parse start date - match both abbreviated (3+ chars) and full month names
      const startMatch = startPart.match(
        /^([A-Za-z]{3,})\s+(\d{1,2})$/,
      );
      if (!startMatch) {
        throw new Error("Invalid start date format");
      }

      const startMonth = MONTH_MAP[startMatch[1]];
      const startDay = parseInt(startMatch[2]);

      // Parse end date - match both abbreviated (3+ chars) and full month names
      const endMatch = endPart.match(
        /^([A-Za-z]{3,})\s+(\d{1,2})$/,
      );
      let endMonth,
        endDay,
        endYear = finalYear;

      if (endMatch) {
        // End has month specified (cross-month festival)
        endMonth = MONTH_MAP[endMatch[1]];
        endDay = parseInt(endMatch[2]);

        // Handle year-crossing festivals (like Dec 29 - Jan 2)
        // If start month is later in the year than end month, the festival crosses years
        if (startMonth > endMonth) {
          endYear = finalYear + 1;
        }
        // Special case: if we're dealing with December to January transition
        // Always force next year for January when starting in December
        else if (startMonth === 11 && endMonth === 0) {
          // December to January
          endYear = finalYear + 1;
        }
      } else {
        // End is just a day number (same month)
        endMonth = startMonth;
        endDay = parseInt(endPart);

        // Validate that end day is after start day for same month festivals
        if (endDay < startDay) {
          console.warn(
            `Invalid date range: ${dateString} - end day ${endDay} is before start day ${startDay}`,
          );
          endDay = startDay; // Default to single day festival
        }
      }

      const startDate = new Date(
        finalYear,
        startMonth,
        startDay,
      );
      const endDate = new Date(
        endYear,
        endMonth,
        endDay,
        23,
        59,
        59,
      );

      return { start: startDate, end: endDate };
    }

    // Handle single month festivals like "Jan 10-12" or "December 15-18"
    const singleMonthMatch = dateWithoutYear.match(
      /^([A-Za-z]{3,})\s+(\d{1,2})-(\d{1,2})$/,
    );
    if (singleMonthMatch) {
      const month = MONTH_MAP[singleMonthMatch[1]];
      const startDay = parseInt(singleMonthMatch[2]);
      const endDay = parseInt(singleMonthMatch[3]);

      const startDate = new Date(finalYear, month, startDay);
      const endDate = new Date(
        finalYear,
        month,
        endDay,
        23,
        59,
        59,
      );

      return { start: startDate, end: endDate };
    }

    // Handle single day festivals like "Apr 25" or "April 25"
    const singleDayMatch = dateWithoutYear.match(
      /^([A-Za-z]{3,})\s+(\d{1,2})$/,
    );
    if (singleDayMatch) {
      const month = MONTH_MAP[singleDayMatch[1]];
      const day = parseInt(singleDayMatch[2]);

      const date = new Date(finalYear, month, day);
      const endDate = new Date(
        finalYear,
        month,
        day,
        23,
        59,
        59,
      );

      return { start: date, end: endDate };
    }

    // Fallback: assume single day
    const fallbackDate = new Date(finalYear, 0, 1);
    return { start: fallbackDate, end: fallbackDate };
  } catch (error) {
    console.warn(
      "Error parsing festival date range:",
      dateString,
      error,
    );
    // Return a safe fallback
    const fallbackDate = new Date(year, 0, 1);
    return { start: fallbackDate, end: fallbackDate };
  }
}

/**
 * Check if a date falls within a festival's date range
 */
export function isDateInRange(
  date: Date,
  startDate: Date,
  endDate: Date,
): boolean {
  const checkDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const start = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
  );
  const end = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
  );

  return checkDate >= start && checkDate <= end;
}

/**
 * Get the end date from a date string for display
 */
export function getEndDateFromString(
  dateString: string,
): string | null {
  try {
    // Normalize the date string to ensure consistent spacing (e.g., "Oct 31-Nov 2" -> "Oct 31 - Nov 2")
    const normalizedDateString = normalizeDateString(dateString.trim());
    const cleanDateString = normalizedDateString.trim();

    // Handle cross-month festivals like "Feb 28 - Mar 2" or "October 26 - November 4"
    if (cleanDateString.includes(" - ")) {
      const parts = cleanDateString.split(" - ");
      const endPart = parts[1].trim();

      // Check if end part has month - match both abbreviated and full month names
      const endMatch = endPart.match(
        /^([A-Za-z]{3,})\s+(\d{1,2})$/,
      );
      if (endMatch) {
        return endPart; // "Mar 2" or "November 4"
      } else {
        // End is just a day number, use start month
        const startPart = parts[0].trim();
        const startMatch = startPart.match(
          /^([A-Za-z]{3,})\s+(\d{1,2})$/,
        );
        if (startMatch) {
          return `${startMatch[1]} ${endPart}`; // "Jan 12" or "January 12"
        }
      }
    }

    // Handle single month festivals like "Jan 10-12" or "December 15-18"
    const singleMonthMatch = cleanDateString.match(
      /^([A-Za-z]{3,})\s+(\d{1,2})-(\d{1,2})$/,
    );
    if (singleMonthMatch) {
      return `${singleMonthMatch[1]} ${singleMonthMatch[3]}`; // "Jan 12" or "December 18"
    }

    // Single day festival - no end date
    return null;
  } catch (error) {
    console.warn("Error getting end date:", dateString, error);
    return null;
  }
}

/**
 * Get the start date from a date string for display
 */
export function getStartDateFromString(
  dateString: string,
): string | null {
  try {
    // Normalize the date string to ensure consistent spacing (e.g., "Oct 31-Nov 2" -> "Oct 31 - Nov 2")
    const normalizedDateString = normalizeDateString(dateString.trim());
    const cleanDateString = normalizedDateString.trim();

    // Handle all date formats and extract start date
    if (cleanDateString.includes(" - ")) {
      const parts = cleanDateString.split(" - ");
      return parts[0].trim(); // Start part
    }

    // Handle single month festivals like "Jan 10-12" or "December 15-18"
    const singleMonthMatch = cleanDateString.match(
      /^([A-Za-z]{3,})\s+(\d{1,2})-(\d{1,2})$/,
    );
    if (singleMonthMatch) {
      return `${singleMonthMatch[1]} ${singleMonthMatch[2]}`; // "Jan 10" or "December 15"
    }

    // Single day festival like "Apr 25" or "April 25"
    const singleDayMatch = cleanDateString.match(
      /^([A-Za-z]{3,})\s+(\d{1,2})$/,
    );
    if (singleDayMatch) {
      return cleanDateString; // "Apr 25" or "April 25"
    }

    return cleanDateString;
  } catch (error) {
    console.warn(
      "Error getting start date:",
      dateString,
      error,
    );
    return dateString;
  }
}

/**
 * Calculate the duration of a festival in days
 * Handles cross-month festivals correctly
 */
export function getFestivalDuration(
  dateString: string,
  year: number = 2025,
): number {
  try {
    const dateRange = getFestivalDateRange(dateString, year);

    // Calculate the difference in days between start and end
    // We need to normalize the dates to just the date part (not time)
    const startDate = new Date(
      dateRange.start.getFullYear(),
      dateRange.start.getMonth(),
      dateRange.start.getDate(),
    );
    const endDate = new Date(
      dateRange.end.getFullYear(),
      dateRange.end.getMonth(),
      dateRange.end.getDate(),
    );

    // Calculate difference in milliseconds and convert to days
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    // Festival duration is inclusive of both start and end days
    // For example: Jan 30 - Feb 1 should be 3 days (30, 31, 1)
    // Jan 31 - Feb 3 should be 4 days (31, 1, 2, 3)
    return Math.round(daysDiff) + 1;
  } catch (error) {
    console.warn(
      "Error calculating festival duration:",
      dateString,
      error,
    );
    return 1; // Default to 1 day if we can't calculate
  }
}

/**
 * Get a human-readable duration description
 */
export function getFestivalDurationText(
  dateString: string,
  year: number = 2025,
): string {
  try {
    const duration = getFestivalDuration(dateString, year);

    if (duration === 1) {
      return "1 day";
    } else if (duration <= 7) {
      return `${duration} days`;
    } else {
      const weeks = Math.floor(duration / 7);
      const remainingDays = duration % 7;

      if (remainingDays === 0) {
        return weeks === 1 ? "1 week" : `${weeks} weeks`;
      } else {
        return weeks === 1
          ? `1 week, ${remainingDays} day${remainingDays > 1 ? "s" : ""}`
          : `${weeks} weeks, ${remainingDays} day${remainingDays > 1 ? "s" : ""}`;
      }
    }
  } catch (error) {
    console.warn(
      "Error getting festival duration text:",
      dateString,
      error,
    );
    return "Duration unknown";
  }
}

/**
 * Get a human-readable duration description with translation support
 */
export function getFestivalDurationTextTranslated(
  dateString: string,
  year: number = 2025,
  translations: any,
): string {
  try {
    const duration = getFestivalDuration(dateString, year);
    if (duration === 1) {
      return `1 ${translations.day}`;
    } else if (duration <= 7) {
      return `${duration} ${translations.days}`;
    } else {
      const weeks = Math.floor(duration / 7);
      const remainingDays = duration % 7;

      if (remainingDays === 0) {
        if (weeks === 1) {
          return `1 ${translations.week}`;
        } else {
          return `${weeks} ${translations.week}`;
        }
      } else {
        const dayText =
          remainingDays === 1
            ? translations.day
            : translations.days;
        if (weeks === 1) {
          return `1 week, ${remainingDays} ${dayText}`;
        } else {
          return `${weeks} weeks, ${remainingDays} ${dayText}`;
        }
      }
    }
  } catch (error) {
    console.warn(
      "Error getting translated festival duration text:",
      dateString,
      error,
    );
    return translations.duration || "Duration unknown";
  }
}

/**
 * Check if a festival spans multiple months
 */
export function isMultiMonthFestival(
  dateString: string,
): boolean {
  try {
    // Normalize the date string to ensure consistent spacing (e.g., "Oct 31-Nov 2" -> "Oct 31 - Nov 2")
    const normalizedDateString = normalizeDateString(dateString.trim());
    const cleanDateString = normalizedDateString.trim();

    // Check if it contains cross-month pattern like "Jan 31 - Feb 3" or "Dec 29 - Jan 2"
    if (cleanDateString.includes(" - ")) {
      const parts = cleanDateString.split(" - ");
      const startPart = parts[0].trim();
      const endPart = parts[1].trim();

      // Check if both parts have month abbreviations or full month names
      const startMatch = startPart.match(/^([A-Za-z]{3,})/);
      const endMatch = endPart.match(/^([A-Za-z]{3,})/);

      if (startMatch && endMatch) {
        // Different months means multi-month festival
        return startMatch[1] !== endMatch[1];
      }
    }

    return false;
  } catch (error) {
    console.warn(
      "Error checking if multi-month festival:",
      dateString,
      error,
    );
    return false;
  }
}

/**
 * Get all months that a festival spans
 */
export function getFestivalSpanMonths(
  dateString: string,
  year: number = 2025,
): string[] {
  try {
    const dateRange = getFestivalDateRange(dateString, year);
    const months: string[] = [];

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Get all months between start and end date
    const currentDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    while (currentDate <= endDate) {
      const monthName = monthNames[currentDate.getMonth()];
      if (!months.includes(monthName)) {
        months.push(monthName);
      }

      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
      currentDate.setDate(1); // Set to first day of next month
    }

    return months;
  } catch (error) {
    console.warn(
      "Error getting festival span months:",
      dateString,
      error,
    );
    return [getPrimaryMonth(dateString) || "January"];
  }
}

/**
 * Debug function to test year assignment and sorting
 */
export function debugFestivalYearAssignment(
  festivals: any[],
): void {
  console.log("🔍 Festival Year Assignment Debug:");

  const testFestivals = festivals.slice(0, 10);
  const yearAssignments = testFestivals.map((f) => ({
    name: f.name,
    dates: f.dates,
    hasExplicitYear: /\b(20\d{2})\b/.test(f.dates),
    extractedYear: extractYearFromDateString(f.dates),
    calculatedYear: getFestivalYear(f.dates),
    sortPriority: getFestivalSortPriority(f.dates),
    primaryMonth: getPrimaryMonth(f.dates),
    duration: getFestivalDuration(f.dates),
    durationText: getFestivalDurationText(f.dates),
    isMultiMonth: isMultiMonthFestival(f.dates),
    spanMonths: getFestivalSpanMonths(f.dates),
  }));

  // Sort by priority to see the order
  yearAssignments.sort(
    (a, b) => a.sortPriority - b.sortPriority,
  );

  console.table(yearAssignments);

  // Show year distribution
  const yearCounts = yearAssignments.reduce(
    (acc, festival) => {
      acc[festival.calculatedYear] =
        (acc[festival.calculatedYear] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );

  console.log("📊 Year Distribution:", yearCounts);
  console.log(
    "✅ Expected Order: 2025 festivals should come before 2026+ festivals",
  );

  // Show multi-month festival details
  const multiMonthFestivals = yearAssignments.filter(
    (f) => f.isMultiMonth,
  );
  if (multiMonthFestivals.length > 0) {
    console.log("🗓️ Multi-Month Festivals:");
    console.table(
      multiMonthFestivals.map((f) => ({
        name: f.name,
        dates: f.dates,
        duration: f.durationText,
        spanMonths: f.spanMonths.join(", "),
      })),
    );
  }
}

/**
 * Test cross-month festival calendar display
 */
export function testCrossMonthCalendarDisplay() {
  console.log(
    "🗓️ Testing Cross-Month Festival Calendar Display:",
  );

  const testCases = [
    { dates: "Jan 30 - Feb 3", year: 2025 },
    { dates: "Feb 28 - Mar 2", year: 2025 },
    { dates: "Dec 29 - Jan 2", year: 2025 },
    { dates: "Mar 31 - Apr 1", year: 2025 },
    { dates: "May 15-19", year: 2025 },
  ];

  const results = testCases.map((test) => {
    const dateRange = getFestivalDateRange(
      test.dates,
      test.year,
    );
    const spanMonths = getFestivalSpanMonths(
      test.dates,
      test.year,
    );
    const isMultiMonth = isMultiMonthFestival(test.dates);

    // Test which calendar months should show this festival
    const shouldShowInMonths: string[] = [];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    monthNames.forEach((monthName, monthIndex) => {
      const daysInMonth = new Date(
        test.year,
        monthIndex + 1,
        0,
      ).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const testDate = new Date(test.year, monthIndex, day);
        if (
          isDateInRange(
            testDate,
            dateRange.start,
            dateRange.end,
          )
        ) {
          if (!shouldShowInMonths.includes(monthName)) {
            shouldShowInMonths.push(monthName);
          }
          break; // Found at least one day, no need to check more
        }
      }
    });

    return {
      dates: test.dates,
      year: test.year,
      isMultiMonth,
      spanMonths: spanMonths.join(", "),
      shouldShowInMonths: shouldShowInMonths.join(", "),
      startDate: dateRange.start.toDateString(),
      endDate: dateRange.end.toDateString(),
      correct:
        spanMonths.length === shouldShowInMonths.length
          ? "✅"
          : "❌",
    };
  });

  console.table(results);

  const allCorrect = results.every((r) => r.correct === "✅");
  console.log(
    allCorrect
      ? "✅ All cross-month calendar displays are correct!"
      : "❌ Some cross-month displays may have issues!",
  );

  return results;
}

/**
 * Test specific festival duration calculations
 */
export function testFestivalDurations(): void {
  console.log("🧪 Testing Festival Duration Calculations:");

  const testCases = [
    { dates: "Jan 10-12", expected: 3 },
    { dates: "Jan 30 - Feb 1", expected: 3 },
    { dates: "Jan 31 - Feb 3", expected: 4 },
    { dates: "Feb 28 - Mar 2", expected: 3 },
    { dates: "Dec 29 - Jan 2", expected: 5 },
    { dates: "Apr 25", expected: 1 },
    { dates: "May 15-19", expected: 5 },
  ];

  const results = testCases.map((test) => {
    const actualDuration = getFestivalDuration(
      test.dates,
      2025,
    );
    const durationText = getFestivalDurationText(
      test.dates,
      2025,
    );
    const isMultiMonth = isMultiMonthFestival(test.dates);
    const spanMonths = getFestivalSpanMonths(test.dates, 2025);

    return {
      dates: test.dates,
      expected: test.expected,
      actual: actualDuration,
      correct: actualDuration === test.expected ? "✅" : "❌",
      durationText,
      isMultiMonth,
      spanMonths: spanMonths.join(", "),
    };
  });

  console.table(results);

  const allCorrect = results.every(
    (r) => r.actual === r.expected,
  );
  console.log(
    allCorrect
      ? "✅ All duration calculations are correct!"
      : "❌ Some duration calculations are incorrect!",
  );
}