# NOCTIS — Cinema After Dark

A gothic black/crimson film discovery application, built with Next.js App Router.

## Features
- Responsive EN/EL interface, curated offline catalog of 48 films
- **Real Letterboxd ZIP parsing** in the browser (watched, ratings, diary, watchlist). Private and local-only.
- Taste DNA breakdown, genre plots and honest coverage/confidence figures
- Recommendations based on explicit weighted genre/director/decade heuristic, mood and duration
- Independent profiles and Couple Mode (excludes movies seen by either participant)
- Watchlist, seen-state and settings persisted on this browser with `localStorage`
- Optional live TMDB discovery and title-specific streaming provider data in **Greece (GR)**
- Stremio opens search only; no fictional availability claims

## Run locally

```bash
npm install
npm run dev
```

Go to http://localhost:3000.

## Deploy to Vercel

Import the repository in Vercel with framework **Next.js**; deploy without env variables for curated mode. Optionally add `TMDB_READ_ACCESS_TOKEN` from TMDB as a **server-side environment variable** to enable live discovery and Greek streaming-provider checks, and redeploy. Do not put this token in `NEXT_PUBLIC_*` variables. No other API keys required.

## Data handling

Letterboxd ZIP archives are parsed client-side with JSZip and PapaParse. They are **not** posted to the application server. Imported profiles are stored in browser localStorage, not encrypted or synced across devices. Users can clear this data in Profiles. If profiles are huge, the browser's storage quota can be exceeded; keep original ZIP files as backup. Avoid importing archives on shared devices.

## Accuracy & API disclosures

The demo catalog is hand-curated. Any recommendation score (out of 5) is a heuristic preference estimate, **not** a statistically calibrated rating or trained ML prediction. Imported films outside the curated catalog still contribute to watched counts and exclusion if names match; full cross-catalog feature enrichment would require a larger online dataset. Movie availability is never inferred from poster or catalog. Actual streaming providers are provided by TMDB/JustWatch by title and region, may change, and should be rechecked before watching. TMDB provider link may point to a TMDB-specific providers view.

No association with Letterboxd, TMDB, JustWatch, MUBI, Cinobo, Netflix or Stremio. This application uses the TMDB API but is not endorsed or certified by TMDB. Attribution for watch-provider data is required by TMDB/JustWatch if you enable public commercial service.
