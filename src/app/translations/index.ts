// Translation system for Cuban Salsa Calendar
import type { SupportedLanguage } from '../utils/i18n';

export interface Translations {
  // Header
  title: string;
  followInstagram: string;
  topArtists: string;
  manageFestivals: string;
  
  // Search and Filters
  searchPlaceholder: string;
  searchFestivals: string;
  clearFilters: string;
  showAll: string;
  
  // Festival Info
  festival: string;
  festivals: string;
  artist: string;
  artists: string;
  city: string;
  country: string;
  continent: string;
  dates: string;
  price: string;
  website: string;
  contact: string;
  
  // Months
  months: {
    all: string;
    january: string;
    february: string;
    march: string;
    april: string;
    may: string;
    june: string;
    july: string;
    august: string;
    september: string;
    october: string;
    november: string;
    december: string;
  };
  
  // Continents
  continents: {
    africa: string;
    asia: string;
    europe: string;
    northAmerica: string;
    southAmerica: string;
    oceania: string;
  };
  
  // Actions
  exportCalendar: string;
  addToCalendar: string;
  viewDetails: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  close: string;
  continue: string;
  
  // Messages
  noFestivalsFound: string;
  adjustFilters: string;
  welcome: string;
  welcomeMessage: string;
  contactMessage: string;
  foundMistake: string;
  
  // Festival Growth Announcement
  growthAnnouncementTitle: string;
  growthAnnouncementMessage: string;
  growthAnnouncementSubtext: string;
  
  // Location
  yourLocation: string;
  travelTime: string;
  
  // Calendar Export
  googleCalendar: string;
  outlookCalendar: string;
  appleCalendar: string;
  icsFile: string;
  openInCalendar: string;
  directCalendarOpen: string;
  
  // Festival Card Elements
  duration: string;
  from: string;
  to: string;
  date: string;
  details: string;
  more: string;
  viewAllArtists: string;
  featuredArtists: string;
  visitWebsite: string;
  searchDetails: string;
  downloadIcsFile: string;
  yahooCalendar: string;
  
  // Duration translations
  days: string;
  day: string;
  week: string;
  weeks: string;
  multiDay: string;
  
  // Error states
  noFestivalsDisplay: string;
  tryAdjustingFilters: string;
  
  // Share functionality
  share: string;
  shareCalendar: string;
  shareSuccess: string;
  shareError: string;
  linkCopied: string;
  copyLink: string;
  copyError: string;
  manualCopy: string;
  manualCopyInstructions: string;
  shareFestival: string;
  shareFestivalText: (festivalName: string, city: string, country: string, date: string) => string;
  shareCalendarDescription: string;
  
  // Artist Rankings
  topArtistsRanking: string;
  artistRankingDescription: string;
  showingTopArtists: (showing: number, total: number) => string;
  

  

  
  // Price
  priceToBeAnnounced: string;
  soldOut: string;
  fromPrice: string;
  
  // Event Status
  pastEvent: string;
  
  // Artists
  artistsToBeAnnounced: string;
  
  // Calendar Export
  venue: string;
  category: string;
  description: string;
  and: string;
  go: string;
  tomorrow: string;
  getReady: string;
  generatedByCalendar: string;
  enjoyFestival: string;

  // Numbers
  resultsCount: (count: number, total: number) => string;
  festivalCount: (count: number) => string;
  dayCount: (count: number) => string;

  // Enhanced Search
  recentSearches: string;
  popularDestinations: string;
  cities: string;
  countries: string;
  clearRecentSearches: string;
}

