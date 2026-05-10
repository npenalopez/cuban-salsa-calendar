export interface UserLocation {
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  continent: string;
  lastUpdated: number;
}

export interface TravelTime {
  driving?: {
    duration: string;
    distance: string;
  };
  train?: {
    duration: string;
    distance: string;
  };
  flying?: {
    duration: string;
    distance: string;
  };
}

class GeolocationService {
  private readonly LOCATION_COOKIE = 'user_location';
  private readonly COOKIE_EXPIRY_DAYS = 7;

  // Get user location from cookies or detect new location
  async getUserLocation(): Promise<UserLocation | null> {
    // First try to get from cookies
    const savedLocation = this.getLocationFromCookies();
    if (savedLocation && this.isLocationFresh(savedLocation)) {
      return savedLocation;
    }

    // If no valid saved location, try to detect
    try {
      const newLocation = await this.detectUserLocation();
      if (newLocation) {
        this.saveLocationToCookies(newLocation);
        return newLocation;
      }
    } catch (error) {
      console.log('Location detection failed, using fallback');
    }

    return savedLocation; // Return saved location even if stale, or null
  }

  // Detect user location using browser geolocation API
  private async detectUserLocation(): Promise<UserLocation | null> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Use reverse geocoding to get location details
            const locationData = await this.reverseGeocode(latitude, longitude);
            
            const userLocation: UserLocation = {
              country: locationData.country,
              city: locationData.city,
              latitude,
              longitude,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              continent: locationData.continent,
              lastUpdated: Date.now()
            };

