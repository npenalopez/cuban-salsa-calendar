import { Festival } from '../data/festivals';
import { getFestivalDateRange, getFestivalYear } from './dateUtils';
import { formatFestivalPrice, formatFestivalArtists, areArtistsToBeAnnounced, isPriceSoldOut } from './priceUtils';
import { getTranslations } from '../translations/index';
import { DEFAULT_LANGUAGE } from './i18n';
import type { SupportedLanguage } from './i18n';

// Generate enhanced event description with proper formatting and translations
function generateEnhancedDescription(festival: Festival, t: any): string {
  const sections = [];
  
  // Basic festival information
  sections.push(`🎉 ${festival.name}`);
  sections.push(`📍 ${festival.city}, ${festival.country} (${festival.continent})`);
  
  // Add venue if available
  if (festival.venue) {
    sections.push(`🏢 ${t.venue || 'Venue'}: ${festival.venue}`);
  }
  
  // Add category if available
  if (festival.category) {
    sections.push(`🎵 ${t.category || 'Category'}: ${festival.category}`);
  }
  
  // Add festival description if available
  if (festival.description && festival.description.trim()) {
    sections.push('');
    sections.push(`📝 ${t.description || 'Description'}:`);
    sections.push(festival.description);
  }
  
  // Artists section with enhanced formatting
  const artistsInfo = formatFestivalArtists(festival.artists, t);
  if (!artistsInfo.isToBeAnnounced && artistsInfo.count > 0) {
    sections.push('');
    sections.push(`🎤 ${t.featuredArtists || 'Featured Artists'}:`);
    if (artistsInfo.count <= 5) {
      // Show all artists if 5 or fewer
      artistsInfo.artists.forEach(artist => {
        sections.push(`• ${artist}`);
      });
    } else {
      // Show first 5 + count of remaining
      artistsInfo.artists.slice(0, 5).forEach(artist => {
        sections.push(`• ${artist}`);
      });
      sections.push(`• ... ${t.and || 'and'} ${artistsInfo.count - 5} ${t.more || 'more'} ${artistsInfo.count - 5 === 1 ? t.artist : t.artists}`);
    }
  } else if (artistsInfo.isToBeAnnounced) {
    sections.push('');
    sections.push(`🎤 ${artistsInfo.displayText}`);
  }
  
  // Price information with enhanced formatting
  const formattedPrice = formatFestivalPrice(festival.price, t);
  if (isPriceSoldOut(festival.price)) {
    sections.push('');
    sections.push(`🚫 ${formattedPrice}`);
  } else if (formattedPrice !== (t.priceToBeAnnounced || 'Price to be announced')) {
    sections.push('');
    sections.push(`💰 ${t.price || 'Price'}: ${formattedPrice}`);
  } else {
    sections.push('');
    sections.push(`💰 ${formattedPrice}`);
  }
  
  // Website information
  if (festival.website) {
    sections.push('');
    sections.push(`🌐 ${t.website || 'Website'}: ${festival.website}`);
  }
  
  // Additional information and branding
  sections.push('');
  sections.push('✨ ' + (t.generatedByCalendar || 'Event details from Cuban Salsa Calendar'));
  sections.push('🕺💃 ' + (t.enjoyFestival || 'Enjoy the festival and dance the night away!'));
  
  return sections.join('\n');
}

