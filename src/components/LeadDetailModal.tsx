import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  Globe,
  MapPin,
  Star,
  ExternalLink,
  Copy,
  Check,
  Clock,
  DollarSign,
  Share2
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, LinkedinIcon } from './SocialIcons';
import { Lead } from '../types/scraper';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!lead) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyFullLead = () => {
    const summary = `
Business: ${lead.title}
Category: ${lead.category}
Rating: ${lead.review_rating} ★ (${lead.review_count} reviews)
Phone: ${lead.phone || 'N/A'}
Email: ${lead.emails || 'N/A'}
Website: ${lead.website || 'N/A'}
Address: ${lead.address || 'N/A'}
Socials: ${[lead.instagram, lead.facebook, lead.linkedin].filter(Boolean).join(' | ') || 'None'}
Google Maps: ${lead.link || 'N/A'}
    `.trim();

    copyToClipboard(summary, 'full');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-5 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {lead.category || 'Local Business'}
              </span>
              {lead.price_range && (
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300">
                  {lead.price_range}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white">{lead.title}</h2>
            {lead.review_rating && (
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className="flex items-center text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                  {lead.review_rating}
                </span>
                <span className="text-slate-400">
                  ({lead.review_count} verified reviews)
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Contact Direct Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Phone */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    Phone
                  </div>
                  <div className="text-sm font-semibold text-white truncate">
                    {lead.phone ? (
                      <a href={`tel:${lead.phone}`} className="hover:underline">
                        {lead.phone}
                      </a>
                    ) : (
                      <span className="text-slate-500 font-normal">None listed</span>
                    )}
                  </div>
                </div>
              </div>
              {lead.phone && (
                <button
                  onClick={() => copyToClipboard(lead.phone, 'phone')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                  title="Copy Phone"
                >
                  {copiedField === 'phone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Email */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    Email
                  </div>
                  <div className="text-sm font-semibold text-white truncate">
                    {lead.emails ? (
                      <a href={`mailto:${lead.emails.split(',')[0].trim()}`} className="hover:underline">
                        {lead.emails}
                      </a>
                    ) : (
                      <span className="text-slate-500 font-normal">Not detected</span>
                    )}
                  </div>
                </div>
              </div>
              {lead.emails && (
                <button
                  onClick={() => copyToClipboard(lead.emails, 'email')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                  title="Copy Email"
                >
                  {copiedField === 'email' ? <Check className="w-4 h-4 text-sky-400" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Website */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    Website
                  </div>
                  <div className="text-sm font-semibold text-white truncate">
                    {lead.website ? (
                      <a
                        href={lead.website}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        {lead.website.replace(/^https?:\/\/(www\.)?/, '')}
                      </a>
                    ) : (
                      <span className="text-slate-500 font-normal">No website</span>
                    )}
                  </div>
                </div>
              </div>
              {lead.website && (
                <a
                  href={lead.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                  title="Open Website"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Address */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    Address
                  </div>
                  <div className="text-sm font-semibold text-white truncate" title={lead.address}>
                    {lead.address || 'No address specified'}
                  </div>
                </div>
              </div>
              {lead.address && (
                <a
                  href={lead.link || `https://maps.google.com/?q=${encodeURIComponent(lead.title + ' ' + lead.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="View on Google Maps"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Social Profiles Enrichment */}
          {(lead.instagram || lead.facebook || lead.linkedin) && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Enriched Social Media Channels</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {lead.instagram && (
                  <a
                    href={lead.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-300 border border-pink-500/20 text-xs font-medium hover:bg-pink-500/20 transition-all"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>Instagram Profile</span>
                    <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                  </a>
                )}
                {lead.facebook && (
                  <a
                    href={lead.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-medium hover:bg-blue-500/20 transition-all"
                  >
                    <FacebookIcon className="w-3.5 h-3.5" />
                    <span>Facebook Page</span>
                    <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                  </a>
                )}
                {lead.linkedin && (
                  <a
                    href={lead.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20 text-xs font-medium hover:bg-sky-500/20 transition-all"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    <span>LinkedIn Company</span>
                    <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Additional Raw Parameters */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Technical Metadata
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              {lead.place_id && (
                <div>
                  <span className="text-slate-500 block text-[10px]">PLACE_ID</span>
                  <span className="text-slate-300 truncate block">{lead.place_id}</span>
                </div>
              )}
              {lead.cid && (
                <div>
                  <span className="text-slate-500 block text-[10px]">CID</span>
                  <span className="text-slate-300 truncate block">{lead.cid}</span>
                </div>
              )}
              {lead.latitude && (
                <div>
                  <span className="text-slate-500 block text-[10px]">COORDINATES</span>
                  <span className="text-slate-300 truncate block">
                    {lead.latitude}, {lead.longitude}
                  </span>
                </div>
              )}
              {lead.open_hours && (
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[10px]">HOURS</span>
                  <span className="text-slate-300">{lead.open_hours}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-4 flex items-center justify-between">
          <button
            onClick={copyFullLead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            {copiedField === 'full' ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Summary for CRM</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
