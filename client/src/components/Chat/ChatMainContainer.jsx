import { io } from "socket.io-client";
import GroupHeader from "../Headers/GroupHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { ChatContext } from "../../context/ChatContext";
import { useContext, useEffect, useRef } from "react";
import useGroups from "../../hooks/useGroups";
import { connect } from "react-redux";
import useAuthState from "../../hooks/useAuthState";
import {
  receiveLastSingleMessage,
  receiveMessage,
  sendMessage,
} from "../../redux/reducers/messageReducer";

const ChatMainContainer = ({ dispatch, messages }) => {
  // const dispatch = useDispatch()

  const { selectedGroupId } = useContext(ChatContext);

  const { UserGroups } = useGroups();
  const { authUser } = useAuthState();

  // console.log(Groupsloading, Groupserror, UserGroups)

  const SelectedGroup = UserGroups?.find(
    (group) => group._id === selectedGroupId
  );

  // console.log(SelectedGroup)
  const socketRef = useRef(null);

  // console.log(messages)

  useEffect(() => {
    const handleJoinGroup = async () => {
      try {
        // const response = await axios.post("/api/join-group", { groupId });
        // if (response.data.error) {
        //   console.error(response.data.error);
        //   // Handle error (e.g., display error message to user)
        // }
        // dispatch(fetchMessages(groupId)); // Fetch messages after joining

        const groupIds = UserGroups.map((eachGroup) => eachGroup._id);
        // console.log(groupIds)

        socketRef.current.emit("join-groups", groupIds, authUser._id);
      } catch (error) {
        console.error(error);
        // Handle errors (e.g., display error message to user)
      }
    };

    socketRef.current = io("http://localhost:3000"); // Replace with your server URL

    socketRef.current.on("connect", () => {
      console.log("Connected to socket server");
    });

    // console.log(selectedGroupId, authUser._id);

    handleJoinGroup();

    socketRef.current.on("receive-message", ([groupId, message]) => {
      dispatch(receiveMessage({ groupId, message }));
      dispatch(receiveLastSingleMessage({ group: groupId, message }));
    });

    socketRef.current.on("receive-lastSingle-messages", ([group, message]) => {
      dispatch(receiveLastSingleMessage({ group, message }));
    });

    socketRef.current.on("error", (error) => {
      console.error(error);
      // Handle errors (e.g., display error message to user)
    });

    // Cleanup function to disconnect socket on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      // dispatch(clearMessages()); // Clear messages on unmount
    };
  }, [dispatch, authUser, UserGroups]);

  const handleSendMessage = async (content) => {
    const newMessage = {
      content,
      groupId: selectedGroupId,
      likes: [],
      createdAt: new Date().toISOString(),
      senderId: { _id: authUser._id, username: authUser.user },
    };

    dispatch(sendMessage({ selectedGroupId, newMessage }));
    dispatch(
      receiveLastSingleMessage({ group: selectedGroupId, message: newMessage })
    );
    socketRef.current.emit(
      "send-message",
      content,
      selectedGroupId,
      authUser.user
    );
  };

  return (
    <main className="w-3/4 h-full flex flex-col">
      {selectedGroupId ? (
        <>
          <GroupHeader group={SelectedGroup} />

          {/* Chat messages */}
          <MessageList />

          {/* Messages Type Container */}
          <MessageInput handleSendMessage={handleSendMessage} />
        </>
      ) : (
        <div>No Chat Selected</div>
      )}
    </main>
  );
};

// export default ChatMainContainer;

const mapStateToProps = (state) => ({
  messages: state.messages.messages
});

// Connect your component to Redux and export it with a name
const ConnectedChatMainContainer = connect(mapStateToProps)(ChatMainContainer);
export default ConnectedChatMainContainer;
