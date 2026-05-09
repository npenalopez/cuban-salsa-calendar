import { useMemo, useState } from 'react';
import { type Festival } from '../data/festivals';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Search,
  Instagram,
  Globe,
  CheckCircle,
  RotateCcw,
  Trash2,
  ExternalLink,
  ClipboardCheck,
  Clock,
  AlertTriangle,
  Edit,
} from 'lucide-react';
import { CountryFlagIcon } from './CountryFlagIcon';
import { getFestivalSortPriority } from '../utils/dateUtils';
import {
  readFactCheckLog,
  markVerified,
  unmarkVerified,
  clearFactCheckLog,
  isOverdue,
  formatRelativeAge,
  OVERDUE_DAYS,
  type FactCheckLog,
} from '../utils/factCheckLog';
import { toast } from 'sonner';

interface FestivalFactCheckProps {
  festivals: Festival[];
  onEditFestival: (festival: Festival) => void;
}

type Filter = 'unchecked' | 'overdue' | 'verified' | 'all';

const buildInstagramUrl = (handle: string | undefined): string | null => {
  if (!handle) return null;
  const cleaned = handle.trim().replace(/^@/, '');
  if (!cleaned || cleaned === '-') return null;
  return `https://www.instagram.com/${cleaned}`;
};

const buildWebsiteUrl = (raw: string | undefined): string | null => {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === '-') return null;
  return trimmed;
};