const englishTranslations: Translations = {
  title: 'Cuban Calendar',
  followInstagram: 'Follow @cubansalsacalendar',
  topArtists: 'Top artists',
  manageFestivals: 'Manage festivals',
  
  searchPlaceholder: 'Search festivals, cities, artists...',
  searchFestivals: 'Search festivals',
  clearFilters: 'Clear',
  showAll: 'Show all festivals',
  
  festival: 'Festival',
  festivals: 'Festivals',
  artist: 'Artist',
  artists: 'Artists',
  city: 'City',
  country: 'Country',
  continent: 'Continent',
  dates: 'Dates',
  price: 'Price',
  website: 'Website',
  contact: 'Contact',
  
  months: {
    all: 'All',
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
  },
  
  continents: {
    africa: 'Africa',
    asia: 'Asia',
    europe: 'Europe',
    northAmerica: 'North America',
    southAmerica: 'South America',
    oceania: 'Oceania',
  },
  
  exportCalendar: 'Export to Calendar',
  addToCalendar: 'Save Date',
  viewDetails: 'View Details',
  edit: 'Edit',
  delete: 'Delete',
  save: 'Save',
  cancel: 'Cancel',
  close: 'Close',
  continue: 'Continue',
  
  noFestivalsFound: 'No festivals found',
  adjustFilters: 'Try adjusting your filters or search terms',
  welcome: '¡Bienvenidos!',
  welcomeMessage: 'Your gateway to discovering salsa festivals and events worldwide.',
  contactMessage: 'Found a mistake or want to add a new festival? Contact us at',
  foundMistake: 'Found a mistake or want to add a new festival?',
  
  growthAnnouncementTitle: 'Festival Collection Growing',
  growthAnnouncementMessage: 'We\'ve nearly doubled our festival collection! Discover more salsa festivals from around the world.',
  growthAnnouncementSubtext: 'Keep exploring to find your next dance adventure.',
  
  yourLocation: 'Your location',
  travelTime: 'Used for travel time estimates',
  
  googleCalendar: 'Google Calendar',
  outlookCalendar: 'Outlook Calendar',
  appleCalendar: 'Apple Calendar',
  icsFile: 'Download ICS',
  openInCalendar: 'Open in Calendar',
  directCalendarOpen: 'Direct Calendar',
  
  // Festival Card Elements
  duration: 'Duration',
  from: 'from',
  to: 'to',
  date: 'Date',
  details: 'Details',
  more: 'more',
  viewAllArtists: 'View all artists',
  featuredArtists: 'Featured Artists',
  visitWebsite: 'Visit website',
  searchDetails: 'Search for details',
  downloadIcsFile: 'Download (.ics)',
  yahooCalendar: 'Yahoo Calendar',
  
  // Duration translations
  days: 'days',
  day: 'day',
  week: 'week',
  weeks: 'weeks',
  multiDay: 'Multi-day',
  
  // Error states
  noFestivalsDisplay: 'No festivals to display',
  tryAdjustingFilters: 'Try adjusting your filters',
  
  // Share functionality
  share: 'Share',
  shareCalendar: 'Share this festival calendar',
  shareSuccess: 'Shared successfully!',
  shareError: 'Failed to share. Please try again.',
  linkCopied: 'Link copied to clipboard!',
  copyLink: 'Copy link',
  copyError: 'Failed to copy link. Please try again.',
  manualCopy: 'Manual copy',
  manualCopyInstructions: 'Manual copy: Press Ctrl+C (or Cmd+C on Mac) to copy',
  shareFestival: 'Share festival',
  shareFestivalText: (festivalName: string, city: string, country: string, date: string) => 
    `${festivalName} in ${city}, ${country} on ${date}. Check it out on Cuban Calendar!`,
  shareCalendarDescription: 'Check out this amazing salsa festival calendar!',
  
  // Artist Rankings
  topArtistsRanking: 'Top Artists',
  artistRankingDescription: 'Ranking of artists by festival appearances across all regions',
  showingTopArtists: (showing: number, total: number) => `Showing top ${showing} of ${total} artists`,
  
  // Price
  priceToBeAnnounced: 'Price to be announced',
  soldOut: 'Sold out',
  fromPrice: 'Starting',
  
  // Event Status
  pastEvent: 'Past',
  
  // Artists
  artistsToBeAnnounced: 'Artists to be announced',
  
  // Calendar Export
  venue: 'Venue',
  category: 'Category',
  description: 'Description',
  and: 'and',
  go: 'go',
  tomorrow: 'Tomorrow',
  getReady: 'Get ready to dance',
  generatedByCalendar: 'Event details from Cuban Salsa Calendar',
  enjoyFestival: 'Enjoy the festival and dance the night away!',

  resultsCount: (count: number, total: number) => `${count} of ${total}`,
  festivalCount: (count: number) => `${count} festival${count !== 1 ? 's' : ''}`,
  dayCount: (count: number) => `${count} ${count === 1 ? 'day' : 'days'}`,

  // Enhanced Search
  recentSearches: 'Recent Searches',
  popularDestinations: 'Popular Destinations',
  cities: 'Cities',
  countries: 'Countries',
  clearRecentSearches: 'Clear',
};

