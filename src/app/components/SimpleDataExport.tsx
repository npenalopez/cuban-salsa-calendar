import { useState } from 'react';
import { type Festival } from '../data/festivals';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Download, Upload, Copy, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from "sonner";
import { supabaseFestivalService } from '../services/supabase';

interface SimpleDataExportProps {
  festivals: Festival[];
  onUpdateFestivals: (festivals: Festival[]) => void;
}

export function SimpleDataExport({ festivals, onUpdateFestivals }: SimpleDataExportProps) {
  const [importData, setImportData] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Export festivals as JSON
  const handleExportJSON = () => {
    try {
      const exportData = supabaseFestivalService.exportFestivals(festivals);
      const dataBlob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cuban-salsa-festivals-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Festival data exported successfully! 📦");
    } catch (error) {
      console.error('Export failed:', error);
      toast.error("Failed to export festival data. Please try again.");
    }
  };

  // Copy festivals data to clipboard
  const handleCopyJSON = () => {
    try {
      const exportData = supabaseFestivalService.exportFestivals(festivals);
      navigator.clipboard.writeText(exportData);
      toast.success("Festival data copied to clipboard! 📋");
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error("Failed to copy festival data. Please try again.");
    }
  };

  // Import festivals from JSON
  const handleImportJSON = async () => {
    if (!importData.trim()) {
      toast.error("Please paste your festival data first");
      return;
    }

    setIsImporting(true);
    try {
      const importedFestivals = supabaseFestivalService.importFestivals(importData);
      
      if (!Array.isArray(importedFestivals) || importedFestivals.length === 0) {
        throw new Error('No valid festival data found');
      }

      // Validate that each festival has required fields
      const validFestivals = importedFestivals.filter(festival => 
        festival.id && festival.name && festival.city && festival.country
      );

      if (validFestivals.length === 0) {
        throw new Error('No valid festivals found in the imported data');
      }

      // Replace all festivals in database
      await supabaseFestivalService.replaceFestivals(validFestivals);
      onUpdateFestivals(validFestivals);
      setImportData('');
      
      toast.success(`Successfully imported ${validFestivals.length} festival${validFestivals.length !== 1 ? 's' : ''}! 🎉`, {
        duration: 4000
      });

      if (validFestivals.length < importedFestivals.length) {
        toast.warning(`${importedFestivals.length - validFestivals.length} festival${importedFestivals.length - validFestivals.length !== 1 ? 's' : ''} were skipped due to missing required fields`, {
          duration: 6000
        });
      }
    } catch (error) {
      console.error('Import failed:', error);
      toast.error(`Import failed: ${error instanceof Error ? error.message : 'Invalid data format'}`, {
        duration: 5000
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Load sample data for testing
  const handleLoadSample = () => {
    const sampleData = {
      "festivals": [
        {
          "id": "sample-festival-madrid",
          "name": "Sample Madrid Salsa Festival",
          "city": "Madrid",
          "country": "Spain",
          "continent": "Europe",
          "coordinates": [40.4168, -3.7038],
          "price": "€150",
          "months": ["July"],
          "dates": "July 20-22, 2024",
          "description": "This is a sample festival for testing the import functionality."
        }
      ],
      "exportedAt": new Date().toISOString(),
      "version": "1.0.0"
    };
    
    setImportData(JSON.stringify(sampleData, null, 2));
  };

  // Get storage information (for now, we'll show database info)
  const storageInfo = {
    size: festivals.length * 1000, // Rough estimate
    lastUpdated: Date.now(),
    version: '2.0.0'
  };

  return (
    <div className="space-y-6">
      {/* Storage Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Data Storage Info
          </CardTitle>
          <CardDescription>
            Current storage status and data information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{festivals.length}</div>
              <div className="text-sm text-gray-600">Total Festivals</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(storageInfo.size / 1024)}KB
              </div>
              <div className="text-sm text-gray-600">Storage Used</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {storageInfo.lastUpdated ? 'Active' : 'None'}
              </div>
              <div className="text-sm text-gray-600">Data Status</div>
            </div>
          </div>
          
          {storageInfo.lastUpdated && (
            <div className="text-sm text-gray-600">
              Last updated: {new Date(storageInfo.lastUpdated).toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Festival Data
          </CardTitle>
          <CardDescription>
            Download or copy your festival collection as JSON for backup or sharing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleExportJSON}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download as File
            </Button>
            
            <Button
              variant="outline"
              onClick={handleCopyJSON}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            Export includes all {festivals.length} festivals with metadata and timestamps
          </div>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Festival Data
          </CardTitle>
          <CardDescription>
            Import festival data from JSON to replace your current collection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="import-data">Paste JSON Data</Label>
            <Textarea
              id="import-data"
              placeholder="Paste your festival JSON data here..."
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={handleImportJSON}
              disabled={!importData.trim() || isImporting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isImporting ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleLoadSample}
            >
              Load Sample Data
            </Button>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">Important Notes:</p>
                <ul className="text-yellow-700 space-y-1 text-xs">
                  <li>• Importing will replace all current festival data</li>
                  <li>• Make sure to export your current data first as backup</li>
                  <li>• Invalid festivals will be skipped automatically</li>
                  <li>• Changes are automatically saved to browser storage</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Tools for managing your stored festival data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await supabaseFestivalService.replaceFestivals([]);
                  onUpdateFestivals([]);
                  toast.success("Database cleared successfully");
                } catch (error) {
                  toast.error("Failed to clear database");
                }
              }}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Clear Database
            </Button>
            
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const stats = await supabaseFestivalService.getStats();
                  toast.info(`Database: ${stats.totalFestivals} festivals, Last updated: ${stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'Never'}`, {
                    duration: 5000
                  });
                } catch (error) {
                  toast.error("Failed to get database stats");
                }
              }}
            >
              Show Database Stats
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 mt-4">
            All data is stored in Supabase database and shared across all users.
            Festival admins can manage the collection and changes are visible to everyone.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}