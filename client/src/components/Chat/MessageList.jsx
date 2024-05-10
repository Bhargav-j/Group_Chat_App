import avatar from "./../../images/Avatar.png";
import { fetchMessages } from "../../redux/actions/messageActions"; // Import message actions
import { useContext, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { ChatContext } from "../../context/ChatContext";
import { formatDateTime } from "./MessageTime";
import { FcLike } from "react-icons/fc";
import { AiFillLike } from "react-icons/ai";
// import { likeMessage } from "../../redux/reducers/messageReducer";

const MessageList = ({
  dispatch,
  messages,
  loading,
  userId,
  handleLikeMessage,
}) => {
  const { selectedGroupId } = useContext(ChatContext);

  const [groupMessages, setGroupMessages] = useState([]);

  // Div Always scroll to bottom
  const scrollRef = useRef(null);

  useEffect(() => {
    const getMessages = async () => {
      await dispatch(fetchMessages(selectedGroupId)); // Fetch messages after joining
    };
    getMessages();
  }, [selectedGroupId, dispatch]);

  useEffect(() => {
    setGroupMessages([]);
    if (messages[selectedGroupId]) {
      setGroupMessages(messages[selectedGroupId]);
    }
  }, [messages, selectedGroupId]);

  useEffect(() => {
    // Scroll to the bottom of the div on initial render
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const manageLikes = (groupId, messageContent) => {
    // dispatch(likeMessage({ groupId, messageContent, userId }));
    handleLikeMessage(groupId, messageContent, userId);
  };

  if (loading && groupMessages.length === 0) {
    return <div>Messages Loading</div>;
  }

  return (
    <div className="flex-grow m-4 overflow-y-auto no-scrollbar" ref={scrollRef}>
      {groupMessages.length > 0 ? (
        groupMessages.map((eachMessage) => {
          if (userId === eachMessage.senderId["_id"]) {
            return (
              /* Self Message */
              <div
                key={eachMessage._id}
                className="flex justify-end mb-4 w-full "
              >
                {/* How many Likes */}
                <div className="flex flex-col justify-end">
                  {eachMessage.likes.length > 0 && (
                    <div className="mr-4 mt-2 mb-6 text-xs font-semibold text-gray-400 flex relative">
                      <FcLike size={26} />
                      <p className="bg-black rounded-full w-4 h-4 flex justify-center items-center absolute -right-2">
                        {eachMessage.likes.length}
                      </p>
                    </div>
                  )}
                  <div
                    className="mr-4 mb-2 text-xs font-semibold text-gray-400 flex relative cursor-pointer"
                    onClick={() =>
                      manageLikes(eachMessage.groupId, eachMessage.content)
                    }
                  >
                    {eachMessage.likes?.includes(userId) ? (
                      <AiFillLike size={26} color="green" />
                    ) : (
                      <AiFillLike size={26} />
                    )}
                  </div>
                </div>
                {/* Message Content */}
                <div className="rounded-lg bg-gray-100 overflow-hidden">
                  <div className="m-0 bg-gray-200 rounded-t-lg px-2 py-1 text-right">
                    {eachMessage.senderId.username}
                  </div>
                  <div className="px-5 pb-2 flex flex-col pt-1">
                    <div className="truncate whitespace-normal">
                      {eachMessage.content}
                    </div>
                    <div className="flex justify-end text-xs font-semibold text-gray-400 pt-2">
                      {formatDateTime(eachMessage.createdAt)}
                    </div>
                  </div>
                </div>
                <img
                  src={avatar}
                  alt="User 1"
                  className="w-6 h-6 rounded-full mr-2"
                />
              </div>
            );
          } else {
            return (
              /* other members messages */
              <div key={eachMessage._id} className="flex mb-4 w-full ">
                <img
                  src={avatar}
                  alt="User 1"
                  className="w-6 h-6 rounded-full mr-2"
                />
                <div className="rounded-lg bg-gray-100 overflow-hidden">
                  <div className="m-0 bg-gray-200 rounded-t-lg px-2 py-1">
                    {eachMessage.senderId.username}
                  </div>
                  <div className="px-5 pb-2 flex flex-col pt-1">
                    <div className="truncate whitespace-normal pt-1">
                      {eachMessage.content}
                    </div>
                    <div className="flex justify-end text-xs font-semibold text-gray-400 pt-1">
                      {formatDateTime(eachMessage.createdAt)}
                    </div>
                  </div>
                </div>
                {/* How many Likes */}
                <div className="flex flex-col justify-end">
                  {eachMessage.likes.length > 0 && (
                    <div className="ml-4 mt-2 mb-6 text-xs font-semibold text-gray-400 flex relative">
                      <FcLike size={26} />
                      <p className="bg-black rounded-full w-4 h-4 flex justify-center items-center absolute -right-2">
                        {eachMessage.likes.length}
                      </p>
                    </div>
                  )}
                  <div
                    className="ml-4 mb-2 text-xs font-semibold text-gray-400 flex relative"
                    onClick={() =>
                      manageLikes(eachMessage.groupId, eachMessage.content)
                    }
                  >
                    {eachMessage.likes?.includes(userId) ? (
                      <AiFillLike size={26} color="green" />
                    ) : (
                      <AiFillLike size={26} />
                    )}
                  </div>
                </div>
              </div>
            );
          }
        })
      ) : (
        <div>No Messages</div>
      )}
    </div>
  );
};

// export default MessageList;

const mapStateToProps = (state) => ({
  messages: state.messages.messages,
  loading: state.messages.loading,
  error: state.messages.error,
  userId: state.user.currentUser._id,
});

// Connect your component to Redux and export it with a name
const ConnectedMessageList = connect(mapStateToProps)(MessageList);
export default ConnectedMessageList;
