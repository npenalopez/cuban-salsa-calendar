# Migration report

Source: `src/app/data/festivals.ts` (147 records, version 2026.08-147) → `data/festivals.json` (schema v2).

## Needs your review

- **Unparsed dates (0)**: none
- **Year-only dates → datePrecision "year" (18)**: aotearoa-cuban-festival-nz-2026: "TBC 2026"; ksaba-asia-salsa-bachata-congress-2026: "TBC 2026"; atlanta-afrocuban-dance-congress-2026: "TBC 2026"; bologna-salsa-festival-2026: "TBC 2026"; casineros-timba-fest-atlanta-2026: "TBC 2026"; cuba-mi-salsa-cyprus-2026: "TBC 2026"; dusseldorf-international-salsa-2026: "TBC 2026"; festival-salsa-cubana-munich-2026: "TBC late 2026"; festivalito-leipzig-2026: "TBC 2026"; firenze-mambo-congress-2026: "TBC 2026"; fusafes-fukuoka-salsa-festival-2026: "TBA 2026"; havana-to-melbourne-cuban-festival-2026: "TBC 2026"; hola-cuba-festival-france-2026: "TBC 2026"; me-gusta-cuba-festival-2026: "TBC 2026"; rose-city-salsa-timba-portland-2026: "TBC 2026"; salsafestival-chemnitz-2026: "TBC 2026"; stockholm-bachata-cuban-marathon-2026: "TBC 2026"; sydney-cuban-salsa-congress-2026: "TBC 2026"
- **Month-only dates → datePrecision "month" (9)**: a-toda-cuba-calenzano-2026: "Mid-November 2026"; afrolatin-holidays-egypt-2026: "October 2026 (TBA)"; australian-cuban-dance-festival-sydney-2026: "October 2026 (TBA)"; australian-rueda-championship-sydney-2026: "October 2026 (TBC)"; gusto-cubano-tapolca-2026: "Early November 2026"; hola-cuba-malmo-2026: "Late September 2026"; hot-salsa-weekend-stockholm-2026: "Early November 2026"; salsa-festival-carnaval-limoges-2026: "TBC March 2026"; salsa-stras-festival-strasbourg-2026: "September 2026 (TBC)"
- **Status taken from date text (1)**: istanbul-social-dance-marathon-2026: postponed
- **Country not recognised (1)**: ksaba-asia-salsa-bachata-congress-2026: "Asia (TBC)" → country/countryCode set to null
- **Instagram links that point to a post, not a profile (2)**: casino-ritmo-habana-merida-2026, love-dance-festival-lloret-feb-2027
- **No website and no Instagram**: 105 festivals
- **ticketUrl**: empty for all 147. Fill it in to show "Get passes".

## Automatic changes

- Editorial notes ("User to verify…", "Details carried over…") moved from `description` to private `notes` in 59 records.
- Artist spellings unified (5): Seo Fernández / Seo Fernandez → Seo Fernández; Jonar González / Jonar Gonzalez → Jonar González; Lorenys Rodríguez / Lorenys Rodriguez → Lorenys Rodríguez; DJ Jack El Calvo / DJ Jack el Calvo → DJ Jack El Calvo; Yusimi Moya Rodríguez / Yusimi Moya Rodriguez → Yusimi Moya Rodríguez
- `USA` renamed to `United States`; ISO country codes added.
- `price` "TBA" → `priceText: null`; numeric `priceFrom` + ISO `currency` extracted where possible.
- Dropped: `months` (derived), `category` and `yearsActive` (always empty). `venue` kept as null.
- Added: `series` (id without year), `status`, `datePrecision`, `dateNote`, `ticketUrl`, `lastVerified`, `featured`, `notes`.
