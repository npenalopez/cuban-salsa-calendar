import { Festival } from '../data/festivals';
import { getPrimaryMonth } from './dateUtils';

/**
 * Normalize festivals to prevent cross-month duplicates
 * This utility ensures each festival appears in only one month based on its start date
 */
export function normalizeFestivalMonths(festivals: Festival[]): Festival[] {
  return festivals.map(festival => {
    const primaryMonth = getPrimaryMonth(festival.dates);
    
    // Ensure festival has months array
    const festivalMonths = festival.months || [];
    
    // If we can determine the primary month and it's different from current months
    if (primaryMonth && (!festivalMonths.includes(primaryMonth) || festivalMonths.length > 1)) {
      console.log(`🔄 Normalizing "${festival.name}" from months [${festivalMonths.join(', ')}] to [${primaryMonth}]`);
      
      return {
        ...festival,
        months: [primaryMonth]
      };
    }
    
    // Return festival as-is if already normalized or unable to determine primary month
    return festival;
  });
}

/**
 * Check if a festival list has any cross-month duplicates
 */
export function hasCrossMonthDuplicates(festivals: Festival[]): boolean {
  return festivals.some(festival => (festival.months || []).length > 1);
}

/**
 * Get a report of festivals that span multiple months
 */
export function getCrossMonthFestivalsReport(festivals: Festival[]): Array<{
  id: string;
  name: string;
  dates: string;
  currentMonths: string[];
  suggestedMonth: string | null;
}> {
  return festivals
    .filter(festival => (festival.months || []).length > 1)
    .map(festival => ({
      id: festival.id,
      name: festival.name,
      dates: festival.dates,
      currentMonths: festival.months || [],
      suggestedMonth: getPrimaryMonth(festival.dates)
    }));
}