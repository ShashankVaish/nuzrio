const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/onboarding', require('./onboarding.routes'));
router.use('/briefs', require('./brief.routes'));
router.use('/discover', require('./discover.routes'));
router.use('/stories', require('./story.routes'));
router.use('/settings', require('./settings.routes'));
router.use('/notifications', require('./notification.routes'));
router.use('/billing', require('./billing.routes'));
router.use('/admin', require('./admin.routes'));

module.exports = router;
