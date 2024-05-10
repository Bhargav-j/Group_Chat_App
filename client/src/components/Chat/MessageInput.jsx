import { useRef, useState } from "react";

const MessageInput = ({ handleSendMessage }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSend = () => {
    handleSendMessage(message);
    setMessage("");
  };

  return (
    <div className="flex items-center p-2 rounded-lg shadow-sm">
      <textarea
        ref={textareaRef}
        className="flex-grow border-2 focus:ring-2 focus:ring-indigo-500 resize-none overflow-y-auto p-2 rounded-lg text-sm bg-transparent no-scrollbar"
        placeholder="Type your message..."
        value={message}
        onChange={handleInputChange}
        // onInput={handleResize}
      />
      <button
        className="ml-2 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        disabled={!message.trim()}
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
