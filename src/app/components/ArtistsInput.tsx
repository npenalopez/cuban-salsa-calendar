import { useState, useEffect, useMemo, useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Plus, X } from 'lucide-react';
import { type Festival } from '../data/festivals';

interface ArtistsInputProps {
  artists: string[];
  onChange: (artists: string[]) => void;
  allFestivals?: Festival[];
}

export function ArtistsInput({ artists, onChange, allFestivals = [] }: ArtistsInputProps) {
  const [newArtist, setNewArtist] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get all unique artists from all festivals
  const allArtists = useMemo(() => {
    const artistSet = new Set<string>();
    allFestivals.forEach(festival => {
      if (festival.artists) {
        festival.artists.forEach(artist => {
          const trimmed = artist.trim();
          // Skip placeholder values
          if (trimmed && 
              trimmed !== '-' && 
              trimmed !== '--' && 
              !trimmed.toLowerCase().includes('tba') &&
              !trimmed.toLowerCase().includes('to be announced') &&
              !trimmed.toLowerCase().includes('coming soon')) {
            artistSet.add(trimmed);
          }
        });
      }
    });
    return Array.from(artistSet).sort((a, b) => a.localeCompare(b));
  }, [allFestivals]);

  // Filter suggestions based on input
  const suggestions = useMemo(() => {
    if (!newArtist.trim()) return [];
    
    const searchTerm = newArtist.toLowerCase().trim();
    return allArtists
      .filter(artist => 
        artist.toLowerCase().includes(searchTerm) &&
        !artists.includes(artist) // Don't suggest already added artists
      )
      .slice(0, 10); // Limit to 10 suggestions
  }, [newArtist, allArtists, artists]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedSuggestionIndex(0);
  }, [suggestions]);

  const addArtist = (artistName?: string) => {
    const nameToAdd = artistName || newArtist.trim();
    if (nameToAdd && !artists.includes(nameToAdd)) {
      const updatedArtists = [...artists, nameToAdd];
      console.log('Adding artist:', nameToAdd, 'Updated artists array:', updatedArtists);
      onChange(updatedArtists);
      setNewArtist("");
      setShowSuggestions(false);
      setSelectedSuggestionIndex(0);
    }
  };

  const removeArtist = (artistToRemove: string) => {
    onChange(artists.filter(artist => artist !== artistToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        addArtist();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestions[selectedSuggestionIndex]) {
          addArtist(suggestions[selectedSuggestionIndex]);
        } else {
          addArtist();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(0);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewArtist(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (artist: string) => {
    addArtist(artist);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-3">
      <Label>Artists</Label>
      
      {/* Add new artist input */}
      <div className="relative">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={newArtist}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => newArtist.trim() && setShowSuggestions(true)}
            placeholder="e.g., Los Van Van, Maykel Fonts..."
            className="flex-1"
            autoComplete="off"
          />
          <Button
            type="button"
            onClick={() => addArtist()}
            size="sm"
            disabled={!newArtist.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Autocomplete Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
              {suggestions.length} existing artist{suggestions.length !== 1 ? 's' : ''} found
            </div>
            <div className="py-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    index === selectedSuggestionIndex
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Artists list */}
      {artists.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {artists.map((artist, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 pr-2"
            >
              <span>{artist}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeArtist(artist)}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        {allFestivals.length > 0 
          ? "Start typing to see suggestions from existing artists. Press Enter or click + to add."
          : "Add artists performing at this festival. Press Enter or click + to add."
        }
      </p>
    </div>
  );
}