import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Languages,
  DollarSign,
  Globe,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  RefreshCw,
  Flag,
} from 'lucide-react';

interface InteractiveLanguageTutorialProps {
  onClose?: () => void;
}

type LanguageStep = {
  id: number;
  title: string;
  description: string;
  details: string[];
  position: { top?: string; left?: string; right?: string; bottom?: string };
  element: string;
};

const languageSteps: LanguageStep[] = [
  {
    id: 1,
    title: 'Language Selector',
    description: 'Click the flag icon in the header to access the language selector and switch between 6 supported languages.',
    details: [
      'Located in the top-right corner of the website',
      'Flag icon changes based on current language',
      'Dropdown shows all 6 available languages',
      'Changes take effect immediately',
      'Your preference is remembered for future visits'
    ],
    position: { top: '-12', left: '0' },
    element: 'language-selector'
  },
  {
    id: 2,
    title: 'Supported Languages',
    description: 'Cuban Salsa Calendar supports 6 major languages to serve our global salsa community.',
    details: [
      'English (EN) - Default language',
      'Español (ES) - Spanish',
      'Français (FR) - French', 
      'Deutsch (DE) - German',
      'Polski (PL) - Polish',
      'Português (PT) - Portuguese'
    ],
    position: { top: '0', left: '-12' },
    element: 'supported-languages'
  },
  {
    id: 3,
    title: 'Currency Conversion',
    description: 'Prices are automatically converted to your local currency based on your browser\'s language setting.',
    details: [
      'Automatic currency detection from browser settings',
      'Supports 12+ major currencies worldwide',
      'Real-time conversion rates (updated daily)',
      'Covers USD, EUR, GBP, CAD, AUD, JPY, and more',
      'Helps with budgeting and price comparisons'
    ],
    position: { right: '-12', top: '0' },
    element: 'currency-conversion'
  },
  {
    id: 4,
    title: 'What Gets Translated',
    description: 'Interface elements, buttons, and help text are translated while preserving original festival and artist names.',
    details: [
      'All interface elements and navigation',
      'Search placeholders and button text',
      'Help text and instructions',
      'Error messages and notifications',
      'Calendar export options',
      'Month names and date formats'
    ],
    position: { right: '0', bottom: '-12' },
    element: 'translated-content'
  },
  {
    id: 5,
    title: 'What Stays Original',
    description: 'Festival names, artist names, and location information remain in their original language to preserve authenticity.',
    details: [
      'Festival names and titles stay as originally published',
      'Artist and instructor names remain unchanged',
      'City and country names stay in English for consistency',
      'Website URLs and external links unchanged',
      'Currency symbols are localized but amounts converted',
      'This preserves authenticity and avoids confusion'
    ],
    position: { left: '0', bottom: '-12' },
    element: 'original-content'
  }
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', currency: 'USD' },
  { code: 'es', name: 'Español', flag: '🇪🇸', currency: 'EUR' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', currency: 'EUR' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', currency: 'EUR' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱', currency: 'PLN' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', currency: 'EUR' }
];

const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'PLN', 'CZK', 'HUF'];

