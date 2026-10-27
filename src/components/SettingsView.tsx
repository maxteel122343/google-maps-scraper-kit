import React, { useState } from 'react';
import {
  ShieldCheck,
  Server,
  Key,
  RefreshCw,
  AlertTriangle,
  FileCode,
  Check,
  Info,
  Terminal,
  ExternalLink
} from 'lucide-react';
import {
  getScraperConfig,
  saveScraperConfig,
  checkEngineHealth,
  ScraperEngineConfig
} from '../services/scraperApi';

interface SettingsViewProps {
  onConfigChanged: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onConfigChanged }) => {
  const [config, setConfig] = useState<ScraperEngineConfig>(getScraperConfig());
  const [testResult, setTestResult] = useState<{ up: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveScraperConfig(config);
    setSavedSuccess(true);
    onConfigChanged();
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    const res = await checkEngineHealth(config);
    setTestResult(res);
    setIsTesting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white">Engine Configuration & Safety</h2>
        <p className="text-sm text-slate-400 mt-1">
          Manage local Docker container connection settings, proxy rotation, and regulatory compliance.
        </p>
      </div>

      {/* Connection Settings Card */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-400" />
          <span>Local Engine Connection</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Engine Base URL
            </label>
            <input
              type="text"
              value={config.baseUrl}
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
              placeholder="http://localhost:8080"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Default local Docker container address: <code className="text-slate-400">http://localhost:8080</code>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Scraper API Key (Optional)
            </label>
            <input
              type="password"
              value={config.apiKey || ''}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              placeholder="Leave empty if direct localhost"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Injected into <code className="text-slate-400">X-API-Key</code> header if reverse proxy requires auth.
            </p>
          </div>
        </div>

        {/* Force Sandbox Toggle */}
        <div className="pt-2 flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <div className="text-xs font-bold text-slate-200">Local Sandbox Engine Mode</div>
            <p className="text-[11px] text-slate-400">
              Generate realistic mock places and leads without requiring a running Docker daemon.
            </p>
          </div>
          <input
            type="checkbox"
            checked={config.forceSimulation}
            onChange={(e) => setConfig({ ...config, forceSimulation: e.target.checked })}
            className="w-5 h-5 accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Test Result Feedback */}
        {testResult && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
              testResult.up
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                testResult.up ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>Test Ping</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md transition-all ml-auto"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : null}
            <span>{savedSuccess ? 'Settings Saved!' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>

      {/* Docker Launch Cheat Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span>Local Engine Quick Setup</span>
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          The engine (<code className="text-emerald-400">gosom/google-maps-scraper</code>) runs via Docker on port 8080. If starting fresh on your machine:
        </p>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-emerald-400 overflow-x-auto">
          <code>docker compose up -d</code>
        </div>

        <p className="text-[11px] text-slate-500">
          Verify status via curl: <code className="text-slate-400">curl -s http://localhost:8080/api/v1/jobs</code>
        </p>
      </div>

      {/* Safety & Compliance Playbook */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Compliance & Best Practices (Original Kit Guidance)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <h4 className="font-bold text-white mb-1">Warn, Don't Block Rule</h4>
            <p className="text-slate-400 leading-relaxed">
              When queries use high depth, multiple keywords, or grid mode, the UI displays clear warnings about temporary IP rate limits without blocking the user.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <h4 className="font-bold text-white mb-1">Personal Data Hygiene</h4>
            <p className="text-slate-400 leading-relaxed">
              Emails and phones are personal data under GDPR, CCPA, and CAN-SPAM. Always maintain opt-out suppression lists when launching outreach campaigns.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <h4 className="font-bold text-white mb-1">The 8 Lead Fields</h4>
            <p className="text-slate-400 leading-relaxed">
              Drop technical noise (link, cid, place_id, hours) by default. Present the lean 8 fields needed to qualify and contact leads.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <h4 className="font-bold text-white mb-1">Proxy Rotation</h4>
            <p className="text-slate-400 leading-relaxed">
              For high-volume scraping (&gt;100 places/min), rotate residential or datacenter SOCKS5/HTTP proxies to protect your local IP from Google throttling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