// Generate ICS (iCalendar) format for calendar apps
export function generateICSFile(festival: Festival, language: SupportedLanguage = DEFAULT_LANGUAGE): string {
  // Parse the festival dates to extract start and end dates
  const { startDate, endDate } = parseFestivalDates(festival.dates);
  
  // Generate unique ID for the event
  const eventId = `festival-${festival.id}-${Date.now()}@cuban-salsa-calendar.com`;
  
  // Current timestamp in UTC format
  const now = new Date();
  const timestamp = formatDateForICS(now);
  
  // Get translations for the specified language
  const t = getTranslations(language);
  
  // Format event description with enhanced details
  const description = generateEnhancedDescription(festival, t);
  
  // Format location with venue if available
  const location = festival.venue 
    ? `${festival.venue}, ${festival.city}, ${festival.country}`
    : `${festival.city}, ${festival.country}`;
  
  // Create a more descriptive event title
  const eventTitle = `${festival.name} - ${t.festival || 'Festival'}`;
  
  // ICS file content
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cuban Salsa Calendar//Festival Event//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${eventId}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${escapeICSText(eventTitle)}`,
    `DESCRIPTION:${escapeICSText(description)}`,
    `LOCATION:${escapeICSText(location)}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'CATEGORIES:FESTIVAL,DANCE,SALSA,MUSIC',
    'BEGIN:VALARM',
    'TRIGGER:-P7D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeICSText(`${t.title || 'Cuban Calendar'}: ${festival.name} - 1 ${t.week || 'week'} ${t.to || 'to'} ${t.go || 'go'}!`)}`,
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeICSText(`${festival.name} - ${t.tomorrow || 'Tomorrow'}! ${t.getReady || 'Get ready to dance'}! 🕺💃`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  
  return icsContent;
}

// Parse festival dates string and return formatted dates for ICS
function parseFestivalDates(datesString: string): { startDate: string; endDate: string } {
  try {
    // Use the improved date parsing functions
    const year = getFestivalYear(datesString);
    const dateRange = getFestivalDateRange(datesString, year);
    
    // Validate that we got valid dates
    if (!dateRange.start || !dateRange.end) {
      throw new Error('Invalid date range returned from parsing');
    }
    
    // ICS end date should be the day after the actual end date (exclusive)
    const exclusiveEndDate = new Date(dateRange.end);
    exclusiveEndDate.setDate(exclusiveEndDate.getDate() + 1);
    
    return {
      startDate: formatDateForICS(dateRange.start),
      endDate: formatDateForICS(exclusiveEndDate)
    };
  } catch (error) {
    console.warn('Error parsing festival dates for calendar export:', datesString, error);
    
    // Better fallback: try to extract at least the month and year
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    
    // Try to extract year from the string
    const yearMatch = datesString.match(/\b(20\d{2})\b/);
    const extractedYear = yearMatch ? parseInt(yearMatch[1]) : currentYear;
    
    // Try to extract month
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                       'july', 'august', 'september', 'october', 'november', 'december'];
    const monthAbbrs = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                       'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    
    let fallbackMonth = 0; // Default to January
    
    for (let i = 0; i < monthNames.length; i++) {
      if (datesString.toLowerCase().includes(monthNames[i]) || 
          datesString.toLowerCase().includes(monthAbbrs[i])) {
        fallbackMonth = i;
        break;
      }
    }
    
    // Create fallback dates with extracted month and year
    const fallbackDate = new Date(extractedYear, fallbackMonth, 1);
    const fallbackEndDate = new Date(extractedYear, fallbackMonth, 3); // 3-day festival fallback
    
    console.log('Using fallback dates:', {
      original: datesString,
      fallbackStart: fallbackDate,
      fallbackEnd: fallbackEndDate
    });
    
    return {
      startDate: formatDateForICS(fallbackDate),
      endDate: formatDateForICS(fallbackEndDate)
    };
  }
}

// Convert month name to number
function getMonthNumber(monthName: string): number {
  const months = {
    'january': 1, 'jan': 1,
    'february': 2, 'feb': 2,
    'march': 3, 'mar': 3,
    'april': 4, 'apr': 4,
    'may': 5,
    'june': 6, 'jun': 6,
    'july': 7, 'jul': 7,
    'august': 8, 'aug': 8,
    'september': 9, 'sep': 9,
    'october': 10, 'oct': 10,
    'november': 11, 'nov': 11,
    'december': 12, 'dec': 12
  };
  
  return months[monthName.toLowerCase() as keyof typeof months] || 1;
}

