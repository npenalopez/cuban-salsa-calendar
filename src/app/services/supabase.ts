/**
 * Festival storage — localStorage only.
 *
 * The festival list lives in code at src/app/data/festivals.ts and ships
 * with the build. This module:
 *
 *  - Hydrates a localStorage cache from the in-code seed on first load
 *    (or when SEED_VERSION changes), so updating the seed in code and
 *    pushing replaces the data on every returning user's next visit.
 *  - Persists in-session admin edits (add / update / delete / import)
 *    to that same cache, so they survive a reload — until the seed
 *    version is bumped, which forces a refresh.
 *
 * The exported name is preserved as `supabaseFestivalService` to keep
 * the admin/export screens working without a refactor.
 */

import { type Festival } from '../data/festivals';

const STORAGE_KEY = 'cuban-salsa-festivals';
const SEED_VERSION_KEY = 'cuban-salsa-festivals-seed-version';
// Bump this string whenever `initialFestivals` in src/app/data/festivals.ts
// changes — local caches with a different version are replaced on load.
const SEED_VERSION = '2026-05-09-v7-150-festivals';

class FestivalStorage {
  // ───── Lifecycle (no-ops kept for API compatibility) ─────
  async initializeDatabase(): Promise<void> {
    return Promise.resolve();
  }

  isUsingRealSupabase(): boolean {
    return false;
  }

  enableRealSupabase(): void {
    // no-op
  }

  async checkConnection(): Promise<boolean> {
    return true;
  }

  // ───── Cache helpers ─────
  private read(): Festival[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((f: Festival) => ({ ...f, artists: f.artists || [] }));
    } catch (error) {
      console.error('Failed to load festivals from localStorage:', error);
      return [];
    }
  }

  private write(festivals: Festival[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(festivals));
    } catch (error) {
      console.error('Failed to write festivals to localStorage:', error);
    }
  }

  // ───── Reads ─────
  async getAllFestivals(): Promise<Festival[]> {
    return this.read();
  }

  // ───── Seeding ─────
  async seedDatabase(initialFestivals: Festival[]): Promise<void> {
    const storedVersion = localStorage.getItem(SEED_VERSION_KEY);
    const cached = this.read();
    if (storedVersion !== SEED_VERSION || cached.length === 0) {
      this.write(initialFestivals);
      try {
        localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
      } catch (error) {
        console.error('Failed to write seed version:', error);
      }
    }
  }

  // ───── Writes ─────
  async addFestival(festival: Festival): Promise<Festival> {
    const cached = this.read();
    cached.push(festival);
    this.write(cached);
    return festival;
  }

  async updateFestival(festival: Festival): Promise<Festival> {
    const cached = this.read();
    const idx = cached.findIndex((f) => f.id === festival.id);
    if (idx >= 0) cached[idx] = festival;
    else cached.push(festival);
    this.write(cached);
    return festival;
  }

  async deleteFestival(festivalId: string): Promise<void> {
    this.write(this.read().filter((f) => f.id !== festivalId));
  }

  async replaceFestivals(festivals: Festival[]): Promise<Festival[]> {
    this.write(festivals);
    return festivals;
  }

  // ───── Stats / I/O ─────
  async getStats(): Promise<{ totalFestivals: number; lastUpdated: string | null }> {
    return {
      totalFestivals: this.read().length,
      lastUpdated: new Date().toISOString(),
    };
  }

  exportFestivals(festivals: Festival[]): string {
    return JSON.stringify(
      {
        festivals,
        exportedAt: new Date().toISOString(),
        version: '3.0.0',
        source: 'local',
      },
      null,
      2,
    );
  }

  /**
   * JSON array string ready to paste between the brackets of
   * `export const festivals: Festival[] = [ … ];` in festivals.ts.
   * No envelope, no wrapper — just the array literal.
   */
  exportFestivalsAsArray(festivals: Festival[]): string {
    return JSON.stringify(festivals, null, 2);
  }

  /**
   * Full replacement contents for src/app/data/festivals.ts. Save the
   * returned string over the existing file and you're done.
   */
  exportFestivalsAsCodeFile(festivals: Festival[]): string {
    const arrayLiteral = JSON.stringify(festivals, null, 2);
    return `export interface Festival {
  id: string;
  name: string;
  city: string;
  country: string;
  continent: string;
  dates: string;
  price: string;
  months?: string[];
  website?: string;
  instagram?: string;
  description?: string;
  artists?: string[];
  coordinates?: [number, number];
  venue?: string;
  category?: string;
  yearsActive?: string;
}

export const continents = [
  "North America",
  "South America",
  "Europe",
  "Africa",
  "Asia",
  "Oceania",
];

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const festivals: Festival[] = ${arrayLiteral};

export default festivals;
`;
  }

  importFestivals(jsonString: string): Festival[] {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.festivals && Array.isArray(parsed.festivals)) return parsed.festivals;
    throw new Error('Invalid JSON format or festival data structure');
  }
}

export const supabaseFestivalService = new FestivalStorage();
