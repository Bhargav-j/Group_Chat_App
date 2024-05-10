import { createSlice } from "@reduxjs/toolkit";
import { Register, Login, Logout, fetchUser } from "../actions/authActions";

const initialState = {
  loading: false,
  error: null,
  currentUser: null,
};

// ** Slice **
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // state.currentUser = action.payload;
      })
      .addCase(Register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        const { accessToken, ...userData } = action.payload; // Access accessToken from response.data
        localStorage.setItem("user", JSON.stringify(accessToken));
        state.currentUser = userData; // Store user data in Redux (minus accessToken)
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(Login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Login.fulfilled, (state, action) => {
        const { accessToken, ...userData } = action.payload; // Access accessToken from response.data
        localStorage.setItem("user", JSON.stringify(accessToken));
        state.currentUser = userData; // Store user data in Redux (minus accessToken)
        state.loading = false;
        state.error = null;
        // state.currentUser = action.payload;
      })
      .addCase(Login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(Logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Logout.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.error = null;
      })
      .addCase(Logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
