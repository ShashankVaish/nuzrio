const router = require('express').Router();
const onboardingController = require('../controllers/onboarding.controller');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const {
  step1LanguageSchema,
  step2ProfessionSchema,
  step3NichesSchema,
  step4VoiceSchema,
  step5ScheduleSchema,
  step6NotificationsSchema,
} = require('../validators/onboarding.validators');

router.get('/catalog', onboardingController.getCatalog);

router.use(requireAuth);
router.put('/language', validate(step1LanguageSchema), onboardingController.setLanguage);
router.put('/profession', validate(step2ProfessionSchema), onboardingController.setProfession);
router.put('/niches', validate(step3NichesSchema), onboardingController.setNiches);
router.put('/voice', validate(step4VoiceSchema), onboardingController.setVoiceAndLength);
router.put('/schedule', validate(step5ScheduleSchema), onboardingController.setSchedule);
router.put('/notifications', validate(step6NotificationsSchema), onboardingController.setNotifications);

module.exports = router;