            resolve(userLocation);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          // Check if we're on mobile to use appropriate fallback
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          
          // If high accuracy fails on mobile, try with lower accuracy
          if (isMobile && (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE)) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                try {
                  const { latitude, longitude } = position.coords;
                  
                  // Use reverse geocoding to get location details
                  const locationData = await this.reverseGeocode(latitude, longitude);
                  
                  const userLocation: UserLocation = {
                    country: locationData.country,
                    city: locationData.city,
                    latitude,
                    longitude,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    continent: locationData.continent,
                    lastUpdated: Date.now()
                  };

                  resolve(userLocation);
                } catch (error) {
                  reject(error);
                }
              },
              (fallbackError) => {
                reject(fallbackError);
              },
              {
                timeout: 30000, // Even longer timeout for low accuracy
                maximumAge: 1800000, // 30 minutes cache for low accuracy
                enableHighAccuracy: false // Prioritize speed over accuracy
              }
            );
          } else {
            reject(error);
          }
        },
        {
          timeout: 15000, // Increased timeout for mobile devices
          maximumAge: 900000, // 15 minutes cache
          enableHighAccuracy: true // Enable high accuracy for better mobile experience
        }
      );
    });
  }

  // Country to continent mapping
  private getCountryContinent(country: string): string {
    const countryToContinentMap: Record<string, string> = {
      // Europe
      'Switzerland': 'Europe',
      'Germany': 'Europe',
      'France': 'Europe',
      'UK': 'Europe',
      'Italy': 'Europe',
      'Spain': 'Europe',
      'Portugal': 'Europe',
      'Netherlands': 'Europe',
      'Belgium': 'Europe',
      'Austria': 'Europe',
      'Poland': 'Europe',
      'Czech Republic': 'Europe',
      'Hungary': 'Europe',
      'Slovakia': 'Europe',
      'Slovenia': 'Europe',
      'Croatia': 'Europe',
      'Serbia': 'Europe',
      'Bosnia and Herzegovina': 'Europe',
      'Montenegro': 'Europe',
      'North Macedonia': 'Europe',
      'Albania': 'Europe',
      'Greece': 'Europe',
      'Bulgaria': 'Europe',
      'Romania': 'Europe',
      'Moldova': 'Europe',
      'Ukraine': 'Europe',
      'Belarus': 'Europe',
      'Lithuania': 'Europe',
      'Latvia': 'Europe',
      'Estonia': 'Europe',
      'Finland': 'Europe',
      'Sweden': 'Europe',
      'Norway': 'Europe',
      'Denmark': 'Europe',
      'Iceland': 'Europe',
      'Ireland': 'Europe',
      'Russia': 'Europe',
      'Turkey': 'Europe',

      // North America
      'USA': 'North America',
      'Canada': 'North America',
      'Mexico': 'North America',
      'Guatemala': 'North America',
      'Belize': 'North America',
      'El Salvador': 'North America',
      'Honduras': 'North America',
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
      'Bahamas': 'Caribbean',

      // South America
      'Brazil': 'South America',
      'Argentina': 'South America',
      'Chile': 'South America',
      'Peru': 'South America',
      'Bolivia': 'South America',
      'Paraguay': 'South America',
      'Uruguay': 'South America',
      'Colombia': 'South America',
      'Venezuela': 'South America',
      'Guyana': 'South America',
      'Suriname': 'South America',
      'French Guiana': 'South America',
      'Ecuador': 'South America',

      // Africa
      'Tunisia': 'Africa',
      'Morocco': 'Africa',
      'Algeria': 'Africa',
      'Libya': 'Africa',
      'Egypt': 'Africa',
      'Sudan': 'Africa',
      'South Sudan': 'Africa',
      'Ethiopia': 'Africa',
      'Eritrea': 'Africa',
      'Somalia': 'Africa',
      'Djibouti': 'Africa',
      'Kenya': 'Africa',
      'Uganda': 'Africa',
      'Tanzania': 'Africa',
      'Rwanda': 'Africa',
      'Burundi': 'Africa',
      'South Africa': 'Africa',
      'Namibia': 'Africa',
      'Botswana': 'Africa',
      'Zimbabwe': 'Africa',
      'Zambia': 'Africa',
      'Malawi': 'Africa',
      'Mozambique': 'Africa',
      'Madagascar': 'Africa',
      'Mauritius': 'Africa',
      'Seychelles': 'Africa',
      'Ghana': 'Africa',
      'Nigeria': 'Africa',
      'Cameroon': 'Africa',
      'Chad': 'Africa',
      'Central African Republic': 'Africa',
      'Democratic Republic of the Congo': 'Africa',
      'Republic of the Congo': 'Africa',
      'Gabon': 'Africa',
      'Equatorial Guinea': 'Africa',
      'São Tomé and Príncipe': 'Africa',
      'Angola': 'Africa',
      'Ivory Coast': 'Africa',
      'Burkina Faso': 'Africa',
      'Mali': 'Africa',
      'Niger': 'Africa',
      'Senegal': 'Africa',
      'Gambia': 'Africa',
      'Guinea-Bissau': 'Africa',
      'Guinea': 'Africa',
      'Sierra Leone': 'Africa',
      'Liberia': 'Africa',
      'Togo': 'Africa',
      'Benin': 'Africa',

      // Asia-Pacific
      'Japan': 'Asia-Pacific',
      'China': 'Asia-Pacific',
      'South Korea': 'Asia-Pacific',
      'North Korea': 'Asia-Pacific',
      'Mongolia': 'Asia-Pacific',
      'India': 'Asia-Pacific',
      'Pakistan': 'Asia-Pacific',
      'Bangladesh': 'Asia-Pacific',
      'Sri Lanka': 'Asia-Pacific',
      'Nepal': 'Asia-Pacific',
      'Bhutan': 'Asia-Pacific',
      'Maldives': 'Asia-Pacific',
      'Thailand': 'Asia-Pacific',
      'Vietnam': 'Asia-Pacific',
      'Cambodia': 'Asia-Pacific',
      'Laos': 'Asia-Pacific',
      'Myanmar': 'Asia-Pacific',
      'Malaysia': 'Asia-Pacific',
      'Singapore': 'Asia-Pacific',
      'Indonesia': 'Asia-Pacific',
      'Philippines': 'Asia-Pacific',
      'Brunei': 'Asia-Pacific',
      'East Timor': 'Asia-Pacific',
      'Australia': 'Asia-Pacific',
      'New Zealand': 'Asia-Pacific',
      'Papua New Guinea': 'Asia-Pacific',
      'Fiji': 'Asia-Pacific',
      'Solomon Islands': 'Asia-Pacific',
      'Vanuatu': 'Asia-Pacific',
      'New Caledonia': 'Asia-Pacific',
      'French Polynesia': 'Asia-Pacific',
      'Samoa': 'Asia-Pacific',
      'Tonga': 'Asia-Pacific',
      'Kiribati': 'Asia-Pacific',
      'Tuvalu': 'Asia-Pacific',
      'Marshall Islands': 'Asia-Pacific',
      'Micronesia': 'Asia-Pacific',
      'Palau': 'Asia-Pacific',
      'Nauru': 'Asia-Pacific',
      'Kazakhstan': 'Asia-Pacific',
      'Uzbekistan': 'Asia-Pacific',
      'Turkmenistan': 'Asia-Pacific',
      'Kyrgyzstan': 'Asia-Pacific',
      'Tajikistan': 'Asia-Pacific',
      'Afghanistan': 'Asia-Pacific',
      'Iran': 'Asia-Pacific',
      'Iraq': 'Asia-Pacific',
      'Syria': 'Asia-Pacific',
      'Jordan': 'Asia-Pacific',
      'Lebanon': 'Asia-Pacific',
      'Israel': 'Asia-Pacific',
      'Palestine': 'Asia-Pacific',
      'Saudi Arabia': 'Asia-Pacific',
      'Yemen': 'Asia-Pacific',
      'Oman': 'Asia-Pacific',
      'UAE': 'Asia-Pacific',
      'Qatar': 'Asia-Pacific',
      'Bahrain': 'Asia-Pacific',
      'Kuwait': 'Asia-Pacific',
      'Armenia': 'Asia-Pacific',
      'Azerbaijan': 'Asia-Pacific',
      'Georgia': 'Asia-Pacific',
      'Cyprus': 'Europe'
    };

    return countryToContinentMap[country] || 'Europe'; // Default to Europe for unmapped countries
  }

  // Mock reverse geocoding (in a real app, you'd use a service like Google Maps API)
  private async reverseGeocode(lat: number, lng: number): Promise<{country: string, city: string, continent: string}> {
    // Mock implementation - in production, use a real geocoding service
    const mockLocations = [
      { lat: 46.9481, lng: 7.4474, country: 'Switzerland', city: 'Bern' },
      { lat: 52.5, lng: 13.4, country: 'Germany', city: 'Berlin' },
      { lat: 48.8, lng: 2.3, country: 'France', city: 'Paris' },
      { lat: 51.5, lng: -0.1, country: 'UK', city: 'London' },
      { lat: 40.7, lng: -74.0, country: 'USA', city: 'New York' },
      { lat: 41.9, lng: 12.5, country: 'Italy', city: 'Rome' },
      { lat: 55.7, lng: 37.6, country: 'Russia', city: 'Moscow' },
      { lat: 35.7, lng: 139.7, country: 'Japan', city: 'Tokyo' },
      { lat: -33.9, lng: 151.2, country: 'Australia', city: 'Sydney' },
      { lat: 43.7, lng: -79.4, country: 'Canada', city: 'Toronto' },
      { lat: 40.4, lng: -3.7, country: 'Spain', city: 'Madrid' },
      { lat: 47.3769, lng: 8.5417, country: 'Switzerland', city: 'Zurich' },
      { lat: 46.2044, lng: 6.1432, country: 'Switzerland', city: 'Geneva' },
      { lat: 23.1136, lng: -82.3666, country: 'Cuba', city: 'Havana' },
      { lat: 21.1619, lng: -86.8515, country: 'Mexico', city: 'Cancún' },
      { lat: 37.7749, lng: -122.4194, country: 'USA', city: 'San Francisco' },
      { lat: 47.6062, lng: -122.3321, country: 'USA', city: 'Seattle' },
      { lat: 36.4000, lng: 10.6167, country: 'Tunisia', city: 'Hammamet' },
      { lat: -19.1425, lng: 146.8428, country: 'Australia', city: 'Magnetic Island' }
    ];

    // Find closest mock location
    let closest = mockLocations[0];
    let minDistance = this.calculateDistance(lat, lng, closest.lat, closest.lng);

    for (const location of mockLocations) {
      const distance = this.calculateDistance(lat, lng, location.lat, location.lng);
      if (distance < minDistance) {
        minDistance = distance;
        closest = location;
      }
    }

    const continent = this.getCountryContinent(closest.country);
    return { country: closest.country, city: closest.city, continent };
  }

  // Calculate distance between two coordinates (Haversine formula)
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    // Validate inputs
    if (!isFinite(lat1) || !isFinite(lng1) || !isFinite(lat2) || !isFinite(lng2)) {
      throw new Error('Invalid coordinates: all values must be finite numbers');
    }
    
    // Handle edge case where coordinates are the same
    if (lat1 === lat2 && lng1 === lng2) {
      return 0;
    }
    
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    // Ensure we return a valid positive number
    if (!isFinite(distance) || distance < 0) {
      throw new Error('Invalid distance calculation result');
    }
    
    return distance;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Module-scope cache: same (userLocation, dest, continent) tuple
  // resolves to the same TravelTime object, so 150 cards calling this
  // on first paint do the work once, then read from the Map.
  private travelTimeCache = new Map<string, TravelTime>();

  // Calculate travel time and distance with realistic travel options
  calculateTravelTime(userLocation: UserLocation, destinationCoords: [number, number], destinationContinent?: string): TravelTime {
    // Validate inputs
    if (!userLocation || typeof userLocation.latitude !== 'number' || typeof userLocation.longitude !== 'number') {
      throw new Error('Invalid user location provided');
    }

    if (!Array.isArray(destinationCoords) || destinationCoords.length !== 2) {
      throw new Error('Invalid destination coordinates provided');
    }

    const [destLat, destLng] = destinationCoords;

    // Validate coordinate values
    if (typeof destLat !== 'number' || typeof destLng !== 'number') {
      throw new Error('Destination coordinates must be numbers');
    }

    // Validate coordinate ranges
    if (destLat < -90 || destLat > 90 || destLng < -180 || destLng > 180) {
      throw new Error('Destination coordinates are out of valid range');
    }

    if (userLocation.latitude < -90 || userLocation.latitude > 90 ||
        userLocation.longitude < -180 || userLocation.longitude > 180) {
      throw new Error('User location coordinates are out of valid range');
    }

    // Cache key includes everything that affects the result. Rounded
    // coords keep the cache from missing on tiny floating-point drift
    // when the same UserLocation is rebuilt.
    const cacheKey = `${userLocation.latitude.toFixed(4)},${userLocation.longitude.toFixed(4)}|${destLat.toFixed(4)},${destLng.toFixed(4)}|${userLocation.continent ?? ''}|${destinationContinent ?? ''}`;
    const cached = this.travelTimeCache.get(cacheKey);
    if (cached) return cached;

    const distance = this.calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      destLat,
      destLng
    );

    // Validate calculated distance
    if (!isFinite(distance) || distance < 0) {
      throw new Error('Invalid distance calculated');
    }

    const result: TravelTime = {};

    // Always show driving for distances up to 3000km (unless crossing oceans)
    const isCrossOcean = this.isCrossOceanTravel(userLocation.continent, destinationContinent);
    
    if (distance <= 3000 && !isCrossOcean) {
      const drivingHours = distance < 50 ? distance / 60 : distance / 80; // City vs highway speed
      const drivingTime = this.formatDuration(drivingHours);
      result.driving = {
        duration: drivingTime,
        distance: `${Math.round(distance)} km`
      };
    }

    // Show train for medium to long distances (50km - 2500km) if not crossing major oceans
    if (distance >= 50 && distance <= 2500 && !isCrossOcean) {
      const trainHours = (distance / 120) + 0.5; // Average 120 km/h + 30 min for transfers
      const trainTime = this.formatDuration(trainHours);
      result.train = {
        duration: trainTime,
        distance: `${Math.round(distance)} km`
      };
    }

    // Always show flying for distances over 200km
    if (distance >= 200) {
      // Calculate flying time based on distance
      let flyingHours: number;
      if (distance < 500) {
        flyingHours = 1.5 + (distance / 800); // Short flights + airport time
      } else if (distance < 2000) {
        flyingHours = 2 + (distance / 800); // Medium flights
      } else {
        flyingHours = 2.5 + (distance / 800); // Long flights + more airport time
      }
      
      const flyingTime = this.formatDuration(flyingHours);
      result.flying = {
        duration: flyingTime,
        distance: `${Math.round(distance)} km`
      };
    }

    // For very short distances (under 200km), still show local options
    if (distance < 200) {
      if (!result.driving) {
        const drivingHours = distance / 60;
        const drivingTime = this.formatDuration(drivingHours);
        result.driving = {
          duration: drivingTime,
          distance: `${Math.round(distance)} km`
        };
      }
      
      if (distance >= 50 && !result.train) {
        const trainHours = (distance / 100) + 0.3; // Slower regional trains
        const trainTime = this.formatDuration(trainHours);
        result.train = {
          duration: trainTime,
          distance: `${Math.round(distance)} km`
        };
      }
    }

    // Ensure we always have at least one travel option
    if (Object.keys(result).length === 0) {
      const flyingHours = (distance / 800) + 2.5;
      const flyingTime = this.formatDuration(flyingHours);
      result.flying = {
        duration: flyingTime,
        distance: `${Math.round(distance)} km`
      };
    }

    this.travelTimeCache.set(cacheKey, result);
    return result;
  }

  // Check if travel requires crossing major oceans (affects car/train viability)
  private isCrossOceanTravel(continent1: string, continent2?: string): boolean {
    if (!continent2 || continent1 === continent2) return false;
    
    // Define continent pairs that require ocean crossing (no land bridge)
    const oceanCrossingPairs = [
      ['Europe', 'North America'],
      ['Europe', 'South America'],
      ['Europe', 'Asia-Pacific'], // Includes Australia, Japan, etc.
      ['Europe', 'Caribbean'],
      ['Africa', 'North America'],
      ['Africa', 'South America'],
      ['Africa', 'Asia-Pacific'],
      ['Africa', 'Caribbean'],
      ['North America', 'Asia-Pacific'],
      ['North America', 'Europe'],
      ['North America', 'Africa'],
      ['South America', 'Asia-Pacific'],
      ['South America', 'Europe'],
      ['South America', 'Africa'],
      ['Caribbean', 'Europe'],
      ['Caribbean', 'Africa'],
      ['Caribbean', 'Asia-Pacific'],
    ];
    
    return oceanCrossingPairs.some(([c1, c2]) => 
      (continent1 === c1 && continent2 === c2) || 
      (continent1 === c2 && continent2 === c1)
    );
  }

  // Get formatted travel time for display
  getFormattedTravelTime(userLocation: UserLocation, destinationCoords: [number, number], destinationContinent?: string): string {
    try {
      const travelTime = this.calculateTravelTime(userLocation, destinationCoords, destinationContinent);
      
      // Validate the result
      if (!travelTime || typeof travelTime !== 'object') {
        throw new Error('Invalid travel time calculation result');
      }
      
      // Build travel options array in order of preference/speed
      const travelOptions: string[] = [];
      
      if (travelTime.flying && travelTime.flying.duration) {
        travelOptions.push(`${travelTime.flying.duration} flight`);
      }
      
      if (travelTime.driving && travelTime.driving.duration) {
        travelOptions.push(`${travelTime.driving.duration} drive`);
      }
      
      if (travelTime.train && travelTime.train.duration) {
        travelOptions.push(`${travelTime.train.duration} train`);
      }
      
      // Return the formatted string with available options
      if (travelOptions.length === 0) {
        throw new Error('No valid travel time options available');
      }
      
      return travelOptions.join(' • ');
      
    } catch (error) {
      console.warn('Error formatting travel time:', error);
      throw error; // Re-throw to be handled by caller
    }
  }

  private formatDuration(hours: number): string {
    // Validate input
    if (!isFinite(hours) || hours < 0) {
      throw new Error('Invalid hours value for duration formatting');
    }
    
    // Handle very small durations (less than 1 minute)
    if (hours < 1/60) {
      return '< 1 min';
    }
    
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${Math.max(1, minutes)} min`; // Ensure at least 1 minute
    } else if (hours < 24) {
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = Math.round(hours % 24);
      return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
    }
  }

  // Cookie management
  private getLocationFromCookies(): UserLocation | null {
    try {
      const cookies = document.cookie.split(';');
      const locationCookie = cookies.find(cookie => 
        cookie.trim().startsWith(`${this.LOCATION_COOKIE}=`)
      );
      
      if (!locationCookie) return null;
      
      const locationData = locationCookie.split('=')[1];
      const parsedLocation = JSON.parse(decodeURIComponent(locationData));
      
      // Handle backward compatibility - add continent if missing
      if (parsedLocation && !parsedLocation.continent) {
        parsedLocation.continent = this.getCountryContinent(parsedLocation.country);
      }
      
      return parsedLocation;
    } catch (error) {
      console.error('Error reading location cookie:', error);
      return null;
    }
  }

  private saveLocationToCookies(location: UserLocation): void {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + this.COOKIE_EXPIRY_DAYS);
      
      const cookieValue = encodeURIComponent(JSON.stringify(location));
      document.cookie = `${this.LOCATION_COOKIE}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    } catch (error) {
      console.error('Error saving location cookie:', error);
    }
  }

  private isLocationFresh(location: UserLocation): boolean {
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const isFresh = Date.now() - location.lastUpdated < maxAge;
    
    // Force refresh if continent is missing (backward compatibility)
    if (!location.continent) {
      return false;
    }
    
    return isFresh;
  }

  // Clear saved location
  clearSavedLocation(): void {
    document.cookie = `${this.LOCATION_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // Force location refresh (clears cache and detects again)
  async forceLocationRefresh(): Promise<UserLocation | null> {
    this.clearSavedLocation();
    return this.getUserLocation();
  }

  // Helper method for testing travel calculations (development only)
  testTravelCalculation(userLocation: UserLocation, destinationCoords: [number, number], destinationContinent?: string) {
    if (!import.meta.env.DEV) return;
    
    try {
      const result = this.calculateTravelTime(userLocation, destinationCoords, destinationContinent);
      console.log('Travel calculation result:', {
        userContinent: userLocation.continent,
        destinationContinent,
        options: Object.keys(result),
        details: result
      });
      return result;
    } catch (error) {
      console.error('Travel calculation error:', error);
      return null;
    }
  }
}

export const geolocationService = new GeolocationService();