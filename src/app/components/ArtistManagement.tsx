import { useMemo, useState } from 'react';
import { type Festival } from '../data/festivals';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Search, Users, TrendingUp, ArrowUpDown, AlertTriangle, X, Disc3, Music, Footprints } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  getArtistCategory,
  isNonArtistEntry,
  CATEGORY_LABEL,
  type ArtistCategory,
} from '../utils/artistCategory';

interface ArtistManagementProps {
  festivals: Festival[];
}

interface ArtistInfo {
  name: string;
  appearanceCount: number;
  category: ArtistCategory;
  festivals: {
    name: string;
    id: string;
    city: string;
    country: string;
    dates: string;
  }[];
}

// Same TBA / placeholder rules as artistAnalytics.shouldExcludeArtist —
// keeps placeholder strings out of the artist table.
const PLACEHOLDER_PATTERNS: RegExp[] = [
  /^-+$/,
  /^—$/,
  /^to be announced/i,
  /\btba\b/i,
  /t\.b\.a\./i,
  /^tbd$/i,
  /coming soon/i,
  /more artists/i,
  /lineup tbd/i,
  /announcement coming/i,
  /pending/i,
  /not available/i,
  /^n\/a$/i,
];

function isPlaceholderArtist(name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return true;
  if (PLACEHOLDER_PATTERNS.some(p => p.test(trimmed))) return true;
  // Also drop descriptive phrases / brand names ("19+ Cuban artists",
  // "Academia de Danza Carlos Acosta", etc.) so they don't pollute the
  // artist database.
  return isNonArtistEntry(trimmed);
}

// Normalize for duplicate detection: lowercase, strip punctuation, collapse
// whitespace. Catches "Maykel Blanco" vs "maykel  blanco." style duplicates.
function normalizeForCompare(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9À-ſ]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

type SortKey = 'name' | 'appearances';
type SortDir = 'asc' | 'desc';
type CategoryFilter = ArtistCategory | 'all';

