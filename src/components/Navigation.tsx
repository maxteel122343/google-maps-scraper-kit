import React from 'react';
import { Search, Users, Activity, BookOpen, ShieldAlert } from 'lucide-react';

export type TabKey = 'scrape' | 'leads' | 'jobs' | 'recipes' | 'settings';

interface NavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  leadsCount: number;
  activeJobsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  leadsCount,
  activeJobsCount
}) => {
  const tabs = [
    {
      key: 'scrape' as TabKey,
      label: 'New Scrape',
      icon: Search,
      badge: null
    },
    {
      key: 'leads' as TabKey,
      label: 'Leads Workspace',
      icon: Users,
      badge: leadsCount > 0 ? leadsCount : null
    },
    {
      key: 'jobs' as TabKey,
      label: 'Jobs & Queue',
      icon: Activity,
      badge: activeJobsCount > 0 ? activeJobsCount : null,
      pulse: activeJobsCount > 0
    },
    {
      key: 'recipes' as TabKey,
      label: 'Recipes & Playbooks',
      icon: BookOpen,
      badge: null
    },
    {
      key: 'settings' as TabKey,
      label: 'Engine & Safety',
      icon: ShieldAlert,
      badge: null
    }
  ];

  return (
    <div className="border-b border-slate-800 bg-[#0f172a]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 sm:space-x-6 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span
                    className={`ml-1 text-xs px-2 py-0.5 rounded-full font-semibold ${
                      tab.pulse
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                        : isActive
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