const germanTranslations: Translations = {
  title: 'Kubanischer Kalender',
  followInstagram: 'Folge @cubansalsacalendar',
  topArtists: 'Top Künstler',
  manageFestivals: 'Festivals verwalten',
  
  searchPlaceholder: 'Festivals, Städte, Künstler suchen...',
  searchFestivals: 'Festivals suchen',
  clearFilters: 'Löschen',
  showAll: 'Alle Festivals anzeigen',
  
  festival: 'Festival',
  festivals: 'Festivals',
  artist: 'Künstler',
  artists: 'Künstler',
  city: 'Stadt',
  country: 'Land',
  continent: 'Kontinent',
  dates: 'Termine',
  price: 'Preis',
  website: 'Website',
  contact: 'Kontakt',
  
  months: {
    all: 'Alle',
    january: 'Januar',
    february: 'Februar',
    march: 'März',
    april: 'April',
    may: 'Mai',
    june: 'Juni',
    july: 'Juli',
    august: 'August',
    september: 'September',
    october: 'Oktober',
    november: 'November',
    december: 'Dezember',
  },
  
  continents: {
    africa: 'Afrika',
    asia: 'Asien',
    europe: 'Europa',
    northAmerica: 'Nordamerika',
    southAmerica: 'Südamerika',
    oceania: 'Ozeanien',
  },
  
  exportCalendar: 'In Kalender exportieren',
  addToCalendar: 'Datum speichern',
  viewDetails: 'Details anzeigen',
  edit: 'Bearbeiten',
  delete: 'Löschen',
  save: 'Speichern',
  cancel: 'Abbrechen',
  close: 'Schließen',
  continue: 'Weiter',
  
  noFestivalsFound: 'Keine Festivals gefunden',
  adjustFilters: 'Versuche deine Filter oder Suchbegriffe anzupassen',
  welcome: '¡Bienvenidos!',
  welcomeMessage: 'Dein Tor zur Entdeckung von Salsa-Festivals und Events weltweit.',
  contactMessage: 'Fehler gefunden oder neues Festival hinzufügen? Kontaktiere uns unter',
  foundMistake: 'Fehler gefunden oder neues Festival hinzufügen?',
  
  growthAnnouncementTitle: 'Festival-Sammlung wächst',
  growthAnnouncementMessage: 'Wir haben unsere Festival-Sammlung fast verdoppelt! Entdecke mehr Salsa-Festivals aus der ganzen Welt.',
  growthAnnouncementSubtext: 'Erkunde weiter, um dein nächstes Tanzabenteuer zu finden.',
  
  yourLocation: 'Dein Standort',
  travelTime: 'Wird für Reisezeit-Schätzungen verwendet',
  
  googleCalendar: 'Google Kalender',
  outlookCalendar: 'Outlook Kalender',
  appleCalendar: 'Apple Kalender',
  icsFile: 'ICS herunterladen',
  openInCalendar: 'Im Kalender öffnen',
  directCalendarOpen: 'Direkter Kalender',
  
  // Festival Card Elements
  duration: 'Dauer',
  from: 'vom',
  to: 'bis',
  date: 'Datum',
  details: 'Details',
  more: 'weitere',
  viewAllArtists: 'Alle Künstler anzeigen',
  featuredArtists: 'Künstler',
  visitWebsite: 'Website besuchen',
  searchDetails: 'Details suchen',
  downloadIcsFile: 'Herunterladen (.ics)',
  yahooCalendar: 'Yahoo Kalender',
  
  // Duration translations
  days: 'Tage',
  day: 'Tag',
  week: 'Woche',
  weeks: 'Wochen',
  multiDay: 'Mehrtägig',
  
  // Error states
  noFestivalsDisplay: 'Keine Festivals anzuzeigen',
  tryAdjustingFilters: 'Versuche deine Filter anzupassen',
  
  // Share functionality
  share: 'Teilen',
  shareCalendar: 'Diesen Festival-Kalender teilen',
  shareSuccess: 'Erfolgreich geteilt!',
  shareError: 'Teilen fehlgeschlagen. Bitte versuche es erneut.',
  linkCopied: 'Link in die Zwischenablage kopiert!',
  copyLink: 'Link kopieren',
  copyError: 'Link kopieren fehlgeschlagen. Bitte versuche es erneut.',
  manualCopy: 'Manuell kopieren',
  manualCopyInstructions: 'Manuell kopieren: Drücke Strg+C (oder Cmd+C auf Mac) zum Kopieren',
  shareFestival: 'Festival teilen',
  shareFestivalText: (festivalName: string, city: string, country: string, date: string) => 
    `${festivalName} in ${city}, ${country} am ${date}. Schau es dir im Kubanischen Kalender an!`,
  shareCalendarDescription: 'Schau dir diesen erstaunlichen Salsa-Festival-Kalender an!',
  
  // Artist Rankings
  topArtistsRanking: 'Top Künstler',
  artistRankingDescription: 'Ranking von Künstlern nach Festival-Auftritten in allen Regionen',
  showingTopArtists: (showing: number, total: number) => `Zeige die besten ${showing} von ${total} Künstlern`,
  
  // Price
  priceToBeAnnounced: 'Preis wird bekannt gegeben',
  soldOut: 'Ausverkauft',
  fromPrice: 'Ab',
  
  // Event Status
  pastEvent: 'Past',
  
  // Artists
  artistsToBeAnnounced: 'Künstler werden bekannt gegeben',
  
  // Calendar Export
  venue: 'Veranstaltungsort',
  category: 'Kategorie',
  description: 'Beschreibung',
  and: 'und',
  go: 'gehen',
  tomorrow: 'Morgen',
  getReady: 'Bereite dich aufs Tanzen vor',
  generatedByCalendar: 'Eventdetails vom Kubanischen Salsa Kalender',
  enjoyFestival: 'Genieße das Festival und tanze die ganze Nacht!',

  resultsCount: (count: number, total: number) => `${count} von ${total}`,
  festivalCount: (count: number) => `${count} Festival${count !== 1 ? 's' : ''}`,
  dayCount: (count: number) => `${count} ${count === 1 ? 'Tag' : 'Tage'}`,

  // Enhanced Search
  recentSearches: 'Letzte Suchen',
  popularDestinations: 'Beliebte Ziele',
  cities: 'Städte',
  countries: 'Länder',
  clearRecentSearches: 'Löschen',
};

