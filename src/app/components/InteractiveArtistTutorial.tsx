import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Trophy,
  Users,
  Star,
  TrendingUp,
  Search,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Crown,
  Medal,
  Award,
  BarChart3,
  Filter,
} from 'lucide-react';

interface InteractiveArtistTutorialProps {
  onClose?: () => void;
}

type ArtistStep = {
  id: number;
  title: string;
  description: string;
  details: string[];
  position: { top?: string; left?: string; right?: string; bottom?: string };
  element: string;
};

const artistSteps: ArtistStep[] = [
  {
    id: 1,
    title: 'Artist Rankings Overview',
    description: 'Discover which salsa instructors and performers are teaching at the most festivals worldwide. Rankings are based on festival appearances.',
    details: [
      'Rankings update in real-time as festivals are added',
      'Based on number of festival appearances',
      'Includes both instructors and performers',
      'Helps you find the most active artists',
      'Great for discovering new instructors'
    ],
    position: { top: '-12', left: '0' },
    element: 'rankings-overview'
  },
  {
    id: 2,
    title: 'Tier System',
    description: 'Artists are categorized into Gold, Silver, and Bronze tiers based on their festival activity level.',
    details: [
      'Gold Tier: Most active artists (top performers)',
      'Silver Tier: Very active and established artists',
      'Bronze Tier: Active artists with growing presence',
      'Tier badges provide quick visual recognition',
      'Higher tiers indicate broader international presence'
    ],
    position: { top: '0', left: '-12' },
    element: 'tier-system'
  },
  {
    id: 3,
    title: 'Festival Count Display',
    description: 'See exactly how many festivals each artist is teaching at, giving you insight into their current activity level.',
    details: [
      'Shows exact number of festival appearances',
      'Updates in real-time with new festivals',
      'Helps gauge artist popularity and demand',
      'Useful for planning which festivals to attend',
      'Indicates how internationally active an artist is'
    ],
    position: { right: '-12', top: '0' },
    element: 'festival-count'
  },
  {
    id: 4,
    title: 'Artist Search & Filter',
    description: 'Search for specific artists or filter by tier to find exactly who you\'re looking for.',
    details: [
      'Search by artist name (partial matches work)',
      'Filter by tier level (Gold, Silver, Bronze)',
      'Case-insensitive search for easy typing',
      'Real-time results as you type',
      'Clear filters to see all artists again'
    ],
    position: { right: '0', bottom: '-12' },
    element: 'artist-search'
  },
  {
    id: 5,
    title: 'Festival Cross-Reference',
    description: 'Click on any artist to see which festivals they\'re teaching at, helping you plan your festival attendance.',
    details: [
      'Click artist names to see their festival list',
      'Cross-reference with main festival calendar',
      'Plan trips around favorite instructors',
      'Discover festivals you might have missed',
      'See artist teaching schedules at a glance'
    ],
    position: { left: '0', bottom: '-12' },
    element: 'cross-reference'
  }
];

const mockArtists = [
  { name: 'Frankie Martinez', festivals: 12, tier: 'gold' },
  { name: 'Magna Gopal', festivals: 10, tier: 'gold' },
  { name: 'Eddie Torres Jr', festivals: 9, tier: 'gold' },
  { name: 'Gwepa Salsa', festivals: 8, tier: 'silver' },
  { name: 'Joel Dominguez', festivals: 7, tier: 'silver' },
  { name: 'Adolfo Indacochea', festivals: 6, tier: 'silver' },
  { name: 'Tania Cannarsa', festivals: 5, tier: 'bronze' },
  { name: 'Johnny Vazquez', festivals: 5, tier: 'bronze' },
  { name: 'Yamulee Dance', festivals: 4, tier: 'bronze' },
];

