import { useState, useEffect, useCallback } from 'react';
import { type Festival, continents, months } from '../data/festivals';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArtistsInput } from './ArtistsInput';
import { toast } from "sonner";
import { MapPin, Search, CheckCircle, AlertCircle, Loader2, Globe, Calculator, Wand2, ExternalLink } from 'lucide-react';

import { geocodingService, type GeocodeResult } from '../services/geocoding';
import { extractYearFromDateString, setYearInDateString } from '../utils/dateUtils';

interface SmartFestivalFormProps {
  festival: Festival;
  onSave: (festival: Festival) => void;
  onCancel: () => void;
  allFestivals?: Festival[];
}

export function SmartFestivalForm({ festival, onSave, onCancel, allFestivals = [] }: SmartFestivalFormProps) {
  const [formData, setFormData] = useState<Festival>({
    ...festival,
    artists: festival.artists || [],
    instagram: festival.instagram || '',
    coordinates: festival.coordinates || [0, 0],
  });
  const [selectedMonths, setSelectedMonths] = useState<string[]>(festival.months || []);
  
  // Geocoding state
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeResult, setGeocodeResult] = useState<GeocodeResult | null>(null);
  const [coordinatesManuallySet, setCoordinatesManuallySet] = useState(false);
  const [geocodingSuggestion, setGeocodingSuggestion] = useState<string>('');

  // Year handling
  const currentYear = extractYearFromDateString(formData.dates) || new Date().getFullYear();
  const [yearInput, setYearInput] = useState<string>(currentYear.toString());

  // Reset form when festival prop changes (important for editing different festivals)
  useEffect(() => {
    setFormData({
      ...festival,
      artists: festival.artists || [],
      instagram: festival.instagram || '',
      coordinates: festival.coordinates || [0, 0],
    });
    setSelectedMonths(festival.months || []);
    const year = extractYearFromDateString(festival.dates) || new Date().getFullYear();
    setYearInput(year.toString());
    setCoordinatesManuallySet(false);
    setGeocodeResult(null);
    setGeocodingSuggestion('');
  }, [festival.id]); // Reset when the festival ID changes

  // Auto-generate ID when name or city changes
  useEffect(() => {
    if (!festival.id && formData.name && formData.city) {
      const generatedId = (formData.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + 
                          formData.city.toLowerCase().replace(/[^a-z0-9]/g, '')).substring(0, 50);
      setFormData(prev => ({ ...prev, id: generatedId }));
    }
  }, [formData.name, formData.city, festival.id]);

  // Auto-geocode when city or country changes
  const performGeocoding = useCallback(async (city: string, country: string) => {
    if (!city.trim() || coordinatesManuallySet) return;

    setIsGeocoding(true);
    try {
      // Suggest corrections for common city name issues
      const correctedCity = geocodingService.suggestCityCorrection(city);
      if (correctedCity !== city) {
        setGeocodingSuggestion(correctedCity);
      }

      const result = await geocodingService.geocodeCity(correctedCity, country);
      
      if (result) {
        setGeocodeResult(result);
        setFormData(prev => ({
          ...prev,
          coordinates: [result.lat, result.lon],
          country: result.country || prev.country,
          continent: result.continent || prev.continent
        }));
        
        toast.success(`📍 Coordinates found: ${geocodingService.formatCoordinates(result.lat, result.lon)}`, {
          duration: 3000,
          position: "bottom-right"
        });
      } else {
        toast.error(`❌ Could not find coordinates for "${city}"${country ? `, ${country}` : ''}`, {
          duration: 4000,
          position: "bottom-right"
        });
        setGeocodeResult(null);
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
      toast.error('Geocoding service unavailable. Please set coordinates manually.', {
        duration: 4000,
        position: "bottom-right"
      });
    } finally {
      setIsGeocoding(false);
    }
  }, [coordinatesManuallySet]);

  // Debounced geocoding effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.city && formData.city.length > 2) {
        performGeocoding(formData.city, formData.country);
      }
    }, 1000); // Wait 1 second after user stops typing

    return () => clearTimeout(timeoutId);
  }, [formData.city, formData.country, performGeocoding]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Festival name is required");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("City is required");
      return;
    }
    if (!formData.country.trim()) {
      toast.error("Country is required");
      return;
    }
    if (selectedMonths.length === 0) {
      toast.error("Please select at least one month");
      return;
    }

    // Generate ID if empty (for new festivals)
    let finalFormData = { ...formData };
    if (!finalFormData.id) {
      const generatedId = (formData.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + 
                          formData.city.toLowerCase().replace(/[^a-z0-9]/g, '')).substring(0, 50);
      finalFormData.id = generatedId;
    }

    // Update dates with year if year was changed
    const updatedYear = parseInt(yearInput);
    let finalDates = finalFormData.dates;
    
    if (!isNaN(updatedYear) && updatedYear !== currentYear) {
      finalDates = setYearInDateString(finalFormData.dates, updatedYear);
    }
    
    // Validate coordinates
    const [lat, lon] = finalFormData.coordinates ?? [0, 0];
    if (!geocodingService.validateCoordinates(lat, lon)) {
      toast.error("Invalid coordinates. Please check latitude and longitude values.");
      return;
    }
    
    // Debug: Log the artists being saved
    console.log('Saving festival with artists:', finalFormData.artists);
    
    onSave({ ...finalFormData, dates: finalDates, months: selectedMonths });
  };

  const handleMonthToggle = (month: string) => {
    setSelectedMonths(prev => 
      prev.includes(month) 
        ? prev.filter(m => m !== month)
        : [...prev, month]
    );
  };

  const handleYearChange = (newYear: string) => {
    setYearInput(newYear);
    const year = parseInt(newYear);
    if (!isNaN(year) && year >= 2020 && year <= 2030) {
      const updatedDates = setYearInDateString(formData.dates, year);
      setFormData(prev => ({ ...prev, dates: updatedDates }));
    }
  };

  const handleCoordinateChange = (index: 0 | 1, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const newCoordinates: [number, number] = [...(formData.coordinates ?? [0, 0])] as [number, number];
      newCoordinates[index] = numValue;
      setFormData(prev => ({ ...prev, coordinates: newCoordinates }));
      setCoordinatesManuallySet(true);
    }
  };

  const resetCoordinates = () => {
    setFormData(prev => ({ ...prev, coordinates: [0, 0] }));
    setCoordinatesManuallySet(false);
    setGeocodeResult(null);
    if (formData.city) {
      performGeocoding(formData.city, formData.country);
    }
  };

  const applyCityCorrection = () => {
    if (geocodingSuggestion) {
      setFormData(prev => ({ ...prev, city: geocodingSuggestion }));
      setGeocodingSuggestion('');
    }
  };

  const openLocationInMaps = () => {
    const [lat, lon] = formData.coordinates ?? [0, 0];
    if (geocodingService.validateCoordinates(lat, lon)) {
      window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=12`, '_blank');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="festival-name">Festival Name *</Label>
              <Input
                id="festival-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Havana Salsa Festival"
                required
                className="modern-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="festival-id">Festival ID</Label>
              <Input
                id="festival-id"
                value={formData.id}
                onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                placeholder="Auto-generated from name and city"
                className="modern-input"
              />
              <p className="text-xs text-gray-500">Unique identifier for the festival</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="festival-instagram">Instagram URL</Label>
            <Input
              id="festival-instagram"
              value={formData.instagram || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
              placeholder="https://instagram.com/festivalname"
              type="url"
              className="modern-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="festival-description">Description</Label>
            <Textarea
              id="festival-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the festival..."
              className="modern-input min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="festival-price">Price Range</Label>
            <Input
              id="festival-price"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="e.g., €150 - €300, $50 - $200"
              className="modern-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Smart Location & Coordinates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Smart Location & Coordinates
            {isGeocoding && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* City suggestion */}
          {geocodingSuggestion && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    Did you mean "<strong>{geocodingSuggestion}</strong>"?
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={applyCityCorrection}
                  className="text-xs"
                >
                  Apply
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="festival-city" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                City *
              </Label>
              <Input
                id="festival-city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="e.g., Barcelona"
                required
                className="modern-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="festival-country">Country *</Label>
              <Input
                id="festival-country"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                placeholder="e.g., Spain"
                required
                className="modern-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="festival-continent">Continent</Label>
              <Select
                value={formData.continent}
                onValueChange={(value) => setFormData(prev => ({ ...prev, continent: value }))}
              >
                <SelectTrigger className="modern-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {continents.filter(c => c !== "All").map((continent) => (
                    <SelectItem key={continent} value={continent}>
                      {continent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Coordinates Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Coordinates
                {geocodeResult && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </Label>
              <div className="flex gap-2">
                {(formData.coordinates?.[0] ?? 0) !== 0 && (formData.coordinates?.[1] ?? 0) !== 0 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={openLocationInMaps}
                    className="text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View on Map
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={resetCoordinates}
                  className="text-xs"
                >
                  <Calculator className="h-3 w-3 mr-1" />
                  Re-geocode
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-sm">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.coordinates?.[0] ?? 0}
                  onChange={(e) => handleCoordinateChange(0, e.target.value)}
                  placeholder="e.g., 41.3851"
                  className="modern-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-sm">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.coordinates?.[1] ?? 0}
                  onChange={(e) => handleCoordinateChange(1, e.target.value)}
                  placeholder="e.g., 2.1734"
                  className="modern-input"
                />
              </div>
            </div>

            {geocodeResult && (
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-green-800 font-medium">Location found!</p>
                    <p className="text-green-700 text-xs mt-1">{geocodeResult.display_name}</p>
                    <p className="text-green-600 text-xs">
                      Coordinates: {geocodingService.formatCoordinates(geocodeResult.lat, geocodeResult.lon)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {coordinatesManuallySet && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">Coordinates set manually</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Date and Time Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Date and Time Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="festival-dates">Dates</Label>
              <Input
                id="festival-dates"
                value={formData.dates}
                onChange={(e) => setFormData(prev => ({ ...prev, dates: e.target.value }))}
                placeholder="e.g., Jan 15-17, Mar 22-24 2025"
                className="modern-input"
              />
              <p className="text-xs text-gray-500">Include year for precise date control</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="festival-year">Year</Label>
              <Input
                id="festival-year"
                type="number"
                min="2020"
                max="2030"
                value={yearInput}
                onChange={(e) => handleYearChange(e.target.value)}
                className="modern-input"
              />
              <p className="text-xs text-gray-500">Override the festival year</p>
            </div>
          </div>

          {/* Months Selection */}
          <div className="space-y-3">
            <Label className="font-medium">Active Months *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {months.filter(m => m !== "All").map((month) => (
                <div key={month} className="flex items-center space-x-2">
                  <Checkbox
                    id={`month-${month}`}
                    checked={selectedMonths.includes(month)}
                    onCheckedChange={() => handleMonthToggle(month)}
                  />
                  <Label
                    htmlFor={`month-${month}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {month.slice(0, 3)}
                  </Label>
                </div>
              ))}
            </div>
            {selectedMonths.length === 0 && (
              <p className="text-sm text-red-600">Please select at least one month</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Artists */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Artists</CardTitle>
        </CardHeader>
        <CardContent>
          <ArtistsInput
            artists={formData.artists ?? []}
            onChange={(artists) => setFormData(prev => ({ ...prev, artists }))}
            allFestivals={allFestivals}
          />
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="festival-card-button flex items-center gap-2"
          disabled={isGeocoding}
        >
          {isGeocoding && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Festival
        </Button>
      </div>
    </form>
  );
}