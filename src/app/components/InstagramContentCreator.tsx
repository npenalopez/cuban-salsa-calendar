import { useMemo, useState } from 'react';
import { type Festival } from '../data/festivals';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Copy, TrendingUp, DollarSign, Users, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { toast } from "sonner";
import { formatFestivalPrice } from '../utils/priceUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface InstagramContentCreatorProps {
  festivals: Festival[];
}

export function InstagramContentCreator({ festivals }: InstagramContentCreatorProps) {
  const { t } = useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

      {/* Instagram Content Templates */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Instagram Content Templates</h3>
        <div className="grid gap-4">
          {templates.map((template) => {
            const IconComponent = template.icon;
            return (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                    {template.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <pre className="whitespace-pre-wrap text-sm text-gray-900 font-sans">
                      {template.content}
                    </pre>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(template.content, template.id)}
                    className="w-full"
                    variant={copiedId === template.id ? "default" : "outline"}
                  >
                    {copiedId === template.id ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}