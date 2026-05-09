import { useState, useMemo } from 'react';
import { type Festival, continents, months } from '../data/festivals';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Edit, Trash2, Download, Upload, Copy, Database, AlertTriangle, Save, X, Calendar, Search, CheckCircle, Instagram, Code2, ClipboardCheck } from 'lucide-react';
import { EnhancedAutocompleteSearch } from './EnhancedAutocompleteSearch';
import { Checkbox } from './ui/checkbox';
import { ArtistsInput } from './ArtistsInput';
import { SafeArtistsDisplay } from './SafeArtistsDisplay';

import { toast } from "sonner";

import { validateFestival, generateFestivalId, suggestCoordinates, calculateDataQualityScore } from '../utils/festivalValidation';
import { SmartFestivalForm } from './SmartFestivalForm';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SimpleDataExport } from './SimpleDataExport';
import { supabaseFestivalService } from '../services/supabase';
import { getFestivalYear, extractYearFromDateString, setYearInDateString, getFestivalSortPriority, isFestivalPast } from '../utils/dateUtils';
import { formatFestivalPrice } from '../utils/priceUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { ArtistManagement } from './ArtistManagement';
import { FestivalAttention } from './FestivalAttention';
import { InstagramContentCreator } from './InstagramContentCreator';
import { FestivalFactCheck } from './FestivalFactCheck';

interface FestivalManagementProps {
  festivals: Festival[];
  onUpdateFestivals: (festivals: Festival[]) => void;
  onClose: () => void;
}

