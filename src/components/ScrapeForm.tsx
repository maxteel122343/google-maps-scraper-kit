import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Mail,
  Share2,
  Layers,
  AlertTriangle,
  Play,
  Sliders,
  Plus,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { ScrapeJobConfig } from '../types/scraper';
import { geocodeCity, CITY_PRESETS } from '../services/geocoding';

interface ScrapeFormProps {
  onStartJob: (config: ScrapeJobConfig) => void;
  isScraping: boolean;
  onSelectRecipe?: () => void;
}

export const ScrapeForm: React.FC<ScrapeFormProps> = ({
  onStartJob,
  isScraping,
  onSelectRecipe
}) => {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [singleKeyword, setSingleKeyword] = useState('coffee shops in Austin TX');
  const [batchKeywordsText, setBatchKeywordsText] = useState(
    'dentists in Denver CO\northodontists in Denver CO\ncosmetic dentistry in Denver CO'
  );
  const [city, setCity] = useState('Austin, TX');
  const [lat, setLat] = useState('30.2672');
  const [lon, setLon] = useState('-97.7431');
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Parameters
  const [depth, setDepth] = useState(5);
  const [email, setEmail] = useState(true);
  const [deepEmails, setDeepEmails] = useState(true);
  const [socials, setSocials] = useState(true);
  const [grid, setGrid] = useState<number>(1);
  const [maxTime, setMaxTime] = useState(300);
  const [radius, setRadius] = useState(10000);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Handle City Change & Auto-geocoding
  const handleCityChange = async (cityName: string) => {
    setCity(cityName);
    setIsGeocoding(true);
    const res = await geocodeCity(cityName);
    if (res) {
      setLat(res.lat);
      setLon(res.lon);
    }
    setIsGeocoding(false);
  };

  // Collect keywords based on mode
  const getKeywords = (): string[] => {
    if (mode === 'single') {
      return singleKeyword.trim() ? [singleKeyword.trim()] : [];
    }
    return batchKeywordsText
      .split('\n')
      .map((k) => k.trim())
      .filter((k) => k.length > 0 && !k.startsWith('#'));
  };

  const keywords = getKeywords();
  const isHighVolume = depth >= 15 || keywords.length >= 10 || grid >= 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keywords.length === 0) return;

    const jobName = mode === 'single' ? keywords[0] : `Batch (${keywords.length} terms)`;
    const config: ScrapeJobConfig = {
      name: jobName,
      keywords,
      city,
      lat,
      lon,
      depth,
      email,
      deepEmails,
      socials,
      grid: grid > 1 ? grid : undefined,
      maxTime,
      radius,
      zoom: 15,
      fastMode: false
    };

    onStartJob(config);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner & Quick Presets */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white">Google Maps Lead Scraper</h2>
            </div>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Extract clean business listings with verified phone numbers, emails, websites, ratings, and social profiles from Google Maps.
            </p>
          </div>
          {onSelectRecipe && (
            <button
              onClick={onSelectRecipe}
              type="button"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs tracking-wide shadow-md transition-all whitespace-nowrap self-start sm:self-auto"
            >
              Browse Playbook Recipes →
            </button>
          )}
        </div>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Mode Selector */}
        <div className="flex border-b border-slate-800 pb-4">
          <div className="bg-slate-950 p-1 rounded-xl flex gap-1 border border-slate-800">
            <button
              type="button"
              onClick={() => setMode('single')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'single'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Single Search
            </button>
            <button
              type="button"
              onClick={() => setMode('batch')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'batch'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Batch Keywords (Multiple)
            </button>
          </div>
        </div>

        {/* Keyword Inputs */}
        {mode === 'single' ? (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Search Keyword & Location
            </label>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={singleKeyword}
                onChange={(e) => setSingleKeyword(e.target.value)}
                placeholder='e.g. "coffee shops in Austin TX" or "commercial roofing in Phoenix AZ"'
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Tip: Include the business type and city in the query for highest Maps relevance.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Batch Keywords (One Per Line)
              </label>
              <span className="text-xs text-emerald-400 font-medium">
                {keywords.length} keyword(s) entered
              </span>
            </div>
            <textarea
              rows={4}
              value={batchKeywordsText}
              onChange={(e) => setBatchKeywordsText(e.target.value)}
              placeholder="dentists in Denver CO&#10;orthodontists in Denver CO&#10;pediatric dentist in Denver CO"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
            />
          </div>
        )}

        {/* Location & Coordinates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* City / Place */}
          <div className="md:col-span-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              City / Place Name
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onBlur={() => handleCityChange(city)}
                placeholder="e.g. Austin, TX"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Latitude */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Latitude
            </label>
            <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="30.2672"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Longitude */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Longitude
            </label>
            <input
              type="text"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              placeholder="-97.7431"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* City Presets Chips */}
        <div>
          <span className="text-xs text-slate-400 mr-2">Quick presets:</span>
          <div className="inline-flex flex-wrap gap-1.5 mt-1">
            {Object.keys(CITY_PRESETS).map((presetName) => (
              <button
                key={presetName}
                type="button"
                onClick={() => handleCityChange(presetName)}
                className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                  city.toLowerCase() === presetName.toLowerCase()
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-medium'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {presetName}
              </button>
            ))}
          </div>
        </div>

        {/* Enrichment Switches & Depth */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          {/* Depth Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span>Scroll Depth</span>
                <span className="text-[10px] text-slate-400 lowercase font-normal">(pagination depth)</span>
              </label>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Depth {depth} (~{depth * 6} listings)
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
              <span>1 (Fast, ~6 leads)</span>
              <span>5 (Recommended, ~30 leads)</span>
              <span>20 (Deep, ~120 leads)</span>
            </div>
          </div>

          {/* Grid Whole-City Tile Mode */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>Whole-City Grid</span>
              </label>
              <span className="text-xs text-sky-400 font-mono">
                {grid === 1 ? 'Single Center Search' : `${grid}x${grid} Tiles (${grid * grid} searches)`}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 1, label: 'Standard (1 Tile)' },
                { val: 2, label: '2x2 (4 Tiles)' },
                { val: 3, label: '3x3 (9 Tiles)' }
              ].map((g) => (
                <button
                  key={g.val}
                  type="button"
                  onClick={() => setGrid(g.val)}
                  className={`py-2 px-2 rounded-lg border text-xs font-medium text-center transition-all ${
                    grid === g.val
                      ? 'bg-sky-500/20 border-sky-500/50 text-sky-300 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Breaks Google's ~120 listing cap by searching individual coordinate sectors and deduping by place_id.
            </p>
          </div>
        </div>

        {/* Feature Toggles (Lead Enrichments) */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Lead Enrichment Options (The 8 Lead Fields)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Email Extraction */}
            <div
              onClick={() => setEmail(!email)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                email
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Mail className={`w-4 h-4 ${email ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-semibold">Email Scraper</span>
                </div>
                <input
                  type="checkbox"
                  checked={email}
                  onChange={() => {}}
                  className="accent-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Visits websites to extract business contact emails. On by default.
              </p>
            </div>

            {/* Deep Email Pass */}
            <div
              onClick={() => setDeepEmails(!deepEmails)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                deepEmails && email
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Search className={`w-4 h-4 ${deepEmails && email ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-semibold">Deep Email Pass</span>
                </div>
                <input
                  type="checkbox"
                  disabled={!email}
                  checked={deepEmails && email}
                  onChange={() => {}}
                  className="accent-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Checks contact & about pages if homepage has no email.
              </p>
            </div>

            {/* Social Media Enrichment */}
            <div
              onClick={() => setSocials(!socials)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                socials
                  ? 'bg-purple-500/10 border-purple-500/40 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Share2 className={`w-4 h-4 ${socials ? 'text-purple-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-semibold">Socials (0 Tokens)</span>
                </div>
                <input
                  type="checkbox"
                  checked={socials}
                  onChange={() => {}}
                  className="accent-purple-500"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Extracts Instagram, Facebook & LinkedIn handles via HTTP regex.
              </p>
            </div>
          </div>
        </div>

        {/* Rate Limit Warning: Warn, don't block rule */}
        {isHighVolume && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">
                ⚠️ Rate-limit advisory: Large job parameters selected
              </p>
              <p className="mt-0.5 text-amber-200/90">
                High depth ({depth}), {keywords.length} keywords, or {grid}x{grid} grid mode will generate multiple searches.
                Per kit guidelines: we proceed without blocking, but recommend configuring proxies in Engine Settings for back-to-back heavy usage.
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isScraping || keywords.length === 0}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all ${
              isScraping
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 shadow-emerald-500/25 hover:shadow-emerald-500/40'
            }`}
          >
            {isScraping ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                <span>Running Scrape Job...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>
                  Start Scraping Leads ({keywords.length} {keywords.length === 1 ? 'keyword' : 'keywords'})
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
