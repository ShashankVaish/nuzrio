const router = require('express').Router();
const briefController = require('../controllers/brief.controller');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);
router.get('/today', briefController.getTodayBrief);
router.get('/history', briefController.listBriefHistory);
router.get('/:id', briefController.getBriefById);
router.patch('/:id/progress', briefController.updatePlaybackProgress);

module.exports = router;
