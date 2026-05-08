import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import {
  MapPin,
  CalendarPlus,
  Clock,
  Calendar,
  Car,
  Plane,
  Train,
  Instagram,
  Globe,
} from "lucide-react";
import { Festival } from "../data/festivals";
import {
  openCalendarEvent,
  safeOpenDetailsURL,
} from "../utils/calendarExport";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";
import { toast } from "sonner";
import {
  getEndDateFromString,
  getStartDateFromString,
  getFestivalYear,
  formatDateRange,
  getFestivalDuration,
  getFestivalDurationTextTranslated,
  isFestivalPast,
} from "../utils/dateUtils";
import {
  geolocationService,
  type UserLocation,
} from "../services/geolocation";
import { CountryFlagIcon } from "./CountryFlagIcon";
import { useLanguage } from "../contexts/LanguageContext";
import {
  formatFestivalPrice,
  getPriceDisplayClasses,
  formatFestivalArtists,
} from "../utils/priceUtils";

interface SimpleFestivalCardProps {
  festival: Festival;
  monthName?: string;
  userLocation?: UserLocation | null;
}

export function SimpleFestivalCard({
  festival,
  monthName,
  userLocation,
}: SimpleFestivalCardProps) {
  const { t, language } = useLanguage();
  const isPast = isFestivalPast(festival.dates);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  
  // Prefer the festival's Instagram handle when present; fall back to its
  // website. Returns null when neither is available so the button hides.
  const detailsLink = (() => {
    const handle = festival.instagram?.trim().replace(/^@/, "");
    if (handle) {
      return {
        kind: "instagram" as const,
        url: `https://www.instagram.com/${handle}`,
        label: "Instagram",
        ariaLabel: `Visit ${festival.name} Instagram`,
      };
    }
    const site = festival.website?.trim();
    if (site) {
      return {
        kind: "website" as const,
        url: site,
        label: t.website,
        ariaLabel: `Visit ${festival.name} website`,
      };
    }
    return null;
  })();

  const handleDetailsClick = () => {
    if (!detailsLink) return;
    safeOpenDetailsURL(detailsLink.url, detailsLink.ariaLabel);
  };

  const handleAddToCalendar = (
    festival: Festival,
    platform: "google" | "ics",
  ) => {
    console.log('Calendar button clicked for:', festival.name, 'with platform:', platform);
    
    // Close the modal after selection
    setCalendarModalOpen(false);
    
    try {
      // Validate festival data
      if (!festival || !festival.name || !festival.dates) {
        throw new Error('Invalid festival data for calendar export');
      }
      
      // Use the improved direct calendar opening approach
      openCalendarEvent(festival, language, platform);
      
      const platformName = platform === "ics" ? "Apple Calendar" : "Google Calendar";
      toast.success(
        `Opening ${platformName} for "${festival.name}"...`,
        {
          duration: 2000,
          position: "bottom-right",
        },
      );
    } catch (error) {
      console.error("Error adding to calendar:", error);
      
      // More detailed error message
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast.error(
        `Couldn't add "${festival.name}" to calendar: ${errorMsg}. Please try again.`,
        {
          duration: 4000,
          position: "bottom-right",
        },
      );
    }
  };

  const getDateInfo = () => {
    const startDate = getStartDateFromString(festival.dates);
    const endDate = getEndDateFromString(festival.dates);
    const year = getFestivalYear(festival.dates);

    const dayMatch = startDate?.match(/(\d+)/);
    const day = dayMatch ? dayMatch[1] : "?";
    const month = monthName
      ? monthName.slice(0, 3).toUpperCase()
      : "";

    // Calculate duration using the improved function
    const duration = getFestivalDuration(festival.dates, year);
    const durationText = getFestivalDurationTextTranslated(
      festival.dates,
      year,
      t,
    );

    // Format the exact dates for tooltip - avoid year duplication
    const formattedDateRange = formatDateRange(festival.dates);

    // Check if the formatted date range already contains a year
    const hasYearInRange = /\b(20\d{2})\b/.test(
      formattedDateRange,
    );

    return {
      day,
      month,
      year,
      startDate,
      endDate,
      duration,
      durationText,
      formattedDateRange,
      hasYearInRange,
      hasEndDate: endDate !== null && endDate !== startDate,
    };
  };

  const {
    day,
    month,
    year,
    duration,
    durationText,
  } = getDateInfo();

  // Get travel time if user location is available
  const travelTime = useMemo(() => {
    if (!userLocation || !festival.coordinates) {
      return null;
    }

    // Validate coordinates array
    if (
      !Array.isArray(festival.coordinates) ||
      festival.coordinates.length !== 2
    ) {
      console.warn(
        `Invalid coordinates for festival ${festival.name}:`,
        festival.coordinates,
      );
      return null;
    }

    // Validate coordinate values
    const [lat, lng] = festival.coordinates;
    if (typeof lat !== "number" || typeof lng !== "number") {
      console.warn(
        `Non-numeric coordinates for festival ${festival.name}:`,
        festival.coordinates,
      );
      return null;
    }

    // Validate coordinate ranges
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      console.warn(
        `Invalid coordinate range for festival ${festival.name}:`,
        festival.coordinates,
      );
      return null;
    }

    try {
      return geolocationService.getFormattedTravelTime(
        userLocation,
        festival.coordinates,
        festival.continent,
      );
    } catch (error) {
      console.warn(
        `Failed to calculate travel time for festival ${festival.name}:`,
        error,
      );
      return null;
    }
  }, [userLocation, festival.coordinates, festival.name]);

  return (
    <>
      <article
        id={`festival-card-${festival.id}`}
        className="bg-white border border-gray-200 p-4 sm:p-3 lg:p-3 hover:shadow-sm transition-shadow duration-200 h-full flex flex-col relative overflow-hidden"
        role="article"
        tabIndex={0}
        data-festival-id={festival.id}
        data-festival-name={festival.name}
      >
        {/* Past Event Ribbon */}
        {isPast && (
          <div className="absolute top-3 -right-10 bg-gray-600 text-white text-xs px-12 py-1 rotate-45 z-10 shadow-md">
            {t.pastEvent}
          </div>
        )}
        
        {/* Card Content - Flex to fill available space */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header Section */}
          <div className="flex items-start gap-2.5 mb-2.5 lg:gap-3 lg:mb-3">
            {/* Festival Header Info */}
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-gray-900 mb-1 leading-tight flex items-center gap-2"
                style={{ fontSize: "0.875em" }}
              >
                <CountryFlagIcon
                  country={festival.country}
                  size={14}
                />
                {festival.name}
              </h3>

              {/* Location & Continent */}
              <div
                className="flex items-center gap-1 mb-1 text-gray-600"
                style={{ fontSize: "0.875em" }}
              >
                <MapPin
                  className="h-3 w-3 shrink-0"
                  aria-hidden="true"
                />
                <span className="truncate">
                  {festival.city}, {festival.country}
                </span>
                <span
                  className="text-gray-400"
                  style={{ fontSize: "0.75em" }}
                >
                  •
                </span>
                <span
                  className="text-gray-500"
                  style={{ fontSize: "0.75em" }}
                >
                  {festival.continent}
                </span>
              </div>

              {/* Price & Duration Info */}
              <div className="flex items-center gap-2 mb-1.5 lg:gap-2.5 lg:mb-2">
                <div
                  className={getPriceDisplayClasses(
                    festival.price,
                  )}
                  style={{ fontSize: "0.75em" }}
                >
                  {formatFestivalPrice(festival.price, t)}
                </div>
                <div
                  className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded font-medium border border-gray-200"
                  style={{ fontSize: "0.75em" }}
                >
                  {durationText}
                </div>
              </div>

              {/* Travel Time Info */}
              {travelTime &&
                userLocation &&
                (() => {
                  try {
                    // Validate coordinates and user location before calculating
                    if (
                      !festival.coordinates ||
                      !Array.isArray(festival.coordinates) ||
                      festival.coordinates.length !== 2
                    ) {
                      return null;
                    }

                    if (
                      !userLocation.latitude ||
                      !userLocation.longitude
                    ) {
                      return null;
                    }

                    const fullTravelTime =
                      geolocationService.calculateTravelTime(
                        userLocation,
                        festival.coordinates,
                        festival.continent,
                      );

                    // Validate the calculated travel time result
                    if (
                      !fullTravelTime ||
                      typeof fullTravelTime !== "object"
                    ) {
                      return null;
                    }

                    const isMultiDay = duration > 1;

                    // Only show travel time if there's something to display
                    const hasFlying =
                      fullTravelTime?.flying &&
                      fullTravelTime.flying.duration;
                    const hasTrain =
                      fullTravelTime?.train &&
                      fullTravelTime.train.duration;
                    const showDriving =
                      fullTravelTime?.driving &&
                      fullTravelTime.driving.duration;

                    if (!hasFlying && !hasTrain && !showDriving) {
                      return null;
                    }

                    return (
                      <div
                        className="flex items-center gap-1 mb-1.5 text-gray-600"
                        style={{ fontSize: "0.875em" }}
                      >
                        <Clock
                          className="h-3 w-3 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="truncate">
                          {(() => {
                            if (hasFlying) {
                              return (
                                <span className="flex items-center gap-1">
                                  <Plane
                                    className="h-3 w-3"
                                    aria-hidden="true"
                                  />
                                  <span>
                                    {
                                      fullTravelTime.flying!
                                        .duration
                                    }
                                  </span>
                                  {showDriving && (
                                    <>
                                      <span className="text-gray-400">
                                        •
                                      </span>
                                      <Car
                                        className="h-3 w-3"
                                        aria-hidden="true"
                                      />
                                      <span>
                                        {
                                          fullTravelTime.driving!
                                            .duration
                                        }
                                      </span>
                                    </>
                                  )}
                                </span>
                              );
                            } else if (hasTrain && showDriving) {
                              return (
                                <span className="flex items-center gap-1">
                                  <Car
                                    className="h-3 w-3"
                                    aria-hidden="true"
                                  />
                                  <span>
                                    {
                                      fullTravelTime.driving!
                                        .duration
                                    }
                                  </span>
                                  <span className="text-gray-400">
                                    •
                                  </span>
                                  <Train
                                    className="h-3 w-3"
                                    aria-hidden="true"
                                  />
                                  <span>
                                    {
                                      fullTravelTime.train!
                                        .duration
                                    }
                                  </span>
                                </span>
                              );
                            } else if (showDriving) {
                              return (
                                <span className="flex items-center gap-1">
                                  <Car
                                    className="h-3 w-3"
                                    aria-hidden="true"
                                  />
                                  <span>
                                    {
                                      fullTravelTime.driving!
                                        .duration
                                    }
                                  </span>
                                </span>
                              );
                            } else if (hasTrain) {
                              return (
                                <span className="flex items-center gap-1">
                                  <Train
                                    className="h-3 w-3"
                                    aria-hidden="true"
                                  />
                                  <span>
                                    {
                                      fullTravelTime.train!
                                        .duration
                                    }
                                  </span>
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </span>
                      </div>
                    );
                  } catch (error) {
                    console.warn(
                      `Failed to render travel time for festival ${festival.name}:`,
                      error,
                    );
                    return null;
                  }
                })()}
            </div>

            {/* Date Badge */}
            <div
              className="bg-white text-gray-800 border border-gray-300 text-center flex flex-col items-center justify-center flex-shrink-0 px-1"
              style={{ width: "3em", height: "3.5em" }}
              aria-label={`${t.date}: ${day} ${month} ${year}`}
            >
              <div
                className="font-bold leading-none"
                style={{ fontSize: "1em" }}
                aria-hidden="true"
              >
                {day}
              </div>
              {month && (
                <div
                  className="leading-none"
                  style={{
                    fontSize: "0.75em",
                    marginTop: "0.25em",
                  }}
                  aria-hidden="true"
                >
                  {month.slice(0, 3)}
                </div>
              )}
              <div
                className="leading-none opacity-75"
                style={{
                  fontSize: "0.625em",
                  marginTop: "0.25em",
                }}
                aria-hidden="true"
              >
                {year}
              </div>
            </div>
          </div>

          {/* Artists Section - Mobile Optimized */}
          {(() => {
            const artistsInfo = formatFestivalArtists(
              festival.artists,
              t,
            );

            if (artistsInfo.isToBeAnnounced) {
              return (
                <div className="mb-1.5 lg:mb-2">
                  <div
                    className="text-yellow-700 bg-yellow-50 px-2 py-1 rounded border border-yellow-200 text-center"
                    style={{ fontSize: "0.75em" }}
                  >
                    {artistsInfo.displayText}
                  </div>
                </div>
              );
            }

            if (artistsInfo.count === 0) {
              return null;
            }

            return (
              <div className="mb-1.5 lg:mb-2">
                {/* Mobile: Show first artist name + count */}
                <div className="sm:hidden">
                  <div
                    className="flex items-center justify-between"
                    style={{ fontSize: "0.75em" }}
                  >
                    <span className="text-gray-700 font-medium truncate">
                      {artistsInfo.artists[0]}
                    </span>
                    {artistsInfo.count > 1 && (
                      <span
                        className="text-gray-500 ml-2 flex-shrink-0"
                        style={{ fontSize: "0.75em" }}
                      >
                        +{artistsInfo.count - 1} {t.more}
                      </span>
                    )}
                  </div>
                  {artistsInfo.count > 1 && (
                    <details className="mt-1">
                      <summary
                        className="text-gray-500 cursor-pointer hover:text-gray-700 list-none"
                        style={{ fontSize: "0.75em" }}
                      >
                        <span className="inline-flex items-center gap-1">
                          {t.viewAllArtists}
                          <svg
                            className="w-3 h-3 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </summary>
                      <div
                        className="mt-1 p-2 bg-gray-50 rounded space-y-0.5 border border-gray-200"
                        style={{ fontSize: "0.75em" }}
                      >
                        {artistsInfo.artists
                          .slice(1)
                          .map((artist, index) => (
                            <div
                              key={index}
                              className="text-gray-600"
                            >
                              {artist}
                            </div>
                          ))}
                      </div>
                    </details>
                  )}
                </div>

                {/* Desktop: Keep tooltip approach */}
                <div
                  className="hidden sm:flex items-center gap-1 text-gray-500"
                  style={{ fontSize: "0.75em" }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-help hover:text-gray-700">
                        <span>
                          {artistsInfo.count}{" "}
                          {artistsInfo.count > 1
                            ? t.artists
                            : t.artist}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="max-w-xs"
                    >
                      <div>
                        <p className="font-medium mb-1">
                          {t.featuredArtists}
                        </p>
                        <div
                          className="space-y-0.5"
                          style={{ fontSize: "0.875em" }}
                        >
                          {artistsInfo.artists
                            .slice(0, 5)
                            .map((artist, index) => (
                              <div key={index}>{artist}</div>
                            ))}
                          {artistsInfo.count > 5 && (
                            <div className="text-gray-400">
                              +{artistsInfo.count - 5} more...
                            </div>
                          )}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Action Buttons - Simplified */}
        <div
          className="mt-2 lg:mt-3"
          role="group"
          aria-label="Festival actions"
        >
          {/* Mobile: Stack buttons vertically */}
          <div className="sm:hidden flex flex-col gap-1.5">
            {detailsLink && (
              <Button
                onClick={handleDetailsClick}
                className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2 px-3 transition-colors flex items-center justify-center gap-1"
                style={{ fontSize: "0.875em" }}
                aria-label={detailsLink.ariaLabel}
                variant="default"
                size="sm"
              >
                {detailsLink.kind === "instagram" ? (
                  <Instagram className="w-3 h-3" aria-hidden="true" />
                ) : (
                  <Globe className="w-3 h-3" aria-hidden="true" />
                )}
                <span>{detailsLink.label}</span>
              </Button>
            )}

            <Button
              onClick={() => setCalendarModalOpen(true)}
              className="w-full bg-white hover:bg-gray-50 text-black font-medium py-2 px-3 transition-colors border border-black flex items-center justify-center gap-1"
              style={{ fontSize: "0.875em" }}
              aria-label={`Add ${festival.name} to calendar`}
              variant="outline"
              size="sm"
            >
              <CalendarPlus className="w-3 h-3" aria-hidden="true" />
              <span>{t.addToCalendar}</span>
            </Button>
          </div>

          {/* Desktop: Keep horizontal layout */}
          <div className="hidden sm:flex gap-1.5 lg:gap-1.5">
            {detailsLink && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleDetailsClick}
                    className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-1.5 px-2.5 lg:py-1 lg:px-2 transition-colors flex items-center justify-center gap-1"
                    style={{ fontSize: "0.675em" }}
                    aria-label={detailsLink.ariaLabel}
                    variant="default"
                    size="sm"
                  >
                    {detailsLink.kind === "instagram" ? (
                      <Instagram className="w-3 h-3" aria-hidden="true" />
                    ) : (
                      <Globe className="w-3 h-3" aria-hidden="true" />
                    )}
                    <span>{detailsLink.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{detailsLink.ariaLabel}</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setCalendarModalOpen(true)}
                  className="flex-1 bg-white hover:bg-gray-50 text-black font-medium py-1.5 px-2.5 lg:py-1 lg:px-2 transition-colors border border-black flex items-center justify-center gap-1"
                  style={{ fontSize: "0.675em" }}
                  aria-label={`Add ${festival.name} to calendar`}
                  variant="outline"
                  size="sm"
                >
                  <CalendarPlus className="w-3 h-3" aria-hidden="true" />
                  <span>{t.addToCalendar}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t.addToCalendar}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </article>

      {/* Calendar Selection Modal */}
      <Dialog open={calendarModalOpen} onOpenChange={setCalendarModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Calendar</DialogTitle>
            <DialogDescription>
              Select the calendar you want to add the event to.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <Button
              onClick={() => handleAddToCalendar(festival, "google")}
              className="w-full justify-start h-14"
              variant="outline"
            >
              <CalendarPlus className="w-5 h-5 mr-3" />
              Google Calendar
            </Button>
            <Button
              onClick={() => handleAddToCalendar(festival, "ics")}
              className="w-full justify-start h-14"
              variant="outline"
            >
              <Calendar className="w-5 h-5 mr-3" />
              Apple Calendar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}