// Format date for ICS format (YYYYMMDD)
function formatDateForICS(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}${month}${day}`;
}

// Escape special characters for ICS format
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '')
    .substring(0, 1000); // Increased length limit for better descriptions
}

// Open calendar confirmation dialog or download ICS file as fallback
export function openCalendarEvent(festival: Festival, language: SupportedLanguage = DEFAULT_LANGUAGE, preferredService?: 'google' | 'outlook' | 'yahoo' | 'ics'): void {
  console.log('=== openCalendarEvent called ===');
  console.log('Festival:', festival.name);
  console.log('Language:', language);
  console.log('Preferred service:', preferredService);
  console.log('Festival data:', { 
    id: festival.id,
    name: festival.name, 
    dates: festival.dates, 
    city: festival.city, 
    country: festival.country 
  });
  
  try {
    // Validate festival data
    if (!festival || !festival.name || !festival.dates) {
      console.error('Invalid festival data:', festival);
      throw new Error('Invalid festival data for calendar export');
    }

    // Check for restricted environment
    const isRestrictedEnvironment = detectRestrictedEnvironment();
    console.log('Restricted environment check:', isRestrictedEnvironment);

    // If ICS download is specifically requested, do that immediately
    if (preferredService === 'ics') {
      console.log('=== ICS download specifically requested ===');
      console.log('Calling downloadICSFile...');
      
      // In restricted environments, try web calendar first as it's more likely to work
      if (isRestrictedEnvironment) {
        console.log('Restricted environment detected, trying web calendar first');
        try {
          const calendarUrls = generateCalendarUrls(festival, language);
          const t = getTranslations(language);
          
          // Ask user which approach they prefer
          const useWebCalendar = window.confirm(
            `📱 Browser Compatibility Notice\n\nIt looks like you're using an in-app browser (like Instagram or Facebook) which may not support file downloads.\n\nWould you like to:\n✅ Yes - Open in web calendar (recommended)\n❌ No - Try download anyway`
          );
          
          if (useWebCalendar) {
            console.log('User chose web calendar option');
            safeOpenCalendarURL(calendarUrls.google, `Add "${festival.name}" to Google Calendar`);
            return;
          } else {
            console.log('User chose to try download anyway');
            // Continue with download attempt
          }
        } catch (urlError) {
          console.warn('Could not generate calendar URLs, proceeding with download:', urlError);
        }
      }
      
      downloadICSFile(festival, language);
      return;
    }
    
    const calendarUrls = generateCalendarUrls(festival, language);
    console.log('Generated calendar URLs:', calendarUrls);
    
    // If a specific service is preferred, use it
    if (preferredService) {
      const url = calendarUrls[preferredService];
      if (url) {
        console.log(`Opening ${preferredService} calendar with URL:`, url);
        safeOpenCalendarURL(url, `Please visit the calendar link to add "${festival.name}" to your ${preferredService} calendar`);
        return;
      } else {
        console.warn(`No URL generated for ${preferredService}, falling back to auto-detection`);
      }
    }
    
    // Try to detect user's preferred calendar service based on their system
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|mobile/i.test(userAgent);
    const isWindows = /windows/i.test(userAgent);
    const isMac = /mac|os x/i.test(userAgent);
    
    let preferredUrl: string | null = null;
    let serviceName = 'calendar';
    
    if (isMobile) {
      // On mobile, prefer native calendar integration
      if (/android/i.test(userAgent)) {
        preferredUrl = calendarUrls.google;
        serviceName = 'Google Calendar';
      } else if (/iphone|ipad|ipod/i.test(userAgent)) {
        // iOS Safari will handle calendar URLs natively
        preferredUrl = calendarUrls.google;
        serviceName = 'Google Calendar';
      }
    } else {
      // On desktop, prefer based on OS
      if (isWindows) {
        preferredUrl = calendarUrls.outlook;
        serviceName = 'Outlook Calendar';
      } else if (isMac) {
        preferredUrl = calendarUrls.google; // Google Calendar works well on all platforms
        serviceName = 'Google Calendar';
      } else {
        preferredUrl = calendarUrls.google; // Default to Google Calendar
        serviceName = 'Google Calendar';
      }
    }
    
    // Try to open preferred calendar service
    if (preferredUrl) {
      console.log(`Auto-selected ${serviceName} for festival:`, festival.name);
      safeOpenCalendarURL(preferredUrl, `Please visit the ${serviceName} link to add "${festival.name}" to your calendar`);
    } else {
      console.log('No suitable URL found, falling back to ICS download');
      // Fallback to ICS file download
      downloadICSFile(festival, language);
    }
  } catch (error) {
    console.error('Error in openCalendarEvent:', error);
    // Final fallback to ICS download
    try {
      downloadICSFile(festival, language);
    } catch (downloadError) {
      console.error('Even ICS download failed:', downloadError);
      // Show error to user
      if (typeof window !== 'undefined') {
        alert(`Sorry, we couldn't add "${festival.name}" to your calendar. Please try again later.`);
      }
    }
  }
}

