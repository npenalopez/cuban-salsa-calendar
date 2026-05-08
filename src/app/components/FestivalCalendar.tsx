import { useMemo } from 'react';
import { Festival } from '../data/festivals';
import { getPrimaryMonth } from '../utils/dateUtils';
import { countUniqueFestivals } from '../utils/festivalNormalization';
import { Calendar as CalendarIcon } from 'lucide-react';
import { type UserLocation } from '../services/geolocation';
import { SimpleFestivalCard } from './SimpleFestivalCard';
import { useLanguage } from '../contexts/LanguageContext';

interface FestivalCalendarProps {
  festivals: Festival[];
  userLocation?: UserLocation | null;
  onUpdateFestival?: (festival: Festival) => void;
  allFestivals?: Festival[]; // For artist ranking calculations
}

interface MonthData {
  name: string;
  festivals: Festival[];
}

export function FestivalCalendar({ festivals, userLocation, onUpdateFestival, allFestivals }: FestivalCalendarProps) {
  const { t } = useLanguage();
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const getTranslatedMonth = (month: string): string => {
    const monthMap: Record<string, keyof typeof t.months> = {
      'January': 'january',
      'February': 'february', 
      'March': 'march',
      'April': 'april',
      'May': 'may',
      'June': 'june',
      'July': 'july',
      'August': 'august',
      'September': 'september',
      'October': 'october',
      'November': 'november',
      'December': 'december'
    };
    
    return t.months[monthMap[month]] || month;
  };
  
  // Safety check for festivals array
  const safeFestivals = Array.isArray(festivals) ? festivals : [];
  const festivalsWithTravelTime = safeFestivals;

  const monthlyData = useMemo(() => {
    const data: MonthData[] = [];
    
    months.forEach(month => {
      const monthFestivals = festivalsWithTravelTime.filter(festival => {
        // Safety check for festival object and dates property
        if (!festival || !festival.dates) {
          return false;
        }
        
        // Use primary month to prevent festivals from appearing in multiple months
        const primaryMonth = getPrimaryMonth(festival.dates);
        return primaryMonth === month;
      });
      
      if (monthFestivals.length > 0) {
        data.push({
          name: month,
          festivals: monthFestivals.sort((a, b) => {
            // Safety check for dates before parsing
            const aDateStr = a.dates ? a.dates.split('-')[0].replace(/\D/g, '') : '0';
            const bDateStr = b.dates ? b.dates.split('-')[0].replace(/\D/g, '') : '0';
            const aDate = parseInt(aDateStr) || 0;
            const bDate = parseInt(bDateStr) || 0;
            return aDate - bDate;
          })
        });
      }
    });
    
    return data;
  }, [festivalsWithTravelTime]);

  if (monthlyData.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm max-w-md mx-auto p-8">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-full bg-stone-100 flex items-center justify-center">
              <CalendarIcon className="h-7 w-7 text-stone-500" />
            </div>
          </div>
          <h3 className="font-semibold text-stone-900 mb-2 text-lg">{t.noFestivalsDisplay}</h3>
          <p className="text-sm text-stone-600">{t.tryAdjustingFilters}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {monthlyData.map(({ name, festivals: monthFestivals }) => (
        <section key={name} className="festival-month-section">
          {/* Month Header with accent bar */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="block h-7 w-1 rounded-full bg-gradient-to-b from-red-600 to-orange-400"
              aria-hidden="true"
            />
            <h2 className="font-bold text-stone-900 text-xl tracking-tight">
              {getTranslatedMonth(name)}
            </h2>
            <span className="text-xs font-medium text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full">
              {countUniqueFestivals(monthFestivals)}
            </span>
            <div className="flex-1 h-px bg-stone-200 ml-1" aria-hidden="true" />
          </div>

          {/* Responsive Festival Grid */}
          <div className="festival-grid-compact">
            {monthFestivals.map((festival) => (
              <SimpleFestivalCard
                key={festival.id}
                festival={festival}
                monthName={getTranslatedMonth(name)}
                userLocation={userLocation}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}