import { Lead, ScrapeJobConfig } from '../types/scraper';

interface BusinessTemplate {
  namePrefix: string[];
  nameSuffix: string[];
  category: string;
  priceRange: string;
  hours: string;
}

const TEMPLATES: Record<string, BusinessTemplate> = {
  coffee: {
    namePrefix: ['Artisan', 'Copper Kettle', 'Velvet Bean', 'Roasted Crown', 'Blue Horizon', 'Morning Ritual', 'Daily Grind', 'Canyon', 'Cornerstone', 'Steam & Foam'],
    nameSuffix: ['Coffee Roasters', 'Cafe & Bakery', 'Espresso Bar', 'Coffeehouse', 'Specialty Coffee', 'Brew Lab', 'Coffee Collective'],
    category: 'Coffee shop',
    priceRange: '$$',
    hours: 'Mon-Sun: 6:30 AM - 6:00 PM'
  },
  dentist: {
    namePrefix: ['Apex', 'Gentle Care', 'Smiles of', 'Horizon', 'Pinnacle', 'Summit', 'Modern Family', 'Pure Dental', 'Beacon', 'Oakridge'],
    nameSuffix: ['Dental Care', 'Dental Group', 'Dentistry & Orthodontics', 'Family Dentistry', 'Smiles Studio', 'Dental Center'],
    category: 'Dentist',
    priceRange: '$$$',
    hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
  },
  roof: {
    namePrefix: ['Apex', 'All-Weather', 'Shield', 'Pinnacle', 'Tri-County', 'Ironclad', 'Horizon', 'Paramount', 'Eagle Eye', 'Elite'],
    nameSuffix: ['Roofing & Construction', 'Roof Specialists', 'Roofing Solutions', 'Contractors LLC', 'Roof Restoration', 'Commercial Roofing'],
    category: 'Roofing contractor',
    priceRange: '$$$',
    hours: 'Mon-Sat: 7:00 AM - 7:00 PM, 24/7 Emergency'
  },
  plumb: {
    namePrefix: ['FlowRight', 'ProPipe', 'Reliable', 'Express', 'ClearDrain', 'Master', 'HydroCare', 'Emergency', 'Precision', 'BlueWave'],
    nameSuffix: ['Plumbing & Drain', 'Plumbing Services', 'Plumbing Solutions', 'Mechanical LLC', 'Rooter & Plumbing'],
    category: 'Plumber',
    priceRange: '$$',
    hours: 'Open 24 Hours'
  },
  restaurant: {
    namePrefix: ['The Rustic', 'Bistro', 'Table & Tap', 'Harvest', 'Copper Spoon', 'The Brass', 'Salt & Smoke', 'Olive & Fig', 'Iron Wood', 'Heritage'],
    nameSuffix: ['Kitchen & Bar', 'Grill & Tavern', 'Trattoria', 'Artisan Eatery', 'Dining Room', 'Steakhouse & Cellar'],
    category: 'Restaurant',
    priceRange: '$$$',
    hours: 'Tue-Sun: 11:30 AM - 10:00 PM'
  },
  gym: {
    namePrefix: ['Iron', 'Titan', 'Apex', 'Core', 'Vanguard', 'Kinetic', 'Momentum', 'Pulse', 'Forge', 'Elevate'],
    nameSuffix: ['Fitness Club', 'Athletic Club', 'CrossTraining', 'Gym & Performance', 'Wellness Studio', 'Barbell Club'],
    category: 'Fitness center',
    priceRange: '$$',
    hours: 'Mon-Sun: 5:00 AM - 11:00 PM'
  },
  default: {
    namePrefix: ['Apex', 'Premier', 'Summit', 'Sterling', 'Nexus', 'Pacific', 'Benchmark', 'Vanguard', 'Beacon', 'Atlas'],
    nameSuffix: ['Group', 'Solutions', 'Associates', 'Studio', 'Partners', 'Services', 'Enterprises'],
    category: 'Local business',
    priceRange: '$$',
    hours: 'Mon-Fri: 9:00 AM - 6:00 PM'
  }
};

