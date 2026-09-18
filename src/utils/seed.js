require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Story = require('../models/Story');
const mockStories = require('../data/mockStories');

async function seed() {
  await connectDB();
  await Story.deleteMany({});

  // Spread stories over the last few hours so "latest first" ordering has
  // variety instead of every document sharing the same insert timestamp.
  const now = Date.now();
  const withTimestamps = mockStories.map((story, i) => ({
    ...story,
    publishedAt: new Date(now - i * 45 * 60 * 1000),
  }));

  await Story.insertMany(withTimestamps);
  console.log(`[seed] Inserted ${withTimestamps.length} stories across ${new Set(mockStories.map((s) => s.niche)).size} niches`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
