const Story = require('../models/Story');
const SavedStory = require('../models/SavedStory');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/ApiResponse');

async function attachSavedFlag(userId, stories) {
  const saved = await SavedStory.find({ user: userId, story: { $in: stories.map((s) => s._id) } });
  const savedIds = new Set(saved.map((s) => s.story.toString()));
  return stories.map((s) => ({ ...s.toCard(), saved: savedIds.has(s._id.toString()) }));
}

async function discoverFeed(req, res) {
  const { niche, q, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (niche && niche !== 'All') filter.niche = niche;
  if (q) filter.$text = { $search: q };

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));

  const [stories, total] = await Promise.all([
    Story.find(filter)
      .sort(q ? { score: { $meta: 'textScore' } } : { publishedAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Story.countDocuments(filter),
  ]);

  const cards = await attachSavedFlag(req.user._id, stories);

  return sendSuccess(res, 200, {
    stories: cards,
    page: pageNum,
    limit: limitNum,
    total,
    hasMore: pageNum * limitNum < total,
  });
}

async function getStoryById(req, res) {
  const story = await Story.findById(req.params.id);
  if (!story) throw ApiError.notFound('Story not found');

  const [saved] = await attachSavedFlag(req.user._id, [story]);
  return sendSuccess(res, 200, saved);
}

async function saveStory(req, res) {
  const story = await Story.findById(req.params.id);
  if (!story) throw ApiError.notFound('Story not found');

  await SavedStory.updateOne(
    { user: req.user._id, story: story._id },
    { $setOnInsert: { user: req.user._id, story: story._id } },
    { upsert: true }
  );

  return sendSuccess(res, 200, { storyId: story._id, saved: true }, 'Story saved');
}

async function unsaveStory(req, res) {
  await SavedStory.deleteOne({ user: req.user._id, story: req.params.id });
  return sendSuccess(res, 200, { storyId: req.params.id, saved: false }, 'Story removed from saved');
}

async function listSavedStories(req, res) {
  const saved = await SavedStory.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('story');
  const stories = saved.filter((s) => s.story).map((s) => ({ ...s.story.toCard(), saved: true, savedAt: s.createdAt }));
  return sendSuccess(res, 200, stories);
}

module.exports = { discoverFeed, getStoryById, saveStory, unsaveStory, listSavedStories };
