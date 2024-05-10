// const Group = require('../models/Group');
const Group = require("../models/Group.model");
const User = require("../models/User.model"); // Reference User model for member validation

// Create a new group
exports.createGroup = async (req, res) => {
  // const { name, createdBy } = req.body;
  const { name } = req.body;
  const createdBy = req.userId;
  try {
    const creator = await User.findById(createdBy);
    if (!creator) {
      return res.status(400).json({ error: "Invalid creator ID" });
    }
    const newGroup = new Group({ name, createdBy });
    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all groups belong to login user
exports.getGroups = async (req, res) => {
  // Retrieve logged-in user ID
  const userId = req.userId;

  try {
    // Separate queries for createdBy and members groups
    const [createdGroups, memberGroups] = await Promise.all([
      Group.find({ createdBy: userId }), // Find groups where user is createdBy
      Group.find({ members: { $in: [userId] } }), // Find groups where user is a member
    ]);

    // 4. Create isAdmin and member arrays outside the query
    const isAdmin = createdGroups.map((group) => ({
      name: group.name,
      _id: group._id,
      isAdmin : true,
      groupInfo : {}
    }));
    const member = memberGroups.map((group) => ({
      name: group.name,
      _id: group._id,
      isAdmin : false,
      groupInfo : {}
    }));
    // .filter((name, index, self) => self.indexOf(name) === index); // Remove duplicates

    const user = [
      ...isAdmin,
      ...member,
    ];
    // const user = {
    //   isAdmin,
    //   member,
    // };

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a single group by ID
exports.getGroupById = async (req, res) => {
  // Extract groupId from request parameters
  const groupId = req.params.id;

  try {
    // Use Group.findById to fetch the group document with populated createdBy
    const group = await Group.findById(groupId).populate([
      { path: "createdBy", select: "username" }, // Populate createdBy with only name
      {
        path: "members",
        select: "username", // Populate members with only name (assuming name field exists)
      },
    ]);
    // console.log(group);

    // 3. Check if group exists
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const response = {
      _id : group._id,
      admin: group.createdBy,
      members: group.members,
      created: group.createdAt,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a group by ID
exports.updateGroup = async (req, res) => {
  const groupId = req.params.id;
  const updates = req.body;
  const allowedUpdates = ["name"]; // Fields allowed for update
  const isValidUpdate = Object.keys(updates).every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).json({ error: "Invalid update fields" });
  }
  try {
    const group = await Group.findByIdAndUpdate(groupId, updates, {
      new: true,
    }); // Return updated document
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a group by ID
exports.deleteGroup = async (req, res) => {
  const groupId = req.params.id;
  const adminId = req.userId;
  try {
    // Check if group exists (optional)
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Verify admin privileges
    if (!group.createdBy.equals(adminId)) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You are not the admin of this group" });
    }

    //Delete the group
    const deletedGroup = await Group.findByIdAndDelete(groupId);

    if (!deletedGroup) {
      // Handle potential deletion failure (e.g., database error)
      return res.status(500).json({ message: "Failed to delete group" });
    }

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add a user's to a group (assuming user ID is provided in the body)
exports.addUserToGroup = async (req, res) => {
  const groupId = req.params.id;
  const userId = req.userId;
  const { userIds } = req.body; //{userIds : [userId1, userId2]}
  try {
    const isUserCreator = await Group.findOne({
      _id: groupId,
      createdBy: userId,
    });

    if (!isUserCreator) {
      return res.status(404).json({ message: "User is not the Admin" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    // const user = await User.findById(userId);
    // if (!user) {
    //   return res.status(400).json({ error: "Invalid user ID" });
    // }

    userIds.map((userId) => {
      if (!group.members.includes(userId)) {
        group.members.push(userId);
        // return res.status(400).json({ message: "User already in the group" });
      }
    });
    await group.save();
    res.status(200).json({ message: "Users added to the group" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove a user from a group (assuming user ID is provided in the body)
exports.removeUserFromGroup = async (req, res) => {
  const groupId = req.params.id;
  const userId = req.userId;
  const { membersIds } = req.body; //{memberIds : [memberId1, memberId2]}

  try {
    const isUserCreator = await Group.findOne({
      _id: groupId,
      createdBy: userId,
    });

    if (!isUserCreator && userId !== membersIds[0]) {
      return res.status(404).json({ message: "User is not the Admin" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    membersIds.map((eachMember) => {
      const memberIndex = group.members.indexOf(eachMember);
      if (memberIndex !== -1) {
        group.members.splice(memberIndex, 1);
      }
    });
    await group.save();
    res.status(200).json({ message: "User removed from the group" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
