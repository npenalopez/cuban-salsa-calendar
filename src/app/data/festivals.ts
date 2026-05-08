export interface Festival {
  id: string;
  name: string;
  city: string;
  country: string;
  continent: string;
  dates: string;
  price: string;
  months?: string[]; // Computed from dates
  website?: string;
  instagram?: string;
  description?: string;
  artists?: string[];
  coordinates?: [number, number]; // [latitude, longitude]
  venue?: string;
  category?: string;
  yearsActive?: string;
}

export const continents = [
  "North America",
  "South America",
  "Europe",
  "Africa",
  "Asia",
  "Oceania",
];

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Seed festivals — used the first time the app runs against an empty
// Supabase database. After that, data is loaded and edited via Supabase.
export const festivals: Festival[] = [
    {
      "id": "yab-festival-mantes-2026",
      "name": "YAB Festival",
      "city": "Mantes-la-Jolie",
      "country": "France",
      "continent": "Europe",
      "dates": "January 9-12, 2026",
      "price": "-",
      "website": "https://www.yabfestival.com",
      "instagram": "@yab_festival",
      "description": "4th edition. 3 parties, 30 workshops, 2 LIVE concerts. Salsa, Timba, Son, Rueda, Reggaeton, Afro Rumba, Afrobeat. Hall 5 Parc des Expositions, 30min from Paris. 700+ people, 15 international teachers. Tumbakin live concert Saturday. Organized by Association Cubagana.",
      "artists": [
        "Alberto Valdez",
        "Diana Rodriguez",
        "Danger & Marielkis",
        "Yusimi Moya",
        "Chiky Rodriguez",
        "Laura Del Vecchio",
        "Katerina Mik",
        "Alain Rueda",
        "Osmell Relampago",
        "Royma Rodriguez",
        "Jimi Jacks",
        "Luis Duarte",
        "Andria Panagi",
        "Lorenys Rodriguez",
        "Carlos Manolo",
        "DJ Yan El Diablito",
        "DJ Jack El Calvo",
        "DJ Amine",
        "DJ Chanchan",
        "DJ Changuinero",
        "DJ Tom Nka",
        "DJ Assane",
        "DJ Courlito",
        "DJ Pastaguero",
        "Martha Galarraga",
        "Alisvey Portuondo",
        "Javier Campos",
        "Sebastian Quezada",
        "Olori Afro Dance",
        "Tumbakin"
      ],
      "coordinates": [
        48.9907,
        1.7166
      ],
      "venue": "Hall 5 Parc des Expositions, Mantes-la-Jolie",
      "category": "Festival",
      "months": [
        "January"
      ]
    },
    {
      "id": "reno-latin-dance-fest-2026",
      "name": "Reno Latin Dance Fest",
      "city": "Reno",
      "country": "USA",
      "continent": "North America",
      "dates": "January 9-11, 2026",
      "price": "-",
      "website": "https://www.renolatindancefest.com",
      "instagram": "@renolatindancefest",
      "description": "Mixed-style Latin dance festival with a Cuban salsa room.",
      "artists": [
        "-"
      ],
      "coordinates": [
        39.5296,
        -119.8138
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "January"
      ]
    },
    {
      "id": "tumbao-festival-dubai-2026",
      "name": "Tumbao Festival Dubai",
      "city": "Dubai",
      "country": "United Arab Emirates",
      "continent": "Asia",
      "dates": "January 16-18, 2026",
      "price": "-",
      "website": "",
      "instagram": "@tumbaofestivaldubai",
      "description": "Cuban salsa festival in Dubai.",
      "artists": [
        "-"
      ],
      "coordinates": [
        25.2048,
        55.2708
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "January"
      ]
    },
    {
      "id": "cuba-me-mucho-angers-2026",
      "name": "Cuba Me Mucho - Angers Salsa Festival",
      "city": "Angers",
      "country": "France",
      "continent": "Europe",
      "dates": "January 16-18, 2026",
      "price": "-",
      "website": "https://bailaconamigos.com",
      "instagram": "@bailaconamigos",
      "description": "6th edition. 30+ hours of workshops, 2 evening parties, dance afternoon, shows, conference, expo. Friday night theme: 1920s-30s. Hosted at hippodrome du Lion d'Angers.",
      "artists": [
        "DJ Jack El Calvo",
        "DJ Patricia La Peruana",
        "DJ Caro la Tremenda",
        "DJ Samir Pastaguero",
        "DJ Didi el Ciclón",
        "DJ Kiki",
        "DJ Chico",
        "DJ Willo",
        "DJ Sensación",
        "DJ H.",
        "Martha Galarraga",
        "Tito Belén",
        "Keiler Brunet",
        "Alisvey Portuondo",
        "Team Olori"
      ],
      "coordinates": [
        47.4784,
        -0.5632
      ],
      "venue": "Hippodrome du Lion d'Angers",
      "category": "Festival",
      "yearsActive": "since 2020",
      "months": [
        "January"
      ]
    },
    {
      "id": "latin-festival-wurzburg-2026",
      "name": "Latin Festival Würzburg",
      "city": "Würzburg",
      "country": "Germany",
      "continent": "Europe",
      "dates": "January 23-25, 2026",
      "price": "-",
      "website": "",
      "instagram": "@latinfestival_wuerzburg",
      "description": "Latin dance festival in Bavaria with a Cuban salsa room.",
      "artists": [
        "-"
      ],
      "coordinates": [
        49.7913,
        9.9534
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "January"
      ]
    },
    {
      "id": "para-el-alma-divertir-augsburg-2026",
      "name": "Para el Alma Divertir - Cuban Son Weekend",
      "city": "Augsburg",
      "country": "Germany",
      "continent": "Europe",
      "dates": "January 23-25, 2026",
      "price": "-",
      "website": "",
      "instagram": "@para.el.alma.divertir",
      "description": "Cuban Son specialist weekend in Bavaria.",
      "artists": [
        "-"
      ],
      "coordinates": [
        48.3705,
        10.8978
      ],
      "venue": "-",
      "category": "Weekender",
      "months": [
        "January"
      ]
    },
    {
      "id": "quien-manda-aubagne-2026",
      "name": "Quien Manda Festival",
      "city": "Aubagne",
      "country": "France",
      "continent": "Europe",
      "dates": "January 30 - February 2, 2026",
      "price": "-",
      "website": "https://my.weezevent.com/quien-manda-festival-2026",
      "instagram": "@quienmandafestival",
      "description": "3rd edition - 'Mezclando Culturas'. Cuban Salsa + Dominican Bachata + new Puerto Rican Salsa room. 100% women + 100% men workshops, bootcamps, before parties.",
      "artists": [
        "Bersy Cortez",
        "Tania Cannarsa",
        "Desiree Godsell",
        "Diana Rodriguez",
        "Yusimi Moya",
        "Amneris Martinez",
        "Alicia Velasco",
        "Alex Toledo",
        "Yanet Fuentes",
        "Yenifer Lavin",
        "Marielkis Hernandez",
        "Giusy Chisari",
        "Zarema Amore",
        "Meline Teulier",
        "Angela Mariano",
        "Mabel Oriola",
        "Anna Ruiz",
        "Sarah La Morena",
        "Dida",
        "Mel Tremenda",
        "Maria de la Vega",
        "Anesslyne Baila",
        "Fatouma",
        "Gulnara",
        "Terry",
        "Yoyo Flow",
        "Fredyclan",
        "Pedrito",
        "Danger Rodriguez",
        "Adonis Santiago",
        "Yosniel Brunet",
        "Andres Timbamania",
        "C.H.O.C.O",
        "Ned Neddy",
        "J.R. El Artista",
        "Alberto Vasquez",
        "DJ Assane",
        "DJ Tom Nka",
        "DJ Pastaguero"
      ],
      "coordinates": [
        43.2939,
        5.5704
      ],
      "venue": "Centre des Congrès Agora",
      "category": "Festival",
      "yearsActive": "since 2024",
      "months": [
        "January",
        "February"
      ]
    },
    {
      "id": "unidanza-hamburg-2026",
      "name": "Unidanza",
      "city": "Hamburg",
      "country": "Germany",
      "continent": "Europe",
      "dates": "February 6-8, 2026",
      "price": "-",
      "website": "",
      "instagram": "@unidanza_hamburg",
      "description": "Cuban salsa festival in northern Germany.",
      "artists": [
        "-"
      ],
      "coordinates": [
        53.5511,
        9.9937
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "February"
      ]
    },
    {
      "id": "dame-festival-valencia-2026",
      "name": "Dame Festival Valencia",
      "city": "Valencia",
      "country": "Spain",
      "continent": "Europe",
      "dates": "February 6-8, 2026",
      "price": "-",
      "website": "https://www.damefestival.es",
      "instagram": "@damefestival",
      "description": "Pure Cuban salsa, timba, son, rumba and guaguancó. 'El mejor festival de Valencia'. Bootcamp directed by Diana Rodriguez. Family atmosphere.",
      "artists": [
        "Diana Rodriguez (bootcamp lead)"
      ],
      "coordinates": [
        39.4699,
        -0.3763
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "February"
      ]
    },
    {
      "id": "alocubano-havana-2026",
      "name": "AloCubano Havana",
      "city": "Havana",
      "country": "Cuba",
      "continent": "North America",
      "dates": "February 18 - March 1, 2026",
      "price": "-",
      "website": "https://alocubano.se",
      "instagram": "@alocubano",
      "description": "AloCubano's Cuba edition - full immersion experience at the source.",
      "artists": [
        "-"
      ],
      "coordinates": [
        23.1136,
        -82.3666
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "February"
      ]
    },
    {
      "id": "arrebatate-budapest-2026",
      "name": "Arrebátate Cuban New Year Festival",
      "city": "Budapest",
      "country": "Hungary",
      "continent": "Europe",
      "dates": "February 20-23, 2026",
      "price": "-",
      "website": "",
      "instagram": "@arrebatate.cuban.festival",
      "description": "Craziest Cuban festival in the heart of Europe - pure Cuban casino, rueda, and timba.",
      "artists": [
        "-"
      ],
      "coordinates": [
        47.4979,
        19.0402
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "February"
      ]
    },
    {
      "id": "festival-de-la-salsa-havana-2026",
      "name": "Festival de la Salsa - 10th Anniversary",
      "city": "Havana",
      "country": "Cuba",
      "continent": "North America",
      "dates": "February 26 - March 1, 2026",
      "price": "-",
      "website": "https://www.solwayscuba.com",
      "instagram": "@festivaldelasalsahavana",
      "description": "10th anniversary edition. Concerts by Cuba's top orchestras, salsa/rumba/timba workshops, performances, pool parties. Hotel Memorias Miramar.",
      "artists": [
        "Maykel Blanco y su Salsa Mayor",
        "Alexander Abreu y Havana D'Primera",
        "Pupy y Los Que Son Son",
        "Adalberto Álvarez y Su Son",
        "Elito Revé y Su Charangón",
        "Manolito Simonet y Su Trabuco",
        "Alain Pérez",
        "Isaac Delgado",
        "Maykel Fonts",
        "Jennyselt Galata",
        "DJ Jack El Calvo",
        "DJ Patricia La Peruana",
        "DJ Andrea Androger",
        "DJ Cato Tumba",
        "DJ Javier Miramar"
      ],
      "coordinates": [
        23.1136,
        -82.3666
      ],
      "venue": "Hotel Memories Miramar / Club 500",
      "category": "Festival",
      "yearsActive": "since 2017",
      "months": [
        "February",
        "March"
      ]
    },
    {
      "id": "vip-havana-salsa-festival-2026",
      "name": "VIP Havana Salsa Festival Tour",
      "city": "Havana",
      "country": "Cuba",
      "continent": "North America",
      "dates": "February 25 - March 2, 2026",
      "price": "-",
      "website": "https://havanamusictours.com/vip-havana-salsa-festival-tour/",
      "instagram": "@havanamusictours",
      "description": "VIP cultural tour with priority access to Havana Salsa Festival concerts. Son, timba, salsa with Cuba's top bands.",
      "artists": [
        "Alexander Abreu y Havana D'Primera",
        "Pupy y Los Que Son Son",
        "Adalberto Álvarez y Su Son",
        "Elito Revé y Su Charangón",
        "Maikel Blanco y Su Salsa Mayor",
        "Manolito Simonet y Su Trabuco",
        "Alain Pérez",
        "Isaac Delgado"
      ],
      "coordinates": [
        23.1136,
        -82.3666
      ],
      "venue": "Various venues, Havana",
      "category": "Festival",
      "months": [
        "February"
      ]
    },
    {
      "id": "timba-mastery-cologne-2026",
      "name": "Timba Mastery Festival",
      "city": "Cologne",
      "country": "Germany",
      "continent": "Europe",
      "dates": "March 6-9, 2026",
      "price": "-",
      "website": "",
      "instagram": "@timbamastery",
      "description": "3rd edition - Cologne's Cuban salsa congress. 13 immersive workshops, multiple socials, timba-style performances.",
      "artists": [
        "Alberto Valdés",
        "Sava",
        "Elio",
        "Enrique",
        "Iljana",
        "Aram"
      ],
      "coordinates": [
        50.9375,
        6.9603
      ],
      "venue": "Emdener Straße 68, Köln",
      "category": "Congress",
      "yearsActive": "since 2024",
      "months": [
        "March"
      ]
    },
    {
      "id": "womens-weekend-augsburg-2026",
      "name": "Women's Weekend - Cuban Style Meeting",
      "city": "Augsburg",
      "country": "Germany",
      "continent": "Europe",
      "dates": "March 7-8, 2026",
      "price": "-",
      "website": "",
      "instagram": "@womens_weekend_cuban",
      "description": "Women-focused Cuban style meeting in Bavaria.",
      "artists": [
        "-"
      ],
      "coordinates": [
        48.3705,
        10.8978
      ],
      "venue": "-",
      "category": "Weekender",
      "months": [
        "March"
      ]
    },
    {
      "id": "arrasando-bremen-2026",
      "name": "Arrasando Cuban Afro-Salsa Festival",
      "city": "Bremen",
      "country": "Germany",
      "continent": "Europe",
      "dates": "March 13-15, 2026",
      "price": "-",
      "website": "",
      "instagram": "@arrasando_bremen",
      "description": "Cuban and Afro-Cuban salsa weekend with focus on roots and tradition.",
      "artists": [
        "-"
      ],
      "coordinates": [
        53.0793,
        8.8017
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "March"
      ]
    },
    {
      "id": "saoco-cuban-festival-aix-2026",
      "name": "Saoco Cuban Festival",
      "city": "Aix-en-Provence",
      "country": "France",
      "continent": "Europe",
      "dates": "March 20-22, 2026",
      "price": "-",
      "website": "https://www.billetweb.fr/saoco-cuban-festival-2026",
      "instagram": "@saoco_cuban_festival",
      "description": "3rd edition - Cuban salsa, rumba, styling, timba, fusion, Afro (with live percussion), son, rueda de casino, cha-cha-cha, reggaeton. Limited to 250 dancers. Bootcamp Afro Contemporain with Yuniel Gual.",
      "artists": [
        "Yuniel Gual",
        "Andros Alfonso"
      ],
      "coordinates": [
        43.5297,
        5.4474
      ],
      "venue": "Europia",
      "category": "Festival",
      "yearsActive": "since 2024",
      "months": [
        "March"
      ]
    },
    {
      "id": "fem-festival-lhermitage-2026",
      "name": "FEM Festival",
      "city": "L'Hermitage",
      "country": "France",
      "continent": "Europe",
      "dates": "March 20-22, 2026",
      "price": "-",
      "website": "",
      "instagram": "@fem_festival_cuban",
      "description": "Female-focused Cuban dance festival in Brittany.",
      "artists": [
        "-"
      ],
      "coordinates": [
        48.1311,
        -1.7848
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "March"
      ]
    },
    {
      "id": "meneate-viena-2026",
      "name": "¡Menéate! Viena Cuban Dance Festival",
      "city": "Vienna",
      "country": "Austria",
      "continent": "Europe",
      "dates": "March 26-29, 2026",
      "price": "-",
      "website": "",
      "instagram": "@meneateviena",
      "description": "Four days of salsa, timba, son, rumba, afro, reggaeton, and casino - Cuban culture promotion in Vienna with rooftop parties.",
      "artists": [
        "-"
      ],
      "coordinates": [
        48.2082,
        16.3738
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "March"
      ]
    },
    {
      "id": "berlin-fiesta-elegante-2026",
      "name": "Berlin Salsa Festival 'Fiesta Elegante'",
      "city": "Berlin",
      "country": "Germany",
      "continent": "Europe",
      "dates": "March 27-29, 2026",
      "price": "€129-€139",
      "website": "https://www.berlinsalsafestival.com",
      "instagram": "@berlinsalsafestival",
      "description": "4th edition. One of Europe's most exciting Cuban salsa festivals - son, Afro-Cuban, salsa, timba, reggaeton with dancers from 30+ countries. Live concert by Maykel Blanco y su Salsa Mayor. Limited to 480 tickets.",
      "artists": [
        "Maykel Fonts",
        "Yoyo Flow (Yoandy Villaurrutia)",
        "Yusimi Moya Rodriguez",
        "Jorge & Indira",
        "Cuban Flex",
        "Luis Duarte",
        "Andy & Yuliet",
        "Hector Oviedo Abreu",
        "Danger & Marielkis",
        "Oliwia Szewczak",
        "Royma Roman",
        "Mahmoud Morsi",
        "Orisun Company (Luca Caldore)",
        "Louise & Marvin (Salsa4Water)",
        "Ido & Agnita (La Candela)",
        "Alexander Scull",
        "DJ Andrea Androger (Los DJs Timberos)",
        "DJ Yala El Puma",
        "DJ El Faraoun",
        "DJ Tamboly",
        "Maykel Blanco y su Salsa Mayor (LIVE)"
      ],
      "coordinates": [
        52.52,
        13.405
      ],
      "venue": "Atelier Gardens / Napoleon Komplex",
      "category": "Festival",
      "yearsActive": "since 2023",
      "months": [
        "March"
      ]
    },
    {
      "id": "festival-cubayonne-bayonne-2026",
      "name": "Festival Cubayonne",
      "city": "Bayonne",
      "country": "France",
      "continent": "Europe",
      "dates": "March 27-29, 2026",
      "price": "-",
      "website": "",
      "instagram": "@cubayonne_bayonne",
      "description": "Cuban dance festival in the Basque Country, organized by Salsa Timbayon.",
      "artists": [
        "-"
      ],
      "coordinates": [
        43.4929,
        -1.4748
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "March"
      ]
    },
    {
      "id": "pura-cuba-evere-2026",
      "name": "Pura Cuba",
      "city": "Evere",
      "country": "Belgium",
      "continent": "Europe",
      "dates": "March 28, 2026",
      "price": "-",
      "website": "",
      "instagram": "@puracuba_brussels",
      "description": "One-day Cuban salsa event in the Brussels area.",
      "artists": [
        "-"
      ],
      "coordinates": [
        50.8722,
        4.4036
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "March"
      ]
    },
    {
      "id": "afro-cuban-dance-festival-havana-2026",
      "name": "Afro Cuban Dance Festival Havana",
      "city": "Havana",
      "country": "Cuba",
      "continent": "North America",
      "dates": "April 2-13, 2026",
      "price": "-",
      "website": "",
      "instagram": "@afrocubandancefestival",
      "description": "Twelve days of Afro-Cuban folkloric dance, rumba, and casino in Havana.",
      "artists": [
        "-"
      ],
      "coordinates": [
        23.1136,
        -82.3666
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "April"
      ]
    },
    {
      "id": "baila-baila-helsinki-2026",
      "name": "Baila Baila Salsa Festival",
      "city": "Helsinki",
      "country": "Finland",
      "continent": "Europe",
      "dates": "April 2-5, 2026",
      "price": "-",
      "website": "",
      "instagram": "@bailabaila_helsinki",
      "description": "Cuban salsa festival in the Finnish capital.",
      "artists": [
        "-"
      ],
      "coordinates": [
        60.1699,
        24.9384
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "April"
      ]
    },
    {
      "id": "ritmo-cuba-2026",
      "name": "Ritmo Cuba",
      "city": "Havana",
      "country": "Cuba",
      "continent": "North America",
      "dates": "April 6-12, 2026",
      "price": "-",
      "website": "https://www.dancefestivalincuba.com",
      "instagram": "@ritmocuba",
      "description": "8th edition. International Cuban dance festival in Havana - 100+ hours of workshops with 60+ teachers across 3 rooms, plus nightly parties at Casa de la Música. Hotel Nacional de Cuba.",
      "artists": [
        "Maykel Fonts",
        "Jorge & Indira",
        "Diana Rodríguez",
        "Adonis Santiago",
        "Silvia & Silvio (La Casona del Son)",
        "Jorge Luna",
        "Karelia Despaigne",
        "Mariesly Paradelo",
        "Los Datway",
        "Yoerlis Brunet (Danza Contemporánea de Cuba)",
        "Yoanis Peláez",
        "Oddebi",
        "Adrian Pozo (La Casona del Son)",
        "Geissa Barr"
      ],
      "coordinates": [
        23.1136,
        -82.3666
      ],
      "venue": "Hotel Nacional de Cuba",
      "category": "Festival",
      "yearsActive": "since 2018",
      "months": [
        "April"
      ]
    },
    {
      "id": "nordic-salsa-experience-oslo-2026",
      "name": "Nordic Salsa Experience",
      "city": "Oslo",
      "country": "Norway",
      "continent": "Europe",
      "dates": "April 10-12, 2026",
      "price": "-",
      "website": "",
      "instagram": "@nordicsalsaexperience",
      "description": "Nordic SBK and Cuban salsa weekend.",
      "artists": [
        "-"
      ],
      "coordinates": [
        59.9139,
        10.7522
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "April"
      ]
    },
    {
      "id": "manana-ljubljana-2026",
      "name": "Manana Ljubljana",
      "city": "Ljubljana",
      "country": "Slovenia",
      "continent": "Europe",
      "dates": "April 10-12, 2026",
      "price": "-",
      "website": "",
      "instagram": "@manana_ljubljana",
      "description": "Cuban salsa weekend in the Slovenian capital.",
      "artists": [
        "-"
      ],
      "coordinates": [
        46.0569,
        14.5058
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "April"
      ]
    },
    {
      "id": "la-dosis-london-2026",
      "name": "La Dosis (by Rueda Libre)",
      "city": "London",
      "country": "United Kingdom",
      "continent": "Europe",
      "dates": "April 10-12, 2026",
      "price": "-",
      "website": "https://ruedalibre.co.uk",
      "instagram": "@ruedalibre",
      "description": "Rueda de casino specialist weekend organized by Rueda Libre London.",
      "artists": [
        "-"
      ],
      "coordinates": [
        51.5074,
        -0.1278
      ],
      "venue": "-",
      "category": "Weekender",
      "months": [
        "April"
      ]
    },
    {
      "id": "sydney-grupo-niche-2026",
      "name": "Sydney Salsa Festival with Grupo Niche",
      "city": "Sydney",
      "country": "Australia",
      "continent": "Oceania",
      "dates": "April 11, 2026",
      "price": "-",
      "website": "https://events.humanitix.com/sydney-salsa-festival-with-el-grupo-niche-more",
      "instagram": "@casablancaeventssydney",
      "description": "Outdoor salsa festival featuring Colombian salsa legends Grupo Niche, Cuban music and Latin dance.",
      "artists": [
        "Grupo Niche"
      ],
      "coordinates": [
        -33.8688,
        151.2093
      ],
      "venue": "Tumbalong Park",
      "category": "Festival",
      "months": [
        "April"
      ]
    },
    {
      "id": "festival-cultura-cubana-montesilvano-2026",
      "name": "Festival Cultura Cubana FCC",
      "city": "Montesilvano",
      "country": "Italy",
      "continent": "Europe",
      "dates": "Mid-April 2026",
      "price": "-",
      "website": "",
      "instagram": "@festivalculturacubana",
      "description": "Three days of timba, casino, and Afro-Cubano folklore on the Abruzzo coast - concerts, workshops, paired with Festival Cultura Dominicana.",
      "artists": [
        "-"
      ],
      "coordinates": [
        42.5147,
        14.1467
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "April"
      ]
    },
    {
      "id": "corazon-y-mezcla-barcelona-2026",
      "name": "Corazón Y Mezcla Festival",
      "city": "Barcelona",
      "country": "Spain",
      "continent": "Europe",
      "dates": "April 17-23, 2026",
      "price": "-",
      "website": "",
      "instagram": "@corazon_y_mezcla",
      "description": "Week-long Cuban salsa festival in Catalonia.",
      "artists": [
        "-"
      ],
      "coordinates": [
        41.3851,
        2.1734
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "April"
      ]
    },
    {
      "id": "cubaneo-festival-nurnberg-2026",
      "name": "Cubaneo el Festival",
      "city": "Nürnberg",
      "country": "Germany",
      "continent": "Europe",
      "dates": "April 17-19, 2026",
      "price": "-",
      "website": "http://www.cubaneo-el-festival.de",
      "instagram": "@cubaneo.el.festival",
      "description": "Cuban salsa festival in Nuremberg with limited tickets and intimate atmosphere.",
      "artists": [
        "Charles DJ Cuba",
        "DJ Amaury",
        "CubaDanza"
      ],
      "coordinates": [
        49.4521,
        11.0767
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "April"
      ]
    },
    {
      "id": "cubason-weekender-vancouver-2026",
      "name": "CubaSon Weekender",
      "city": "Vancouver",
      "country": "Canada",
      "continent": "North America",
      "dates": "April 17-19, 2026",
      "price": "-",
      "website": "",
      "instagram": "@cubason_weekender",
      "description": "Cuban son and salsa weekender in Vancouver.",
      "artists": [
        "-"
      ],
      "coordinates": [
        49.2827,
        -123.1207
      ],
      "venue": "-",
      "category": "Weekender",
      "months": [
        "April"
      ]
    },
    {
      "id": "timbalameania-augsburg-2026",
      "name": "Timbalameania",
      "city": "Augsburg",
      "country": "Germany",
      "continent": "Europe",
      "dates": "April 23-26, 2026",
      "price": "-",
      "website": "",
      "instagram": "@timbalameania",
      "description": "Timba-focused Cuban salsa festival.",
      "artists": [
        "-"
      ],
      "coordinates": [
        48.3705,
        10.8978
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "April"
      ]
    },
    {
      "id": "dia-del-son-szeged-2026",
      "name": "Día del Son",
      "city": "Szeged",
      "country": "Hungary",
      "continent": "Europe",
      "dates": "April 30 - May 3, 2026",
      "price": "-",
      "website": "",
      "instagram": "@diadelson_szeged",
      "description": "5th edition - Cuban son specialist festival in southern Hungary.",
      "artists": [
        "-"
      ],
      "coordinates": [
        46.253,
        20.1414
      ],
      "venue": "-",
      "category": "Festival",
      "yearsActive": "since 2022",
      "months": [
        "April",
        "May"
      ]
    },
    {
      "id": "boston-cuban-dance-festival-2026",
      "name": "Boston Cuban Dance Festival",
      "city": "Boston",
      "country": "USA",
      "continent": "North America",
      "dates": "May 1-3, 2026",
      "price": "-",
      "website": "",
      "instagram": "@bostoncubandancefestival",
      "description": "New England's Cuban salsa weekend - workshops, rueda, and Afro-Cuban classes.",
      "artists": [
        "-"
      ],
      "coordinates": [
        42.3601,
        -71.0589
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "May"
      ]
    },
    {
      "id": "salsa-on-tour-italy-florence-2026",
      "name": "Salsa On Tour Italy",
      "city": "Florence",
      "country": "Italy",
      "continent": "Europe",
      "dates": "May 6-9, 2026",
      "price": "-",
      "website": "",
      "instagram": "@salsaontour_italia",
      "description": "Multi-style salsa festival with Cuban room in Tuscany.",
      "artists": [
        "-"
      ],
      "coordinates": [
        43.7696,
        11.2558
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "May"
      ]
    },
    {
      "id": "cubanero-novi-sad-2026",
      "name": "Cubanero Salsa Festival",
      "city": "Novi Sad",
      "country": "Serbia",
      "continent": "Europe",
      "dates": "May 7-11, 2026",
      "price": "-",
      "website": "",
      "instagram": "@cubanero_festival",
      "description": "Five-day Cuban salsa festival in Serbia's second city.",
      "artists": [
        "-"
      ],
      "coordinates": [
        45.2671,
        19.8335
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "May"
      ]
    },
    {
      "id": "salsa-on-the-beach-bibione-2026",
      "name": "Salsa on the Beach Bibione",
      "city": "Bibione",
      "country": "Italy",
      "continent": "Europe",
      "dates": "May 7-9, 2026",
      "price": "-",
      "website": "",
      "instagram": "@salsaonthebeach",
      "description": "Beach salsa festival on the Adriatic coast.",
      "artists": [
        "-"
      ],
      "coordinates": [
        45.6396,
        13.0497
      ],
      "venue": "Bibione Beach",
      "category": "Festival",
      "months": [
        "May"
      ]
    },
    {
      "id": "sabor-cubano-copenhagen-2026",
      "name": "Sabor Cubano - Copenhagen Cuban Dance Festival",
      "city": "Copenhagen",
      "country": "Denmark",
      "continent": "Europe",
      "dates": "May 8-10, 2026",
      "price": "-",
      "website": "",
      "instagram": "@saborcubano_cph",
      "description": "Copenhagen's dedicated Cuban salsa festival.",
      "artists": [
        "-"
      ],
      "coordinates": [
        55.6761,
        12.5683
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "May"
      ]
    },
    {
      "id": "salazar-rueda-zurich-2026",
      "name": "Salazar Rueda Festival - 3rd International Rueda Festival",
      "city": "Zurich",
      "country": "Switzerland",
      "continent": "Europe",
      "dates": "May 8-10, 2026",
      "price": "CHF 130+",
      "website": "",
      "instagram": "@salazar_rueda",
      "description": "3rd edition - 3 days of dancing, 26 workshops with 15 international artists, 2 themed parties, bootcamp. Rueda de casino specialist event.",
      "artists": [
        "-"
      ],
      "coordinates": [
        47.3769,
        8.5417
      ],
      "venue": "-",
      "category": "Festival",
      "yearsActive": "since 2024",
      "months": [
        "May"
      ]
    },
    {
      "id": "ravenna-salsa-championship-2026",
      "name": "International Salsa Championship for Dancers",
      "city": "Ravenna",
      "country": "Italy",
      "continent": "Europe",
      "dates": "May 7-9, 2026",
      "price": "-",
      "website": "",
      "instagram": "-",
      "description": "6th edition - international salsa championship.",
      "artists": [
        "-"
      ],
      "coordinates": [
        44.4173,
        12.1992
      ],
      "venue": "-",
      "category": "Festival",
      "yearsActive": "since 2021",
      "months": [
        "May"
      ]
    },
    {
      "id": "tenerife-dance-festival-2026",
      "name": "Tenerife Dance Festival",
      "city": "Santa Cruz de Tenerife",
      "country": "Spain",
      "continent": "Europe",
      "dates": "May 12-16, 2026",
      "price": "-",
      "website": "",
      "instagram": "@tenerifedancefestival",
      "description": "Multi-style dance festival in the Canary Islands with Cuban room.",
      "artists": [
        "-"
      ],
      "coordinates": [
        28.4636,
        -16.2518
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "May"
      ]
    },
    {
      "id": "bailasiempre-horsens-2026",
      "name": "BailaSiempre Salsa Weekend",
      "city": "Horsens",
      "country": "Denmark",
      "continent": "Europe",
      "dates": "May 14-17, 2026",
      "price": "-",
      "website": "",
      "instagram": "@bailasiempre",
      "description": "Cuban salsa weekend in eastern Jutland.",
      "artists": [
        "-"
      ],
      "coordinates": [
        55.8608,
        9.8503
      ],
      "venue": "-",
      "category": "Weekender",
      "months": [
        "May"
      ]
    },
    {
      "id": "guaguanco-festival-lloret-2026",
      "name": "Guaguancó Festival - Gold Edition",
      "city": "Lloret de Mar",
      "country": "Spain",
      "continent": "Europe",
      "dates": "May 14-18, 2026",
      "price": "-",
      "website": "https://eveniahotels.com/events/guaguanco",
      "instagram": "@guaguancofestival",
      "description": "Largest international Cuban music and culture festival in Europe. 70th anniversary celebration of Orquesta Revé. Live performances, traditional son groups, folk shows. Attendees from 46+ countries.",
      "artists": [
        "Orquesta Revé (70th anniversary live concert)",
        "Yoyo Flow",
        "Yusimi Moya",
        "Héctor Oviedo",
        "Julio Manguero",
        "Ismaray Chacón",
        "Diana Rodríguez",
        "Yeni Molinet",
        "Yenifer Lavine",
        "Jorge Camaguey",
        "Mari y Jorgito"
      ],
      "coordinates": [
        41.7005,
        2.8444
      ],
      "venue": "Evenia Hotels",
      "category": "Festival",
      "months": [
        "May"
      ]
    },
    {
      "id": "baila-new-york-2026",
      "name": "Baila New York Dance Festival",
      "city": "New York City",
      "country": "USA",
      "continent": "North America",
      "dates": "May 19-22, 2026",
      "price": "-",
      "website": "",
      "instagram": "@bailanewyork",
      "description": "Cuban casino-focused dance festival in NYC.",
      "artists": [
        "-"
      ],
      "coordinates": [
        40.7128,
        -74.006
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "May"
      ]
    },
    {
      "id": "mi-solar-kalogria-2026",
      "name": "Mi Solar Salsa Festival",
      "city": "Kalogria",
      "country": "Greece",
      "continent": "Europe",
      "dates": "May 21-28, 2026",
      "price": "-",
      "website": "https://misolarfestival.com",
      "instagram": "@misolarfestival",
      "description": "Eight-day Cuban salsa beach week on the western Peloponnese coast. Master bootcamp with Yusimi Moya for Afro-Cuban roots. World-class instructors and family-friendly atmosphere.",
      "artists": [
        "Yusimi Moya (Afro-Cuban master bootcamp)",
        "Royma Roman (Ladies bootcamp)",
        "Izabella & Mahmoud Morsi"
      ],
      "coordinates": [
        38.05,
        21.4
      ],
      "venue": "Kalogria Beach Hotel",
      "category": "Festival",
      "months": [
        "May"
      ]
    },
    {
      "id": "timbatumba-summer-tortoreto-2026",
      "name": "Timbatumba Summer Festival",
      "city": "Tortoreto",
      "country": "Italy",
      "continent": "Europe",
      "dates": "May 22-24, 2026",
      "price": "-",
      "website": "https://www.timbatumbaeventi.it",
      "instagram": "@timbatumba_eventi",
      "description": "One of Italy's biggest Latin dance congresses - salsa cubana, bachatango, son, rueda de casino, afro, rumba. Beachside venue with pool and full-board package.",
      "artists": [
        "-"
      ],
      "coordinates": [
        42.805,
        13.91
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "May"
      ]
    },
    {
      "id": "montpel-rueda-festival-2026",
      "name": "Montpel' Rueda Festival",
      "city": "Montpellier",
      "country": "France",
      "continent": "Europe",
      "dates": "May 22-24, 2026",
      "price": "-",
      "website": "",
      "instagram": "@montpel_rueda",
      "description": "Rueda de casino specialist festival in southern France.",
      "artists": [
        "-"
      ],
      "coordinates": [
        43.6108,
        3.8767
      ],
      "venue": "Gymnase Joffre",
      "category": "Festival",
      "months": [
        "May"
      ]
    },
    {
      "id": "cuba-in-tunisia-monastir-2026",
      "name": "Cuba in Tunisia",
      "city": "Monastir",
      "country": "Tunisia",
      "continent": "Africa",
      "dates": "May 28 - June 4, 2026",
      "price": "-",
      "website": "",
      "instagram": "@cuba_in_tunisia",
      "description": "All-inclusive Cuban salsa beach week in Monastir.",
      "artists": [
        "-"
      ],
      "coordinates": [
        35.778,
        10.8262
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "May",
        "June"
      ]
    },
    {
      "id": "croatian-summer-salsa-rovinj-2026",
      "name": "Croatian Summer Salsa Festival",
      "city": "Rovinj",
      "country": "Croatia",
      "continent": "Europe",
      "dates": "June 8-15, 2026",
      "price": "-",
      "website": "https://www.crosalsafestival.com",
      "instagram": "@crosalsafestival",
      "description": "20+ year running mixed-style Adriatic salsa festival with strong Cuban room. Featured Cuban artists.",
      "artists": [
        "Maykel Fonts",
        "Yoyo Flow (Yoandy Villaurrutia)",
        "Jorge & Indira",
        "Diana Rodriguez",
        "Yusimi Moya",
        "DJ Jack El Calvo"
      ],
      "coordinates": [
        45.081,
        13.6388
      ],
      "venue": "-",
      "category": "Festival",
      "yearsActive": "since 2003",
      "months": [
        "June"
      ]
    },
    {
      "id": "dame-cuba-frankfurt-2026",
      "name": "Dame Cuba Festival",
      "city": "Frankfurt",
      "country": "Germany",
      "continent": "Europe",
      "dates": "June 12-19, 2026",
      "price": "-",
      "website": "",
      "instagram": "@damecuba.festival",
      "description": "Eight-day Cuban salsa festival in Frankfurt. Workshops in small groups, gala night with shows and live percussion.",
      "artists": [
        "-"
      ],
      "coordinates": [
        50.1109,
        8.6821
      ],
      "venue": "Conexión",
      "category": "Festival",
      "months": [
        "June"
      ]
    },
    {
      "id": "happy-salsa-kuhlungsborn-2026",
      "name": "Happy Salsa Festival",
      "city": "Kühlungsborn",
      "country": "Germany",
      "continent": "Europe",
      "dates": "June 17-21, 2026",
      "price": "-",
      "website": "",
      "instagram": "@happy_salsa_festival",
      "description": "Family-friendly salsa festival on the Baltic Sea coast - live concerts, dance events, kids program.",
      "artists": [
        "-"
      ],
      "coordinates": [
        54.1428,
        11.7494
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "June"
      ]
    },
    {
      "id": "cubos-osijek-2026",
      "name": "CubOs",
      "city": "Osijek",
      "country": "Croatia",
      "continent": "Europe",
      "dates": "June 19-21, 2026",
      "price": "-",
      "website": "",
      "instagram": "@cubos_osijek",
      "description": "Cuban salsa weekender in Slavonia, eastern Croatia.",
      "artists": [
        "-"
      ],
      "coordinates": [
        45.555,
        18.6955
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "June"
      ]
    },
    {
      "id": "cuban-convention-koblenz-2026",
      "name": "Cuban Convention",
      "city": "Koblenz",
      "country": "Germany",
      "continent": "Europe",
      "dates": "June 19-21, 2026",
      "price": "-",
      "website": "",
      "instagram": "@cubanconvention",
      "description": "Cuban salsa convention at the Rhine-Mosel confluence.",
      "artists": [
        "-"
      ],
      "coordinates": [
        50.3569,
        7.589
      ],
      "venue": "-",
      "category": "Congress",
      "months": [
        "June"
      ]
    },
    {
      "id": "all-salsa-festival-lyon-2026",
      "name": "All Salsa Festival Lyon",
      "city": "Meyzieu",
      "country": "France",
      "continent": "Europe",
      "dates": "June 24-28, 2026",
      "price": "-",
      "website": "https://www.allsalsafestival.com",
      "instagram": "@allsalsafestival.lyon",
      "description": "Multi-style salsa festival - Cuban, Mambo, Caleña. 3 dance rooms, outdoor parquet, dedicated rooms per style. 100% Salsa nights.",
      "artists": [
        "Jorge & Indira",
        "DJ Patrick El Clasico",
        "DJ Jack El Calvo",
        "DJ Emilio El Rumbero",
        "DJ Ralph Le Cavo",
        "DJ Yorki de Colombia",
        "DJ Anael",
        "DJ Pastaguero",
        "DJ Luis",
        "DJ Valery",
        "DJ Patricia La Peruana",
        "DJ Nicolas El Buceador",
        "DJ Willy",
        "DJ DMitri",
        "DJ Cycy",
        "DJ Phil Gomis",
        "DJ El Sonoestereo"
      ],
      "coordinates": [
        45.767,
        5.0026
      ],
      "venue": "Markadas Dance Center",
      "category": "Festival",
      "months": [
        "June"
      ]
    },
    {
      "id": "una-bulla-ottawa-2026",
      "name": "Una Bulla",
      "city": "Ottawa",
      "country": "Canada",
      "continent": "North America",
      "dates": "June 26-28, 2026",
      "price": "-",
      "website": "",
      "instagram": "@unabulla_ottawa",
      "description": "Cuban salsa extravaganza in Canada's capital.",
      "artists": [
        "-"
      ],
      "coordinates": [
        45.4215,
        -75.6972
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "June"
      ]
    },
    {
      "id": "los-van-van-barcelona-2026",
      "name": "Los Van Van at Sala Apolo",
      "city": "Barcelona",
      "country": "Spain",
      "continent": "Europe",
      "dates": "July 3, 2026",
      "price": "-",
      "website": "https://www.sala-apolo.com",
      "instagram": "@losvanvancuba",
      "description": "Concert by legendary Cuban orchestra Los Van Van - 'El Tren de la Música Cubana'. Part of Caprichos de Apolo series. Songo, son, Afro-Cuban rhythms.",
      "artists": [
        "Los Van Van"
      ],
      "coordinates": [
        41.3744,
        2.1665
      ],
      "venue": "Sala Apolo",
      "category": "Festival",
      "months": [
        "July"
      ]
    },
    {
      "id": "festival-cubano2-yeti-2026",
      "name": "Festival Cubano2 - 5ème édition",
      "city": "Crozet / Saint-Jean-de-Gonville",
      "country": "France",
      "continent": "Europe",
      "dates": "July 3-5, 2026",
      "price": "-",
      "website": "https://wannadance.com",
      "instagram": "@festival.cubano2",
      "description": "5th edition. Mountain restaurant venue (Le Yeti, accessible via télécabine). Salsa cubana focus near Geneva.",
      "artists": [
        "DJ Jack El Calvo",
        "DJ Tom Nka",
        "DJ Ralph De Cavo",
        "DJ Yala",
        "DJ Lilimba",
        "DJ La Tremenda",
        "DJ Timbalero",
        "DJ Diablito",
        "DJ Chechyto",
        "Chantal",
        "Harold Kinanga",
        "Ayoub & Coya",
        "Chahera"
      ],
      "coordinates": [
        46.2167,
        6.0167
      ],
      "venue": "Le Yeti / Salle communale",
      "category": "Festival",
      "yearsActive": "since 2022",
      "months": [
        "July"
      ]
    },
    {
      "id": "soy-100-cuba-festival-2026",
      "name": "Soy 100% Cuba Festival - Cubania y Manana",
      "city": "Various",
      "country": "France",
      "continent": "Europe",
      "dates": "July 3-5, 2026",
      "price": "-",
      "website": "",
      "instagram": "@soy100cuba",
      "description": "100% Cuban festival organized by Cubania and Manana.",
      "artists": [
        "-"
      ],
      "coordinates": [
        46.6034,
        1.8883
      ],
      "venue": "Salle Hyppolite Derouet",
      "category": "Festival",
      "months": [
        "July"
      ]
    },
    {
      "id": "nordic-salsa-camp-jelling-2026",
      "name": "Nordic Salsa Camp",
      "city": "Jelling",
      "country": "Denmark",
      "continent": "Europe",
      "dates": "July 5-11, 2026",
      "price": "-",
      "website": "",
      "instagram": "@nordic_salsa_camp",
      "description": "Week-long Cuban salsa camp in rural Denmark.",
      "artists": [
        "-"
      ],
      "coordinates": [
        55.7561,
        9.4255
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "July"
      ]
    },
    {
      "id": "cubafrica-salsa-horgues-2026",
      "name": "CubAfrica Salsa Festival",
      "city": "Horgues",
      "country": "France",
      "continent": "Europe",
      "dates": "July 10-13, 2026",
      "price": "-",
      "website": "",
      "instagram": "@cubafrica_salsa",
      "description": "Cuban salsa festival in the Hautes-Pyrénées region.",
      "artists": [
        "-"
      ],
      "coordinates": [
        43.19,
        0.07
      ],
      "venue": "25 Rue de l'Agriculture",
      "category": "Festival",
      "months": [
        "July"
      ]
    },
    {
      "id": "cuban-camp-bosei-2026",
      "name": "Cuban Camp",
      "city": "Bosei",
      "country": "Denmark",
      "continent": "Europe",
      "dates": "July 19-25, 2026",
      "price": "-",
      "website": "",
      "instagram": "@cubancamp.dk",
      "description": "Week-long residential Cuban salsa camp at Bosei Efterskole.",
      "artists": [
        "-"
      ],
      "coordinates": [
        55.13,
        12.04
      ],
      "venue": "Bosei Efterskole",
      "category": "Festival",
      "months": [
        "July"
      ]
    },
    {
      "id": "miami-salsa-congress-2026",
      "name": "Miami Salsa Congress",
      "city": "Miami",
      "country": "USA",
      "continent": "North America",
      "dates": "July 22-27, 2026",
      "price": "-",
      "website": "https://www.miamisalsacongress.com",
      "instagram": "@miamisalsacongress",
      "description": "Multi-style salsa congress with Cuban room and live Cuban music.",
      "artists": [
        "-"
      ],
      "coordinates": [
        25.7617,
        -80.1918
      ],
      "venue": "-",
      "category": "Congress",
      "months": [
        "July"
      ]
    },
    {
      "id": "tempo-latino-vic-fezensac-2026",
      "name": "Tempo Latino",
      "city": "Vic-Fezensac",
      "country": "France",
      "continent": "Europe",
      "dates": "July 30 - August 2, 2026",
      "price": "-",
      "website": "https://tempolatino.com",
      "instagram": "@tempolatino",
      "description": "31st edition - 'Kaleidoscopic 2026'. Largest European Afro-Cuban Latin Music Festival since 1994. 4 days, 500 volunteers. At the Arènes Joseph-Fourniol.",
      "artists": [
        "Maite Hontele & Orquesta Akokán",
        "Alfredo Rodriguez",
        "Tony Succar",
        "Yilian Cañizares",
        "La Yegros"
      ],
      "coordinates": [
        43.7561,
        0.3056
      ],
      "venue": "Arènes Joseph Fourniol",
      "category": "Festival",
      "months": [
        "July",
        "August"
      ]
    },
    {
      "id": "bachata-cuban-weekend-stockholm-2026",
      "name": "Bachata and Cuban Weekend",
      "city": "Stockholm",
      "country": "Sweden",
      "continent": "Europe",
      "dates": "July 31 - August 2, 2026",
      "price": "-",
      "website": "",
      "instagram": "@stockholm_bachata_cuban",
      "description": "Cuban and bachata weekend in Stockholm.",
      "artists": [
        "-"
      ],
      "coordinates": [
        59.3293,
        18.0686
      ],
      "venue": "-",
      "category": "Weekender",
      "months": [
        "July",
        "August"
      ]
    },
    {
      "id": "bachaturo-katowice-2026",
      "name": "Bachaturo Poland Festival",
      "city": "Katowice",
      "country": "Poland",
      "continent": "Europe",
      "dates": "August 14-16, 2026",
      "price": "-",
      "website": "https://bachaturo.com",
      "instagram": "@bachaturo",
      "description": "16th edition - one of the largest SBKZ festivals in Europe. 5+ dance floors including dedicated Cubana room. 100+ workshops in 12 rooms. Top international teachers across Bachata, Salsa, Kizomba, Cuban.",
      "artists": [
        "-"
      ],
      "coordinates": [
        50.2649,
        19.0238
      ],
      "venue": "-",
      "category": "Festival",
      "yearsActive": "since 2010",
      "months": [
        "August"
      ]
    },
    {
      "id": "salsa-festival-czech-republic-2026",
      "name": "Salsa Festival Czech Republic",
      "city": "Prague",
      "country": "Czech Republic",
      "continent": "Europe",
      "dates": "August 21-24, 2026",
      "price": "-",
      "website": "https://www.salsa-bit.com/festivals-2026/salsa-festival-prague-2026",
      "instagram": "@salsafestivalcr",
      "description": "Official national salsa event of the Czech Republic at Hotel Olympik Congress. Founded by Hanser Estenoz. Salsa cubana, salsa on2, bachata, son, Afro-Cuban dances.",
      "artists": [
        "Wilmer & Maria",
        "Adonis Santiago",
        "Charlie & Vero",
        "Hanser & Vilma",
        "Jose Mari & Patri",
        "Jesús Javier",
        "Yanedis & Daniel",
        "DJ Daladier",
        "DJ Momo",
        "DJ Lole",
        "DJ Maximenko"
      ],
      "coordinates": [
        50.0875,
        14.4378
      ],
      "venue": "Hotel Olympik Congress",
      "category": "Festival",
      "months": [
        "August"
      ]
    },
    {
      "id": "festival-timba-paradise-saarbrucken-2026",
      "name": "Festival Timba Paradise",
      "city": "Saarbrücken",
      "country": "Germany",
      "continent": "Europe",
      "dates": "August 27-31, 2026",
      "price": "-",
      "website": "",
      "instagram": "@timba_paradise",
      "description": "Timba-themed Cuban salsa festival on the German-French border.",
      "artists": [
        "-"
      ],
      "coordinates": [
        49.2401,
        6.9969
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "August"
      ]
    },
    {
      "id": "salsa-stras-festival-strasbourg-2026",
      "name": "Salsa Stras Festival - 20 Years",
      "city": "Strasbourg",
      "country": "France",
      "continent": "Europe",
      "dates": "September 2026 (TBC)",
      "price": "-",
      "website": "",
      "instagram": "@salsastras_festival",
      "description": "20th anniversary edition. 3 days workshops, 3 nights of parties and shows, 2 live concerts by Cuban group Tiempo Cuba. 2 rooms over 1000m². Workshops with live musicians.",
      "artists": [
        "Osbanis & Anetta",
        "Anier Sanchez",
        "Lexis Hernandez",
        "Carla Rojas Salazar",
        "Jonar Gonzalez",
        "Tiempo Cuba"
      ],
      "coordinates": [
        48.5734,
        7.7521
      ],
      "venue": "-",
      "category": "Festival",
      "yearsActive": "since 2006",
      "months": [
        "September"
      ]
    },
    {
      "id": "festival-corazon-latino-bordeaux-2026",
      "name": "Festival Corazon Latino",
      "city": "Cenon",
      "country": "France",
      "continent": "Europe",
      "dates": "September 11-13, 2026",
      "price": "-",
      "website": "",
      "instagram": "@festival_corazon_latino",
      "description": "12th edition - flagship Latin dance event at Parc Palmer with concerts, social parties, and workshops in salsa, bachata, kizomba, cha-cha-cha.",
      "artists": [
        "-"
      ],
      "coordinates": [
        44.8654,
        -0.5193
      ],
      "venue": "Parc de Palmer",
      "category": "Festival",
      "yearsActive": "since 2014",
      "months": [
        "September"
      ]
    },
    {
      "id": "calle-de-timberos-wroclaw-2026",
      "name": "Calle de Timberos - 100% Cuban Festival",
      "city": "Wroclaw",
      "country": "Poland",
      "continent": "Europe",
      "dates": "Mid-September 2026",
      "price": "-",
      "website": "",
      "instagram": "@calledetimberos",
      "description": "Three-day 100% Cuban festival in Lower Silesia's 'little Venice'.",
      "artists": [
        "-"
      ],
      "coordinates": [
        51.1079,
        17.0385
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "September"
      ]
    },
    {
      "id": "obdac-bali-2026",
      "name": "OBDAC Cuban Salsa Fiesta",
      "city": "Bali",
      "country": "Indonesia",
      "continent": "Asia",
      "dates": "September 24-27, 2026",
      "price": "-",
      "website": "",
      "instagram": "@obdac.bali",
      "description": "Cuban salsa fiesta in Bali - workshops and beach socials.",
      "artists": [
        "-"
      ],
      "coordinates": [
        -8.4095,
        115.1889
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "September"
      ]
    },
    {
      "id": "agua-festival-thessaloniki-2026",
      "name": "Agua Festival",
      "city": "Thessaloniki",
      "country": "Greece",
      "continent": "Europe",
      "dates": "September 25-27, 2026",
      "price": "-",
      "website": "",
      "instagram": "@agua_festival",
      "description": "Cuban salsa weekend in northern Greece.",
      "artists": [
        "-"
      ],
      "coordinates": [
        40.6401,
        22.9444
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "September"
      ]
    },
    {
      "id": "hola-cuba-malmo-2026",
      "name": "Hola Cuba - Salsa & Afro-Cuban Festival",
      "city": "Malmö",
      "country": "Sweden",
      "continent": "Europe",
      "dates": "Late September 2026",
      "price": "-",
      "website": "",
      "instagram": "@holacuba.malmo",
      "description": "Two-day Cuban festival by Havana Club Malmö - salsa, casino, timba, rueda, rumba, son, Afro-Cuban, cubaton.",
      "artists": [
        "-"
      ],
      "coordinates": [
        55.605,
        13.0038
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "September"
      ]
    },
    {
      "id": "alocubano-krakow-2026",
      "name": "AloCubano Salsa Festival Warsaw",
      "city": "Warsaw",
      "country": "Poland",
      "continent": "Europe",
      "dates": "October 1-4, 2026",
      "price": "-",
      "website": "https://alocubano.se",
      "instagram": "@alocubano",
      "description": "Note: AloCubano's flagship Polish event has historically rotated between Warsaw and Krakow. Per recent listings, the 2026 edition is in Warsaw (October 1-4). Verify with @alocubano.",
      "artists": [
        "Maykel Blanco"
      ],
      "coordinates": [
        52.2297,
        21.0122
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "October"
      ]
    },
    {
      "id": "cuban-flow-anglet-2026",
      "name": "Cuban Flow Festival",
      "city": "Anglet",
      "country": "France",
      "continent": "Europe",
      "dates": "October 2-4, 2026",
      "price": "-",
      "website": "",
      "instagram": "@cubanflow_anglet",
      "description": "Cuban festival on the Atlantic coast near Biarritz.",
      "artists": [
        "-"
      ],
      "coordinates": [
        43.4845,
        -1.518
      ],
      "venue": "70 bis Av. d'Espagne",
      "category": "Festival",
      "months": [
        "October"
      ]
    },
    {
      "id": "dance-congress-hamburg-2026",
      "name": "Dance Congress Hamburg",
      "city": "Hamburg",
      "country": "Germany",
      "continent": "Europe",
      "dates": "October 9-11, 2026",
      "price": "-",
      "website": "",
      "instagram": "@dancecongresshamburg",
      "description": "Three days of world-class workshops, international shows, and parties in Hamburg.",
      "artists": [
        "-"
      ],
      "coordinates": [
        53.5511,
        9.9937
      ],
      "venue": "-",
      "category": "Congress",
      "months": [
        "October"
      ]
    },
    {
      "id": "dame-cuba-tenerife-2026",
      "name": "Dame Cuba Festival Tenerife",
      "city": "Tenerife",
      "country": "Spain",
      "continent": "Europe",
      "dates": "October 9-11, 2026",
      "price": "-",
      "website": "",
      "instagram": "@damecuba.tenerife",
      "description": "Canary Islands edition of the Dame Cuba Festival.",
      "artists": [
        "-"
      ],
      "coordinates": [
        28.2916,
        -16.6291
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "October"
      ]
    },
    {
      "id": "festival-rueda-globetrotters-toulouse-2026",
      "name": "Festival Rueda GlobeTrotters VOL.8",
      "city": "Toulouse",
      "country": "France",
      "continent": "Europe",
      "dates": "October 9-12, 2026",
      "price": "-",
      "website": "",
      "instagram": "@rueda_globetrotters",
      "description": "8th edition - rueda de casino specialist festival in Occitanie.",
      "artists": [
        "-"
      ],
      "coordinates": [
        43.6047,
        1.4442
      ],
      "venue": "-",
      "category": "Festival",
      "yearsActive": "since 2018",
      "months": [
        "October"
      ]
    },
    {
      "id": "crazy-4-la-timba-lisbon-2026",
      "name": "Crazy 4 la Timba",
      "city": "Lisbon",
      "country": "Portugal",
      "continent": "Europe",
      "dates": "October 15-18, 2026",
      "price": "-",
      "website": "https://crazy4latimba.com",
      "instagram": "@crazy4latimba",
      "description": "5th year - cornerstone of the global Timba community. 35+ Cuban dance workshops, live percussion, beach kick-off, Tumbakin concert. Venues at Timeout Market and Jazzy Dance Studios.",
      "artists": [
        "Tumbakin (LIVE concert)"
      ],
      "coordinates": [
        38.7223,
        -9.1393
      ],
      "venue": "Jazzy Dance Studios / Timeout Market",
      "category": "Festival",
      "yearsActive": "since 2021",
      "months": [
        "October"
      ]
    },
    {
      "id": "festival-de-cuba-stuttgart-2026",
      "name": "Festival de Cuba Stuttgart",
      "city": "Stuttgart",
      "country": "Germany",
      "continent": "Europe",
      "dates": "October 22-26, 2026",
      "price": "-",
      "website": "https://www.festival-de-cuba.de",
      "instagram": "@festivaldecuba.stuttgart",
      "description": "Five-day Cuban salsa festival in Stuttgart organized by Gutmann Events.",
      "artists": [
        "Wilmer & Maria",
        "Osmaní Segura",
        "Yoyo Flow",
        "Rafael & Katja",
        "Eneris Mulgado"
      ],
      "coordinates": [
        48.7758,
        9.1829
      ],
      "venue": "Sängerhalle Untertürkheim",
      "category": "Festival",
      "months": [
        "October"
      ]
    },
    {
      "id": "oslo-cuban-salsa-festival-2026",
      "name": "Oslo Cuban Salsa Festival",
      "city": "Oslo",
      "country": "Norway",
      "continent": "Europe",
      "dates": "October 23-26, 2026",
      "price": "-",
      "website": "",
      "instagram": "@oslo.cuban.salsa",
      "description": "Pure Cuban salsa weekend in the Norwegian capital.",
      "artists": [
        "-"
      ],
      "coordinates": [
        59.9139,
        10.7522
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "October"
      ]
    },
    {
      "id": "fic-orange-2026",
      "name": "FIC - Festival International Cubano",
      "city": "Orange",
      "country": "France",
      "continent": "Europe",
      "dates": "October 23-26, 2026",
      "price": "-",
      "website": "",
      "instagram": "@fic_cubano",
      "description": "International Cuban festival in Provence.",
      "artists": [
        "-"
      ],
      "coordinates": [
        44.1389,
        4.8081
      ],
      "venue": "Alphonse Daudet",
      "category": "Festival",
      "months": [
        "October"
      ]
    },
    {
      "id": "cuban-bratislava-weekend-2026",
      "name": "Cuban Bratislava Weekend",
      "city": "Bratislava",
      "country": "Slovakia",
      "continent": "Europe",
      "dates": "October 24-25, 2026",
      "price": "-",
      "website": "",
      "instagram": "@cuban_bratislava",
      "description": "Two-day Cuban salsa weekend in Bratislava.",
      "artists": [
        "-"
      ],
      "coordinates": [
        48.1486,
        17.1077
      ],
      "venue": "-",
      "category": "Weekender",
      "months": [
        "October"
      ]
    },
    {
      "id": "australian-rueda-championship-sydney-2026",
      "name": "Australian Rueda Championship & Cuban Dance Festival",
      "city": "Sydney",
      "country": "Australia",
      "continent": "Oceania",
      "dates": "October 2026 (TBC)",
      "price": "-",
      "website": "",
      "instagram": "@ruedachampionship",
      "description": "Australia's premier Cuban dance festival and rueda de casino championship.",
      "artists": [
        "-"
      ],
      "coordinates": [
        -33.8688,
        151.2093
      ],
      "venue": "Marrickville",
      "category": "Festival",
      "months": [
        "October"
      ]
    },
    {
      "id": "son-nama-zaragoza-2026",
      "name": "Son na'ma Festival",
      "city": "Zaragoza",
      "country": "Spain",
      "continent": "Europe",
      "dates": "Late October 2026 (TBC)",
      "price": "-",
      "website": "",
      "instagram": "@sonnama_festival",
      "description": "Son and Cuban dance festival in Aragón. Verify 2026 dates.",
      "artists": [
        "-"
      ],
      "coordinates": [
        41.6488,
        -0.8891
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "October"
      ]
    },
    {
      "id": "dcuba-international-congress-2026",
      "name": "D'Cuba International Congress",
      "city": "Santa Susanna",
      "country": "Spain",
      "continent": "Europe",
      "dates": "October 30 - November 1, 2026",
      "price": "€150 / €330 with hotel",
      "website": "https://www.dcubacongress.com",
      "instagram": "@dcubacongress",
      "description": "Cuban congress on the Costa Brava. Hotel Don Ángel privatized for the event - 100% Cuban vibe. Direct from Cuba lineup.",
      "artists": [
        "Maykel Fonts",
        "Yusimi Moya",
        "Alberto Valdés",
        "Yoyo Flow & Yenifer Lavín",
        "Seo Fernández & Eneris",
        "Yeni Molinet",
        "Yoannis Tamayo",
        "Danger & Marielkis",
        "Mercedes Sayut",
        "Royma Román",
        "Bárbara Jiménez",
        "Yorgenis Danger",
        "Emilio Herrera",
        "Julio Molina",
        "DJ Javier La Rosa",
        "DJ Leo de Cuba",
        "DJ Rumbero",
        "DJ Chanchan",
        "DJ Pelotero",
        "DJ Yván"
      ],
      "coordinates": [
        41.6358,
        2.7106
      ],
      "venue": "Hotel Don Ángel",
      "category": "Congress",
      "months": [
        "October",
        "November"
      ]
    },
    {
      "id": "timba-cerra-santa-susanna-2026",
      "name": "Timba Cerrá Festival",
      "city": "Santa Susanna",
      "country": "Spain",
      "continent": "Europe",
      "dates": "TBC 2026",
      "price": "-",
      "website": "",
      "instagram": "@timba.cerra",
      "description": "Intensive Cuban salsa, timba and Afro-Cuban festival near Barcelona - 4 days, full-immersion, accommodation/meal packages.",
      "artists": [
        "-"
      ],
      "coordinates": [
        41.6358,
        2.7106
      ],
      "venue": "Hotel Don Angel",
      "category": "Festival",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "havana-en-belgrado-2026",
      "name": "Havana en Belgrado",
      "city": "Belgrade",
      "country": "Serbia",
      "continent": "Europe",
      "dates": "November 5-8, 2026",
      "price": "-",
      "website": "",
      "instagram": "@havana_en_belgrado",
      "description": "Cuban festival in Belgrade - timba, afro, rumba, son, salsa, reggaeton with live percussion and concerts.",
      "artists": [
        "-"
      ],
      "coordinates": [
        44.7866,
        20.4489
      ],
      "venue": "-",
      "category": "Congress",
      "months": [
        "November"
      ]
    },
    {
      "id": "cubajena-jena-2026",
      "name": "CubaJena - Festival de Salsa Cubana",
      "city": "Jena",
      "country": "Germany",
      "continent": "Europe",
      "dates": "November 6-8, 2026",
      "price": "-",
      "website": "https://www.cubajena.de",
      "instagram": "@cubajena.festival",
      "description": "Themed blocks on Casino, Son, Rueda de Casino and Rueda de Son. Workshops build progressively, focus on technique, leading/following, musicality. Organized by Jenaer Tanzhaus e.V.",
      "artists": [
        "Izabella & Mahmoud Morsi (El Faraon)",
        "DJ El Faraon (Mahmoud)",
        "DJ Heiko"
      ],
      "coordinates": [
        50.9272,
        11.586
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "November"
      ]
    },
    {
      "id": "el-sol-festival-warsaw-2026",
      "name": "el Sol Festival",
      "city": "Warsaw",
      "country": "Poland",
      "continent": "Europe",
      "dates": "November 11-15, 2026 (Fall Edition)",
      "price": "-",
      "website": "https://elsolfestival.pl",
      "instagram": "@elsolfestival",
      "description": "Fall Edition. Mixed-style salsa festival - 100+ hours of workshops in 3 dance styles. Strong Cuban presence with Maykel Fonts and Marco Ferrigno bootcamp.",
      "artists": [
        "Maykel Fonts",
        "Marco Ferrigno"
      ],
      "coordinates": [
        52.2297,
        21.0122
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "November"
      ]
    },
    {
      "id": "gusto-cubano-tapolca-2026",
      "name": "Gusto Cubano Salsa & Bachata Weekend",
      "city": "Tapolca",
      "country": "Hungary",
      "continent": "Europe",
      "dates": "Early November 2026",
      "price": "-",
      "website": "",
      "instagram": "@gusto_cubano",
      "description": "Cuban salsa, timba, son, cha-cha, rueda, bachata, cubaton, orishas, afro-rumba - four-day festival in northwest Hungary.",
      "artists": [
        "-"
      ],
      "coordinates": [
        46.8806,
        17.4406
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "November"
      ]
    },
    {
      "id": "la-klave-dortmund-2026",
      "name": "La Klave Festival",
      "city": "Dortmund",
      "country": "Germany",
      "continent": "Europe",
      "dates": "November 11-13, 2026",
      "price": "-",
      "website": "",
      "instagram": "@laklave.festival",
      "description": "Cuban salsa festival in the Ruhr.",
      "artists": [
        "-"
      ],
      "coordinates": [
        51.5136,
        7.4653
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "November"
      ]
    },
    {
      "id": "a-toda-cuba-calenzano-2026",
      "name": "A Toda Cuba Festival",
      "city": "Calenzano",
      "country": "Italy",
      "continent": "Europe",
      "dates": "Mid-November 2026",
      "price": "-",
      "website": "",
      "instagram": "@atodacuba.festival",
      "description": "Three-day Cuban festival in Tuscany - salsa, son cubano, rumba, timba and Cuban folklore. Organized with Woodstock Latino.",
      "artists": [
        "-"
      ],
      "coordinates": [
        43.8576,
        11.1797
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "November"
      ]
    },
    {
      "id": "la-descarga-augsburg-2026",
      "name": "La Descarga",
      "city": "Augsburg",
      "country": "Germany",
      "continent": "Europe",
      "dates": "November 27-29, 2026",
      "price": "-",
      "website": "",
      "instagram": "@ladescarga_augsburg",
      "description": "Cuban salsa weekend in Bavaria.",
      "artists": [
        "-"
      ],
      "coordinates": [
        48.3705,
        10.8978
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "November"
      ]
    },
    {
      "id": "festival-salsa-cubana-munich-2026",
      "name": "Festival Salsa Cubana Munich",
      "city": "Munich",
      "country": "Germany",
      "continent": "Europe",
      "dates": "TBC late 2026",
      "price": "-",
      "website": "https://www.festival-salsa-cubana.de",
      "instagram": "@festival.salsa.cubana.munich",
      "description": "Long-running Munich winter festival at CIRCULO. 70 workshops in 5 rooms - Cuban salsa, son, rumba, rueda de casino, afro, reggaeton, with Drums Secret live percussion ensemble.",
      "artists": [
        "Drums Secret"
      ],
      "coordinates": [
        48.1351,
        11.582
      ],
      "venue": "CIRCULO, Rosenheimerstrasse 139",
      "category": "Festival",
      "yearsActive": "since 2015",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "merseyside-latin-festival-liverpool-2026",
      "name": "Merseyside Latin Festival",
      "city": "Liverpool",
      "country": "United Kingdom",
      "continent": "Europe",
      "dates": "December 4-7, 2026",
      "price": "-",
      "website": "",
      "instagram": "@merseyside_latin_festival",
      "description": "Salsa, Rueda, Bachata, Kizomba (SRBK) festival with dedicated Cuban room.",
      "artists": [
        "-"
      ],
      "coordinates": [
        53.4084,
        -2.9916
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "December"
      ]
    },
    {
      "id": "nicasino-kristiansand-2027",
      "name": "Nicasino Dance Festival",
      "city": "Kristiansand",
      "country": "Norway",
      "continent": "Europe",
      "dates": "January 22-24, 2027",
      "price": "-",
      "website": "",
      "instagram": "@nicasino.dance",
      "description": "Cuban casino-focused festival in southern Norway.",
      "artists": [
        "-"
      ],
      "coordinates": [
        58.1599,
        8.0182
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "January"
      ]
    },
    {
      "id": "bailan2-puro-cubano-drammen-2027",
      "name": "Bailan2 Puro Cubano Festival",
      "city": "Drammen",
      "country": "Norway",
      "continent": "Europe",
      "dates": "February 26-28, 2027",
      "price": "-",
      "website": "",
      "instagram": "@bailan2_purocubano",
      "description": "Pure Cuban festival in Drammen.",
      "artists": [
        "-"
      ],
      "coordinates": [
        59.744,
        10.2045
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "February"
      ]
    },
    {
      "id": "mas-que-cubano-bilbao-2027",
      "name": "Más que cubano Festival",
      "city": "Bilbao",
      "country": "Spain",
      "continent": "Europe",
      "dates": "February 26-28, 2027",
      "price": "-",
      "website": "",
      "instagram": "@masquecubano.festival",
      "description": "Pure Cuban salsa festival in the Basque Country.",
      "artists": [
        "-"
      ],
      "coordinates": [
        43.263,
        -2.935
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "February"
      ]
    },
    {
      "id": "me-salsa-fest-birmingham-2027",
      "name": "Me Salsa Fest",
      "city": "Birmingham",
      "country": "United Kingdom",
      "continent": "Europe",
      "dates": "March 12-15, 2027",
      "price": "-",
      "website": "",
      "instagram": "@mesalsafest",
      "description": "Cuban salsa festival in the West Midlands featuring international artists.",
      "artists": [
        "Fredyclan",
        "Yusimi Moya Rodriguez"
      ],
      "coordinates": [
        52.4862,
        -1.8904
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "March"
      ]
    },
    {
      "id": "saoco-cuban-festival-aix-2027",
      "name": "Saoco Cuban Festival",
      "city": "Aix-en-Provence",
      "country": "France",
      "continent": "Europe",
      "dates": "March 19-21, 2027",
      "price": "-",
      "website": "https://www.rockcaliente.fr",
      "instagram": "@saoco_cuban_festival",
      "description": "4th edition of the Saoco Cuban Festival.",
      "artists": [
        "-"
      ],
      "coordinates": [
        43.5297,
        5.4474
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "March"
      ]
    },
    {
      "id": "arrasando-bremen-2027",
      "name": "Arrasando Cuban Afro-Salsa Festival",
      "city": "Bremen",
      "country": "Germany",
      "continent": "Europe",
      "dates": "March 12-14, 2027",
      "price": "-",
      "website": "",
      "instagram": "@arrasando_bremen",
      "description": "Cuban and Afro-Cuban salsa weekend.",
      "artists": [
        "-"
      ],
      "coordinates": [
        53.0793,
        8.8017
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "March"
      ]
    },
    {
      "id": "asi-se-goza-nyc-2026",
      "name": "Así Se Goza!",
      "city": "New York City",
      "country": "USA",
      "continent": "North America",
      "dates": "February 21-22, 2026",
      "price": "-",
      "website": "",
      "instagram": "@asisegoza_nyc",
      "description": "Cuban casino-focused weekender in NYC.",
      "artists": [
        "-"
      ],
      "coordinates": [
        40.7128,
        -74.006
      ],
      "venue": "-",
      "category": "Weekender",
      "months": [
        "February"
      ]
    },
    {
      "id": "marche-kizomba-castelfidardo-2026",
      "name": "Marche Kizomba Festival",
      "city": "Castelfidardo",
      "country": "Italy",
      "continent": "Europe",
      "dates": "Mid-March 2026",
      "price": "-",
      "website": "",
      "instagram": "@marche_kizomba_festival",
      "description": "Three-day Afro-Latin dance congress (Kizomba, Semba, Tarraxxa, Kuduro, Afrohouse) in the Marche region. Cuban room available.",
      "artists": [
        "-"
      ],
      "coordinates": [
        43.4634,
        13.5524
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "March"
      ]
    },
    {
      "id": "caribbean-dance-festival-santa-susanna-2026",
      "name": "Caribbean Dance Festival",
      "city": "Santa Susanna",
      "country": "Spain",
      "continent": "Europe",
      "dates": "May 7-9, 2026",
      "price": "-",
      "website": "",
      "instagram": "@caribbeandancefestival",
      "description": "Caribbean dance festival on the Costa Brava with Cuban room.",
      "artists": [
        "-"
      ],
      "coordinates": [
        41.6358,
        2.7106
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "May"
      ]
    },
    {
      "id": "festival-cubano-chicago-2026",
      "name": "Festival Cubano Chicago",
      "city": "Chicago",
      "country": "USA",
      "continent": "North America",
      "dates": "August 7-9, 2026 (TBC)",
      "price": "-",
      "website": "",
      "instagram": "@festivalcubano.chicago",
      "description": "Three-day outdoor Cuban festival celebrating Cuban music, food, and culture in Chicago's Riis Park.",
      "artists": [
        "-"
      ],
      "coordinates": [
        41.8781,
        -87.6298
      ],
      "venue": "Riis Park",
      "category": "Festival",
      "months": [
        "August"
      ]
    },
    {
      "id": "cuba-alaaf-cologne-2026",
      "name": "Cuba Alaaf - The Cuban Salsa Festival Cologne",
      "city": "Cologne",
      "country": "Germany",
      "continent": "Europe",
      "dates": "September 18-20, 2026",
      "price": "-",
      "website": "https://www.tickettailor.com/events/azuca",
      "instagram": "@cubaalaaf",
      "description": "4th edition (CUBA ALAAF 4.0). Cologne's first 100% Cuban Salsa Festival. Sold out repeatedly. Workshops at Sporthochschule Köln. Run by Azuca Cologne (@azucacologne). Passion project.",
      "artists": [
        "-"
      ],
      "coordinates": [
        50.9375,
        6.9603
      ],
      "venue": "Sporthochschule Köln",
      "category": "Festival",
      "yearsActive": "since 2023",
      "months": [
        "September"
      ]
    },
    {
      "id": "rose-city-salsa-timba-portland-2026",
      "name": "Rose City Salsa & Timba Festival",
      "city": "Portland",
      "country": "USA",
      "continent": "North America",
      "dates": "TBC 2026",
      "price": "-",
      "website": "",
      "instagram": "@rosecity_salsa_timba",
      "description": "Pacific Northwest Cuban salsa and timba festival.",
      "artists": [
        "-"
      ],
      "coordinates": [
        45.5152,
        -122.6784
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "casineros-timba-fest-atlanta-2026",
      "name": "Casineros Timba Fest",
      "city": "Atlanta",
      "country": "USA",
      "continent": "North America",
      "dates": "TBC 2026",
      "price": "-",
      "website": "",
      "instagram": "@casineros.atl",
      "description": "Atlanta's pure Cuban casino and timba festival.",
      "artists": [
        "-"
      ],
      "coordinates": [
        33.749,
        -84.388
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "atlanta-afrocuban-dance-congress-2026",
      "name": "Atlanta AfroCuban Dance Congress",
      "city": "Atlanta",
      "country": "USA",
      "continent": "North America",
      "dates": "TBC 2026",
      "price": "-",
      "website": "",
      "instagram": "@atlanta_afrocuban_congress",
      "description": "Afro-Cuban folkloric dance congress in Atlanta - rumba, orisha, son.",
      "artists": [
        "-"
      ],
      "coordinates": [
        33.749,
        -84.388
      ],
      "venue": "-",
      "category": "Congress",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "havana-to-melbourne-cuban-festival-2026",
      "name": "Havana to Melbourne Cuban Festival",
      "city": "Melbourne",
      "country": "Australia",
      "continent": "Oceania",
      "dates": "TBC 2026",
      "price": "-",
      "website": "",
      "instagram": "@havanatomelbourne",
      "description": "Australia's flagship Cuban dance festival in Melbourne.",
      "artists": [
        "-"
      ],
      "coordinates": [
        -37.8136,
        144.9631
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "sydney-cuban-salsa-congress-2026",
      "name": "Sydney Cuban Salsa Congress",
      "city": "Sydney",
      "country": "Australia",
      "continent": "Oceania",
      "dates": "TBC 2026",
      "price": "-",
      "website": "",
      "instagram": "@sydneycubansalsacongress",
      "description": "Sydney's dedicated Cuban salsa congress.",
      "artists": [
        "-"
      ],
      "coordinates": [
        -33.8688,
        151.2093
      ],
      "venue": "-",
      "category": "Congress",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "aotearoa-cuban-festival-nz-2026",
      "name": "Aotearoa Cuban Festival",
      "city": "Auckland",
      "country": "New Zealand",
      "continent": "Oceania",
      "dates": "TBC 2026",
      "price": "-",
      "website": "",
      "instagram": "@aotearoa_cuban_festival",
      "description": "New Zealand's premier Cuban dance festival.",
      "artists": [
        "-"
      ],
      "coordinates": [
        -36.8509,
        174.7645
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "bologna-salsa-festival-2026",
      "name": "Bologna Salsa Festival",
      "city": "Bologna",
      "country": "Italy",
      "continent": "Europe",
      "dates": "TBC 2026",
      "price": "-",
      "website": "",
      "instagram": "@bolognasalsafestival",
      "description": "Long-running Bologna salsa festival with Cuban room.",
      "artists": [
        "-"
      ],
      "coordinates": [
        44.4949,
        11.3426
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "firenze-mambo-congress-2026",
      "name": "Firenze Mambo Congress",
      "city": "Florence",
      "country": "Italy",
      "continent": "Europe",
      "dates": "TBC 2026",
      "price": "-",
      "website": "",
      "instagram": "@firenzemambocongress",
      "description": "Florence's mambo and salsa congress, with Cuban room.",
      "artists": [
        "-"
      ],
      "coordinates": [
        43.7696,
        11.2558
      ],
      "venue": "-",
      "category": "Congress",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "salsafestival-chemnitz-2026",
      "name": "Salsafestival Chemnitz",
      "city": "Chemnitz",
      "country": "Germany",
      "continent": "Europe",
      "dates": "TBC 2026",
      "price": "-",
      "website": "",
      "instagram": "@salsafestival.chemnitz",
      "description": "Saxony's salsa festival with Cuban room.",
      "artists": [
        "-"
      ],
      "coordinates": [
        50.8278,
        12.9214
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "festivalito-leipzig-2026",
      "name": "Festivalito Leipzig",
      "city": "Leipzig",
      "country": "Germany",
      "continent": "Europe",
      "dates": "TBC 2026",
      "price": "-",
      "website": "",
      "instagram": "@festivalito_leipzig",
      "description": "Intimate Cuban-style festival in Leipzig.",
      "artists": [
        "-"
      ],
      "coordinates": [
        51.3397,
        12.3731
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "dusseldorf-international-salsa-2026",
      "name": "Düsseldorf International Salsa Festival",
      "city": "Düsseldorf",
      "country": "Germany",
      "continent": "Europe",
      "dates": "TBC 2026",
      "price": "-",
      "website": "",
      "instagram": "@duesseldorf_salsa_festival",
      "description": "Düsseldorf's international salsa festival.",
      "artists": [
        "-"
      ],
      "coordinates": [
        51.2277,
        6.7735
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "me-gusta-cuba-festival-2026",
      "name": "Me Gusta Cuba Festival",
      "city": "Germany",
      "country": "Germany",
      "continent": "Europe",
      "dates": "TBC 2026",
      "price": "-",
      "website": "https://www.megustacubafestival.de",
      "instagram": "@megustacubafestival",
      "description": "German Cuban festival featuring Yoyo Flow and other Cuban artists.",
      "artists": [
        "Yoyo Flow"
      ],
      "coordinates": [
        51.1657,
        10.4515
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "hola-cuba-festival-france-2026",
      "name": "Hola Cuba Festival",
      "city": "France",
      "country": "France",
      "continent": "Europe",
      "dates": "TBC 2026",
      "price": "-",
      "website": "http://www.holacubafestival.fr",
      "instagram": "@holacubafestival.fr",
      "description": "French Cuban festival featuring DJ Jack El Calvo.",
      "artists": [
        "DJ Jack El Calvo"
      ],
      "coordinates": [
        46.6034,
        1.8883
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "francia-cuba-festival-paris-2026",
      "name": "Francia Cuba Festival",
      "city": "Paris",
      "country": "France",
      "continent": "Europe",
      "dates": "TBC 2026",
      "price": "-",
      "website": "",
      "instagram": "@franciacubafestival",
      "description": "Paris-based Cuban festival, organized with DJ Phil Gomis.",
      "artists": [
        "DJ Phil Gomis"
      ],
      "coordinates": [
        48.8566,
        2.3522
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "salsa-festival-carnaval-limoges-2026",
      "name": "Salsa Festival Carnaval",
      "city": "Limoges",
      "country": "France",
      "continent": "Europe",
      "dates": "TBC March 2026",
      "price": "-",
      "website": "https://www.endanse.com",
      "instagram": "@salsafestivalcarnaval",
      "description": "Annual carnaval-themed Cuban salsa festival in Limoges with DJ Jack El Calvo.",
      "artists": [
        "DJ Jack El Calvo"
      ],
      "coordinates": [
        45.8336,
        1.2611
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "March"
      ]
    },
    {
      "id": "salsa-bachata-temptation-asia-bangkok-2026",
      "name": "Salsa Bachata Temptation Asia (SBTA)",
      "city": "Bangkok",
      "country": "Thailand",
      "continent": "Asia",
      "dates": "September 11-13, 2026",
      "price": "-",
      "website": "https://salsabachatatemptation.com",
      "instagram": "@salsabachatatemptation",
      "description": "Asia's biggest salsa-bachata festival. 3 dance rooms including Cuban & Dominican (Timba, Son, Cha Cha Cha). 100+ international performers. Live concerts.",
      "artists": [
        "Adolfo Indacochea",
        "Tania Cannarsa",
        "Latin Soul Dancers",
        "Bersy Cortez",
        "Wilmer y Maria",
        "Yoyo Flow",
        "Panagiotis & Myrto",
        "Angelo y Romina",
        "Diego Rivera & Yaritza Arboleda",
        "Dimitris & Yolena",
        "Jacopo y Linda",
        "Samuel Funflow",
        "Mari Yogo",
        "Eloy J Rojas",
        "Alena Studenok",
        "Berry & Naya",
        "Piao Piao",
        "Beko & Mong",
        "Nwelati",
        "Sahiba",
        "Kalpana",
        "Pinky",
        "Alonso & Ieva",
        "Sandy Phan",
        "A Qiang",
        "Klui & Dalla",
        "Francesco Scalvenzi",
        "Arun",
        "Josh & Muse",
        "Dhwani",
        "Oscar & Anna",
        "Saren",
        "Vero Yuan",
        "JaneJane",
        "Diego y Sofi",
        "Tuna",
        "Tiny",
        "Matangi",
        "Sebas Garreta (LIVE)",
        "Mario Rainero (LIVE)"
      ],
      "coordinates": [
        13.7563,
        100.5018
      ],
      "venue": "Avani Sukhumvit",
      "category": "Festival",
      "months": [
        "September"
      ]
    },
    {
      "id": "ksaba-asia-salsa-bachata-congress-2026",
      "name": "Asia Salsa Bachata Congress",
      "city": "Asia (TBC)",
      "country": "Asia (TBC)",
      "continent": "Asia",
      "dates": "TBC 2026",
      "price": "-",
      "website": "",
      "instagram": "@asia_salsa_bachata_congress",
      "description": "Pan-Asian salsa & bachata congress with Cuban content.",
      "artists": [
        "-"
      ],
      "coordinates": [
        1.3521,
        103.8198
      ],
      "venue": "-",
      "category": "Congress",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "moscow-cuban-festival-2026",
      "name": "Moscow Cuban Festival (TBC)",
      "city": "Moscow",
      "country": "Russia",
      "continent": "Europe",
      "dates": "TBC 2026",
      "price": "-",
      "website": "",
      "instagram": "@dianarodriguez_official",
      "description": "Moscow Cuban scene led by Diana Rodriguez. Workshops and socials throughout the year. Verify dates locally.",
      "artists": [
        "Diana Rodriguez"
      ],
      "coordinates": [
        55.7558,
        37.6173
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "festival-la-speciale-renens-2026",
      "name": "Festival La Spéciale 3 - Salsamas 10 Years",
      "city": "Renens",
      "country": "Switzerland",
      "continent": "Europe",
      "dates": "September 25-27, 2026",
      "price": "-",
      "website": "",
      "instagram": "@salsamas_renens",
      "description": "Salsamas school 10th anniversary celebration. Salle des spectacles in Renens, near Lausanne.",
      "artists": [
        "-"
      ],
      "coordinates": [
        46.5359,
        6.5783
      ],
      "venue": "Salle des spectacles, Renens",
      "category": "Festival",
      "yearsActive": "since 2024",
      "months": [
        "September"
      ]
    },
    {
      "id": "stockholm-bachata-cuban-marathon-2026",
      "name": "Stockholm Salsa Marathon (Cuban Edition)",
      "city": "Stockholm",
      "country": "Sweden",
      "continent": "Europe",
      "dates": "TBC 2026",
      "price": "-",
      "website": "",
      "instagram": "@stockholm_salsamarathon",
      "description": "Multi-day salsa marathon with Cuban room.",
      "artists": [
        "-"
      ],
      "coordinates": [
        59.3293,
        18.0686
      ],
      "venue": "-",
      "category": "Marathon",
      "months": [
        "TBC"
      ]
    },
    {
      "id": "hot-salsa-weekend-stockholm-2026",
      "name": "Hot Salsa Weekend",
      "city": "Stockholm",
      "country": "Sweden",
      "continent": "Europe",
      "dates": "Early November 2026",
      "price": "-",
      "website": "",
      "instagram": "@hotsalsaweekend",
      "description": "Three-day SBK festival - Salsa LA, On2, Cuban, Bachata, Kizomba with international instructors.",
      "artists": [
        "-"
      ],
      "coordinates": [
        59.3293,
        18.0686
      ],
      "venue": "-",
      "category": "Weekender",
      "months": [
        "November"
      ]
    },
    {
      "id": "cuba-mi-salsa-cyprus-2026",
      "name": "CubaMiSalsa Festival Cyprus",
      "city": "Nicosia",
      "country": "Cyprus",
      "continent": "Europe",
      "dates": "TBC 2026",
      "price": "-",
      "website": "",
      "instagram": "@cubamisalsa.cy",
      "description": "Cyprus's dedicated Cuban dance festival.",
      "artists": [
        "-"
      ],
      "coordinates": [
        35.1856,
        33.3823
      ],
      "venue": "-",
      "category": "Festival",
      "months": [
        "TBC"
      ]
    }
];

export default festivals;
