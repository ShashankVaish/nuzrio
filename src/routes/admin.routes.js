const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const requireSeedKey = require('../middleware/requireSeedKey');

router.post('/seed', requireSeedKey, adminController.seedStories);

module.exports = router;
