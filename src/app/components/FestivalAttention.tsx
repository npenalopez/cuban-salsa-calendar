import { useState, useMemo } from 'react';
import { type Festival } from '../data/festivals';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertTriangle, Edit, Calendar, DollarSign, Users, Globe, Instagram, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { isFestivalPast, getFestivalSortPriority } from '../utils/dateUtils';

interface FestivalAttentionProps {
  festivals: Festival[];
  onEditFestival: (festival: Festival) => void;
}

// Shared helpers — kept at module scope so they're not re-created on every
// render and the rules don't drift between the issue check and the badge
// rendering loop.
const isMissing = (value: string | undefined | null): boolean => {
  if (!value) return true;
  const trimmed = value.trim();
  return trimmed === '' || trimmed === '-';
};

const isPlaceholderArtist = (artist: string): boolean => {
  const trimmed = artist.trim();
  if (!trimmed) return true;
  if (['-', '--', '—'].includes(trimmed)) return true;
  const lower = trimmed.toLowerCase();
  return (
    lower === 'tba' ||
    lower === 'tbd' ||
    lower === 'n/a' ||
    lower.includes('to be announced') ||
    lower.includes('t.b.a') ||
    lower.includes('to be determined') ||
    lower.includes('will be announced') ||
    lower.includes('soon announced') ||
    lower.includes('announced soon') ||
    lower.includes('lineup announced') ||
    lower.includes('coming soon') ||
    lower === 'soon' ||
    lower.includes('pending') ||
    lower.includes('not available')
  );
};

const isCoordinatesPlaceholder = (coords: Festival['coordinates']): boolean => {
  if (!Array.isArray(coords) || coords.length !== 2) return true;
  const [lat, lng] = coords;
  return (typeof lat !== 'number') || (typeof lng !== 'number') || (lat === 0 && lng === 0);
};

interface FestivalIssues {
  noPrice: boolean;
  noArtists: boolean;
  tbaArtists: boolean;
  noWebsite: boolean;
  noInstagram: boolean;
  noCoordinates: boolean;
  pastDate: boolean;
}

function detectIssues(festival: Festival): FestivalIssues {
  return {
    noPrice: isMissing(festival.price),
    noArtists: !Array.isArray(festival.artists) || festival.artists.length === 0,
    tbaArtists: Array.isArray(festival.artists)
      && festival.artists.length > 0
      && festival.artists.some(isPlaceholderArtist),
    noWebsite: isMissing(festival.website),
    noInstagram: isMissing(festival.instagram),
    noCoordinates: isCoordinatesPlaceholder(festival.coordinates),
    pastDate: !!festival.dates && isFestivalPast(festival.dates),
  };
}

function hasAnyIssue(issues: FestivalIssues): boolean {
  return Object.values(issues).some(Boolean);
}

const ISSUE_LABEL: Record<keyof FestivalIssues, string> = {
  noPrice: 'No price',
  noArtists: 'No artists',
  tbaArtists: 'Artists TBA',
  noWebsite: 'No website',
  noInstagram: 'No Instagram',
  noCoordinates: 'No coordinates',
  pastDate: 'Past date',
};

const sortByDate = (festivals: Festival[]) =>
  [...festivals].sort(
    (a, b) => getFestivalSortPriority(a.dates) - getFestivalSortPriority(b.dates),
  );

