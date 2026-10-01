export type Status = 'scheduled' | 'postponed' | 'cancelled' | 'sold-out';
export type Precision = 'day' | 'month' | 'year';
export type Region = 'Europe' | 'North America' | 'South America' | 'Africa' | 'Asia' | 'Oceania';

/** One record of data/festivals.json (see festivals.schema.json). */
export interface Festival {
  id: string;
  series: string | null;
  name: string;
  status: Status;
  startDate: string;
  endDate: string;
  datePrecision: Precision;
  dateNote: string | null;
  city: string | null;
  country: string | null;
  countryCode: string | null;
  region: Region;
  venue: string | null;
  coordinates: [number, number] | null;
  priceText: string | null;
  priceFrom: number | null;
  currency: string | null;
  ticketUrl: string | null;
  website: string | null;
  artists: string[];
  featured: boolean;
  // Only present server-side (stripped from the client bundle).
  instagram?: string | null;
  description?: string | null;
  lastVerified?: string | null;
  /** Private. Never render. */
  notes?: string | null;
}

export interface FestivalsFile {
  version: string;
  updated?: string;
  festivals: Festival[];
}

/** A festival with derived dates and flags relative to "today". */
export interface Enriched extends Festival {
  s: Date;
  e: Date;
  /** endDate < today */
  past: boolean;
  /** "YYYY-MM" month key; null for year precision */
  mk: string | null;
  /** In the archive: past or cancelled */
  arch: boolean;
  /** datePrecision "year": listed under Dates TBA */
  tba: boolean;
  /** Normalised search haystack */
  hay: string;
}

export interface City {
  name: string;
  lat: number;
  lng: number;
}
