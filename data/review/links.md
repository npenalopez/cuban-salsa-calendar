# Link check

Run on 2026-10-10 with `node scripts/check-links.mjs`: 328 links, 9 broken, 20 to check, 299 ok.

## Broken (9)

| Festival | Link | URL | Why |
|---|---|---|---|
| Agua Festival `agua-festival-thessaloniki-2026` | Tickets | https://my.weezevent.com/agua-salsa-festival-2026 | HTTP 404 |
| All Salsa Festival Lyon `all-salsa-festival-lyon-2027` | Website | https://www.allsalsafestival.com/ | HTTP 503 (server error) |
| Atlanta Salsa Bachata Festival `atlanta-salsa-bachata-festival-2027` | Tickets | https://www.eventbrite.com/e/atlanta-salsa-bachata-festival-2027-tickets-1984207297440 | ticket page says "SALES ENDED" |
| Cuban Flow Festival `cuban-flow-anglet-2026` | Tickets | https://www.billetweb.fr/cuban-flow-festival-2026 | ticket page says "event is over" |
| Festival La Spéciale 3 - Salsamas 10 Years `festival-la-speciale-renens-2026` | Tickets | https://eventfrog.ch/la-speciale-3 | HTTP 404 |
| Istanbul Social Dance Marathon `istanbul-social-dance-marathon-2026` | Instagram | https://www.instagram.com/dancemarathonistanbul/ | profile removed or never existed |
| ODAC Cuban Salsa Fiesta 2026 Bali Edition `obdac-bali-2026` | Tickets | https://www.eventbrite.com/e/odac-cuban-salsa-fiesta-2026-bali-edition-tickets-1982577006195 | ticket page says "EVENT ENDED" |
| Timba Flow Cuban Festival (TF MEX) `timba-flow-cuban-festival-playa-del-carmen-2026` | Tickets | https://timbaflowfestival.com/en#boletos | Timeout 30000ms exceeded. |
| Timba Flow Cuban Festival (TF MEX) `timba-flow-cuban-festival-playa-del-carmen-2026` | Website | https://timbaflowfestival.com/en | net::ERR_NETWORK_CHANGED at https://timbaflowfestival.com/en |

## To check by hand (20)

| Festival | Link | URL | Why |
|---|---|---|---|
| A Toda Cuba Festival `a-toda-cuba-calenzano-2026` | Website | https://www.atodacubafestival.it/ | page doesn't mention "toda cuba"; page is nearly empty |
| Casino Ritmo Habana - Primer Aniversario `casino-ritmo-habana-merida-2026` | Instagram | https://www.instagram.com/p/DbYqoaxEcLl/ | unexpected page: "Instagram" |
| Dance Congress Hamburg `dance-congress-hamburg-2026` | Website | https://www.dancecongresshamburg.com/ | page doesn't mention "hamburg" |
| DUKE Dance UK Evolution `duke-dance-uk-evolution-gillingham-2026` | Tickets | https://www.tickettailor.com/events/duke/1914908 | blocked by bot protection (HTTP 403); open it by hand |
| El Que Sabe, Sabe `el-que-sabe-sabe-anzio-2026` | Website | https://www.salsacrew.it/ | page doesn't mention "sabe sabe" |
| Festival La Spéciale 3 - Salsamas 10 Years `festival-la-speciale-renens-2026` | Instagram | https://www.instagram.com/salsamas.ch/ | unexpected page: "salsamas.ch • Instagram photos and videos" |
| FUSABAFES Fukuoka `fusafes-fukuoka-salsa-festival-2027` | Tickets | https://first3.jp/reserve/tiempo/customer/entry | page doesn't mention "fusabafes fukuoka"; page is nearly empty |
| FUSABAFES Fukuoka `fusafes-fukuoka-salsa-festival-2027` | Website | https://fusafes.tiempo.jp/ | page is nearly empty |
| Gusto Cubano Salsa & Bachata Weekend `gusto-cubano-kecskemet-2026` | Tickets | https://forms.gle/HWsox6C1222DB97d9 | redirects to docs.google.com |
| Havana en Belgrado `havana-en-belgrado-2026` | Instagram | https://www.instagram.com/havanaenbelgrado/ | unexpected page: "havanaenbelgrado • Instagram photos and videos" |
| Latin Dance Festival & WTP European Meeting `latin-dance-festival-lloret-2026` | Tickets | https://www.goandance.com/es/evento/9040/latin-dance-festival-2026 | page doesn't mention "european meeting" |
| Latin Dance Festival & WTP European Meeting `latin-dance-festival-lloret-2026` | Website | https://beacons.ai/_ldf | page doesn't mention "european meeting" |
| Love Dance Festival - Valentine's & Carnival Edition `love-dance-festival-lloret-feb-2027` | Instagram | https://www.instagram.com/p/DbI9N6KMudd/ | unexpected page: "Post isn't available • Instagram" |
| ¡Menéate! Viena Cuban Dance Festival `meneate-viena-2027` | Tickets | https://cubailaviena.at/en/events/meneate27/ | blocked by bot protection (HTTP 403); open it by hand |
| ¡Menéate! Viena Cuban Dance Festival `meneate-viena-2027` | Website | https://cubailaviena.at/en/events/meneate-viena-2026/ | blocked by bot protection (HTTP 403); open it by hand |
| Para el Alma Divertir - Cuban Son Weekend `para-el-alma-divertir-augsburg-2027` | Tickets | https://tickets.baila-augsburg.de/event/paraelalmadivertir-sonweekend2027/ | page is nearly empty |
| Quien Manda Festival `quien-manda-aubagne-2027` | Tickets | https://www.goandance.com/en/event/9845/quien-manda-festival-2027 | page is nearly empty |
| Ruedamania 2026 `ruedamania-yekaterinburg-2026` | Website | https://vk.com/ruedamania | redirects to vk.ru |
| Stockholm Salsa Marathon (Cuban Edition) `stockholm-bachata-cuban-marathon-2026` | Tickets | https://app.coursely.se/register/6f1aex9s8q9oyc5c?lang=en | page doesn't mention "stockholm marathon" |
| Timbeando y Mambo Festival `timbeando-y-mambo-festival-lloret-2027` | Website | https://beacons.ai/timbeando_festival | blocked by bot protection (HTTP 403); open it by hand |

## What was done on 2026-10-10

- Removed: ticket links of four festivals that already happened (Agua, Cuban Flow, La Spéciale, ODAC Bali: 404 or "event ended"); the removed Instagram of Istanbul Social Dance Marathon; Timba Flow's website and ticket link (timbaflowfestival.com did not answer in three tries over several hours; Instagram kept).
- Replaced: Love Dance Festival's Instagram (the linked post was gone) with @lovedancefestival, which lists the same dates and go&dance event; Casino Ritmo Habana's post link with the account that posted it, @casino_ritmohabana; Croatian Summer Salsa's website now points to its 2027 page; Menéate Viena's website pointed to the 2026 event page.
- Re-checked after the changes: all 12 links of the corrected festivals answer.
- Left as they are, open by hand if you like: bot-protected pages (DUKE tickets, Menéate Viena, Timbeando's Beacons page), JavaScript pages that load slowly (A Toda Cuba, FUSABAFES, Para el Alma, Quien Manda); they worked for the line-up check.
- Atlanta Salsa Bachata Festival 2027: the Eventbrite page works but says "Sales ended" (probably the current ticket tier); kept.
