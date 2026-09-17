require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Story = require('../models/Story');

const sampleStories = [
  {
    title: 'Anthropic ships Claude 4.5 with 2M-token memory and native tools.',
    summary: "Anthropic's new memory layer lets Claude hold entire codebases in mind while it works.",
    niche: 'AI & Technology',
    source: 'The Verge',
    sourceUrl: 'https://www.theverge.com',
    readMinutes: 3,
    audioUrl: '/samples/stories/anthropic-claude.mp3',
    durationSec: 194,
  },
  {
    title: 'Fed minutes hint at a September policy shift.',
    summary: 'Officials flagged growing confidence that inflation is cooling toward target.',
    niche: 'Financial Markets',
    source: 'Bloomberg',
    sourceUrl: 'https://www.bloomberg.com',
    readMinutes: 2,
    audioUrl: '/samples/stories/fed-minutes.mp3',
    durationSec: 130,
  },
  {
    title: 'Indian D2C startups raise record seed rounds in Q3.',
    summary: 'A wave of consumer brands is drawing early-stage capital despite a broader funding slowdown.',
    niche: 'Startups',
    source: 'Economic Times',
    sourceUrl: 'https://economictimes.indiatimes.com',
    readMinutes: 4,
    audioUrl: '/samples/stories/d2c-funding.mp3',
    durationSec: 210,
  },
  {
    title: 'ISRO announces next lunar sample-return mission timeline.',
    summary: 'The mission builds on Chandrayaan-3 learnings and targets a 2028 launch window.',
    niche: 'Science',
    source: 'The Hindu',
    sourceUrl: 'https://www.thehindu.com',
    readMinutes: 3,
    audioUrl: '/samples/stories/isro-mission.mp3',
    durationSec: 175,
  },
  {
    title: 'RBI keeps repo rate unchanged, signals gradual easing ahead.',
    summary: "The central bank's tone softened as it balances growth support with inflation control.",
    niche: 'Indian Business',
    source: 'Mint',
    sourceUrl: 'https://www.livemint.com',
    readMinutes: 3,
    audioUrl: '/samples/stories/rbi-rate.mp3',
    durationSec: 160,
  },
  {
    title: 'Global climate summit sets new emissions targets for 2035.',
    summary: 'Negotiators agreed on a phased framework after days of overtime talks.',
    niche: 'Climate & Energy',
    source: 'Reuters',
    sourceUrl: 'https://www.reuters.com',
    readMinutes: 3,
    audioUrl: '/samples/stories/climate-summit.mp3',
    durationSec: 185,
  },
];

async function seed() {
  await connectDB();
  await Story.deleteMany({});
  await Story.insertMany(sampleStories);
  console.log(`[seed] Inserted ${sampleStories.length} stories`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
