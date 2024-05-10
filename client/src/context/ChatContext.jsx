import { createContext, useState, useEffect } from "react";
import useGroups from "../hooks/useGroups";
import { useDispatch } from "react-redux";
import { fetchGroupInfo } from "../redux/actions/groupActions";
import PropTypes from 'prop-types';

const ChatContext = createContext();

function ChatProvider({ children }) {
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [messages, setMessages] = useState([]); // Assuming an array of messages

  const { UserGroups } = useGroups();
  const dispatch = useDispatch();

  // Function to fetch messages for a specific group
  const fetchGroupMessages = async (groupId) => {
    // Implement your API call logic here to fetch messages for the groupId
    // Replace this with your actual API call and data processing
    const response = await fetch(/* your API endpoint */ +groupId);
    const fetchedMessages = await response.json();
    setMessages(fetchedMessages);
  };

  const fetchGroupDetails = async (groupId) => {

    const foundIndex = UserGroups.findIndex(
      (group) => group._id === groupId
    );

    if (Object.keys(UserGroups[foundIndex].groupInfo).length === 0) {
      await dispatch(fetchGroupInfo(groupId));
      // console.log(UserGroups)
    }
  };

  // console.log(UserGroups)
  // Effect to fetch messages when selectedGroupId changes
  useEffect(() => {
    if (selectedGroupId) {
      // console.log(selectedGroupId);
        // fetchGroupMessages(selectedGroupId);
      fetchGroupDetails(selectedGroupId);
    } else {
      setMessages([]); // Clear messages when no group is selected
    }
  }, [selectedGroupId]);

  const value = { selectedGroupId, setSelectedGroupId, messages };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export { ChatContext, ChatProvider };

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired, // Any React node
};
