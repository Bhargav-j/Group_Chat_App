import { RiGroup3Fill } from "react-icons/ri";
import { HiUserGroup } from "react-icons/hi2";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import avatar from "./../../images/Avatar.png";
import { MdGroupAdd } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import PopupContainer from "../common/PopupContainer";
import GroupInfo from "../Groups/GroupInfo";
import PropTypes from "prop-types";
import AddGroupMembers from "../Groups/AddGroupMembers";
import useAuthState from "../../hooks/useAuthState";

const GroupHeader = ({ group }) => {
  const { authUser } = useAuthState();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [PopupFor, setPopupFor] = useState("");

  const openPopup = (targetPopup) => {
    setIsPopupOpen(true);
    setPopupFor(targetPopup);
  };
  const closePopup = () => setIsPopupOpen(false);

  const [isGroupInfoVisible, setIsGroupInfoVisible] = useState(false);
  const profileContainerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        profileContainerRef.current &&
        !profileContainerRef.current.contains(e.target)
      ) {
        setIsGroupInfoVisible(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      {/* CHat Header */}
      <div className="bg-gray-300 h-20 p-4 flex items-center justify-between">
        {/* Group Info */}
        <div className="flex items-center">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full mr-2 flex justify-center items-center bg-green-600 font-bold">
              {group.name.toUpperCase().slice(0, 2)}
            </div>
            {/* <img
              src={avatar}
              alt="User 1"
              className="w-8 h-8 rounded-full mr-2"
            /> */}
          </div>
          <p className="text-xl font-semibold">{group.name}</p>
        </div>

        <div className="flex flex-shrink-0 items-center">
          {/* Create a new group */}
          {group.groupInfo?.admin?._id === authUser._id && (
            <div
              className="cursor-pointer pr-7"
              onClick={() => openPopup("addMembers")}
            >
              <MdGroupAdd
                size={28}
                data-tooltip-id="create-group"
                data-tooltip-content="Add users to Group"
                data-tooltip-variant="info"
              />
              <Tooltip id="create-group" />
            </div>
          )}

          {/* Opions icon for Group */}
          {/* Profile View */}
          <div className="relative cursor-pointer" ref={profileContainerRef}>
            <div
              onClick={() => setIsGroupInfoVisible(!isGroupInfoVisible)}
              data-tooltip-id="Group Info"
              data-tooltip-content="Group Info"
              data-tooltip-variant="info"
            >
              <IoEllipsisVerticalSharp size={22} />
              <Tooltip id="Group Info" />
            </div>
            {/* popup container for user profile */}
            {isGroupInfoVisible && (
              <div className="absolute w-[200px] top-0 right-4 bg-white px-2 py-1 rounded-md border-2 cursor-pointer">
                <div
                  className="py-1 px-2 border-b-2 flex justify-between items-center text-lg hover:bg-yellow-300 rounded-md"
                  onClick={() => {
                    setIsGroupInfoVisible(false);
                    openPopup("");
                  }}
                >
                  <div>Group Info</div>
                  <HiUserGroup size={24} />
                </div>
                <div
                  className="py-1 px-2 flex justify-between items-center text-lg hover:bg-red-300 rounded-md"
                  // onClick={signOut}
                >
                  <div>Exit Group</div>
                  <RiGroup3Fill size={24} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Popup for creating New group  */}
        {isPopupOpen && (
          <PopupContainer onClose={closePopup}>
            {PopupFor === "addMembers" ? (
              <AddGroupMembers onClose={closePopup} group={group}/>
            ) : (
              <GroupInfo group={group} />
            )}
          </PopupContainer>
        )}
      </div>
    </>
  );
};

export default GroupHeader;

// GroupHeader.propTypes = {
//   groupName: PropTypes.string.isRequired,
// };

GroupHeader.propTypes = {
  group: PropTypes.shape({
    name: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  }).isRequired,
};
