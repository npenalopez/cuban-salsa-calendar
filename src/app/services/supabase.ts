import { type Festival } from '../data/festivals';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────
// Supabase is opt-in via Vite env vars:
//   VITE_SUPABASE_URL=...
//   VITE_SUPABASE_ANON_KEY=...
// When unset, the app runs in localStorage-only mode using the seeded
// `festivals` array from src/app/data/festivals.ts as the source of truth.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const supabase: SupabaseClient | null = SUPABASE_CONFIGURED
  ? createClient(SUPABASE_URL!, SUPABASE_KEY!)
  : null;

// localStorage persistence keys
const STORAGE_KEY = 'cuban-salsa-festivals';
const SEED_VERSION_KEY = 'cuban-salsa-festivals-seed-version';
// Bump this string whenever `initialFestivals` in src/app/data/festivals.ts
// changes — local caches with a different version will be replaced on load.
const SEED_VERSION = '2026-05-09-v2-twenty-festivals';

export interface DatabaseFestival {
  id: string;
  name: string;
  city: string;
  country: string;
  continent: string;
  coordinates: number[];
  price: string;
  months: string[];
  description: string;
  dates: string;
  artists: string[];
  created_at?: string;
  updated_at?: string;
}

// ─────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────
class SupabaseFestivalService {
  // Only true when both env vars are present AND enableRealSupabase() was called.
  private useRealSupabase = false;

  isUsingRealSupabase(): boolean {
    return this.useRealSupabase;
  }

  enableRealSupabase(): void {
    if (!SUPABASE_CONFIGURED) {
      // No env vars — silently stay in local mode.
      this.useRealSupabase = false;
      return;
    }
    this.useRealSupabase = true;
  }

  async initializeDatabase(): Promise<void> {
    // Schema is managed in the Supabase dashboard, not from the client.
    return Promise.resolve();
  }

  async checkConnection(): Promise<boolean> {
    if (!this.useRealSupabase || !supabase) return true;
    try {
      const { error } = await supabase
        .from('festivals')
        .select('count', { count: 'exact', head: true });
      return !error;
    } catch {
      return false;
    }
  }

