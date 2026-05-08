import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Settings,
  Shield,
  Database,
  Upload,
  Download,
  Edit,
  Plus,
  Key,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Lock,
  CheckCircle,
  FileSpreadsheet,
  BarChart3,
} from 'lucide-react';

interface InteractiveManagementTutorialProps {
  onClose?: () => void;
}

type ManagementStep = {
  id: number;
  title: string;
  description: string;
  details: string[];
  position: { top?: string; left?: string; right?: string; bottom?: string };
  element: string;
};

const managementSteps: ManagementStep[] = [
  {
    id: 1,
    title: 'Admin Mode Activation',
    description: 'Access administrative features by clicking the site title "Cuban Salsa Calendar" 4 times quickly to activate admin mode.',
    details: [
      'Click the site title 4 times in quick succession',
      'Admin mode icon appears in the header',
      'Must be activated before accessing management',
      'Hidden activation prevents accidental access',
      'Resets if you wait too long between clicks'
    ],
    position: { top: '-12', left: '0' },
    element: 'admin-activation'
  },
  {
    id: 2,
    title: 'Password Protection',
    description: 'Administrative features are protected by a password (nestitin021*) to maintain data integrity and prevent unauthorized changes.',
    details: [
      'Password required: nestitin021*',
      'Protects live festival database',
      'Prevents unauthorized modifications',
      'Maintains data quality and consistency',
      'Access is logged for security purposes'
    ],
    position: { top: '0', left: '-12' },
    element: 'password-protection'
  },
  {
    id: 3,
    title: 'Festival Editor',
    description: 'Add, edit, and manage individual festivals with a comprehensive form-based interface that includes validation.',
    details: [
      'Visual form with real-time validation',
      'Add new festivals with all details',
      'Edit existing festival information',
      'Automatic date parsing and formatting',
      'Artist lineup management',
      'Price and duration calculations'
    ],
    position: { right: '-12', top: '0' },
    element: 'festival-editor'
  },
  {
    id: 4,
    title: 'Bulk Operations',
    description: 'Import multiple festivals from CSV files or make batch updates to existing festival data.',
    details: [
      'CSV import for multiple festivals at once',
      'Batch price updates across festivals',
      'Global artist name changes and corrections',
      'Date format standardization tools',
      'Duplicate detection and removal',
      'Data validation and error reporting'
    ],
    position: { right: '0', bottom: '-12' },
    element: 'bulk-operations'
  },
  {
    id: 5,
    title: 'Data Export & Analytics',
    description: 'Export festival data and generate comprehensive reports for analysis and backup purposes.',
    details: [
      'Export complete festival database as CSV',
      'Generate artist analytics and statistics',
      'Geographic distribution analysis reports',
      'Pricing trend analysis over time',
      'Custom filtered exports for specific needs',
      'Backup and data portability features'
    ],
    position: { left: '0', bottom: '-12' },
    element: 'data-export'
  }
];

