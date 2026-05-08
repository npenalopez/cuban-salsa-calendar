export interface Festival {
  id: string;
  name: string;
  city: string;
  country: string;
  continent: string;
  dates: string;
  price: string;
  months?: string[]; // Computed from dates
  website?: string;
  instagram?: string;
  description?: string;
  artists?: string[];
  coordinates?: [number, number]; // [latitude, longitude]
  venue?: string;
  category?: string;
  yearsActive?: string; // Added for validation
}

// Continents array for form dropdowns and filtering
export const continents = [
  "North America",
  "South America", 
  "Europe",
  "Africa",
  "Asia",
  "Oceania"
];

// Months array for form dropdowns and filtering
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
  "December"
];

// Sample festivals data - this will be replaced by Supabase data in production
export const festivals: Festival[] = [
  {
    id: "sample-1",
    name: "Cuban Salsa Festival",
    city: "Havana",
    country: "Cuba",
    continent: "North America",
    dates: "December 15-18, 2024",
    price: "€150-€300",
    website: "https://example.com/cuban-salsa-festival",
    description: "The premier Cuban salsa festival in the Caribbean",
    artists: ["Los Van Van", "Charanga Habanera", "Alexander Abreu"],
    coordinates: [23.1136, -82.3666],
    venue: "Teatro Nacional",
    category: "Festival"
  },
  {
    id: "sample-2",
    name: "Salsa Barcelona Congress",
    city: "Barcelona",
    country: "Spain",
    continent: "Europe", 
    dates: "March 20-24, 2025",
    price: "€180-€400",
    website: "https://example.com/salsa-barcelona",
    description: "International salsa congress in the heart of Catalonia",
    artists: ["Maykel Blanco", "Manolito Simonet", "Paulo FG"],
    coordinates: [41.3851, 2.1734],
    venue: "Palau del Esport",
    category: "Congress"
  },
  {
    id: "sample-3", 
    name: "Miami Salsa Festival",
    city: "Miami",
    country: "United States",
    continent: "North America",
    dates: "July 10-14, 2025",
    price: "-",
    website: "https://example.com/miami-salsa",
    description: "The biggest salsa festival in the United States",
    artists: ["Bamboleo", "Los 4", "Isaac Delgado"],
    coordinates: [25.7617, -80.1918],
    venue: "Bayfront Park",
    category: "Festival"
  },
  {
    id: "sample-4", 
    name: "Berlin Salsa Congress",
    city: "Berlin",
    country: "Germany",
    continent: "Europe",
    dates: "September 5-8, 2025",
    price: "-",
    website: "https://example.com/berlin-salsa",
    description: "Annual salsa congress in Berlin",
    artists: ["-"],
    coordinates: [52.5200, 13.4050],
    venue: "Tempodrom",
    category: "Congress"
  },
  {
    id: "sample-5", 
    name: "Tokyo Salsa Night",
    city: "Tokyo",
    country: "Japan",
    continent: "Asia",
    dates: "November 20-22, 2025",
    price: "¥8,000-¥15,000",
    website: "https://example.com/tokyo-salsa",
    description: "First major salsa event in Japan",
    artists: ["-"],
    coordinates: [35.6762, 139.6503],
    venue: "Tokyo International Forum",
    category: "Festival"
  },
  {
    id: "sample-6", 
    name: "London Cuban Festival",
    city: "London",
    country: "United Kingdom",
    continent: "Europe",
    dates: "August 12-15, 2025",
    price: "soldout",
    website: "https://example.com/london-cuban",
    description: "Popular Cuban music festival in London - tickets sold out!",
    artists: ["Buena Vista Social Club", "Omara Portuondo", "Eliades Ochoa"],
    coordinates: [51.5074, -0.1278],
    venue: "Royal Albert Hall",
    category: "Festival"
  },
  {
    id: "sample-7", 
    name: "New York Salsa Weekend",
    city: "New York",
    country: "United States",
    continent: "North America",
    dates: "October 3-6, 2025",
    price: "SOLDOUT",
    website: "https://example.com/ny-salsa-weekend",
    description: "Exclusive salsa weekend in Manhattan - completely sold out",
    artists: ["Gilberto Santa Rosa", "La India", "Victor Manuelle"],
    coordinates: [40.7128, -74.0060],
    venue: "Lincoln Center",
    category: "Festival"
  }
];

export default festivals;