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
  Shield,
  Settings,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Globe,
  Lock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface InteractiveLocationTutorialProps {
  onClose?: () => void;
}

type LocationStep = {
  id: number;
  title: string;
  description: string;
  details: string[];
  position: { top?: string; left?: string; right?: string; bottom?: string };
  element: string;
};

const locationSteps: LocationStep[] = [
  {
    id: 1,
    title: 'Location Permission Request',
    description: 'Allow location access to get personalized travel times to each festival. Your location is processed locally and never stored on our servers.',
    details: [
      'Click "Allow" when your browser asks for location permission',
      'Desktop: Look for location icon in your address bar',
      'Mobile: Tap "Allow" in the popup notification',
      'Your exact location is never stored or shared',
      'All calculations happen locally in your browser'
    ],
    position: { top: '-12', left: '0' },
    element: 'location-permission'
  },
  {
    id: 2,
    title: 'Travel Time Display',
    description: 'See estimated travel times from your location to each festival venue using different transportation modes.',
    details: [
      'Flying: Direct flight time estimates',
      'Driving: Road trip duration via major routes',
      'Train: Rail travel time when routes exist',
      'Times update automatically when location changes',
      'Smart routing based on geographic feasibility'
    ],
    position: { top: '0', left: '-12' },
    element: 'travel-times'
  },
  {
    id: 3,
    title: 'Distance Calculations',
    description: 'Intelligent distance calculations that consider continental boundaries and practical travel routes.',
    details: [
      'Same continent: Shows all available travel modes',
      'Different continents: Prioritizes air travel',
      'Island nations: Includes ferry and flight options',
      'Remote locations: Provides realistic estimates',
      'Continental logic: Europe, Asia, Americas, etc.'
    ],
    position: { right: '-12', top: '0' },
    element: 'distance-logic'
  },
  {
    id: 4,
    title: 'Privacy Protection',
    description: 'Your location data is completely private and secure. We use advanced privacy protection measures.',
    details: [
      'Location processed locally in your browser only',
      'No location data sent to or stored on our servers',
      'Travel calculations happen on your device',
      'You can disable location services anytime',
      'Works completely offline for distance calculations'
    ],
    position: { right: '0', bottom: '-12' },
    element: 'privacy-protection'
  },
  {
    id: 5,
    title: 'Troubleshooting & Settings',
    description: 'Having issues with location services? Here are common solutions and settings you can adjust.',
    details: [
      'Check browser permissions in settings',
      'Refresh page if location seems inaccurate',
      'Allow GPS time to calibrate for accuracy',
      'Clear browser cache if having persistent issues',
      'Website works perfectly without location too'
    ],
    position: { left: '0', bottom: '-12' },
    element: 'troubleshooting'
  }
];

