import axios from "axios";
import API_BASE_URL from "../../services/api.config";

const API_URL_Groups = API_BASE_URL + "/groups";

import PropTypes from "prop-types";
import { useContext, useEffect, useRef, useState } from "react";
import { MdOutlineModeEdit } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import groupImg from "../../images/Group.png";
import useAuthState from "../../hooks/useAuthState";
import { useDispatch } from "react-redux";
import { fetchGroupInfo, fetchGroups } from "../../redux/actions/groupActions";
import { FiLoader } from "react-icons/fi";
import { ChatContext } from "../../context/ChatContext";

const GroupInfo = ({ group }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [removingId, setRemovingId] = useState("");

  // console.log(group);

  const { authUser } = useAuthState();

  const { setSelectedGroupId } = useContext(ChatContext);

  const dispatch = useDispatch();

  // console.log(authUser);

  const [userEdit, setUserEdit] = useState(false);

  const [groupName, setGroupName] = useState(group.name);

  const editableDivRef = useRef(null);

  useEffect(() => {
    if (editableDivRef.current && userEdit) {
      editableDivRef.current.focus();
    }
  }, [userEdit]);

  // Update Group Name
  const updateGroupName = async () => {
    if (groupName !== group.name) {
      setLoading(true);
      try {
        const accessToken = JSON.parse(localStorage.getItem("user"));
        const response = await axios.put(
          `${API_URL_Groups}/${group._id}`,
          {
            name: groupName,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.statusText === "OK") {
          await dispatch(fetchGroups());
          await dispatch(fetchGroupInfo(group._id));
        } else {
          setError(new Error("Failed to update User Name"));
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Remove Members from Group if the user is Admin
  const removeGroupMembers = async (memberId) => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = JSON.parse(localStorage.getItem("user"));

      const response = await axios.put(
        `${API_URL_Groups}/${group._id}/remove-members`,
        {
          membersIds: [memberId], // An array of member IDs
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.statusText === "OK") {
        // console.log(response)
        await dispatch(fetchGroupInfo(group._id));
      } else {
        setError(new Error("Failed to edit group")); // Set generic error state
      }
    } catch (error) {
      setError(error.message); // Set error state for detailed logging/user feedback
    } finally {
      setLoading(false);
      setRemovingId("");
    }
  };

  // Edit the User Groups
  const exitGroup = async (isAdmin) => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("user"));
      let response;
      if (isAdmin) {
        response = await axios.delete(`${API_URL_Groups}/${group._id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        response = await axios.put(
          `${API_URL_Groups}/${group._id}/remove-members`,
          {
            membersIds: [authUser._id],
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }

      if (response.statusText === "OK") {
        await dispatch(fetchGroups());
        setSelectedGroupId(null);
      } else {
        setError(new Error("Failed to Remove group"));
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-[500px] h-[600px] bg-slate-400 overflow-y-auto no-scrollbar rounded-md flex flex-col p-5">
      <div className="flex-grow">
        {/* Image Display*/}
        <section>
          <div className="flex justify-center px-5">
            <div className="w-[150px]">
              <img src={groupImg} alt="Group" />
            </div>
          </div>

          <div className="font-bold text-xl text-center">Group Info</div>
        </section>
        {/* Group Name */}
        <section>
          <p className="px-4 py-2 text-lg">Group Name</p>
          <div className="flex justify-between items-center bg-white px-4 py-2 rounded-md">
            <input
              ref={editableDivRef}
              onChange={(e) => setGroupName(e.target.value)}
              className="text-xl font-semibold w-full outline-none"
              value={groupName}
            />
            <button
              onClick={() => {
                setUserEdit(!userEdit);
                updateGroupName();
              }}
            >
              {!userEdit ? (
                <MdOutlineModeEdit size={26} color="red" />
              ) : loading ? (
                <FiLoader size={26} />
              ) : (
                <TiTick size={26} color="green" />
              )}
            </button>
          </div>
        </section>
        {/* Admin */}
        <section>
          <p className="px-4 py-2 text-lg">Admin</p>
          <div className=" bg-green-300 px-4 py-2  rounded-md">
            <div className="text-xl font-semibold w-full">
              {group.groupInfo?.admin?.username}
            </div>
          </div>
        </section>
        {/* Members */}
        <section>
          <p className="px-4 py-2 text-lg">Members</p>
          <div className=" bg-white px-4 py-2 rounded-md mb-2">
            {/* members list */}
            {group.groupInfo?.members &&
              group.groupInfo?.members.map((eachMember) => (
                <div
                  key={eachMember._id}
                  className="font-semibold w-full border-b-4 py-2 flex not-last"
                >
                  <div className="flex-1 truncate pr-2">
                    {eachMember.username}
                  </div>
                  {group.groupInfo?.admin?._id == authUser._id && (
                    <div
                      className="bg-red-200 p-1 rounded-lg cursor-pointer"
                      onClick={() => removeGroupMembers(eachMember._id)}
                    >
                      {removingId === eachMember._id ? "Removing..." : "Remove"}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </section>
      </div>
      <div
        className="w-full bg-red-300 h-16 py-4 flex justify-center items-center font-bold text-xl cursor-pointer"
        onClick={exitGroup}
      >
        {group.groupInfo?.admin?._id === authUser._id
          ? "Delete Group"
          : "Exit Group"}
      </div>
      {error && <div>{Error}</div>}
    </main>
  );
};

export default GroupInfo;

GroupInfo.propTypes = {
  group: PropTypes.shape({
    name: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    grouoInfo: PropTypes.object,
  }).isRequired,
};