export function InteractiveLanguageTutorial({ onClose }: InteractiveLanguageTutorialProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [tourMode, setTourMode] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [currencyConverting, setCurrencyConverting] = useState(false);

  // Auto-tour functionality
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    
    if (isPlaying && tourMode) {
      interval = setInterval(() => {
        setTourStep((prev) => {
          const next = (prev + 1) % languageSteps.length;
          setActiveStep(languageSteps[next].id);
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
    setActiveStep(languageSteps[0].id);
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
    if (tourStep < languageSteps.length - 1) {
      const newStep = tourStep + 1;
      setTourStep(newStep);
      setActiveStep(languageSteps[newStep].id);
    }
  };

  const prevStep = () => {
    if (tourStep > 0) {
      const newStep = tourStep - 1;
      setTourStep(newStep);
      setActiveStep(languageSteps[newStep].id);
    }
  };

  const getActiveStep = () => {
    return languageSteps.find(step => step.id === activeStep);
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    setShowLanguageDropdown(false);
    
    // Simulate currency conversion
    const newLang = languages.find(l => l.code === langCode);
    if (newLang && newLang.currency !== currentCurrency) {
      setCurrencyConverting(true);
      setTimeout(() => {
        setCurrentCurrency(newLang.currency);
        setCurrencyConverting(false);
      }, 1000);
    }
  };

  const getCurrentLanguage = () => {
    return languages.find(l => l.code === selectedLanguage) || languages[0];
  };

  const getTranslatedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      searchPlaceholder: {
        en: 'Search festivals by country, city, or artist...',
        es: 'Buscar festivales por país, ciudad o artista...',
        fr: 'Rechercher des festivals par pays, ville ou artiste...',
        de: 'Festivals nach Land, Stadt oder Künstler suchen...',
        pl: 'Szukaj festiwali według kraju, miasta lub artysty...',
        pt: 'Procurar festivais por país, cidade ou artista...'
      },
      detailsButton: {
        en: 'Details',
        es: 'Detalles',
        fr: 'Détails',
        de: 'Details',
        pl: 'Szczegóły',
        pt: 'Detalhes'
      },
      saveButton: {
        en: 'Save',
        es: 'Guardar',
        fr: 'Sauvegarder',
        de: 'Speichern',
        pl: 'Zapisz',
        pt: 'Salvar'
      },
      shareButton: {
        en: 'Share',
        es: 'Compartir',
        fr: 'Partager',
        de: 'Teilen',
        pl: 'Udostępnij',
        pt: 'Compartilhar'
      }
    };
    
    return translations[key]?.[selectedLanguage] || translations[key]?.['en'] || key;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Interactive Languages & Currency Tutorial
              </h1>
              <p className="text-gray-600">
                Learn how to use Cuban Salsa Calendar in your preferred language with automatic currency conversion.
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
                    {tourStep + 1} / {languageSteps.length}
                  </span>
                  <Button
                    onClick={nextStep}
                    disabled={tourStep === languageSteps.length - 1}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}

            <div className="text-sm text-gray-500 ml-auto">
              Click any numbered callout to explore language features
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive Language Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg border border-gray-200 sticky top-4">
              <h3 className="text-lg font-semibold mb-6 text-center text-gray-800">
                Interactive Language & Currency Demo
              </h3>
              
              <div className="space-y-6">
                {/* Language Selector Section */}
                <div className="relative" data-element="language-selector">
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Current Language:</span>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg">{getCurrentLanguage().flag}</span>
                        <span className="font-medium">{getCurrentLanguage().name}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>

                      {showLanguageDropdown && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <div className="p-2">
                            {languages.map((lang) => (
                              <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full text-left px-3 py-2 text-sm rounded flex items-center gap-3 transition-colors ${
                                  selectedLanguage === lang.code
                                    ? 'bg-blue-50 text-blue-900'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <span className="text-base">{lang.flag}</span>
                                <span>{lang.name}</span>
                                {selectedLanguage === lang.code && (
                                  <Check className="w-4 h-4 text-blue-600 ml-auto" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Language Selector Callout */}
                  <button
                    onClick={() => handleStepClick(1)}
                    className={`absolute -left-12 top-4 flex items-center transition-all duration-200 ${
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

                {/* Supported Languages Overview */}
                <div className="relative" data-element="supported-languages">
                  <h4 className="font-medium text-gray-900 mb-3">Supported Languages</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {languages.map((lang) => (
                      <div
                        key={lang.code}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          selectedLanguage === lang.code
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{lang.flag}</span>
                          <span className="font-medium text-gray-900">{lang.name}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {lang.code.toUpperCase()} • {lang.currency}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Supported Languages Callout */}
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

                {/* Currency Conversion Section */}
                <div className="relative" data-element="currency-conversion">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Currency Conversion
                  </h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-green-900">Active Currency:</span>
                      <div className="flex items-center gap-2">
                        {currencyConverting && <RefreshCw className="w-4 h-4 text-green-600 animate-spin" />}
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {currentCurrency}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-green-800">Sample Festival Price:</span>
                        <span className="font-medium text-green-900">
                          {currentCurrency === 'USD' && '$120'}
                          {currentCurrency === 'EUR' && '€110'}
                          {currentCurrency === 'PLN' && '450 zł'}
                          {currentCurrency === 'GBP' && '£95'}
                        </span>
                      </div>
                      <div className="text-xs text-green-700">
                        Automatically converted based on your language selection
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="text-xs text-green-700">
                        <strong>Supported currencies:</strong> {currencies.join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Currency Conversion Callout */}
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

                {/* Translation Preview */}
                <div className="relative" data-element="translated-content">
                  <h4 className="font-medium text-gray-900 mb-3">Interface Translation Preview</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="space-y-3">
                      {/* Search Input */}
                      <div>
                        <label className="block text-xs font-medium text-blue-900 mb-1">Search Input:</label>
                        <input
                          type="text"
                          placeholder={getTranslatedText('searchPlaceholder')}
                          className="w-full px-3 py-2 border border-blue-300 rounded text-sm"
                          disabled
                        />
                      </div>
                      
                      {/* Sample Buttons */}
                      <div>
                        <label className="block text-xs font-medium text-blue-900 mb-2">Action Buttons:</label>
                        <div className="flex gap-2">
                          <Button size="sm" disabled className="bg-black text-white">
                            {getTranslatedText('detailsButton')}
                          </Button>
                          <Button size="sm" variant="outline" disabled>
                            {getTranslatedText('saveButton')}
                          </Button>
                          <Button size="sm" variant="outline" disabled>
                            {getTranslatedText('shareButton')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Translated Content Callout */}
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

                {/* Original Content Section */}
                <div className="relative" data-element="original-content">
                  <h4 className="font-medium text-gray-900 mb-3">What Stays Original</h4>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-amber-900 mb-1">Festival Names:</label>
                        <div className="text-sm text-amber-800 font-medium">
                          Barcelona Salsa Congress 2024
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-amber-900 mb-1">Artist Names:</label>
                        <div className="text-sm text-amber-800">
                          Frankie Martinez, Magna Gopal, Eddie Torres Jr
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-amber-900 mb-1">Locations:</label>
                        <div className="text-sm text-amber-800">
                          Barcelona, Spain • Europe
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-amber-200">
                        <div className="text-xs text-amber-700">
                          These elements preserve authenticity and avoid confusion
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Original Content Callout */}
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
                          {tourStep + 1} of {languageSteps.length}
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-black h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((tourStep + 1) / languageSteps.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Languages className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Explore Language Features
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Click on any numbered callout to learn about language and currency features, or start the guided tour to explore everything step by step.
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
            {languageSteps.map((step) => (
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
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Pro Tips for Language & Currency</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Language Best Practices
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Your language preference is automatically saved</li>
                <li>• All features work identically across languages</li>
                <li>• Festival names stay original to avoid confusion</li>
                <li>• Date formats adjust to local conventions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Currency Tips
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Currency auto-detects from your browser language</li>
                <li>• Conversion rates update daily for accuracy</li>
                <li>• Helps with quick festival cost comparisons</li>
                <li>• Works with 12+ major world currencies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}