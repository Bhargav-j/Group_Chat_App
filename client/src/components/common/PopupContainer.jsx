import { useState } from "react";
import ReactDOM from "react-dom";

const PopupContainer = ({ children, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  return ReactDOM.createPortal(
    isOpen && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75"
        onClick={handleOverlayClick}
      >
        <div className="bg-white rounded-lg shadow-md">
          {children}
        </div>
      </div>
    ),
    document.getElementById("popup-root") // Mount to a dedicated element
  );
};

export default PopupContainer;
