const Connection = require("../models/Connection.model");
const Notification = require("../models/Notification.model");

exports.sendConnectionRequest = async (req, res, next) => {
  // Receive the connection request
  const senderId = req.user.id;
  const { receiverId } = req.body;

  if (!receiverId) {
    return res.status(400).json({ message: "Receiver ID is required." });
  }

  try {
    const existingConnection = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingConnection) {
      return res.status(409).json({
        message: `Connection already exists with status: ${existingConnection.status}`,
      });
    }

    // Create Connection
    const newConnection = new Connection({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });
    await newConnection.save();

    // Create Notification
    const newNotification = new Notification({
      recipient: receiverId,
      type: "connection_request",
      referenceId: newConnection._id,
      actor: senderId,
    });
    await newNotification.save();

    if (global.io) {
      global.io.to(receiverId).emit("new_notification", {
        message: "You have a new connection request.",
        notification: newNotification,
      });
      console.log(`Socket notification sent to user: ${receiverId}`);
    }

    res.status(201).json({
      message: "Connection request sent successfully and notification created.",
      connection: newConnection,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllConnections = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const acceptedConnections = await Connection.find({
      $or: [
        { sender: userId, status: "accepted" },
        { receiver: userId, status: "accepted" },
      ],
    })
      .populate("sender", "name username photo title")
      .populate("receiver", "name username photo title");

    const connections = acceptedConnections.map((conn) => {
      if (conn.sender._id.toString() === userId.toString()) {
        return conn.receiver;
      }
      return conn.sender;
    });

    res.status(200).json({ status: "success", connections });
  } catch (error) {
    next(error);
  }
};

exports.getConnectionStatus = async (req, res, next) => {
  const senderId = req.user.id;
  const receiverId = req.params.receiverId;

  try {
    const connection = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).select("status sender receiver -_id");

    console.log("Connection found:", connection);
    // let status = "none";
    let status;

    if (connection) {
      if (connection.status === "pending") {
        status =
          connection.sender.toString() === senderId ? "sent" : "received";
      } else {
        status = connection.status;
      }
    }

    res.status(200).json({
      status: "success",
      data: {
        connectionStatus: status,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.acceptConnection = async (req, res, next) => {
  const { connectionId } = req.params;
  const currentUserId = req.user.id;

  try {
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found." });
    }

    if (connection.receiver.toString() !== currentUserId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request." });
    }

    connection.status = "accepted";
    await connection.save();

    res
      .status(200)
      .json({ status: "success", message: "Connection accepted." });
  } catch (error) {
    next(error);
  }
};

exports.getPendingConnections = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const pendingConnections = await Connection.find({
      $or: [
        { sender: userId, status: "pending" },
        { receiver: userId, status: "pending" },
      ],
    })
      .populate("sender", "name username photo title")
      .populate("receiver", "name username photo title");

    const formatted = pendingConnections.map((conn) => {
      const isSender = conn.sender._id.toString() === userId;

      return {
        ...conn.toObject(),
        type: isSender ? "sent" : "received",
        user: isSender ? conn.receiver : conn.sender,
      };
    });

    res.status(200).json({ status: "success", connections: formatted });
  } catch (error) {
    next(error);
  }
};

exports.rejectConnection = async (req, res, next) => {
  const { connectionId } = req.params;
  const currentUserId = req.user.id;

  try {
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found." });
    }

    if (connection.receiver.toString() !== currentUserId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to reject this request." });
    }

    connection.status = "rejected";
    await connection.save();

    res
      .status(200)
      .json({ status: "success", message: "Connection rejected." });
  } catch (error) {
    next(error);
  }
};
