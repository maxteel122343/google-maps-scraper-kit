import React, { useState, useMemo } from 'react';
import {
  Download,
  Search,
  Filter,
  Phone,
  Mail,
  Globe,
  MapPin,
  Star,
  ExternalLink,
  Copy,
  Check,
  FileSpreadsheet,
  FileJson,
  Trash2,
  Table as TableIcon,
  LayoutGrid,
  Sparkles,
  Share2
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, LinkedinIcon } from './SocialIcons';
import { Lead } from '../types/scraper';
import { exportLeadsToCsv, exportLeadsToJson, copyLeadsAsTsv } from '../services/exporter';

interface LeadsViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onClearLeads: () => void;
  onStartNewScrape: () => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  onSelectLead,
  onClearLeads,
  onStartNewScrape
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hasEmailFilter, setHasEmailFilter] = useState(false);
  const [hasPhoneFilter, setHasPhoneFilter] = useState(false);
  const [hasSocialFilter, setHasSocialFilter] = useState(false);
  const [minRatingFilter, setMinRatingFilter] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [copiedTsv, setCopiedTsv] = useState(false);
  const [copiedCellId, setCopiedCellId] = useState<string | null>(null);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (hasEmailFilter && !lead.emails) return false;
      if (hasPhoneFilter && !lead.phone) return false;
      if (hasSocialFilter && !lead.instagram && !lead.facebook && !lead.linkedin) return false;
      if (minRatingFilter > 0) {
        const rating = typeof lead.review_rating === 'number' ? lead.review_rating : parseFloat(lead.review_rating);
        if (isNaN(rating) || rating < minRatingFilter) return false;
      }
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        const matchesTitle = lead.title.toLowerCase().includes(s);
        const matchesCategory = lead.category.toLowerCase().includes(s);
        const matchesAddress = lead.address.toLowerCase().includes(s);
        const matchesEmail = lead.emails.toLowerCase().includes(s);
        const matchesPhone = lead.phone.toLowerCase().includes(s);
        return matchesTitle || matchesCategory || matchesAddress || matchesEmail || matchesPhone;
      }
      return true;
    });
  }, [leads, searchTerm, hasEmailFilter, hasPhoneFilter, hasSocialFilter, minRatingFilter]);

  // Statistics
  const emailCount = useMemo(() => leads.filter((l) => Boolean(l.emails)).length, [leads]);
  const phoneCount = useMemo(() => leads.filter((l) => Boolean(l.phone)).length, [leads]);
  const websiteCount = useMemo(() => leads.filter((l) => Boolean(l.website)).length, [leads]);
  const socialCount = useMemo(
    () => leads.filter((l) => Boolean(l.instagram || l.facebook || l.linkedin)).length,
    [leads]
  );

  const handleCopyTsv = async () => {
    const success = await copyLeadsAsTsv(filteredLeads);
    if (success) {
      setCopiedTsv(true);
      setTimeout(() => setCopiedTsv(false), 2000);
    }
  };

  const handleCopyCell = (e: React.MouseEvent, val: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(val);
    setCopiedCellId(id);
    setTimeout(() => setCopiedCellId(null), 1500);
  };

  if (leads.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shadow-xl">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">No Leads Collected Yet</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Launch your first Google Maps scrape or pick an outreach recipe to start collecting local business contact leads.
        </p>
        <button
          onClick={onStartNewScrape}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wider transition-all shadow-lg shadow-emerald-500/20"
        >
          Launch New Scrape →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Leads</div>
          <div className="text-2xl font-bold text-white mt-1">{leads.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Google Maps businesses</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-sky-400" />
            <span>Verified Emails</span>
          </div>
          <div className="text-2xl font-bold text-sky-400 mt-1">
            {emailCount}{' '}
            <span className="text-xs font-normal text-slate-400">
              ({Math.round((emailCount / leads.length) * 100)}%)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">From homepage & contact pages</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Phone Numbers</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {phoneCount}{' '}
            <span className="text-xs font-normal text-slate-400">
              ({Math.round((phoneCount / leads.length) * 100)}%)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Direct business lines</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Social Enriched</span>
          </div>
          <div className="text-2xl font-bold text-purple-400 mt-1">
            {socialCount}{' '}
            <span className="text-xs font-normal text-slate-400">
              ({Math.round((socialCount / leads.length) * 100)}%)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">IG, Facebook & LinkedIn</div>
        </div>
      </div>

      {/* Search, Filter & Export Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by business name, category, city, email, phone..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Export & Actions Group */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="bg-slate-950 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setViewMode('table')}
                title="Table View"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                title="Card View"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'cards' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Copy for Google Sheets / Excel */}
            <button
              onClick={handleCopyTsv}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
              title="Copy Tab-Separated Values for pasting into Google Sheets or Excel"
            >
              {copiedTsv ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied TSV!</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copy TSV</span>
                </>
              )}
            </button>

            {/* Export CSV (8 Lead Fields) */}
            <button
              onClick={() => exportLeadsToCsv(filteredLeads, false, `leads-lean-${Date.now()}.csv`)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md"
              title="Download CSV with the 8 Core Lead Fields"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV (8 Fields)</span>
            </button>

            {/* Export JSON */}
            <button
              onClick={() => exportLeadsToJson(filteredLeads, `leads-${Date.now()}.json`)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-all"
              title="Export as JSON"
            >
              <FileJson className="w-4 h-4" />
            </button>

            {/* Clear Leads */}
            <button
              onClick={onClearLeads}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs transition-all"
              title="Clear all leads"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Filters:
          </span>

          <button
            onClick={() => setHasEmailFilter(!hasEmailFilter)}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              hasEmailFilter
                ? 'bg-sky-500/20 border-sky-500/50 text-sky-300 font-semibold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            ✉️ Has Email ({emailCount})
          </button>

          <button
            onClick={() => setHasPhoneFilter(!hasPhoneFilter)}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              hasPhoneFilter
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            📞 Has Phone ({phoneCount})
          </button>

          <button
            onClick={() => setHasSocialFilter(!hasSocialFilter)}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              hasSocialFilter
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 font-semibold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            📱 Has Socials ({socialCount})
          </button>

          {/* Rating filter */}
          <select
            value={minRatingFilter}
            onChange={(e) => setMinRatingFilter(parseFloat(e.target.value))}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value={0}>★ Any Rating</option>
            <option value={4.0}>★ 4.0+ Stars</option>
            <option value={4.5}>★ 4.5+ Stars</option>
          </select>

          <div className="ml-auto text-xs text-slate-400">
            Showing <strong className="text-white">{filteredLeads.length}</strong> of {leads.length} leads
          </div>
        </div>
      </div>

      {/* Main Table or Grid View */}
      {viewMode === 'table' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Business Name & Category</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Website</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Socials</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeads.map((lead) => {
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      {/* Name & Category */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {lead.title}
                        </div>
                        <div className="text-[11px] text-slate-400">{lead.category}</div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                        {lead.phone ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-200">{lead.phone}</span>
                            <button
                              onClick={(e) => handleCopyCell(e, lead.phone, `phone_${lead.id}`)}
                              className="text-slate-500 hover:text-emerald-400"
                              title="Copy Phone"
                            >
                              {copiedCellId === `phone_${lead.id}` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4">
                        {lead.emails ? (
                          <div className="flex items-center gap-1.5 max-w-[200px]">
                            <span className="text-sky-300 font-medium truncate" title={lead.emails}>
                              {lead.emails.split(',')[0]}
                            </span>
                            <button
                              onClick={(e) => handleCopyCell(e, lead.emails, `email_${lead.id}`)}
                              className="text-slate-500 hover:text-sky-400 shrink-0"
                              title="Copy Email"
                            >
                              {copiedCellId === `email_${lead.id}` ? (
                                <Check className="w-3 h-3 text-sky-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Website */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {lead.website ? (
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-300 hover:text-white flex items-center gap-1 max-w-[140px] truncate"
                          >
                            <span className="truncate">
                              {lead.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                            </span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {lead.review_rating ? (
                          <div className="flex items-center gap-1">
                            <span className="flex items-center font-bold text-amber-400">
                              <Star className="w-3 h-3 fill-current mr-0.5" />
                              {lead.review_rating}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              ({lead.review_count})
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <span className="text-slate-400 truncate block" title={lead.address}>
                          {lead.address || '—'}
                        </span>
                      </td>

                      {/* Socials */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {lead.instagram && (
                            <a
                              href={lead.instagram}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded bg-pink-500/10 text-pink-400 hover:bg-pink-500/20"
                              title="Instagram"
                            >
                              <InstagramIcon className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {lead.facebook && (
                            <a
                              href={lead.facebook}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                              title="Facebook"
                            >
                              <FacebookIcon className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {lead.linkedin && (
                            <a
                              href={lead.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
                              title="LinkedIn"
                            >
                              <LinkedinIcon className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {!lead.instagram && !lead.facebook && !lead.linkedin && (
                            <span className="text-slate-600">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => onSelectLead(lead)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 cursor-pointer shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {lead.category || 'Business'}
                  </span>
                  {lead.review_rating && (
                    <div className="flex items-center text-xs font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                      {lead.review_rating}{' '}
                      <span className="text-slate-400 font-normal ml-1">
                        ({lead.review_count})
                      </span>
                    </div>
                  )}
                </div>

                <h4 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {lead.title}
                </h4>

                <div className="text-xs text-slate-400 mt-2 space-y-1.5">
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-slate-300 font-mono">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{lead.phone}</span>
                    </div>
                  )}
                  {lead.emails && (
                    <div className="flex items-center gap-2 text-sky-300 font-medium">
                      <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">{lead.emails.split(',')[0]}</span>
                    </div>
                  )}
                  {lead.website && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{lead.website.replace(/^https?:\/\//, '')}</span>
                    </div>
                  )}
                  {lead.address && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{lead.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Social badges footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  {lead.instagram && <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />}
                  {lead.facebook && <FacebookIcon className="w-3.5 h-3.5 text-blue-400" />}
                  {lead.linkedin && <LinkedinIcon className="w-3.5 h-3.5 text-sky-400" />}
                  {!lead.instagram && !lead.facebook && !lead.linkedin && (
                    <span className="text-slate-600 text-[11px]">No socials</span>
                  )}
                </div>
                <span className="text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  View Details →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
