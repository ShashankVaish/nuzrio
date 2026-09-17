const Brief = require('../models/Brief');
const Story = require('../models/Story');
const SavedStory = require('../models/SavedStory');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/ApiResponse');
const { BRIEF_LENGTHS } = require('../data/catalog');

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function targetStoryCount(user) {
  const lengthDef = BRIEF_LENGTHS.find((b) => b.id === user.onboarding.briefLengthId);
  const minutes = lengthDef?.minutes || user.onboarding.customBriefMinutes || 10;
  // Roughly one story per 3 minutes of audio, minimum 3, maximum 10.
  return Math.min(10, Math.max(3, Math.round(minutes / 3)));
}

async function buildBriefForUser(user, date = new Date(), label = 'morning_brief') {
  const niches = user.onboarding.niches.length ? user.onboarding.niches : [];
  const count = targetStoryCount(user);

  const query = niches.length ? { niche: { $in: niches } } : {};
  const stories = await Story.find(query).sort({ publishedAt: -1 }).limit(count);

  const totalDurationSec = stories.reduce((sum, s) => sum + (s.durationSec || 0), 0);

  const brief = await Brief.create({
    user: user._id,
    date: startOfDay(date),
    label,
    niches,
    voiceId: user.onboarding.voiceId || 'aria',
    stories: stories.map((s) => s._id),
    totalDurationSec,
    status: stories.length ? 'ready' : 'pending',
  });

  return brief;
}

async function getTodayBrief(req, res) {
  const user = req.user;
  const today = startOfDay();

  let brief = await Brief.findOne({ user: user._id, date: today, label: 'morning_brief' }).populate('stories');
  if (!brief) {
    brief = await buildBriefForUser(user, today);
    brief = await brief.populate('stories');
  }

  const savedIds = new Set(
    (await SavedStory.find({ user: user._id, story: { $in: brief.stories.map((s) => s._id) } })).map((s) =>
      s.story.toString()
    )
  );

  return sendSuccess(res, 200, {
    id: brief._id,
    date: brief.date,
    label: brief.label,
    niches: brief.niches,
    voiceId: brief.voiceId,
    status: brief.status,
    totalDurationSec: brief.totalDurationSec,
    progress: brief.progress,
    stories: brief.stories.map((s) => ({ ...s.toCard(), saved: savedIds.has(s._id.toString()) })),
  });
}

async function getBriefById(req, res) {
  const brief = await Brief.findOne({ _id: req.params.id, user: req.user._id }).populate('stories');
  if (!brief) throw ApiError.notFound('Brief not found');

  return sendSuccess(res, 200, {
    id: brief._id,
    date: brief.date,
    label: brief.label,
    niches: brief.niches,
    voiceId: brief.voiceId,
    status: brief.status,
    totalDurationSec: brief.totalDurationSec,
    progress: brief.progress,
    stories: brief.stories.map((s) => s.toCard()),
  });
}

async function updatePlaybackProgress(req, res) {
  const { currentStoryIndex, currentPositionSec, isPlaying, playbackRate } = req.body;

  const brief = await Brief.findOne({ _id: req.params.id, user: req.user._id });
  if (!brief) throw ApiError.notFound('Brief not found');

  if (typeof currentStoryIndex === 'number') brief.progress.currentStoryIndex = currentStoryIndex;
  if (typeof currentPositionSec === 'number') brief.progress.currentPositionSec = currentPositionSec;
  if (typeof isPlaying === 'boolean') brief.progress.isPlaying = isPlaying;
  if (typeof playbackRate === 'number') brief.progress.playbackRate = playbackRate;
  if (brief.status === 'ready') brief.status = 'delivered';

  await brief.save();
  return sendSuccess(res, 200, brief.progress, 'Progress updated');
}

async function listBriefHistory(req, res) {
  const briefs = await Brief.find({ user: req.user._id }).sort({ date: -1 }).limit(30);
  return sendSuccess(
    res,
    200,
    briefs.map((b) => ({
      id: b._id,
      date: b.date,
      label: b.label,
      niches: b.niches,
      status: b.status,
      totalDurationSec: b.totalDurationSec,
      storyCount: b.stories.length,
    }))
  );
}

module.exports = { getTodayBrief, getBriefById, updatePlaybackProgress, listBriefHistory, buildBriefForUser };