export function InteractiveLocationTutorial({ onClose }: InteractiveLocationTutorialProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [tourMode, setTourMode] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'requesting' | 'granted' | 'denied' | 'unavailable'>('requesting');

  // Auto-tour functionality
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    
    if (isPlaying && tourMode) {
      interval = setInterval(() => {
        setTourStep((prev) => {
          const next = (prev + 1) % locationSteps.length;
          setActiveStep(locationSteps[next].id);
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
    setActiveStep(locationSteps[0].id);
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
    if (tourStep < locationSteps.length - 1) {
      const newStep = tourStep + 1;
      setTourStep(newStep);
      setActiveStep(locationSteps[newStep].id);
    }
  };

  const prevStep = () => {
    if (tourStep > 0) {
      const newStep = tourStep - 1;
      setTourStep(newStep);
      setActiveStep(locationSteps[newStep].id);
    }
  };

  const getActiveStep = () => {
    return locationSteps.find(step => step.id === activeStep);
  };

  const simulateLocationRequest = () => {
    setLocationStatus('requesting');
    setTimeout(() => {
      setLocationStatus('granted');
      setLocationEnabled(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Interactive Location Features Tutorial
              </h1>
              <p className="text-gray-600">
                Learn how location services enhance your festival discovery with personalized travel times and distance calculations.
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
                    {tourStep + 1} / {locationSteps.length}
                  </span>
                  <Button
                    onClick={nextStep}
                    disabled={tourStep === locationSteps.length - 1}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}

            <div className="text-sm text-gray-500 ml-auto">
              Click any numbered callout to explore location features
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive Location Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg border border-gray-200 sticky top-4">
              <h3 className="text-lg font-semibold mb-6 text-center text-gray-800">
                Interactive Location Services Demo
              </h3>
              
              <div className="space-y-6">
                {/* Location Permission Section */}
                <div className="relative" data-element="location-permission">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        {locationStatus === 'requesting' && (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        )}
                        {locationStatus === 'granted' && (
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        )}
                        {locationStatus === 'denied' && (
                          <AlertCircle className="w-8 h-8 text-red-600" />
                        )}
                        {locationStatus === 'unavailable' && (
                          <Navigation className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {locationStatus === 'requesting' && 'Requesting Location Permission...'}
                        {locationStatus === 'granted' && 'Location Access Granted!'}
                        {locationStatus === 'denied' && 'Location Access Denied'}
                        {locationStatus === 'unavailable' && 'Location Services Unavailable'}
                      </h4>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        {locationStatus === 'requesting' && 'Please allow location access to see personalized travel times'}
                        {locationStatus === 'granted' && 'You\'ll now see travel times to each festival location'}
                        {locationStatus === 'denied' && 'The app works perfectly without location services'}
                        {locationStatus === 'unavailable' && 'This device doesn\'t support location services'}
                      </p>
                      
                      {!locationEnabled && (
                        <Button
                          onClick={simulateLocationRequest}
                          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                          size="sm"
                        >
                          <MapPin className="w-4 h-4" />
                          Enable Location Services
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Location Permission Callout */}
                  <button
                    onClick={() => handleStepClick(1)}
                    className={`absolute -left-12 top-8 flex items-center transition-all duration-200 ${
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

                {/* Travel Times Section */}
                <div className="relative" data-element="travel-times">
                  <h4 className="font-medium text-gray-900 mb-3">Travel Time Examples</h4>
                  <div className="space-y-3">
                    {/* Example Festival 1 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-medium text-gray-900">Barcelona Salsa Congress</h5>
                          <p className="text-sm text-gray-600">Barcelona, Spain • Europe</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">15</div>
                          <div className="text-xs font-semibold opacity-90">MAR</div>
                        </div>
                      </div>
                      
                      {locationEnabled ? (
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Plane className="w-3 h-3 text-blue-500" />
                            <span>2h 15m</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Car className="w-3 h-3 text-green-500" />
                            <span>12h 45m</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Train className="w-3 h-3 text-purple-500" />
                            <span>14h 20m</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 italic">
                          Enable location to see travel times
                        </div>
                      )}
                    </div>

                    {/* Example Festival 2 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-medium text-gray-900">Salsa Festival Tokyo</h5>
                          <p className="text-sm text-gray-600">Tokyo, Japan • Asia</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">22</div>
                          <div className="text-xs font-semibold opacity-90">JUN</div>
                        </div>
                      </div>
                      
                      {locationEnabled ? (
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Plane className="w-3 h-3 text-blue-500" />
                            <span>11h 30m</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            (Different continent - flight recommended)
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 italic">
                          Enable location to see travel times
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Travel Times Callout */}
                  <button
                    onClick={() => handleStepClick(2)}
                    className={`absolute -left-12 top-8 flex items-center transition-all duration-200 ${
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

                {/* Distance Logic Section */}
                <div className="relative" data-element="distance-logic">
                  <h4 className="font-medium text-gray-900 mb-3">Smart Distance Calculations</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-blue-900 mb-2">Same Continent</h5>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Shows all travel modes</li>
                          <li>• Driving routes via major highways</li>
                          <li>• Train connections when available</li>
                          <li>• Flight times for quick travel</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-blue-900 mb-2">Different Continents</h5>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Prioritizes air travel</li>
                          <li>• Considers major airport hubs</li>
                          <li>• Accounts for connection times</li>
                          <li>• Realistic international estimates</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Distance Logic Callout */}
                  <button
                    onClick={() => handleStepClick(3)}
                    className={`absolute -right-12 top-8 flex items-center transition-all duration-200 ${
                      activeStep === 3 
                        ? 'transform scale-110' 
                        : 'hover:transform hover:scale-105'
                    }`}
                  >
                    <div className="w-4 h-0.5 bg-gray-300"></div>
                    <div className={`text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm transition-all duration-200 ${
                      activeStep === 3 
                        ? 'bg-black animate-pulse' 
                        : 'bg-gray-600 hover:bg-black'
                    }`}>
                      3
                    </div>
                  </button>
                </div>

                {/* Privacy Protection Section */}
                <div className="relative" data-element="privacy-protection">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    Privacy Protection
                  </h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-green-900 mb-1">Local Processing</h5>
                          <p className="text-sm text-green-800">
                            Your location is processed entirely in your browser. Nothing is sent to our servers.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-green-900 mb-1">No Data Storage</h5>
                          <p className="text-sm text-green-800">
                            We never store or log your location data. It's only used for real-time calculations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Protection Callout */}
                  <button
                    onClick={() => handleStepClick(4)}
                    className={`absolute -right-2 -bottom-12 flex items-center transition-all duration-200 ${
                      activeStep === 4 
                        ? 'transform scale-110' 
                        : 'hover:transform hover:scale-105'
                    }`}
                  >
                    <div className="w-4 h-0.5 bg-gray-300"></div>
                    <div className={`text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm transition-all duration-200 ${
                      activeStep === 4 
                        ? 'bg-black animate-pulse' 
                        : 'bg-gray-500 hover:bg-black'
                    }`}>
                      4
                    </div>
                  </button>
                </div>

                {/* Troubleshooting Section */}
                <div className="relative" data-element="troubleshooting">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-600" />
                    Troubleshooting
                  </h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Location Blocked?</h5>
                          <p className="text-sm text-gray-600">
                            Check your browser's site permissions and refresh the page.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Inaccurate Location?</h5>
                          <p className="text-sm text-gray-600">
                            GPS may need time to calibrate. Wait a moment and refresh.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Troubleshooting Callout */}
                  <button
                    onClick={() => handleStepClick(5)}
                    className={`absolute -left-12 top-8 flex items-center transition-all duration-200 ${
                      activeStep === 5 
                        ? 'transform scale-110' 
                        : 'hover:transform hover:scale-105'
                    }`}
                  >
                    <div className={`text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm transition-all duration-200 ${
                      activeStep === 5 
                        ? 'bg-black animate-pulse' 
                        : 'bg-gray-400 hover:bg-black'
                    }`}>
                      5
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
                          {tourStep + 1} of {locationSteps.length}
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-black h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((tourStep + 1) / locationSteps.length) * 100}%` }}
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
                    Explore Location Features
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Click on any numbered callout to learn about location services, or start the guided tour to explore everything step by step.
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
            {locationSteps.map((step) => (
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
      </div>
    </div>
  );
}