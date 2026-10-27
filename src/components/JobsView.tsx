import React from 'react';
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Trash2,
  RefreshCw,
  Search,
  MapPin,
  Eye,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { ScrapeJob } from '../types/scraper';
import { exportLeadsToCsv, exportLeadsToJson } from '../services/exporter';

interface JobsViewProps {
  jobs: ScrapeJob[];
  onViewJobLeads: (job: ScrapeJob) => void;
  onDeleteJob: (jobId: string) => void;
  onStartNewScrape: () => void;
}

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  onViewJobLeads,
  onDeleteJob,
  onStartNewScrape
}) => {
  if (jobs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shadow-xl">
          <Activity className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">No Scrape Jobs Yet</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Every scrape task is tracked with live polling, progress updates, and downloadable CSV output.
        </p>
        <button
          onClick={onStartNewScrape}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wider transition-all shadow-lg"
        >
          Create First Job →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Jobs & Queue Monitor</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time async job tracker matching the kit's <code className="text-emerald-400">/api/v1/jobs</code> flow.
          </p>
        </div>
        <button
          onClick={onStartNewScrape}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md"
        >
          + New Scrape
        </button>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => {
          const isWorking = job.status === 'working' || job.status === 'queued';
          const isSuccess = job.status === 'ok';
          const isFailed = job.status === 'failed';

          return (
            <div
              key={job.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-xl transition-all ${
                isWorking
                  ? 'border-amber-500/40 ring-1 ring-amber-500/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Job Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isWorking
                        ? 'bg-amber-500/10 text-amber-400 animate-pulse'
                        : isSuccess
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {isWorking ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : isSuccess ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">
                        {job.config.name}
                      </h3>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          isWorking
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : isSuccess
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {job.status}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {job.source === 'live-docker' ? 'Docker Engine' : 'Sandbox Engine'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {job.config.city || `${job.config.lat}, ${job.config.lon}`}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span>Depth: {job.config.depth}</span>
                      {job.config.grid && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="flex items-center gap-1 text-sky-400">
                            <Layers className="w-3 h-3" />
                            {job.config.grid}x{job.config.grid} Grid
                          </span>
                        </>
                      )}
                      <span className="text-slate-600">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(job.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {isSuccess && job.results && job.results.length > 0 && (
                    <>
                      <button
                        onClick={() => onViewJobLeads(job)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View {job.resultCount} Leads</span>
                      </button>

                      <button
                        onClick={() =>
                          exportLeadsToCsv(
                            job.results || [],
                            false,
                            `job-${job.id.substring(0, 8)}.csv`
                          )
                        }
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                        title="Download CSV"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => onDeleteJob(job.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar (if working) */}
              {isWorking && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                      {job.statusMessage || 'Processing scrape...'}
                    </span>
                    <span className="font-mono text-amber-400 font-bold">{job.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300 rounded-full"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Success Result Summary */}
              {isSuccess && (
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-emerald-400/90 font-medium">
                    ✓ {job.statusMessage}
                  </span>
                  <span className="font-mono text-slate-500">ID: {job.id}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
