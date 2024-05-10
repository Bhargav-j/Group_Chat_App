import axios from "axios";
import API_BASE_URL from "../../services/api.config";

const API_URL_Users = API_BASE_URL + "/users";
const API_URL_Groups = API_BASE_URL + "/groups";

import { useEffect, useRef, useState } from "react";
import { MdOutlineModeEdit } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { FiLoader } from "react-icons/fi";
import useAuthState from "../../hooks/useAuthState";
import useGroups from "../../hooks/useGroups";
import { fetchGroups } from "../../redux/actions/groupActions";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../redux/actions/authActions";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { authUser } = useAuthState();
  const { UserGroups } = useGroups();

  const [userEdit, setUserEdit] = useState(false);
  const [userName, setUserName] = useState(authUser.user);
  const [editUserName, setEditUserName] = useState(false);

  const [editGrouploading, setEditGroupLoading] = useState(false);
  const [editGroupError, setEditGroupError] = useState(null);
  const [editGroupid, setEditGroupid] = useState(null);

  const editableDivRef = useRef(null);

  const handleInput = (e) => {
    setUserName(e.target.value);
    // console.log(userName);
  };

  useEffect(() => {
    if (editableDivRef.current && userEdit) {
      editableDivRef.current.focus();
    }
  }, [userEdit]);

  // Update the User Name
  const updateUserName = async () => {
    if (userName !== authUser.user) {
      try {
        const accessToken = JSON.parse(localStorage.getItem("user"));
        const response = await axios.put(
          `${API_URL_Users}/update-user`,
          {
            username: userName,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.statusText === "OK") {
          await dispatch(fetchUser());
        } else {
          setEditGroupError(new Error("Failed to update User Name"));
        }
      } catch (error) {
        setEditGroupError(error);
      } finally {
        setEditUserName(false);
        setUserEdit(false);
        setEditGroupError(null);
      }
    }
  };

  // Edit the User Groups
  const editGroup = async (groupId, isAdmin) => {
    setEditGroupLoading(true);
    setEditGroupError(null);
    setEditGroupid(groupId);

    try {
      const accessToken = JSON.parse(localStorage.getItem("user"));

      let response;
      if (isAdmin) {
        response = await axios.delete(`${API_URL_Groups}/${groupId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        response = await axios.put(
          `${API_URL_Groups}/${groupId}/remove-members`,
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
        setEditGroupLoading(false);
      } else {
        setEditGroupError(new Error("Failed to edit group")); // Set generic error state
      }
    } catch (error) {
      setEditGroupError(error.message); // Set error state for detailed logging/user feedback
    } finally {
      setEditGroupLoading(false);
      setEditGroupid(null);
    }
  };

  return (
    <main className="w-[500px] h-[600px] bg-slate-400 overflow-y-auto no-scrollbar rounded-md px-5 pb-4">
      {/* Icon */}
      <div className="flex justify-center p-5 mb-5">
        <div className="text-center w-32 h-32 rounded-full bg-white flex justify-center items-center text-7xl">
          {authUser.user.toUpperCase().slice(0, 2)}
        </div>
      </div>
      {/* userName */}
      <section>
        <p className="px-4 py-2 text-lg">User Name</p>
        <div className="flex justify-between items-center bg-white px-4 py-2 rounded-md">
          <input
            type="text"
            value={userName}
            onChange={handleInput}
            ref={editableDivRef}
            className="text-xl font-semibold w-full outline-none"
            disabled={!userEdit}
          />
          {/* <div
            contentEditable={userEdit}
            ref={editableDivRef}
            onChange={handleInput}
            className="text-xl font-semibold w-full outline-none"
          >
            {userName}
          </div> */}
          <button
            onClick={() => {
              setUserEdit(!userEdit);
              updateUserName();
            }}
          >
            {!userEdit ? (
              <MdOutlineModeEdit size={26} color="red" />
            ) : !editUserName ? (
              <TiTick size={26} color="green" />
            ) : (
              <FiLoader size={26} />
            )}
          </button>
        </div>
      </section>
      {/* Email */}
      <section>
        <p className="px-4 py-2 text-lg">Email</p>
        <div className=" bg-white px-4 py-2  rounded-md">
          <div className="text-xl font-semibold w-full">{authUser.email}</div>
        </div>
      </section>
      {/* Groups */}
      <section>
        <p className="px-4 py-2 text-lg">Groups</p>
        <div className=" bg-white px-4 py-2 rounded-md">
          {UserGroups &&
            UserGroups.map((eachGroup) => (
              <div
                key={eachGroup._id}
                className="font-semibold w-full border-b-4 py-2 flex not-last"
              >
                <div className="flex-1 truncate pr-2">{eachGroup.name}</div>
                <div className="flex flex-1 justify-between">
                  <div
                    className={` p-1 rounded-lg ${
                      eachGroup.isAdmin ? "bg-green-200" : "bg-yellow-200"
                    }`}
                  >
                    {eachGroup.isAdmin ? "Admin" : "member"}
                  </div>
                  <div
                    className="text-red-500 cursor-pointer"
                    onClick={() => editGroup(eachGroup._id, eachGroup.isAdmin)}
                  >
                    {editGrouploading && editGroupid === eachGroup._id
                      ? "Please Wait..."
                      : eachGroup.isAdmin
                      ? "Delete Group"
                      : "Exit group"}
                  </div>
                </div>
              </div>
            ))}
        </div>
        {editGroupError && <div>{editGroupError}</div>}
      </section>
    </main>
  );
};

export default UserProfile;
