const router = require('express').Router();
const settingsController = require('../controllers/settings.controller');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const {
  updateProfileSchema,
  updatePreferencesSchema,
  updateNotificationSettingsSchema,
} = require('../validators/settings.validators');

router.use(requireAuth);
router.patch('/profile', validate(updateProfileSchema), settingsController.updateProfile);
router.patch('/preferences', validate(updatePreferencesSchema), settingsController.updatePreferences);
router.patch(
  '/notifications',
  validate(updateNotificationSettingsSchema),
  settingsController.updateNotificationSettings
);

module.exports = router;
