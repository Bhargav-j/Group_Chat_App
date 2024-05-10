import { createSlice } from "@reduxjs/toolkit";
import { fetchMessages } from "../actions/messageActions";

// const initialState = {
//   messages: {latest : [{groupID : {message Object with content property one for each group}}], groupID : [Array of Message Objects in that group]},
//   loading: false,
//   error: null,
// };

const initialState = {
  messages: { latest: {}, notUploaded: {} },
  loading: false,
  error: null,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    receiveLastSingleMessage(state, action) {
      if (action.payload) {
        // state.messages.latest.push(action.payload);
        const { group, message } = action.payload;
        const updatedMessages = { ...state.messages };
        const latestMessages = updatedMessages.latest;
        latestMessages[group] = message;
        updatedMessages.latest = latestMessages;
        state.messages = updatedMessages;
      }
    },
    sendMessage(state, action) {
      if (action.payload) {
        const { selectedGroupId: groupId, newMessage: message } = action.payload;

        const updatedMessages = { ...state.messages };

        // Update the Fetched Messages array of that group
        updatedMessages[groupId].push(message); // Push new message to array
        state.messages = updatedMessages; // Update state with the modified object

        // For later use: Save into seperate object inside messages to seperate it from notuploaded.
        // const updatedMessages = { ...state.messages };
        // const notUploadedMessages = updatedMessages.notUploaded;
        // if (notUploadedMessages[group]) {
        //   notUploadedMessages[group].push(message);
        // } else {
        //   notUploadedMessages[group] = [message];
        // }
        // updatedMessages.notUploaded = notUploadedMessages;
        // state.messages = updatedMessages;
      }
    },
    receiveMessage(state, action) {
      console.log(action.payload);
      const { groupId, message } = action.payload;
      const updatedMessages = { ...state.messages };

      // Update the Fetched Messages array of that group
      updatedMessages[groupId].push(message); // Push new message to array
      state.messages = updatedMessages; // Update state with the modified object
    },

    clearMessages(state) {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { groupId, messages } = action.payload;
        state.loading = false;
        state.error = null;

        const updatedMessages = { ...state.messages };

        // Delete the same message from notUploaded Object in message state
        // const notUploadedMessages = updatedMessages.notUploaded;
        // if (notUploadedMessages[groupId]) {
        //   notUploadedMessages[groupId].filter(
        //     (eachMessage) => eachMessage.content !== message.content
        //   );
        // }

        // updatedMessages.notUploaded = notUploadedMessages;

        updatedMessages[groupId] = messages; // Create new entry for the group
        state.messages = updatedMessages; // Update state with the modified object
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  receiveMessage,
  sendMessage,
  clearMessages,
  receiveLastSingleMessage,
} = messagesSlice.actions;
export default messagesSlice.reducer;
