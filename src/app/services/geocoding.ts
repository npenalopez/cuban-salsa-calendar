/**
 * Geocoding service for converting city names to coordinates
 * Uses OpenStreetMap Nominatim API as a free geocoding service
 */

export interface GeocodeResult {
  lat: number;
  lon: number;
  display_name: string;
  country: string;
  continent?: string;
}

export interface ContinentMapping {
  [key: string]: string;
}

// Country to continent mapping for auto-detection
const countryToContinentMap: ContinentMapping = {
  // Europe
  'Germany': 'Europe',
  'France': 'Europe',
  'Spain': 'Europe',
  'Italy': 'Europe',
  'United Kingdom': 'Europe',
  'UK': 'Europe',
  'Netherlands': 'Europe',
  'Belgium': 'Europe',
  'Austria': 'Europe',
  'Switzerland': 'Europe',
  'Poland': 'Europe',
  'Czech Republic': 'Europe',
  'Czechia': 'Europe',
  'Hungary': 'Europe',
  'Croatia': 'Europe',
  'Slovenia': 'Europe',
  'Slovakia': 'Europe',
  'Portugal': 'Europe',
  'Greece': 'Europe',
  'Bulgaria': 'Europe',
  'Romania': 'Europe',
  'Serbia': 'Europe',
  'Bosnia and Herzegovina': 'Europe',
  'Montenegro': 'Europe',
  'Albania': 'Europe',
  'North Macedonia': 'Europe',
  'Estonia': 'Europe',
  'Latvia': 'Europe',
  'Lithuania': 'Europe',
  'Finland': 'Europe',
  'Sweden': 'Europe',
  'Norway': 'Europe',
  'Denmark': 'Europe',
  'Iceland': 'Europe',
  'Ireland': 'Europe',
  'Luxembourg': 'Europe',
  'Monaco': 'Europe',
  'Liechtenstein': 'Europe',
  'San Marino': 'Europe',
  'Vatican City': 'Europe',
  'Malta': 'Europe',
  'Cyprus': 'Europe',
  'Turkey': 'Europe',
  'Russia': 'Europe',
  'Ukraine': 'Europe',
  'Belarus': 'Europe',
  'Moldova': 'Europe',
  
  // North America
  'United States': 'North America',
  'USA': 'North America',
  'US': 'North America',
  'Canada': 'North America',
  'Mexico': 'North America',
  'Guatemala': 'North America',
  'Belize': 'North America',
  'Honduras': 'North America',
  'El Salvador': 'North America',
  'Nicaragua': 'North America',
  'Costa Rica': 'North America',
  'Panama': 'North America',
  
  // Caribbean
  'Cuba': 'Caribbean',
  'Jamaica': 'Caribbean',
  'Haiti': 'Caribbean',
  'Dominican Republic': 'Caribbean',
  'Puerto Rico': 'Caribbean',
  'Trinidad and Tobago': 'Caribbean',
  'Barbados': 'Caribbean',
  'Saint Lucia': 'Caribbean',
  'Grenada': 'Caribbean',
  'Saint Vincent and the Grenadines': 'Caribbean',
  'Antigua and Barbuda': 'Caribbean',
  'Dominica': 'Caribbean',
  'Saint Kitts and Nevis': 'Caribbean',
  'Bahamas': 'Caribbean',
  
  // South America
  'Brazil': 'South America',
  'Argentina': 'South America',
  'Chile': 'South America',
  'Colombia': 'South America',
  'Peru': 'South America',
  'Venezuela': 'South America',
  'Ecuador': 'South America',
  'Bolivia': 'South America',
  'Paraguay': 'South America',
  'Uruguay': 'South America',
  'Guyana': 'South America',
  'Suriname': 'South America',
  'French Guiana': 'South America',
  
  // Africa
  'South Africa': 'Africa',
  'Egypt': 'Africa',
  'Morocco': 'Africa',
  'Tunisia': 'Africa',
  'Algeria': 'Africa',
  'Libya': 'Africa',
  'Kenya': 'Africa',
  'Nigeria': 'Africa',
  'Ghana': 'Africa',
  'Senegal': 'Africa',
  'Ivory Coast': 'Africa',
  'Mali': 'Africa',
  'Burkina Faso': 'Africa',
  'Niger': 'Africa',
  'Chad': 'Africa',
  'Sudan': 'Africa',
  'Ethiopia': 'Africa',
  'Tanzania': 'Africa',
  'Uganda': 'Africa',
  'Rwanda': 'Africa',
  'Burundi': 'Africa',
  'Madagascar': 'Africa',
  'Mauritius': 'Africa',
  'Seychelles': 'Africa',
  
  // Asia-Pacific
  'China': 'Asia-Pacific',
  'Japan': 'Asia-Pacific',
  'South Korea': 'Asia-Pacific',
  'India': 'Asia-Pacific',
  'Thailand': 'Asia-Pacific',
  'Vietnam': 'Asia-Pacific',
  'Singapore': 'Asia-Pacific',
  'Malaysia': 'Asia-Pacific',
  'Indonesia': 'Asia-Pacific',
  'Philippines': 'Asia-Pacific',
  'Australia': 'Asia-Pacific',
  'New Zealand': 'Asia-Pacific',
  'Fiji': 'Asia-Pacific',
  'Papua New Guinea': 'Asia-Pacific',
  'Taiwan': 'Asia-Pacific',
  'Hong Kong': 'Asia-Pacific',
  'Macau': 'Asia-Pacific',
  'Mongolia': 'Asia-Pacific',
  'Kazakhstan': 'Asia-Pacific',
  'Uzbekistan': 'Asia-Pacific',
  'Kyrgyzstan': 'Asia-Pacific',
  'Tajikistan': 'Asia-Pacific',
  'Turkmenistan': 'Asia-Pacific',
  'Afghanistan': 'Asia-Pacific',
  'Pakistan': 'Asia-Pacific',
  'Bangladesh': 'Asia-Pacific',
  'Sri Lanka': 'Asia-Pacific',
  'Myanmar': 'Asia-Pacific',
  'Cambodia': 'Asia-Pacific',
  'Laos': 'Asia-Pacific',
  'Brunei': 'Asia-Pacific',
  'Nepal': 'Asia-Pacific',
  'Bhutan': 'Asia-Pacific',
  'Maldives': 'Asia-Pacific'
};

