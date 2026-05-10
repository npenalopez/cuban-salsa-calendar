import { useMemo, useState, useEffect } from 'react';
import { type Festival } from '../data/festivals';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Copy, TrendingUp, DollarSign, Users, MapPin, Calendar, CheckCircle, Sparkles, Star, RotateCcw } from 'lucide-react';
import { toast } from "sonner";
import { useLanguage } from '../contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { isFestivalPast, getFestivalSortPriority } from '../utils/dateUtils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface InstagramContentCreatorProps {
  festivals: Festival[];
}

export function InstagramContentCreator({ festivals }: InstagramContentCreatorProps) {
  useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  // Inline edits applied to a template before copy. Keyed by template id.
  const [editedTemplates, setEditedTemplates] = useState<Record<string, string>>({});
  const [spotlightId, setSpotlightId] = useState<string>('');
  const [randomFactSeed, setRandomFactSeed] = useState<number>(() => Date.now());
  const [customTemplate, setCustomTemplate] = useState<string>(
    `🎉 Did you know?\n\nThere are {totalFestivals} salsa festivals tracked across {countries} countries on Cuban Calendar.\n\nFind your next dance trip 💃🕺\n\n#SalsaFestivals #CubanCalendar`,
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const totalFestivals = festivals.length;
    
    // Count festivals by continent
    const festivalsByContinent = festivals.reduce((acc, festival) => {
      acc[festival.continent] = (acc[festival.continent] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count artists and find most booked
    const artistCounts: Record<string, number> = {};
    festivals.forEach(festival => {
      if (Array.isArray(festival.artists)) {
        festival.artists.forEach(artist => {
          // Filter out invalid artist entries: empty strings, "-", whitespace
          if (typeof artist === 'string' && artist.trim() && artist.trim() !== '-') {
            artistCounts[artist.trim()] = (artistCounts[artist.trim()] || 0) + 1;
          }
        });
      }
    });

    const sortedArtists = Object.entries(artistCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    const mostBookedArtist = sortedArtists[0];
    const topArtists = sortedArtists.slice(0, 5);

    // Helper function to extract numeric price from price string
    const extractNumericPrice = (priceStr: string): number | null => {
      if (!priceStr || priceStr.trim() === '' || priceStr.trim() === '-' || priceStr.toLowerCase() === 'soldout') {
        return null;
      }

      // Remove currency symbols and common text
      const cleaned = priceStr
        .replace(/€|£|\$|USD|EUR|GBP/gi, '')
        .replace(/from|to|pass|full/gi, '')
        .trim();

      // Try to find a price range (e.g., "150-200" or "150 - 200")
      const rangeMatch = cleaned.match(/(\d+)\s*[-–—]\s*(\d+)/);
      if (rangeMatch) {
        const low = parseInt(rangeMatch[1]);
        const high = parseInt(rangeMatch[2]);
        // Return the average of the range
        return Math.round((low + high) / 2);
      }

      // Try to find a single number (prefer numbers >= 50 to avoid parsing day numbers)
      const numbers = cleaned.match(/\d+/g);
      if (numbers) {
        const validPrices = numbers
          .map(n => parseInt(n))
          .filter(n => n >= 30 && n <= 2000); // Reasonable festival price range
        
        if (validPrices.length > 0) {
          // Return the first valid price found
          return validPrices[0];
        }
      }

      return null;
    };

    // Calculate average price (from festivals with numeric prices)
    const pricesWithNumbers = festivals
      .map(f => extractNumericPrice(f.price))
      .filter((p): p is number => p !== null);

    const averagePrice = pricesWithNumbers.length > 0
      ? Math.round(pricesWithNumbers.reduce((a, b) => a + b, 0) / pricesWithNumbers.length)
      : null;

    // Find most expensive and cheapest festivals
    const festivalsWithPrices = festivals
      .map(f => {
        const price = extractNumericPrice(f.price);
        return { festival: f, price };
      })
      .filter(({ price }) => price !== null) as { festival: Festival; price: number }[];

    const mostExpensive = festivalsWithPrices.length > 0
      ? festivalsWithPrices.sort((a, b) => b.price - a.price)[0]
      : null;
    
    const cheapest = festivalsWithPrices.length > 0
      ? festivalsWithPrices.sort((a, b) => a.price - b.price)[0]
      : null;

    // Count festivals by month
    const festivalsByMonth = festivals.reduce((acc, festival) => {
      (festival.months ?? []).forEach(month => {
        acc[month] = (acc[month] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const busiestMonth = Object.entries(festivalsByMonth)
      .sort(([, a], [, b]) => b - a)[0];

    // Count countries
    const uniqueCountries = new Set(festivals.map(f => f.country));
    const uniqueCities = new Set(festivals.map(f => f.city));

    return {
      totalFestivals,
      festivalsByContinent,
      mostBookedArtist,
      topArtists,
      averagePrice,
      mostExpensive,
      cheapest,
      busiestMonth,
      uniqueCountries: uniqueCountries.size,
      uniqueCities: uniqueCities.size,
      totalArtists: Object.keys(artistCounts).length,
    };
  }, [festivals]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Upcoming festivals only — sorted by date ascending. Used both for the
  // spotlight selector and for picking a random fact source.
  const upcomingFestivals = useMemo(
    () => festivals
      .filter(f => f.dates && !isFestivalPast(f.dates))
      .sort((a, b) => getFestivalSortPriority(a.dates) - getFestivalSortPriority(b.dates)),
    [festivals],
  );

  // Default spotlight selection = the next upcoming festival.
  useEffect(() => {
    if (!spotlightId && upcomingFestivals.length > 0) {
      setSpotlightId(upcomingFestivals[0].id);
    }
  }, [spotlightId, upcomingFestivals]);

  const spotlightFestival = useMemo(
    () => festivals.find(f => f.id === spotlightId) ?? null,
    [festivals, spotlightId],
  );

  const spotlightContent = useMemo(() => {
    if (!spotlightFestival) return '';
    const f = spotlightFestival;
    const realArtists = (f.artists ?? [])
      .filter(a => typeof a === 'string' && a.trim() && a.trim() !== '-' && !/tba|to be announced|coming soon/i.test(a))
      .slice()
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    const lineupBlock = realArtists.length > 0
      ? `\n\n🎤 Featuring:\n${realArtists.slice(0, 6).map(a => `• ${a}`).join('\n')}${realArtists.length > 6 ? `\n• …and ${realArtists.length - 6} more` : ''}`
      : '';
    const websiteLine = f.website && f.website.trim() && f.website.trim() !== '-'
      ? `\n\n🔗 ${f.website}`
      : '';
    return `🌟 FESTIVAL SPOTLIGHT\n\n${f.name}\n📍 ${f.city}, ${f.country}\n📅 ${f.dates}${f.price && f.price.trim() !== '-' ? `\n💰 ${f.price}` : ''}${lineupBlock}${websiteLine}\n\nFind it on Cuban Calendar 💃🕺\n\n#${f.city.replace(/\s+/g, '')} #${f.country.replace(/\s+/g, '')} #SalsaFestivals #CubanCalendar`;
  }, [spotlightFestival]);

  // A small library of possible random facts. Each receives `stats` and the
  // raw festival list, then returns a string (or null if it can't compute).
  const factGenerators = useMemo<Array<() => string | null>>(() => {
    return [
      () => {
        if (!stats.busiestMonth) return null;
        return `📅 Busiest salsa month: ${stats.busiestMonth[0]} with ${stats.busiestMonth[1]} festivals.`;
      },
      () => {
        if (!stats.mostBookedArtist) return null;
        return `⭐ ${stats.mostBookedArtist[0]} is booked at ${stats.mostBookedArtist[1]} festivals — that's the most of any artist this year.`;
      },
      () => {
        const continents = Object.entries(stats.festivalsByContinent).sort(([, a], [, b]) => b - a);
        if (continents.length === 0) return null;
        return `🌍 ${continents[0][1]} of our ${stats.totalFestivals} festivals are in ${continents[0][0]}.`;
      },
      () => {
        if (!stats.cheapest || !stats.mostExpensive) return null;
        return `💰 Festival passes range from €${stats.cheapest.price} (${stats.cheapest.festival.name}) to €${stats.mostExpensive.price} (${stats.mostExpensive.festival.name}).`;
      },
      () => {
        if (upcomingFestivals.length === 0) return null;
        const idx = Math.abs(randomFactSeed) % upcomingFestivals.length;
        const f = upcomingFestivals[idx];
        return `🎉 Coming up: ${f.name} in ${f.city}, ${f.country} — ${f.dates}.`;
      },
      () => `✈️ ${stats.totalFestivals} festivals across ${stats.uniqueCountries} countries and ${stats.uniqueCities} cities tracked.`,
    ];
  }, [stats, upcomingFestivals, randomFactSeed]);

  const randomFact = useMemo(() => {
    const generators = factGenerators.filter(g => g() !== null);
    if (generators.length === 0) return 'No data available yet to generate a fact.';
    const idx = Math.abs(randomFactSeed) % generators.length;
    return generators[idx]() ?? '';
  }, [factGenerators, randomFactSeed]);

  // Custom-template builder: replace {placeholders} with computed values.
  const customPlaceholders: Record<string, string> = useMemo(() => ({
    totalFestivals: String(stats.totalFestivals),
    countries: String(stats.uniqueCountries),
    cities: String(stats.uniqueCities),
    artists: String(stats.totalArtists),
    averagePrice: stats.averagePrice ? `€${stats.averagePrice}` : 'N/A',
    busiestMonth: stats.busiestMonth ? stats.busiestMonth[0] : 'N/A',
    mostBookedArtist: stats.mostBookedArtist ? stats.mostBookedArtist[0] : 'N/A',
    spotlightFestival: spotlightFestival ? spotlightFestival.name : 'N/A',
    spotlightCity: spotlightFestival ? spotlightFestival.city : 'N/A',
    spotlightDates: spotlightFestival ? spotlightFestival.dates : 'N/A',
  }), [stats, spotlightFestival]);

  const customRendered = useMemo(
    () => customTemplate.replace(/\{(\w+)\}/g, (_, key) => customPlaceholders[key] ?? `{${key}}`),
    [customTemplate, customPlaceholders],
  );

  // Instagram post templates
  const templates = [
    {
      id: 'total-festivals',
      title: 'Total Festivals Count',
      icon: TrendingUp,
      content: `🌍 ${stats.totalFestivals} SALSA FESTIVALS WORLDWIDE

We're tracking ${stats.totalFestivals} salsa festivals across ${stats.uniqueCountries} countries and ${stats.uniqueCities} cities!

Find your next salsa adventure on Cuban Calendar 💃🕺

#SalsaFestivals #SalsaDance #SalsaMusic #LatinDance #CubanCalendar`,
    },
    {
      id: 'average-price',
      title: 'Average Festival Price',
      icon: DollarSign,
      content: stats.averagePrice
        ? `💰 AVERAGE FESTIVAL PASS PRICE

The average salsa festival pass costs around €${stats.averagePrice}

💡 Planning your salsa year? Check out Cuban Calendar to find festivals that fit your budget!

From €${stats.cheapest?.price} to €${stats.mostExpensive?.price}, there's something for everyone.

#SalsaFestivals #SalsaBudget #DanceFestivals #CubanCalendar`
        : 'No price data available',
    },
    {
      id: 'most-booked-artist',
      title: 'Most Booked Artist',
      icon: Users,
      content: stats.mostBookedArtist
        ? `⭐ MOST BOOKED ARTIST

${stats.mostBookedArtist[0]} is teaching at ${stats.mostBookedArtist[1]} festivals this year!

Want to catch their workshops? Find all their festival appearances on Cuban Calendar 🔥

#SalsaArtists #SalsaWorkshops #${stats.mostBookedArtist[0].replace(/\s+/g, '')} #CubanCalendar`
        : 'No artist data available',
    },
    {
      id: 'top-artists',
      title: 'Top 5 Most Booked Artists',
      icon: Users,
      content: stats.topArtists.length > 0
        ? `🌟 TOP 5 MOST BOOKED ARTISTS

${stats.topArtists.map(([name, count], i) => `${i + 1}. ${name} - ${count} festivals`).join('\n')}

These artists are setting the salsa scene on fire! 🔥

Find where to see them next on Cuban Calendar 💃

#SalsaArtists #SalsaInstructors #LatinDance #CubanCalendar`
        : 'No artist data available',
    },
    {
      id: 'continents',
      title: 'Festivals by Continent',
      icon: MapPin,
      content: `🌍 SALSA AROUND THE WORLD

${Object.entries(stats.festivalsByContinent)
  .sort(([, a], [, b]) => b - a)
  .map(([continent, count]) => `${continent}: ${count} festivals`)
  .join('\n')}

From ${Object.keys(stats.festivalsByContinent).length} continents to your dance floor! 🌎

Explore them all on Cuban Calendar ✨

#WorldwideSalsa #SalsaTravel #DanceAroundTheWorld #CubanCalendar`,
    },
    {
      id: 'busiest-month',
      title: 'Busiest Month',
      icon: Calendar,
      content: stats.busiestMonth
        ? `📅 BUSIEST MONTH FOR SALSA

${stats.busiestMonth[0]} has ${stats.busiestMonth[1]} festivals happening! 

That's a LOT of salsa! 🔥💃🕺

Plan your festival calendar on Cuban Calendar and never miss a beat!

#SalsaCalendar #FestivalSeason #SalsaLife #CubanCalendar`
        : 'No month data available',
    },
    {
      id: 'cheapest-most-expensive',
      title: 'Price Range Comparison',
      icon: DollarSign,
      content: stats.cheapest && stats.mostExpensive
        ? `💰 FESTIVAL BUDGET GUIDE

🌟 Most Affordable:
${stats.cheapest.festival.name} - €${stats.cheapest.price}
📍 ${stats.cheapest.festival.city}, ${stats.cheapest.festival.country}

💎 Premium Experience:
${stats.mostExpensive.festival.name} - €${stats.mostExpensive.price}
📍 ${stats.mostExpensive.festival.city}, ${stats.mostExpensive.festival.country}

Find the perfect festival for your budget on Cuban Calendar! 

#SalsaFestivals #TravelBudget #DanceFestivals #CubanCalendar`
        : 'No price data available',
    },
    {
      id: 'artist-spotlight',
      title: 'Artist Spotlight (Template)',
      icon: Users,
      content: stats.topArtists.length > 0
        ? `✨ ARTIST SPOTLIGHT: ${stats.topArtists[0][0]}

Teaching at ${stats.topArtists[0][1]} festivals this year! 

📍 Catch them at:
[List festivals here from Cuban Calendar]

Don't miss the chance to learn from the best! 🔥

Visit Cuban Calendar to see their full schedule 💃

#${stats.topArtists[0][0].replace(/\s+/g, '')} #SalsaWorkshops #SalsaMasters #CubanCalendar`
        : 'No artist data available',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-600" />
              Total Festivals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalFestivals}</div>
            <p className="text-xs text-gray-500 mt-1">
              Across {stats.uniqueCountries} countries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-600" />
              Average Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.averagePrice ? `€${stats.averagePrice}` : 'N/A'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Festival pass average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-600" />
              Total Artists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalArtists}</div>
            <p className="text-xs text-gray-500 mt-1">
              Unique artists tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              Busiest Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.busiestMonth ? stats.busiestMonth[0] : 'N/A'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.busiestMonth ? `${stats.busiestMonth[1]} festivals` : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <Tabs defaultValue="artists" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="artists">Top Artists</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="prices">Prices</TabsTrigger>
        </TabsList>

        <TabsContent value="artists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Booked Artists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topArtists.map(([name, count], index) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <span className="font-medium text-gray-900">{name}</span>
                    </div>
                    <Badge variant="outline">
                      {count} festival{count > 1 ? 's' : ''}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Festivals by Continent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.festivalsByContinent)
                  .sort(([, a], [, b]) => b - a)
                  .map(([continent, count]) => (
                    <div key={continent} className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{continent}</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-200 h-2 w-32 rounded-full overflow-hidden">
                          <div
                            className="bg-gray-900 h-full"
                            style={{
                              width: `${(count / stats.totalFestivals) * 100}%`,
                            }}
                          />
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prices" className="space-y-4">
          <div className="grid gap-4">
            {stats.cheapest && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Most Affordable Festival</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-medium text-gray-900">{stats.cheapest.festival.name}</div>
                  <div className="text-sm text-gray-500">
                    {stats.cheapest.festival.city}, {stats.cheapest.festival.country}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-2">€{stats.cheapest.price}</div>
                </CardContent>
              </Card>
            )}

            {stats.mostExpensive && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Premium Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-medium text-gray-900">{stats.mostExpensive.festival.name}</div>
                  <div className="text-sm text-gray-500">
                    {stats.mostExpensive.festival.city}, {stats.mostExpensive.festival.country}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-2">€{stats.mostExpensive.price}</div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Random Fact */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-5 w-5 text-gray-600" />
            Random Fact
          </CardTitle>
          <CardDescription>
            Pulls a one-liner from your festival data — handy for quick stories or captions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-gray-50 rounded p-4 border border-gray-200 min-h-16 flex items-center">
            <p className="text-sm text-gray-900">{randomFact}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setRandomFactSeed(Date.now())}
              variant="outline"
              className="border-black"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              New fact
            </Button>
            <Button
              onClick={() => copyToClipboard(randomFact, 'random-fact')}
              className="bg-black hover:bg-gray-800 text-white"
            >
              {copiedId === 'random-fact' ? (
                <><CheckCircle className="h-4 w-4 mr-2" /> Copied</>
              ) : (
                <><Copy className="h-4 w-4 mr-2" /> Copy</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Festival Spotlight */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Star className="h-5 w-5 text-gray-600" />
            Festival Spotlight
          </CardTitle>
          <CardDescription>
            Pick an upcoming festival and generate a tailored post with its lineup, dates, and link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingFestivals.length === 0 ? (
            <div className="text-sm text-gray-500">No upcoming festivals available.</div>
          ) : (
            <>
              <Select value={spotlightId} onValueChange={setSpotlightId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a festival…" />
                </SelectTrigger>
                <SelectContent>
                  {upcomingFestivals.map(f => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name} — {f.city}, {f.country} ({f.dates})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={spotlightContent}
                onChange={() => { /* generated, but allow free-form selection / copy via the textarea */ }}
                rows={10}
                readOnly
                className="font-mono text-sm bg-gray-50"
              />
              <Button
                onClick={() => copyToClipboard(spotlightContent, 'spotlight')}
                className="w-full bg-black hover:bg-gray-800 text-white"
                disabled={!spotlightContent}
              >
                {copiedId === 'spotlight' ? (
                  <><CheckCircle className="h-4 w-4 mr-2" /> Copied!</>
                ) : (
                  <><Copy className="h-4 w-4 mr-2" /> Copy spotlight</>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Custom Template Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-5 w-5 text-gray-600" />
            Custom Template
          </CardTitle>
          <CardDescription>
            Write a template using
            <code className="mx-1 px-1 bg-gray-100 rounded">{`{placeholders}`}</code>
            — the live preview fills them with your real numbers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={customTemplate}
            onChange={e => setCustomTemplate(e.target.value)}
            rows={8}
            className="font-mono text-sm"
          />
          <div>
            <div className="text-xs text-gray-600 mb-1">Available placeholders:</div>
            <div className="flex flex-wrap gap-1">
              {Object.keys(customPlaceholders).map(k => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setCustomTemplate(t => `${t}{${k}}`)}
                  className="text-xs px-2 py-0.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded font-mono"
                  title={`Insert {${k}} (current value: ${customPlaceholders[k]})`}
                >
                  {`{${k}}`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Preview:</div>
            <div className="bg-gray-50 rounded p-4 border border-gray-200">
              <pre className="whitespace-pre-wrap text-sm text-gray-900 font-sans">{customRendered}</pre>
            </div>
          </div>
          <Button
            onClick={() => copyToClipboard(customRendered, 'custom-template')}
            className="w-full bg-black hover:bg-gray-800 text-white"
          >
            {copiedId === 'custom-template' ? (
              <><CheckCircle className="h-4 w-4 mr-2" /> Copied!</>
            ) : (
              <><Copy className="h-4 w-4 mr-2" /> Copy custom post</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Instagram Content Templates (now editable) */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pre-built Templates</h3>
        <p className="text-sm text-gray-600 mb-4">
          Tweak the copy in any card before you copy — your edits stay until you click <strong>Reset</strong>.
        </p>
        <div className="grid gap-4">
          {templates.map(template => {
            const IconComponent = template.icon;
            const value = editedTemplates[template.id] ?? template.content;
            const isEdited = editedTemplates[template.id] !== undefined
              && editedTemplates[template.id] !== template.content;
            return (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                    {template.title}
                    {isEdited && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-900 border border-yellow-200 text-[10px]">
                        edited
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    value={value}
                    onChange={e => setEditedTemplates(prev => ({ ...prev, [template.id]: e.target.value }))}
                    rows={Math.min(14, value.split('\n').length + 1)}
                    className="font-mono text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyToClipboard(value, template.id)}
                      className="flex-1"
                      variant={copiedId === template.id ? 'default' : 'outline'}
                    >
                      {copiedId === template.id ? (
                        <><CheckCircle className="h-4 w-4 mr-2" /> Copied!</>
                      ) : (
                        <><Copy className="h-4 w-4 mr-2" /> Copy</>
                      )}
                    </Button>
                    {isEdited && (
                      <Button
                        variant="outline"
                        onClick={() => setEditedTemplates(prev => {
                          const next = { ...prev };
                          delete next[template.id];
                          return next;
                        })}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}