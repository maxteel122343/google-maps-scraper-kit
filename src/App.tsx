import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabKey } from './components/Navigation';
import { ScrapeForm } from './components/ScrapeForm';
import { LeadsView } from './components/LeadsView';
import { JobsView } from './components/JobsView';
import { RecipesView } from './components/RecipesView';
import { SettingsView } from './components/SettingsView';
import { LeadDetailModal } from './components/LeadDetailModal';
import { Lead, ScrapeJob, ScrapeJobConfig } from './types/scraper';
import { checkEngineHealth, executeScrapeJob } from './services/scraperApi';
import { generateSimulatedLeads } from './services/leadGenerator';

const STORAGE_LEADS_KEY = 'gms_leads_collection';
const STORAGE_JOBS_KEY = 'gms_jobs_collection';

export function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('scrape');
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LEADS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Seed with high quality initial demo leads
    const initialConfig: ScrapeJobConfig = {
      name: 'Sample Lead Seed',
      keywords: ['coffee shops in Austin TX'],
      city: 'Austin, TX',
      lat: '30.2672',
      lon: '-97.7431',
      depth: 4,
      email: true,
      deepEmails: true,
      socials: true,
      maxTime: 300,
      radius: 10000,
      zoom: 15,
      fastMode: false
    };
    return generateSimulatedLeads(initialConfig, 14);
  });

  const [jobs, setJobs] = useState<ScrapeJob[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_JOBS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [engineStatus, setEngineStatus] = useState<{ up: boolean; message: string }>({
    up: true,
    message: 'Initializing engine status...'
  });
  const [isScraping, setIsScraping] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_JOBS_KEY, JSON.stringify(jobs));
    } catch (e) {
      console.error(e);
    }
  }, [jobs]);

  // Check health on mount
  useEffect(() => {
    checkEngineHealth().then(setEngineStatus);
  }, []);

  const handleStartJob = async (config: ScrapeJobConfig) => {
    setIsScraping(true);
    setActiveTab('jobs');

    try {
      const completedJob = await executeScrapeJob(config, (updatedJob) => {
        setJobs((prevJobs) => {
          const exists = prevJobs.some((j) => j.id === updatedJob.id);
          if (exists) {
            return prevJobs.map((j) => (j.id === updatedJob.id ? updatedJob : j));
          }
          return [updatedJob, ...prevJobs];
        });
      });

      if (completedJob.results && completedJob.results.length > 0) {
        // Deduplicate against existing leads
        setLeads((prevLeads) => {
          const seen = new Set(prevLeads.map((l) => l.place_id || `${l.title}|${l.address}`));
          const uniqueNew = completedJob.results!.filter((l) => {
            const key = l.place_id || `${l.title}|${l.address}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          return [...uniqueNew, ...prevLeads];
        });
      }
    } catch (err) {
      console.error('Job error', err);
    } finally {
      setIsScraping(false);
    }
  };

  const handleClearLeads = () => {
    if (window.confirm('Are you sure you want to clear all collected leads?')) {
      setLeads([]);
    }
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const handleViewJobLeads = (job: ScrapeJob) => {
    if (job.results && job.results.length > 0) {
      setActiveTab('leads');
    }
  };

  const handleLoadRecipe = (config: ScrapeJobConfig) => {
    setActiveTab('scrape');
  };

  const activeJobsCount = jobs.filter((j) => j.status === 'working' || j.status === 'queued').length;

  return (
    <div className="min-h-screen bg-[#0b1220] text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        engineStatus={engineStatus}
        totalLeads={leads.length}
        activeJobsCount={activeJobsCount}
        onOpenSettings={() => setActiveTab('settings')}
      />

      {/* Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        leadsCount={leads.length}
        activeJobsCount={activeJobsCount}
      />

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'scrape' && (
          <ScrapeForm
            onStartJob={handleStartJob}
            isScraping={isScraping}
            onSelectRecipe={() => setActiveTab('recipes')}
          />
        )}

        {activeTab === 'leads' && (
          <LeadsView
            leads={leads}
            onSelectLead={setSelectedLead}
            onClearLeads={handleClearLeads}
            onStartNewScrape={() => setActiveTab('scrape')}
          />
        )}

        {activeTab === 'jobs' && (
          <JobsView
            jobs={jobs}
            onViewJobLeads={handleViewJobLeads}
            onDeleteJob={handleDeleteJob}
            onStartNewScrape={() => setActiveTab('scrape')}
          />
        )}

        {activeTab === 'recipes' && (
          <RecipesView onLoadRecipe={handleLoadRecipe} />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            onConfigChanged={() => {
              checkEngineHealth().then(setEngineStatus);
            }}
          />
        )}
      </main>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#070c16] py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Google Maps Scraper Kit</span>
            <span className="text-slate-500">•</span>
            <span>Based on gosom/google-maps-scraper</span>
          </div>
          <div className="text-slate-400">
            Export format: 8 Core Lead Fields (RFC 4180 CSV / JSON / TSV)
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
