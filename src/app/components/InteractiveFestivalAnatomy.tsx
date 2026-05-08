import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  MapPin,
  Clock,
  Car,
  Plane,
  Train,
  ExternalLink,
  CalendarPlus,
  ChevronDown,
  Share2,
  Users,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CountryFlagIcon } from './CountryFlagIcon';

interface InteractiveFestivalAnatomyProps {
  onClose?: () => void;
}

type AnatomySection = {
  id: number;
  title: string;
  description: string;
  details: string[];
  position: { top?: string; left?: string; right?: string; bottom?: string };
  element: string; // CSS selector or identifier
};

const anatomySections: AnatomySection[] = [
  {
    id: 1,
    title: 'Festival Name & Country Flag',
    description: 'The festival\'s official name with a country flag icon for instant geographic recognition.',
    details: [
      'Clickable title that may link to official website',
      'Country flag helps with quick geographic identification',
      'Year included when relevant for multi-year events',
      'Hover effects provide additional context'
    ],
    position: { left: '-12', top: '-2' },
    element: 'festival-title'
  },
  {
    id: 2,
    title: 'Location & Geographic Info',
    description: 'Complete location hierarchy from city to continent for comprehensive geographic context.',
    details: [
      'City: Specific festival location',
      'Country: National context for travel planning',
      'Continent: Broad geographic reference',
      'Map pin icon: Visual location indicator'
    ],
    position: { left: '-12', top: '0' },
    element: 'festival-location'
  },
  {
    id: 3,
    title: 'Price & Duration Information',
    description: 'Essential planning information for budgeting and time management.',
    details: [
      'Currency conversion: Automatic conversion to your local currency',
      'Duration calculation: Total event length in days',
      'Price indicators: Shows "-" when price not available',
      'Comparative pricing: Helps compare value across events'
    ],
    position: { left: '-12', top: '0' },
    element: 'festival-pricing'
  },
  {
    id: 4,
    title: 'Travel Time Estimates',
    description: 'Personalized travel information based on your location (requires location permission).',
    details: [
      'Flying: Direct flight time estimates',
      'Driving: Road trip duration',
      'Train: Rail travel options (when available)',
      'Smart routing based on geographic feasibility'
    ],
    position: { left: '-12', top: '0' },
    element: 'festival-travel'
  },
  {
    id: 5,
    title: 'Date Badge',
    description: 'Prominent visual date display for quick chronological reference and calendar planning.',
    details: [
      'Large day number: Primary date focus',
      'Month abbreviation: Clear temporal context',
      'Year display: Full chronological reference',
      'Dark styling: High contrast for readability'
    ],
    position: { right: '-12', top: '-2' },
    element: 'festival-date'
  },
  {
    id: 6,
    title: 'Artist Information & Lineup',
    description: 'Featured instructor and performer information to help you choose events based on teaching styles.',
    details: [
      'Artist count: Number of featured instructors',
      'Preview names: First few artist names shown',
      'Hover details: Full artist list in tooltip',
      'Rankings integration: Connect with Artist Rankings feature'
    ],
    position: { left: '-12', top: '0' },
    element: 'festival-artists'
  },
  {
    id: 7,
    title: 'Action Buttons & Quick Actions',
    description: 'Three essential actions for each festival: get more information, save to calendar, and share with others.',
    details: [
      'Instagram Button: Opens festival Instagram page or searches for their Instagram account',
      'Save to Calendar: Export to Google Calendar, Outlook, Yahoo, or download .ics file',
      'Share Festival: Share via native share menu or copy link to clipboard',
      'Calendar exports include all essential festival information'
    ],
    position: { left: '-12', top: '0' },
    element: 'festival-actions'
  }
];

