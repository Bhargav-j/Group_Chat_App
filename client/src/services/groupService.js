import axios from "axios";
import API_BASE_URL from "./api.config";

const API_URL = API_BASE_URL + "/groups";

export const CreateGroup = async (groupData) => {
  const accessToken = JSON.parse(localStorage.getItem("user"))
  const response = await axios.post(`${API_URL}/`, groupData, {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Include token in Authorization header
    },
  });
  //   if (response.data.accessToken) {
  //     localStorage.setItem("user", JSON.stringify(response.data));
  //   }
  return response;
};

export const getGroups = async () => {
  const accessToken = JSON.parse(localStorage.getItem("user"))
//   console.log(accessToken)
  const response = await axios.get(`${API_URL}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Include token in Authorization header
    },
  });
  return response;
};

export const getGroupInfo = async (groupId) => {
  const accessToken = JSON.parse(localStorage.getItem("user"))
//   console.log(accessToken)
  const response = await axios.get(`${API_URL}/${groupId}/info`, {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Include token in Authorization header
    },
  });
  return response;
};

export const GetGroupById = async (groupid) => {
  const accessToken = JSON.parse(localStorage.getItem("user"))
  const response = await axios.get(`${API_URL}/${groupid}/info`, {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Include token in Authorization header
    },
  });
  return response;
};

export const UpdateGroupById = async (groupid, updateData) => {
  const accessToken = JSON.parse(localStorage.getItem("user"))
  const response = await axios.put(`${API_URL}/${groupid}/`, updateData, {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Include token in Authorization header
    },
  });
  return response;
};

export const AddUsersToGroup = async (groupid, usersData) => {
  const accessToken = JSON.parse(localStorage.getItem("user"))
  const response = await axios.put(
    `${API_URL}/${groupid}/add-user`,
    usersData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include token in Authorization header
      },
    }
  );
  return response;
};

export const RemoveMembersFromGroup = async (groupid, membersData) => {
  const accessToken = JSON.parse(localStorage.getItem("user"))
  const response = await axios.put(
    `${API_URL}/${groupid}/remove-members`,
    membersData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include token in Authorization header
      },
    }
  );
  return response;
};

export const DeleteGroupById = async (groupid) => {
  const accessToken = JSON.parse(localStorage.getItem("user"))
  const response = await axios.delete(`${API_URL}/${groupid}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Include token in Authorization header
    },
  });
  return response;
};
