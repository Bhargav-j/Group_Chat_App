// const User = require("../models/User");
const User = require("../models/User.model");
const Group = require("../models/Group.model");

// // Create a new user
// exports.createUser = async (req, res) => {
//   try {
//     const newUser = new User(req.body);
//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    if (userId !== req.userId) {
      return res.status(404).json({ message: "Access Denied" });
    }
    const user = await User.findById(userId, "-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  const userId = req.userId;
  const updates = req.body;
  const allowedUpdates = ["username"];
  const isValidUpdate = Object.keys(updates).every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).json({ error: "Invalid update fields" });
  }
  try {
    if (userId !== req.userId) {
      return res.status(404).json({ message: "Access Denied" });
    }
    const user = await User.findByIdAndUpdate(userId, updates, { new: true }); // Return updated document
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove a user from a group
exports.removeUserFromGroup = async (req, res) => {
  const groupId = req.params.id;
  const userId = req.userId;

  try {
    if (userId !== req.userId) {
      return res.status(404).json({ message: "Access Denied" });
    }
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const memberIndex = group.members.indexOf(eachMember);
    if (memberIndex !== -1) {
      group.members.splice(memberIndex, 1);
    }

    await group.save();

    res.status(200).json({ message: "User removed from the group" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete a user by ID
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    if (userId !== req.userId) {
      return res.status(404).json({ message: "Access Denied" });
    }
    // 1. Delete the user document
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Find all groups where the user is a member
    const groups = await Group.find({ members: { $in: [userId] } });

    // 3. Update each group to remove the user ID from members
    const updatePromises = groups.map((group) => {
      const updatedMembers = group.members.filter(
        (memberId) => !memberId.equals(userId)
      );
      return Group.findByIdAndUpdate(group._id, {
        $set: { members: updatedMembers },
      });
    });

    // 4. Execute update operations concurrently (optional)
    await Promise.all(updatePromises);

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