// Download ICS file (now used as fallback)
export function downloadICSFile(festival: Festival, language: SupportedLanguage = DEFAULT_LANGUAGE): void {
  try {
    console.log('=== Starting ICS download for festival ===');
    console.log('Festival:', festival.name);
    console.log('Festival data:', { 
      name: festival.name, 
      dates: festival.dates, 
      city: festival.city, 
      country: festival.country 
    });
    
    // Check if we're in a restricted environment (Instagram, Facebook, etc.)
    const isRestrictedEnvironment = detectRestrictedEnvironment();
    console.log('Restricted environment detected:', isRestrictedEnvironment);
    
    const icsContent = generateICSFile(festival, language);
    
    if (!icsContent || icsContent.length < 100) {
      throw new Error('Generated ICS content appears to be invalid or too short');
    }
    
    console.log('Generated ICS content preview:');
    console.log(icsContent.substring(0, 300) + '...');
    console.log('Full ICS content length:', icsContent.length);
    
    const filename = `${festival.name.replace(/[^a-zA-Z0-9\s]/g, '_').replace(/\s+/g, '_')}_festival.ics`;
    console.log('ICS filename:', filename);
    
    // Check if we're in a browser environment
    if (typeof document === 'undefined' || typeof URL === 'undefined') {
      throw new Error('Browser environment not available for file download');
    }
    
    // Handle restricted environments (Instagram, Facebook in-app browsers)
    if (isRestrictedEnvironment) {
      console.log('Using restricted environment fallback method');
      handleRestrictedEnvironmentDownload(festival, icsContent, language);
      return;
    }
    
    // Create blob with proper MIME type and charset
    const blob = new Blob([icsContent], { 
      type: 'text/calendar;charset=utf-8' 
    });
    
    console.log('Created blob:', {
      size: blob.size,
      type: blob.type
    });
    
    // Try different download methods based on browser support
    
    // Method 1: Modern browsers with download attribute support
    if ('download' in document.createElement('a')) {
      const url = URL.createObjectURL(blob);
      console.log('Created blob URL:', url);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      // Add the link to the document
      document.body.appendChild(link);
      
      // Add a small delay to ensure the link is in the DOM
      setTimeout(() => {
        try {
          console.log('Triggering download click...');
          link.click();
          console.log('ICS download triggered successfully');
          
          // Clean up after a short delay
          setTimeout(() => {
            try {
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              console.log('Download cleanup completed');
            } catch (cleanupError) {
              console.warn('Error during cleanup:', cleanupError);
            }
          }, 1000);
          
        } catch (clickError) {
          console.error('Error triggering download click:', clickError);
          // Try alternative methods
          tryAlternativeDownloadMethods(blob, filename, festival, icsContent, language);
        }
      }, 50);
      
    } else {
      // Fallback for older browsers
      console.log('Download attribute not supported, trying alternative methods');
      tryAlternativeDownloadMethods(blob, filename, festival, icsContent, language);
    }
    
  } catch (error) {
    console.error('Error downloading ICS file:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : error);
    
    // Check if we're in a restricted environment for better error messaging
    const isRestrictedEnvironment = detectRestrictedEnvironment();
    const t = getTranslations(language);
    
    // Show error message to user with more helpful information
    if (typeof window !== 'undefined') {
      if (isRestrictedEnvironment) {
        // Special handling for Instagram/Facebook in-app browsers
        const restrictedMessage = `
📱 In-App Browser Limitation

It looks like you're using an in-app browser (Instagram, Facebook, etc.) which doesn't support file downloads.

For "${festival.name}", try one of these options:

1️⃣ Open in regular browser:
   Tap the "..." menu and select "Open in Browser" (Safari/Chrome)

2️⃣ Use web calendar:
   We can open Google Calendar instead

3️⃣ Copy event details:
   📅 ${festival.name}
   📍 ${festival.city}, ${festival.country}
   📅 ${festival.dates}
   ${festival.website ? `🌐 ${festival.website}` : ''}

Would you like to try opening Google Calendar?`;

        if (window.confirm(restrictedMessage)) {
          try {
            const calendarUrls = generateCalendarUrls(festival, language);
            safeOpenCalendarURL(calendarUrls.google, `Add "${festival.name}" to Google Calendar`);
            return; // Exit successfully after opening web calendar
          } catch (urlError) {
            console.error('Could not open web calendar:', urlError);
            showBasicCalendarInfo(festival, t);
          }
        } else {
          // User declined, show basic info
          showBasicCalendarInfo(festival, t);
        }
      } else {
        // Standard error handling for regular browsers
        try {
          const icsContent = generateICSFile(festival, language);
          
          if (window.confirm(`The calendar file couldn't be downloaded automatically. Would you like to see the calendar content so you can save it manually?`)) {
            showICSContentForCopying(festival, icsContent, t);
          }
        } catch (contentError) {
          console.error('Could not generate ICS content for manual fallback:', contentError);
          showBasicCalendarInfo(festival, t);
        }
      }
    }
    
    // Only re-throw for non-restricted environments
    if (!isRestrictedEnvironment) {
      throw error;
    }
  }
}

// Detect if we're in a restricted environment (Instagram, Facebook, etc.)
function detectRestrictedEnvironment(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Check for known restricted environments
  const restrictedPatterns = [
    'instagram',
    'fban/',        // Facebook Android
    'fbav/',        // Facebook iOS  
    'fbios/',       // Facebook iOS alternative
    'fb_iab/',      // Facebook In-App Browser
    'tiktok',       // TikTok in-app browser
    'snapchat',     // Snapchat in-app browser
    'twitter',      // Twitter in-app browser (X)
    'linkedin',     // LinkedIn in-app browser
    'micromessenger', // WeChat
    'line/',        // LINE app
  ];
  
  const isRestrictedUA = restrictedPatterns.some(pattern => 
    userAgent.includes(pattern)
  );
  
  // Additional check for embedded contexts
  const isEmbedded = window.location !== window.parent.location;
  
  // Check if we're in a limited JavaScript environment
  const hasLimitedCapabilities = !window.open || !window.URL || !document.createElement;
  
  return isRestrictedUA || isEmbedded || hasLimitedCapabilities;
}

// Handle download in restricted environments
function handleRestrictedEnvironmentDownload(
  festival: Festival, 
  icsContent: string, 
  language: SupportedLanguage
): void {
  const t = getTranslations(language);
  
  // Try to generate calendar URLs as an alternative
  try {
    const calendarUrls = generateCalendarUrls(festival, language);
    
    // Show user-friendly message with alternatives
    const message = `
📅 Calendar Download - ${festival.name}

Due to browser restrictions, we can't download the calendar file directly. Please try one of these alternatives:

1️⃣ Open in your regular browser:
   Copy this link and open it in Safari, Chrome, or Firefox
   
2️⃣ Use online calendar:
   Google Calendar: ${calendarUrls.google.substring(0, 100)}...
   
3️⃣ Copy calendar data manually:
   
Event: ${festival.name}
Location: ${festival.city}, ${festival.country}
Dates: ${festival.dates}
${festival.website ? `Website: ${festival.website}` : ''}

Would you like to see the full calendar data to copy?`;

    if (window.confirm(message)) {
      // Show full ICS content for manual copying
      showICSContentForCopying(festival, icsContent, t);
    } else {
      // Try to open Google Calendar as fallback
      try {
        safeOpenCalendarURL(calendarUrls.google, `Open ${festival.name} in Google Calendar`);
      } catch (error) {
        console.warn('Could not open calendar URL:', error);
        // Final fallback - show basic info
        showBasicCalendarInfo(festival, t);
      }
    }
    
  } catch (error) {
    console.error('Error in restricted environment handler:', error);
    // Ultimate fallback
    showBasicCalendarInfo(festival, t);
  }
}

// Show ICS content for manual copying
function showICSContentForCopying(festival: Festival, icsContent: string, t: any): void {
  // Truncate content for display in alert (most browsers have limits)
  const truncatedContent = icsContent.length > 1500 
    ? icsContent.substring(0, 1500) + '\n\n[Content truncated - this is a partial calendar file]'
    : icsContent;
    
  const instructions = `
📋 Calendar File Content for "${festival.name}"

Copy this text and save it as a .ics file:

${truncatedContent}

💡 Instructions:
1. Copy all the text above
2. Open a text editor (Notes, Notepad, etc.)
3. Paste the content
4. Save the file as "${festival.name.replace(/[^a-zA-Z0-9\s]/g, '_')}.ics"
5. Open the .ics file to add to your calendar

Or try opening this page in your regular browser (Safari, Chrome, Firefox) where downloads work better.`;

  // For longer content, try to use a prompt instead of alert
  if (window.prompt) {
    window.prompt('Copy this calendar content:', instructions);
  } else {
    alert(instructions);
  }
}

// Show basic calendar information as final fallback
function showBasicCalendarInfo(festival: Festival, t: any): void {
  const basicInfo = `
📅 ${festival.name}
📍 ${festival.city}, ${festival.country}
📅 ${festival.dates}
${festival.website ? `🌐 ${festival.website}` : ''}

💡 To add to your calendar:
1. Open your calendar app
2. Create a new event
3. Copy the information above
4. Set the dates: ${festival.dates}

For automatic calendar import, try opening this website in Safari, Chrome, or Firefox where downloads work better.`;

  alert(basicInfo);
}

// Helper function to try alternative download methods
function tryAlternativeDownloadMethods(
  blob: Blob, 
  filename: string, 
  festival: Festival, 
  icsContent: string, 
  language: SupportedLanguage
): void {
  console.log('Trying alternative download methods...');
  
  // Method 2: IE/Edge msSaveBlob
  if (window.navigator && (window.navigator as any).msSaveBlob) {
    console.log('Using msSaveBlob for download');
    try {
      (window.navigator as any).msSaveBlob(blob, filename);
      console.log('Download initiated via msSaveBlob');
      return;
    } catch (msError) {
      console.error('msSaveBlob failed:', msError);
    }
  }
  
  // Method 3: Create URL and try to open it
  try {
    const url = URL.createObjectURL(blob);
    console.log('Attempting to open blob URL directly:', url);
    
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      console.log('Opened blob URL in new window');
      // Clean up after a delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
        try {
          newWindow.close();
        } catch (e) {
          // Ignore close errors
        }
      }, 5000);
    } else {
      throw new Error('Could not open new window for download');
    }
  } catch (urlError) {
    console.error('Alternative download methods failed:', urlError);
    // Final fallback - use restricted environment handler
    console.log('Falling back to restricted environment handler');
    handleRestrictedEnvironmentDownload(festival, icsContent, language);
    throw urlError;
  }
}