  // ───── Local cache helpers ─────
  private getLocalStorageFestivals(): Festival[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((f: Festival) => ({ ...f, artists: f.artists || [] }));
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return [];
    }
  }

  private writeLocalStorage(festivals: Festival[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(festivals));
    } catch (error) {
      console.error('Failed to write festivals to localStorage:', error);
    }
  }

  // ───── Reads ─────
  async getAllFestivals(): Promise<Festival[]> {
    if (this.useRealSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('festivals')
          .select('*')
          .order('name');
        if (error) {
          console.error('Supabase getAllFestivals error:', error);
          return this.getLocalStorageFestivals();
        }
        return (data || []).map((f) => ({
          ...f,
          coordinates:
            Array.isArray(f.coordinates) && f.coordinates.length === 2
              ? ([f.coordinates[0] || 0, f.coordinates[1] || 0] as [number, number])
              : ([0, 0] as [number, number]),
          artists: Array.isArray(f.artists) ? f.artists : [],
        }));
      } catch (error) {
        console.error('Failed to fetch festivals from Supabase:', error);
        return this.getLocalStorageFestivals();
      }
    }
    return this.getLocalStorageFestivals();
  }

  // ───── Seeding ─────
  // Hydrates localStorage on first run, and on later runs replaces it
  // when the seed has been updated in code (SEED_VERSION change).
  // For Supabase mode, only seeds if the remote table is empty.
  async seedDatabase(initialFestivals: Festival[]): Promise<void> {
    if (this.useRealSupabase && supabase) {
      try {
        const existing = await this.getAllFestivals();
        if (existing.length === 0) {
          await this.replaceFestivals(initialFestivals);
        }
      } catch (error) {
        console.error('Supabase seeding failed; falling back to localStorage:', error);
        this.seedLocalStorage(initialFestivals);
      }
      return;
    }
    this.seedLocalStorage(initialFestivals);
  }

  private seedLocalStorage(initialFestivals: Festival[]): void {
    const storedVersion = localStorage.getItem(SEED_VERSION_KEY);
    const cached = this.getLocalStorageFestivals();
    if (storedVersion !== SEED_VERSION || cached.length === 0) {
      this.writeLocalStorage(initialFestivals);
      try {
        localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
      } catch (error) {
        console.error('Failed to write seed version:', error);
      }
    }
  }

  // ───── Writes ─────
  async addFestival(festival: Festival): Promise<Festival> {
    if (this.useRealSupabase && supabase) {
      const { category, venue, instagram, website, ...festivalData } = festival;
      const festivalForDb = {
        ...festivalData,
        coordinates: festival.coordinates || [0, 0],
        artists: festival.artists || [],
        months: festival.months || [],
      };
      try {
        const { data, error } = await supabase
          .from('festivals')
          .insert([festivalForDb])
          .select()
          .maybeSingle();
        if (!error && data) {
          const result: Festival = {
            ...data,
            coordinates: Array.isArray(data.coordinates)
              ? ([data.coordinates[0], data.coordinates[1]] as [number, number])
              : ([0, 0] as [number, number]),
            artists: data.artists || [],
          };
          const cached = this.getLocalStorageFestivals();
          cached.push(result);
          this.writeLocalStorage(cached);
          return result;
        }
        console.error('Supabase addFestival error, falling back to localStorage:', error);
      } catch (error) {
        console.error('Supabase addFestival threw, falling back to localStorage:', error);
      }
    }
    const cached = this.getLocalStorageFestivals();
    cached.push(festival);
    this.writeLocalStorage(cached);
    return festival;
  }

  async updateFestival(festival: Festival): Promise<Festival> {
    if (this.useRealSupabase && supabase) {
      const { category, venue, instagram, website, ...festivalData } = festival;
      const festivalForDb = {
        ...festivalData,
        coordinates: festival.coordinates || [0, 0],
        artists: festival.artists || [],
        months: festival.months || [],
      };
      try {
        const { data, error } = await supabase
          .from('festivals')
          .update(festivalForDb)
          .eq('id', festival.id)
          .select()
          .maybeSingle();
        if (!error && data) {
          const result: Festival = {
            ...data,
            coordinates: Array.isArray(data.coordinates)
              ? ([data.coordinates[0], data.coordinates[1]] as [number, number])
              : ([0, 0] as [number, number]),
            artists: data.artists || [],
          };
          const cached = this.getLocalStorageFestivals();
          const idx = cached.findIndex((f) => f.id === festival.id);
          if (idx >= 0) cached[idx] = result;
          else cached.push(result);
          this.writeLocalStorage(cached);
          return result;
        }
        console.error('Supabase updateFestival error, falling back to localStorage:', error);
      } catch (error) {
        console.error('Supabase updateFestival threw, falling back to localStorage:', error);
      }
    }
    const cached = this.getLocalStorageFestivals();
    const idx = cached.findIndex((f) => f.id === festival.id);
    if (idx >= 0) cached[idx] = festival;
    else cached.push(festival);
    this.writeLocalStorage(cached);
    return festival;
  }

  async deleteFestival(festivalId: string): Promise<void> {
    if (this.useRealSupabase && supabase) {
      try {
        const { error } = await supabase.from('festivals').delete().eq('id', festivalId);
        if (error) console.error('Supabase deleteFestival error:', error);
      } catch (error) {
        console.error('Supabase deleteFestival threw:', error);
      }
    }
    const cached = this.getLocalStorageFestivals().filter((f) => f.id !== festivalId);
    this.writeLocalStorage(cached);
  }

  async replaceFestivals(festivals: Festival[]): Promise<Festival[]> {
    if (this.useRealSupabase && supabase) {
      try {
        const { error: deleteError } = await supabase
          .from('festivals')
          .delete()
          .neq('id', 'impossible-id');
        if (deleteError) throw deleteError;

        const festivalsForDb = festivals.map((festival) => {
          const { category, venue, instagram, website, ...festivalData } = festival;
          return {
            ...festivalData,
            coordinates: festival.coordinates || [0, 0],
            artists: festival.artists || [],
            months: festival.months || [],
          };
        });

        const { data, error: insertError } = await supabase
          .from('festivals')
          .insert(festivalsForDb)
          .select();
        if (insertError) throw insertError;

        const result: Festival[] = (data || []).map((f) => ({
          ...f,
          coordinates:
            Array.isArray(f.coordinates) && f.coordinates.length === 2
              ? ([f.coordinates[0] || 0, f.coordinates[1] || 0] as [number, number])
              : ([0, 0] as [number, number]),
          artists: f.artists || [],
        }));
        this.writeLocalStorage(result);
        return result;
      } catch (error) {
        console.error('Supabase replaceFestivals failed, using localStorage:', error);
      }
    }
    this.writeLocalStorage(festivals);
    return festivals;
  }

  // ───── Stats / I/O ─────
  async getStats(): Promise<{ totalFestivals: number; lastUpdated: string | null }> {
    if (this.useRealSupabase && supabase) {
      try {
        const { count, error } = await supabase
          .from('festivals')
          .select('*', { count: 'exact', head: true });
        if (!error) {
          return {
            totalFestivals: count || 0,
            lastUpdated: new Date().toISOString(),
          };
        }
      } catch {
        // fall through to localStorage stats
      }
    }
    return {
      totalFestivals: this.getLocalStorageFestivals().length,
      lastUpdated: new Date().toISOString(),
    };
  }

  exportFestivals(festivals: Festival[]): string {
    return JSON.stringify(
      {
        festivals,
        exportedAt: new Date().toISOString(),
        version: '2.0.0',
        source: this.useRealSupabase ? 'supabase' : 'local',
      },
      null,
      2,
    );
  }

  importFestivals(jsonString: string): Festival[] {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.festivals && Array.isArray(parsed.festivals)) return parsed.festivals;
    throw new Error('Invalid JSON format or festival data structure');
  }
}

export const supabaseFestivalService = new SupabaseFestivalService();
