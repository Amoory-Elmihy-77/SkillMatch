const Notification = require("../models/Notification.model");

exports.getNotifications = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: "actor",
        select: "name username photo title",
      });

    res.status(200).json({ notifications });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  const { notificationId } = req.params;
  const currentUserId = req.user.id;

  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: currentUserId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ message: "Notification not found or access denied." });
    }

    res.status(200).json({ status: "success", notification });
  } catch (error) {
    next(error);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  const currentUserId = req.user.id;
  try {
    await Notification.updateMany(
      { recipient: currentUserId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      status: "success",
      message: "All unread notifications marked as read.",
    });
  } catch (error) {
    next(error);
  }
};
