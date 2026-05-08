import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  CalendarPlus,
  Download,
  Calendar,
  Globe,
  Copy,
  Check,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Mail,
  MessageSquare,
  ChevronDown,
  Users,
  Share2,
} from 'lucide-react';
import { generateCalendarUrls, downloadICSFile, safeOpenURL } from '../utils/calendarExport';
import { Festival } from '../data/festivals';

interface InteractiveExportTutorialProps {
  onClose?: () => void;
}

type ExportStep = {
  id: number;
  title: string;
  description: string;
  details: string[];
  position: { top?: string; left?: string; right?: string; bottom?: string };
  element: string;
};

const exportSteps: ExportStep[] = [
  {
    id: 1,
    title: 'Calendar Export Button',
    description: 'Every festival has a calendar export button that lets you add events directly to your preferred calendar application.',
    details: [
      'Click the calendar icon next to each festival',
      'Choose from Google, Outlook, Yahoo, or download .ics',
      'All festival details are automatically included',
      'Works with any calendar application that supports .ics files',
      'One-click process for most calendar services'
    ],
    position: { top: '-12', left: '0' },
    element: 'calendar-export'
  },
  {
    id: 2,
    title: 'Calendar Service Options',
    description: 'Choose from multiple calendar services or download a universal calendar file that works with any calendar app.',
    details: [
      'Google Calendar: Direct integration with one click',
      'Microsoft Outlook: Works with both web and desktop versions',
      'Yahoo Calendar: Direct export to Yahoo calendar service',
      'Download .ics: Universal format for any calendar app',
      'Apple Calendar: Works via .ics download'
    ],
    position: { top: '0', left: '-12' },
    element: 'calendar-options'
  },
  {
    id: 3,
    title: 'What Gets Exported',
    description: 'When you export a festival to your calendar, all the important information is automatically included.',
    details: [
      'Festival name and complete title',
      'Start and end dates with correct time zones',
      'Location information (city, country)',
      'Website link for more details (when available)',
      'Brief description with pricing information',
      'Proper calendar formatting for all platforms'
    ],
    position: { left: '0', bottom: '-12' },
    element: 'export-details'
  }
];

// Sample festival for the demo
const sampleFestival: Festival = {
  id: 'demo-festival',
  name: 'Barcelona Salsa Congress 2024',
  city: 'Barcelona',
  country: 'Spain',
  continent: 'Europe',
  dates: 'March 15-17, 2024',
  price: '€150',
  artists: ['Frankie Martinez', 'Magna Gopal', 'Johnny Vazquez', 'Bersy Cortez', 'Yamulee Dance Company'],
  website: 'https://barcelonasalsacongress.com',
  description: 'Join us for an incredible weekend of Cuban Salsa workshops, shows, and social dancing in the heart of Barcelona.',
};

