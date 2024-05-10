import axios from "axios";
import API_BASE_URL from "./api.config";

const API_URL = API_BASE_URL + "/messages";

export const getMessages = async (groupID) => {
  const accessToken = JSON.parse(localStorage.getItem("user"));
  console.log(`${API_URL}/${groupID}/messages`)
  const response = await axios.get(`${API_URL}/${groupID}/messages`, {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Include token in Authorization header
    },
  });
  return response;
};
