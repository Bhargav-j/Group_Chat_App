import { useEffect, useRef, useState } from "react";
import avatar from "./../../images/Avatar.png";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FaPeopleGroup } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import useAuthState from "../../hooks/useAuthState";
import PopupContainer from "../common/PopupContainer";
import GroupCreate from "../Groups/GroupCreate";
import UserProfile from "../Chat/UserProfile";
import { useDispatch } from "react-redux";
import { Logout } from "../../redux/actions/authActions";
import { useNavigate } from "react-router-dom";

const UserHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { authUser } = useAuthState();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [PopupFor, setPopupFor] = useState("");

  const openPopup = (targetPopup) => {
    setIsPopupOpen(true);
    setPopupFor(targetPopup);
  };
  const closePopup = () => setIsPopupOpen(false);

  const [isUserProfileVisible, setIsUserProfileVisible] = useState(false);
  const profileContainerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        profileContainerRef.current &&
        !profileContainerRef.current.contains(e.target)
      ) {
        setIsUserProfileVisible(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const signOut = () => {
    dispatch(Logout());
    navigate("/login");
  };

  return (
    <div className="bg-gray-300 h-20 p-2 flex items-center justify-between relative">
      <div className="flex items-center">
        <div className="flex items-center justify-between">
          <img
            src={avatar}
            alt="User 1"
            className="w-8 h-8 rounded-full mr-2"
          />
        </div>
        {authUser.user}
      </div>
      {/* Create a new group */}
      <div className="cursor-pointer" onClick={() => openPopup("newGroup")}>
        <FaPeopleGroup
          size={28}
          data-tooltip-id="create-group"
          data-tooltip-content="Create New Group"
          data-tooltip-variant="info"
        />
        <Tooltip id="create-group" />
      </div>
      {/* Profile View */}
      <div className="relative cursor-pointer" ref={profileContainerRef}>
        <div
          onClick={() => setIsUserProfileVisible(!isUserProfileVisible)}
          data-tooltip-id="Profile Info & Logout"
          data-tooltip-content="Profile Info & Logout"
          data-tooltip-variant="info"
        >
          <IoEllipsisVerticalSharp size={22} />
          <Tooltip id="Profile Info & Logout" />
        </div>
        {/* popup container for user profile */}
        {isUserProfileVisible && (
          <div className="absolute w-[150px] top-0 right-4 bg-white px-2 py-1 rounded-md border-2 cursor-pointer">
            <div
              className="py-1 px-2 border-b-2 flex justify-between items-center text-lg hover:bg-yellow-300 rounded-md"
              onClick={() => {
                setIsUserProfileVisible(false);
                openPopup("profile");
              }}
            >
              <div>Profile</div>
              <CgProfile size={24} />
            </div>
            <div
              className="py-1 px-2 flex justify-between items-center text-lg hover:bg-red-300 rounded-md"
              onClick={signOut}
            >
              <div>Signout</div>
              <RiLogoutBoxRLine size={24} />
            </div>
          </div>
        )}
      </div>
      {/* Popup for creating New group  */}
      {isPopupOpen && (
        <PopupContainer onClose={closePopup}>
          {PopupFor === "newGroup" ? <GroupCreate onClose={closePopup}/> : <UserProfile />}
        </PopupContainer>
      )}
    </div>
  );
};

export default UserHeader;