// Generate calendar URLs for different platforms with enhanced descriptions
export function generateCalendarUrls(festival: Festival, language: SupportedLanguage = DEFAULT_LANGUAGE) {
  try {
    console.log('Generating calendar URLs for:', festival.name, 'with dates:', festival.dates);
    
    const { startDate, endDate } = parseFestivalDates(festival.dates);
    console.log('Parsed dates:', { startDate, endDate });
    
    // Convert to Date objects for URL generation
    const start = parseICSDate(startDate);
    const end = parseICSDate(endDate);
    
    console.log('Converted to Date objects:', { start, end });
    
    // Validate the dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid dates generated for calendar URLs');
    }
    
    // Get translations for the specified language
    const t = getTranslations(language);
    
    const title = encodeURIComponent(`${festival.name} - ${t.festival || 'Festival'}`);
    const location = encodeURIComponent(festival.venue 
      ? `${festival.venue}, ${festival.city}, ${festival.country}`
      : `${festival.city}, ${festival.country}`);
  
  // Create enhanced, URL-friendly descriptions for each service
  const createDescription = (format: 'google' | 'outlook' | 'yahoo') => {
    const sections = [];
    
    // Event title and location
    sections.push(`🎉 ${festival.name}`);
    sections.push(`📍 ${festival.city}, ${festival.country} (${festival.continent})`);
    
    if (festival.venue) {
      sections.push(`🏢 ${t.venue || 'Venue'}: ${festival.venue}`);
    }
    
    // Date information
    sections.push(`📅 ${festival.dates}`);
    
    // Artists section
    const artistsInfo = formatFestivalArtists(festival.artists, t);
    if (!artistsInfo.isToBeAnnounced && artistsInfo.count > 0) {
      if (artistsInfo.count <= 3) {
        sections.push(`🎤 ${t.featuredArtists || 'Featured Artists'}: ${artistsInfo.artists.join(', ')}`);
      } else {
        sections.push(`🎤 ${t.featuredArtists || 'Featured Artists'}: ${artistsInfo.artists.slice(0, 3).join(', ')} + ${artistsInfo.count - 3} ${t.more || 'more'}`);
      }
    } else if (artistsInfo.isToBeAnnounced) {
      sections.push(`🎤 ${artistsInfo.displayText}`);
    }
    
    // Price information
    const formattedPrice = formatFestivalPrice(festival.price, t);
    if (isPriceSoldOut(festival.price)) {
      sections.push(`🚫 ${formattedPrice}`);
    } else if (formattedPrice !== (t.priceToBeAnnounced || 'Price to be announced')) {
      sections.push(`💰 ${t.price || 'Price'}: ${formattedPrice}`);
    } else {
      sections.push(`💰 ${formattedPrice}`);
    }
    
    // Website
    if (festival.website) {
      sections.push(`🌐 ${t.website || 'Website'}: ${festival.website}`);
    }
    
    // Festival description if available
    if (festival.description && festival.description.trim()) {
      sections.push('');
      sections.push(festival.description);
    }
    
    sections.push('');
    sections.push(`✨ ${t.generatedByCalendar || 'Event details from Cuban Salsa Calendar'}`);
    sections.push(`🕺💃 ${t.enjoyFestival || 'Enjoy the festival and dance the night away!'}`);
    
    // Different line break formats for different services
    const separator = format === 'google' ? '%0A' : (format === 'outlook' ? '%0D%0A' : '\n');
    return encodeURIComponent(sections.join(separator));
  };
  
  // Generate Google Calendar URL with enhanced parameters
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDateForGoogle(start)}/${formatDateForGoogle(end)}&location=${location}&details=${createDescription('google')}&ctz=${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
  
  // Generate Outlook URL with enhanced parameters
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${start.toISOString()}&enddt=${end.toISOString()}&location=${location}&body=${createDescription('outlook')}&allday=false&uid=${festival.id}`;
  
  // Generate Yahoo Calendar URL
  const yahooUrl = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${title}&st=${formatDateForGoogle(start)}&et=${formatDateForGoogle(end)}&loc=${location}&desc=${createDescription('yahoo')}`;
  
  // Generate Apple Calendar URL (webcal protocol for better iOS integration)
  const appleUrl = generateWebCalUrl(festival, language);
  
  const urls = {
    google: googleUrl,
    outlook: outlookUrl,
    yahoo: yahooUrl,
    apple: appleUrl,
    // Add a generic calendar URL that tries to use the system default
    generic: googleUrl // Fallback to Google Calendar as it's most widely supported
  };
  
  console.log('Generated calendar URLs:', urls);
  return urls;
  
  } catch (error) {
    console.error('Error generating calendar URLs:', error);
    
    // Return basic fallback URLs that should work
    const fallbackTitle = encodeURIComponent(festival.name);
    const fallbackLocation = encodeURIComponent(`${festival.city}, ${festival.country}`);
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    const fallbackGoogleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${fallbackTitle}&location=${fallbackLocation}`;
    
    return {
      google: fallbackGoogleUrl,
      outlook: fallbackGoogleUrl,
      yahoo: fallbackGoogleUrl,
      apple: fallbackGoogleUrl,
      generic: fallbackGoogleUrl
    };
  }
}

// Generate webcal URL for Apple Calendar and other calendar apps
function generateWebCalUrl(festival: Festival, language: SupportedLanguage = DEFAULT_LANGUAGE): string {
  // For now, return a Google Calendar URL as it works well with most systems
  // In a production environment, you might want to generate a proper webcal:// URL
  // pointing to your own calendar service endpoint
  
  // Generate the Google Calendar URL directly to avoid circular dependency
  const { startDate, endDate } = parseFestivalDates(festival.dates);
  const start = parseICSDate(startDate);
  const end = parseICSDate(endDate);
  const t = getTranslations(language);
  
  const title = encodeURIComponent(`${festival.name} - ${t.festival || 'Festival'}`);
  const location = encodeURIComponent(festival.venue 
    ? `${festival.venue}, ${festival.city}, ${festival.country}`
    : `${festival.city}, ${festival.country}`);
  
  // Create a simple description for Apple Calendar
  const description = encodeURIComponent([
    `🎉 ${festival.name}`,
    `📍 ${festival.city}, ${festival.country}`,
    `✨ ${t.generatedByCalendar || 'Event details from Cuban Salsa Calendar'}`
  ].join('%0A'));
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDateForGoogle(start)}/${formatDateForGoogle(end)}&location=${location}&details=${description}&ctz=${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
}

// Parse ICS date format back to Date object
function parseICSDate(icsDate: string): Date {
  const year = parseInt(icsDate.substring(0, 4));
  const month = parseInt(icsDate.substring(4, 6)) - 1;
  const day = parseInt(icsDate.substring(6, 8));
  
  return new Date(year, month, day);
}

// Format date for Google Calendar (YYYYMMDDTHHMMSSZ)
function formatDateForGoogle(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

// Safe URL opening that works in mobile browsers and in-app browsers
export function safeOpenURL(url: string, fallbackMessage?: string): void {
  console.log('Attempting to open URL:', url);
  
  try {
    // Validate the URL
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }
    
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('Window object not available');
    }
    
    // Check if we're in a restricted environment (like Instagram in-app browser)
    const isRestrictedEnvironment = (
      window.navigator.userAgent.includes('Instagram') ||
      window.navigator.userAgent.includes('FBAN') ||
      window.navigator.userAgent.includes('FBAV') ||
      // Additional checks for other in-app browsers
      window.location !== window.parent.location
    );

    console.log('Restricted environment detected:', isRestrictedEnvironment);

    if (isRestrictedEnvironment) {
      // In restricted environments, try to navigate in the same window
      console.log('Opening URL in same window due to restricted environment');
      window.location.href = url;
      return;
    }

    // For normal browsers, try to open in new tab but with fallback
    console.log('Attempting to open URL in new tab');
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    
    // If popup was blocked or failed
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      console.log('Popup blocked or failed, falling back to same window navigation');
      // Fallback to same window navigation
      window.location.href = url;
    } else {
      console.log('Successfully opened URL in new tab');
    }
  } catch (error) {
    console.error('Error opening URL:', error);
    
    // Final fallback - try to navigate in same window
    if (typeof window !== 'undefined') {
      try {
        console.log('Attempting final fallback to same window navigation');
        window.location.href = url;
      } catch (fallbackError) {
        console.error('Failed to open URL even with fallback:', fallbackError);
        
        // Show user-friendly error message
        const errorMessage = fallbackMessage ||
          `We couldn't automatically open the calendar link. Please copy and paste this URL into your browser: ${url}`;

        alert(errorMessage);
      }
    } else {
      console.error('Window object not available for URL opening');
    }
  }
}