class GeocodingService {
  private baseUrl = 'https://nominatim.openstreetmap.org/search';
  private rateLimitDelay = 1000; // 1 second between requests to respect rate limits
  private lastRequestTime = 0;

  /**
   * Geocode a city name to get coordinates and country information
   */
  async geocodeCity(city: string, country?: string): Promise<GeocodeResult | null> {
    try {
      // Respect rate limiting
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < this.rateLimitDelay) {
        await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest));
      }

      // Build search query
      let query = city.trim();
      if (country && country.trim()) {
        query += `, ${country.trim()}`;
      }

      const params = new URLSearchParams({
        q: query,
        format: 'json',
        limit: '1',
        addressdetails: '1',
        extratags: '1'
      });

      const response = await fetch(`${this.baseUrl}?${params}`, {
        headers: {
          'User-Agent': 'Cuban Salsa Calendar (https://example.com/contact)'
        }
      });

      this.lastRequestTime = Date.now();

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        return null;
      }

      const result = data[0];
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);

      if (isNaN(lat) || isNaN(lon)) {
        return null;
      }

      // Extract country from the address
      const address = result.address || {};
      const detectedCountry = address.country || result.display_name.split(',').pop()?.trim() || '';

      // Determine continent
      const continent = this.getContinent(detectedCountry);

      return {
        lat,
        lon,
        display_name: result.display_name,
        country: detectedCountry,
        continent
      };

    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  /**
   * Get continent based on country name
   */
  getContinent(country: string): string {
    const cleanCountry = country.trim();
    
    // Try exact match first
    if (countryToContinentMap[cleanCountry]) {
      return countryToContinentMap[cleanCountry];
    }

    // Try case-insensitive match
    const lowerCountry = cleanCountry.toLowerCase();
    for (const [key, value] of Object.entries(countryToContinentMap)) {
      if (key.toLowerCase() === lowerCountry) {
        return value;
      }
    }

    // Try partial match for common variations
    for (const [key, value] of Object.entries(countryToContinentMap)) {
      if (lowerCountry.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerCountry)) {
        return value;
      }
    }

    // Default to Europe for unknown countries (most festivals are in Europe)
    return 'Europe';
  }

  /**
   * Validate coordinates
   */
  validateCoordinates(lat: number, lon: number): boolean {
    return !isNaN(lat) && !isNaN(lon) && 
           lat >= -90 && lat <= 90 && 
           lon >= -180 && lon <= 180;
  }

  /**
   * Format coordinates for display
   */
  formatCoordinates(lat: number, lon: number, precision: number = 4): string {
    return `${lat.toFixed(precision)}, ${lon.toFixed(precision)}`;
  }

  /**
   * Suggest city corrections based on common misspellings
   */
  suggestCityCorrection(city: string): string {
    const corrections: { [key: string]: string } = {
      'barcelona': 'Barcelona',
      'madrid': 'Madrid',
      'sevilla': 'Seville',
      'valencia': 'Valencia',
      'bilbao': 'Bilbao',
      'paris': 'Paris',
      'marseille': 'Marseille',
      'lyon': 'Lyon',
      'toulouse': 'Toulouse',
      'nice': 'Nice',
      'berlin': 'Berlin',
      'munich': 'Munich',
      'hamburg': 'Hamburg',
      'cologne': 'Cologne',
      'frankfurt': 'Frankfurt',
      'london': 'London',
      'manchester': 'Manchester',
      'liverpool': 'Liverpool',
      'birmingham': 'Birmingham',
      'edinburgh': 'Edinburgh',
      'rome': 'Rome',
      'milan': 'Milan',
      'naples': 'Naples',
      'turin': 'Turin',
      'venice': 'Venice',
      'havana': 'Havana',
      'havanna': 'Havana',
      'la habana': 'Havana',
      'new york': 'New York',
      'los angeles': 'Los Angeles',
      'san francisco': 'San Francisco',
      'chicago': 'Chicago',
      'miami': 'Miami'
    };

    const lowerCity = city.toLowerCase().trim();
    return corrections[lowerCity] || city;
  }

  /**
   * Get popular festival cities for suggestions
   */
  getPopularFestivalCities(): string[] {
    return [
      'Barcelona', 'Madrid', 'Seville', 'Valencia', // Spain
      'Paris', 'Marseille', 'Lyon', 'Nice', // France
      'Berlin', 'Munich', 'Hamburg', 'Cologne', // Germany
      'London', 'Manchester', 'Birmingham', // UK
      'Rome', 'Milan', 'Naples', 'Turin', // Italy
      'Amsterdam', 'Rotterdam', // Netherlands
      'Vienna', 'Salzburg', // Austria
      'Prague', 'Brno', // Czech Republic
      'Warsaw', 'Krakow', // Poland
      'Budapest', // Hungary
      'Zagreb', // Croatia
      'Ljubljana', // Slovenia
      'Havana', 'Santiago de Cuba', // Cuba
      'New York', 'Los Angeles', 'Miami', 'San Francisco', // USA
      'Montreal', 'Toronto', 'Vancouver', // Canada
      'Mexico City', 'Cancun', 'Playa del Carmen' // Mexico
    ];
  }
}

export const geocodingService = new GeocodingService();