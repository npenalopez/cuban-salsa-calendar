import { useState, useMemo, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { FestivalCalendar } from "./components/FestivalCalendar";
import { SimpleFilters } from "./components/SimpleFilters";
import { PasswordProtection } from "./components/PasswordProtection";
import { MinimalArtistRankings } from "./components/MinimalArtistRankings";
import { SalsaLoadingAnimation } from "./components/SalsaLoadingAnimation";
import { LanguageSelector } from "./components/LanguageSelector";

import { HelpButton } from "./components/HelpPage";
import {
  FestivalGrowthAnnouncement,
  useFestivalGrowthAnnouncement,
} from "./components/FestivalGrowthAnnouncement";

// Lazy-loaded — only fetched when the user opens these screens
const EnhancedFestivalManagement = lazy(() =>
  import("./components/EnhancedFestivalManagement").then((m) => ({
    default: m.EnhancedFestivalManagement,
  })),
);
const HelpPageContent = lazy(() =>
  import("./components/HelpPageContent").then((m) => ({
    default: m.HelpPageContent,
  })),
);

import {
  LanguageProvider,
  useLanguage,
} from "./contexts/LanguageContext";

import {
  festivals as initialFestivals,
  type Festival,
} from "./data/festivals";
import {
  geolocationService,
  type UserLocation,
} from "./services/geolocation";
import { supabaseFestivalService } from "./services/supabase";
import {
  getPrimaryMonth,
  getFestivalSortPriority,
  isFestivalPast,
} from "./utils/dateUtils";
import { getFestivalVisibility } from "./utils/displayability";
import { normalizeFestivalMonths } from "./utils/festivalMonthNormalization";
import { safeOpenDetailsURL } from "./utils/calendarExport";
import {
  Settings,
  Trophy,
  Search,
  Music,
} from "lucide-react";
import { CubanFlagIcon } from "./components/CubanFlagIcon";
import { Toaster } from "./components/ui/sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
import { toast } from "sonner";

const HIDE_PAST_STORAGE_KEY = 'cuban-salsa-hide-past';

function AppContent() {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [hidePast, setHidePastState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(HIDE_PAST_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const setHidePast = (next: boolean) => {
    setHidePastState(next);
    try {
      localStorage.setItem(HIDE_PAST_STORAGE_KEY, next ? '1' : '0');
    } catch {
      /* ignore quota errors */
    }
  };
  const [showManagement, setShowManagement] = useState(false);
  const [showHelpPage, setShowHelpPage] = useState(false);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [managementLoading, setManagementLoading] =
    useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] =
    useState(false);
  const [userLocation, setUserLocation] =
    useState<UserLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  // Hidden admin mode (4 quick clicks on the title within 60s)
  const titleClickCountRef = useRef(0);
  const titleClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [adminModeEnabled, setAdminModeEnabled] = useState(false);

  // Get translations
  const { t } = useLanguage();

  // Festival growth announcement
  const { shouldShow: showGrowthAnnouncement, handleClose: closeGrowthAnnouncement } = useFestivalGrowthAnnouncement();

  // Handle festival updates from management interface
  const handleFestivalUpdate = (
    updatedFestivals: Festival[],
  ) => {
    try {
      setFestivals(updatedFestivals);
      toast.success("Festival changes saved successfully!", {
        duration: 2000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error updating festivals:", error);
      toast.error(
        "Couldn't save festival changes. Please check your connection and try again.",
      );
    }
  };

  // Handle opening management with password protection
  const handleOpenManagement = () => {
    setShowPasswordDialog(true);
  };

  // Handle opening management after successful authentication
  const handleManagementAccess = () => {
    setManagementLoading(true);
    setTimeout(() => {
      setShowManagement(true);
      setManagementLoading(false);
    }, 150);
  };

  // Handle closing management with cleanup
  const handleCloseManagement = () => {
    setShowManagement(false);
    setTimeout(() => {
      toast.success("Returned to your festival calendar", {
        duration: 2000,
        position: "bottom-right",
      });
    }, 100);
  };

  // Handle single festival update from quick edit
  const handleSingleFestivalUpdate = async (
    updatedFestival: Festival,
  ) => {
    try {
      await supabaseFestivalService.updateFestival(
        updatedFestival,
      );

      const updatedFestivals = festivals.map((festival) =>
        festival.id === updatedFestival.id
          ? updatedFestival
          : festival,
      );
      setFestivals(updatedFestivals);

      toast.success("Festival details updated successfully!", {
        duration: 2000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error updating festival:", error);
      toast.error(
        "Couldn't update festival. Please check your connection and try again.",
      );
    }
  };

  // Handle hidden admin mode activation
  const handleTitleClick = useCallback(() => {
    titleClickCountRef.current += 1;

    if (titleClickTimerRef.current) {
      clearTimeout(titleClickTimerRef.current);
    }
    titleClickTimerRef.current = setTimeout(() => {
      titleClickCountRef.current = 0;
      titleClickTimerRef.current = null;
    }, 60000);

    if (titleClickCountRef.current >= 4) {
      titleClickCountRef.current = 0;
      if (titleClickTimerRef.current) {
        clearTimeout(titleClickTimerRef.current);
        titleClickTimerRef.current = null;
      }
      setAdminModeEnabled(true);
      toast.success(
        "Admin mode activated! Management controls are now available.",
        { duration: 3000, position: "bottom-right" },
      );
    }
  }, []);

  // Handle showing help page
  const handleShowHelp = () => {
    setShowHelpPage(true);
  };

  // Handle returning to calendar from help page
  const handleBackToCalendar = () => {
    setShowHelpPage(false);
  };

  // Handle Instagram link click
  const handleInstagramClick = () => {
    safeOpenDetailsURL('https://www.instagram.com/cubansalsacalendar', 'Visit Cuban Salsa Calendar Instagram page');
  };

  // Public-page filter. Required fields + parseable month are enforced by
  // getFestivalVisibility (shared with the admin so it can show WHY a
  // festival is hidden). Past festivals stay visible by default — the
  // SimpleFestivalCard renders a "PAST" ribbon — but the header toggle
  // lets visitors opt out.
  const isDisplayableFestival = (festival: Festival): boolean => {
    if (!getFestivalVisibility(festival).displayed) return false;
    if (hidePast && isFestivalPast(festival.dates)) return false;
    return true;
  };

  // Count of festivals that are actually displayable (have all required data)
  const displayableFestivalsCount = useMemo(() => {
    if (!Array.isArray(festivals) || festivals.length === 0) {
      return 0;
    }
    return festivals.filter(isDisplayableFestival).length;
  }, [festivals, hidePast]);

  const filteredFestivals = useMemo(() => {
    if (!Array.isArray(festivals) || festivals.length === 0) {
      return [];
    }

    const query = searchQuery.trim().toLowerCase();
    const hasQuery = query.length > 0;

    // Pre-compute the country set once instead of per-festival inside the filter loop
    const countrySet = hasQuery
      ? new Set(
          festivals
            .filter((f) => f && typeof f.country === "string")
            .map((f) => f.country.toLowerCase()),
        )
      : null;
    const exactCountry = countrySet?.has(query) ? query : null;
    const partialCountryMatch =
      !exactCountry && countrySet && query.length >= 3
        ? Array.from(countrySet).some((c) => c.includes(query))
        : false;

    const result = festivals.filter((festival) => {
      if (!isDisplayableFestival(festival)) return false;

      if (
        selectedMonth !== "All" &&
        getPrimaryMonth(festival.dates) !== selectedMonth
      ) {
        return false;
      }

      if (!hasQuery) return true;

      const country = festival.country.toLowerCase();
      if (exactCountry) return country === exactCountry;
      if (partialCountryMatch) return country.includes(query);

      if (festival.name?.toLowerCase().includes(query)) return true;
      if (festival.city?.toLowerCase().includes(query)) return true;
      if (country.includes(query)) return true;
      if (festival.continent?.toLowerCase().includes(query)) return true;

      return Array.isArray(festival.artists)
        ? festival.artists.some(
            (a) => typeof a === "string" && a.toLowerCase().includes(query),
          )
        : false;
    });

    return result.sort((a, b) => {
      const priorityA = getFestivalSortPriority(a.dates);
      const priorityB = getFestivalSortPriority(b.dates);
      if (priorityA !== priorityB) return priorityA - priorityB;
      return a.name.localeCompare(b.name);
    });
  }, [festivals, selectedMonth, searchQuery, hidePast]);

  const clearAllFilters = () => {
    setSelectedMonth("All");
    setSearchQuery("");
  };

  // Load festivals and user location on component mount
  useEffect(() => {
    const loadFestivals = async (): Promise<Festival[]> => {
      try {
        await supabaseFestivalService.initializeDatabase();
        supabaseFestivalService.enableRealSupabase();
        // Always run the seeder first — when running without Supabase env
        // vars, this hydrates localStorage from the in-code festival list
        // (and replaces stale caches when SEED_VERSION bumps).
        await supabaseFestivalService.seedDatabase(initialFestivals);
        const stored = await supabaseFestivalService.getAllFestivals();
        if (stored && stored.length > 0) return stored;
        return initialFestivals;
      } catch (error) {
        console.error("Failed to load festivals:", error);
        return initialFestivals;
      }
    };

    let cancelled = false;
    (async () => {
      const loaded = await loadFestivals();
      if (cancelled) return;
      setFestivals(normalizeFestivalMonths(loaded));
      setDataLoaded(true);

      try {
        const location = await geolocationService.getUserLocation();
        if (!cancelled) setUserLocation(location);
      } catch {
        // Location is optional; ignore failures
      } finally {
        if (!cancelled) setLocationLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "m"
      ) {
        event.preventDefault();
        if (showManagement) {
          handleCloseManagement();
        } else if (
          !managementLoading &&
          !showPasswordDialog &&
          adminModeEnabled
        ) {
          handleOpenManagement();
        }
      }

      if (event.key === "Escape" && showManagement) {
        event.preventDefault();
        handleCloseManagement();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () =>
      document.removeEventListener("keydown", handleKeyDown);
  }, [
    showManagement,
    managementLoading,
    showPasswordDialog,
    adminModeEnabled,
  ]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (titleClickTimerRef.current) {
        clearTimeout(titleClickTimerRef.current);
      }
    };
  }, []);

  const handlePasswordSuccess = () => {
    handleManagementAccess();
  };

  const handlePasswordClose = () => {
    setShowPasswordDialog(false);
  };

  if (showHelpPage) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-white">
          <Suspense fallback={<SalsaLoadingAnimation />}>
            <HelpPageContent onBackToCalendar={handleBackToCalendar} />
          </Suspense>
          <Toaster />
        </div>
      </TooltipProvider>
    );
  }

  if (showManagement) {
    return (
      <TooltipProvider>
        <Suspense fallback={<SalsaLoadingAnimation />}>
          <EnhancedFestivalManagement
            festivals={festivals}
            onUpdateFestivals={handleFestivalUpdate}
            onClose={handleCloseManagement}
          />
        </Suspense>
        <Toaster />
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 min-w-0">
                <CubanFlagIcon size={18} className="flex-shrink-0" />
                <h1
                  className="text-lg font-semibold cursor-pointer select-none truncate"
                  onClick={handleTitleClick}
                >
                  Cuban Salsa Calendar
                </h1>
              </div>

              <div className="flex items-center gap-1">
                <LanguageSelector />
                <HelpButton onShowHelp={handleShowHelp} />

                <MinimalArtistRankings
                  festivals={festivals}
                  triggerElement={
                    <button
                      className="h-8 w-8 bg-black hover:bg-gray-800 text-white flex items-center justify-center transition-colors"
                      aria-label={t.topArtists}
                    >
                      <Trophy className="h-3.5 w-3.5" />
                    </button>
                  }
                />

                {adminModeEnabled && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleOpenManagement}
                        disabled={managementLoading}
                        className="h-8 w-8 bg-black hover:bg-gray-800 text-white flex items-center justify-center transition-colors"
                        aria-label="Open festival management"
                      >
                        <Settings
                          className={`h-3.5 w-3.5 ${managementLoading ? "animate-spin" : ""}`}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t.manageFestivals}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>

            <div className="pb-2">
              <SimpleFilters
                searchQuery={searchQuery}
                selectedMonth={selectedMonth}
                onSearchChange={setSearchQuery}
                onMonthChange={setSelectedMonth}
                onClearAll={clearAllFilters}
                filteredCount={filteredFestivals.length}
                totalCount={displayableFestivalsCount}
                festivals={festivals}
                userLocation={userLocation}
                locationLoading={locationLoading}
                hidePast={hidePast}
                onTogglePast={setHidePast}
              />
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gray-50">
          {/* Contact Banner */}
          <div className="bg-gray-100 border-b border-gray-200 py-2">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
              <p className="text-sm text-gray-600">
                {t.foundMistake}{" "}
                <button
                  onClick={handleInstagramClick}
                  className="text-gray-900 font-medium hover:text-gray-700 underline transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  @cubansalsacalendar
                </button>
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="py-4 min-h-[70vh]">
              {filteredFestivals.length === 0 &&
                dataLoaded &&
                (selectedMonth !== "All" || searchQuery) && (
                  <div className="text-center py-8">
                    <div className="bg-white p-6 max-w-sm mx-auto border border-gray-200">
                      <div className="flex justify-center mb-3">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {t.noFestivalsFound}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {t.adjustFilters}
                      </p>
                      <button
                        onClick={clearAllFilters}
                        className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 text-sm transition-colors"
                      >
                        {t.showAll}
                      </button>
                    </div>
                  </div>
                )}

              {filteredFestivals.length > 0 && dataLoaded && (
                <FestivalCalendar
                  festivals={filteredFestivals}
                  userLocation={userLocation}
                  onUpdateFestival={handleSingleFestivalUpdate}
                  allFestivals={festivals}
                />
              )}

              {filteredFestivals.length === 0 &&
                dataLoaded &&
                selectedMonth === "All" &&
                !searchQuery && (
                  <div className="text-center py-12">
                    <div className="bg-white p-8 max-w-md mx-auto border border-gray-200">
                      <div className="flex justify-center mb-4">
                        <Music className="h-12 w-12 text-gray-400" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {t.welcome}
                      </h2>
                      <h3 className="font-semibold text-gray-700 mb-3">
                        {t.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                        {t.welcomeMessage}
                      </p>
                      {adminModeEnabled && (
                        <button
                          onClick={handleOpenManagement}
                          className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 text-sm transition-colors"
                        >
                          Add Your First Festival
                        </button>
                      )}
                    </div>
                  </div>
                )}

              {!dataLoaded && <SalsaLoadingAnimation />}
            </div>
          </div>
        </main>

        <footer className="bg-black text-gray-300 py-5 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CubanFlagIcon size={14} />
              <span className="text-sm">Cuban Salsa Calendar · {new Date().getFullYear()}</span>
            </div>
            <button
              onClick={handleInstagramClick}
              className="text-sm text-gray-400 hover:text-white transition-colors hover:underline"
            >
              {t.followInstagram}
            </button>
          </div>
        </footer>

        <PasswordProtection
          isOpen={showPasswordDialog}
          onClose={handlePasswordClose}
          onSuccess={handlePasswordSuccess}
          title="Administrator Access Required"
          description="Please enter the admin password to access festival management, editing, and export features. This helps protect your festival data from unauthorized changes."
        />

        <FestivalGrowthAnnouncement
          isOpen={showGrowthAnnouncement}
          onClose={closeGrowthAnnouncement}
        />

        <Toaster />
      </div>
    </TooltipProvider>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}