// Safe details URL opening that always tries to preserve the current tab
export function safeOpenDetailsURL(url: string, fallbackMessage?: string): void {
  console.log('Attempting to open details URL:', url);
  
  try {
    // Validate the URL
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }
    
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('Window object not available');
    }
    
    // For details URLs, we want to be aggressive about opening in new tabs
    // and avoiding replacing the current tab
    console.log('Attempting to open details URL in new tab');
    
    // Try standard window.open - this works in most browsers
    try {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      // Check if window.open succeeded
      // Note: We can't reliably check newWindow.closed immediately after opening
      // So we just check if we got a window reference
      if (newWindow) {
        console.log('Successfully opened details URL in new tab');
        return;
      }
      
      console.log('window.open returned null, trying fallback');
    } catch (e) {
      console.warn('Standard window.open failed:', e);
    }
    
    // Fallback: Create a temporary link and click it
    try {
      console.log('Using temporary link method for details URL');
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Click the link
      link.click();
      
      // Clean up
      setTimeout(() => {
        try {
          document.body.removeChild(link);
        } catch (cleanupError) {
          console.warn('Error cleaning up temporary link:', cleanupError);
        }
      }, 100);
      
      console.log('Successfully triggered details URL via temporary link');
      return;
    } catch (linkError) {
      console.warn('Temporary link method failed:', linkError);
    }
    
    // If all new tab methods failed, show a user-friendly message instead of replacing current tab
    const detailsMessage = fallbackMessage || 
      `Please click the link to open festival details in a new tab: ${url}`;
    
    // Create a better fallback experience
    if (window.confirm(`Would you like to open the festival details in a new tab?\n\n${detailsMessage}`)) {
      // One final attempt with user permission
      try {
        window.open(url, '_blank');
      } catch (finalError) {
        window.prompt('Please copy this festival details URL and paste it in a new tab:', url);
      }
    }
    
  } catch (error) {
    console.error('Error opening details URL:', error);
    
    // Show user-friendly error message without replacing current tab
    const errorMessage = fallbackMessage ||
      `We couldn't automatically open the festival details. Please copy this URL and paste it in a new tab: ${url}`;

    alert(errorMessage);
  }
}

