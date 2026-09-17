const router = require('express').Router();
const notificationController = require('../controllers/notification.controller');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);
router.get('/', notificationController.listNotifications);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
