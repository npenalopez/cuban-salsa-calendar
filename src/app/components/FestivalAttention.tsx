import { useState, useMemo } from 'react';
import { type Festival } from '../data/festivals';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertTriangle, Edit, Calendar, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface FestivalAttentionProps {
  festivals: Festival[];
  onEditFestival: (festival: Festival) => void;
}

export function FestivalAttention({ festivals, onEditFestival }: FestivalAttentionProps) {
  const [activeTab, setActiveTab] = useState("all");

  // Analyze festivals for issues
  const festivalIssues = useMemo(() => {
    const noPriceFestivals: Festival[] = [];
    const noArtistsFestivals: Festival[] = [];
    const tbaArtistsFestivals: Festival[] = [];

    festivals.forEach(festival => {
      // Check for missing price
      if (!festival.price || festival.price.trim() === '' || festival.price === '-') {
        noPriceFestivals.push(festival);
      }

      // Check for missing artists
      if (!festival.artists || festival.artists.length === 0) {
        noArtistsFestivals.push(festival);
      } else {
        // Check for TBA/placeholder artists
        const isPlaceholder = (artist: string): boolean => {
          const trimmed = artist.trim();
          const artistLower = trimmed.toLowerCase();
          
          // Empty string
          if (trimmed === '') return true;
          
          // Just a dash or similar
          if (trimmed === '-' || trimmed === '--' || trimmed === '—') return true;
          
          // TBA variations
          if (artistLower === 'tba') return true;
          if (artistLower.includes('to be announced')) return true;
          if (artistLower.includes('t.b.a')) return true;
          if (artistLower.includes('tbd')) return true;
          if (artistLower.includes('to be determined')) return true;
          
          // Announced variations
          if (artistLower.includes('will be announced')) return true;
          if (artistLower.includes('soon announced')) return true;
          if (artistLower.includes('announced soon')) return true;
          if (artistLower.includes('lineup announced')) return true;
          
          // Coming soon variations
          if (artistLower.includes('coming soon')) return true;
          if (artistLower.includes('soon')) return true;
          
          // Pending variations
          if (artistLower.includes('pending')) return true;
          if (artistLower.includes('not available')) return true;
          if (artistLower.includes('n/a')) return true;
          
          return false;
        };
        
        const hasTBA = festival.artists.some(artist => isPlaceholder(artist));
        
        if (hasTBA) {
          tbaArtistsFestivals.push(festival);
        }
      }
    });

    return {
      noPrice: noPriceFestivals,
      noArtists: noArtistsFestivals,
      tbaArtists: tbaArtistsFestivals
    };
  }, [festivals]);

  // Get all festivals needing attention (deduplicated)
  const allNeedingAttention = useMemo(() => {
    const festivalMap = new Map<string, Festival>();
    
    [...festivalIssues.noPrice, ...festivalIssues.noArtists, ...festivalIssues.tbaArtists].forEach(festival => {
      festivalMap.set(festival.id, festival);
    });
    
    return Array.from(festivalMap.values());
  }, [festivalIssues]);

  const renderFestivalTable = (festivals: Festival[], issueType: string) => {
    if (festivals.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <Calendar className="h-16 w-16 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">All Good!</h3>
          <p className="text-gray-500">No festivals with this issue</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Festival Name</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {festivals.map((festival) => {
              const isPlaceholder = (artist: string): boolean => {
                const trimmed = artist.trim();
                const artistLower = trimmed.toLowerCase();
                
                if (trimmed === '') return true;
                if (trimmed === '-' || trimmed === '--' || trimmed === '—') return true;
                if (artistLower === 'tba') return true;
                if (artistLower.includes('to be announced')) return true;
                if (artistLower.includes('t.b.a')) return true;
                if (artistLower.includes('tbd')) return true;
                if (artistLower.includes('to be determined')) return true;
                if (artistLower.includes('will be announced')) return true;
                if (artistLower.includes('soon announced')) return true;
                if (artistLower.includes('announced soon')) return true;
                if (artistLower.includes('lineup announced')) return true;
                if (artistLower.includes('coming soon')) return true;
                if (artistLower.includes('soon')) return true;
                if (artistLower.includes('pending')) return true;
                if (artistLower.includes('not available')) return true;
                if (artistLower.includes('n/a')) return true;
                
                return false;
              };
              
              const issues: string[] = [];
              if (!festival.price || festival.price.trim() === '' || festival.price === '-') {
                issues.push('No price');
              }
              if (!festival.artists || festival.artists.length === 0) {
                issues.push('No artists');
              } else {
                const hasTBA = festival.artists.some(artist => isPlaceholder(artist));
                if (hasTBA) {
                  issues.push('Artists TBA');
                }
              }

              return (
                <TableRow key={festival.id}>
                  <TableCell className="font-medium">{festival.name}</TableCell>
                  <TableCell className="text-sm text-gray-700">{festival.dates}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{festival.city}</div>
                      <div className="text-xs text-gray-500">{festival.country}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {issues.map((issue, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-yellow-100 text-yellow-800 border border-yellow-200">
                          {issue}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditFestival(festival)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-gray-900">{allNeedingAttention.length}</div>
            <p className="text-xs text-gray-500 mt-1">Festivals with missing data</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Missing Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-gray-900">{festivalIssues.noPrice.length}</div>
            <p className="text-xs text-gray-500 mt-1">Festivals without price info</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              No Artists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-gray-900">{festivalIssues.noArtists.length}</div>
            <p className="text-xs text-gray-500 mt-1">Festivals with no artists listed</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Artists TBA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-gray-900">{festivalIssues.tbaArtists.length}</div>
            <p className="text-xs text-gray-500 mt-1">Artists to be announced</p>
          </CardContent>
        </Card>
      </div>

      {/* Info Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-700 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-900 mb-1">Data Quality Check</h3>
            <p className="text-yellow-800 text-sm">
              These festivals are missing important information. Click the edit button to update the festival details.
            </p>
          </div>
        </div>
      </div>

      {/* Tabbed View */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-gray-200">
            <TabsList className="bg-transparent w-full justify-start rounded-none h-auto p-0">
              <TabsTrigger 
                value="all" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-4 py-3"
              >
                All Issues ({allNeedingAttention.length})
              </TabsTrigger>
              <TabsTrigger 
                value="no-price" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-4 py-3"
              >
                No Price ({festivalIssues.noPrice.length})
              </TabsTrigger>
              <TabsTrigger 
                value="no-artists" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-4 py-3"
              >
                No Artists ({festivalIssues.noArtists.length})
              </TabsTrigger>
              <TabsTrigger 
                value="tba-artists" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-4 py-3"
              >
                Artists TBA ({festivalIssues.tbaArtists.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="m-0">
            {renderFestivalTable(allNeedingAttention, 'all')}
          </TabsContent>

          <TabsContent value="no-price" className="m-0">
            {renderFestivalTable(festivalIssues.noPrice, 'no-price')}
          </TabsContent>

          <TabsContent value="no-artists" className="m-0">
            {renderFestivalTable(festivalIssues.noArtists, 'no-artists')}
          </TabsContent>

          <TabsContent value="tba-artists" className="m-0">
            {renderFestivalTable(festivalIssues.tbaArtists, 'tba-artists')}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
