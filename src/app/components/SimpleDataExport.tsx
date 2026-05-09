import { useState } from 'react';
import { type Festival } from '../data/festivals';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Download, Upload, Copy, FileText, AlertCircle, CheckCircle, Code2 } from 'lucide-react';
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

  // Copy a bare Festival[] JSON array to the clipboard, ready to paste
  // between the brackets of `export const festivals: Festival[] = [...];`
  // in src/app/data/festivals.ts. No envelope, no metadata.
  const handleCopyForCode = () => {
    try {
      const arrayLiteral = supabaseFestivalService.exportFestivalsAsArray(festivals);
      navigator.clipboard.writeText(arrayLiteral);
      toast.success(`${festivals.length} festivals copied as a bare array — paste inside festivals.ts brackets`, {
        duration: 4000,
      });
    } catch (error) {
      console.error('Copy-for-code failed:', error);
      toast.error("Failed to copy. Please try again.");
    }
  };

  // Download a complete drop-in replacement for festivals.ts
  const handleDownloadCodeFile = () => {
    try {
      const code = supabaseFestivalService.exportFestivalsAsCodeFile(festivals);
      const blob = new Blob([code], { type: 'text/typescript' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'festivals.ts';
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`Downloaded festivals.ts — drop into src/app/data/ to replace`, {
        duration: 4000,
      });
    } catch (error) {
      console.error('Download festivals.ts failed:', error);
      toast.error("Failed to download. Please try again.");
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

      {/* Export FOR CODE — drop-in for src/app/data/festivals.ts */}
      <Card className="border-black border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Export for festivals.ts
          </CardTitle>
          <CardDescription>
            Use this when you've finished editing here and want to commit the
            new list back to the repo. No envelope, no metadata — just the raw
            <code className="mx-1 px-1 bg-gray-100 rounded">Festival[]</code> array
            ready to paste into the source file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={handleCopyForCode}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy as JSON array
            </Button>

            <Button
              variant="outline"
              onClick={handleDownloadCodeFile}
              className="border-black"
            >
              <Download className="h-4 w-4 mr-2" />
              Download festivals.ts
            </Button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs space-y-2 text-gray-700">
            <p className="font-semibold">Workflow:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Edit the list visually here (add / edit / delete).</li>
              <li>Click <strong>Download festivals.ts</strong> and replace
                <code className="mx-1 px-1 bg-white border rounded">src/app/data/festivals.ts</code>
                in the repo. (Or use <strong>Copy as JSON array</strong> and paste between the brackets in the existing file.)</li>
              <li>Bump <code className="mx-1 px-1 bg-white border rounded">SEED_VERSION</code> in
                <code className="mx-1 px-1 bg-white border rounded">src/app/services/supabase.ts</code>
                so visitors' caches refresh.</li>
              <li><code className="px-1 bg-white border rounded">git add &amp;&amp; git commit &amp;&amp; git push</code>.</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Export Section (legacy backup format with envelope) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Backup (envelope JSON)
          </CardTitle>
          <CardDescription>
            Wrapped JSON with timestamp + version metadata — useful for
            archive backups, but not for editing the source file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleExportJSON}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Download backup file
            </Button>

            <Button
              variant="outline"
              onClick={handleCopyJSON}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy backup to clipboard
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            Includes all {festivals.length} festivals plus exportedAt / version / source metadata.
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
            Edits live in your browser's localStorage only. To make them visible
            to other visitors, export the new <code>festivals.ts</code> from the
            card above and commit it to the repo.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}