const spanishTranslations: Translations = {
  title: 'Calendario Cubano',
  followInstagram: 'Síguenos @cubansalsacalendar',
  topArtists: 'Mejores artistas',
  manageFestivals: 'Gestionar festivales',
  
  searchPlaceholder: 'Buscar festivales, ciudades, artistas...',
  searchFestivals: 'Buscar festivales',
  clearFilters: 'Limpiar',
  showAll: 'Mostrar todos los festivales',
  
  festival: 'Festival',
  festivals: 'Festivales',
  artist: 'Artista',
  artists: 'Artistas',
  city: 'Ciudad',
  country: 'País',
  continent: 'Continente',
  dates: 'Fechas',
  price: 'Precio',
  website: 'Sitio web',
  contact: 'Contacto',
  
  months: {
    all: 'Todos',
    january: 'Enero',
    february: 'Febrero',
    march: 'Marzo',
    april: 'Abril',
    may: 'Mayo',
    june: 'Junio',
    july: 'Julio',
    august: 'Agosto',
    september: 'Septiembre',
    october: 'Octubre',
    november: 'Noviembre',
    december: 'Diciembre',
  },
  
  continents: {
    africa: 'África',
    asia: 'Asia',
    europe: 'Europa',
    northAmerica: 'América del Norte',
    southAmerica: 'América del Sur',
    oceania: 'Oceanía',
  },
  
  exportCalendar: 'Exportar al Calendario',
  addToCalendar: 'Guardar fecha',
  viewDetails: 'Ver Detalles',
  edit: 'Editar',
  delete: 'Eliminar',
  save: 'Guardar',
  cancel: 'Cancelar',
  close: 'Cerrar',
  continue: 'Continuar',
  
  noFestivalsFound: 'No se encontraron festivales',
  adjustFilters: 'Intenta ajustar tus filtros o términos de búsqueda',
  welcome: '¡Bienvenidos!',
  welcomeMessage: 'Tu puerta de entrada para descubrir festivales y eventos de salsa en todo el mundo.',
  contactMessage: '¿Encontraste un error o quieres añadir un nuevo festival? Contáctanos en',
  foundMistake: '¿Encontraste un error o quieres añadir un nuevo festival?',
  
  growthAnnouncementTitle: 'Colección de Festivales Creciendo',
  growthAnnouncementMessage: '¡Hemos casi duplicado nuestra colección de festivales! Descubre más festivales de salsa de todo el mundo.',
  growthAnnouncementSubtext: 'Sigue explorando para encontrar tu próxima aventura de baile.',
  
  yourLocation: 'Tu ubicación',
  travelTime: 'Usado para estimaciones de tiempo de viaje',
  
  googleCalendar: 'Google Calendar',
  outlookCalendar: 'Outlook Calendar',
  appleCalendar: 'Apple Calendar',
  icsFile: 'Descargar ICS',
  openInCalendar: 'Abrir en Calendario',
  directCalendarOpen: 'Calendario Directo',
  
  // Festival Card Elements
  duration: 'Duración',
  from: 'del',
  to: 'al',
  date: 'Fecha',
  details: 'Detalles',
  more: 'más',
  viewAllArtists: 'Ver todos los artistas',
  featuredArtists: 'Artistas',
  visitWebsite: 'Visitar sitio web',
  searchDetails: 'Buscar detalles',
  downloadIcsFile: 'Descargar (.ics)',
  yahooCalendar: 'Yahoo Calendar',
  
  // Duration translations
  days: 'días',
  day: 'día',
  week: 'semana',
  weeks: 'semanas',
  multiDay: 'Varios días',
  
  // Error states
  noFestivalsDisplay: 'No hay festivales para mostrar',
  tryAdjustingFilters: 'Intenta ajustar tus filtros',
  
  // Share functionality
  share: 'Compartir',
  shareCalendar: 'Compartir este calendario de festivales',
  shareSuccess: '¡Compartido exitosamente!',
  shareError: 'Error al compartir. Por favor, inténtalo de nuevo.',
  linkCopied: '¡Enlace copiado al portapapeles!',
  copyLink: 'Copiar enlace',
  copyError: 'Error al copiar enlace. Por favor, inténtalo de nuevo.',
  manualCopy: 'Copia manual',
  manualCopyInstructions: 'Copia manual: Presiona Ctrl+C (o Cmd+C en Mac) para copiar',
  shareFestival: 'Compartir festival',
  shareFestivalText: (festivalName: string, city: string, country: string, date: string) => 
    `${festivalName} en ${city}, ${country} el ${date}. ¡Échale un vistazo en el Calendario Cubano!`,
  shareCalendarDescription: '¡Echa un vistazo a este increíble calendario de festivales de salsa!',
  
  // Artist Rankings
  topArtistsRanking: 'Mejores Artistas',
  artistRankingDescription: 'Clasificación de artistas por apariciones en festivales en todas las regiones',
  showingTopArtists: (showing: number, total: number) => `Mostrando los mejores ${showing} de ${total} artistas`,
  
  // Price
  priceToBeAnnounced: 'Precio por anunciar',
  soldOut: 'Agotado',
  fromPrice: 'Desde',
  
  // Event Status
  pastEvent: 'Past',
  
  // Artists
  artistsToBeAnnounced: 'Artistas por anunciar',
  
  // Calendar Export
  venue: 'Lugar',
  category: 'Categoría',
  description: 'Descripción',
  and: 'y',
  go: 'ir',
  tomorrow: 'Mañana',
  getReady: 'Prepárate para bailar',
  generatedByCalendar: 'Detalles del evento desde Calendario de Salsa Cubana',
  enjoyFestival: '¡Disfruta del festival y baila toda la noche!',

  resultsCount: (count: number, total: number) => `${count} de ${total}`,
  festivalCount: (count: number) => `${count} festival${count !== 1 ? 'es' : ''}`,
  dayCount: (count: number) => `${count} ${count === 1 ? 'día' : 'días'}`,

  // Enhanced Search
  recentSearches: 'Búsquedas Recientes',
  popularDestinations: 'Destinos Populares',
  cities: 'Ciudades',
  countries: 'Países',
  clearRecentSearches: 'Limpiar',
};

