import { type Festival } from '../data/festivals';
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://ksddqgiabaaozekrbagg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZGRxZ2lhYmFhb3pla3JiYWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzODg2MjcsImV4cCI6MjA3MTk2NDYyN30.SKqesU_dbmnrwr1BuFYAmbwECHmoZHKpruzBNEolaDg';

// SUPABASE CLIENT SETUP
interface SupabaseClient {
  from: (table: string) => any;
}

// FOR REAL SUPABASE: Replace this line with: export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabase = createClient(supabaseUrl, supabaseKey);

export interface DatabaseFestival {
  id: string;
  name: string;
  city: string;
  country: string;
  continent: string;
  coordinates: number[]; // [latitude, longitude]
  price: string;
  months: string[];
  description: string;
  dates: string;
  artists: string[]; // List of performing artists
  created_at?: string;
  updated_at?: string;
}

class SupabaseFestivalService {
  private useRealSupabase = false; // Set to true when using real Supabase

  // Initialize the database tables if they don't exist
  async initializeDatabase(): Promise<void> {
    try {
      if (this.useRealSupabase) {
        // Check if festivals table exists - this is handled by the SQL you run in Supabase dashboard
        console.log('Database initialized (using Supabase)');
      } else {
        // For mock implementation, we'll check localStorage
        console.log('Database initialized (using localStorage fallback)');
      }
      return Promise.resolve();
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  // Fetch all festivals from the database
  async getAllFestivals(): Promise<Festival[]> {
    try {
      if (this.useRealSupabase) {
        // First try to run the artists migration if needed
        await this.ensureArtistsMigration();
        
        // REAL SUPABASE VERSION:
        const { data, error } = await supabase
          .from('festivals')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Supabase error:', error);
          // Fallback to localStorage on Supabase error
          return this.getLocalStorageFestivals();
        }
        
        // Convert PostgreSQL array format to tuple format for coordinates and ensure artists exists
        const festivals = (data || []).map(festival => ({
          ...festival,
          coordinates: festival.coordinates && Array.isArray(festival.coordinates) 
            ? [festival.coordinates[0] || 0, festival.coordinates[1] || 0] as [number, number]
            : [0, 0] as [number, number],
          artists: Array.isArray(festival.artists) ? festival.artists : [] // Ensure artists is always an array
        }));
        
        return festivals;
      } else {
        // MOCK VERSION (localStorage fallback):
        return this.getLocalStorageFestivals();
      }
    } catch (error) {
      console.error('Failed to fetch festivals:', error);
      // Always fallback to localStorage on any error
      return this.getLocalStorageFestivals();
    }
  }

  // Helper method to get festivals from localStorage
  private getLocalStorageFestivals(): Festival[] {
    try {
      const saved = localStorage.getItem('cuban-salsa-festivals');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Ensure all festivals have the artists field for backward compatibility
          return parsed.map(festival => ({
            ...festival,
            artists: festival.artists || []
          }));
        }
      }
      return [];
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return [];
    }
  }

  // Add a new festival to the database
  async addFestival(festival: Festival): Promise<Festival> {
    try {
      if (this.useRealSupabase) {
        // REAL SUPABASE VERSION:
        try {
          // Remove fields that don't exist in the database schema (category, venue, instagram, website)
          const { category, venue, instagram, website, ...festivalData } = festival;
          const festivalForDb = {
            ...festivalData,
            coordinates: festival.coordinates || [0, 0], // Ensure coordinates exist
            artists: festival.artists || [], // Ensure artists exists
            months: festival.months || [] // Ensure months is never null
          };
          
          const { data, error } = await supabase
            .from('festivals')
            .insert([festivalForDb])
            .select()
            .maybeSingle();
          
          if (error) {
            // Fallback to localStorage on Supabase error
            const festivals = this.getLocalStorageFestivals();
            festivals.push(festival);
            localStorage.setItem('cuban-salsa-festivals', JSON.stringify(festivals));
            return festival;
          }
          
          if (!data) {
            // Fallback to localStorage (normal fallback)
            const festivals = this.getLocalStorageFestivals();
            festivals.push(festival);
            localStorage.setItem('cuban-salsa-festivals', JSON.stringify(festivals));
            return festival;
          }
          
          // Successfully inserted in Supabase
          // Also sync to localStorage for offline access
          const festivals = this.getLocalStorageFestivals();
          const result = {
            ...data,
            coordinates: data.coordinates ? [data.coordinates[0], data.coordinates[1]] as [number, number] : [0, 0],
            artists: data.artists || []
          };
          festivals.push(result);
          localStorage.setItem('cuban-salsa-festivals', JSON.stringify(festivals));
          
          return result;
        } catch (supabaseError) {
          // Complete fallback to localStorage (silent fallback)
          const festivals = this.getLocalStorageFestivals();
          festivals.push(festival);
          localStorage.setItem('cuban-salsa-festivals', JSON.stringify(festivals));
          return festival;
        }
      } else {
        // MOCK VERSION (localStorage fallback):
        const festivals = await this.getAllFestivals();
        festivals.push(festival);
        localStorage.setItem('cuban-salsa-festivals', JSON.stringify(festivals));
        return festival;
      }
    } catch (error) {
      console.error('Failed to add festival:', error);
      throw error;
    }
  }

  // Update an existing festival in the database
  async updateFestival(festival: Festival): Promise<Festival> {
    try {
      if (this.useRealSupabase) {
        // REAL SUPABASE VERSION:
        try {
          // Remove fields that don't exist in the database schema (category, venue, instagram, website)
          const { category, venue, instagram, website, ...festivalData } = festival;
          const festivalForDb = {
            ...festivalData,
            coordinates: festival.coordinates || [0, 0], // Ensure coordinates exist
            artists: festival.artists || [], // Ensure artists exists
            months: festival.months || [] // Ensure months is never null
          };
          
          const { data, error } = await supabase
            .from('festivals')
            .update(festivalForDb)
            .eq('id', festival.id)
            .select()
            .maybeSingle();
          
          if (error) {
            // Fallback to localStorage on Supabase error
            const festivals = this.getLocalStorageFestivals();
            const index = festivals.findIndex(f => f.id === festival.id);
            if (index !== -1) {
              festivals[index] = festival;
              localStorage.setItem('cuban-salsa-festivals', JSON.stringify(festivals));
              return festival;
            } else {
              // Festival not in localStorage, add it
              festivals.push(festival);
              localStorage.setItem('cuban-salsa-festivals', JSON.stringify(festivals));
              return festival;
            }
          }
          
          if (!data) {
            // Festival not in Supabase, save to localStorage (normal fallback)
            const festivals = this.getLocalStorageFestivals();
            const index = festivals.findIndex(f => f.id === festival.id);
            if (index !== -1) {
              festivals[index] = festival;
            } else {
              festivals.push(festival);
            }
            localStorage.setItem('cuban-salsa-festivals', JSON.stringify(festivals));
            return festival;
          }
          
          // Successfully updated in Supabase
          // Also sync to localStorage for offline access
          const festivals = this.getLocalStorageFestivals();
          const index = festivals.findIndex(f => f.id === festival.id);
          const result = {
            ...data,
            coordinates: data.coordinates ? [data.coordinates[0], data.coordinates[1]] as [number, number] : [0, 0],
            artists: data.artists || []
          };
          if (index !== -1) {
            festivals[index] = result;
          } else {
            festivals.push(result);
          }
          localStorage.setItem('cuban-salsa-festivals', JSON.stringify(festivals));
          
          return result;
        } catch (supabaseError) {
          // Complete fallback to localStorage (silent fallback)
          const festivals = this.getLocalStorageFestivals();
          const index = festivals.findIndex(f => f.id === festival.id);
          if (index !== -1) {
            festivals[index] = festival;
          } else {
            festivals.push(festival);
          }
          localStorage.setItem('cuban-salsa-festivals', JSON.stringify(festivals));
          return festival;
        }
      } else {
        // MOCK VERSION (localStorage fallback):
        const festivals = await this.getAllFestivals();
        const index = festivals.findIndex(f => f.id === festival.id);
        if (index !== -1) {
          festivals[index] = festival;
          localStorage.setItem('cuban-salsa-festivals', JSON.stringify(festivals));
          return festival;
        } else {
          throw new Error('Festival not found');
        }
      }
    } catch (error) {
      console.error('Failed to update festival:', error);
      throw error;
    }
  }

  // Delete a festival from the database
  async deleteFestival(festivalId: string): Promise<void> {
    try {
      if (this.useRealSupabase) {
        const { error } = await supabase
          .from('festivals')
          .delete()
          .eq('id', festivalId);
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
      } else {
        // MOCK VERSION (localStorage fallback):
        const festivals = this.getLocalStorageFestivals();
        const filtered = festivals.filter(f => f.id !== festivalId);
        localStorage.setItem('cuban-salsa-festivals', JSON.stringify(filtered));
      }
    } catch (error) {
      console.error('Failed to delete festival:', error);
      throw error;
    }
  }

  // Bulk replace all festivals (for import operations)
  async replaceFestivals(festivals: Festival[]): Promise<Festival[]> {
    try {
      if (this.useRealSupabase) {
        // First, delete all existing festivals
        const { error: deleteError } = await supabase
          .from('festivals')
          .delete()
          .neq('id', 'impossible-id'); // This deletes all records
        
        if (deleteError) {
          console.error('Error clearing festivals:', deleteError);
          throw deleteError;
        }
        
        // Convert all festivals for database format
        const festivalsForDb = festivals.map(festival => {
          // Remove fields that don't exist in the database schema (category, venue, instagram, website)
          const { category, venue, instagram, website, ...festivalData } = festival;
          return {
            ...festivalData,
            coordinates: festival.coordinates || [0, 0], // Ensure coordinates exist
            artists: festival.artists || [], // Ensure artists exists
            months: festival.months || [] // Ensure months is never null
          };
        });
        
        // Then insert all new festivals
        const { data, error: insertError } = await supabase
          .from('festivals')
          .insert(festivalsForDb)
          .select();
        
        if (insertError) {
          console.error('Error inserting festivals:', insertError);
          throw insertError;
        }
        
        // Convert back to app format
        const result = (data || []).map(festival => ({
          ...festival,
          coordinates: festival.coordinates && Array.isArray(festival.coordinates) 
            ? [festival.coordinates[0] || 0, festival.coordinates[1] || 0] as [number, number]
            : [0, 0] as [number, number],
          artists: festival.artists || []
        }));
        
        return result;
      } else {
        // MOCK VERSION (localStorage fallback):
        localStorage.setItem('cuban-salsa-festivals', JSON.stringify(festivals));
        return festivals;
      }
    } catch (error) {
      console.error('Failed to replace festivals:', error);
      throw error;
    }
  }

  // Seed the database with initial festivals
  async seedDatabase(initialFestivals: Festival[]): Promise<void> {
    try {
      const existing = await this.getAllFestivals();
      // Only seed if empty
      if (existing.length === 0) {
        console.log('Seeding database with initial festival data...');
        
        if (this.useRealSupabase) {
          // Try Supabase first
          try {
            await this.replaceFestivals(initialFestivals);
            console.log(`Successfully seeded Supabase database with ${initialFestivals.length} festivals`);
          } catch (supabaseError) {
            console.error('Supabase seeding failed, using localStorage:', supabaseError);
            // Fallback to localStorage
            localStorage.setItem('cuban-salsa-festivals', JSON.stringify(initialFestivals));
            console.log(`Seeded localStorage with ${initialFestivals.length} festivals`);
          }
        } else {
          // Use localStorage directly
          localStorage.setItem('cuban-salsa-festivals', JSON.stringify(initialFestivals));
          console.log(`Seeded localStorage with ${initialFestivals.length} festivals`);
        }
      } else {
        console.log(`Database already contains ${existing.length} festivals, skipping seeding`);
      }
    } catch (error) {
      console.error('Failed to seed database:', error);
      // Final fallback - save to localStorage
      try {
        localStorage.setItem('cuban-salsa-festivals', JSON.stringify(initialFestivals));
        console.log('Final fallback: saved initial festivals to localStorage');
      } catch (localError) {
        console.error('Even localStorage failed:', localError);
        throw error;
      }
    }
  }

  // Storage key for localStorage
  private readonly STORAGE_KEY = 'cuban-salsa-festivals';

  // Export festivals in JSON format
  exportFestivals(festivals: Festival[]): string {
    return JSON.stringify({
      festivals,
      exportedAt: new Date().toISOString(),
      version: '2.0.0',
      source: 'supabase'
    }, null, 2);
  }

  // Import festivals from JSON
  importFestivals(jsonString: string): Festival[] {
    try {
      const parsed = JSON.parse(jsonString);
      
      // Support different import formats
      if (Array.isArray(parsed)) {
        return parsed;
      } else if (parsed.festivals && Array.isArray(parsed.festivals)) {
        return parsed.festivals;
      } else {
        throw new Error('Invalid festival data format');
      }
    } catch (error) {
      console.error('Failed to import festivals:', error);
      throw new Error('Invalid JSON format or festival data structure');
    }
  }

  // Check database connection
  async checkConnection(): Promise<boolean> {
    if (!this.useRealSupabase) {
      // For localStorage mode, always return true (no connection needed)
      return true;
    }
    
    try {
      const { error } = await supabase
        .from('festivals')
        .select('count', { count: 'exact', head: true });
      
      return !error;
    } catch (error) {
      // Silently handle connection check errors
      return false;
    }
  }

  // Get database statistics
  async getStats(): Promise<{ totalFestivals: number; lastUpdated: string | null }> {
    if (!this.useRealSupabase) {
      // For localStorage mode, get stats from local storage
      const festivals = this.getLocalStorageFestivals();
      return {
        totalFestivals: festivals.length,
        lastUpdated: new Date().toISOString()
      };
    }
    
    try {
      const { count, error } = await supabase
        .from('festivals')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        // Fallback to localStorage stats
        const festivals = this.getLocalStorageFestivals();
        return {
          totalFestivals: festivals.length,
          lastUpdated: new Date().toISOString()
        };
      }
      
      return {
        totalFestivals: count || 0,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      // Fallback to localStorage stats
      const festivals = this.getLocalStorageFestivals();
      return {
        totalFestivals: festivals.length,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  // Method to enable real Supabase (call this after setting up your credentials)
  enableRealSupabase(): void {
    this.useRealSupabase = true;
    console.log('✅ Real Supabase integration enabled!');
  }

  // Method to check if using real Supabase
  isUsingRealSupabase(): boolean {
    return this.useRealSupabase;
  }

  // Ensure the artists column exists and is properly migrated
  private async ensureArtistsMigration(): Promise<void> {
    // Don't run migration checks if not using real Supabase
    if (!this.useRealSupabase) {
      return;
    }
    
    try {
      console.log('🔄 Checking artists field migration...');
      
      // Try to run the migration SQL
      const { error } = await supabase.rpc('exec_sql', {
        sql_query: `
          -- Add the artists column if it doesn't exist
          ALTER TABLE festivals 
          ADD COLUMN IF NOT EXISTS artists text[] DEFAULT '{}';
          
          -- Update any NULL artists fields to empty array
          UPDATE festivals 
          SET artists = '{}' 
          WHERE artists IS NULL;
        `
      });

      if (error) {
        console.log('Could not run migration via RPC, trying direct approach...');
        
        // Alternative approach: Check for artists column by trying to select it
        const { error: testError } = await supabase
          .from('festivals')
          .select('id, artists')
          .limit(1);
        
        if (testError && testError.message.includes('column "artists" does not exist')) {
          console.log('⚠️ Artists column missing. Please run the SUPABASE_ARTISTS_MIGRATION.sql in your Supabase SQL Editor.');
          // Try to handle missing column gracefully
          throw new Error('Artists column migration needed');
        }
      }
      
      console.log('✅ Artists field migration check completed');
    } catch (error) {
      console.log('Migration check completed with warnings:', error);
      // Don't throw here - let the main query handle missing columns gracefully
    }
  }
}

export const supabaseFestivalService = new SupabaseFestivalService();