export function InteractiveManagementTutorial({ onClose }: InteractiveManagementTutorialProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [tourMode, setTourMode] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [adminActivated, setAdminActivated] = useState(false);
  const [passwordEntered, setPasswordEntered] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Auto-tour functionality
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    
    if (isPlaying && tourMode) {
      interval = setInterval(() => {
        setTourStep((prev) => {
          const next = (prev + 1) % managementSteps.length;
          setActiveStep(managementSteps[next].id);
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
    setActiveStep(managementSteps[0].id);
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
    if (tourStep < managementSteps.length - 1) {
      const newStep = tourStep + 1;
      setTourStep(newStep);
      setActiveStep(managementSteps[newStep].id);
    }
  };

  const prevStep = () => {
    if (tourStep > 0) {
      const newStep = tourStep - 1;
      setTourStep(newStep);
      setActiveStep(managementSteps[newStep].id);
    }
  };

  const getActiveStep = () => {
    return managementSteps.find(step => step.id === activeStep);
  };

  const handleTitleClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount >= 3) {
      setAdminActivated(true);
      setClickCount(0);
    }
  };

  const simulatePasswordEntry = () => {
    setPasswordEntered(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Interactive Management Features Tutorial
              </h1>
              <p className="text-gray-600">
                Learn how to access and use the administrative tools for managing the festival database.
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
                    {tourStep + 1} / {managementSteps.length}
                  </span>
                  <Button
                    onClick={nextStep}
                    disabled={tourStep === managementSteps.length - 1}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}

            <div className="text-sm text-gray-500 ml-auto">
              Click any numbered callout to explore management features
            </div>
          </div>

          {/* Security Warning */}
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800 mb-1">Administrative Access Required</h3>
              <p className="text-sm text-red-700">
                Management features modify the live festival database. This tutorial shows the interface without making actual changes. Real access requires proper authentication and should be used with caution.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive Management Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg border border-gray-200 sticky top-4">
              <h3 className="text-lg font-semibold mb-6 text-center text-gray-800">
                Interactive Management Interface Demo
              </h3>
              
              <div className="space-y-6">
                {/* Admin Activation Section */}
                <div className="relative" data-element="admin-activation">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 mb-2">Step 1: Activate Admin Mode</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Click the site title 4 times quickly ({clickCount}/4)
                      </p>
                      <button
                        onClick={handleTitleClick}
                        className={`text-lg font-semibold px-4 py-2 rounded transition-all duration-200 ${
                          adminActivated 
                            ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-2 border-gray-300'
                        }`}
                      >
                        Cuban Salsa Calendar
                      </button>
                      {adminActivated && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          Admin mode activated!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Activation Callout */}
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

                {/* Password Protection Section */}
                <div className="relative" data-element="password-protection">
                  <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-yellow-900 mb-2">Step 2: Enter Admin Password</h4>
                        <div className="flex items-center gap-3 mb-3">
                          <input
                            type="password"
                            placeholder="Enter admin password..."
                            className="flex-1 px-3 py-2 border border-yellow-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                            disabled={!adminActivated}
                          />
                          <Button
                            onClick={simulatePasswordEntry}
                            disabled={!adminActivated || passwordEntered}
                            size="sm"
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          >
                            {passwordEntered ? <CheckCircle className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                          </Button>
                        </div>
                        <p className="text-xs text-yellow-800">
                          Password: <code className="bg-yellow-200 px-1 rounded">nestitin021*</code>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Password Protection Callout */}
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

                {/* Festival Editor Section */}
                <div className="relative" data-element="festival-editor">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Festival Editor Interface
                  </h4>
                  <div className={`border rounded-lg p-4 ${passwordEntered ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300 opacity-60'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Festival Name</label>
                        <input
                          type="text"
                          placeholder="Barcelona Salsa Congress 2024"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          disabled={!passwordEntered}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          placeholder="Barcelona, Spain"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          disabled={!passwordEntered}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          disabled={!passwordEntered}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input
                          type="text"
                          placeholder="€150"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          disabled={!passwordEntered}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button 
                        size="sm" 
                        disabled={!passwordEntered}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Festival
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={!passwordEntered}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Update Existing
                      </Button>
                    </div>
                  </div>

                  {/* Festival Editor Callout */}
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

                {/* Bulk Operations Section */}
                <div className="relative" data-element="bulk-operations">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Bulk Operations
                  </h4>
                  <div className={`border rounded-lg p-4 ${passwordEntered ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300 opacity-60'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-3">
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Upload className="w-4 h-4 text-blue-600" />
                          Import Data
                        </h5>
                        <p className="text-sm text-gray-600 mb-3">
                          Import multiple festivals from CSV files
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          disabled={!passwordEntered}
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Choose CSV File
                        </Button>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-3">
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-green-600" />
                          Batch Updates
                        </h5>
                        <p className="text-sm text-gray-600 mb-3">
                          Update multiple festivals at once
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          disabled={!passwordEntered}
                          className="w-full"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Batch Edit
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Bulk Operations Callout */}
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

                {/* Data Export Section */}
                <div className="relative" data-element="data-export">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Data Export & Analytics
                  </h4>
                  <div className={`border rounded-lg p-4 ${passwordEntered ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300 opacity-60'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={!passwordEntered}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4 text-blue-600" />
                        Export CSV
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={!passwordEntered}
                        className="flex items-center gap-2"
                      >
                        <BarChart3 className="w-4 h-4 text-green-600" />
                        Analytics Report
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={!passwordEntered}
                        className="flex items-center gap-2"
                      >
                        <Database className="w-4 h-4 text-purple-600" />
                        Full Backup
                      </Button>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                      <h5 className="font-medium text-blue-900 mb-1">Export Options</h5>
                      <ul className="text-xs text-blue-800 space-y-1">
                        <li>• Complete festival database as CSV</li>
                        <li>• Artist performance statistics</li>
                        <li>• Geographic distribution reports</li>
                        <li>• Pricing analysis over time</li>
                      </ul>
                    </div>
                  </div>

                  {/* Data Export Callout */}
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

                {/* Security Notice */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-red-800 mb-2">Security & Backup</h5>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• All changes are made to the live database</li>
                        <li>• Regular automatic backups are maintained</li>
                        <li>• Double-check all changes before saving</li>
                        <li>• Use bulk operations with extra caution</li>
                        <li>• Contact admin if you need help with recovery</li>
                      </ul>
                    </div>
                  </div>
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
                          {tourStep + 1} of {managementSteps.length}
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-black h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((tourStep + 1) / managementSteps.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Explore Management Features
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Click on any numbered callout to learn about management capabilities, or start the guided tour to explore everything step by step.
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
            {managementSteps.map((step) => (
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

        {/* Important Warnings */}
        <div className="mt-8 bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-xl font-semibold mb-4 text-red-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Important Security Notices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-red-700 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Data Protection
              </h4>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• Never share admin credentials with unauthorized users</li>
                <li>• Always double-check changes before saving</li>
                <li>• Regular backups are maintained automatically</li>
                <li>• Use bulk operations with extreme caution</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-red-700 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Best Practices
              </h4>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• Test changes on a small scale first</li>
                <li>• Keep a local backup before major changes</li>
                <li>• Validate data formats before importing</li>
                <li>• Monitor the live site after making changes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}