export function FestivalAttention({ festivals, onEditFestival }: FestivalAttentionProps) {
  const [activeTab, setActiveTab] = useState("all");

  const buckets = useMemo(() => {
    const noPrice: Festival[] = [];
    const noArtists: Festival[] = [];
    const tbaArtists: Festival[] = [];
    const noWebsite: Festival[] = [];
    const noInstagram: Festival[] = [];
    const noCoordinates: Festival[] = [];
    const pastDate: Festival[] = [];
    const all = new Map<string, Festival>();

    festivals.forEach(festival => {
      const issues = detectIssues(festival);
      if (issues.noPrice) noPrice.push(festival);
      if (issues.noArtists) noArtists.push(festival);
      if (issues.tbaArtists) tbaArtists.push(festival);
      if (issues.noWebsite) noWebsite.push(festival);
      if (issues.noInstagram) noInstagram.push(festival);
      if (issues.noCoordinates) noCoordinates.push(festival);
      if (issues.pastDate) pastDate.push(festival);
      if (hasAnyIssue(issues)) {
        all.set(festival.id, festival);
      }
    });

    return {
      noPrice: sortByDate(noPrice),
      noArtists: sortByDate(noArtists),
      tbaArtists: sortByDate(tbaArtists),
      noWebsite: sortByDate(noWebsite),
      noInstagram: sortByDate(noInstagram),
      noCoordinates: sortByDate(noCoordinates),
      pastDate: sortByDate(pastDate),
      all: sortByDate(Array.from(all.values())),
    };
  }, [festivals]);

  const completePct = festivals.length > 0
    ? Math.round(((festivals.length - buckets.all.length) / festivals.length) * 100)
    : 100;

  const renderFestivalTable = (rows: Festival[]) => {
    if (rows.length === 0) {
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
              <TableHead>Issues</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(festival => {
              const issues = detectIssues(festival);
              const flagged = (Object.keys(issues) as (keyof FestivalIssues)[])
                .filter(k => issues[k]);
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
                      {flagged.map(key => (
                        <Badge
                          key={key}
                          variant="secondary"
                          className={
                            key === 'pastDate'
                              ? 'bg-gray-100 text-gray-700 border border-gray-300'
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }
                        >
                          {ISSUE_LABEL[key]}
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
                      title="Edit festival"
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
      {/* Top-level data-quality bar */}
      <Card className="border border-gray-200 bg-white">
        <CardContent className="py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-600">Data completeness</div>
              <div className="text-2xl font-semibold text-gray-900">{completePct}%</div>
              <div className="text-xs text-gray-500 mt-1">
                {festivals.length - buckets.all.length} of {festivals.length} festivals have all checked fields
              </div>
            </div>
            <div className="flex-1 max-w-xs">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-black" style={{ width: `${completePct}%` }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics cards — 7 issue types */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Needs attention" value={buckets.all.length} icon={AlertTriangle} hint="Any issue" />
        <StatCard label="Missing price" value={buckets.noPrice.length} icon={DollarSign} hint="No price set" />
        <StatCard label="No artists" value={buckets.noArtists.length} icon={Users} hint="Empty artist list" />
        <StatCard label="Artists TBA" value={buckets.tbaArtists.length} icon={Users} hint="Has placeholders" />
        <StatCard label="No website" value={buckets.noWebsite.length} icon={Globe} hint="Missing website URL" />
        <StatCard label="No Instagram" value={buckets.noInstagram.length} icon={Instagram} hint="Missing handle" />
        <StatCard label="No coordinates" value={buckets.noCoordinates.length} icon={Calendar} hint="Map can't show it" />
        <StatCard label="Past date" value={buckets.pastDate.length} icon={Clock} hint="Update for next year" />
      </div>

      {/* Info Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-700 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-900 mb-1">Data Quality Check</h3>
            <p className="text-yellow-800 text-sm">
              Each tab below lists festivals missing a piece of information. Lists are sorted by start date so the most urgent are first. Click the pencil to fix.
            </p>
          </div>
        </div>
      </div>

      {/* Tabbed View */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-gray-200 overflow-x-auto">
            <TabsList className="bg-transparent w-max justify-start rounded-none h-auto p-0 flex">
              <TabsTrigger value="all"            className={tabClass}>All ({buckets.all.length})</TabsTrigger>
              <TabsTrigger value="no-price"       className={tabClass}>No Price ({buckets.noPrice.length})</TabsTrigger>
              <TabsTrigger value="no-artists"     className={tabClass}>No Artists ({buckets.noArtists.length})</TabsTrigger>
              <TabsTrigger value="tba-artists"    className={tabClass}>Artists TBA ({buckets.tbaArtists.length})</TabsTrigger>
              <TabsTrigger value="no-website"     className={tabClass}>No Website ({buckets.noWebsite.length})</TabsTrigger>
              <TabsTrigger value="no-instagram"   className={tabClass}>No Instagram ({buckets.noInstagram.length})</TabsTrigger>
              <TabsTrigger value="no-coordinates" className={tabClass}>No Coordinates ({buckets.noCoordinates.length})</TabsTrigger>
              <TabsTrigger value="past-date"      className={tabClass}>Past Date ({buckets.pastDate.length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all"            className="m-0">{renderFestivalTable(buckets.all)}</TabsContent>
          <TabsContent value="no-price"       className="m-0">{renderFestivalTable(buckets.noPrice)}</TabsContent>
          <TabsContent value="no-artists"     className="m-0">{renderFestivalTable(buckets.noArtists)}</TabsContent>
          <TabsContent value="tba-artists"    className="m-0">{renderFestivalTable(buckets.tbaArtists)}</TabsContent>
          <TabsContent value="no-website"     className="m-0">{renderFestivalTable(buckets.noWebsite)}</TabsContent>
          <TabsContent value="no-instagram"   className="m-0">{renderFestivalTable(buckets.noInstagram)}</TabsContent>
          <TabsContent value="no-coordinates" className="m-0">{renderFestivalTable(buckets.noCoordinates)}</TabsContent>
          <TabsContent value="past-date"      className="m-0">{renderFestivalTable(buckets.pastDate)}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const tabClass =
  'rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-3 py-3 text-xs sm:text-sm whitespace-nowrap';

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  hint: string;
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
        <p className="text-xs text-gray-500 mt-1">{hint}</p>
      </CardContent>
    </Card>
  );
}
