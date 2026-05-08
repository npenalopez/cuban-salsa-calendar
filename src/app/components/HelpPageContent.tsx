import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
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
  Eye,
  Users,
  DollarSign,
  Flag,
  Music,
  ArrowLeft,
  HelpCircle,
  Zap,
  Smartphone,
  Play,
  BookOpen,
  MousePointer,
  Lightbulb,
  Grid3X3,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { CubanFlagIcon } from "./CubanFlagIcon";
import { CountryFlagIcon } from "./CountryFlagIcon";
import { HelpCard } from "./HelpCard";
import { InteractiveFestivalAnatomy } from "./InteractiveFestivalAnatomy";
import { InteractiveSearchTutorial } from "./InteractiveSearchTutorial";
import { InteractiveLocationTutorial } from "./InteractiveLocationTutorial";
import { InteractiveArtistTutorial } from "./InteractiveArtistTutorial";
import { InteractiveExportTutorial } from "./InteractiveExportTutorial";
import { InteractiveLanguageTutorial } from "./InteractiveLanguageTutorial";
import { InteractiveManagementTutorial } from "./InteractiveManagementTutorial";

interface HelpPageContentProps {
  onBackToCalendar: () => void;
}

type InteractiveMode = 
  | 'festival-anatomy' 
  | 'search-tutorial' 
  | 'location-tutorial'
  | 'artist-tutorial'
  | 'export-tutorial'
  | 'language-tutorial'
  | 'management-tutorial'
  | null;

