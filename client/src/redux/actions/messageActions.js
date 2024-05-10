import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMessages } from "../../services/messageService";

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (groupId) => {
    const response = await getMessages(groupId);
    return response.data;
  }
);

// import {
//     sendMessage,
//     receiveMessage,
//     receivePastMessages,
//     clearMessages,
//     fetchMessages,
//   } from "../../redux/actions/messageActions"; // Import message actions
