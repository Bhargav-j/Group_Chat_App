const io = require("socket.io")(require("http").createServer(), {
  cors: {
    origin: "*",
  },
}); // Creates a separate HTTP server for Socket.IO

// {
//   origins: ["http://localhost:3000","http://localhost:5173"]
// }

const mongoose = require("mongoose");
const Group = require("./models/Group.model");
const Message = require("./models/Messages.model");

// Map to store connected users and their group associations
const connectedUsers = {};

io.on("connection", (socket) => {
  console.log("User connected");

  // Handle user joining a group
  socket.on("join-groups", async (groupIds, userId) => {
    try {
      connectedUsers[socket.id] = userId;

      for (const group of groupIds) {
        socket.join(group); // Join socket room for each group
        console.log(`User ${connectedUsers[socket.id]} joined group ${group}`);

        const message = await Message.findOne({ groupId: group }, null, {
          sort: { createdAt: -1 },
        }); // Sort descending for latest
        if (message) {
          socket.emit("receive-lastSingle-messages", [group, message]); // Send as an array
          // socket.emit("receive-past-messages", [message]); // Send as an array
        }
      }
    } catch (error) {
      console.error(error);
      socket.emit("error", "Error joining groups");
    }
  });

  // Handle incoming messages
  socket.on("send-message", async (content, groupId, username) => {
    if (!connectedUsers[socket.id]) {
      return socket.emit("error", "User not authenticated");
    }
    try {
      const group = await Group.findById(groupId);
      if (!group) {
        return socket.emit("error", "Invalid group ID");
      }

      const newMessage = new Message({
        content,
        groupId,
        likes: [],
        createdAt: new Date(),
        senderId: connectedUsers[socket.id],
      });
      await newMessage.save();

      // Broadcast message to all users in the group (excluding sender)

      const sendMessage = {
        content,
        groupId,
        likes: [],
        createdAt: new Date(),
        senderId: { _id: connectedUsers[socket.id], username },
      };

      socket.broadcast
        .to(groupId)
        .emit("receive-message", [groupId, sendMessage]);
      console.log(
        `Broadcasting message from user ${
          connectedUsers[socket.id]
        } in group ${groupId}`
      );
    } catch (error) {
      console.error(error);
      socket.emit("error", "Error sending message");
    }
  });

  // Handle incoming Likes
  socket.on("like-message", async (groupId, messageContent, userId) => {
    if (!connectedUsers[socket.id]) {
      return socket.emit("error", "User not authenticated");
    }
    try {
      const message = await Message.findOne({ content: messageContent }); // Filter by content

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

      // Broadcast message to all users in the group (excluding sender)
      socket.broadcast
        .to(groupId)
        .emit("receive-like", [groupId, messageContent, userId]);
    } catch (error) {
      console.error(error);
      socket.emit("error", "Error sending message");
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    const userId = connectedUsers[socket.id];
    if (userId) {
      delete connectedUsers[socket.id];
      console.log(`User ${userId} disconnected`);
    }
  });
});

module.exports = io;
