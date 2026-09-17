const { sendSuccess } = require('../utils/ApiResponse');

async function updateProfile(req, res) {
  const user = req.user;
  Object.assign(user, req.body);
  await user.save();
  return sendSuccess(res, 200, user.toPublicProfile(), 'Profile updated');
}

async function updatePreferences(req, res) {
  const user = req.user;
  Object.assign(user.preferences, req.body);
  await user.save();
  return sendSuccess(res, 200, user.preferences, 'Preferences updated');
}

async function updateNotificationSettings(req, res) {
  const user = req.user;
  Object.assign(user.notificationSettings, req.body);
  await user.save();
  return sendSuccess(res, 200, user.notificationSettings, 'Notification settings updated');
}

module.exports = { updateProfile, updatePreferences, updateNotificationSettings };
