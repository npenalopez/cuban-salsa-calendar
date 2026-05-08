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
      <div className="text-center py-8">
        <div className="bg-white border border-gray-200 max-w-md mx-auto p-6">
          <CalendarIcon className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <h3 className="font-medium text-gray-900 mb-2">{t.noFestivalsDisplay}</h3>
          <p className="text-sm text-gray-600">{t.tryAdjustingFilters}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {monthlyData.map(({ name, festivals: monthFestivals }) => (
        <section key={name} className="festival-month-section">
          {/* Month Header */}
          <div className="flex items-center justify-between mb-3 pb-1 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 text-base">{getTranslatedMonth(name)}</h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1">
              {countUniqueFestivals(monthFestivals)}
            </span>
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