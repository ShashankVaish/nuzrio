// Static catalog data mirroring the onboarding screens (languages, professions,
// niches, voices, brief lengths). Kept as code, not DB collections, since these
// are fixed app-configuration options rather than user-generated data.

const LANGUAGES = [
  { code: 'en-GB', name: 'English', nativeName: 'English', tagline: 'Briefings delivered in English' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', tagline: 'हिन्दी में समाचार सुनें' },
];

const PROFESSIONS = [
  'Finance & Trading',
  'Legal',
  'Technology',
  'Healthcare',
  'Consulting',
  'Marketing & Media',
  'Government & Policy',
  'Real Estate',
  'Education',
  'Founder / Builder',
];

const NICHES = [
  'AI & Technology',
  'Financial Markets',
  'Indian Business',
  'Global Politics',
  'Startups',
  'Science',
  'Health & Medicine',
  'Climate & Energy',
  'Sports',
  'Culture & Arts',
  'Legal & Policy',
];

const MAX_NICHES = 7;

const VOICES = [
  {
    id: 'aria',
    name: 'Aria',
    languageCode: 'en',
    languageLabel: 'EN',
    description: 'Warm · Unhurried · British',
    accent: 'British',
    sampleUrl: '/samples/voices/aria.mp3',
  },
  {
    id: 'kai',
    name: 'Kai',
    languageCode: 'en',
    languageLabel: 'EN',
    description: 'Crisp · Focused · American',
    accent: 'American',
    sampleUrl: '/samples/voices/kai.mp3',
  },
  {
    id: 'meera',
    name: 'Meera',
    languageCode: 'hi',
    languageLabel: 'HI',
    description: 'Bright · Curious · Indian',
    accent: 'Indian',
    sampleUrl: '/samples/voices/meera.mp3',
  },
];

const BRIEF_LENGTHS = [
  { id: '5min', label: '5 min', minutes: 5 },
  { id: '10min', label: '10 min', minutes: 10 },
  { id: '15min', label: '15 min', minutes: 15 },
  { id: 'custom', label: 'Custom', minutes: null },
];

const DELIVERY_TIME_SLOTS = ['05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30'];

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    priceInr: 0,
    interval: 'month',
    features: ['5 article summaries per niche daily', 'Ad supported', 'Push notifications'],
  },
  {
    id: 'pro_monthly',
    name: 'Pro',
    priceInr: 79,
    interval: 'month',
    launchOffer: true,
    features: ['Unlimited custom briefings', 'Premium AI voices', 'Multi-language support'],
  },
  {
    id: 'pro_annual',
    name: 'Pro Annual',
    priceInr: 1499,
    interval: 'year',
    features: ['All Pro benefits', 'Offline mode', 'Priority features', 'Locks in launch pricing'],
  },
];

module.exports = {
  LANGUAGES,
  PROFESSIONS,
  NICHES,
  MAX_NICHES,
  VOICES,
  BRIEF_LENGTHS,
  DELIVERY_TIME_SLOTS,
  PLANS,
};
