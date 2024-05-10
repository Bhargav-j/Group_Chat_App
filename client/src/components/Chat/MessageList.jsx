import avatar from "./../../images/Avatar.png";
import { fetchMessages } from "../../redux/actions/messageActions"; // Import message actions
import { useContext, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { ChatContext } from "../../context/ChatContext";
import { formatDateTime } from "./MessageTime";

const MessageList = ({ messages, loading, userId }) => {
  const { selectedGroupId } = useContext(ChatContext);

  const dispatch = useDispatch();

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
      // Scroll to the bottom of the div on initial render and whenever content changes
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [messages, selectedGroupId]);

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
              <div key={eachMessage._id} className="flex justify-end mb-4">
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
              <div key={eachMessage._id} className="flex mb-4">
                <img
                  src={avatar}
                  alt="User 1"
                  className="w-6 h-6 rounded-full mr-2"
                />
                <div className="rounded-lg bg-gray-100 overflow-hidden">
                  <div className="m-0 bg-gray-200 rounded-t-lg px-2 py-1">
                    {eachMessage.senderId.username}
                  </div>
                  <div className="px-5 pb-2 flex flex-col">
                    <div className="truncate whitespace-normal pt-1">
                      {eachMessage.content}
                    </div>
                    <div className="flex justify-end text-xs font-semibold text-gray-400 pt-1">
                      {formatDateTime(eachMessage.createdAt)}
                    </div>
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
