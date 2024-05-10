import axios from "axios";
import API_BASE_URL from "./api.config";

const API_URL = API_BASE_URL + "/Auth"; // Assuming your backend API endpoint for authentication

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  //   if (response.data.accessToken) {
  //     localStorage.setItem("user", JSON.stringify(response.data));
  //   }
  return response;
};

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  //   if (response.data.accessToken) {
  //     localStorage.setItem("user", JSON.stringify(response.data.accessToken));
  //   }

  //   response.data.delete("accessToken")

  return response;
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getUser = async () => {
  const accessToken = JSON.parse(localStorage.getItem("user"));
  const response = await axios.get(`${API_URL}/fetchUser`, {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Include token in Authorization header
    },
  });
  return response;
};

// export default {
//   register,
//   login,
//   logout,
//   getCurrentUser,
// };
