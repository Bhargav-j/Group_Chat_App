const Message = require("../models/Messages.model");
const Group = require("../models/Group.model"); // Reference Group model for validation

// Create a new message in a group
exports.createMessage = async (req, res) => {
  const { content, groupId, senderId } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(400).json({ error: "Invalid group ID" });
    }

    if (!group.members.includes(senderId)) {
      return res
        .status(404)
        .json({ message: "User is not member of the Group" });
    }

    const newMessage = new Message({ content, groupId, senderId });
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all messages in a group
exports.getMessages = async (req, res) => {
  const groupId = req.params.id;
  const userId = req.userId;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(400).json({ error: "Invalid group ID" });
    }

    if (!group.members.includes(userId) && group.createdBy.toString() !== userId) {
      return res
        .status(404)
        .json({ message: "User is not member of the Group" });
    }

    const messages = await Message.find({ groupId }).populate(
      "senderId",
      "username"
    ); // Populate sender details
    if (messages.length > 0) {
      res.status(200).json({ groupId, messages });
    } else {
      res.status(200).json({ groupId, messages: [] });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single message by ID
// exports.getMessageById = async (req, res) => {
//   const messageId = req.params.id;
//   try {
//     const message = await Message.findById(messageId).populate('senderId', 'username'); // Populate sender details
//     if (!message) {
//       return res.status(404).json({ message: 'Message not found' });
//     }
//     res.status(200).json(message);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Like/Unlike a message
exports.likeMessage = async (req, res) => {
  const messageId = req.params.id;
  const userId = req.userId;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    const alreadyLiked = message.likes.includes(userId);
    if (alreadyLiked) {
      message.likes.pull(userId); // Unlike
    } else {
      message.likes.push(userId); // Like
    }
    await message.save();
    res
      .status(200)
      .json({ message: alreadyLiked ? "Unliked message" : "Liked message" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a single message by ID
exports.deleteMessage = async (req, res) => {
  const messageId = req.params.id;
  const userId = req.userId;
  try {
    const MessageInfo = await Message.findById(messageId, "groupId senderId");

    const group = await Group.findById(MessageInfo.groupId);
    if (!group) {
      return res.status(400).json({ error: "Invalid group ID" });
    }

    // if (!group.members.includes(userId)) {
    //   return res.status(404).json({ message: "User is not member of the Group" });
    // }

    if (MessageInfo.senderId === userId || group.createdBy === userId) {
      const deletedMessage = await Message.findByIdAndDelete(messageId);
      if (!deletedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.status(200).json({ message: "Message deleted" });
    } else {
      return res.status(404).json({
        message:
          "Access Denied: Only the Admin or message sender can delete the message",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete multiple messages
exports.deleteMultipleMessages = async (req, res) => {
  const { messageIds } = req.body; // Assuming an array of message IDs is sent in the body
  const userId = req.userId;

  try {
    const MessageInfo = await Message.findById(
      messageIds[0],
      "groupId senderId"
    );

    const group = await Group.findById(MessageInfo.groupId);

    if (!group) {
      return res.status(400).json({ error: "Invalid group ID" });
    }

    const deletedCount = await Message.deleteMany({ _id: { $in: messageIds } });
    res
      .status(200)
      .json({ message: `${deletedCount.deletedCount} messages deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
