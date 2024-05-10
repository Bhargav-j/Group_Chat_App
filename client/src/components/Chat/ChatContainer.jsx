// import ChatMainContainer from "./ChatMainContainer";
import ChatMainContainer from "./ChatMainContainer";
import ChatLeftContainer from "./ChatLeftContainer";
import { ChatProvider } from "../../context/ChatContext";

const ChatContainer = () => {
  return (
    <ChatProvider>
      <div className="flex h-screen">
        <ChatLeftContainer />
        <ChatMainContainer />
      </div>
    </ChatProvider>
  );
};

export default ChatContainer;