export function EnhancedFestivalManagement({ festivals, onUpdateFestivals, onClose }: FestivalManagementProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("festivals");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedFestivals, setSelectedFestivals] = useState<string[]>([]);
  const [editingFestival, setEditingFestival] = useState<Festival | null>(null);
  const [isAddingFestival, setIsAddingFestival] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [festivalToDelete, setFestivalToDelete] = useState<Festival | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Sort festivals chronologically for the management table
  const sortedFestivals = useMemo(() => {
    return [...festivals].sort((a, b) => {
      const priorityA = getFestivalSortPriority(a.dates);
      const priorityB = getFestivalSortPriority(b.dates);
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      return a.name.localeCompare(b.name);
    });
  }, [festivals]);

  // Filter festivals for the table
  const filteredFestivals = useMemo(() => {
    return sortedFestivals.filter(festival => {
      const continentMatch = selectedContinent === "All" || festival.continent === selectedContinent;
      const monthMatch = selectedMonth === "All" || (festival.months ?? []).some(month => month === selectedMonth);
      const searchMatch = searchQuery === "" || 
        festival.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        festival.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        festival.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        festival.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(festival.artists) && festival.artists.length > 0 && 
         festival.artists.some(artist => 
           typeof artist === 'string' && artist.toLowerCase().includes(searchQuery.toLowerCase())
         ));
      
      return continentMatch && monthMatch && searchMatch;
    });
  }, [sortedFestivals, selectedContinent, selectedMonth, searchQuery]);

  // Separate current and past festivals
  const currentFestivals = useMemo(() => {
    return filteredFestivals.filter(festival => !isFestivalPast(festival.dates));
  }, [filteredFestivals]);

  const pastFestivals = useMemo(() => {
    return filteredFestivals.filter(festival => isFestivalPast(festival.dates));
  }, [filteredFestivals]);

  // Create empty festival template
  const createEmptyFestival = (): Festival => ({
    id: "",
    name: "",
    city: "",
    country: "",
    continent: "Europe",
    coordinates: [0, 0],
    price: "",
    months: [],
    dates: "",
    description: "",
    artists: [],
    instagram: ""
  });

  // Handle festival form submission
  const handleSaveFestival = async (festival: Festival) => {
    if (!festival.id || !festival.name || !festival.city || !festival.country) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingFestival) {
        // Update existing festival in database
        await supabaseFestivalService.updateFestival(festival);
        const updatedFestivals = festivals.map(f => f.id === festival.id ? festival : f);
        onUpdateFestivals(updatedFestivals);
        toast.success(`"${festival.name}" updated successfully!`);
      } else {
        // Check for existing ID
        if (festivals.some(f => f.id === festival.id)) {
          toast.error("Festival ID already exists");
          return;
        }
        
        // Add new festival to database
        await supabaseFestivalService.addFestival(festival);
        const updatedFestivals = [...festivals, festival];
        onUpdateFestivals(updatedFestivals);
        toast.success(`"${festival.name}" added successfully!`);
      }

      // Close dialogs after successful save with smooth transition
      setEditDialogOpen(false);
      setIsAddingFestival(false);
      
      // Clean up state after a brief delay to allow for smooth dialog closing
      setTimeout(() => {
        setEditingFestival(null);
      }, 150);
    } catch (error) {
      console.error('Festival save error:', error);
      toast.error("Failed to save festival. Please try again.");
    }
  };

  // Handle festival deletion
  const handleDeleteFestival = async (festivalId: string) => {
    try {
      const festival = festivals.find(f => f.id === festivalId);
      
      // Delete from database first
      await supabaseFestivalService.deleteFestival(festivalId);
      
      // Then update local state
      const updatedFestivals = festivals.filter(f => f.id !== festivalId);
      onUpdateFestivals(updatedFestivals);
      setDeleteDialogOpen(false);
      setFestivalToDelete(null);
      toast.success(`"${festival?.name}" deleted successfully`);
    } catch (error) {
      console.error('Festival delete error:', error);
      toast.error("Failed to delete festival. Please try again.");
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (festival: Festival) => {
    setFestivalToDelete(festival);
    setDeleteDialogOpen(true);
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      const count = selectedFestivals.length;
      
      // Delete each festival from database
      for (const festivalId of selectedFestivals) {
        await supabaseFestivalService.deleteFestival(festivalId);
      }
      
      // Update local state
      const updatedFestivals = festivals.filter(f => !selectedFestivals.includes(f.id));
      onUpdateFestivals(updatedFestivals);
      setSelectedFestivals([]);
      setBulkDeleteDialogOpen(false);
      toast.success(`${count} festival${count > 1 ? 's' : ''} deleted successfully`);
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error("Failed to delete some festivals. Please try again.");
    }
  };

  // Export festivals as JSON
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(festivals, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cuban-salsa-festivals-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("JSON file exported successfully!");
  };

  // Copy festivals data to clipboard as JSON
  const handleCopyJSON = () => {
    const dataStr = JSON.stringify(festivals, null, 2);
    navigator.clipboard.writeText(dataStr);
    toast.success("Festival JSON copied to clipboard!");
  };

  // Download a drop-in replacement for src/app/data/festivals.ts
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
      toast.success(`Downloaded festivals.ts — drop into src/app/data/`, {
        duration: 4000,
      });
    } catch (error) {
      console.error('Download festivals.ts failed:', error);
      toast.error("Failed to download. Please try again.");
    }
  };

  // Select/deselect all festivals
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFestivals(filteredFestivals.map(f => f.id));
    } else {
      setSelectedFestivals([]);
    }
  };

  // Select/deselect individual festival
  const handleSelectFestival = (festivalId: string, checked: boolean) => {
    if (checked) {
      setSelectedFestivals(prev => [...prev, festivalId]);
    } else {
      setSelectedFestivals(prev => prev.filter(id => id !== festivalId));
    }
  };

  // Handle opening edit dialog
  const handleOpenEditDialog = (festival: Festival) => {
    setEditingFestival(festival);
    setEditDialogOpen(true);
  };

  // Handle closing edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    // Small delay to prevent UI flicker before cleaning up the festival state
    setTimeout(() => {
      setEditingFestival(null);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 mb-1">Festival Management</h1>
              <p className="text-sm text-gray-600">Manage {festivals.length} festivals</p>
            </div>
            <button 
              onClick={onClose} 
              className="bg-gray-800 hover:bg-gray-900 text-white font-medium px-4 py-2 rounded text-sm"
            >
              ← Back to Calendar
            </button>
          </div>

          {/* Data Management Info Banner */}
          <div className="bg-gray-100 border border-gray-200 rounded p-3 mb-4">
            <div className="flex items-start gap-2">
              <Save className="h-4 w-4 text-gray-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Smart Festival Management</h3>
                <p className="text-gray-700 text-sm mb-1">
                  Festivals are automatically sorted chronologically. Coordinates are calculated from city names, and continents are auto-detected.
                </p>
                <p className="text-gray-600 text-xs">
                  Add years to date strings (e.g., "Jan 10-12 2025") for precise year control. Location data is enhanced using geocoding services.
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <EnhancedAutocompleteSearch
              festivals={festivals}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Search festivals, cities, countries, artists, or IDs..."
              className="w-full"
            />

            <div className="flex items-center gap-3 flex-wrap">
              <Select value={selectedContinent} onValueChange={setSelectedContinent}>
                <SelectTrigger className="w-32 h-9 rounded border border-gray-300 bg-white text-sm">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {continents.map((continent) => (
                    <SelectItem key={continent} value={continent}>
                      {continent === "All" ? "All Regions" : continent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-32 h-9 rounded border border-gray-300 bg-white text-sm">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month === "All" ? "All Months" : month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 ml-auto">
                <Dialog open={isAddingFestival} onOpenChange={setIsAddingFestival}>
                  <DialogTrigger asChild>
                    <button className="h-9 px-3 rounded bg-gray-800 hover:bg-gray-900 text-white text-sm">
                      <Plus className="h-3 w-3 mr-1 inline" />
                      Add Festival
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200">
                    <DialogHeader>
                      <DialogTitle>Add New Festival</DialogTitle>
                      <DialogDescription className="text-sm text-gray-600">
                        Fill in the details to add a new festival. Coordinates will be automatically calculated from the city name.
                      </DialogDescription>
                    </DialogHeader>
                    <SmartFestivalForm
                      festival={createEmptyFestival()}
                      onSave={handleSaveFestival}
                      onCancel={() => {
                        setIsAddingFestival(false);
                        setEditingFestival(null);
                      }}
                      allFestivals={festivals}
                    />
                  </DialogContent>
                </Dialog>

                <button
                  onClick={handleDownloadCodeFile}
                  className="h-9 px-3 rounded bg-black hover:bg-gray-800 text-white text-sm"
                  title="Download drop-in replacement for src/app/data/festivals.ts"
                >
                  <Code2 className="h-3 w-3 mr-1 inline" />
                  Download festivals.ts
                </button>

                <button
                  onClick={handleExportJSON}
                  className="h-9 px-3 rounded border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm"
                  title="JSON backup with timestamp + version envelope"
                >
                  <Download className="h-3 w-3 mr-1 inline" />
                  Backup
                </button>

                <button
                  onClick={handleCopyJSON}
                  className="h-9 px-3 rounded border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm"
                  title="Copy bare JSON array to clipboard"
                >
                  <Copy className="h-3 w-3 mr-1 inline" />
                  Copy
                </button>

                {selectedFestivals.length > 0 && (
                  <button
                    onClick={() => setBulkDeleteDialogOpen(true)}
                    className="h-9 px-3 rounded border border-gray-300 hover:bg-red-600 hover:text-white text-red-600 text-sm"
                  >
                    <Trash2 className="h-3 w-3 mr-1 inline" />
                    Delete ({selectedFestivals.length})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-gray-100">
            <TabsTrigger value="festivals" className="flex items-center gap-2 text-sm">
              <Calendar className="h-3 w-3" />
              <span className="hidden sm:inline">Festival Management</span>
              <span className="sm:hidden">Festivals</span>
            </TabsTrigger>
            <TabsTrigger value="attention" className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-3 w-3" />
              <span className="hidden sm:inline">Needs Attention</span>
              <span className="sm:hidden">Attention</span>
            </TabsTrigger>
            <TabsTrigger value="factcheck" className="flex items-center gap-2 text-sm">
              <ClipboardCheck className="h-3 w-3" />
              <span className="hidden sm:inline">Fact-check</span>
              <span className="sm:hidden">Check</span>
            </TabsTrigger>
            <TabsTrigger value="artists" className="flex items-center gap-2 text-sm">
              <Database className="h-3 w-3" />
              <span className="hidden sm:inline">Artist Database</span>
              <span className="sm:hidden">Artists</span>
            </TabsTrigger>
            <TabsTrigger value="instagram" className="flex items-center gap-2 text-sm">
              <Instagram className="h-3 w-3" />
              Instagram
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2 text-sm">
              <Download className="h-3 w-3" />
              <span className="hidden sm:inline">Export/Import</span>
              <span className="sm:hidden">Export</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="festivals" className="space-y-4">
            {/* Current Festivals Section */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-green-50">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium text-gray-900">
                    Current & Upcoming Festivals ({currentFestivals.length})
                    <span className="ml-2 text-xs text-gray-600 bg-white px-2 py-1 rounded">
                      Chronologically Sorted
                    </span>
                  </h2>
                  {currentFestivals.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedFestivals.length === currentFestivals.length && currentFestivals.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedFestivals(currentFestivals.map(f => f.id));
                          } else {
                            setSelectedFestivals([]);
                          }
                        }}
                      />
                      <Label className="text-sm">Select All</Label>
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Select</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Artists</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentFestivals.map((festival) => (
                      <TableRow key={festival.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedFestivals.includes(festival.id)}
                            onCheckedChange={(checked) => handleSelectFestival(festival.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {getFestivalYear(festival.dates)}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">{festival.name}</TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">{festival.dates}</div>
                          <div className="text-xs text-gray-500">
                            {extractYearFromDateString(festival.dates) ? 
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Explicit
                              </span> : 
                              <span className="text-gray-600">Auto: 2025</span>
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{festival.city}</div>
                            <div className="text-sm text-gray-500">{festival.country}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{festival.continent}</Badge>
                        </TableCell>
                        <TableCell>
                          <SafeArtistsDisplay artists={festival.artists} maxDisplay={2} />
                        </TableCell>
                        <TableCell className="text-sm">{formatFestivalPrice(festival.price, t)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEditDialog(festival)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDeleteDialog(festival)}
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {currentFestivals.length === 0 && (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <Search className="h-16 w-16 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No current festivals found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
            </div>

            {/* Past Events Section */}
            {pastFestivals.length > 0 && (
              <div className="bg-white rounded border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h2 className="font-medium text-gray-900">
                      Past Events ({pastFestivals.length})
                      <span className="ml-2 text-xs text-gray-600 bg-white px-2 py-1 rounded">
                        Update dates for next year or remove
                      </span>
                    </h2>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-12">Select</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Artists</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastFestivals.map((festival) => (
                        <TableRow key={festival.id} className="bg-gray-50/50">
                          <TableCell>
                            <Checkbox
                              checked={selectedFestivals.includes(festival.id)}
                              onCheckedChange={(checked) => handleSelectFestival(festival.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell>
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                              {getFestivalYear(festival.dates)}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium text-gray-700">{festival.name}</TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-700">{festival.dates}</div>
                            <div className="text-xs text-gray-500">
                              {extractYearFromDateString(festival.dates) ? 
                                <span className="text-green-600 flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Explicit
                                </span> : 
                                <span className="text-gray-600">Auto: 2025</span>
                              }
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-700">{festival.city}</div>
                              <div className="text-sm text-gray-500">{festival.country}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-gray-200">{festival.continent}</Badge>
                          </TableCell>
                          <TableCell>
                            <SafeArtistsDisplay artists={festival.artists} maxDisplay={2} />
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{formatFestivalPrice(festival.price, t)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenEditDialog(festival)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openDeleteDialog(festival)}
                                className="h-8 w-8 p-0 text-red-600 hover:bg-red-600 hover:text-white"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="attention" className="space-y-6">
            <FestivalAttention
              festivals={festivals}
              onEditFestival={handleOpenEditDialog}
            />
          </TabsContent>

          <TabsContent value="factcheck" className="space-y-6">
            <FestivalFactCheck
              festivals={festivals}
              onEditFestival={handleOpenEditDialog}
              onDeleteFestival={openDeleteDialog}
            />
          </TabsContent>

          <TabsContent value="artists" className="space-y-6">
            <ArtistManagement festivals={festivals} />
          </TabsContent>

          <TabsContent value="instagram" className="space-y-6">
            <InstagramContentCreator festivals={festivals} />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <SimpleDataExport 
              festivals={festivals} 
              onUpdateFestivals={onUpdateFestivals}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-gray-700" />
              Delete Festival
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              This action cannot be undone. The festival will be permanently removed from the calendar.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 text-sm">
              Are you sure you want to delete <strong>"{festivalToDelete?.name}"</strong>? 
              This action cannot be undone and will permanently remove the festival from the calendar.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDeleteDialogOpen(false)}
              className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => festivalToDelete && handleDeleteFestival(festivalToDelete.id)}
              className="px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Delete Festival
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Festival Dialog - Controlled */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200">
          <DialogHeader>
            <DialogTitle>Edit Festival</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Modify festival details with smart coordinate calculation and continent auto-detection.
            </DialogDescription>
          </DialogHeader>
          {editingFestival && (
            <SmartFestivalForm
              festival={editingFestival}
              onSave={handleSaveFestival}
              onCancel={handleCloseEditDialog}
              allFestivals={festivals}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-gray-700" />
              Delete {selectedFestivals.length} Festival{selectedFestivals.length > 1 ? 's' : ''}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              This action cannot be undone. All selected festivals will be permanently removed from the calendar.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 text-sm">
              Are you sure you want to delete {selectedFestivals.length} selected festival{selectedFestivals.length > 1 ? 's' : ''}? 
              This action cannot be undone and will permanently remove the festival{selectedFestivals.length > 1 ? 's' : ''} from the calendar.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setBulkDeleteDialogOpen(false)}
              className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Delete {selectedFestivals.length} Festival{selectedFestivals.length > 1 ? 's' : ''}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}