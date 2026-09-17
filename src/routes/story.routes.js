const router = require('express').Router();
const storyController = require('../controllers/story.controller');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);
router.get('/saved', storyController.listSavedStories);
router.get('/:id', storyController.getStoryById);
router.post('/:id/save', storyController.saveStory);
router.delete('/:id/save', storyController.unsaveStory);

module.exports = router;
