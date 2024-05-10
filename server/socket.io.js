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

  // Handle user authentication (replace with your chosen authentication method)
  //   socket.on('authenticate', async (username, password) => {
  //     try {
  //       const user = await User.findOne({ username, password: /* Hash and compare password */ });
  //       if (!user) {
  //         return socket.emit('error', 'Invalid username or password');
  //       }
  //       connectedUsers[socket.id] = user._id;
  //       console.log(`User ${user.username} (ID: ${user._id}) authenticated`);
  //     } catch (error) {
  //       console.error(error);
  //       socket.emit('error', 'Error during authentication');
  //     }
  //   });

  // Handle user joining a group
  socket.on("join-groups", async (groupIds, userId) => {
    try {
      connectedUsers[socket.id] = userId;

      for (const group of groupIds) {
        socket.join(group); // Join socket room for each group
        console.log(`User ${connectedUsers[socket.id]} joined group ${group}`);

        // Fetch and send past messages for each joined group
        // const messages = await Message.find({ groupId: group._id }).sort({
        //   createdAt: 1,
        // });
        // socket.emit("receive-past-messages", messages);
        const message = await Message.findOne({ groupId: group }, null, {
          sort: { createdAt: -1 },
        }); // Sort descending for latest
        if (message) {
          socket.emit("receive-lastSingle-messages", [group, message]); // Send as an array
          // socket.emit("receive-past-messages", [message]); // Send as an array
        }
        // else {
        //   socket.emit("receive-lastSingle-messages", {});  // Empty Object
        //   // socket.emit("receive-past-messages", [{}]);  // Empty Object
        // }
      }
    } catch (error) {
      console.error(error);
      socket.emit("error", "Error joining groups");
    }
  });

  // socket.on("join-group", async (groupId, userId) => {
  //   try {
  //     const group = await Group.findById(groupId).populate("members");
  //     if (!group) {
  //       return socket.emit("error", "Invalid group ID");
  //     }
  //   //   if (
  //   //     !group.members.some((member) =>
  //   //       member._id.equals(connectedUsers[socket.id])
  //   //     )
  //   //   ) {
  //   //     return socket.emit("error", "User not a member of the group");
  //   //   }
  //     connectedUsers[socket.id] = userId;
  //     socket.join(groupId); // Join the socket room for the group
  //     console.log(`User ${connectedUsers[socket.id]} joined group ${groupId}`);

  //     // Fetch and send past messages for the joined group
  //     const messages = await Message.find({ groupId }).sort({ createdAt: 1 });
  //     socket.emit("receive-past-messages", messages);
  //   } catch (error) {
  //     console.error(error);
  //     socket.emit("error", "Error joining group");
  //   }
  // });

  // Handle incoming messages
  socket.on("send-message", async (content, groupId, username) => {
    console.log(content, groupId);
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
