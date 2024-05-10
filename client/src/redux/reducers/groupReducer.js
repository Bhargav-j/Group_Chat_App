import { createSlice } from "@reduxjs/toolkit";
import {
  fetchGroups,
  fetchGroupInfo,
  createGroup,
  updateGroupById,
  addUsersToGroup,
  removeMembersFromGroup,
  deleteGroupById,
} from "../actions/groupActions";

// [
//   {
//     name: "NewGroupOne",
//     _id: "66360efb80584937e7d83d0a",
//     isAdmin: true,
//     groupInfo: {
//       _id: "66360efb80584937e7d83d0a",
//       admin: {
//         _id: "663601f3cbb5469ac7e87b57",
//         username: "Bhargav Updated",
//       },
//       members: [
//         {
//           _id: "6636209cc40f888d516e5b2b",
//           username: "Raghu",
//         },
//         {
//           _id: "66362125c40f888d516e5b31",
//           username: "Pooja",
//         },
//       ],
//       created: "2024-05-04T10:33:31.589Z",
//     },
//   },
//   {
//     name: "RaghuGroup",
//     _id: "663b51fd01aa12b2d427ffed",
//     isAdmin: false,
//     groupInfo : {}
//   },
// ];

const initialState = {
  loading: false,
  error: null,
  userGroups: null,
};

// ** Slice **
const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setGroups(state, action) {
      state.userGroups = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.userGroups = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchGroupInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupInfo.fulfilled, (state, action) => {
        const foundIndex = state.userGroups.findIndex(
          (group) => group._id === action.payload._id
        );

        if (foundIndex !== -1) {
          state.userGroups[foundIndex].groupInfo = action.payload;
        }

        // state.userGroups.map((eachGroup) => {
        //   if (eachGroup._id === action.payload._id) {
        //     eachGroup.groupInfo = action.payload;
        //   }
        // });
        console.log(state.userGroups, "groups reducer");
        // state.userGroups = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchGroupInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.userGroups = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateGroupById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGroupById.fulfilled, (state, action) => {
        state.userGroups = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateGroupById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addUsersToGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUsersToGroup.fulfilled, (state, action) => {
        state.userGroups = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(addUsersToGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(removeMembersFromGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMembersFromGroup.fulfilled, (state, action) => {
        state.userGroups = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(removeMembersFromGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteGroupById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGroupById.fulfilled, (state, action) => {
        state.userGroups = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteGroupById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    //   .addCase(Login.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(Login.fulfilled, (state, action) => {
    //     const { accessToken, ...userData } = action.payload; // Access accessToken from response.data
    //     localStorage.setItem("user", JSON.stringify(accessToken));
    //     state.currentUser = userData; // Store user data in Redux (minus accessToken)
    //     state.loading = false;
    //     state.error = null;
    //     // state.currentUser = action.payload;
    //   })
    //   .addCase(Login.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message;
    //   })
  },
});

export const { setGroups } = groupsSlice.actions;
export default groupsSlice.reducer;
