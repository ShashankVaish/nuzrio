const Story = require('../models/Story');
const mockStories = require('../data/mockStories');
const { sendSuccess } = require('../utils/ApiResponse');

// Re-seeds the Story collection with the mock catalog. Exists so a database
// with no shell access (e.g. Render's free tier) can be (re)populated with a
// single authenticated HTTP call instead of needing a local connection string.
async function seedStories(req, res) {
  await Story.deleteMany({});

  const now = Date.now();
  const withTimestamps = mockStories.map((story, i) => ({
    ...story,
    publishedAt: new Date(now - i * 45 * 60 * 1000),
  }));

  await Story.insertMany(withTimestamps);

  return sendSuccess(
    res,
    200,
    { inserted: withTimestamps.length, niches: new Set(mockStories.map((s) => s.niche)).size },
    'Stories seeded'
  );
}

module.exports = { seedStories };
