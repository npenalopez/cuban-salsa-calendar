import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Search,
  Calendar,
  Filter,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  X,
  ArrowRight,
} from 'lucide-react';

interface InteractiveSearchTutorialProps {
  onClose?: () => void;
}

type SearchStep = {
  id: number;
  title: string;
  description: string;
  details: string[];
  position: { top?: string; left?: string; right?: string; bottom?: string };
  element: string;
};

const searchSteps: SearchStep[] = [
  {
    id: 1,
    title: 'Smart Search Bar',
    description: 'Type anything related to festivals - countries, cities, artists, or festival names. Our intelligent search understands what you\'re looking for.',
    details: [
      'Country Intelligence: Type "Spain" to see all Spanish festivals',
      'City Search: Find festivals in specific cities like "Barcelona"',
      'Artist Search: Search by instructor names like "Frankie Martinez"',
      'Festival Names: Search by title or partial name matches',
      'Auto-suggestions appear as you type'
    ],
    position: { top: '-12', left: '0' },
    element: 'search-input'
  },
  {
    id: 2,
    title: 'Month Filter Grid',
    description: 'Click any month to filter festivals by their start date. Perfect for planning your festival calendar around your schedule.',
    details: [
      'Click individual months to filter results',
      'Click "All" to remove month filtering',
      'Festivals are grouped by their start month',
      'Multi-day festivals appear in their start month',
      'Combine with search for powerful filtering'
    ],
    position: { top: '0', left: '-12' },
    element: 'month-filters'
  },
  {
    id: 3,
    title: 'Active Filter Chips',
    description: 'See your active filters at a glance and remove them individually. Each chip shows what\'s currently filtering your results.',
    details: [
      'Search terms appear as orange chips',
      'Selected months appear as green chips',
      'Click the X on any chip to remove that filter',
      'Multiple filters work together to narrow results',
      'Clear all filters with the "Show All" button'
    ],
    position: { right: '0', top: '-12' },
    element: 'filter-chips'
  },
  {
    id: 4,
    title: 'Results Counter',
    description: 'Always know how many festivals match your criteria. The counter updates in real-time as you adjust your filters.',
    details: [
      'Shows "X of Y festivals" format',
      'Updates instantly as you type or filter',
      'Helps you understand filter impact',
      'Click to quickly jump to results',
      'Changes color when no results found'
    ],
    position: { right: '-12', top: '0' },
    element: 'results-counter'
  },
  {
    id: 5,
    title: 'Clear All Button',
    description: 'Reset all your filters with one click to start fresh or see the complete festival list.',
    details: [
      'Removes all active filters at once',
      'Clears search terms and month selections',
      'Appears only when filters are active',
      'Instant way to see all available festivals',
      'Helpful when you\'ve over-filtered results'
    ],
    position: { left: '0', bottom: '-12' },
    element: 'clear-all'
  }
];

