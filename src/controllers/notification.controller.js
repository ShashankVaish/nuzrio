const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/ApiResponse');

async function listNotifications(req, res) {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });
  return sendSuccess(res, 200, { notifications, unreadCount });
}

async function markAsRead(req, res) {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );
  if (!notification) throw ApiError.notFound('Notification not found');
  return sendSuccess(res, 200, notification, 'Marked as read');
}

async function markAllAsRead(req, res) {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  return sendSuccess(res, 200, null, 'All notifications marked as read');
}

module.exports = { listNotifications, markAsRead, markAllAsRead };