export function InteractiveExportTutorial({ onClose }: InteractiveExportTutorialProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [tourMode, setTourMode] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Auto-tour functionality
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    
    if (isPlaying && tourMode) {
      interval = setInterval(() => {
        setTourStep((prev) => {
          const next = (prev + 1) % exportSteps.length;
          setActiveStep(exportSteps[next].id);
          return next;
        });
      }, 4000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, tourMode]);

  const handleStepClick = (stepId: number) => {
    setActiveStep(activeStep === stepId ? null : stepId);
    if (tourMode) {
      setTourMode(false);
      setIsPlaying(false);
    }
  };

  const startTour = () => {
    setTourMode(true);
    setTourStep(0);
    setActiveStep(exportSteps[0].id);
    setIsPlaying(true);
  };

  const stopTour = () => {
    setTourMode(false);
    setIsPlaying(false);
    setActiveStep(null);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextStep = () => {
    if (tourStep < exportSteps.length - 1) {
      const newStep = tourStep + 1;
      setTourStep(newStep);
      setActiveStep(exportSteps[newStep].id);
    }
  };

  const prevStep = () => {
    if (tourStep > 0) {
      const newStep = tourStep - 1;
      setTourStep(newStep);
      setActiveStep(exportSteps[newStep].id);
    }
  };

  const getActiveStep = () => {
    return exportSteps.find(step => step.id === activeStep);
  };

  const handleCalendarExport = async (service: string) => {
    try {
      if (service === 'ics') {
        // Download ICS file
        downloadICSFile(sampleFestival);
      } else {
        // Generate calendar URLs and open them
        const urls = generateCalendarUrls(sampleFestival);
        
        let url: string;
        switch (service) {
          case 'google':
            url = urls.google;
            break;
          case 'outlook':
            url = urls.outlook;
            break;
          case 'yahoo':
            url = urls.yahoo;
            break;
          default:
            console.warn('Unknown calendar service:', service);
            return;
        }
        
        // Use the safe URL opening function
        safeOpenURL(url, `To add this festival to your ${service} calendar, please visit: ${url}`);
      }
      
      setExportSuccess(true);
      setShowCalendarDropdown(false);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Error exporting calendar event:', error);
      setExportSuccess(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: sampleFestival.name,
        text: `Check out ${sampleFestival.name} in ${sampleFestival.city}, ${sampleFestival.country} (${sampleFestival.dates}). Price: ${sampleFestival.price}`,
        url: sampleFestival.website || window.location.href
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn('Error sharing:', error);
      // Even if sharing fails, show success for demo purposes
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWebsiteShare = async () => {
    try {
      const shareData = {
        title: 'Cuban Salsa Calendar',
        text: 'Discover amazing salsa festivals around the world! Find dates, locations, prices, and featured artists for Cuban salsa events worldwide.',
        url: window.location.origin
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn('Error sharing website:', error);
      // Even if sharing fails, show success for demo purposes
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Interactive Export & Share Tutorial
              </h1>
              <p className="text-gray-600">
                Learn how to save festivals to your calendar and share discoveries with your dance community.
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
                    {tourStep + 1} / {exportSteps.length}
                  </span>
                  <Button
                    onClick={nextStep}
                    disabled={tourStep === exportSteps.length - 1}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}

            <div className="text-sm text-gray-500 ml-auto">
              Click any numbered callout to explore export features
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive Export Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg border border-gray-200 sticky top-4">
              <h3 className="text-lg font-semibold mb-6 text-center text-gray-800">
                Interactive Export & Share Demo
              </h3>
              
              <div className="space-y-6">
                {/* Sample Festival Card */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-3 bg-red-500 rounded-sm"></div>
                        <h4 className="font-semibold text-gray-900">{sampleFestival.name}</h4>
                      </div>
                      <div className="flex items-center gap-1 mb-1 text-gray-600">
                        <div className="w-3 h-3 text-gray-400">📍</div>
                        <span className="text-sm">{sampleFestival.city}, {sampleFestival.country} • {sampleFestival.continent}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{sampleFestival.price}</Badge>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Users className="w-3 h-3" />
                        <span>{sampleFestival.artists?.length || 0} featured artists</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-black text-white rounded-lg px-3 py-2 text-center">
                        <div className="font-bold text-xl">15</div>
                        <div className="text-xs font-semibold opacity-90">MAR</div>
                        <div className="text-xs opacity-75">2024</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Section */}
                  <div className="flex gap-2 relative">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-black text-white hover:bg-gray-800 flex items-center gap-1"
                      onClick={() => {
                        if (sampleFestival.website) {
                          safeOpenURL(sampleFestival.website, `Visit the festival website: ${sampleFestival.website}`);
                        }
                      }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Details</span>
                    </Button>

                    {/* Calendar Export Button */}
                    <div className="relative" data-element="calendar-export">
                      <div className="relative">
                        <Button
                          onClick={() => setShowCalendarDropdown(!showCalendarDropdown)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 bg-white border-black"
                        >
                          <CalendarPlus className="w-3 h-3" />
                          <span>Save</span>
                          <ChevronDown className="w-2 h-2" />
                        </Button>

                        {/* Calendar Dropdown */}
                        {showCalendarDropdown && (
                          <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10" data-element="calendar-options">
                            <div className="p-2">
                              <h5 className="text-sm font-medium text-gray-900 mb-2 px-2">Save to Calendar</h5>
                              <button
                                onClick={() => handleCalendarExport('google')}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
                              >
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span>Google Calendar</span>
                              </button>
                              <button
                                onClick={() => handleCalendarExport('outlook')}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
                              >
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span>Microsoft Outlook</span>
                              </button>
                              <button
                                onClick={() => handleCalendarExport('yahoo')}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
                              >
                                <Calendar className="w-4 h-4 text-purple-500" />
                                <span>Yahoo Calendar</span>
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button
                                onClick={() => handleCalendarExport('ics')}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
                              >
                                <Download className="w-4 h-4 text-gray-500" />
                                <span>Download .ics file</span>
                              </button>
                            </div>

                            {/* Calendar Options Callout */}
                            <button
                              onClick={() => handleStepClick(2)}
                              className={`absolute -left-12 top-4 flex items-center transition-all duration-200 ${
                                activeStep === 2 
                                  ? 'transform scale-110' 
                                  : 'hover:transform hover:scale-105'
                              }`}
                            >
                              <div className={`text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm transition-all duration-200 ${
                                activeStep === 2 
                                  ? 'bg-black animate-pulse' 
                                  : 'bg-gray-700 hover:bg-black'
                              }`}>
                                2
                              </div>
                              <div className="w-4 h-0.5 bg-gray-300"></div>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Calendar Export Callout */}
                      <button
                        onClick={() => handleStepClick(1)}
                        className={`absolute -left-12 top-0 flex items-center transition-all duration-200 ${
                          activeStep === 1 
                            ? 'transform scale-110' 
                            : 'hover:transform hover:scale-105'
                        }`}
                      >
                        <div className={`text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm transition-all duration-200 ${
                          activeStep === 1 
                            ? 'bg-black animate-pulse' 
                            : 'bg-gray-800 hover:bg-black'
                        }`}>
                          1
                        </div>
                        <div className="w-4 h-0.5 bg-gray-300"></div>
                      </button>
                    </div>


                  </div>

                  {/* Success Messages */}
                  {exportSuccess && (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800 flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      Festival successfully added to your calendar!
                    </div>
                  )}
                </div>



                {/* Export Details Section */}
                <div className="relative" data-element="export-details">
                  <h4 className="font-medium text-gray-900 mb-3">What Gets Exported to Your Calendar</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-blue-900 mb-2">Event Information</h5>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Festival name and title</li>
                          <li>• Complete date range</li>
                          <li>• Location (city, country)</li>
                          <li>• Website link (when available)</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-blue-900 mb-2">Additional Details</h5>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Pricing information</li>
                          <li>• Event duration</li>
                          <li>• Proper time zone settings</li>
                          <li>• Artist lineup (when available)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Export Details Callout */}
                  <button
                    onClick={() => handleStepClick(3)}
                    className={`absolute -left-12 top-8 flex items-center transition-all duration-200 ${
                      activeStep === 3 
                        ? 'transform scale-110' 
                        : 'hover:transform hover:scale-105'
                    }`}
                  >
                    <div className={`text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm transition-all duration-200 ${
                      activeStep === 3 
                        ? 'bg-black animate-pulse' 
                        : 'bg-gray-400 hover:bg-black'
                    }`}>
                      3
                    </div>
                    <div className="w-4 h-0.5 bg-gray-300"></div>
                  </button>
                </div>


              </div>
            </div>
          </div>

          {/* Explanation Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              {activeStep ? (
                <div className="animate-in slide-in-from-right duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {activeStep}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getActiveStep()?.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {getActiveStep()?.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                    <ul className="space-y-2">
                      {getActiveStep()?.details.map((detail, index) => (
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
                          {tourStep + 1} of {exportSteps.length}
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-black h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((tourStep + 1) / exportSteps.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarPlus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Explore Export & Share
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Click on any numbered callout to learn about export and sharing features, or start the guided tour to explore everything step by step.
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {exportSteps.map((step) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  activeStep === step.id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeStep === step.id ? 'bg-white text-black' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {step.id}
                  </div>
                </div>
                <div className="text-xs leading-tight">
                  {step.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pro Tips Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Pro Tips for Export & Share</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                <CalendarPlus className="w-4 h-4" />
                Calendar Best Practices
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Add festivals early to block dates and plan travel</li>
                <li>• Set custom reminders for registration deadlines</li>
                <li>• Use different calendar colors for different types of events</li>
                <li>• Check time zones are correct after importing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Sharing Strategies
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Share early so friends can plan and book together</li>
                <li>• Include your personal recommendations when sharing</li>
                <li>• Create group chats for festival planning coordination</li>
                <li>• Share the main website to help grow the community</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}