export function InteractiveFestivalAnatomy({ onClose }: InteractiveFestivalAnatomyProps) {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [tourMode, setTourMode] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-tour functionality
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    
    if (isPlaying && tourMode) {
      interval = setInterval(() => {
        setTourStep((prev) => {
          const next = (prev + 1) % anatomySections.length;
          setActiveSection(anatomySections[next].id);
          return next;
        });
      }, 3000); // 3 seconds per step
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, tourMode]);

  const handleSectionClick = (sectionId: number) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
    if (tourMode) {
      setTourMode(false);
      setIsPlaying(false);
    }
  };

  const startTour = () => {
    setTourMode(true);
    setTourStep(0);
    setActiveSection(anatomySections[0].id);
    setIsPlaying(true);
  };

  const stopTour = () => {
    setTourMode(false);
    setIsPlaying(false);
    setActiveSection(null);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextStep = () => {
    if (tourStep < anatomySections.length - 1) {
      const newStep = tourStep + 1;
      setTourStep(newStep);
      setActiveSection(anatomySections[newStep].id);
    }
  };

  const prevStep = () => {
    if (tourStep > 0) {
      const newStep = tourStep - 1;
      setTourStep(newStep);
      setActiveSection(anatomySections[newStep].id);
    }
  };

  const getActiveSection = () => {
    return anatomySections.find(section => section.id === activeSection);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Interactive Festival Card Anatomy
              </h1>
              <p className="text-gray-600">
                Explore each element of a festival card to understand how to make the most of your festival discovery experience.
              </p>
            </div>
            {onClose && (
              <Button onClick={onClose} variant="outline" size="sm">
                Close
              </Button>
            )}
          </div>

          {/* Tour Controls */}
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
            <Button
              onClick={tourMode ? stopTour : startTour}
              className="bg-black hover:bg-gray-800 text-white flex items-center gap-2"
              size="sm"
            >
              {tourMode ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Stop Tour
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Guided Tour
                </>
              )}
            </Button>

            {tourMode && (
              <>
                <Button
                  onClick={togglePlayPause}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Play
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={prevStep}
                    disabled={tourStep === 0}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-600 font-medium px-2">
                    {tourStep + 1} / {anatomySections.length}
                  </span>
                  <Button
                    onClick={nextStep}
                    disabled={tourStep === anatomySections.length - 1}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}

            <div className="text-sm text-gray-500 ml-auto">
              Click any numbered callout to explore, or use the guided tour
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive Festival Card */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg border border-gray-200 sticky top-4">
              <h3 className="text-lg font-semibold mb-6 text-center text-gray-800">
                Interactive Festival Card
              </h3>
              
              <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm max-w-md mx-auto">
                {/* Festival Card Content */}
                <div className="p-4 space-y-3">
                  {/* Header Section with Callout */}
                  <div className="flex items-start gap-3 relative" data-element="festival-title">
                    <div className="flex-1 min-w-0">
                      <div className="relative">
                        <h3 className="font-semibold text-gray-900 mb-1 leading-tight flex items-center gap-2">
                          <CountryFlagIcon country="Spain" size={16} />
                          Barcelona Salsa Congress 2024
                        </h3>
                        {/* Callout 1 */}
                        <button
                          onClick={() => handleSectionClick(1)}
                          className={`absolute -left-12 -top-2 flex items-center transition-all duration-200 ${
                            activeSection === 1 
                              ? 'transform scale-110' 
                              : 'hover:transform hover:scale-105'
                          }`}
                        >
                          <div className={`text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm transition-all duration-200 ${
                            activeSection === 1 
                              ? 'bg-black animate-pulse' 
                              : 'bg-gray-800 hover:bg-black'
                          }`}>
                            1
                          </div>
                          <div className="w-4 h-0.5 bg-gray-300"></div>
                        </button>
                      </div>

                      {/* Location Section */}
                      <div className="flex items-center gap-1 mb-2 text-gray-600 relative" data-element="festival-location">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">Barcelona, Spain</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">Europe</span>
                        {/* Callout 2 */}
                        <button
                          onClick={() => handleSectionClick(2)}
                          className={`absolute -left-12 top-0 flex items-center transition-all duration-200 ${
                            activeSection === 2 
                              ? 'transform scale-110' 
                              : 'hover:transform hover:scale-105'
                          }`}
                        >
                          <div className={`text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm transition-all duration-200 ${
                            activeSection === 2 
                              ? 'bg-black animate-pulse' 
                              : 'bg-gray-700 hover:bg-black'
                          }`}>
                            2
                          </div>
                          <div className="w-4 h-0.5 bg-gray-300"></div>
                        </button>
                      </div>

                      {/* Price & Duration Section */}
                      <div className="flex items-center gap-2 mb-2 relative" data-element="festival-pricing">
                        <div className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium border border-gray-200">
                          €150
                        </div>
                        <div className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded font-medium border border-gray-200">
                          3 days
                        </div>
                        {/* Callout 3 */}
                        <button
                          onClick={() => handleSectionClick(3)}
                          className={`absolute -left-12 top-0 flex items-center transition-all duration-200 ${
                            activeSection === 3 
                              ? 'transform scale-110' 
                              : 'hover:transform hover:scale-105'
                          }`}
                        >
                          <div className={`text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm transition-all duration-200 ${
                            activeSection === 3 
                              ? 'bg-black animate-pulse' 
                              : 'bg-gray-600 hover:bg-black'
                          }`}>
                            3
                          </div>
                          <div className="w-4 h-0.5 bg-gray-300"></div>
                        </button>
                      </div>

                      {/* Travel Time Section */}
                      <div className="flex items-center gap-1 mb-2 text-gray-600 relative" data-element="festival-travel">
                        <Clock className="h-3 w-3 shrink-0" />
                        <Plane className="h-3 w-3" />
                        <span className="text-sm">2h 15m</span>
                        <span className="text-gray-400">•</span>
                        <Car className="h-3 w-3" />
                        <span className="text-sm">12h 30m</span>
                        {/* Callout 4 */}
                        <button
                          onClick={() => handleSectionClick(4)}
                          className={`absolute -left-12 top-0 flex items-center transition-all duration-200 ${
                            activeSection === 4 
                              ? 'transform scale-110' 
                              : 'hover:transform hover:scale-105'
                          }`}
                        >
                          <div className={`text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm transition-all duration-200 ${
                            activeSection === 4 
                              ? 'bg-black animate-pulse' 
                              : 'bg-gray-500 hover:bg-black'
                          }`}>
                            4
                          </div>
                          <div className="w-4 h-0.5 bg-gray-300"></div>
                        </button>
                      </div>
                    </div>

                    {/* Date Badge */}
                    <div className="relative" data-element="festival-date">
                      <div className="bg-black text-white border border-gray-300 rounded-lg text-center flex flex-col items-center justify-center flex-shrink-0 px-2 py-1 shadow-sm"
                           style={{ width: "3.5em", height: "4em" }}>
                        <div className="font-bold leading-none text-lg">15</div>
                        <div className="leading-none text-xs font-semibold mt-1 opacity-90">MAR</div>
                        <div className="leading-none opacity-75 text-xs">2024</div>
                      </div>
                      {/* Callout 5 */}
                      <button
                        onClick={() => handleSectionClick(5)}
                        className={`absolute -right-12 -top-2 flex items-center transition-all duration-200 ${
                          activeSection === 5 
                            ? 'transform scale-110' 
                            : 'hover:transform hover:scale-105'
                        }`}
                      >
                        <div className="w-4 h-0.5 bg-gray-300"></div>
                        <div className={`text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm transition-all duration-200 ${
                          activeSection === 5 
                            ? 'bg-black animate-pulse' 
                            : 'bg-gray-400 hover:bg-black'
                        }`}>
                          5
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Artists Section */}
                  <div className="mb-3 relative" data-element="festival-artists">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="h-3 w-3" />
                        <span className="text-sm">5 featured artists</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Frankie Martinez, Magna Gopal...</span>
                      </div>
                    </div>
                    {/* Callout 6 */}
                    <button
                      onClick={() => handleSectionClick(6)}
                      className={`absolute -left-12 top-0 flex items-center transition-all duration-200 ${
                        activeSection === 6 
                          ? 'transform scale-110' 
                          : 'hover:transform hover:scale-105'
                      }`}
                    >
                      <div className={`text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm transition-all duration-200 ${
                        activeSection === 6 
                          ? 'bg-black animate-pulse' 
                          : 'bg-gray-400 hover:bg-black'
                      }`}>
                        6
                      </div>
                      <div className="w-4 h-0.5 bg-gray-300"></div>
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 relative" data-element="festival-actions">
                    <Button className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-1" size="sm">
                      <ExternalLink className="w-3 h-3" />
                      <span>Details</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-white hover:bg-gray-50 text-black border border-black font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-1">
                      <CalendarPlus className="w-3 h-3" />
                      <span>Save</span>
                      <ChevronDown className="w-2 h-2" />
                    </Button>
                    <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 text-black border border-black font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-1">
                      <Share2 className="w-3 h-3" />
                    </Button>
                    {/* Callout 7 */}
                    <button
                      onClick={() => handleSectionClick(7)}
                      className={`absolute -left-12 top-0 flex items-center transition-all duration-200 ${
                        activeSection === 7 
                          ? 'transform scale-110' 
                          : 'hover:transform hover:scale-105'
                      }`}
                    >
                      <div className={`text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm transition-all duration-200 ${
                        activeSection === 7 
                          ? 'bg-black animate-pulse' 
                          : 'bg-gray-300 hover:bg-black'
                      }`}>
                        <span className={activeSection === 7 ? 'text-white' : 'text-gray-800'}>7</span>
                      </div>
                      <div className="w-4 h-0.5 bg-gray-300"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              {activeSection ? (
                <div className="animate-in slide-in-from-right duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {activeSection}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getActiveSection()?.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {getActiveSection()?.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                    <ul className="space-y-2">
                      {getActiveSection()?.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {tourMode && (
                    <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Guided Tour Progress</span>
                        <span className="font-medium text-gray-900">
                          {tourStep + 1} of {anatomySections.length}
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-black h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((tourStep + 1) / anatomySections.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Explore Festival Card Elements
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Click on any numbered callout on the festival card to learn about that specific feature, or start the guided tour to explore everything step by step.
                  </p>
                  <Button
                    onClick={startTour}
                    className="bg-black hover:bg-gray-800 text-white flex items-center gap-2 mx-auto"
                    size="sm"
                  >
                    <Play className="w-4 h-4" />
                    Start Guided Tour
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {anatomySections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeSection === section.id ? 'bg-white text-black' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {section.id}
                  </div>
                </div>
                <div className="text-xs leading-tight">
                  {section.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}