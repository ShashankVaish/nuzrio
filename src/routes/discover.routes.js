const router = require('express').Router();
const storyController = require('../controllers/story.controller');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);
router.get('/', storyController.discoverFeed);

module.exports = router;
