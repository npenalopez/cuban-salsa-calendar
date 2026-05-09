export interface Festival {
  id: string;
  name: string;
  city: string;
  country: string;
  continent: string;
  dates: string;
  price: string;
  months?: string[];
  website?: string;
  instagram?: string;
  description?: string;
  artists?: string[];
  coordinates?: [number, number];
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

export const festivals: Festival[] = [
  {
    "id": "yab-festival-mantes-2026",
    "name": "YAB Festival",
    "city": "Mantes-la-Jolie",
    "country": "France",
    "continent": "Europe",
    "dates": "January 9-12, 2026",
    "price": "149 €",
    "website": "https://www.yabfestival.com",
    "instagram": "https://www.instagram.com/yab_festival/",
    "description": "4th edition. 3 parties, 30 workshops, 2 LIVE concerts. Salsa, Timba, Son, Rueda, Reggaeton, Afro Rumba, Afrobeat. Hall 5 Parc des Expositions, 30min from Paris. 700+ people, 15 international teachers. Tumbakin live concert Saturday. Organized by Association Cubagana.",
    "artists": [
      "Alberto Valdes",
      "Diana Rodriguez",
      "Danger Rodriguez",
      "Marielkis Hernandez",
      "Yusimi Moya Rodriguez",
      "Chiky Rodriguez",
      "Laura Del Vecchio",
      "Katerina Mik",
      "Alain Rueda",
      "Osmell Relampago",
      "Royma Roman Rodriguez",
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
      48.9891971,
      1.7140683
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
    "country": "United States",
    "continent": "North America",
    "dates": "January 9-11, 2026",
    "price": "$295 plus tax and fees",
    "website": "https://www.renolatindancefest.com",
    "instagram": "https://www.instagram.com/renolatindancefest",
    "description": "Mixed-style Latin dance festival with a Cuban salsa room.",
    "artists": [
      "Jorge Luis Fernandez",
      "Indira Mora Cueto"
    ],
    "coordinates": [
      39.5261788,
      -119.812658
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
    "continent": "Europe",
    "dates": "January 16-18, 2026",
    "price": "TBA",
    "website": "",
    "instagram": "https://www.instagram.com/tumbaofestival",
    "description": "Cuban salsa festival in Dubai (per rueda.casino listing). Dates Jan 16-18, 2026. User to verify Instagram/website directly.",
    "artists": [
      "Yanet Fuentes",
      "Osmani Segura",
      "Nikola Medic",
      "Paolo Suarez",
      "Danger Rodriguez",
      "Marielkis Hernandez",
      "Nicolo Laricchia",
      "Alice Fraddosio",
      "Lazaro D'Cuba",
      "DJ Timbalero",
      "DJ Andrea Androger",
      "Leo Charanga",
      "Jennyselt Galata",
      "DJ Tom Nka"
    ],
    "coordinates": [
      25.0742823,
      55.1885387
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
    "dates": "January 15-17, 2027",
    "price": "120,00 €",
    "website": "https://bailaconamigos.com",
    "instagram": "https://www.instagram.com/cuba_me_mucho/",
    "description": "7th edition. Salsa, Timba, Cubaton y mucho mas",
    "artists": [
      "Wilmer Najarro",
      "Maria de la Vega",
      "Ismaray Chacon",
      "Roly Maden",
      "Yosniel Brunet",
      "Cuban Flex",
      "Osbanis Tejeda",
      "Anneta Kepka",
      "Melissa Jova",
      "Lorenys Rodriguez",
      "Carlos Manolo"
    ],
    "coordinates": [
      47.4739884,
      -0.5515588
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
    "dates": "January 22-24, 2027",
    "price": "€95 - €125",
    "website": "https://www.latin-festival-wuerzburg.de",
    "instagram": "https://www.instagram.com/latinfestivalwuerzburg",
    "description": "Organized by Bailamos Würzburg. 3 days of workshops, parties, shows. Dance floors for salsa/mambo/cha-cha/son and bachata. Friday: pre-party workshops + Welcome Party. Saturday: workshops + Gala Night. Sunday: workshops + Goodbye Party.",
    "artists": [],
    "coordinates": [
      49.7780356,
      9.9434769
    ],
    "venue": "ADTV Tanzschule Hartung, Würzburg",
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
    "price": "25,00€ – 240,00€",
    "website": "https://tickets.baila-augsburg.de/event/son-weekend-2026/",
    "instagram": "https://www.instagram.com/paraelalmadivertir",
    "description": "Cuban Son Weekend by baila Augsburg. Whisks dancers to 1920s Cuba with two days/nights of Son dance, music. Includes Beginner Bootcamp and Show Bootcamp. Beginner Level + Open Level workshops. Organized by Ariel & Sofia (¡baila! social dance studio).",
    "artists": [
      "Silvio Leroy",
      "Luis Duarte",
      "Cristian Mauricio",
      "Mariluz Fuentes",
      "CyGy",
      "Sofia de Endaya",
      "Ariel López",
      "Lexi Krewinkel",
      "Helen Haukamp",
      "Yago",
      "DJ Pastaguero",
      "DJ Luis",
      "Dj Endaya"
    ],
    "coordinates": [
      48.3690341,
      10.8979522
    ],
    "venue": "Hep Cat Club, Viktoriastraße 1 1/3, 86150 Augsburg",
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
    "price": "129,00 €",
    "website": "https://my.weezevent.com/quien-manda-festival-2026",
    "instagram": "https://www.instagram.com/quien_manda_festival",
    "description": "4th edition - 'Mezclando Culturas'. Cuban Salsa + Dominican Bachata + new Puerto Rican Salsa room. 100% women + 100% men workshops, bootcamps, before parties.",
    "artists": [
      "Diana Rodriguez",
      "Yusimi Moya Rodriguez",
      "Yenifer Lavin",
      "Zaine Rosabal",
      "Eneris Mulgado",
      "Giusy Chisari",
      "Marielkis Hernandez",
      "Dida",
      "Gulnara Bekirova",
      "Anneslyne Baila",
      "Mel Tremenda",
      "Yoyo Flow",
      "Adonis Santiago",
      "Danger Rodriguez",
      "Pedrito Cuba",
      "FredyClan Garcia II",
      "Yosniel Brunet",
      "Andres Timbamania",
      "DJ Assane",
      "DJ Pastaguero",
      "DJ Tom Nka",
      "DJ Ralph De Cavo",
      "DJ Diablito"
    ],
    "coordinates": [
      43.2924385,
      5.5703031
    ],
    "venue": "Centre des Congrès Agora",
    "category": "Festival",
    "yearsActive": "since 2024",
    "months": [
      "January"
    ]
  },
  {
    "id": "unidanza-hamburg-2026",
    "name": "Unidanza",
    "city": "Hamburg",
    "country": "Germany",
    "continent": "Europe",
    "dates": "February 6-8, 2026",
    "price": "149€ - 189€",
    "website": "https://unidanza.de",
    "instagram": "https://www.instagram.com/unidanza.hamburg",
    "description": "The Afro Cuban Dance Festival in Hamburg. 100+ workshops, 40 Cuban Salsa and Afro/Rumba artists, 3 parties, shows. Tagline: #undz26. Confirmed names from social media: FredyClan Garcia II, Nathanaël Mergui. Full lineup announcement on Instagram @unidanza.hamburg.",
    "artists": [
      "DJ Luis",
      "Dj Endaya",
      "DJ Timbalero",
      "DJ Rafi",
      "Dj Punto",
      "DJ Tom Nka",
      "Michel Ramirez",
      "Karloryn Aloma",
      "Armandito Font",
      "Alain Zambrana",
      "Angela Rodriguez",
      "Kenny Hermiaga",
      "Cristian Mauricio",
      "Yorgenis Danger 'Yoyo'",
      "Ariel López",
      "Lara Bulka",
      "Andy Varona",
      "Yuliet Estrada",
      "Luis Duarte",
      "Sofia de Endaya",
      "FredyClan Garcia II",
      "Milica Valjarevic",
      "Oliwia Szewczak",
      "Mijail Bueno",
      "Osmell Relampago"
    ],
    "coordinates": [
      53.5501721,
      10.0013165
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
    "dates": "February 4-7, 2027",
    "price": "79.00€",
    "website": "https://www.damefestival.es",
    "instagram": "https://www.instagram.com/damefestival",
    "description": "Pure Cuban salsa, timba, son, rumba and guaguancó. 'El mejor festival de Valencia'. Bootcamp directed by Diana Rodriguez. Family atmosphere.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      39.4697065,
      -0.3763353
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
    "price": "1700.00€ - 2850.00€",
    "website": "https://alocubano.se",
    "instagram": "https://www.instagram.com/alocubanodanceescape/",
    "description": "AloCubano Havana - 'Dance Tour' edition. Established by Julio Espinal from Santiago de Cuba. The source - Cuban culture where it was born. Workshops, socials, real vibe with top Cuban dance maestros from the AloCubano family. February-March 2026. Premium Cuban festival - cuban, salsa, afro, reggaeton, rueda, reparto, son.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      23.135305,
      -82.3589631
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
    "dates": "February 26- March 1, 2027",
    "price": "€121.00 - €141.00",
    "website": "https://www.arrebatatefestival.com",
    "instagram": "https://www.instagram.com/arrebatate",
    "description": "9th edition. Craziest Cuban festival in the heart of Europe. ",
    "artists": [
      "Diana Rodriguez",
      "Alex Toledo",
      "Pedrito Cuba",
      "Giusy Chisari",
      "Royma Roman Rodriguez",
      "Melina",
      "Andreas"
    ],
    "coordinates": [
      47.4978789,
      19.0402383
    ],
    "venue": "Lurdy Ház, UniCredit Bank, Könyves Kálmán körút 12, Budapest 1097",
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
    "price": "TBA",
    "website": "https://www.solwayscuba.com",
    "instagram": "https://www.instagram.com/festivaldelasalsaencuba/",
    "description": "10th anniversary edition. Concerts by Cuba's top orchestras, salsa/rumba/timba workshops, performances, pool parties. Hotel Memorias Miramar.",
    "artists": [
      "Maykel Blanco y su Salsa Mayor",
      "Alexander Abreu y Havana D'Primera",
      "Pupy y Los Que Son Son",
      "Adalberto Alvarez y Su Son",
      "Elito Reve y Su Charangon",
      "Manolito Simonet y Su Trabuco",
      "Alain Perez",
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
      23.135305,
      -82.3589631
    ],
    "venue": "Hotel Memories Miramar / Club 500",
    "category": "Festival",
    "yearsActive": "since 2017",
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
    "dates": "March 6-8, 2026",
    "price": "€115-€135",
    "website": "",
    "instagram": "",
    "description": "Timba Mastery Festival in Cologne, Germany. Workshops with top Cuban artists. Verify Instagram/website with @cubansalsacalendar.",
    "artists": [
      "Alberto Valdes",
      "Alain Zambrana",
      "Sava",
      "Elio",
      "Enrique",
      "Jeney"
    ],
    "coordinates": [
      50.938361,
      6.959974
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
    "price": "TBA",
    "website": "https://tickets.baila-augsburg.de",
    "instagram": "@baila.augsburg",
    "description": "Women's Weekend 6.0 - Cuban Style Meeting on International Women's Day. 2 days, 6 hours of classes with Alex Toledo & Sofia de Endaya, 1 Women's Talk, 1 Party. Previous editions sold out fast.",
    "artists": [
      "Alex Toledo",
      "Sofia de Endaya"
    ],
    "coordinates": [
      48.3705,
      10.8978
    ],
    "venue": "Baila Social Dance Studio, Halderstraße 29, 86150 Augsburg",
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
    "price": "TBA",
    "website": "",
    "instagram": "@arrasando.festival",
    "description": "Cuban Afro-Salsa Festival in Bremen, Germany. Listed in rueda.casino for March 2026. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "€50 (3-Party Pass) / €15 (Single Party)",
    "website": "https://www.billetweb.fr/saoco-cuban-festival-2026",
    "instagram": "@saoco.cuban.festival",
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
    "price": "TBA",
    "website": "",
    "instagram": "@femfestival",
    "description": "Cuban dance festival in L'Hermitage, France. Listed in rueda.casino March 20-22, 2026. Instagram/website not directly findable - user to verify with @cubansalsacalendar.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "https://cubailaviena.at/en/events/meneate-viena-2026/",
    "instagram": "@meneateviena",
    "description": "4th edition. International Afro-Cuban dance festival in Vienna. Timba, salsa, son, casino, rumba, afro, reggaeton. Live concert by Maykel Blanco y su Salsa Mayor (not in fullpass). Workshops at wolke19, Welcome Party with DJ Wasia, Timba Gala with DJ La Pantera, Farewell Party at Fanialive. Son Bootcamp with Alexei & Emilia.",
    "artists": [
      "Maykel Blanco y su Salsa Mayor",
      "Alexei",
      "Emilia",
      "DJ Wasia",
      "DJ La Pantera"
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
      "Yoyo Flow",
      "Yusimi Moya Rodriguez",
      "Jorge Luis Fernandez",
      "Indira Mora Cueto",
      "Cuban Flex",
      "Luis Duarte",
      "Andy Varona",
      "Yuliet Estrada",
      "Hector Oviedo Abreu",
      "Danger Rodriguez",
      "Marielkis Hernandez",
      "Oliwia Szewczak",
      "Royma Roman Rodriguez",
      "Mahmoud Morsi",
      "Orisun Company",
      "Louise",
      "Marvin",
      "Ido",
      "Agnita",
      "Alexander Scull",
      "DJ Andrea Androger",
      "DJ Yala El Puma",
      "DJ El Faraon",
      "DJ Tamboly",
      "Maykel Blanco y su Salsa Mayor"
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
    "price": "TBA",
    "website": "https://www.cubayonne.fr",
    "instagram": "@festival.cubayonne",
    "description": "Festival of Cuban music and dances in Bayonne, France. Organized by Association Cubayonne and Salsa Timbayonne. Workshops with international instructors, evening with concert + DJ, after-timba session.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      43.4929,
      -1.4748
    ],
    "venue": "Maison des Associations de Bayonne, 11 Allée de Glain, 64100 Bayonne",
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
    "price": "TBA",
    "website": "",
    "instagram": "@pura_cuba_brussels",
    "description": "Brussels-based organization that promotes Cuban salsa among dancers. Pura Cuba event at Evere on March 28, 2026.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "https://afrocubandancefestival.com",
    "instagram": "@afrocubandancefestival",
    "description": "International Afro-Cuban Dance Festival in Havana. Most all-inclusive, immersive Afro-Cuban experience - 50 hours of intensive training with Live Music. Classes use the energy of Conjunto Folklórico Nacional de Cuba. Run by Luanda Pau and Maestro Domingo Pau, who select the team based on dedication to Afro-Cuban culture and professional experience. Artists hail from Havana's prestigious institutions.",
    "artists": [
      "Luanda Pau",
      "Maestro Domingo Pau",
      "Conjunto Folklorico Nacional de Cuba",
      "Academia de Danza Carlos Acosta",
      "Cabaret Tropicana de Cuba",
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@bailabailasalsa",
    "description": "Baila Baila Salsa Festival in Helsinki, Finland. Listed in rueda.casino April 2-5, 2026. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "From €273 (Weekend) / €480 (Early Bird Full)",
    "website": "https://www.dancefestivalincuba.com",
    "instagram": "@ritmocuba",
    "description": "8th edition. International Cuban dance festival in Havana - 100+ hours of workshops with 60+ teachers across 3 rooms, plus nightly parties at Casa de la Música. Hotel Nacional de Cuba.",
    "artists": [
      "Maykel Fonts",
      "Jorge Luis Fernandez",
      "Indira Mora Cueto",
      "Diana Rodriguez",
      "Adonis Santiago",
      "Silvia",
      "Silvio Leroy",
      "Jorge Luna",
      "Karelia Despaigne",
      "Mariesly Paradelo",
      "Los Datway",
      "Yoerlis Brunet",
      "Yoanis Pelaez",
      "Oddebi",
      "Adrian Pozo",
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
    "price": "TBA",
    "website": "https://www.nordicsalsa.com",
    "instagram": "@nordicsalsaexperience",
    "description": "16th edition (2026). Knut Erik Productions in cooperation with Salsakompaniet present this 4-day SBK + salsa mix event in Oslo. Norwegian Championship in salsa, Stargate show team competition, Jack & Jill social dance competition. Held at Sentralen.",
    "artists": [
      "TBD"
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
    "dates": "April 17-19, 2026",
    "price": "TBA",
    "website": "",
    "instagram": "@mananaljubljana",
    "description": "9th edition. Cuban dance festival in Ljubljana. Unique 'one instructor couple per day' approach for deep learning - dancers don't choose workshops, each day is dedicated to ONE INSTRUCTOR COUPLE. Helps dancers learn dance style and attitude deeply for quick improvement. Organized by @cubanaljubljana. Dates April 17-19, 2026.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "https://ruedalibre.co.uk",
    "instagram": "@ruedalibre",
    "description": "3rd edition. Workshops | Parties | Live Music | Rumba Abierta | Casino Boot Camp | Rueda Olympics. 19+ world-class artists + DJs. 3 full days of workshops with live music across all levels. Casino Boot Camp by Ramses and Sandra. 2 epic parties at Saw Swee Hock Student Centre, central London. Friendly, inclusive community by Rueda Libre. Quality Cuban dance with great artists in welcoming and safe space.",
    "artists": [
      "Ramses",
      "Sandra",
      "19+ world-class Cuban artists + DJs"
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
    "price": "TBA",
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
    "price": "TBA",
    "website": "",
    "instagram": "@festivalculturacubana",
    "description": "Festival Cultura Cubana FCC in Montesilvano. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@corazon_y_mezcla",
    "description": "Corazón y Mezcla Festival in Barcelona. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
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
    "price": "TBA",
    "website": "",
    "instagram": "@cubasonweekender",
    "description": "Cuban dance weekender in Vancouver. Listed in rueda.casino April 17-19, 2026. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "name": "Timbalemania",
    "city": "Augsburg",
    "country": "Germany",
    "continent": "Europe",
    "dates": "April 23-26, 2026",
    "price": "€240–€370",
    "website": "https://tickets.baila-augsburg.de/event/timbalemania-2026/",
    "instagram": "@baila.augsburg",
    "description": "Timbalemania 2026 - 'Family dance weekend' by baila Augsburg. 3 days of workshops with balanced leader/follower ratio. 4 crazy parties with passionate DJs. Community activities, city tours, 3 shared dinners. Tagline: 'Esto te pone la cabeza mala'.",
    "artists": [
      "Yuliet Estrada",
      "Oliwia Szewczak",
      "Yusimi Moya Rodriguez",
      "Helen Haukamp",
      "Sofia de Endaya",
      "Andy Varona",
      "Silvio Leroy",
      "Luis Duarte",
      "Sassan Alivaliollahi",
      "Ariel López",
      "DJ Jack El Calvo",
      "DJ Yala El Puma",
      "DJ Tom Nka"
    ],
    "coordinates": [
      48.3705,
      10.8978
    ],
    "venue": "Hep Cat Club, Viktoriastraße 1 1/3, 86150 Augsburg",
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
    "price": "TBA",
    "website": "",
    "instagram": "@diadelson",
    "description": "Día del Son 5 - 5th edition Son festival in Szeged, Hungary. Listed in rueda.casino April 30 - May 3, 2026. User to verify Instagram/website.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      46.253,
      20.1414
    ],
    "venue": "-",
    "category": "Festival",
    "yearsActive": "since 2022",
    "months": [
      "April"
    ]
  },
  {
    "id": "boston-cuban-dance-festival-2026",
    "name": "Boston Cuban Dance Festival",
    "city": "Boston",
    "country": "USA",
    "continent": "North America",
    "dates": "May 1-3, 2026",
    "price": "TBA",
    "website": "",
    "instagram": "@bostoncubandance",
    "description": "2026 Boston Cuban Dance Festival - May 1-3, 2026 at Lesley University - Washburn Hall, Cambridge, MA. Cuban dance workshops, social dancing, performances. Verified Instagram @bostoncubandance.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      42.3601,
      -71.0589
    ],
    "venue": "Lesley University - Washburn Hall, Cambridge, MA",
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
    "price": "TBA",
    "website": "",
    "instagram": "@salsaontour",
    "description": "Salsa On Tour Italy in Florence. May 6-9, 2026. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "dates": "May 7-10, 2026",
    "price": "TBA",
    "website": "https://cubanero.net",
    "instagram": "@cubanerosalsa",
    "description": "19th edition. The biggest Salsa Festival in Serbia. International Festival of Cuban Music and Dance. 40+ workshops in 4 different locations (Allegro Dance, Centre, Studio M, Cafe Havana, Svetozar Markovic Gymnasium, Katolicka Porta Square, Ernesto Cafe), 4 evening parties, 4 open-air hotspot parties, live concert. Cuban Salsa x Afro x Bachata x Kizomba x Reggaeton. 2025 proxy lineup shown - 2026 announcements via @cubanerosalsa Instagram.",
    "artists": [
      "Mixael Cabrera y su Team Barcelona",
      "Diana Rodriguez",
      "Yusimi Moya Rodriguez",
      "Yeni Molinet",
      "Osmani Segura",
      "Yoannis Tamayo",
      "FredyClan Garcia II",
      "Danger Rodriguez",
      "Marielkis Hernandez",
      "Anitaa Jimenez",
      "Nemanja Lazovic",
      "Ivan",
      "Ivana",
      "Jan Bervar",
      "DJ Leo de Cuba",
      "DJ Assane",
      "DJ El Gato Volador",
      "DJ Timbalero",
      "DJ Don Marko",
      "DJ Indio"
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
    "dates": "May 8-10, 2026",
    "price": "TBA",
    "website": "https://www.salsaonthebeach.at",
    "instagram": "-",
    "description": "21st edition. All-inclusive dance holiday at the 4-star superior beachfront Bibione Palace Hotel on the Adriatic coast. Workshops in salsa, bachata, rueda de casino, evening show nights, pool-terrace chill-out parties. Friday Meet & Greet, Saturday show night, Sunday morning workshops + poolside chill-out. Note: Facebook /salsaonthebeach.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      45.6396,
      13.0497
    ],
    "venue": "Bibione Palace Hotel, Via Taigete 20, 30020 Bibione VE, Italy",
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
    "price": "TBA",
    "website": "",
    "instagram": "@saborcubano.cph",
    "description": "Sabor Cubano - Copenhagen Cuban Dance Festival. May 8-10, 2026. Affiliated with Salsa Libre Copenhagen (salsalibre.dk).",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      55.6761,
      12.5683
    ],
    "venue": "Kedelhallen, Nyelandsvej 75A, Frederiksberg",
    "category": "Festival",
    "months": [
      "May"
    ]
  },
  {
    "id": "salazar-rueda-zurich-2026",
    "name": "Salazar Rueda Festival",
    "city": "Winterthur",
    "country": "Switzerland",
    "continent": "Europe",
    "dates": "May 8-10, 2026",
    "price": "CHF 130+",
    "website": "https://salazarruedafestival.com",
    "instagram": "@salazar.ruedafestival",
    "description": "3rd International Rueda Festival in Switzerland. 100% Rueda de Casino. 26 workshops with 15 international top artists, 2 themed parties + Gala-Party Saturday (dresscode elegant), bootcamp, contest. Run at Sabor Latino dance venue. Founded by @reynaldo_salazar_.",
    "artists": [
      "15 international top Rueda de Casino artists"
    ],
    "coordinates": [
      47.5022,
      8.7372
    ],
    "venue": "Sabor Latino, Werkstrasse 16, 8400 Winterthur",
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
    "price": "TBA",
    "website": "",
    "instagram": "-",
    "description": "6th International Salsa Championship for Dancers in Ravenna, Italy. May 7-9, 2026. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "dates": "May 14-17, 2026",
    "price": "TBA",
    "website": "https://godancefestival.com/event/tenerife-dance-festival-2026/",
    "instagram": "@tenerife_dance_festival",
    "description": "Holiday Experience Festival. 50+ artists, 50+ hours of workshops (BACHATA, SALSA and special). Pool parties, outdoor workshops, social dances, night party till 6am, boat party with whale/dolphin viewing, day tour, dance competition. 4-star hotel. Music policy: 6-8 bachatas per 2 salsas. Note: predominantly bachata festival with some salsa rooms. Cuban salsa room artists listed. Organized by Leandro y Jomante.",
    "artists": [
      "Alex Toledo",
      "Nicolo Do Angelo",
      "Nico Silva",
      "Marco Lorusso",
      "Cristo",
      "Emma",
      "Mahmoud Derouiche",
      "Jose Cuellar",
      "Adan",
      "Cristina",
      "DJ Dia",
      "DJ Vireack",
      "DJ Leo",
      "DJ Polo",
      "DJ Toxica",
      "DJ Carlos Guillen"
    ],
    "coordinates": [
      28.4636,
      -16.2518
    ],
    "venue": "Hotel Puerto Palace, C/ Doctor Cobiella Zaera 2, 38400 Puerto de la Cruz",
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
    "price": "TBA",
    "website": "http://salsaweekend.dk",
    "instagram": "@bailasiempre",
    "description": "BailaSiempre Salsa Weekend at Baila Siempre Dance Studio, Kometvej 4, 8700 Horsens. Workshops, pre-party, shows, parties with national/international instructors and DJs. Organizers: Tenna Qvist and Erodys Castillo.",
    "artists": [
      "Tenna Qvist",
      "Erodys Castillo",
      "TBD"
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
    "price": "€110 (Full Pass)",
    "website": "https://eveniahotels.com/events/guaguanco",
    "instagram": "@guaguancofestival",
    "description": "Largest international Cuban music and culture festival in Europe. 70th anniversary celebration of Orquesta Revé. Live performances, traditional son groups, folk shows. Attendees from 46+ countries.",
    "artists": [
      "Orquesta Reve",
      "Yoyo Flow",
      "Yusimi Moya Rodriguez",
      "Hector Oviedo Abreu",
      "Julio Manguero",
      "Ismaray Chacon",
      "Diana Rodriguez",
      "Yeni Molinet",
      "Yenifer Lavin",
      "Jorge Camagüey",
      "Mari",
      "Jorge Luis Fernandez"
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
    "dates": "June 19-22, 2026",
    "price": "TBA",
    "website": "https://www.bailanewyork.com",
    "instagram": "@bailanydancefest_",
    "description": "Baila NY Afro-Caribbean Dance Fest. 3rd edition. NYC's first dance festival rooted in tradition. 80+ hours of parallel workshops + bootcamps in 4 rooms: Cuban, Mambo/Salsa, Bachata, Konpa/Kizomba. Live concerts and 4 social rooms. Organized by JukanBaila. Cuban lineup announcements ongoing - check @bailanydancefest_ Instagram.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      40.7128,
      -74.006
    ],
    "venue": "-",
    "category": "Festival",
    "months": [
      "June"
    ]
  },
  {
    "id": "mi-solar-kalogria-2026",
    "name": "Mi Solar Salsa Festival",
    "city": "Kalogria",
    "country": "Greece",
    "continent": "Europe",
    "dates": "May 21-28, 2026",
    "price": "TBA",
    "website": "https://misolarfestival.com",
    "instagram": "@misolarfestival",
    "description": "Eight-day Cuban salsa beach week on the western Peloponnese coast. Master bootcamp with Yusimi Moya for Afro-Cuban roots. World-class instructors and family-friendly atmosphere.",
    "artists": [
      "Yusimi Moya Rodriguez",
      "Royma Roman Rodriguez",
      "Izabella",
      "Mahmoud Morsi"
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
    "price": "TBA",
    "website": "https://www.timbatumbaeventi.it",
    "instagram": "@timbatumba_eventi",
    "description": "One of Italy's biggest Latin dance congresses - salsa cubana, bachatango, son, rueda de casino, afro, rumba. Beachside venue with pool and full-board package.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "https://www.billetweb.fr/montpel-rueda-festival-2026",
    "instagram": "@montpelruedafestival",
    "description": "5th edition. Organized by Rueda Social Club. 27 hours of workshops in Rueda de Casino, salsa, Cuban dances. 3 dance halls, rueda challenge, giant rueda downtown, 100% salsa cubana parties, beach party.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      43.6108,
      3.8767
    ],
    "venue": "Gymnase Joffre, 333 Rue d'Argencourt, 34000 Montpellier",
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
    "price": "TBA",
    "website": "",
    "instagram": "@cubaintunisia",
    "description": "Cuba in Tunisia festival in Monastir. Listed in rueda.casino May 28 - June 4, 2026. User to verify Instagram/website.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      35.778,
      10.8262
    ],
    "venue": "-",
    "category": "Festival",
    "months": [
      "May"
    ]
  },
  {
    "id": "croatian-summer-salsa-rovinj-2026",
    "name": "Croatian Summer Salsa Festival",
    "city": "Rovinj",
    "country": "Croatia",
    "continent": "Europe",
    "dates": "June 8-15, 2026",
    "price": "From €560 (Full Pass)",
    "website": "https://www.crosalsafestival.com",
    "instagram": "@crosalsafestival",
    "description": "20+ year running mixed-style Adriatic salsa festival with strong Cuban room. Featured Cuban artists.",
    "artists": [
      "Maykel Fonts",
      "Yoyo Flow",
      "Jorge Luis Fernandez",
      "Indira Mora Cueto",
      "Diana Rodriguez",
      "Yusimi Moya Rodriguez",
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
    "price": "TBA",
    "website": "https://www.damecuba.com/festival-frankfurt/",
    "instagram": "@damecubafestival",
    "description": "DameCuba Salsa and Afro Cuban Festival Frankfurt. 36 hours of workshops in 3 rooms (Open/Intermediate/Advanced). 3-hr Bootcamp (Open Level). Each evening: Motto-Party with show acts, animations, live percussion. 4 Top DJs. Snacks and cocktails.",
    "artists": [
      "Yailen Serrano",
      "Laine Quesada",
      "Leydis Teodoro",
      "Tenna Qvist",
      "Stefanie Fontaine",
      "Yohan Corrioso",
      "Yorgenis Danger 'Yoyo'",
      "Juan Carlos Gonzalez",
      "Erodys Castillo",
      "Yorge Armando Gonzalez",
      "Juan Bauste",
      "Marcos Antonio Betancourt",
      "Michel Vizcaino",
      "DJ Leo de Cuba",
      "DJ Francesco",
      "DJ Kubaton",
      "DJ Danielito"
    ],
    "coordinates": [
      50.1109,
      8.6821
    ],
    "venue": "Tanzschule Conexión, Am Industriehof 7, 60487 Frankfurt am Main",
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
    "price": "TBA",
    "website": "",
    "instagram": "@happysalsa",
    "description": "Happy Salsa Festival in Kühlungsborn, Germany. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "https://www.facebook.com/cubososijek",
    "instagram": "@cubososijek",
    "description": "CubOs - Cuban dance and gastronomic event combining Cuban music/dance tradition with Slavonian hospitality. June 19-21, 2026 in Osijek, Croatia.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "https://www.cuban-convention.de",
    "instagram": "@cubanconvention_koblenz",
    "description": "Das Kubanische Salsa Festival in Koblenz. Limited spots (max 60 per workshop). 100% Cuban parties incl. Tumbakin LIVE concert (Friday). Saturday on Salsa Boat with 2 levels. Timba, Salsa Cubana, Son, Reggaeton. Organized by CHANGA.",
    "artists": [
      "Yorgenis Danger 'Yoyo'",
      "Luis Duarte",
      "Ariel Diaz",
      "Yusimi Moya Rodriguez",
      "Sassan Ito",
      "Helen Haukamp",
      "Ariel López",
      "Sofia de Endaya",
      "Oliwia Szewczak",
      "Tumbakin",
      "DJ Rafi",
      "DJ Yala El Puma",
      "DJ TiMueve",
      "DJ Paulazo",
      "DJ Luis",
      "DJ Salvo Leone",
      "DJ Salomon"
    ],
    "coordinates": [
      50.3569,
      7.589
    ],
    "venue": "Viktoriastr. 28, 56068 Koblenz, Germany / Kongresshalle Vallendar (Friday) / SalsaBoot (Saturday)",
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
    "price": "TBA",
    "website": "https://www.allsalsafestival.com",
    "instagram": "@allsalsafestival",
    "description": "All Salsa Festival - Cuban, Mambo, Caleña fusion. 2 Before days (June 24-25) + 3 Full Days/Nights (June 26-28). 60+ workshops (Classic & Master Classes).",
    "artists": [
      "Wilmer Najarro",
      "Maria de la Vega",
      "Bersy Cortez",
      "Seo Fernandez",
      "Tania Cannarsa",
      "Yoyo Flow",
      "Husory",
      "Marco Ferrigno",
      "Alicia Velasco",
      "Fadi Fusion",
      "Yusimi Moya Rodriguez",
      "Miguel Ferrerossa",
      "Adonis Santiago",
      "Yuri Colucci",
      "Royma Roman Rodriguez",
      "Talal",
      "Juan Racines",
      "Laurence Salsalianza",
      "Jeremy Martinez",
      "Atocha",
      "Felipe",
      "Simona",
      "Gulnara Bekirova",
      "Francy Barahona",
      "Chantal",
      "Evans Ramos Martinez",
      "Lenuam Pimienta"
    ],
    "coordinates": [
      45.767,
      5.0026
    ],
    "venue": "20 Av. du Dr Schweitzer, 69330 Meyzieu",
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
    "price": "TBA",
    "website": "https://www.facebook.com/unabullaottawa",
    "instagram": "@unabullaottawa",
    "description": "4th edition of UNA BULLA: Cuban Salsa Extravaganza. 3-day dance festival in Ottawa featuring workshops, performances, and social dancing. Focus on Cuban Salsa, Casino Rueda, Afro-Cuban dance. Organized by Ottawa Casino Rueda.",
    "artists": [
      "TBD"
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
    "price": "TBA",
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
    "price": "TBA",
    "website": "https://wannadance.com",
    "instagram": "@festival.cubano2",
    "description": "5th edition. Mountain restaurant venue (Le Yeti, accessible via télécabine). Salsa cubana focus near Geneva.",
    "artists": [
      "DJ Jack El Calvo",
      "DJ Tom Nka",
      "DJ Ralph De Cavo",
      "DJ Yala El Puma",
      "DJ Lilimba",
      "DJ La Tremenda",
      "DJ Timbalero",
      "DJ Diablito",
      "DJ Chechyto",
      "Chantal",
      "Harold Kinanga",
      "Ayoub",
      "Coya",
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
    "price": "TBA",
    "website": "",
    "instagram": "@soy100cuba",
    "description": "Soy 100% Cuba Festival - Cubania y Mañana. France-based touring event. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@nordicsalsacamp",
    "description": "Nordic Salsa Camp at Jelling, Denmark. Listed in rueda.casino July 5-11, 2026. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@cubafrica",
    "description": "CubAfrica Salsa Festival in Horgues, France. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@cubancamp",
    "description": "Cuban Camp at Bosei, Denmark. Listed in rueda.casino July 19-25, 2026. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "$265 (Full) / $235 (Local) / $135 (Weekend Party)",
    "website": "https://www.miamisalsacongress.com",
    "instagram": "@miamisalsacongress",
    "description": "Multi-style salsa congress with Cuban room and live Cuban music.",
    "artists": [
      "TBD"
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
    "price": "€150 (4-day Pass) / €130 (3-day Pass)",
    "website": "https://tempolatino.com",
    "instagram": "@tempolatino",
    "description": "31st edition - 'Kaleidoscopic 2026'. Largest European Afro-Cuban Latin Music Festival since 1994. 4 days, 500 volunteers. At the Arènes Joseph-Fourniol.",
    "artists": [
      "Maite Hontele",
      "Orquesta Akokan",
      "Alfredo Rodriguez",
      "Tony Succar",
      "Yilian Canizares",
      "La Yegros"
    ],
    "coordinates": [
      43.7561,
      0.3056
    ],
    "venue": "Arènes Joseph Fourniol",
    "category": "Festival",
    "months": [
      "July"
    ]
  },
  {
    "id": "bachata-cuban-weekend-stockholm-2026",
    "name": "Bachata and Cuban Weekend",
    "city": "Stockholm",
    "country": "Sweden",
    "continent": "Europe",
    "dates": "July 31 - August 2, 2026",
    "price": "TBA",
    "website": "",
    "instagram": "@bachatacubanweekend",
    "description": "Bachata and Cuban Weekend in Stockholm. Listed in rueda.casino July 31 - August 2, 2026. User to verify Instagram/website.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      59.3293,
      18.0686
    ],
    "venue": "-",
    "category": "Weekender",
    "months": [
      "July"
    ]
  },
  {
    "id": "bachaturo-katowice-2026",
    "name": "Bachaturo Poland Festival",
    "city": "Katowice",
    "country": "Poland",
    "continent": "Europe",
    "dates": "August 14-16, 2026",
    "price": "TBA",
    "website": "https://bachaturo.com",
    "instagram": "@bachaturo",
    "description": "16th edition. One of the largest SBKZ festivals in Europe. 90+ international artists, 120+ hours of workshops, minimum 10 workshop rooms. 5 dance floors for evening parties – Bachata, Salsa, Cubana, Kizomba, UrbanKiz. Held at MCK – Katowice International Conference Centre + Spodek Arena. Pre-party August 13 (bachata only). Top Cuban room artists - check bachaturo.com/artists for confirmed Cuban-specific artists.",
    "artists": [
      "Ataca",
      "Alemana",
      "Marco",
      "Sara",
      "Daniel Sanchez",
      "Ronald",
      "Alba",
      "Cornel",
      "Rithika",
      "Pablo",
      "Raquel",
      "Gero",
      "Migle",
      "Antoni",
      "Belen",
      "Alex",
      "Desiree",
      "Carolina Rosa"
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
    "price": "TBA",
    "website": "https://www.salsa-bit.com/festivals-2026/salsa-festival-prague-2026",
    "instagram": "@salsafestivalcr",
    "description": "Official national salsa event of the Czech Republic at Hotel Olympik Congress. Founded by Hanser Estenoz. Salsa cubana, salsa on2, bachata, son, Afro-Cuban dances.",
    "artists": [
      "Wilmer Najarro",
      "Maria de la Vega",
      "Adonis Santiago",
      "Charlie",
      "Vero",
      "Hanser",
      "Vilma",
      "Jose Mari",
      "Patri",
      "Jesus Javier",
      "Yanedis",
      "Daniel Sanchez",
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
    "price": "TBA",
    "website": "",
    "instagram": "@timbaparadise",
    "description": "Festival Timba Paradise in Saarbrücken. Listed in rueda.casino August 27-31, 2026. Organized by Cubaila Salsa Tanzschule & Events.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@salsastras",
    "description": "Salsa Stras Festival - 20 Years anniversary edition. User to verify Instagram/website.",
    "artists": [
      "Osbanis Tejeda",
      "Anneta Kepka",
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
    "price": "TBA",
    "website": "",
    "instagram": "@corazonlatino",
    "description": "Festival Corazon Latino in Cenon (Bordeaux area). User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "https://www.calledetimberos.pl",
    "instagram": "@calledetimberos",
    "description": "Calle de Timberos - 100% Cuban Festival in Wrocław, Poland. The biggest 100% Cuban festival in Poland. Annual September event. Workshops, parties, live concerts, bootcamps. Verified Facebook /calledetimberos.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@obdacbali",
    "description": "OBDAC Cuban Salsa Fiesta in Bali, Indonesia. Listed in rueda.casino September 24-27, 2026. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@aguafestival",
    "description": "Agua Festival in Thessaloniki, Greece. Listed in rueda.casino September 25-27, 2026. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@holacubamalmo",
    "description": "Hola Cuba - Salsa & Afro-Cuban Festival in Malmö, Sweden. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "name": "AloCubano Salsa Festival Krakow",
    "city": "Krakow",
    "country": "Poland",
    "continent": "Europe",
    "dates": "October 2-5, 2026",
    "price": "TBA",
    "website": "https://alocubano.se/warsaw/lineup",
    "instagram": "@alocubano",
    "description": "AloCubano Krakow - 'The Cuban Festival in the Royal Heart of Europe'. 700+ dancers from 30+ countries, 28+ workshops in 3 powerful days. All-in-one venue at Hotel Galaxy. Parties until 4 AM Friday-Sunday. No live music breaks - non-stop dancing energy. All Cuban styles: Salsa Cubana, Rumba, Afro, Timba, Reparto. Day parties + Night parties. Top Cuban DJs.",
    "artists": [
      "Yoyo Flow",
      "Maykel Fonts",
      "Barbara Jimenez",
      "Yoannis Tamayo",
      "Adonis Santiago",
      "Seo Fernandez",
      "FredyClan Garcia II",
      "Mercedes Sayut",
      "Pedrito Cuba",
      "Giusy Chisari",
      "Ola",
      "Piotrek",
      "DJ Flecha",
      "DJ Maquina de Cuba",
      "DJ El Honguito"
    ],
    "coordinates": [
      50.0647,
      19.945
    ],
    "venue": "Hotel Galaxy, Kraków, Poland",
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
    "price": "TBA",
    "website": "https://www.billetweb.fr/cubanflow-festival",
    "instagram": "@cubanflowfestival",
    "description": "3rd edition. Cuban Flow Festival in Anglet, France. Imagined and created by Alain Rueda and Katerina Mik. Cuban dance festival to connect with Cuban music and dance, with masterclasses and energy-filled workshops adapted to all levels. Sunday includes live music classes (piano, congas, timbales, brass). 2025 lineup shown as proxy - 2026 announcements via @cubanflowfestival.",
    "artists": [
      "Alain Rueda",
      "Katerina Mik",
      "Mixael Cabrera y su Team Barcelona",
      "Lorenys Rodriguez",
      "Carlos Manolo",
      "Florine",
      "Yacin",
      "Kevin Cano",
      "Geysa Martinez",
      "Neilys Marrero",
      "Michel Vizcaino",
      "Yordanis Aguero Delgado",
      "Hector Oviedo Abreu",
      "Di Da",
      "DJ Leo Abreu",
      "DJ Harold",
      "DJ Jack El Calvo"
    ],
    "coordinates": [
      43.4845,
      -1.518
    ],
    "venue": "70 bis Av. d'Espagne, 64600 Anglet, France",
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
    "price": "TBA",
    "website": "",
    "instagram": "@dancecongresshamburg",
    "description": "Dance Congress Hamburg 2026 - October 9-11. World-class workshops, breathtaking international shows, spectacular parties. Run by Festival de Cuba Hamburg organizers.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "https://www.damecuba.com",
    "instagram": "@damecubafestival",
    "description": "Dame Cuba Festival Tenerife. Same organizer as Dame Cuba Frankfurt. October 9-11, 2026.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@ruedaglobetrotters",
    "description": "Festival Rueda GlobeTrotters VOL.8 in Toulouse, France. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "https://crazy4latimba.com",
    "instagram": "@crazy4latimba",
    "description": "5th year - cornerstone of the global Timba community. 35+ Cuban dance workshops, live percussion, beach kick-off, Tumbakin concert. Venues at Timeout Market and Jazzy Dance Studios.",
    "artists": [
      "Tumbakin"
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
    "price": "TBA",
    "website": "https://www.festival-de-cuba.de",
    "instagram": "@festivaldecuba_stuttgart",
    "description": "21st International Festival de Cuba Stuttgart. 'Lo Mejor de Cuba' with Cuban dancers from 25+ nations. 3 days of incredible parties, 35+ workshops, 1000+ square meters of workshop space.",
    "artists": [
      "Osbanis Tejeda",
      "Anneta Kepka",
      "Leidel Portuondo",
      "Wilmer Najarro",
      "Maria de la Vega",
      "Osmani Segura",
      "Yoyo Flow",
      "Rafael",
      "Katja",
      "Eneris"
    ],
    "coordinates": [
      48.7758,
      9.1829
    ],
    "venue": "Sängerhalle Untertürkheim, Stuttgart",
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
    "dates": "October 23-25, 2026",
    "price": "TBA",
    "website": "",
    "instagram": "@oslocubansalsafestival",
    "description": "First-ever Cuban Salsa Festival in Oslo. By Oslo Kizomba Festival and Dance With Dancecity. 19:00-03:00 daily. Workshops focus on Orishas, Rueda, authentic Cuban dance and culture. Top DJs. Early bird Full Pass 1000 NOK.",
    "artists": [
      "Adonis Santiago",
      "Ilaria",
      "Ze Braga",
      "Yassell Rodriguez",
      "Damarys Farres",
      "Yersin Rivas",
      "Farah Portela Alonso",
      "Theo"
    ],
    "coordinates": [
      59.9139,
      10.7522
    ],
    "venue": "Sentralen, Øvre Slottsgate 3, 0157 Oslo",
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
    "price": "TBA",
    "website": "https://www.facebook.com/festival.international.cubano.orange",
    "instagram": "@fic_festival_cubano",
    "description": "Festival International Cubano (FIC) - the leading Cuban festival in Europe. Annual since 2014, organized by Yoann Henry, president of Association Passion Timba. 4-day program with 28 nationalities, 3 Cuban bands, dance classes by world's best teachers, multiple Cuban concerts. Espace Daudet venue. Friday: outdoor before-party + Columbia contest + Cuban concert. Saturday: workshops + outdoor before-party + artist shows. Sunday: workshops + Battle DJs + Cuban concert. 2026 special guests Sueño de Cristal and Tania Pantoja announced. Historical proxy from 2024.",
    "artists": [
      "Sueno de Cristal",
      "Tania Pantoja",
      "Maykel Blanco y su Salsa Mayor",
      "Yasser Ramos y Tumbao Mayombe",
      "Ivan y La Llegada (orchestra)",
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@cubanbratislava",
    "description": "Cuban Bratislava Weekend. Listed in rueda.casino October 24-25, 2026 (also May 15-16 per visitbratislava.com - verify dates). User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@australianruedachampionship",
    "description": "Australian Rueda Championship & Cuban Dance Festival in Sydney. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@sonnamafestival",
    "description": "Son Na'ma festival in Zaragoza, Spain. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
      "Yusimi Moya Rodriguez",
      "Alberto Valdes",
      "Yoyo Flow",
      "Yenifer Lavin",
      "Seo Fernandez",
      "Eneris",
      "Yeni Molinet",
      "Yoannis Tamayo",
      "Danger Rodriguez",
      "Marielkis Hernandez",
      "Mercedes Sayut",
      "Royma Roman Rodriguez",
      "Barbara Jimenez",
      "Yorgenis Danger 'Yoyo'",
      "Emilito Herrera",
      "Julio Molina",
      "DJ Javier La Rosa",
      "DJ Leo de Cuba",
      "DJ Rumbero",
      "DJ Chanchan",
      "DJ Pelotero",
      "DJ Yvan"
    ],
    "coordinates": [
      41.6358,
      2.7106
    ],
    "venue": "Hotel Don Ángel",
    "category": "Congress",
    "months": [
      "October"
    ]
  },
  {
    "id": "timba-cerra-santa-susanna-2026",
    "name": "Timba Cerrá Festival",
    "city": "Santa Susanna",
    "country": "Spain",
    "continent": "Europe",
    "dates": "March 20-23, 2026",
    "price": "€60 (Full Pass workshops EB) / €420 (Pack 1 Individual) / €700 (Pack 2 Double)",
    "website": "https://www.goandance.com/en/event/9002/timba-cerra",
    "instagram": "@timba.cerra",
    "description": "Intensive 100% Cuban festival dedicated to timberos. Four days of workshops, parties and full cultural immersion at Hotel Don Angel, Santa Susanna. Focuses on Cuban salsa, timba and Afro-Cuban rhythms with strong emphasis on musicality, body movement and social connection. Daytime structured workshops at multiple levels; nights dedicated to high-energy timba parties with DJs.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      41.6358,
      2.7106
    ],
    "venue": "Hotel Don Angel",
    "category": "Festival",
    "months": [
      "March"
    ]
  },
  {
    "id": "havana-en-belgrado-2026",
    "name": "Havana en Belgrado",
    "city": "Belgrade",
    "country": "Serbia",
    "continent": "Europe",
    "dates": "November 5-8, 2026",
    "price": "TBA",
    "website": "",
    "instagram": "@havanaenbelgrado",
    "description": "Havana en Belgrado festival in Belgrade, Serbia. Listed in rueda.casino November 5-8, 2026. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "https://www.cubajena.de",
    "instagram": "@cubajena.festival",
    "description": "Themed blocks on Casino, Son, Rueda de Casino and Rueda de Son. Workshops build progressively, focus on technique, leading/following, musicality. Organized by Jenaer Tanzhaus e.V.",
    "artists": [
      "Izabella",
      "Mahmoud Morsi",
      "DJ El Faraon",
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
    "price": "TBA",
    "website": "https://elsolfestival.pl",
    "instagram": "@elsolfestivals",
    "description": "el Sol Festival Fall Edition - mixed-style salsa festival - one of the biggest Polish dance brands. 100+ hours of workshops in 3 dance styles. Run by @elsolfestivals brand which also runs Bachata Festival, Warsaw Zouk Festival, etc. Strong Cuban presence.",
    "artists": [
      "Maykel Fonts",
      "Marco Ferrigno",
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@gustocubano",
    "description": "Gusto Cubano Festival in Tapolca, Hungary. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@laklavefestival",
    "description": "La Klave Festival in Dortmund, Germany. Listed in rueda.casino November 11-13, 2026.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@atodacuba",
    "description": "A Toda Cuba Festival in Calenzano, Italy. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "https://tickets.baila-augsburg.de",
    "instagram": "@baila.augsburg",
    "description": "3rd edition of La Descarga - Cuban Meets Dominican Festival. By baila Augsburg. Caribbean energy weekend. Friday: 5pm bootcamp. Workshops + socials. Sunday wraps ~5-6pm. Timba meets Bachata, Son meets Merengue, Bolero, Chachachá, Reggaetón.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      48.3705,
      10.8978
    ],
    "venue": "Hep Cat Club, Viktoriastraße 1 1/3, 86150 Augsburg",
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
    "price": "TBA",
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
    "price": "TBA",
    "website": "",
    "instagram": "@merseysidelatinfestival",
    "description": "Merseyside Latin Festival in Liverpool, UK. SRBK event. December 4-7, 2026. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@nicasino",
    "description": "Nicasino Dance Festival in Kristiansand, Norway. January 22-24, 2027. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@bailan2",
    "description": "5th edition. Bailan2 Puro Cubano Festival at Grønland 60, central Drammen, Norway. Over 20 workshops in salsa, son, rumba, Afro-Cuban dance. Live music in classes, evening parties, social dancing. Organized by Bailan2 Dance Studio.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@masquecubano",
    "description": "Mas que cubano Festival in Bilbao, Spain. Listed in rueda.casino February 26-28, 2027.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@mesalsafest",
    "description": "Me Salsa Fest in Birmingham, England. Listed in rueda.casino March 12-15, 2027.",
    "artists": [
      "FredyClan Garcia II",
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
    "price": "TBA",
    "website": "https://www.rockcaliente.fr",
    "instagram": "@saoco.cuban.festival",
    "description": "Saoco Cuban Festival in Aix-en-Provence, France. Listed in rueda.casino March 19-21, 2027.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@arrasando.festival",
    "description": "Arrasando Cuban Afro-Salsa Festival in Bremen, Germany. Listed in rueda.casino March 12-14, 2027.",
    "artists": [
      "TBD"
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
    "id": "caribbean-dance-festival-santa-susanna-2026",
    "name": "Caribbean Dance Festival",
    "city": "Santa Susanna",
    "country": "Spain",
    "continent": "Europe",
    "dates": "May 7-9, 2026",
    "price": "TBA",
    "website": "",
    "instagram": "@caribbeandancefest",
    "description": "Caribbean Dance Festival at Santa Susanna, Spain. May 7-9, 2026. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@festivalcubano",
    "description": "Festival Cubano in Chicago. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "https://www.tickettailor.com/events/azuca",
    "instagram": "@cubaalaaf",
    "description": "4th edition (CUBA ALAAF 4.0). Cologne's first 100% Cuban Salsa Festival. Sold out repeatedly. Workshops at Sporthochschule Köln. Run by Azuca Cologne (@azucacologne). Passion project.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@rosecitysalsatimba",
    "description": "Rose City Salsa & Timba Festival in Portland, USA. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@casinerostimbafest",
    "description": "Casineros Timba Fest in Atlanta. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@atlantaafrocubandance",
    "description": "Atlanta AfroCuban Dance Congress. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@havanatomelbourne",
    "description": "Havana to Melbourne Cuban Festival. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@sydneycubansalsacongress",
    "description": "Sydney Cuban Salsa Congress. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@aotearoacubanfestival",
    "description": "Aotearoa Cuban Festival NZ. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@bolognasalsafestival",
    "description": "Bologna Salsa Festival. User to verify Instagram/website. May not have annual 2026 edition - verify before publishing.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@firenzemambocongress",
    "description": "Firenze Mambo Congress, Florence. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@salsafestival.chemnitz",
    "description": "Salsafestival Chemnitz. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@festivalito_leipzig",
    "description": "Festivalito Leipzig. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@duesseldorf_salsa_festival",
    "description": "Düsseldorf International Salsa Festival. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "https://www.megustacubafestival.de",
    "instagram": "@megustacubafestival",
    "description": "Me Gusta Cuba Festival, Germany. User to verify exact location and dates.",
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
    "price": "TBA",
    "website": "http://www.holacubafestival.fr",
    "instagram": "@holacubafestival.fr",
    "description": "Hola Cuba Festival, France touring. User to verify exact location.",
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
    "dates": "April 10-12, 2026",
    "price": "TBA",
    "website": "",
    "instagram": "@franciacubafestival",
    "description": "Francia Cuba Festival - 50 Workshops, 3 Nights, 4 Halls. Salsa, Reggaeton, Afro Rumba, Rueda, plus Bachata, Kompa, Kizomba, Semba. 4 rooms 4 atmospheres: Salsa Cuba, Salsa Son & Retro, Tropical Hall, Bachata Kizomba. Organized by Philippe Gomis. Hotel: Séjours & affaires Apparthotel.",
    "artists": [
      "Grupo Olori",
      "Philippe Gomis",
      "Cuba room workshops",
      "TBD"
    ],
    "coordinates": [
      48.8566,
      2.3522
    ],
    "venue": "Station Danse, Vitry-sur-Seine",
    "category": "Festival",
    "months": [
      "April"
    ]
  },
  {
    "id": "salsa-festival-carnaval-limoges-2026",
    "name": "Salsa Festival Carnaval",
    "city": "Limoges",
    "country": "France",
    "continent": "Europe",
    "dates": "March 13-15, 2026",
    "price": "90€ - 150€",
    "website": "https://www.endanse.com",
    "instagram": "https://www.instagram.com/festival_salsa_carnaval_lmg/",
    "description": "Annual carnaval-themed Cuban salsa festival in Limoges with DJ Jack El Calvo.",
    "artists": [
      "Issac Delgado",
      "Laura Del Vecchio",
      "Jonar Gonzalez",
      "Carlos Manolo",
      "Lorenys Rodriguez",
      "Hector Oviedo Abreu",
      "Luis Duarte",
      "DJ Rafi",
      "DJ La Tremenda",
      "DJ El Loco",
      "DJ Timbaleaks"
    ],
    "coordinates": [
      45.8354243,
      1.2644847
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
    "price": "TBA",
    "website": "https://salsabachatatemptation.com",
    "instagram": "@salsabachatatemptation",
    "description": "Asia's biggest salsa-bachata festival. 3 dance rooms including Cuban & Dominican (Timba, Son, Cha Cha Cha). 100+ international performers. Live concerts.",
    "artists": [
      "Adolfo Indacochea",
      "Tania Cannarsa",
      "Latin Soul Dancers",
      "Bersy Cortez",
      "Wilmer Najarro",
      "Maria de la Vega",
      "Yoyo Flow",
      "Panagiotis",
      "Myrto",
      "Angelo",
      "Romina",
      "Diego Rivera",
      "Yaritza Arboleda",
      "Dimitris",
      "Yolena",
      "Jacopo",
      "Linda",
      "Samuel Funflow",
      "Mari Yogo",
      "Eloy J Rojas",
      "Alena Studenok",
      "Berry",
      "Naya",
      "Piao Piao",
      "Beko",
      "Mong",
      "Nwelati",
      "Sahiba",
      "Kalpana",
      "Pinky",
      "Alonso",
      "Ieva",
      "Sandy Phan",
      "A Qiang",
      "Klui",
      "Dalla",
      "Francesco Scalvenzi",
      "Arun",
      "Josh",
      "Muse",
      "Dhwani",
      "Oscar",
      "Anna",
      "Saren",
      "Vero Yuan",
      "JaneJane",
      "Diego",
      "Sofi",
      "Tuna",
      "Tiny",
      "Matangi",
      "Sebas Garreta",
      "Mario Rainero"
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
    "price": "TBA",
    "website": "",
    "instagram": "@asia_salsa_bachata_congress",
    "description": "Asia Salsa Bachata Congress. Touring Asia event. User to verify location and Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@dianarodriguez_official",
    "description": "Moscow Cuban Festival is speculative - Diana Rodriguez is Moscow-based but no dedicated festival is well-documented. Consider removing if not verifiable.",
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
    "price": "TBA",
    "website": "",
    "instagram": "@salsamas_renens",
    "description": "Festival La Speciale in Renens, Switzerland. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@stockholm_salsamarathon",
    "description": "Stockholm Bachata Cuban Marathon. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@hotsalsaweekend",
    "description": "Hot Salsa Weekend Stockholm. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
    "price": "TBA",
    "website": "",
    "instagram": "@cubamisalsa.cy",
    "description": "Cuba Mi Salsa Cyprus. User to verify Instagram/website.",
    "artists": [
      "TBD"
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
  },
  {
    "id": "alocubano-benidorm-2026",
    "name": "AloCubano Salsa Festival Benidorm",
    "city": "Benidorm",
    "country": "Spain",
    "continent": "Europe",
    "dates": "April 9-13, 2026",
    "price": "TBA",
    "website": "https://alocubano.se/benidorm/",
    "instagram": "@alocubano",
    "description": "AloCubano Benidorm 2026 ★ MAYKEL BLANCO LIVE! 'The Cuban Festival in the Miami of Europe'. Set at the legendary Gran Hotel Bali - all-in-one resort experience. 4 unforgettable days of workshops, pool parties, night fiestas. 2 dance floors by night - 1000m² Pure Cuban + 500m² Bachata. 26+ workshops in Cuban styles: Salsa Cubana, Rumba, Afro, Timba, Reparto. Dazzling shows, competitions, animations. Parties until sunrise with DJs from Cuba's finest scene. Established by Julio Espinal from Santiago de Cuba.",
    "artists": [
      "Maykel Blanco y su Salsa Mayor",
      "Yoyo Flow",
      "Reynaldo Salazar",
      "Barbara Jimenez",
      "Pedrito Cuba",
      "Giusy Chisari",
      "Addy Mendoza",
      "Keke El Peluche",
      "Mercedes Sayut",
      "Yoannis Tamayo",
      "Anitaa Jimenez",
      "Yohan Corrioso",
      "Elaine",
      "Neilys Marrero",
      "Cristian Ivorra",
      "Paolo Suarez",
      "Joan Pich",
      "B Dance Team",
      "Luis Duarte",
      "Vanessa",
      "Abel",
      "Helia",
      "Carlita",
      "Moyses",
      "Lucia",
      "DJ Flecha",
      "DJ Maquina de Cuba",
      "DJ Raymon",
      "Rey Ceballo",
      "Eddy Aguero",
      "Adriano Brizuela",
      "Kachi",
      "Rey Silveira"
    ],
    "coordinates": [
      38.5411,
      -0.1226
    ],
    "venue": "Gran Hotel Bali, C. del Actor Luis Prendes 4, Benidorm, Alicante",
    "category": "Festival",
    "yearsActive": "1",
    "months": [
      "April"
    ]
  },
  {
    "id": "cubaneando-cuban-fest-tenerife-2026",
    "name": "Cubaneando Cuban Fest Tenerife",
    "city": "El Médano",
    "country": "Spain",
    "continent": "Europe",
    "dates": "March 20-22, 2026",
    "price": "Early Bird 71.10€ / Full Pass 80.10€",
    "website": "https://www.tomaticket.es/en-es/tickets-cubaneando-cuban-fest-tenerife",
    "instagram": "-",
    "description": "Cuban festival in Tenerife featuring concert and Cuban dance. 3 days from 15:00 onwards. Featuring multiple Cuban artists and DJs.",
    "artists": [
      "Alicia Ruiz",
      "Jorge Camagüey",
      "Cubaneando",
      "Yeni Molinet",
      "Hector Oviedo Abreu",
      "Pedrito Cuba",
      "DJ Arokan"
    ],
    "coordinates": [
      28.0431,
      -16.5358
    ],
    "venue": "El Médano, Tenerife",
    "category": "Festival",
    "months": [
      "March"
    ]
  },
  {
    "id": "odac-singapore-cuban-salsa-fiesta-2026",
    "name": "ODAC Singapore Cuban Salsa Fiesta",
    "city": "Singapore",
    "country": "Singapore",
    "continent": "Asia",
    "dates": "November 27-29, 2026",
    "price": "TBA",
    "website": "https://linktr.ee/odacsingapore",
    "instagram": "@odacsingapore",
    "description": "Annual Cuban Salsa festival by ODAC Singapore (Only Dance Afro-Cuban). Brings renowned artists from Cuban Salsa communities across the globe to Singapore. Cross-border collaboration with Cuban Salsa lovers in the region. Features 20+ hours of Workshops, 3 Parties, 6 hours of Masterclasses, Pre-Party. Past lineups have included Diana Rodriguez, Yeni Molinet, Fredyclan, Yusimi, Osmani Segura, Kevin y Geysa. ODAC also runs Cuban Salsa Fiesta editions in Bali (Sept) and Special Editions in Tokyo. 2026 dates approximate - confirm via @odacsingapore Instagram.",
    "artists": [
      "TBD",
      "Diana Rodriguez",
      "Yeni Molinet",
      "FredyClan Garcia II",
      "Yusimi Moya Rodriguez",
      "Osmani Segura",
      "Kevin Cano",
      "Geysa Martinez",
      "DJ Jack El Calvo",
      "DJ El Gato Volador",
      "DJ Yuma",
      "DJ Camille"
    ],
    "coordinates": [
      1.3521,
      103.8198
    ],
    "venue": "Various venues in Singapore (past: Aliwal Arts Centre, 1880, Pasela Resorts)",
    "category": "Festival",
    "yearsActive": "5",
    "months": [
      "November"
    ]
  },
  {
    "id": "fusafes-fukuoka-salsa-festival-2026",
    "name": "FUSAFES - Fukuoka Salsa Festival",
    "city": "Fukuoka",
    "country": "Japan",
    "continent": "Asia",
    "dates": "TBA 2026",
    "price": "TBA",
    "website": "https://tiempo.jp/fusafes/en/",
    "instagram": "-",
    "description": "Fukuoka Salsa Festival by NPO TIEMPO, pioneer of salsa culture in Fukuoka for 28 years. Philosophy: 'salsa is salsa' - bringing together salsa lovers from across Japan and abroad regardless of style or origin (includes Cuban Salsa). Three days of music, rhythm, international vibes. Dance shows, live music, workshops, Caribbean food & cocktails, world-class Latin DJs spinning at nightly dance parties. Held at TIEMPO HALL (3F Daimyo11511 Bldg., 1-15-11 Daimyo, Chuo-ku, Fukuoka 810-0041) - located in Daimyo, next to Tenjin.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      33.5904,
      130.4017
    ],
    "venue": "TIEMPO HALL, 3F Daimyo11511 Bldg., 1-15-11 Daimyo, Chuo-ku, Fukuoka",
    "category": "Festival",
    "yearsActive": "28",
    "months": [
      "TBA"
    ]
  },
  {
    "id": "cape-town-afro-latin-dance-festival-2026",
    "name": "Cape Town Afro-Latin Dance Festival",
    "city": "Cape Town",
    "country": "South Africa",
    "continent": "Africa",
    "dates": "January 26 - February 1, 2027",
    "price": "1,700.00 ZAR - 2,850.00 ZAR",
    "website": "https://www.capetownsalsa.co.za/event/ctaldf/",
    "instagram": "",
    "description": "7-day celebration of Afro-Latin dance, culture, and exploration in Cape Town. World-class workshops in salsa, bachata, kizomba, and Afro-Latin styles, led by both local and international artists. Daytime socials, rooftop parties, poolside gatherings, sightseeing excursions, and evening gala events. Highlights: opening SBK party, rooftop cocktails, black-tie gala evening, pool party, traditional South African braai with closing party. Events at Homecoming Centre (District Six Museum) and various iconic Cape Town venues.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      -33.9288301,
      18.4172197
    ],
    "venue": "Homecoming Centre (District Six Museum) and various Cape Town venues",
    "category": "Festival",
    "months": [
      "January"
    ]
  },
  {
    "id": "egypt-world-dance-congress-2026",
    "name": "Egypt World Dance Congress",
    "city": "South Sinai",
    "country": "Egypt",
    "continent": "Africa",
    "dates": "April 8-16, 2026",
    "price": "TBA",
    "website": "-",
    "instagram": "-",
    "description": "Multi-day Latin dance congress in South Sinai, Egypt. Workshops in salsa, bachata, kizomba, and other Latin styles set against Sinai's spectacular Red Sea coastal scenery. Includes Cuban Salsa programming alongside other styles.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      27.9654,
      34.33
    ],
    "venue": "South Sinai (Red Sea coastal venues)",
    "category": "Congress",
    "months": [
      "April"
    ]
  },
  {
    "id": "afrolatin-holidays-egypt-2026",
    "name": "AfroLatin Holidays Egypt",
    "city": "Cairo",
    "country": "Egypt",
    "continent": "Africa",
    "dates": "October 2026 (TBA)",
    "price": "Full Pass from €80",
    "website": "https://afrolatinegypt.com/",
    "instagram": "-",
    "description": "AfroLatin Egypt presents the 14th edition of its signature dance-vacation. Up to 15 days of social Latin dance experiences across six iconic Egyptian destinations: Cairo, Hurghada (Red Sea), Luxor, Nubia (Aswan), Matrouh, and Siwa. Daily social parties (beach, pool, boat, foam, themed), workshops in Salsa (including Cuban), Bachata, Kizomba, UrbanKiz, Zouk. Sightseeing (Pyramids, Luxor temples), adventure activities (sandboarding, safaris, hot-air balloon), genuine cultural connection. Pass options: Full, Ultra Full, VIP, Super, Royal. NOTE: Mainly bachata/kizomba/SBK with some Cuban content - dance vacation rather than pure Cuban festival.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      30.0444,
      31.2357
    ],
    "venue": "Cairo + Hurghada, Luxor, Nubia (Aswan), Matrouh, Siwa",
    "category": "Festival",
    "yearsActive": "14",
    "months": [
      "October"
    ]
  },
  {
    "id": "marrakech-bailamos-festival-2026",
    "name": "Marrakech Bailamos Festival",
    "city": "Marrakech",
    "country": "Morocco",
    "continent": "Africa",
    "dates": "July 2026 (TBA)",
    "price": "TBA",
    "website": "-",
    "instagram": "-",
    "description": "Annual Latin dance festival in Marrakech, Morocco. 6th edition was July 3-6, 2025. Mix of Cuban salsa, bachata, kizomba styles in the heart of Morocco's vibrant cultural capital. 2026 dates approximate based on past editions.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      31.6295,
      -7.9811
    ],
    "venue": "TBA, Marrakech",
    "category": "Festival",
    "yearsActive": "7",
    "months": [
      "July"
    ]
  },
  {
    "id": "australian-cuban-dance-festival-sydney-2026",
    "name": "Australian Cuban Dance Festival",
    "city": "Sydney",
    "country": "Australia",
    "continent": "Oceania",
    "dates": "October 2026 (TBA)",
    "price": "From AUD 40",
    "website": "https://buenavistadance.com/cuban-dance-festival/",
    "instagram": "@afro.and.cuban.dance.festival",
    "description": "Celebrating the Evolution of Cuban Salsa: 'Del Son A La Timba'. 3-day extravaganza of Cuban dance and music. 30 Workshops, 3 Night Parties, Live Band, 4 DJs. Dynamic workshops with acclaimed Cuban dance masters, outstanding live performances by Australian dance schools and Cuban artists, electrifying parties with DJs and live music. Organized by Buena Vista Dance Cuban Academy at Sydney Portugal Community Club, Marrickville.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      -33.91,
      151.1551
    ],
    "venue": "Sydney Portugal Community Club, 100 Marrickville Rd, Marrickville NSW 2204",
    "category": "Festival",
    "months": [
      "October"
    ]
  },
  {
    "id": "timbeando-festival-lloret-2026",
    "name": "Timbeando Festival 2026",
    "city": "Lloret de Mar",
    "country": "Spain",
    "continent": "Europe",
    "dates": "March 6-8, 2026",
    "price": "From €85 (Full Pass Basic €119, Pack Party Pass €50)",
    "website": "https://www.salsavida.com/event/spain/catalunya/lloret-de-mar/timbeando-festival/",
    "instagram": "@timbeando_festival",
    "description": "100% Cuban festival celebrating Cuban music and dance with timba as its centerpiece. Workshops in salsa cubana, timba, guaguanco, rueda de casino, rumba and afro. Includes Timba en el Ring competition (solo and couples). Held at Hotel Evenia Olympic in Lloret de Mar.",
    "artists": [
      "Yorgenis Danger 'Yoyo'",
      "Jorge Camagüey",
      "José Carlos",
      "DJ El Ruso",
      "DJ Santiago de Cuba"
    ],
    "coordinates": [
      41.7005,
      2.8458
    ],
    "venue": "Hotel Evenia Olympic Palace",
    "category": "Festival",
    "yearsActive": "2022-present",
    "months": [
      "March"
    ]
  },
  {
    "id": "ruedamania-yekaterinburg-2026",
    "name": "Ruedamania 2026",
    "city": "Yekaterinburg",
    "country": "Russia",
    "continent": "Europe",
    "dates": "October 15-17, 2026",
    "price": "TBA",
    "website": "",
    "instagram": "-",
    "description": "Cuban Rueda de Casino festival in Yekaterinburg, the cultural center of Russia's Ural region. Features rueda workshops, casino partnerwork, and Cuban-style social dancing.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      56.8389,
      60.6057
    ],
    "venue": "TBD",
    "category": "Festival",
    "months": [
      "October"
    ]
  },
  {
    "id": "el-son-cubano-fest-london-2026",
    "name": "El Son Cubano Fest 2026 — From Son to Contratiempo",
    "city": "London",
    "country": "United Kingdom",
    "continent": "Europe",
    "dates": "May 7-11, 2026",
    "price": "£269 (Full Pass after May 3, 2026)",
    "website": "https://www.cubanschool.co.uk/events/festivals/son-cubano-fest",
    "instagram": "@elsoncubanofest",
    "description": "The UK's only festival fully dedicated to Son Cubano, returning for its 2nd edition. Created and directed by Damarys Farres, UK Official Ambassador of the International Day of Son. 5 days of authentic Cuban culture with workshops, themed parties, live music, outdoor matinees and seminars. Friday May 8 celebrates the International Day of Son Cubano with red/white/blue Cuban flag colors.",
    "artists": [
      "Damarys Farres",
      "Juan Carlos Pacheco",
      "Osbanis Tejeda",
      "Anneta Kepka",
      "Randy Hechavarria",
      "DJ Flecha",
      "DJ Sacha",
      "DJ Javier"
    ],
    "coordinates": [
      51.5476,
      -0.2107
    ],
    "venue": "The Crown Hotel, Cricklewood",
    "category": "Festival",
    "yearsActive": "2025-present",
    "months": [
      "May"
    ]
  },
  {
    "id": "los-dos-abuelos-festival-2026",
    "name": "Los Dos Abuelos Festival 2026",
    "city": "Santa Susanna",
    "country": "Spain",
    "continent": "Europe",
    "dates": "March 20-22, 2026",
    "price": "TBA",
    "website": "https://www.salsero.es/events/9482/los-dos-abuelos-festival-2026-2--edicion",
    "instagram": "-",
    "description": "2nd edition Cuban festival in the Barcelona area, organized by Zaragozando a lo Cubano. Dedicated to the roots of Cuban dance and music with 30+ workshops covering rumba guaguancó, son cubano, palo congo, timba cubana, casino, and afro-cuban styles. Includes shows, dance competitions, pool party, and themed socials. Family-friendly atmosphere at Hotel Don Angel.",
    "artists": [
      "Silvio Leroy",
      "Sonia Cano",
      "Ernesto Garcia",
      "Alba Calvet",
      "Michael Vizcaino",
      "Neilys Marrero",
      "Cristian Mauricio",
      "Olofi"
    ],
    "coordinates": [
      41.6353,
      2.7066
    ],
    "venue": "Hotel Don Angel",
    "category": "Festival",
    "yearsActive": "2025-present",
    "months": [
      "March"
    ]
  },
  {
    "id": "tomezclao-dance-festival-2026",
    "name": "To' Mezclao Dance Festival 2026",
    "city": "Santa Susanna",
    "country": "Spain",
    "continent": "Europe",
    "dates": "April 2026 (TBC)",
    "price": "TBA",
    "website": "https://www.goandance.com/en/events/7143-to-mezclao-dance-festival-2025",
    "instagram": "-",
    "description": "Three-day mixed-style dance festival in the Barcelona area (Santa Susanna), organized by Michael & Neilys. Combines Cuban Salsa, Timba, Son, Cuban Rumba, Bachata, Sensual Bachata, Dominican Bachata, Reggaeton, and Urban styles. Features international artists, two nights of socials, pool party, and shows in a welcoming family-style setting at Hotel Don Angel.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      41.6353,
      2.7066
    ],
    "venue": "Hotel Don Angel",
    "category": "Festival",
    "yearsActive": "2024-present",
    "months": [
      "April"
    ]
  },
  {
    "id": "crazy-dance-festival-2026",
    "name": "Crazy Dance Festival 2026",
    "city": "Santa Susanna",
    "country": "Spain",
    "continent": "Europe",
    "dates": "June 12-14, 2026",
    "price": "TBA",
    "website": "https://crazydancefestival.com/",
    "instagram": "@crazydancefestival",
    "description": "Festival of bachata, salsa cubana, and timba held at Hotel Don Angel in Santa Susanna (Barcelona area). Features workshops with renowned Cuban artists like Pedrito & Giusy, plus international bachata names. Three days of workshops, shows, themed parties and pool parties on the Mediterranean coast.",
    "artists": [
      "Pedrito Cuba",
      "Giusy Chisari",
      "Cristian y Gabriela",
      "Gloria y Aitor",
      "Alfonso y Noelia",
      "DJ Ned",
      "DJ Smile",
      "DJ Manuel",
      "DJ Diablito",
      "DJ Kilo",
      "DJ Estefi",
      "DJ Marc",
      "DJ Tom Nka"
    ],
    "coordinates": [
      41.6353,
      2.7066
    ],
    "venue": "Hotel Don Angel",
    "category": "Festival",
    "months": [
      "June"
    ]
  },
  {
    "id": "timbatonazo-summer-festival-2026",
    "name": "TIMBATONAZO Summer Festival 2026",
    "city": "Santa Susanna",
    "country": "Spain",
    "continent": "Europe",
    "dates": "August 20-23, 2026",
    "price": "€105-€120 (Full Pass) / €260+ (Pass + Hotel single) / €520 (Pass + Double Room)",
    "website": "https://www.goandance.com/en/event/8650/timbatonazo-summer-festival-2026",
    "instagram": "@timbatonazo",
    "description": "100% Cuban summer festival representing Cuba in Spain. Held at Hotel Don Angel in Santa Susanna (Barcelona area). Features the best Cuban folkloric, traditional and modern dance teachers, live percussion master classes, pool parties, dominoes games, social nights, shows, and themed parties. Organized by Zaragozando a lo Cubano (Zgz).",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      41.6353,
      2.7066
    ],
    "venue": "Hotel Don Angel",
    "category": "Festival",
    "yearsActive": "2024-present",
    "months": [
      "August"
    ]
  },
  {
    "id": "remix-dance-festival-2026",
    "name": "The Remix Dance Festival 2026 — Diamond Edition",
    "city": "Santa Susanna",
    "country": "Spain",
    "continent": "Europe",
    "dates": "April 30 - May 3, 2026",
    "price": "€99 (Full Pass)",
    "website": "https://www.goandance.com/en/event/8618/the-remix-dance-festival-2026-diamond-edition",
    "instagram": "@theremixdancefestival",
    "description": "Diamond Edition. Four days and three nights of Cuban-leaning Latin dance at Hotel Don Angel in Santa Susanna with full board. Lineup features prominent Cuban artists across timba, salsa cubana, and Afro-Cuban styles. Workshops with national and international artists, themed parties, shows, and pool sessions on the Costa del Maresme.",
    "artists": [
      "Marley & Leo",
      "Cuban Flex",
      "Jorge 'El Bomba'",
      "Osdanys Flores",
      "Marielkis Hernandez",
      "Alan & Cristina",
      "Emilito Herrera",
      "Danger Rodriguez"
    ],
    "coordinates": [
      41.6353,
      2.7066
    ],
    "venue": "Hotel Don Angel",
    "category": "Festival",
    "yearsActive": "2023-present",
    "months": [
      "April"
    ]
  },
  {
    "id": "salsarave-barcelona-2026",
    "name": "SalsaRave 2026 in Barcelona",
    "city": "Santa Susanna",
    "country": "Spain",
    "continent": "Europe",
    "dates": "September 9-12, 2026",
    "price": "TBA",
    "website": "https://www.goandance.com/en/event/8717/salsarave-2026",
    "instagram": "-",
    "description": "International Cuban salsa rave festival blending workshops with high-energy rave-inspired social dancing. Four-day program at Hotel Don Angel, Santa Susanna, with daytime workshops and late-night socials in a contemporary Cuban music environment.",
    "artists": [
      "TBD"
    ],
    "coordinates": [
      41.6353,
      2.7066
    ],
    "venue": "Hotel Don Angel",
    "category": "Festival",
    "months": [
      "September"
    ]
  },
  {
    "id": "cuba-me-mucho-angers-2027",
    "name": "Cuba Me Mucho - Angers Salsa Festival",
    "city": "Angers",
    "country": "France",
    "continent": "Europe",
    "dates": "January 15-17, 2027",
    "price": "120,00 €",
    "website": "https://bailaconamigos.com",
    "instagram": "https://www.instagram.com/cuba_me_mucho/",
    "description": "7th edition. Salsa, Timba, Cubatón y mucho más",
    "artists": [
      "Lorenys Rodriguez",
      "Carlos Manolo",
      "Yosniel Brunet",
      "Osbanis Tejeda",
      "Anneta Kepka",
      "Dayana Alcala",
      "Aurore Limmois",
      "Melissa Jova",
      "Ismaray Chacon",
      "Riccardo Sozzino",
      "Mariana Diotallevi",
      "Cuban Flex",
      "Wilmer Najarro",
      "Maria de la Vega",
      "Roly Maden",
      "Noemi Montepagani"
    ],
    "coordinates": [
      47.4739884,
      -0.5515588
    ],
    "venue": "Hippodrome du Lion d'Angers",
    "category": "Festival",
    "yearsActive": "since 2020",
    "months": [
      "January"
    ]
  }
];

export default festivals;
