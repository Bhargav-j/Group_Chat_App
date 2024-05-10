import { createAsyncThunk} from "@reduxjs/toolkit";
import {login, logout, register, getUser} from "../../services/authService"; // Assuming authService handles API calls


// ** Async Thunks **
export const fetchUser = createAsyncThunk(
    "user/fetchUser",
    async () => {
      const response = await getUser();
      return response.data;
    }
  );

export const Register = createAsyncThunk(
  "user/register",
  async (userData) => {
    const response = await register(userData);
    return response.data;
  }
);

export const Login = createAsyncThunk(
  "user/login",
  async (credentials) => {
    const response = await login(credentials);
    return response.data;
  }
);

export const Logout = createAsyncThunk("user/logout", () => {
  logout();
});