export function FestivalFactCheck({ festivals, onEditFestival }: FestivalFactCheckProps) {
  const [log, setLog] = useState<FactCheckLog>(() => readFactCheckLog());
  const [filter, setFilter] = useState<Filter>('unchecked');
  const [searchQuery, setSearchQuery] = useState('');
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});

  const sortedFestivals = useMemo(
    () => [...festivals].sort(
      (a, b) => getFestivalSortPriority(a.dates) - getFestivalSortPriority(b.dates),
    ),
    [festivals],
  );

  const counts = useMemo(() => {
    let verified = 0;
    let overdue = 0;
    let unchecked = 0;
    for (const f of festivals) {
      const entry = log[f.id];
      if (!entry) {
        unchecked++;
      } else if (isOverdue(entry)) {
        overdue++;
        verified++;
      } else {
        verified++;
      }
    }
    return { verified, overdue, unchecked, all: festivals.length };
  }, [festivals, log]);

  const visibleFestivals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sortedFestivals.filter(f => {
      const entry = log[f.id];
      const matchesFilter =
        filter === 'all' ||
        (filter === 'unchecked' && !entry) ||
        (filter === 'overdue' && entry && isOverdue(entry)) ||
        (filter === 'verified' && entry);
      if (!matchesFilter) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q)
        || f.city.toLowerCase().includes(q)
        || f.country.toLowerCase().includes(q)
      );
    });
  }, [sortedFestivals, filter, searchQuery, log]);

  const completionPct = festivals.length > 0
    ? Math.round((counts.verified / festivals.length) * 100)
    : 0;

  const handleMarkVerified = (festival: Festival) => {
    const note = noteDraft[festival.id]?.trim();
    setLog(markVerified(festival.id, note || undefined));
    setNoteDraft(prev => {
      const next = { ...prev };
      delete next[festival.id];
      return next;
    });
    toast.success(`"${festival.name}" verified`);
  };

  const handleUnmark = (festival: Festival) => {
    setLog(unmarkVerified(festival.id));
    toast.info(`Unmarked "${festival.name}"`);
  };

  const handleClearAll = () => {
    if (window.confirm('Reset every fact-check stamp? This only clears the verification log, not the festival data.')) {
      setLog(clearFactCheckLog());
      toast.info('Fact-check log cleared');
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress + counts */}
      <Card className="border border-gray-200 bg-white">
        <CardContent className="py-4 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-600">Fact-check progress</div>
              <div className="text-2xl font-semibold text-gray-900">{completionPct}%</div>
              <div className="text-xs text-gray-500 mt-1">
                {counts.verified} of {festivals.length} verified · {counts.overdue} overdue (&gt;{OVERDUE_DAYS}d) · {counts.unchecked} not checked
              </div>
            </div>
            <div className="flex-1 max-w-xs">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-black" style={{ width: `${completionPct}%` }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search festivals, cities, countries…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-gray-300"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FilterButton current={filter} value="unchecked" onClick={setFilter}>Unchecked ({counts.unchecked})</FilterButton>
          <FilterButton current={filter} value="overdue"   onClick={setFilter}>Overdue ({counts.overdue})</FilterButton>
          <FilterButton current={filter} value="verified"  onClick={setFilter}>Verified ({counts.verified})</FilterButton>
          <FilterButton current={filter} value="all"       onClick={setFilter}>All ({counts.all})</FilterButton>
          <Button variant="outline" size="sm" onClick={handleClearAll} className="text-red-600 border-red-300 hover:bg-red-50">
            <Trash2 className="h-3 w-3 mr-1" /> Reset log
          </Button>
        </div>
      </div>

      {/* Festival cards */}
      {visibleFestivals.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded">
          <ClipboardCheck className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nothing to check here</h3>
          <p className="text-sm text-gray-600">
            {filter === 'unchecked'
              ? 'Every festival has been verified at least once. Switch to "Overdue" to find stale entries.'
              : 'Try a different filter or search.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleFestivals.map(festival => {
            const entry = log[festival.id];
            const overdue = entry ? isOverdue(entry) : false;
            const igUrl = buildInstagramUrl(festival.instagram);
            const webUrl = buildWebsiteUrl(festival.website);
            const realArtists = (festival.artists ?? []).filter(
              a => typeof a === 'string' && a.trim() && a.trim() !== '-',
            );

            return (
              <Card
                key={festival.id}
                className={`border ${entry && !overdue ? 'border-green-300 bg-green-50/30' : overdue ? 'border-yellow-300 bg-yellow-50/30' : 'border-gray-200 bg-white'}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <CountryFlagIcon country={festival.country} size={16} />
                        <span className="truncate">{festival.name}</span>
                        {entry && !overdue && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 border border-green-200 text-[10px]">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            verified {formatRelativeAge(entry.checkedAt)}
                          </Badge>
                        )}
                        {entry && overdue && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-900 border border-yellow-200 text-[10px]">
                            <Clock className="h-3 w-3 mr-1" />
                            stale ({formatRelativeAge(entry.checkedAt)})
                          </Badge>
                        )}
                        {!entry && (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700 border border-gray-200 text-[10px]">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            not checked
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {festival.dates} · {festival.city}, {festival.country}
                      </p>
                    </div>
                    <Button
                      onClick={() => onEditFestival(festival)}
                      variant="outline"
                      size="sm"
                      className="border-black"
                      title="Open editor"
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Quick links to the source-of-truth */}
                  <div className="flex flex-wrap gap-2">
                    {igUrl ? (
                      <a
                        href={igUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm bg-black hover:bg-gray-800 text-white px-3 py-1.5 rounded"
                      >
                        <Instagram className="h-3.5 w-3.5" /> Open Instagram <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs bg-gray-100 text-gray-500 px-3 py-1.5 rounded border border-gray-200">
                        <Instagram className="h-3.5 w-3.5" /> No Instagram
                      </span>
                    )}
                    {webUrl ? (
                      <a
                        href={webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm bg-white border border-black text-black hover:bg-gray-50 px-3 py-1.5 rounded"
                      >
                        <Globe className="h-3.5 w-3.5" /> Open website <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs bg-gray-100 text-gray-500 px-3 py-1.5 rounded border border-gray-200">
                        <Globe className="h-3.5 w-3.5" /> No website
                      </span>
                    )}
                  </div>

                  {/* All the data, laid out for visual comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <FactRow label="Name"        value={festival.name} />
                    <FactRow label="Dates"       value={festival.dates} />
                    <FactRow label="City"        value={festival.city} />
                    <FactRow label="Country"     value={festival.country} />
                    <FactRow label="Continent"   value={festival.continent} />
                    <FactRow label="Venue"       value={festival.venue} />
                    <FactRow label="Category"    value={festival.category} />
                    <FactRow label="Years active" value={festival.yearsActive} />
                    <FactRow label="Price"       value={festival.price} mono />
                    <FactRow label="Coordinates"
                      value={
                        Array.isArray(festival.coordinates) && festival.coordinates.length === 2
                          ? `${festival.coordinates[0].toFixed(4)}, ${festival.coordinates[1].toFixed(4)}`
                          : undefined
                      }
                      mono
                    />
                    <FactRow label="Instagram"   value={festival.instagram} mono />
                    <FactRow label="Website"     value={festival.website} mono />
                  </div>

                  {festival.description && (
                    <div className="text-sm">
                      <div className="text-xs text-gray-500 mb-1">Description</div>
                      <p className="text-gray-800 bg-gray-50 border border-gray-200 rounded p-2 whitespace-pre-wrap">
                        {festival.description}
                      </p>
                    </div>
                  )}

                  {realArtists.length > 0 && (
                    <div className="text-sm">
                      <div className="text-xs text-gray-500 mb-1">Artists ({realArtists.length})</div>
                      <div className="flex flex-wrap gap-1">
                        {realArtists.map((artist, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-800 border border-gray-200 px-2 py-0.5 rounded">
                            {artist}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry?.note && (
                    <div className="text-sm">
                      <div className="text-xs text-gray-500 mb-1">Last note</div>
                      <p className="text-gray-700 italic bg-gray-50 border border-gray-200 rounded p-2">{entry.note}</p>
                    </div>
                  )}

                  {/* Optional reviewer note + verify actions */}
                  <div className="space-y-2">
                    <Input
                      placeholder="Optional note (e.g. 'dates confirmed for 2027')"
                      value={noteDraft[festival.id] ?? ''}
                      onChange={e => setNoteDraft(prev => ({ ...prev, [festival.id]: e.target.value }))}
                      className="h-9 text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleMarkVerified(festival)}
                        className="bg-black hover:bg-gray-800 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {entry ? 'Re-verify (now)' : 'Mark verified'}
                      </Button>
                      {entry && (
                        <Button variant="outline" onClick={() => handleUnmark(festival)}>
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Reset this one
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  current,
  value,
  onClick,
  children,
}: {
  current: Filter;
  value: Filter;
  onClick: (v: Filter) => void;
  children: React.ReactNode;
}) {
  const active = current === value;
  return (
    <Button
      size="sm"
      variant={active ? 'default' : 'outline'}
      onClick={() => onClick(value)}
      className={active ? 'bg-black hover:bg-gray-800 text-white' : ''}
    >
      {children}
    </Button>
  );
}

function FactRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string | undefined;
  mono?: boolean;
}) {
  const missing = !value || !value.toString().trim() || value.toString().trim() === '-';
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      {missing ? (
        <div className="text-sm text-gray-400 italic">— missing —</div>
      ) : (
        <div className={`text-sm text-gray-900 ${mono ? 'font-mono' : ''} break-words`}>{value}</div>
      )}
    </div>
  );
}