// Safe calendar URL opening that always tries to preserve the current tab
export function safeOpenCalendarURL(url: string, fallbackMessage?: string): void {
  console.log('Attempting to open calendar URL:', url);
  
  try {
    // Validate the URL
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }
    
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('Window object not available');
    }
    
    // For calendar URLs, we want to be more aggressive about opening in new tabs
    // and avoiding replacing the current tab
    console.log('Attempting to open calendar URL in new tab');
    
    // Try multiple methods to ensure new tab opening
    let newWindow: Window | null = null;
    
    // Method 1: Standard window.open
    try {
      newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn('Standard window.open failed:', e);
    }
    
    // Method 2: If standard method failed, try with additional parameters
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      try {
        newWindow = window.open(url, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      } catch (e) {
        console.warn('Second window.open attempt failed:', e);
      }
    }
    
    // Method 3: Create a temporary link and click it
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      try {
        console.log('Using temporary link method for calendar URL');
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // Use both click and dispatchEvent for better compatibility
        link.click();
        
        // Clean up
        setTimeout(() => {
          try {
            document.body.removeChild(link);
          } catch (cleanupError) {
            console.warn('Error cleaning up temporary link:', cleanupError);
          }
        }, 100);
        
        console.log('Successfully triggered calendar URL via temporary link');
        return;
      } catch (linkError) {
        console.warn('Temporary link method failed:', linkError);
      }
    } else {
      console.log('Successfully opened calendar URL in new tab');
      return;
    }
    
    // If all new tab methods failed, show a user-friendly message instead of replacing current tab
    const calendarMessage = fallbackMessage || 
      `Please click the link to open in a new tab: ${url}`;
    
    // Create a better fallback experience
    if (window.confirm(`Would you like to open the calendar in a new tab?\n\n${calendarMessage}`)) {
      // One final attempt with user permission
      try {
        window.open(url, '_blank');
      } catch (finalError) {
        window.prompt('Please copy this calendar URL and paste it in a new tab:', url);
      }
    }
    
  } catch (error) {
    console.error('Error opening calendar URL:', error);
    
    // Show user-friendly error message without replacing current tab
    const errorMessage = fallbackMessage ||
      `We couldn't automatically open the calendar. Please copy this URL and paste it in a new tab: ${url}`;

    alert(errorMessage);
  }
}