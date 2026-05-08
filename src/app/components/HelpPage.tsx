import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Share2,
  Settings,
  Trophy,
  Download,
  Clock,
  Car,
  Plane,
  Train,
  ExternalLink,
  CalendarPlus,
  ChevronDown,
  Globe,
  Languages,
  HelpCircle,
  Eye,
  Users,
  DollarSign,
  Flag,
  X,
  Music,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { CubanFlagIcon } from "./CubanFlagIcon";
import { CountryFlagIcon } from "./CountryFlagIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface HelpPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpPage({ isOpen, onClose }: HelpPageProps) {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] =
    useState("overview");

  const sections = [
    {
      id: "overview",
      title: "Overview",
      icon: <Eye className="w-4 h-4" />,
    },
    {
      id: "festival-anatomy",
      title: "Festival Card Anatomy",
      icon: <Music className="w-4 h-4" />,
    },
    {
      id: "search-filter",
      title: "Search & Filtering",
      icon: <Search className="w-4 h-4" />,
    },
    {
      id: "location-features",
      title: "Location Features",
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: "artist-rankings",
      title: "Artist Rankings",
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      id: "export-share",
      title: "Export & Share",
      icon: <Share2 className="w-4 h-4" />,
    },
    {
      id: "languages",
      title: "Languages & Currency",
      icon: <Languages className="w-4 h-4" />,
    },
    {
      id: "management",
      title: "Management Features",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CubanFlagIcon size={24} />
              <DialogTitle className="text-2xl font-semibold">
                Cuban Salsa Calendar - Help Guide
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex h-[calc(95vh-120px)]">
          {/* Sidebar Navigation */}
          <div className="w-80 border-r border-gray-200 p-6 overflow-y-auto">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? "bg-black text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {section.icon}
                  <span className="text-sm font-medium">
                    {section.title}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeSection === "overview" && (
              <OverviewSection />
            )}
            {activeSection === "festival-anatomy" && (
              <FestivalAnatomySection />
            )}
            {activeSection === "search-filter" && (
              <SearchFilterSection />
            )}
            {activeSection === "location-features" && (
              <LocationFeaturesSection />
            )}
            {activeSection === "artist-rankings" && (
              <ArtistRankingsSection />
            )}
            {activeSection === "export-share" && (
              <ExportShareSection />
            )}
            {activeSection === "languages" && (
              <LanguagesSection />
            )}
            {activeSection === "management" && (
              <ManagementSection />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function OverviewSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Welcome to Cuban Salsa Calendar
        </h2>
        <p className="text-gray-600 mb-6">
          Your comprehensive guide to salsa festivals around the
          world. Discover, plan, and never miss a salsa event
          again.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="w-5 h-5" />
              Smart Discovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Find festivals by location, month, artist, or
              search terms. Our intelligent search understands
              country names and prioritizes relevant results.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5" />
              Location Aware
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Get travel time estimates and distances from your
              location. See driving, flying, and train options
              when available.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="w-5 h-5" />
              Artist Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Discover which artists are performing at the most
              festivals and track your favorite instructors
              across events.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="w-5 h-5" />
              Global Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Available in 6 languages with automatic currency
              conversion. Designed mobile-first for worldwide
              accessibility.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Quick Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            • Click on month names to filter by specific months
          </li>
          <li>
            • Use the search bar to find festivals by country,
            city, or artist
          </li>
          <li>
            • Enable location services for travel time estimates
          </li>
          <li>
            • Export events directly to your calendar apps
          </li>
          <li>
            • Switch languages using the flag icon in the top
            right
          </li>
        </ul>
      </div>
    </div>
  );
}

function FestivalAnatomySection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Festival Card Anatomy
        </h2>
        <p className="text-gray-600 mb-6">
          Understanding every element of a festival card helps
          you quickly find the information you need.
        </p>
      </div>

      {/* Mock Festival Card with Annotations */}
      <div className="relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
        {/* Header Section */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1 leading-tight flex items-center gap-2">
              <CountryFlagIcon country="Spain" size={14} />
              Barcelona Salsa Congress
              <div className="absolute -right-2 -top-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                1. Festival Name & Country
              </div>
            </h3>

            <div className="flex items-center gap-1 mb-1 text-gray-600 relative">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">Barcelona, Spain</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">Europe</span>
              <div className="absolute -left-8 top-6 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10">
                2. Location Info
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2 relative">
              <div className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium border border-gray-200">
                €150
              </div>
              <div className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded font-medium border border-gray-200">
                3 days
              </div>
              <div className="absolute -left-8 top-8 bg-green-500 text-white text-xs px-2 py-1 rounded-full z-10">
                3. Price & Duration
              </div>
            </div>

            <div className="flex items-center gap-1 mb-2 text-gray-600 relative">
              <Clock className="h-3 w-3 shrink-0" />
              <Plane className="h-3 w-3" />
              <span>2h 15m</span>
              <span className="text-gray-400">•</span>
              <Car className="h-3 w-3" />
              <span>12h 30m</span>
              <div className="absolute -left-8 top-6 bg-purple-500 text-white text-xs px-2 py-1 rounded-full z-10">
                4. Travel Times
              </div>
            </div>
          </div>

          <div
            className="bg-white text-gray-800 border border-gray-300 rounded text-center flex flex-col items-center justify-center flex-shrink-0 px-1 relative"
            style={{ width: "3em", height: "3.5em" }}
          >
            <div className="font-bold leading-none">15</div>
            <div
              className="leading-none"
              style={{
                fontSize: "0.75em",
                marginTop: "0.25em",
              }}
            >
              MAR
            </div>
            <div
              className="leading-none opacity-75"
              style={{
                fontSize: "0.625em",
                marginTop: "0.25em",
              }}
            >
              2024
            </div>
            <div className="absolute -right-8 -top-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full z-10">
              5. Date Badge
            </div>
          </div>
        </div>

        {/* Artists Section */}
        <div className="mb-3 relative">
          <div className="flex items-center gap-1 text-gray-500">
            <span>5 artists</span>
          </div>
          <div className="absolute -left-8 top-6 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full z-10">
            6. Artist Count
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 relative">
          <Button
            className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-1.5 px-2.5 rounded transition-colors flex items-center justify-center gap-1"
            size="sm"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Details</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-white hover:bg-gray-50 text-black border border-black font-medium py-1.5 px-2.5 rounded transition-colors flex items-center justify-center gap-1"
          >
            <CalendarPlus className="w-3 h-3" />
            <span>Save</span>
            <ChevronDown className="w-2 h-2" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 text-black border border-black font-medium py-1.5 px-2.5 rounded transition-colors flex items-center justify-center gap-1"
          >
            <Share2 className="w-3 h-3" />
          </Button>
          <div className="absolute -bottom-8 left-0 bg-teal-500 text-white text-xs px-2 py-1 rounded-full z-10">
            7. Action Buttons
          </div>
        </div>
      </div>

      {/* Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                1
              </div>
              Festival Name & Country
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              The festival name with a country flag icon. Hover
              to see additional details in a tooltip.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                2
              </div>
              Location Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              City, country, and continent. Helps you understand
              the geographic scope and plan travel accordingly.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                3
              </div>
              Price & Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Festival cost (automatically converted to your
              local currency) and duration in days. Helps with
              budgeting and planning.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                4
              </div>
              Travel Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Estimated travel times from your location by
              plane, car, and train (when available). Requires
              location permission.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
                5
              </div>
              Date Badge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Festival start date with day, month, and year.
              Positioned for quick scanning and chronological
              sorting.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs">
                6
              </div>
              Artist Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Number of featured artists. Click to see the full
              list in a tooltip, or view detailed rankings in
              the Artist Rankings feature.
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs">
                7
              </div>
              Action Buttons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>Details:</strong> Opens the festival
                website or searches for more information
              </p>
              <p>
                <strong>Save:</strong> Export to Google
                Calendar, Outlook, Yahoo Calendar, or download
                as .ics file
              </p>
              <p>
                <strong>Share:</strong> Share festival details
                via native share menu or copy link to clipboard
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SearchFilterSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Search & Filtering
        </h2>
        <p className="text-gray-600 mb-6">
          Powerful search and filtering capabilities help you
          find exactly the festivals you're looking for.
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        defaultValue="search"
      >
        <AccordionItem value="search">
          <AccordionTrigger className="text-left">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Smart Search
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">
                Search Features:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • <strong>Country Intelligence:</strong> Type
                  a country name to see only festivals from that
                  country
                </li>
                <li>
                  • <strong>City Search:</strong> Find festivals
                  in specific cities
                </li>
                <li>
                  • <strong>Artist Search:</strong> Search by
                  instructor or performer names
                </li>
                <li>
                  • <strong>Festival Names:</strong> Search by
                  festival title
                </li>
                <li>
                  • <strong>Continent Filter:</strong> Broad
                  geographic filtering
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 p-3 rounded-lg">
                <h5 className="font-medium mb-2">
                  Search Examples:
                </h5>
                <div className="space-y-1 text-sm">
                  <Badge variant="outline">
                    "Spain" - All Spanish festivals
                  </Badge>
                  <Badge variant="outline">
                    "Barcelona" - Festivals in Barcelona
                  </Badge>
                  <Badge variant="outline">
                    "Frankie Martinez" - Events with this artist
                  </Badge>
                </div>
              </div>
              <div className="border border-gray-200 p-3 rounded-lg">
                <h5 className="font-medium mb-2">
                  Search Tips:
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Search is case-insensitive</li>
                  <li>• Partial matches work</li>
                  <li>• Clear search to see all results</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="month-filter">
          <AccordionTrigger className="text-left">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Month Filtering
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <p className="text-gray-600">
              Filter festivals by month to help with travel
              planning and seasonal preferences.
            </p>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].map((month) => (
                <Button
                  key={month}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {month}
                </Button>
              ))}
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">
                Month Filter Tips:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click "All" to remove month filtering</li>
                <li>
                  • Festival dates are based on start date
                </li>
                <li>
                  • Multi-day festivals appear in their start
                  month
                </li>
                <li>
                  • Use with search for powerful combinations
                </li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="results">
          <AccordionTrigger className="text-left">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Understanding Results
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Result Sorting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Upcoming festivals appear first</li>
                    <li>• Past festivals appear last</li>
                    <li>• Alphabetical within time groups</li>
                    <li>
                      • Consistent ordering for easy browsing
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Result Counter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">
                    The result counter shows filtered vs. total
                    festivals:
                  </p>
                  <Badge variant="outline" className="text-xs">
                    "25 of 150 festivals"
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">No Results?</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Try broadening your search terms</li>
                <li>• Check spelling of country/city names</li>
                <li>
                  • Remove month filter to see year-round
                  options
                </li>
                <li>
                  • Use the "Show All" button to reset filters
                </li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function LocationFeaturesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Location-Aware Features
        </h2>
        <p className="text-gray-600 mb-6">
          Enable location services to unlock personalized travel
          information and distance-based insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5" />
              Travel Time Estimates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              See estimated travel times from your location to
              each festival venue.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Plane className="w-4 h-4 text-blue-500" />
                <span>
                  <strong>Flying:</strong> Direct flight time
                  estimates
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Car className="w-4 h-4 text-green-500" />
                <span>
                  <strong>Driving:</strong> Road trip duration
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Train className="w-4 h-4 text-purple-500" />
                <span>
                  <strong>Train:</strong> Rail travel options
                  (when available)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5" />
              Distance Calculations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Intelligent distance calculations based on
              continent and geographic proximity.
            </p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h5 className="font-medium mb-2 text-sm">
                Calculation Logic:
              </h5>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Same continent: All travel modes</li>
                <li>
                  • Different continents: Flying preferred
                </li>
                <li>• Island nations: Smart routing</li>
                <li>• Remote locations: Adjusted estimates</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Location Setup & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="enable">
              <AccordionTrigger className="text-left">
                How to Enable Location Services
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-medium">
                      Desktop Browsers:
                    </h5>
                    <ol className="text-sm text-gray-600 space-y-1">
                      <li>
                        1. Click the location icon in your
                        address bar
                      </li>
                      <li>2. Select "Allow" when prompted</li>
                      <li>3. Refresh the page if needed</li>
                    </ol>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium">
                      Mobile Browsers:
                    </h5>
                    <ol className="text-sm text-gray-600 space-y-1">
                      <li>1. Tap "Allow" when prompted</li>
                      <li>
                        2. Check browser settings if blocked
                      </li>
                      <li>
                        3. Enable location for your browser app
                      </li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="privacy">
              <AccordionTrigger className="text-left">
                Privacy & Data Handling
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-medium mb-2 text-green-800">
                    Your Privacy is Protected:
                  </h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>
                      • Location is processed locally in your
                      browser
                    </li>
                    <li>
                      • No location data is stored on our
                      servers
                    </li>
                    <li>
                      • Calculations happen on your device
                    </li>
                    <li>
                      • You can disable location at any time
                    </li>
                    <li>
                      • Works completely offline for
                      calculations
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="troubleshooting">
              <AccordionTrigger className="text-left">
                Troubleshooting Location Issues
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="border border-gray-200 p-3 rounded-lg">
                    <h5 className="font-medium mb-2">
                      Common Issues:
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        • <strong>Blocked by browser:</strong>{" "}
                        Check site permissions
                      </li>
                      <li>
                        • <strong>Inaccurate location:</strong>{" "}
                        GPS may need time to calibrate
                      </li>
                      <li>
                        • <strong>No travel times:</strong>{" "}
                        Check that location permission is
                        granted
                      </li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 p-3 rounded-lg">
                    <h5 className="font-medium mb-2">
                      Still Not Working?
                    </h5>
                    <p className="text-sm text-gray-600">
                      The website works perfectly without
                      location services - you'll just miss out
                      on the personalized travel time estimates.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

function ArtistRankingsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Artist Rankings
        </h2>
        <p className="text-gray-600 mb-6">
          Discover which artists and instructors are performing
          at the most festivals worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="w-5 h-5" />
              How Rankings Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Artists are ranked by the number of festivals
              they're teaching at or performing in.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-gold rounded-full"></div>
                <span>
                  <strong>Gold:</strong> Most active artists
                  (top tier)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>
                  <strong>Silver:</strong> Very active artists
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                <span>
                  <strong>Bronze:</strong> Active artists
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5" />
              Using Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>
                • <strong>Find Your Favorites:</strong> See
                where your preferred instructors are teaching
              </li>
              <li>
                • <strong>Discover New Artists:</strong> Explore
                highly-ranked artists you haven't seen
              </li>
              <li>
                • <strong>Plan Festival Attendance:</strong>{" "}
                Choose events based on instructor lineup
              </li>
              <li>
                • <strong>Track Trends:</strong> See which
                artists are most in-demand globally
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accessing Artist Rankings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">
              Where to Find Rankings:
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Trophy className="w-4 h-4" />
              <span>
                Click the trophy icon in the top-right corner of
                the page
              </span>
            </div>
            <p className="text-sm text-gray-600">
              The rankings are updated in real-time as festivals
              are added or modified.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 p-3 rounded-lg">
              <h5 className="font-medium mb-2">
                Ranking Features:
              </h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time updates</li>
                <li>• Festival count per artist</li>
                <li>• Tier-based classification</li>
                <li>• Searchable artist list</li>
              </ul>
            </div>
            <div className="border border-gray-200 p-3 rounded-lg">
              <h5 className="font-medium mb-2">Pro Tips:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • Look for artists in multiple festivals
                </li>
                <li>• Cross-reference with your interests</li>
                <li>
                  • Use rankings to discover new instructors
                </li>
                <li>• Check seasonal variations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExportShareSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Export & Share
        </h2>
        <p className="text-gray-600 mb-6">
          Never miss a festival by adding events to your
          calendar and sharing discoveries with friends.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarPlus className="w-5 h-5" />
              Calendar Export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Add festivals directly to your favorite calendar
              application.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>
                  <strong>Google Calendar:</strong> One-click
                  integration
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>
                  <strong>Outlook:</strong> Microsoft calendar
                  support
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span>
                  <strong>Yahoo Calendar:</strong> Direct
                  integration
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Download className="w-4 h-4 text-gray-500" />
                <span>
                  <strong>Download .ics:</strong> Universal
                  calendar file
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Share2 className="w-5 h-5" />
              Sharing Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Share festival information with your dance
              community.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Share2 className="w-4 h-4 text-green-500" />
                <span>
                  <strong>Native Share:</strong> Use your
                  device's share menu
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>
                  <strong>Copy Link:</strong> Get a shareable
                  URL
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Flag className="w-4 h-4 text-red-500" />
                <span>
                  <strong>Full Site Share:</strong> Share the
                  entire calendar
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="calendar-export">
          <AccordionTrigger className="text-left">
            Calendar Export Details
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">
                What Gets Exported:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Festival name and location</li>
                <li>• Start and end dates</li>
                <li>• Website link (if available)</li>
                <li>• Brief description with pricing</li>
                <li>• Time zone information</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 p-3 rounded-lg">
                <h5 className="font-medium mb-2">
                  Platform-Specific Features:
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • <strong>Google:</strong> Automatic
                    reminders
                  </li>
                  <li>
                    • <strong>Outlook:</strong> Meeting format
                  </li>
                  <li>
                    • <strong>Yahoo:</strong> Event categories
                  </li>
                  <li>
                    • <strong>Apple:</strong> Location mapping
                  </li>
                </ul>
              </div>
              <div className="border border-gray-200 p-3 rounded-lg">
                <h5 className="font-medium mb-2">
                  Tips for Success:
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Allow pop-ups for calendar sites</li>
                  <li>• Check your timezone settings</li>
                  <li>• Review event details after import</li>
                  <li>• Set custom reminders as needed</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sharing">
          <AccordionTrigger className="text-left">
            Sharing Options
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Individual Festival Sharing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">
                    Share specific festivals:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>
                      • Click share button on any festival card
                    </li>
                    <li>
                      • Includes festival details and dates
                    </li>
                    <li>
                      • Recipients see formatted information
                    </li>
                    <li>
                      • Works across all messaging platforms
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Full Calendar Sharing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">
                    Share the entire website:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Click share icon in header</li>
                    <li>• Shares complete festival listing</li>
                    <li>• Recipients can browse all events</li>
                    <li>• Great for community sharing</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-green-800">
                Sharing Best Practices:
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>
                  • Include personal recommendations when
                  sharing
                </li>
                <li>
                  • Mention why you're excited about specific
                  festivals
                </li>
                <li>
                  • Share early so friends can plan and book
                </li>
                <li>
                  • Consider creating group chats for festival
                  planning
                </li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function LanguagesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Languages & Currency
        </h2>
        <p className="text-gray-600 mb-6">
          Cuban Salsa Calendar supports 6 languages with
          automatic currency conversion for global
          accessibility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Languages className="w-5 h-5" />
              Supported Languages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-6 h-4 bg-red-500 rounded-sm flex items-center justify-center text-white text-xs">
                  EN
                </span>
                <span>English</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-6 h-4 bg-yellow-500 rounded-sm flex items-center justify-center text-white text-xs">
                  ES
                </span>
                <span>Español</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-6 h-4 bg-blue-500 rounded-sm flex items-center justify-center text-white text-xs">
                  FR
                </span>
                <span>Français</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-6 h-4 bg-black rounded-sm flex items-center justify-center text-white text-xs">
                  DE
                </span>
                <span>Deutsch</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-6 h-4 bg-red-600 rounded-sm flex items-center justify-center text-white text-xs">
                  PL
                </span>
                <span>Polski</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-6 h-4 bg-blue-600 rounded-sm flex items-center justify-center text-white text-xs">
                  PT
                </span>
                <span>Português</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="w-5 h-5" />
              Currency Conversion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Prices are automatically converted to your local
              currency based on your browser settings.
            </p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h5 className="font-medium mb-2 text-sm">
                Supported Currencies:
              </h5>
              <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                <span>USD, EUR, GBP</span>
                <span>CAD, AUD, JPY</span>
                <span>CHF, SEK, NOK</span>
                <span>PLN, CZK, HUF</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to Change Language</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Languages className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-2">
                Using the Language Selector
              </h4>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>
                  1. Look for the flag icon in the top-right
                  corner
                </li>
                <li>2. Click to open the language dropdown</li>
                <li>3. Select your preferred language</li>
                <li>
                  4. The page will automatically reload with
                  your selection
                </li>
              </ol>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-medium">
                What Gets Translated:
              </h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Interface elements and buttons</li>
                <li>• Search placeholders and hints</li>
                <li>• Error messages and notifications</li>
                <li>• Help text and instructions</li>
                <li>• Calendar export options</li>
                <li>• Month names and date formats</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">
                What Stays Original:
              </h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Festival names</li>
                <li>• City and country names</li>
                <li>• Artist names</li>
                <li>• Website URLs</li>
                <li>• Currency symbols (but converted)</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-800">
              Language Tips:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • Your language preference is remembered for
                future visits
              </li>
              <li>
                • Currency conversion happens automatically
                based on your selection
              </li>
              <li>
                • Date formats adjust to local conventions
              </li>
              <li>
                • All features work identically across languages
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ManagementSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Management Features
        </h2>
        <p className="text-gray-600 mb-6">
          Administrative tools for managing the festival
          database (password protected).
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Settings className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800 mb-1">
              Administrative Access Required
            </h3>
            <p className="text-sm text-yellow-700">
              Management features are password-protected to
              maintain data integrity. Contact the administrator
              for access.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="w-5 h-5" />
              Festival Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Add new festivals to the database</li>
              <li>• Edit existing festival information</li>
              <li>• Update pricing and dates</li>
              <li>• Manage artist lineups</li>
              <li>• Set website links and details</li>
              <li>• Bulk import/export capabilities</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Download className="w-5 h-5" />
              Data Export Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Export festival data as CSV</li>
              <li>• Generate comprehensive reports</li>
              <li>• Artist analytics and statistics</li>
              <li>• Geographic distribution analysis</li>
              <li>• Pricing trend reports</li>
              <li>• Custom filtered exports</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accessing Management Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="activation">
              <AccordionTrigger className="text-left">
                Activating Admin Mode
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">
                    Hidden Activation Method:
                  </h4>
                  <ol className="text-sm text-gray-600 space-y-1">
                    <li>
                      1. Click on the site title "Cuban Salsa
                      Calendar" 4 times quickly
                    </li>
                    <li>
                      2. Admin mode will be activated
                      automatically
                    </li>
                    <li>
                      3. The management icon will appear in the
                      header
                    </li>
                    <li>
                      4. Click the gear icon to access
                      management features
                    </li>
                  </ol>
                </div>
                <div className="border border-blue-200 bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> You'll still need the
                    admin password to access the management
                    interface.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="keyboard">
              <AccordionTrigger className="text-left">
                Keyboard Shortcuts
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 p-3 rounded-lg">
                    <h5 className="font-medium mb-2">
                      Management Shortcuts:
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                          Ctrl/Cmd + M
                        </kbd>{" "}
                        - Toggle management
                      </li>
                      <li>
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                          Escape
                        </kbd>{" "}
                        - Close management
                      </li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 p-3 rounded-lg">
                    <h5 className="font-medium mb-2">
                      Requirements:
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Admin mode must be activated</li>
                      <li>• Valid password required</li>
                      <li>• Desktop browsers only</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="features">
              <AccordionTrigger className="text-left">
                Management Interface Features
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Festival Editor
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Visual form-based editing</li>
                        <li>• Real-time validation</li>
                        <li>• Automatic date parsing</li>
                        <li>• Artist management</li>
                        <li>• Price formatting</li>
                        <li>• Coordinate entry</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Bulk Operations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Import from CSV files</li>
                        <li>• Batch price updates</li>
                        <li>• Global artist changes</li>
                        <li>• Date format standardization</li>
                        <li>• Duplicate detection</li>
                        <li>• Data validation tools</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-red-800">
                    Security Notice:
                  </h4>
                  <p className="text-sm text-red-700">
                    Management features modify the live festival
                    database. Always double-check changes before
                    saving. Regular backups are maintained, but
                    use caution when making bulk modifications.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

// Export the help trigger button component
export function HelpButton({
  onShowHelp,
}: {
  onShowHelp: () => void;
}) {
  return <></>;
}