const frenchTranslations: Translations = {
  title: 'Calendrier Cubain',
  followInstagram: 'Suivez @cubansalsacalendar',
  topArtists: 'Meilleurs artistes',
  manageFestivals: 'Gérer les festivals',
  
  searchPlaceholder: 'Rechercher festivals, villes, artistes...',
  searchFestivals: 'Rechercher festivals',
  clearFilters: 'Effacer',
  showAll: 'Afficher tous les festivals',
  
  festival: 'Festival',
  festivals: 'Festivals',
  artist: 'Artiste',
  artists: 'Artistes',
  city: 'Ville',
  country: 'Pays',
  continent: 'Continent',
  dates: 'Dates',
  price: 'Prix',
  website: 'Site web',
  contact: 'Contact',
  
  months: {
    all: 'Tous',
    january: 'Janvier',
    february: 'Février',
    march: 'Mars',
    april: 'Avril',
    may: 'Mai',
    june: 'Juin',
    july: 'Juillet',
    august: 'Août',
    september: 'Septembre',
    october: 'Octobre',
    november: 'Novembre',
    december: 'Décembre',
  },
  
  continents: {
    africa: 'Afrique',
    asia: 'Asie',
    europe: 'Europe',
    northAmerica: 'Amérique du Nord',
    southAmerica: 'Amérique du Sud',
    oceania: 'Océanie',
  },
  
  exportCalendar: 'Exporter vers le Calendrier',
  addToCalendar: 'Sauvegarder la date',
  viewDetails: 'Voir les Détails',
  edit: 'Modifier',
  delete: 'Supprimer',
  save: 'Enregistrer',
  cancel: 'Annuler',
  close: 'Fermer',
  continue: 'Continuer',

  noFestivalsFound: 'Aucun festival trouvé',
  adjustFilters: 'Essayez d\'ajuster vos filtres ou termes de recherche',
  welcome: '¡Bienvenidos!',
  welcomeMessage: 'Votre porte d\'entrée pour découvrir les festivals et événements de salsa dans le monde entier.',
  contactMessage: 'Vous avez trouvé une erreur ou voulez ajouter un nouveau festival ? Contactez-nous à',
  foundMistake: 'Vous avez trouvé une erreur ou voulez ajouter un nouveau festival ?',

  growthAnnouncementTitle: 'La collection de festivals s\'agrandit',
  growthAnnouncementMessage: 'Nous avons presque doublé notre collection de festivals ! Découvrez plus de festivals de salsa du monde entier.',
  growthAnnouncementSubtext: 'Continuez à explorer pour trouver votre prochaine aventure de danse.',

  yourLocation: 'Votre emplacement',
  travelTime: 'Utilisé pour les estimations de temps de voyage',
  
  googleCalendar: 'Google Calendar',
  outlookCalendar: 'Outlook Calendar',
  appleCalendar: 'Apple Calendar',
  icsFile: 'Télécharger ICS',
  openInCalendar: 'Ouvrir dans le calendrier',
  directCalendarOpen: 'Calendrier direct',
  
  // Festival Card Elements
  duration: 'Durée',
  from: 'du',
  to: 'au',
  date: 'Date',
  details: 'Détails',
  more: 'de plus',
  viewAllArtists: 'Voir tous les artistes',
  featuredArtists: 'Artistes',
  visitWebsite: 'Visiter le site web',
  searchDetails: 'Rechercher des détails',
  downloadIcsFile: 'Télécharger (.ics)',
  yahooCalendar: 'Yahoo Calendar',
  
  // Duration translations
  days: 'jours',
  day: 'jour',
  week: 'semaine',
  weeks: 'semaines',
  multiDay: 'Plusieurs jours',
  
  // Error states
  noFestivalsDisplay: 'Aucun festival à afficher',
  tryAdjustingFilters: 'Essayez d\'ajuster vos filtres',
  
  // Share functionality
  share: 'Partager',
  shareCalendar: 'Partager ce calendrier de festivals',
  shareSuccess: 'Partagé avec succès !',
  shareError: 'Échec du partage. Veuillez réessayer.',
  linkCopied: 'Lien copié dans le presse-papiers !',
  copyLink: 'Copier le lien',
  copyError: 'Échec de la copie du lien. Veuillez réessayer.',
  manualCopy: 'Copie manuelle',
  manualCopyInstructions: 'Copie manuelle: Appuyez sur Ctrl+C (ou Cmd+C sur Mac) pour copier',
  shareFestival: 'Partager le festival',
  shareFestivalText: (festivalName: string, city: string, country: string, date: string) => 
    `${festivalName} à ${city}, ${country} le ${date}. Découvrez-le sur le Calendrier Cubain !`,
  shareCalendarDescription: 'Découvrez cet incroyable calendrier de festivals de salsa !',
  
  // Artist Rankings
  topArtistsRanking: 'Meilleurs Artistes',
  artistRankingDescription: 'Classement des artistes par apparitions dans les festivals dans toutes les régions',
  showingTopArtists: (showing: number, total: number) => `Affichage du top ${showing} sur ${total} artistes`,
  
  // Price
  priceToBeAnnounced: 'Prix à annoncer',
  soldOut: 'Épuisé',
  fromPrice: 'À partir de',
  
  // Event Status
  pastEvent: 'Past',
  
  // Artists
  artistsToBeAnnounced: 'Artistes à annoncer',
  
  // Calendar Export
  venue: 'Lieu',
  category: 'Catégorie',
  description: 'Description',
  and: 'et',
  go: 'aller',
  tomorrow: 'Demain',
  getReady: 'Préparez-vous à danser',
  generatedByCalendar: 'Détails de l\'événement depuis Calendrier de Salsa Cubaine',
  enjoyFestival: 'Profitez du festival et dansez toute la nuit !',

  resultsCount: (count: number, total: number) => `${count} sur ${total}`,
  festivalCount: (count: number) => `${count} festival${count !== 1 ? 's' : ''}`,
  dayCount: (count: number) => `${count} ${count === 1 ? 'jour' : 'jours'}`,

  // Enhanced Search
  recentSearches: 'Recherches Récentes',
  popularDestinations: 'Destinations Populaires',
  cities: 'Villes',
  countries: 'Pays',
  clearRecentSearches: 'Effacer',
};

