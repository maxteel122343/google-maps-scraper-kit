export interface Lead {
  id: string;
  title: string;
  phone: string;
  emails: string;
  website: string;
  category: string;
  address: string;
  review_rating: number | string;
  review_count: number | string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  // Raw additional fields
  place_id?: string;
  cid?: string;
  link?: string;
  latitude?: string | number;
  longitude?: string | number;
  price_range?: string;
  open_hours?: string;
  timezone?: string;
  plus_code?: string;
  thumbnail?: string;
  jobId?: string;
  scrapedAt?: string;
}

export type LeadFieldKey = 'title' | 'phone' | 'emails' | 'website' | 'category' | 'address' | 'review_rating' | 'review_count' | 'instagram' | 'facebook' | 'linkedin';

export const LEAD_FIELDS: { key: LeadFieldKey; label: string; description: string }[] = [
  { key: 'title', label: 'Business Name', description: 'Listing headline on Google Maps' },
  { key: 'phone', label: 'Phone Number', description: 'Direct contact phone' },
  { key: 'emails', label: 'Emails', description: 'Extracted from website & contact pages' },
  { key: 'website', label: 'Website', description: 'Official business homepage' },
  { key: 'category', label: 'Category', description: 'Google Maps business category' },
  { key: 'address', label: 'Address', description: 'Full verified street address' },
  { key: 'review_rating', label: 'Rating', description: 'Star rating (1.0 - 5.0)' },
  { key: 'review_count', label: 'Reviews', description: 'Total verified Google reviews' },
  { key: 'instagram', label: 'Instagram', description: 'Enriched profile link' },
  { key: 'facebook', label: 'Facebook', description: 'Enriched business page' },
  { key: 'linkedin', label: 'LinkedIn', description: 'Enriched company / person page' },
];

export interface ScrapeJobConfig {
  name: string;
  keywords: string[];
  city?: string;
  lat: string;
  lon: string;
  depth: number;
  email: boolean;
  deepEmails: boolean;
  socials: boolean;
  grid?: number;
  maxTime: number;
  radius: number;
  zoom: number;
  fastMode: boolean;
  proxies?: string[];
}

export type JobStatus = 'queued' | 'working' | 'ok' | 'failed' | 'cancelled';

export interface ScrapeJob {
  id: string;
  config: ScrapeJobConfig;
  status: JobStatus;
  progress: number; // 0-100
  statusMessage?: string;
  createdAt: number;
  completedAt?: number;
  resultCount: number;
  results?: Lead[];
  error?: string;
  source: 'live-docker' | 'simulation';
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  keywords: string[];
  suggestedCity: string;
  depth: number;
  description: string;
  bestPractices: string[];
}
