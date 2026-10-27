import React from 'react';
import { MapPin, ShieldCheck, Database, Sliders, ExternalLink } from 'lucide-react';

interface HeaderProps {
  engineStatus: { up: boolean; message: string };
  totalLeads: number;
  activeJobsCount: number;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  engineStatus,
  totalLeads,
  activeJobsCount,
  onOpenSettings
}) => {
  return (
    <header className="border-b border-slate-800 bg-[#0b1220]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20 text-slate-950">
            <MapPin className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white sm:text-lg">
                Google Maps Scraper Kit
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v1.1
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Lead Generation & Business Intelligence Engine
            </p>
          </div>
        </div>

        {/* Status Indicators & Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Active Jobs Pill */}
          {activeJobsCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>{activeJobsCount} scraping...</span>
            </div>
          )}

          {/* Leads count badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-white">{totalLeads}</span>
            <span className="text-slate-400">leads collected</span>
          </div>

          {/* Engine Status Pill */}
          <button
            onClick={onOpenSettings}
            title={engineStatus.message}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              engineStatus.up
                ? 'bg-slate-900 border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60'
                : 'bg-slate-900 border-amber-500/30 text-amber-300 hover:border-amber-500/60'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                engineStatus.up ? 'bg-emerald-400 ring-4 ring-emerald-400/20' : 'bg-amber-400 ring-4 ring-amber-400/20'
              }`}
            />
            <span className="hidden sm:inline">
              {engineStatus.up ? 'Engine Active' : 'Sandbox Mode'}
            </span>
            <Sliders className="w-3.5 h-3.5 opacity-60 ml-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