export function InteractiveArtistTutorial({ onClose }: InteractiveArtistTutorialProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [tourMode, setTourMode] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  // Auto-tour functionality
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    
    if (isPlaying && tourMode) {
      interval = setInterval(() => {
        setTourStep((prev) => {
          const next = (prev + 1) % artistSteps.length;
          setActiveStep(artistSteps[next].id);
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
    setActiveStep(artistSteps[0].id);
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
    if (tourStep < artistSteps.length - 1) {
      const newStep = tourStep + 1;
      setTourStep(newStep);
      setActiveStep(artistSteps[newStep].id);
    }
  };

  const prevStep = () => {
    if (tourStep > 0) {
      const newStep = tourStep - 1;
      setTourStep(newStep);
      setActiveStep(artistSteps[newStep].id);
    }
  };

  const getActiveStep = () => {
    return artistSteps.find(step => step.id === activeStep);
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'gold':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'silver':
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 'bronze':
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'bronze':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredArtists = mockArtists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTier === 'all' || artist.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Interactive Artist Rankings Tutorial
              </h1>
              <p className="text-gray-600">
                Learn how to discover and track your favorite salsa artists across festivals worldwide.
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
                    {tourStep + 1} / {artistSteps.length}
                  </span>
                  <Button
                    onClick={nextStep}
                    disabled={tourStep === artistSteps.length - 1}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}

            <div className="text-sm text-gray-500 ml-auto">
              Click any numbered callout to explore artist features
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive Artist Rankings Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg border border-gray-200 sticky top-4">
              <h3 className="text-lg font-semibold mb-6 text-center text-gray-800">
                Interactive Artist Rankings Interface
              </h3>
              
              <div className="space-y-6">
                {/* Rankings Overview Header */}
                <div className="relative" data-element="rankings-overview">
                  <div className="text-center bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                      <h4 className="text-xl font-bold text-gray-900">Artist Rankings</h4>
                    </div>
                    <p className="text-gray-700 text-sm mb-4">
                      Discover which salsa artists are teaching at the most festivals worldwide
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span>{mockArtists.length} Total Artists</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span>Updated Real-time</span>
                      </div>
                    </div>
                  </div>

                  {/* Rankings Overview Callout */}
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

                {/* Search and Filter Controls */}
                <div className="relative" data-element="artist-search">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Artists
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search by artist name..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filter by Tier
                      </label>
                      <select
                        value={selectedTier}
                        onChange={(e) => setSelectedTier(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Tiers</option>
                        <option value="gold">Gold Tier</option>
                        <option value="silver">Silver Tier</option>
                        <option value="bronze">Bronze Tier</option>
                      </select>
                    </div>
                  </div>

                  {/* Artist Search Callout */}
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

                {/* Tier Legend */}
                <div className="relative" data-element="tier-system">
                  <h4 className="font-medium text-gray-900 mb-3">Tier System</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <Crown className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                      <div className="font-medium text-yellow-800 text-sm">Gold</div>
                      <div className="text-xs text-yellow-700">8+ Festivals</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <Medal className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                      <div className="font-medium text-gray-800 text-sm">Silver</div>
                      <div className="text-xs text-gray-700">5-7 Festivals</div>
                    </div>
                    <div className="text-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <Award className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                      <div className="font-medium text-amber-800 text-sm">Bronze</div>
                      <div className="text-xs text-amber-700">3-4 Festivals</div>
                    </div>
                  </div>

                  {/* Tier System Callout */}
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

                {/* Artist List */}
                <div className="relative" data-element="festival-count">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Artists ({filteredArtists.length})
                  </h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {filteredArtists.map((artist, index) => (
                      <div key={artist.name} className="relative">
                        <button
                          onClick={() => setSelectedArtist(selectedArtist === artist.name ? null : artist.name)}
                          className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                            selectedArtist === artist.name
                              ? 'border-blue-300 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{artist.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${getTierColor(artist.tier)}`}
                                  >
                                    {getTierIcon(artist.tier)}
                                    <span className="capitalize ml-1">{artist.tier}</span>
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg text-gray-900">{artist.festivals}</div>
                              <div className="text-xs text-gray-500">festivals</div>
                            </div>
                          </div>
                        </button>

                        {selectedArtist === artist.name && index === 0 && (
                          <div className="relative" data-element="cross-reference">
                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <h5 className="font-medium text-blue-900 mb-2">Festival Appearances</h5>
                              <div className="space-y-1 text-sm text-blue-800">
                                <div>• Barcelona Salsa Congress (March 2024)</div>
                                <div>• London Salsa Festival (April 2024)</div>
                                <div>• New York Salsa Week (June 2024)</div>
                                <div>• Berlin Salsa Festival (July 2024)</div>
                                <div>• + {artist.festivals - 4} more festivals...</div>
                              </div>
                              <Button 
                                size="sm" 
                                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                View All Festivals
                              </Button>
                            </div>

                            {/* Cross Reference Callout */}
                            <button
                              onClick={() => handleStepClick(5)}
                              className={`absolute -left-14 top-4 flex items-center transition-all duration-200 ${
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
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Festival Count Callout */}
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
                          {tourStep + 1} of {artistSteps.length}
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-black h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((tourStep + 1) / artistSteps.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Explore Artist Rankings
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Click on any numbered callout to learn about artist ranking features, or start the guided tour to explore everything step by step.
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
            {artistSteps.map((step) => (
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
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Pro Tips for Using Artist Rankings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Following Your Favorites
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Search for artists you've learned from before</li>
                <li>• Track where your favorite instructors are teaching</li>
                <li>• Plan trips around multiple favorite artists</li>
                <li>• Discover new festivals through artist appearances</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Discovering New Artists
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Look at Gold and Silver tier artists for quality</li>
                <li>• Bronze tier artists might be rising stars</li>
                <li>• High festival counts indicate international recognition</li>
                <li>• Cross-reference with festivals you're already attending</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}