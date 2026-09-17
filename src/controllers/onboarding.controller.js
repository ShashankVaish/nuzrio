const catalog = require('../data/catalog');
const { sendSuccess } = require('../utils/ApiResponse');

function getCatalog(req, res) {
  return sendSuccess(res, 200, {
    languages: catalog.LANGUAGES,
    professions: catalog.PROFESSIONS,
    niches: catalog.NICHES,
    maxNiches: catalog.MAX_NICHES,
    voices: catalog.VOICES,
    briefLengths: catalog.BRIEF_LENGTHS,
    deliveryTimeSlots: catalog.DELIVERY_TIME_SLOTS,
  });
}

async function setLanguage(req, res) {
  const { language, locationEnabled, city } = req.body;
  const user = req.user;

  user.onboarding.language = language;
  if (typeof locationEnabled === 'boolean') user.locationEnabled = locationEnabled;
  if (city) user.city = city;
  user.onboarding.currentStep = Math.max(user.onboarding.currentStep, 2);
  await user.save();

  return sendSuccess(res, 200, user.toPublicProfile(), 'Language saved');
}

async function setProfession(req, res) {
  const { profession } = req.body;
  const user = req.user;

  user.onboarding.profession = profession;
  user.onboarding.currentStep = Math.max(user.onboarding.currentStep, 3);
  await user.save();

  return sendSuccess(res, 200, user.toPublicProfile(), 'Profession saved');
}

async function setNiches(req, res) {
  const { niches } = req.body;
  const user = req.user;

  user.onboarding.niches = niches;
  user.onboarding.currentStep = Math.max(user.onboarding.currentStep, 4);
  await user.save();

  return sendSuccess(res, 200, user.toPublicProfile(), 'Niches saved');
}

async function setVoiceAndLength(req, res) {
  const { voiceId, briefLengthId, customBriefMinutes } = req.body;
  const user = req.user;

  user.onboarding.voiceId = voiceId;
  user.onboarding.briefLengthId = briefLengthId;
  user.onboarding.customBriefMinutes = briefLengthId === 'custom' ? customBriefMinutes || null : null;
  user.onboarding.currentStep = Math.max(user.onboarding.currentStep, 5);
  await user.save();

  return sendSuccess(res, 200, user.toPublicProfile(), 'Voice & brief length saved');
}

async function setSchedule(req, res) {
  const { deliveryPeriod, deliveryTime } = req.body;
  const user = req.user;

  user.onboarding.deliveryPeriod = deliveryPeriod;
  user.onboarding.deliveryTime = deliveryTime;
  user.onboarding.currentStep = Math.max(user.onboarding.currentStep, 6);
  await user.save();

  return sendSuccess(res, 200, user.toPublicProfile(), 'Delivery schedule saved');
}

async function setNotifications(req, res) {
  const { notificationsEnabled } = req.body;
  const user = req.user;

  user.onboarding.notificationsEnabled = notificationsEnabled;
  user.preferences.pushNotifications = notificationsEnabled;
  user.onboarding.completed = true;
  user.onboarding.completedAt = new Date();
  await user.save();

  return sendSuccess(res, 200, user.toPublicProfile(), "You're all set");
}

module.exports = {
  getCatalog,
  setLanguage,
  setProfession,
  setNiches,
  setVoiceAndLength,
  setSchedule,
  setNotifications,
};
