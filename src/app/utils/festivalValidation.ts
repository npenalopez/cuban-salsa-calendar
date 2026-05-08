import { type Festival } from '../data/festivals';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// Validate a single festival
export function validateFestival(festival: Festival): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Required fields
  if (!festival.id || festival.id.trim() === '') {
    errors.push({ field: 'id', message: 'Festival ID is required' });
  } else if (!/^[a-z0-9-]+$/.test(festival.id)) {
    errors.push({ field: 'id', message: 'Festival ID should only contain lowercase letters, numbers, and hyphens' });
  }

  if (!festival.name || festival.name.trim() === '') {
    errors.push({ field: 'name', message: 'Festival name is required' });
  }

  if (!festival.city || festival.city.trim() === '') {
    errors.push({ field: 'city', message: 'City is required' });
  }

  if (!festival.country || festival.country.trim() === '') {
    errors.push({ field: 'country', message: 'Country is required' });
  }

  if (!festival.continent || festival.continent.trim() === '') {
    errors.push({ field: 'continent', message: 'Continent is required' });
  }

  // Coordinates validation
  if (!Array.isArray(festival.coordinates) || festival.coordinates.length !== 2) {
    errors.push({ field: 'coordinates', message: 'Coordinates must be an array of [latitude, longitude]' });
  } else {
    const [lat, lng] = festival.coordinates;
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      errors.push({ field: 'coordinates', message: 'Coordinates must be numbers' });
    } else {
      if (lat < -90 || lat > 90) {
        errors.push({ field: 'coordinates', message: 'Latitude must be between -90 and 90' });
      }
      if (lng < -180 || lng > 180) {
        errors.push({ field: 'coordinates', message: 'Longitude must be between -180 and 180' });
      }
    }
  }

  // Months validation
  if (!Array.isArray(festival.months) || festival.months.length === 0) {
    errors.push({ field: 'months', message: 'At least one month must be selected' });
  } else {
    const validMonths = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const invalidMonths = festival.months.filter(month => !validMonths.includes(month));
    if (invalidMonths.length > 0) {
      errors.push({ field: 'months', message: `Invalid months: ${invalidMonths.join(', ')}` });
    }
  }

  // Website validation
  if (festival.website && festival.website.trim() !== '') {
    try {
      new URL(festival.website);
    } catch {
      errors.push({ field: 'website', message: 'Website must be a valid URL' });
    }
  }

  // Warnings for optional but recommended fields
  if (!festival.price || festival.price.trim() === '') {
    warnings.push({ field: 'price', message: 'Price information is recommended' });
  }

  if (!festival.yearsActive || festival.yearsActive.trim() === '') {
    warnings.push({ field: 'yearsActive', message: 'Years active information is recommended' });
  }

  if (!festival.dates || festival.dates.trim() === '') {
    warnings.push({ field: 'dates', message: 'Festival dates are recommended' });
  }

  if (!festival.description || festival.description.trim() === '') {
    warnings.push({ field: 'description', message: 'Festival description is recommended' });
  }

  if (!festival.website || festival.website.trim() === '') {
    warnings.push({ field: 'website', message: 'Website URL is recommended' });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Validate multiple festivals and check for duplicates
export function validateFestivals(festivals: Festival[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const ids = new Set<string>();
  const names = new Set<string>();

  festivals.forEach((festival, index) => {
    // Validate individual festival
    const result = validateFestival(festival);
    result.errors.forEach(error => {
      errors.push({
        field: `festival[${index}].${error.field}`,
        message: `${festival.name || 'Unnamed festival'}: ${error.message}`
      });
    });
    result.warnings.forEach(warning => {
      warnings.push({
        field: `festival[${index}].${warning.field}`,
        message: `${festival.name || 'Unnamed festival'}: ${warning.message}`
      });
    });

    // Check for duplicate IDs
    if (festival.id) {
      if (ids.has(festival.id)) {
        errors.push({
          field: `festival[${index}].id`,
          message: `Duplicate festival ID: ${festival.id}`
        });
      } else {
        ids.add(festival.id);
      }
    }

    // Check for duplicate names (warning only)
    if (festival.name) {
      if (names.has(festival.name.toLowerCase())) {
        warnings.push({
          field: `festival[${index}].name`,
          message: `Potential duplicate festival name: ${festival.name}`
        });
      } else {
        names.add(festival.name.toLowerCase());
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Generate a URL-friendly ID from a festival name
export function generateFestivalId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Suggest coordinates based on city and country
export function suggestCoordinates(city: string, country: string): [number, number] | null {
  // This is a basic implementation. In a real app, you'd use a geocoding service
  const cityCoordinates: Record<string, [number, number]> = {
    'havana,cuba': [23.1136, -82.3666],
    'london,uk': [51.5074, -0.1278],
    'paris,france': [48.8566, 2.3522],
    'berlin,germany': [52.5200, 13.4050],
    'barcelona,spain': [41.3851, 2.1734],
    'rome,italy': [41.9028, 12.4964],
    'amsterdam,netherlands': [52.3676, 4.9041],
    'vienna,austria': [48.2082, 16.3738],
    'prague,czech republic': [50.0755, 14.4378],
    'budapest,hungary': [47.4979, 19.0402],
    'warsaw,poland': [52.2297, 21.0122],
    'moscow,russia': [55.7558, 37.6176],
    'istanbul,turkey': [41.0082, 28.9784],
    'athens,greece': [37.9755, 23.7348],
    'lisbon,portugal': [38.7223, -9.1393],
    'stockholm,sweden': [59.3293, 18.0686],
    'oslo,norway': [59.9139, 10.7522],
    'copenhagen,denmark': [55.6761, 12.5683],
    'helsinki,finland': [60.1699, 24.9384],
    'zurich,switzerland': [47.3769, 8.5417]
  };

  const key = `${city.toLowerCase()},${country.toLowerCase()}`;
  return cityCoordinates[key] || null;
}

// Data quality score for a festival (0-100)
export function calculateDataQualityScore(festival: Festival): number {
  let score = 0;
  const maxScore = 100;

  // Required fields (60% of score)
  if (festival.id && festival.id.trim()) score += 10;
  if (festival.name && festival.name.trim()) score += 10;
  if (festival.city && festival.city.trim()) score += 10;
  if (festival.country && festival.country.trim()) score += 10;
  if (festival.continent && festival.continent.trim()) score += 10;
  if (Array.isArray(festival.coordinates) && festival.coordinates.length === 2) score += 10;

  // Optional but important fields (40% of score)
  if (festival.price && festival.price.trim()) score += 8;
  if (festival.yearsActive && festival.yearsActive.trim()) score += 8;
  if (festival.website && festival.website.trim()) score += 8;
  if (festival.dates && festival.dates.trim()) score += 8;
  if (festival.description && festival.description.trim()) score += 8;

  return Math.min(score, maxScore);
}