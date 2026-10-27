# Google Maps Scraper Kit

<p align="center">
  <img src="assets/banner.svg" alt="Google Maps Scraper Kit: lead generation kit for Google Maps business listings" width="100%">
</p>

A modern lead generation web application for Google Maps business scraping. Name a business type and a city, and get back outreach-ready leads with verified business name, phone number, email address, website, category, physical address, review rating, review count, and enriched social profiles (Instagram, Facebook, LinkedIn).

## Features

- **The 8 Core Lead Fields**: Extracts name, phone, emails, website, category, address, rating, and review count — dropping technical noise by default.
- **Deep Email Enrichment**: Scrapes business homepages and follows links to contact and about pages for verified inboxes.
- **Social Profile Discovery**: Extracts Instagram, Facebook, and LinkedIn links via regex matching with zero LLM tokens.
- **Single & Batch Search**: Run single targeted queries or batch multi-keyword batches in one job.
- **Auto-Geocoding**: Automatic latitude and longitude resolution via OpenStreetMap Nominatim with quick presets for major cities.
- **Whole-City Grid Mode**: Splits large metros into 2x2 or 3x3 coordinate sectors with equirectangular bounds, deduping by `place_id` to break past Google's ~120 per-search cap.
- **Outreach Playbooks & Recipes**: Pre-configured keyword sets and tactical outreach guidance for Dental Practices, Roofing Contractors, Restaurants & Cafes, and HVAC & Plumbing.
- **Flexible Export**: One-click export to RFC 4180 CSV, JSON, or copy Tab-Separated Values (TSV) directly to Google Sheets or Excel.
- **Live Docker or Sandbox Mode**: Connects directly to local `gosom/google-maps-scraper` on `http://localhost:8080`, with an offline Sandbox Engine fallback.
- **Safety & Rate Limit Compliance**: Incorporates the original kit's "Warn, don't block" guideline for large jobs.

## Development

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build production bundle
npm run build

# Run TypeScript checks
npm run lint
```
