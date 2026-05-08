import { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Festival } from '../data/festivals';
import { getPrimaryMonth } from '../utils/dateUtils';
import { countUniqueFestivals } from '../utils/festivalNormalization';
import { ImprovedAutocompleteSearch } from './ImprovedAutocompleteSearch';
import { useLanguage } from '../contexts/LanguageContext';
import { UserLocation } from '../services/geolocation';

interface SimpleFiltersProps {
  searchQuery: string;
  selectedMonth: string;
  onSearchChange: (query: string) => void;
  onMonthChange: (month: string) => void;
  onClearAll: () => void;
  filteredCount: number;
  totalCount: number;
  festivals: Festival[];
  userLocation: UserLocation | null;
  locationLoading: boolean;
}

export function SimpleFilters({
  searchQuery,
  selectedMonth,
  onSearchChange,
  onMonthChange,
  onClearAll,
  filteredCount,
  totalCount,
  festivals,
  userLocation,
  locationLoading
}: SimpleFiltersProps) {
  const { t } = useLanguage();
  
  const months = [
    { key: "All", label: t.months.all },
    { key: "January", label: t.months.january },
    { key: "February", label: t.months.february },
    { key: "March", label: t.months.march },
    { key: "April", label: t.months.april },
    { key: "May", label: t.months.may },
    { key: "June", label: t.months.june },
    { key: "July", label: t.months.july },
    { key: "August", label: t.months.august },
    { key: "September", label: t.months.september },
    { key: "October", label: t.months.october },
    { key: "November", label: t.months.november },
    { key: "December", label: t.months.december }
  ];

  const hasActiveFilters = selectedMonth !== "All" || searchQuery;
  
  const getMonthDisplay = (monthKey: string) => {
    const month = months.find(m => m.key === monthKey);
    if (!month) return monthKey;
    return month.key === "All" ? month.label : month.label.slice(0, 3);
  };



  // Get festival count for each month considering current search query
  const getMonthFestivalCount = (monthKey: string) => {
    // Safety check for festivals array
    if (!Array.isArray(festivals) || festivals.length === 0) {
      return 0;
    }

    // Filter festivals that match the current search query - using the same logic as App.tsx
    const searchFilteredFestivals = festivals.filter((festival) => {
      // Ensure festival has required properties
      if (!festival || typeof festival !== 'object') {
        return false;
      }

      // Ensure required string properties exist
      if (!festival.dates || !festival.name || !festival.city || !festival.country || !festival.continent) {
        return false;
      }

      // Ensure dates can be parsed to a valid month (same as App.tsx)
      const primaryMonth = getPrimaryMonth(festival.dates);
      if (!primaryMonth) {
        return false;
      }

      // Enhanced search logic with precise country filtering (same as App.tsx)
      const searchMatch =
        searchQuery === "" ||
        searchQuery.trim() === "" ||
        (() => {
          const query = searchQuery.toLowerCase().trim();

          // Get all unique countries from festivals with safety checks
          const allCountries = [
            ...new Set(
              festivals
                .filter(f => f && f.country && typeof f.country === 'string')
                .map((f) => f.country.toLowerCase()),
            ),
          ];

          // Check for exact country match
          const exactCountryMatch = allCountries.find(
            (country) => country === query,
          );

          // If query exactly matches a country name, only show festivals from that country
          if (exactCountryMatch) {
            return festival.country.toLowerCase() === query;
          }

          // Check for close country match (partial but likely a country)
          const closeCountryMatch = allCountries.find(
            (country) =>
              country.includes(query) && query.length >= 3,
          );

          // If it's likely a country search (3+ chars and matches part of a country), prioritize country results
          if (closeCountryMatch && query.length >= 3) {
            return festival.country
              .toLowerCase()
              .includes(query);
          }

          // Otherwise, do broad search across all fields
          // Festival name match
          if (festival.name && festival.name.toLowerCase().includes(query))
            return true;

          // City match
          if (festival.city && festival.city.toLowerCase().includes(query))
            return true;

          // Country match (for partial matches when not a clear country search)
          if (festival.country && festival.country.toLowerCase().includes(query))
            return true;

          // Continent match
          if (festival.continent && festival.continent.toLowerCase().includes(query))
            return true;

          // Artist match with proper safety checks
          if (
            festival.artists &&
            Array.isArray(festival.artists) &&
            festival.artists.length > 0
          ) {
            return festival.artists.some(
              (artist) =>
                artist &&
                typeof artist === "string" &&
                artist.toLowerCase().includes(query),
            );
          }

          return false;
        })();

      return searchMatch;
    });

    if (monthKey === "All") {
      return countUniqueFestivals(searchFilteredFestivals);
    }
    
    // For specific months, filter by month AND search query
    const monthFestivals = searchFilteredFestivals.filter(festival => {
      // Safety check for festival object and required properties
      if (!festival || !festival.dates) {
        return false;
      }
      
      const primaryMonth = getPrimaryMonth(festival.dates);
      return primaryMonth === monthKey;
    });
    
    return countUniqueFestivals(monthFestivals);
  };

  return (
    <div className="space-y-3">
      {/* Mobile-First Search and Controls */}
      <div className="space-y-3 sm:space-y-0">
        {/* Mobile Layout: Stack vertically */}
        <div className="flex flex-col gap-3 sm:hidden">
          {/* Mobile Search - Full Width */}
          <ImprovedAutocompleteSearch
            festivals={festivals}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            placeholder={t.searchPlaceholder}
            className="w-full"
            selectedMonth={selectedMonth}
          />
          
          {/* Mobile Results Counter and Location */}
          <div className="flex justify-center items-center gap-3">
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded font-medium">
              {t.resultsCount(filteredCount, totalCount)}
            </div>
            
            {/* Mobile Location Indicator */}
            {userLocation && !locationLoading && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-2 rounded text-xs font-medium cursor-help">
                    <MapPin className="h-3 w-3" />
                    <span>{userLocation.city}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {t.yourLocation}: {userLocation.city},{" "}
                    {userLocation.country}
                  </p>
                  <p className="text-xs opacity-75">
                    {t.travelTime}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Desktop Layout: Single row (hidden on mobile) */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Enhanced Autocomplete Search */}
          <ImprovedAutocompleteSearch
            festivals={festivals}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            placeholder={t.searchPlaceholder}
            className="flex-1"
            selectedMonth={selectedMonth}
          />

          {/* Location Indicator */}
          {userLocation && !locationLoading && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium cursor-help">
                  <MapPin className="h-3 w-3" />
                  <span>{userLocation.city}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {t.yourLocation}: {userLocation.city},{" "}
                  {userLocation.country}
                </p>
                <p className="text-xs opacity-75">
                  {t.travelTime}
                </p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Results Counter */}
          <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
            {t.resultsCount(filteredCount, totalCount)}
          </div>
        </div>
      </div>

      {/* Compact Month Filter */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
        {months.map((month) => (
          <button
            key={month.key}
            onClick={() => onMonthChange(month.key)}
            className={`flex-shrink-0 px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
              selectedMonth === month.key
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label={`${t.searchFestivals} ${month.key === 'All' ? t.months.all : month.label}`}
          >
            {getMonthDisplay(month.key)}
            <span className="ml-1 text-xs opacity-75">
              ({getMonthFestivalCount(month.key)})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}