export function HelpPageContent({ onBackToCalendar }: HelpPageContentProps) {
  const { t } = useLanguage();
  const [interactiveMode, setInteractiveMode] = useState<InteractiveMode>(null);

  // Handle interactive mode switching
  if (interactiveMode) {
    switch (interactiveMode) {
      case 'festival-anatomy':
        return <InteractiveFestivalAnatomy onClose={() => setInteractiveMode(null)} />;
      case 'search-tutorial':
        return <InteractiveSearchTutorial onClose={() => setInteractiveMode(null)} />;
      case 'location-tutorial':
        return <InteractiveLocationTutorial onClose={() => setInteractiveMode(null)} />;
      case 'artist-tutorial':
        return <InteractiveArtistTutorial onClose={() => setInteractiveMode(null)} />;
      case 'export-tutorial':
        return <InteractiveExportTutorial onClose={() => setInteractiveMode(null)} />;
      case 'language-tutorial':
        return <InteractiveLanguageTutorial onClose={() => setInteractiveMode(null)} />;
      case 'management-tutorial':
        return <InteractiveManagementTutorial onClose={() => setInteractiveMode(null)} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBackToCalendar}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Calendar</span>
              </Button>
              <div className="flex items-center gap-3">
                <CubanFlagIcon size={20} />
                <h1 className="text-lg font-semibold">
                  Help & FAQ
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Compact Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Quick Start Section */}
        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold">Quick Start Guide</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900 mb-1">Find Festivals:</p>
                <p>Search by name, city, country, or click month filters</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Get Information:</p>
                <p>Each card shows dates, location, price, and duration</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Take Action:</p>
                <p>Export to calendar, share with friends, or visit website</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Help Content */}
        <Tabs defaultValue="basics" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics" className="flex items-center gap-1 text-xs sm:text-sm">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Basics</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-1 text-xs sm:text-sm">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Features</span>
            </TabsTrigger>
            <TabsTrigger value="interactive" className="flex items-center gap-1 text-xs sm:text-sm">
              <Play className="w-3 h-3" />
              <span className="hidden sm:inline">Interactive</span>
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-1 text-xs sm:text-sm">
              <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Support</span>
            </TabsTrigger>
          </TabsList>

          {/* Basics Tab */}
          <TabsContent value="basics" className="space-y-4">
            <div className="space-y-4">
              {/* Festival Cards */}
              <HelpCard
                title="Understanding Festival Cards"
                icon={<Music className="w-4 h-4" />}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-end">
                    <button 
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                      onClick={() => setInteractiveMode('festival-anatomy')}
                    >
                      <MousePointer className="w-3 h-3" />
                      Try Demo
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Card Elements:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Festival name with country flag</li>
                        <li>• City, country, and continent</li>
                        <li>• Date badge (start date)</li>
                        <li>• Price and duration</li>
                        <li>• Travel times (with location enabled)</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Actions Available:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• <strong>Details:</strong> Visit festival website</li>
                        <li>• <strong>Save:</strong> Export to calendar apps</li>
                        <li>• <strong>Share:</strong> Share with friends</li>
                        <li>• View featured artists list</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </HelpCard>

              {/* Search and Filter */}
              <HelpCard
                title="Search & Filter System"
                icon={<Search className="w-4 h-4" />}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-end">
                    <button 
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                      onClick={() => setInteractiveMode('search-tutorial')}
                    >
                      <Play className="w-3 h-3" />
                      Interactive Tutorial
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Search Options:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• <strong>Country names:</strong> "Spain", "Germany"</li>
                        <li>• <strong>Cities:</strong> "Barcelona", "Berlin"</li>
                        <li>• <strong>Artists:</strong> "Frankie Martinez"</li>
                        <li>• <strong>Festival names:</strong> Partial matches work</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Filter by Month:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Click month buttons to filter</li>
                        <li>• Click "All" to clear filters</li>
                        <li>• Combine with search for precision</li>
                        <li>• Mobile: scroll horizontally</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Pro Tip:</strong> Country searches are prioritized - typing "Spain" will show only Spanish festivals first.
                    </p>
                  </div>
                </div>
              </HelpCard>

              {/* Mobile Usage */}
              <HelpCard
                title="Mobile & Touch Optimization"
                icon={<Smartphone className="w-4 h-4" />}
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Mobile Features:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Touch-friendly buttons and navigation</li>
                        <li>• Simplified layout for small screens</li>
                        <li>• Swipe-able month filters</li>
                        <li>• Full functionality on all screen sizes</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Touch Gestures:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Tap festival cards to expand</li>
                        <li>• Swipe month filter bar</li>
                        <li>• Tap and hold for additional options</li>
                        <li>• Pinch to zoom on map view</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>iOS Users:</strong> Text inputs use 16px font size to prevent zoom. All buttons meet accessibility guidelines.
                    </p>
                  </div>
                </div>
              </HelpCard>
            </div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-4">
            <div className="space-y-4">
              {/* Location Features */}
              <HelpCard
                title="Location & Travel Features"
                icon={<MapPin className="w-4 h-4" />}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-end">
                    <button 
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                      onClick={() => setInteractiveMode('location-tutorial')}
                    >
                      <Play className="w-3 h-3" />
                      Interactive Demo
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Travel Time Estimates:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• ✈️ Flying time (direct flights)</li>
                        <li>• 🚗 Driving time and distance</li>
                        <li>• 🚆 Train options (when available)</li>
                        <li>• Updates based on your location</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Privacy & Setup:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Location processed locally</li>
                        <li>• No data stored on servers</li>
                        <li>• Can be disabled anytime</li>
                        <li>• Works offline for calculations</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Enable Location:</strong> Click "Allow" when your browser prompts for location permission to see travel times.
                    </p>
                  </div>
                </div>
              </HelpCard>

              {/* Artist Rankings */}
              <HelpCard
                title="Artist Rankings & Discovery"
                icon={<Trophy className="w-4 h-4" />}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-end">
                    <button 
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                      onClick={() => setInteractiveMode('artist-tutorial')}
                    >
                      <Play className="w-3 h-3" />
                      Explore Feature
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900 mb-2">How Rankings Work:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Artists ranked by festival appearances</li>
                        <li>• Real-time updates as data changes</li>
                        <li>• Gold, Silver, Bronze tiers</li>
                        <li>• Click trophy icon to access</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Use Cases:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Find your favorite instructors</li>
                        <li>• Discover new popular artists</li>
                        <li>• Plan your festival schedule around specific teachers</li>
                        <li>• Track artist tour schedules</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </HelpCard>

              {/* Export and Share */}
              <HelpCard
                title="Export & Share Options"
                icon={<Share2 className="w-4 h-4" />}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-end">
                    <button 
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                      onClick={() => setInteractiveMode('export-tutorial')}
                    >
                      <Play className="w-3 h-3" />
                      Try Export
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Calendar Export:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Google Calendar integration</li>
                        <li>• Apple Calendar (iOS/macOS)</li>
                        <li>• Microsoft Outlook</li>
                        <li>• Download .ics files</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Sharing Options:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Native device share menu</li>
                        <li>• Direct link copying</li>
                        <li>• Social media platforms</li>
                        <li>• Messaging apps integration</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>What's Included:</strong> Exported events include dates, location, website links, and pricing information.
                    </p>
                  </div>
                </div>
              </HelpCard>

              {/* Languages */}
              <HelpCard
                title="Languages & Currency"
                icon={<Languages className="w-4 h-4" />}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-end">
                    <button 
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                      onClick={() => setInteractiveMode('language-tutorial')}
                    >
                      <Play className="w-3 h-3" />
                      Language Demo
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span>🇺🇸</span>
                      <span>English</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🇪🇸</span>
                      <span>Español</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🇫🇷</span>
                      <span>Français</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🇩🇪</span>
                      <span>Deutsch</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🇵🇱</span>
                      <span>Polski</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🇧🇷</span>
                      <span>Português</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 mb-1">Currency Conversion:</p>
                    <p className="text-gray-600">Prices automatically convert to your local currency (USD, EUR, GBP, and more supported).</p>
                  </div>
                </div>
              </HelpCard>
            </div>
          </TabsContent>

          {/* Interactive Tab */}
          <TabsContent value="interactive" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quick Interactive Demos */}
              <HelpCard
                title="Interactive Tutorials"
                icon={<Grid3X3 className="w-4 h-4" />}
              >
                <div className="space-y-3">
                  <Button 
                    onClick={() => setInteractiveMode('festival-anatomy')}
                    className="w-full justify-start bg-white hover:bg-gray-50 text-black border border-gray-200"
                    variant="outline"
                  >
                    <Music className="w-4 h-4 mr-2" />
                    Festival Card Anatomy
                  </Button>
                  <Button 
                    onClick={() => setInteractiveMode('search-tutorial')}
                    className="w-full justify-start bg-white hover:bg-gray-50 text-black border border-gray-200"
                    variant="outline"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search & Filtering
                  </Button>
                  <Button 
                    onClick={() => setInteractiveMode('location-tutorial')}
                    className="w-full justify-start bg-white hover:bg-gray-50 text-black border border-gray-200"
                    variant="outline"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Location Features
                  </Button>
                  <Button 
                    onClick={() => setInteractiveMode('artist-tutorial')}
                    className="w-full justify-start bg-white hover:bg-gray-50 text-black border border-gray-200"
                    variant="outline"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Artist Rankings
                  </Button>
                </div>
              </HelpCard>

              <HelpCard
                title="Advanced Features"
                icon={<Lightbulb className="w-4 h-4" />}
              >
                <div className="space-y-3">
                  <Button 
                    onClick={() => setInteractiveMode('export-tutorial')}
                    className="w-full justify-start bg-white hover:bg-gray-50 text-black border border-gray-200"
                    variant="outline"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Export & Share
                  </Button>
                  <Button 
                    onClick={() => setInteractiveMode('language-tutorial')}
                    className="w-full justify-start bg-white hover:bg-gray-50 text-black border border-gray-200"
                    variant="outline"
                  >
                    <Languages className="w-4 h-4 mr-2" />
                    Languages & Currency
                  </Button>
                  <Button 
                    onClick={() => setInteractiveMode('management-tutorial')}
                    className="w-full justify-start bg-white hover:bg-gray-50 text-black border border-gray-200"
                    variant="outline"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Management Features
                  </Button>
                  <div className="text-center pt-2">
                    <Badge variant="secondary" className="text-xs">
                      Interactive guides with step-by-step walkthroughs
                    </Badge>
                  </div>
                </div>
              </HelpCard>
            </div>

            <div className="bg-black text-white p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Play className="w-5 h-5" />
                <h3 className="font-semibold">Interactive Learning</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Our interactive tutorials provide hands-on experience with clickable elements, guided tours, and real-time feedback.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-gray-700 text-white">Guided Tours</Badge>
                <Badge className="bg-gray-700 text-white">Step-by-Step</Badge>
                <Badge className="bg-gray-700 text-white">Click to Learn</Badge>
                <Badge className="bg-gray-700 text-white">Real Examples</Badge>
              </div>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="help" className="space-y-4">
            <div className="space-y-4">
              {/* Technical Issues */}
              <HelpCard
                title="Technical Issues & Troubleshooting"
                icon={<Settings className="w-4 h-4" />}
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Common Solutions:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Refresh the page (Ctrl+R / Cmd+R)</li>
                        <li>• Clear browser cache and cookies</li>
                        <li>• Try a different browser or incognito mode</li>
                        <li>• Check internet connection</li>
                        <li>• Disable ad blockers temporarily</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Location Issues:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Check browser location permissions</li>
                        <li>• Enable location services on device</li>
                        <li>• Try refreshing after granting permission</li>
                        <li>• Works without location (just no travel times)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Still having issues?</strong> The app works in all modern browsers. If problems persist, try updating your browser.
                    </p>
                  </div>
                </div>
              </HelpCard>

              {/* Contact */}
              <HelpCard
                title="Contact & Feedback"
                icon={<Globe className="w-4 h-4" />}
              >
                <div className="space-y-3">
                  <div className="text-sm space-y-3">
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Get in Touch:</p>
                      <p className="text-gray-600">Found a mistake? Missing festival? Have suggestions?</p>
                      <p className="text-gray-600">Contact us on Instagram: 
                        <a 
                          href="https://www.instagram.com/cubansalsacalendar" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline font-medium ml-1"
                        >
                          @cubansalsacalendar
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">What We Can Help With:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Adding missing festivals</li>
                        <li>• Correcting festival information</li>
                        <li>• Technical support</li>
                        <li>• Feature suggestions</li>
                        <li>• Translation improvements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </HelpCard>

              {/* Accessibility */}
              <HelpCard
                title="Accessibility Features"
                icon={<Eye className="w-4 h-4" />}
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Built-in Support:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Keyboard navigation throughout</li>
                        <li>• High contrast mode support</li>
                        <li>• Screen reader compatibility</li>
                        <li>• Reduced motion preferences</li>
                        <li>• Focus indicators on all interactive elements</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Mobile Accessibility:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• 44px minimum touch targets</li>
                        <li>• VoiceOver/TalkBack support</li>
                        <li>• Zoom and magnification friendly</li>
                        <li>• Large text support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </HelpCard>
            </div>

            {/* Contact Card */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Need More Help?
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>We're here to help make your salsa festival experience amazing!</p>
                <div className="flex items-center gap-4">
                  <a 
                    href="https://www.instagram.com/cubansalsacalendar" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    @cubansalsacalendar
                  </a>
                  <Badge variant="secondary">Response within 24h</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}