export function ArtistManagement({ festivals }: ArtistManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [hideDups, setHideDups] = useState(false);
  const [showOnlyDups, setShowOnlyDups] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const artistsData = useMemo<ArtistInfo[]>(() => {
    const artistMap = new Map<string, ArtistInfo>();

    festivals.forEach(festival => {
      if (!Array.isArray(festival.artists) || festival.artists.length === 0) return;
      festival.artists.forEach(artist => {
        if (typeof artist !== 'string') return;
        const artistName = artist.trim();
        if (!artistName || isPlaceholderArtist(artistName)) return;

        const existing = artistMap.get(artistName);
        const entry = {
          name: festival.name,
          id: festival.id,
          city: festival.city,
          country: festival.country,
          dates: festival.dates,
        };
        if (existing) {
          existing.appearanceCount++;
          existing.festivals.push(entry);
        } else {
          artistMap.set(artistName, {
            name: artistName,
            appearanceCount: 1,
            category: getArtistCategory(artistName),
            festivals: [entry],
          });
        }
      });
    });

    return Array.from(artistMap.values());
  }, [festivals]);

  // Group artists by their normalized form. Any group with > 1 entry is a
  // potential duplicate-spelling cluster the user might want to merge.
  const dupGroups = useMemo(() => {
    const groups = new Map<string, string[]>();
    for (const a of artistsData) {
      const key = normalizeForCompare(a.name);
      if (!key) continue;
      const list = groups.get(key) ?? [];
      list.push(a.name);
      groups.set(key, list);
    }
    return Array.from(groups.entries())
      .filter(([, names]) => names.length > 1)
      .map(([key, names]) => ({ key, names }));
  }, [artistsData]);

  const dupNameSet = useMemo(() => {
    const set = new Set<string>();
    for (const g of dupGroups) g.names.forEach(n => set.add(n));
    return set;
  }, [dupGroups]);

  const filteredArtists = useMemo(() => {
    let out = artistsData;
    if (categoryFilter !== 'all') {
      out = out.filter(a => a.category === categoryFilter);
    }
    if (showOnlyDups) {
      out = out.filter(a => dupNameSet.has(a.name));
    } else if (hideDups) {
      // Show only the most-frequent variant of each duplicate cluster.
      const keepName = new Set<string>();
      for (const g of dupGroups) {
        const sortedByCount = g.names
          .map(n => artistsData.find(a => a.name === n)!)
          .sort((a, b) => b.appearanceCount - a.appearanceCount);
        keepName.add(sortedByCount[0].name);
      }
      out = out.filter(a => !dupNameSet.has(a.name) || keepName.has(a.name));
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      out = out.filter(a =>
        a.name.toLowerCase().includes(q)
        || a.festivals.some(f =>
          f.name.toLowerCase().includes(q)
          || f.city.toLowerCase().includes(q)
          || f.country.toLowerCase().includes(q),
        ),
      );
    }

    const sorted = [...out].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'appearances') {
        if (a.appearanceCount !== b.appearanceCount) {
          return (a.appearanceCount - b.appearanceCount) * dir;
        }
        return a.name.localeCompare(b.name);
      }
      return a.name.localeCompare(b.name) * dir;
    });
    return sorted;
  }, [artistsData, searchQuery, sortKey, sortDir, hideDups, showOnlyDups, categoryFilter, dupNameSet, dupGroups]);

  const totalArtists = artistsData.length;
  const totalAppearances = artistsData.reduce((s, a) => s + a.appearanceCount, 0);
  const averageAppearances = totalArtists > 0 ? (totalAppearances / totalArtists).toFixed(1) : '0';
  const topArtist = useMemo(
    () => [...artistsData].sort((a, b) => b.appearanceCount - a.appearanceCount)[0] ?? null,
    [artistsData],
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<ArtistCategory, number> = { dj: 0, musician: 0, dancer: 0 };
    for (const a of artistsData) counts[a.category]++;
    return counts;
  }, [artistsData]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'appearances' ? 'desc' : 'asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total artists" value={totalArtists} hint={`${totalAppearances} appearances · avg ${averageAppearances}`} icon={Users} />
        <StatCard label="Dancers" value={categoryCounts.dancer} hint="Workshop instructors, performers" icon={Footprints} />
        <StatCard label="Musicians" value={categoryCounts.musician} hint="Bands, orchestras, soloists" icon={Music} />
        <StatCard label="DJs" value={categoryCounts.dj} hint='Names starting with "DJ"' icon={Disc3} />
      </div>

      {/* Top performer + duplicates summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          label="Most featured"
          value={topArtist ? topArtist.appearanceCount : 0}
          hint={topArtist ? topArtist.name : 'No artists yet'}
          icon={TrendingUp}
        />
        <StatCard
          label="Likely duplicates"
          value={dupGroups.length}
          hint={dupGroups.length > 0 ? 'Name-spelling clusters' : 'No duplicates detected'}
          icon={AlertTriangle}
        />
      </div>

      {/* Duplicate cluster list (only when there are clusters) */}
      {dupGroups.length > 0 && (
        <Card className="border border-yellow-300 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-yellow-900">
              <AlertTriangle className="h-4 w-4" />
              Possible duplicate spellings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-800 mb-3">
              These names normalize to the same value (case, punctuation, whitespace) — likely the same artist
              entered differently. Open each festival from the table below to standardize the spelling.
            </p>
            <div className="space-y-2">
              {dupGroups.map(g => (
                <div key={g.key} className="text-sm bg-white border border-yellow-200 rounded p-2">
                  <span className="text-gray-600 mr-2">Group:</span>
                  {g.names.map((n, i) => (
                    <span key={n}>
                      <code className="px-1 bg-gray-100 rounded">{n}</code>
                      {i < g.names.length - 1 && <span className="mx-1 text-gray-400">vs</span>}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500 mr-1">Category:</span>
        <CategoryChip current={categoryFilter} value="all"      label={`All (${totalArtists})`}                       onClick={setCategoryFilter} />
        <CategoryChip current={categoryFilter} value="dancer"   label={`Dancers (${categoryCounts.dancer})`}          onClick={setCategoryFilter} icon={Footprints} />
        <CategoryChip current={categoryFilter} value="musician" label={`Musicians (${categoryCounts.musician})`}      onClick={setCategoryFilter} icon={Music} />
        <CategoryChip current={categoryFilter} value="dj"       label={`DJs (${categoryCounts.dj})`}                  onClick={setCategoryFilter} icon={Disc3} />
      </div>

      {/* Toolbar — search + sort + duplicate filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search artists, festivals, cities, or countries…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-gray-300"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={sortKey === 'name' ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleSort('name')}
            className={sortKey === 'name' ? 'bg-black hover:bg-gray-800 text-white' : ''}
          >
            Name <ArrowUpDown className="h-3 w-3 ml-1" />
            {sortKey === 'name' && <span className="ml-1 text-xs">{sortDir === 'asc' ? '↑' : '↓'}</span>}
          </Button>
          <Button
            variant={sortKey === 'appearances' ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleSort('appearances')}
            className={sortKey === 'appearances' ? 'bg-black hover:bg-gray-800 text-white' : ''}
          >
            Appearances <ArrowUpDown className="h-3 w-3 ml-1" />
            {sortKey === 'appearances' && <span className="ml-1 text-xs">{sortDir === 'asc' ? '↑' : '↓'}</span>}
          </Button>

          {dupGroups.length > 0 && (
            <>
              <Button
                size="sm"
                variant={showOnlyDups ? 'default' : 'outline'}
                onClick={() => {
                  setShowOnlyDups(v => !v);
                  if (!showOnlyDups) setHideDups(false);
                }}
                className={showOnlyDups ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''}
              >
                Only duplicates
              </Button>
              <Button
                size="sm"
                variant={hideDups ? 'default' : 'outline'}
                onClick={() => {
                  setHideDups(v => !v);
                  if (!hideDups) setShowOnlyDups(false);
                }}
                className={hideDups ? 'bg-black hover:bg-gray-800 text-white' : ''}
              >
                Collapse duplicates
              </Button>
            </>
          )}
        </div>
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
                <TableHead>
                  <button
                    onClick={() => toggleSort('name')}
                    className="flex items-center gap-1 hover:text-gray-900"
                  >
                    Artist Name <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="w-32">
                  <button
                    onClick={() => toggleSort('appearances')}
                    className="flex items-center gap-1 hover:text-gray-900"
                  >
                    Appearances <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>Featured In</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArtists.map((artist, index) => (
                <TableRow key={artist.name}>
                  <TableCell className="text-gray-500 text-sm">{index + 1}</TableCell>
                  <TableCell className="font-medium align-top">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span>{artist.name}</span>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0 border ${
                          artist.category === 'dj'
                            ? 'bg-gray-900 text-white border-gray-900'
                            : artist.category === 'musician'
                            ? 'bg-gray-200 text-gray-900 border-gray-300'
                            : 'bg-white text-gray-700 border-gray-300'
                        }`}
                        title={`Category: ${CATEGORY_LABEL[artist.category]}`}
                      >
                        {CATEGORY_LABEL[artist.category]}
                      </Badge>
                      {dupNameSet.has(artist.name) && (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-900 border border-yellow-200 text-[10px] px-1 py-0"
                          title="Another spelling exists"
                        >
                          dup
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-900">
                      {artist.appearanceCount} {artist.appearanceCount === 1 ? 'festival' : 'festivals'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 max-w-2xl">
                      {artist.festivals.map(festival => (
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
              {searchQuery || showOnlyDups || hideDups
                ? 'Try adjusting your filters or search query'
                : 'No artists have been added to festivals yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: number;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="border border-gray-200 bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs text-gray-600 flex items-center gap-2">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        <p className="text-xs text-gray-500 mt-1 truncate">{hint}</p>
      </CardContent>
    </Card>
  );
}

function CategoryChip({
  current,
  value,
  label,
  onClick,
  icon: Icon,
}: {
  current: CategoryFilter;
  value: CategoryFilter;
  label: string;
  onClick: (v: CategoryFilter) => void;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-medium border transition-colors ${
        active
          ? 'bg-black text-white border-black'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      }`}
      aria-pressed={active}
    >
      {Icon && <Icon className="h-3 w-3" />}
      <span>{label}</span>
    </button>
  );
}
