import { useState, useMemo } from 'react';
import { type Festival } from '../data/festivals';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Search, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ArtistManagementProps {
  festivals: Festival[];
}

interface ArtistInfo {
  name: string;
  appearanceCount: number;
  festivals: {
    name: string;
    id: string;
    city: string;
    country: string;
    dates: string;
  }[];
}

export function ArtistManagement({ festivals }: ArtistManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Extract and analyze all artists
  const artistsData = useMemo(() => {
    const artistMap = new Map<string, ArtistInfo>();

    festivals.forEach(festival => {
      if (Array.isArray(festival.artists) && festival.artists.length > 0) {
        festival.artists.forEach(artist => {
          if (typeof artist === 'string' && artist.trim()) {
            const artistName = artist.trim();
            
            if (artistMap.has(artistName)) {
              const existing = artistMap.get(artistName)!;
              existing.appearanceCount++;
              existing.festivals.push({
                name: festival.name,
                id: festival.id,
                city: festival.city,
                country: festival.country,
                dates: festival.dates
              });
            } else {
              artistMap.set(artistName, {
                name: artistName,
                appearanceCount: 1,
                festivals: [{
                  name: festival.name,
                  id: festival.id,
                  city: festival.city,
                  country: festival.country,
                  dates: festival.dates
                }]
              });
            }
          }
        });
      }
    });

    // Convert to array and sort alphabetically by name
    return Array.from(artistMap.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }, [festivals]);

  // Filter artists based on search query
  const filteredArtists = useMemo(() => {
    if (!searchQuery.trim()) {
      return artistsData;
    }

    const query = searchQuery.toLowerCase();
    return artistsData.filter(artist => 
      artist.name.toLowerCase().includes(query) ||
      artist.festivals.some(festival => 
        festival.name.toLowerCase().includes(query) ||
        festival.city.toLowerCase().includes(query) ||
        festival.country.toLowerCase().includes(query)
      )
    );
  }, [artistsData, searchQuery]);

  // Calculate statistics
  const totalArtists = artistsData.length;
  const totalAppearances = artistsData.reduce((sum, artist) => sum + artist.appearanceCount, 0);
  const averageAppearances = totalArtists > 0 ? (totalAppearances / totalArtists).toFixed(1) : 0;
  const topArtist = artistsData.length > 0 ? artistsData[0] : null;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Artists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-gray-900">{totalArtists}</div>
            <p className="text-xs text-gray-500 mt-1">Unique artists across all festivals</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Appearances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-gray-900">{totalAppearances}</div>
            <p className="text-xs text-gray-500 mt-1">Average: {averageAppearances} per artist</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Most Featured
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topArtist ? (
              <>
                <div className="text-lg font-semibold text-gray-900 truncate">{topArtist.name}</div>
                <p className="text-xs text-gray-500 mt-1">{topArtist.appearanceCount} festivals</p>
              </>
            ) : (
              <div className="text-sm text-gray-500">No artists yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search artists, festivals, cities, or countries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10 border-gray-300"
        />
      </div>

      {/* Artists Table */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-900">
            {filteredArtists.length} of {totalArtists} artists
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Artist Name</TableHead>
                <TableHead className="w-32">Appearances</TableHead>
                <TableHead>Featured In</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArtists.map((artist, index) => (
                <TableRow key={artist.name}>
                  <TableCell className="text-gray-500 text-sm">{index + 1}</TableCell>
                  <TableCell className="font-medium">{artist.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-900">
                      {artist.appearanceCount} {artist.appearanceCount === 1 ? 'festival' : 'festivals'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 max-w-2xl">
                      {artist.festivals.map((festival, idx) => (
                        <div 
                          key={festival.id} 
                          className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-100"
                        >
                          <span className="font-medium">{festival.name}</span>
                          <span className="text-gray-500 mx-2">•</span>
                          <span className="text-gray-600">{festival.city}, {festival.country}</span>
                          <span className="text-gray-500 mx-2">•</span>
                          <span className="text-gray-500 text-xs">{festival.dates}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredArtists.length === 0 && (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Search className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No artists found</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search query' : 'No artists have been added to festivals yet'}
            </p>
          </div>
        )}
      </div>

      {/* Helper Info */}
      {filteredArtists.length > 0 && (
        <div className="bg-gray-100 border border-gray-200 rounded p-3">
          <p className="text-sm text-gray-700">
            Artists are sorted alphabetically by name. 
            You can search by artist name, festival name, city, or country to find specific artists.
          </p>
        </div>
      )}
    </div>
  );
}
