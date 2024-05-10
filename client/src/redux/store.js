import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./userReducer"; // Assuming userReducer is in the same directory
import userReducer from "./reducers/authReducer";
import groupsReducer from "./reducers/groupReducer";
import messageReducer from "./reducers/messageReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    groups : groupsReducer,
    messages : messageReducer
  },
});

export default store;