const polishTranslations: Translations = {
  title: 'Kalendarz Kubański',
  followInstagram: 'Śledź @cubansalsacalendar',
  topArtists: 'Najlepsi artyści',
  manageFestivals: 'Zarządzaj festiwalami',
  
  searchPlaceholder: 'Szukaj festiwali, miast, artystów...',
  searchFestivals: 'Szukaj festiwali',
  clearFilters: 'Wyczyść',
  showAll: 'Pokaż wszystkie festiwale',
  
  festival: 'Festiwal',
  festivals: 'Festiwale',
  artist: 'Artysta',
  artists: 'Artyści',
  city: 'Miasto',
  country: 'Kraj',
  continent: 'Kontynent',
  dates: 'Daty',
  price: 'Cena',
  website: 'Strona internetowa',
  contact: 'Kontakt',
  
  months: {
    all: 'Wszystkie',
    january: 'Styczeń',
    february: 'Luty',
    march: 'Marzec',
    april: 'Kwiecień',
    may: 'Maj',
    june: 'Czerwiec',
    july: 'Lipiec',
    august: 'Sierpień',
    september: 'Wrzesień',
    october: 'Październik',
    november: 'Listopad',
    december: 'Grudzień',
  },
  
  continents: {
    africa: 'Afryka',
    asia: 'Azja',
    europe: 'Europa',
    northAmerica: 'Ameryka Północna',
    southAmerica: 'Ameryka Południowa',
    oceania: 'Oceania',
  },
  
  exportCalendar: 'Eksportuj do Kalendarza',
  addToCalendar: 'Zapisz datę',
  viewDetails: 'Zobacz Szczegóły',
  edit: 'Edytuj',
  delete: 'Usuń',
  save: 'Zapisz',
  cancel: 'Anuluj',
  close: 'Zamknij',
  continue: 'Kontynuuj',

  noFestivalsFound: 'Nie znaleziono festiwali',
  adjustFilters: 'Spróbuj dostosować filtry lub wyszukiwane hasła',
  welcome: '¡Bienvenidos!',
  welcomeMessage: 'Twoja brama do odkrywania festiwali i wydarzeń salsy na całym świecie.',
  contactMessage: 'Znalazłeś błąd lub chcesz dodać nowy festiwal? Skontaktuj się z nami na',
  foundMistake: 'Znalazłeś błąd lub chcesz dodać nowy festiwal?',

  growthAnnouncementTitle: 'Kolekcja festiwali rośnie',
  growthAnnouncementMessage: 'Prawie podwoiliśmy naszą kolekcję festiwali! Odkryj więcej festiwali salsy z całego świata.',
  growthAnnouncementSubtext: 'Eksploruj dalej, aby znaleźć swoją kolejną taneczną przygodę.',

  yourLocation: 'Twoja lokalizacja',
  travelTime: 'Używane do szacowania czasu podróży',
  
  googleCalendar: 'Kalendarz Google',
  outlookCalendar: 'Kalendarz Outlook',
  appleCalendar: 'Kalendarz Apple',
  icsFile: 'Pobierz ICS',
  openInCalendar: 'Otwórz w kalendarzu',
  directCalendarOpen: 'Bezpośredni kalendarz',
  
  // Festival Card Elements
  duration: 'Czas trwania',
  from: 'od',
  to: 'do',
  date: 'Data',
  details: 'Szczegóły',
  more: 'więcej',
  viewAllArtists: 'Zobacz wszystkich artystów',
  featuredArtists: 'Artyści',
  visitWebsite: 'Odwiedź stronę',
  searchDetails: 'Szukaj szczegółów',
  downloadIcsFile: 'Pobierz (.ics)',
  yahooCalendar: 'Yahoo Calendar',
  
  // Duration translations
  days: 'dni',
  day: 'dzień',
  week: 'tydzień',
  weeks: 'tygodnie',
  multiDay: 'Wielodniowy',
  
  // Error states
  noFestivalsDisplay: 'Brak festiwali do wyświetlenia',
  tryAdjustingFilters: 'Spróbuj dostosować filtry',
  
  // Share functionality
  share: 'Udostępnij',
  shareCalendar: 'Udostępnij ten kalendarz festiwali',
  shareSuccess: 'Udostępniono pomyślnie!',
  shareError: 'Nie udało się udostępnić. Spróbuj ponownie.',
  linkCopied: 'Link skopiowany do schowka!',
  copyLink: 'Kopiuj link',
  copyError: 'Nie udało się skopiować linku. Spróbuj ponownie.',
  manualCopy: 'Kopiowanie ręczne',
  manualCopyInstructions: 'Kopiowanie ręczne: Naciśnij Ctrl+C (lub Cmd+C na Mac) aby skopiować',
  shareFestival: 'Udostępnij festiwal',
  shareFestivalText: (festivalName: string, city: string, country: string, date: string) => 
    `${festivalName} w ${city}, ${country} w dniu ${date}. Sprawdź to w Kalendarz Kubański!`,
  shareCalendarDescription: 'Sprawdź ten niesamowity kalendarz festiwali salsy!',
  
  // Artist Rankings
  topArtistsRanking: 'Najlepsi Artyści',
  artistRankingDescription: 'Ranking artystów według występów na festiwalach we wszystkich regionach',
  showingTopArtists: (showing: number, total: number) => `Pokazuje top ${showing} z ${total} artystów`,
  
  // Price
  priceToBeAnnounced: 'Cena do ogłoszenia',
  soldOut: 'Wyprzedane',
  fromPrice: 'Od',
  
  // Event Status
  pastEvent: 'Past',
  
  // Artists
  artistsToBeAnnounced: 'Artyści do ogłoszenia',
  
  // Calendar Export
  venue: 'Miejsce',
  category: 'Kategoria',
  description: 'Opis',
  and: 'i',
  go: 'iść',
  tomorrow: 'Jutro',
  getReady: 'Przygotuj się do tańca',
  generatedByCalendar: 'Szczegóły wydarzenia z Kalendarza Salsy Kubańskiej',
  enjoyFestival: 'Ciesz się festiwalem i tańcz całą noc!',

  resultsCount: (count: number, total: number) => `${count} z ${total}`,
  festivalCount: (count: number) => `${count} festiwal${count === 1 ? '' : count < 5 ? 'e' : 'i'}`,
  dayCount: (count: number) => `${count} ${count === 1 ? 'dzień' : count < 5 ? 'dni' : 'dni'}`,

  // Enhanced Search
  recentSearches: 'Ostatnie Wyszukiwania',
  popularDestinations: 'Popularne Miejsca',
  cities: 'Miasta',
  countries: 'Kraje',
  clearRecentSearches: 'Wyczyść',
};

export const translations: Record<SupportedLanguage, Translations> = {
  en: englishTranslations,
  de: germanTranslations,
  es: spanishTranslations,
  fr: frenchTranslations,
  pl: polishTranslations,
};

export const getTranslations = (language: SupportedLanguage): Translations => {
  return translations[language] || translations.en;
};