import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, MapPin, Calendar, User, X } from 'lucide-react';
import { Festival } from '../data/festivals';
import { useLanguage } from '../contexts/LanguageContext';

interface AutocompleteSuggestion {
  type: 'festival' | 'city' | 'country' | 'artist';
  value: string;
  label: string;
  icon: React.ReactNode;
  detail?: string;
}

interface EnhancedAutocompleteSearchProps {
  festivals: Festival[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function EnhancedAutocompleteSearch({
  festivals,
  searchQuery,
  onSearchChange,
  placeholder,
  className = ""
}: EnhancedAutocompleteSearchProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const actualPlaceholder = placeholder || t.searchPlaceholder;

  // Generate autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase().trim();
    const suggestionSet = new Set<string>();
    const results: AutocompleteSuggestion[] = [];

    festivals.forEach(festival => {
      // Festival names
      if (festival.name.toLowerCase().includes(query) && !suggestionSet.has(`festival-${festival.name}`)) {
        results.push({
          type: 'festival',
          value: festival.name,
          label: festival.name,
          icon: <Calendar className="h-3.5 w-3.5 text-gray-500" />,
          detail: `${festival.city}, ${festival.country}`
        });
        suggestionSet.add(`festival-${festival.name}`);
      }

      // Cities
      if (festival.city.toLowerCase().includes(query) && !suggestionSet.has(`city-${festival.city}`)) {
        const cityFestivals = festivals.filter(f => f.city === festival.city).length;
        results.push({
          type: 'city',
          value: festival.city,
          label: festival.city,
          icon: <MapPin className="h-3.5 w-3.5 text-gray-500" />,
          detail: `${cityFestivals} festival${cityFestivals > 1 ? 's' : ''}`
        });
        suggestionSet.add(`city-${festival.city}`);
      }

      // Countries
      if (festival.country.toLowerCase().includes(query) && !suggestionSet.has(`country-${festival.country}`)) {
        const countryFestivals = festivals.filter(f => f.country === festival.country).length;
        results.push({
          type: 'country',
          value: festival.country,
          label: festival.country,
          icon: <MapPin className="h-3.5 w-3.5 text-gray-500" />,
          detail: `${countryFestivals} festival${countryFestivals > 1 ? 's' : ''}`
        });
        suggestionSet.add(`country-${festival.country}`);
      }

      // Artists
      if (festival.artists && Array.isArray(festival.artists)) {
        festival.artists.forEach(artist => {
          if (typeof artist === 'string' && 
              artist.toLowerCase().includes(query) && 
              !suggestionSet.has(`artist-${artist}`)) {
            const artistFestivals = festivals.filter(f => 
              f.artists && Array.isArray(f.artists) && f.artists.includes(artist)
            ).length;
            results.push({
              type: 'artist',
              value: artist,
              label: artist,
              icon: <User className="h-3.5 w-3.5 text-gray-500" />,
              detail: `${artistFestivals} festival${artistFestivals > 1 ? 's' : ''}`
            });
            suggestionSet.add(`artist-${artist}`);
          }
        });
      }
    });

    // Sort by relevance (exact matches first, then by length)
    return results
      .sort((a, b) => {
        const aExact = a.label.toLowerCase().startsWith(query) ? 0 : 1;
        const bExact = b.label.toLowerCase().startsWith(query) ? 0 : 1;
        if (aExact !== bExact) return aExact - bExact;
        return a.label.length - b.label.length;
      })
      .slice(0, 8); // Limit to 8 suggestions
  }, [festivals, searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    setIsOpen(value.length >= 2);
    setFocusedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: AutocompleteSuggestion) => {
    onSearchChange(suggestion.value);
    setIsOpen(false);
    setFocusedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && suggestions[focusedIndex]) {
          handleSuggestionClick(suggestions[focusedIndex]);
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
    if (searchQuery.length >= 2) {
      setIsOpen(true);
    }
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

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className={`w-full h-12 pl-10 ${searchQuery ? 'pr-12' : 'pr-4'} rounded border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 text-base font-medium focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 focus:outline-none search-input-enhanced transition-all duration-200 sm:h-9 sm:pl-9 ${searchQuery ? 'sm:pr-10' : 'sm:pr-3'} sm:text-sm sm:rounded sm:focus:border-gray-500 sm:focus:ring-1 sm:focus:ring-gray-500 sm:focus:ring-opacity-20`}
          aria-label="Search festivals with autocomplete suggestions"
          autoComplete="off"
          style={{ fontSize: '16px' }}
        />
        
        {/* Clear Button */}
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800 flex items-center justify-center transition-colors sm:h-5 sm:w-5 sm:right-2"
            aria-label="Clear search"
            type="button"
          >
            <X className="h-3 w-3 sm:h-2.5 sm:w-2.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded shadow-xl z-50 max-h-80 overflow-y-auto autocomplete-dropdown sm:mt-1 sm:rounded sm:shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.value}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-4 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 autocomplete-suggestion transition-colors sm:py-3 ${
                index === focusedIndex ? 'bg-gray-50' : ''
              }`}
              tabIndex={-1}
            >
              <div className="flex items-center gap-3 min-h-[44px] sm:min-h-0">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center sm:w-auto sm:h-auto sm:bg-transparent">
                    {suggestion.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate text-base sm:text-sm sm:font-medium">
                    {suggestion.label}
                  </div>
                  {suggestion.detail && (
                    <div className="text-sm text-gray-500 truncate mt-1 sm:mt-0">
                      {suggestion.detail}
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-1 rounded sm:bg-transparent sm:px-0 sm:py-0">
                    {suggestion.type}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}