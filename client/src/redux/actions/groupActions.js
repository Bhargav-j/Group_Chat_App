import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  UpdateGroupById,
  AddUsersToGroup,
  RemoveMembersFromGroup,
  DeleteGroupById,
  CreateGroup,
  getGroups,
  getGroupInfo,
} from "../../services/groupService"; // Assuming authService handles API calls

// ** Async Thunks **
export const fetchGroups = createAsyncThunk("group/fetchgroups", async () => {
  const response = await getGroups();
  return response.data;
});

export const fetchGroupInfo = createAsyncThunk("group/fetchgroupinfo", async (groupId) => {
  const response = await getGroupInfo(groupId);
  return response.data;
});

export const createGroup = createAsyncThunk(
  "group/creategroup",
  async (groupData) => {
    const response = await CreateGroup(groupData);
    return response.data;
  }
);

// export const getGroupById = createAsyncThunk(
//   "group/getgroupbyId",
//   async (groupid) => {
//     const response = await GetGroupById(groupid);
//     return response.data;
//   }
// );

export const updateGroupById = createAsyncThunk(
  "group/updategroupbyId",
  async (groupid, updateData) => {
    const response = await UpdateGroupById(groupid, updateData);
    return response.data;
  }
);

export const addUsersToGroup = createAsyncThunk(
  "group/adduserstogroup",
  async (groupid, usersData) => {
    const response = await AddUsersToGroup(groupid, usersData);
    return response.data;
  }
);

export const removeMembersFromGroup = createAsyncThunk(
  "group/removemembersfromgroup",
  async (groupid, membersData) => {
    const response = await RemoveMembersFromGroup(groupid, membersData);
    return response.data;
  }
);

export const deleteGroupById = createAsyncThunk(
  "group/deletegroupbyId",
  async (groupid) => {
    const response = await DeleteGroupById(groupid);
    return response.data;
  }
);
