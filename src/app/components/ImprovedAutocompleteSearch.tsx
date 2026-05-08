import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, Calendar, User, X, Clock, TrendingUp, Globe, Music } from 'lucide-react';
import { Festival } from '../data/festivals';
import { useLanguage } from '../contexts/LanguageContext';
import { getPrimaryMonth } from '../utils/dateUtils';

interface AutocompleteSuggestion {
  type: 'festival' | 'city' | 'country' | 'artist' | 'continent' | 'recent' | 'popular';
  value: string;
  label: string;
  icon: React.ReactNode;
  detail?: string;
  matchScore?: number;
  festivalCount?: number;
}

interface SuggestionCategory {
  title: string;
  suggestions: AutocompleteSuggestion[];
  icon: React.ReactNode;
}

interface ImprovedAutocompleteSearchProps {
  festivals: Festival[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  className?: string;
  selectedMonth?: string; // Add current month filter
}

const RECENT_SEARCHES_KEY = 'cuban-calendar-recent-searches';
const MAX_RECENT_SEARCHES = 5;

export function ImprovedAutocompleteSearch({
  festivals,
  searchQuery,
  onSearchChange,
  placeholder,
  className = "",
  selectedMonth = "All"
}: ImprovedAutocompleteSearchProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const actualPlaceholder = placeholder || t.searchPlaceholder;

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Failed to load recent searches:', error);
    }
  }, []);

  // Save search to recent searches
  const saveToRecentSearches = useCallback((query: string) => {
    if (!query.trim() || query.length < 2) return;
    
    try {
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, MAX_RECENT_SEARCHES);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.log('Failed to save recent search:', error);
    }
  }, [recentSearches]);

  // Get popular search terms based on filtered festival data
  const popularSearches = useMemo(() => {
    // Filter festivals by selected month first
    const filteredFestivals = selectedMonth === "All" 
      ? festivals 
      : festivals.filter(festival => {
          if (!festival || !festival.dates) return false;
          const primaryMonth = getPrimaryMonth(festival.dates);
          return primaryMonth === selectedMonth;
        });

    const cityCount = new Map<string, number>();
    const countryCount = new Map<string, number>();
    const artistCount = new Map<string, number>();

    filteredFestivals.forEach(festival => {
      // Count cities
      cityCount.set(festival.city, (cityCount.get(festival.city) || 0) + 1);
      
      // Count countries
      countryCount.set(festival.country, (countryCount.get(festival.country) || 0) + 1);
      
      // Count artists
      if (festival.artists && Array.isArray(festival.artists)) {
        festival.artists.forEach(artist => {
          if (typeof artist === 'string') {
            artistCount.set(artist, (artistCount.get(artist) || 0) + 1);
          }
        });
      }
    });

    const popular: AutocompleteSuggestion[] = [];
    
    // Top 3 cities
    Array.from(cityCount.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .forEach(([city, count]) => {
        popular.push({
          type: 'popular',
          value: city,
          label: city,
          icon: <MapPin className="h-3.5 w-3.5 text-blue-500" />,
          detail: `${count} festival${count > 1 ? 's' : ''}`,
          festivalCount: count
        });
      });

    // Top 2 countries
    Array.from(countryCount.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .forEach(([country, count]) => {
        popular.push({
          type: 'popular',
          value: country,
          label: country,
          icon: <Globe className="h-3.5 w-3.5 text-green-500" />,
          detail: `${count} festival${count > 1 ? 's' : ''}`,
          festivalCount: count
        });
      });

    return popular;
  }, [festivals, selectedMonth]);

  // Generate smart autocomplete suggestions
  const suggestionCategories = useMemo((): SuggestionCategory[] => {
    if (!searchQuery.trim()) {
      const categories: SuggestionCategory[] = [];
      
      // Recent searches
      if (recentSearches.length > 0) {
        categories.push({
          title: t.recentSearches,
          icon: <Clock className="h-4 w-4 text-gray-500" />,
          suggestions: recentSearches.map(search => ({
            type: 'recent',
            value: search,
            label: search,
            icon: <Clock className="h-3.5 w-3.5 text-gray-400" />,
          }))
        });
      }

      // Popular searches
      if (popularSearches.length > 0) {
        categories.push({
          title: t.popularDestinations,
          icon: <TrendingUp className="h-4 w-4 text-orange-500" />,
          suggestions: popularSearches
        });
      }

      return categories;
    }

    const query = searchQuery.toLowerCase().trim();
    if (query.length < 2) return [];

    const suggestionSet = new Set<string>();
    const allSuggestions: AutocompleteSuggestion[] = [];

    // Filter festivals by selected month for more accurate counts
    const filteredFestivals = selectedMonth === "All" 
      ? festivals 
      : festivals.filter(festival => {
          if (!festival || !festival.dates) return false;
          const primaryMonth = getPrimaryMonth(festival.dates);
          return primaryMonth === selectedMonth;
        });

    festivals.forEach(festival => {
      // Festival names with enhanced matching
      if (festival.name.toLowerCase().includes(query)) {
        const key = `festival-${festival.name}`;
        if (!suggestionSet.has(key)) {
          const matchScore = getMatchScore(festival.name, query);
          allSuggestions.push({
            type: 'festival',
            value: festival.name,
            label: festival.name,
            icon: <Calendar className="h-3.5 w-3.5 text-red-500" />,
            detail: `${festival.city}, ${festival.country}`,
            matchScore
          });
          suggestionSet.add(key);
        }
      }

      // Cities with enhanced matching
      if (festival.city.toLowerCase().includes(query)) {
        const key = `city-${festival.city}`;
        if (!suggestionSet.has(key)) {
          const cityFestivals = filteredFestivals.filter(f => f.city === festival.city).length;
          const matchScore = getMatchScore(festival.city, query);
          allSuggestions.push({
            type: 'city',
            value: festival.city,
            label: festival.city,
            icon: <MapPin className="h-3.5 w-3.5 text-blue-500" />,
            detail: `${cityFestivals} festival${cityFestivals > 1 ? 's' : ''}`,
            matchScore,
            festivalCount: cityFestivals
          });
          suggestionSet.add(key);
        }
      }

      // Countries with enhanced matching
      if (festival.country.toLowerCase().includes(query)) {
        const key = `country-${festival.country}`;
        if (!suggestionSet.has(key)) {
          const countryFestivals = filteredFestivals.filter(f => f.country === festival.country).length;
          const matchScore = getMatchScore(festival.country, query);
          allSuggestions.push({
            type: 'country',
            value: festival.country,
            label: festival.country,
            icon: <Globe className="h-3.5 w-3.5 text-green-500" />,
            detail: `${countryFestivals} festival${countryFestivals > 1 ? 's' : ''}`,
            matchScore,
            festivalCount: countryFestivals
          });
          suggestionSet.add(key);
        }
      }

      // Continents
      if (festival.continent.toLowerCase().includes(query)) {
        const key = `continent-${festival.continent}`;
        if (!suggestionSet.has(key)) {
          const continentFestivals = filteredFestivals.filter(f => f.continent === festival.continent).length;
          const matchScore = getMatchScore(festival.continent, query);
          allSuggestions.push({
            type: 'continent',
            value: festival.continent,
            label: festival.continent,
            icon: <Globe className="h-3.5 w-3.5 text-purple-500" />,
            detail: `${continentFestivals} festival${continentFestivals > 1 ? 's' : ''}`,
            matchScore,
            festivalCount: continentFestivals
          });
          suggestionSet.add(key);
        }
      }

      // Artists with enhanced matching
      if (festival.artists && Array.isArray(festival.artists)) {
        festival.artists.forEach(artist => {
          if (typeof artist === 'string' && artist.toLowerCase().includes(query)) {
            const key = `artist-${artist}`;
            if (!suggestionSet.has(key)) {
              const artistFestivals = filteredFestivals.filter(f => 
                f.artists && Array.isArray(f.artists) && f.artists.includes(artist)
              ).length;
              const matchScore = getMatchScore(artist, query);
              allSuggestions.push({
                type: 'artist',
                value: artist,
                label: artist,
                icon: <Music className="h-3.5 w-3.5 text-purple-500" />,
                detail: `${artistFestivals} festival${artistFestivals > 1 ? 's' : ''}`,
                matchScore,
                festivalCount: artistFestivals
              });
              suggestionSet.add(key);
            }
          }
        });
      }
    });

    // Sort by relevance (match score, then by festival count)
    allSuggestions.sort((a, b) => {
      const scoreDiff = (b.matchScore || 0) - (a.matchScore || 0);
      if (scoreDiff !== 0) return scoreDiff;
      return (b.festivalCount || 0) - (a.festivalCount || 0);
    });

    // Group by type
    const categories: SuggestionCategory[] = [];
    const groupedSuggestions = groupBy(allSuggestions.slice(0, 10), 'type');

    if (groupedSuggestions.festival?.length) {
      categories.push({
        title: t.festivals,
        icon: <Calendar className="h-4 w-4 text-red-500" />,
        suggestions: groupedSuggestions.festival.slice(0, 3)
      });
    }

    if (groupedSuggestions.city?.length) {
      categories.push({
        title: t.cities,
        icon: <MapPin className="h-4 w-4 text-blue-500" />,
        suggestions: groupedSuggestions.city.slice(0, 3)
      });
    }

    if (groupedSuggestions.country?.length) {
      categories.push({
        title: t.countries,
        icon: <Globe className="h-4 w-4 text-green-500" />,
        suggestions: groupedSuggestions.country.slice(0, 2)
      });
    }

    if (groupedSuggestions.artist?.length) {
      categories.push({
        title: t.artists,
        icon: <Music className="h-4 w-4 text-purple-500" />,
        suggestions: groupedSuggestions.artist.slice(0, 3)
      });
    }

    return categories;
  }, [festivals, searchQuery, recentSearches, popularSearches, selectedMonth]);

  // Calculate match score for better ranking
  function getMatchScore(text: string, query: string): number {
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();
    
    // Exact match gets highest score
    if (textLower === queryLower) return 100;
    
    // Starts with query gets high score
    if (textLower.startsWith(queryLower)) return 90;
    
    // Contains query as whole word gets medium score
    if (textLower.includes(` ${queryLower}`) || textLower.includes(`${queryLower} `)) return 70;
    
    // Contains query gets lower score
    if (textLower.includes(queryLower)) return 50;
    
    return 0;
  }

  // Group array by property
  function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  // Flatten suggestions for keyboard navigation
  const flatSuggestions = useMemo(() => {
    return suggestionCategories.flatMap(category => category.suggestions);
  }, [suggestionCategories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    setIsOpen(true);
    setFocusedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: AutocompleteSuggestion) => {
    onSearchChange(suggestion.value);
    saveToRecentSearches(suggestion.value);
    setIsOpen(false);
    setFocusedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || flatSuggestions.length === 0) {
      if (e.key === 'Enter' && searchQuery.trim()) {
        saveToRecentSearches(searchQuery);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < flatSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : flatSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && flatSuggestions[focusedIndex]) {
          handleSuggestionClick(flatSuggestions[focusedIndex]);
        } else if (searchQuery.trim()) {
          saveToRecentSearches(searchQuery);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Delay closing to allow clicks on suggestions
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }, 150);
  };

  const handleClear = () => {
    onSearchChange('');
    setIsOpen(false);
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate current suggestion index for keyboard navigation
  const getCurrentSuggestionIndex = (categoryIndex: number, suggestionIndex: number): number => {
    let index = 0;
    for (let i = 0; i < categoryIndex; i++) {
      index += suggestionCategories[i].suggestions.length;
    }
    return index + suggestionIndex;
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
        <input
          ref={inputRef}
          type="text"
          placeholder={actualPlaceholder}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className={`w-full h-12 pl-10 ${searchQuery ? 'pr-12' : 'pr-4'} rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 text-base font-medium focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 focus:outline-none search-input-enhanced transition-all duration-200 sm:h-9 sm:pl-9 ${searchQuery ? 'sm:pr-10' : 'sm:pr-3'} sm:text-sm sm:rounded-lg sm:focus:border-gray-500 sm:focus:ring-1 sm:focus:ring-gray-500 sm:focus:ring-opacity-20`}
          aria-label="Search festivals with enhanced autocomplete suggestions"
          autoComplete="off"
          style={{ fontSize: '16px' }}
        />
        
        {/* Clear Button */}
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800 flex items-center justify-center transition-colors sm:h-5 sm:w-5 sm:right-2 z-10"
            aria-label="Clear search"
            type="button"
          >
            <X className="h-3 w-3 sm:h-2.5 sm:w-2.5" />
          </button>
        )}
      </div>

      {/* Enhanced Autocomplete Dropdown */}
      {isOpen && suggestionCategories.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto autocomplete-dropdown sm:mt-1 sm:rounded-lg sm:shadow-lg"
        >
          {suggestionCategories.map((category, categoryIndex) => (
            <div key={category.title} className="border-b border-gray-100 last:border-b-0">
              {/* Category Header */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100">
                {category.icon}
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  {category.title}
                </span>
                {category.title === t.recentSearches && recentSearches.length > 0 && (
                  <button
                    onClick={clearRecentSearches}
                    className="ml-auto text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {t.clearRecentSearches}
                  </button>
                )}
              </div>

              {/* Category Suggestions */}
              {category.suggestions.map((suggestion, suggestionIndex) => {
                const globalIndex = getCurrentSuggestionIndex(categoryIndex, suggestionIndex);
                const isActive = globalIndex === focusedIndex;
                
                return (
                  <button
                    key={`${suggestion.type}-${suggestion.value}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors autocomplete-suggestion ${
                      isActive ? 'bg-gray-50' : ''
                    }`}
                    tabIndex={-1}
                  >
                    <div className="flex items-center gap-3 min-h-[40px] sm:min-h-0">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center sm:w-auto sm:h-auto sm:bg-transparent">
                          {suggestion.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate text-sm">
                          {highlightMatch(suggestion.label, searchQuery)}
                        </div>
                        {suggestion.detail && (
                          <div className="text-xs text-gray-500 truncate mt-0.5">
                            {suggestion.detail}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {suggestion.type === 'popular' && (
                          <TrendingUp className="h-3 w-3 text-orange-400" />
                        )}
                        {suggestion.type === 'recent' && (
                          <Clock className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to highlight matching text
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) => 
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="bg-yellow-200 text-gray-900 px-0.5 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
}