function getTemplate(keyword: string): BusinessTemplate {
  const kw = keyword.toLowerCase();
  if (kw.includes('coffee') || kw.includes('cafe')) return TEMPLATES.coffee;
  if (kw.includes('dentist') || kw.includes('dental')) return TEMPLATES.dentist;
  if (kw.includes('roof')) return TEMPLATES.roof;
  if (kw.includes('plumb') || kw.includes('drain')) return TEMPLATES.plumb;
  if (kw.includes('restaurant') || kw.includes('pizza') || kw.includes('bistro') || kw.includes('taco')) return TEMPLATES.restaurant;
  if (kw.includes('gym') || kw.includes('fitness') || kw.includes('yoga')) return TEMPLATES.gym;
  return TEMPLATES.default;
}

const STREETS = [
  'Main St', 'Congress Ave', 'Oakridge Blvd', 'Commerce St', 'Broadway',
  'Market St', 'Grand Ave', 'Highland Way', 'Riverwalk Rd', 'Sunset Blvd',
  'Center St', 'Parkview Ter', 'Industrial Pkwy', 'Liberty Ln'
];

export function generateSimulatedLeads(config: ScrapeJobConfig, count: number): Lead[] {
  const leads: Lead[] = [];
  const keyword = config.keywords[0] || 'Businesses';
  const template = getTemplate(keyword);
  const city = config.city || 'Metro Area';
  const baseLat = parseFloat(config.lat) || 30.2672;
  const baseLon = parseFloat(config.lon) || -97.7431;

  for (let i = 0; i < count; i++) {
    const pfx = template.namePrefix[i % template.namePrefix.length];
    const sfx = template.nameSuffix[(i * 3 + 1) % template.nameSuffix.length];
    const title = `${pfx} ${sfx}`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const streetNum = 100 + ((i * 137) % 8900);
    const street = STREETS[i % STREETS.length];
    const address = `${streetNum} ${street}, ${city}`;
    const phoneArea = Math.abs(Math.round(baseLat * 10)) % 800 + 200;
    const phoneMid = 100 + ((i * 47) % 899);
    const phoneEnd = 1000 + ((i * 73) % 8999);
    const phone = `(${phoneArea}) ${phoneMid}-${phoneEnd}`;
    const website = `https://www.${slug}.com`;

    // Email extraction
    let emails = '';
    if (config.email) {
      const emailTypes = ['info', 'contact', 'hello', 'team', 'service'];
      const chosenPrefix = emailTypes[i % emailTypes.length];
      emails = `${chosenPrefix}@${slug}.com`;
      if (config.deepEmails && i % 3 === 0) {
        emails += `, support@${slug}.com`;
      }
    }

    // Socials enrichment
    let instagram: string | undefined;
    let facebook: string | undefined;
    let linkedin: string | undefined;
    if (config.socials) {
      if (i % 5 !== 0) {
        instagram = `https://instagram.com/${slug}`;
      }
      if (i % 4 !== 0) {
        facebook = `https://facebook.com/${slug}`;
      }
      if (i % 3 === 0) {
        linkedin = `https://linkedin.com/company/${slug}`;
      }
    }

    const rating = (4.0 + ((i * 17) % 11) / 10).toFixed(1);
    const reviews = 15 + ((i * 43) % 480);
    const latOffset = ((i * 19) % 50 - 25) * 0.002;
    const lonOffset = ((i * 23) % 50 - 25) * 0.002;
    const leadLat = (baseLat + latOffset).toFixed(6);
    const leadLon = (baseLon + lonOffset).toFixed(6);
    const placeId = `ChIJ_${slug}_${i}`;

    leads.push({
      id: `lead_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`,
      title,
      phone,
      emails,
      website,
      category: template.category,
      address,
      review_rating: parseFloat(rating),
      review_count: reviews,
      instagram,
      facebook,
      linkedin,
      place_id: placeId,
      cid: `CID_${i * 928374}`,
      link: `https://maps.google.com/?q=${encodeURIComponent(title + ' ' + address)}`,
      latitude: leadLat,
      longitude: leadLon,
      price_range: template.priceRange,
      open_hours: template.hours,
      timezone: 'America/Chicago',
      scrapedAt: new Date().toISOString()
    });
  }

  return leads;
}