export function InteractiveSearchTutorial({ onClose }: InteractiveSearchTutorialProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [tourMode, setTourMode] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('All');

  // Auto-tour functionality
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    
    if (isPlaying && tourMode) {
      interval = setInterval(() => {
        setTourStep((prev) => {
          const next = (prev + 1) % searchSteps.length;
          setActiveStep(searchSteps[next].id);
          return next;
        });
      }, 4000); // 4 seconds per step
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
    setActiveStep(searchSteps[0].id);
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
    if (tourStep < searchSteps.length - 1) {
      const newStep = tourStep + 1;
      setTourStep(newStep);
      setActiveStep(searchSteps[newStep].id);
    }
  };

  const prevStep = () => {
    if (tourStep > 0) {
      const newStep = tourStep - 1;
      setTourStep(newStep);
      setActiveStep(searchSteps[newStep].id);
    }
  };

  const getActiveStep = () => {
    return searchSteps.find(step => step.id === activeStep);
  };

  const months = ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleSearchExample = (example: string) => {
    setSearchQuery(example);
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
  };

  const activeFilters = [
    ...(searchQuery ? [{ type: 'search', value: searchQuery }] : []),
    ...(selectedMonth !== 'All' ? [{ type: 'month', value: selectedMonth }] : [])
  ];

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedMonth('All');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Interactive Search & Filtering Tutorial
              </h1>
              <p className="text-gray-600">
                Learn how to find exactly the festivals you're looking for with our powerful search and filtering system.
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
                    {tourStep + 1} / {searchSteps.length}
                  </span>
                  <Button
                    onClick={nextStep}
                    disabled={tourStep === searchSteps.length - 1}
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
          {/* Interactive Search Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg border border-gray-200 sticky top-4">
              <h3 className="text-lg font-semibold mb-6 text-center text-gray-800">
                Interactive Search & Filter Interface
              </h3>
              
              <div className="space-y-6">
                {/* Search Input Section */}
                <div className="relative" data-element="search-input">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Festivals
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchExample(e.target.value)}
                      placeholder="Search by country, city, artist, or festival name..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Search Callout */}
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

                  {/* Search Examples */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500">Try:</span>
                    {['Spain', 'Barcelona', 'Frankie Martinez'].map((example) => (
                      <button
                        key={example}
                        onClick={() => handleSearchExample(example)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Month Filter Section */}
                <div className="relative" data-element="month-filters">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Filter by Month
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {months.map((month) => (
                      <button
                        key={month}
                        onClick={() => handleMonthSelect(month)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          selectedMonth === month
                            ? 'bg-black text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>

                  {/* Month Filter Callout */}
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

                {/* Active Filters Section */}
                <div className="relative" data-element="filter-chips">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Active Filters
                    </label>
                    {activeFilters.length > 0 && (
                      <div className="relative" data-element="clear-all">
                        <button
                          onClick={clearAllFilters}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Clear All
                        </button>
                        
                        {/* Clear All Callout */}
                        <button
                          onClick={() => handleStepClick(5)}
                          className={`absolute -left-14 top-0 flex items-center transition-all duration-200 ${
                            activeStep === 5 
                              ? 'transform scale-110' 
                              : 'hover:transform hover:scale-105'
                          }`}
                        >
                          <div className={`text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm transition-all duration-200 ${
                            activeStep === 5 
                              ? 'bg-black animate-pulse' 
                              : 'bg-gray-300 hover:bg-black'
                          }`}>
                            <span className={activeStep === 5 ? 'text-white' : 'text-gray-800'}>5</span>
                          </div>
                          <div className="w-4 h-0.5 bg-gray-300"></div>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="min-h-[2.5rem] flex flex-wrap gap-2">
                    {activeFilters.length > 0 ? (
                      activeFilters.map((filter, index) => (
                        <div
                          key={`${filter.type}-${filter.value}`}
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            filter.type === 'search' 
                              ? 'bg-orange-100 text-orange-800 border border-orange-200'
                              : 'bg-green-100 text-green-800 border border-green-200'
                          }`}
                        >
                          {filter.type === 'search' ? (
                            <Search className="w-3 h-3" />
                          ) : (
                            <Calendar className="w-3 h-3" />
                          )}
                          <span>{filter.value}</span>
                          <button
                            onClick={() => {
                              if (filter.type === 'search') {
                                setSearchQuery('');
                              } else {
                                setSelectedMonth('All');
                              }
                            }}
                            className="ml-1 hover:bg-white hover:bg-opacity-50 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm italic">No active filters</span>
                    )}
                  </div>

                  {/* Filter Chips Callout */}
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

                {/* Results Counter Section */}
                <div className="relative" data-element="results-counter">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Filter className="w-5 h-5 text-gray-600" />
                      <span className="text-lg font-semibold text-gray-900">
                        {activeFilters.length > 0 ? '25 of 150' : '150'} festivals
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {activeFilters.length > 0 
                        ? 'Filtered results based on your search criteria'
                        : 'Showing all available festivals'
                      }
                    </p>
                  </div>

                  {/* Results Counter Callout */}
                  <button
                    onClick={() => handleStepClick(4)}
                    className={`absolute -right-12 top-4 flex items-center transition-all duration-200 ${
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
                          {tourStep + 1} of {searchSteps.length}
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-black h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((tourStep + 1) / searchSteps.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Explore Search Features
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Click on any numbered callout to learn about that specific search feature, or start the guided tour to explore everything step by step.
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
            {searchSteps.map((step) => (
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

        {/* Tips Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Pro Search Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Smart Search Strategies
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Start broad, then narrow down with filters</li>
                <li>• Use partial names - "Frank" will find "Frankie Martinez"</li>
                <li>• Search is case-insensitive for easier typing</li>
                <li>• Try different languages for artist names</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Filter Best Practices
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Combine month filters with search for precision</li>
                <li>• Use "Clear All" when you get zero results</li>
                <li>• Month filters help with travel planning</li>
                <li>• Save interesting results by exporting to calendar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}