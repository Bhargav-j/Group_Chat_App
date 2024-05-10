import axios from "axios";
import API_BASE_URL from "../../services/api.config";
import PropTypes from "prop-types";

const API_URL_Users = API_BASE_URL + "/users";
const API_URL_Groups = API_BASE_URL + "/groups";

import { useEffect, useState } from "react";
import Newgroup from "../../images/Newgroup.png";
import { IoIosSearch } from "react-icons/io";
import { useDispatch } from "react-redux";
import { fetchGroups } from "../../redux/actions/groupActions";
import useAuthState from "../../hooks/useAuthState";

const GroupCreate = ({ onClose }) => {
  const dispatch = useDispatch();

  const { authUser } = useAuthState();

  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [groupName, setGroupName] = useState("");

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [searchUsers, setSearchUsers] = useState("");

  // const [userName, setUserName] = useState("test");
  // const [email, setEmail] = useState("test@gmail.com");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const accessToken = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get(`${API_URL_Users}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // console.log(response)

        if (response.data) {
          const allUsersData = response.data.filter(
            (each) => each.username !== authUser.user
          );
          setAllUsers(allUsersData);
        } else {
          setError(new Error("Failed to fetch users"));
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authUser]);

  const addUserstoGroup = (id) => {
    let newSelectedUsers;
    if (selectedUsers.includes(id)) {
      newSelectedUsers = selectedUsers.filter((item) => item !== id);
    } else {
      newSelectedUsers = [...selectedUsers, id];
    }
    setSelectedUsers(newSelectedUsers);
  };

  // Create New Group API call
  const createNewGroup = async () => {
    setUploadLoading(true);
    setUploadError(null);

    try {
      const accessToken = JSON.parse(localStorage.getItem("user"));

      // Create Group
      const groupResponse = await axios.post(
        `${API_URL_Groups}/`,
        {
          name: groupName,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const groupId = groupResponse.data._id;

      // Add Users to Group
      const addUserResponse = await axios.put(
        `${API_URL_Groups}/${groupId}/add-user`,
        {
          userIds: selectedUsers,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (addUserResponse.data) {
        await dispatch(fetchGroups());
      } else {
        console.error("Failed to add users to group:", addUserResponse);
      }
    } catch (error) {
      console.error("Error creating group:", error);
      setUploadError(new Error("Failed to create group"));
    } finally {
      setUploadLoading(false);
      if (!uploadError) {
        onClose();
      }
    }
  };

  return (
    <main className="w-[500px] h-[600px] bg-slate-400 overflow-y-scroll no-scrollbar rounded-md flex flex-col p-5">
      {/* Image Display*/}
      <section>
        <div className="flex justify-center px-5">
          <div className="w-[150px]">
            <img src={Newgroup} alt="Group" />
          </div>
        </div>

        <div className="font-bold text-lg text-center">Create New Group</div>
      </section>
      {/* Group name */}
      <section>
        <p className="px-4 py-2 text-lg ">Group name</p>
        <div className="flex justify-between items-center bg-white px-4 py-2 rounded-md text-lg font-semibold">
          <input
            type="text"
            className="w-full outline-none"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
      </section>
      {/* Add Members to Group */}
      <section>
        <p className="px-4 py-2 text-lg">Add Members</p>
        {/* Search the users */}
        <div className="bg-gray-100 h-16 flex items-center px-3 mb-3">
          <div className="p-2 flex items-center w-full rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
            <IoIosSearch size={28} className="mr-2" />
            <input
              className="h-full w-full outline-none text-gray-700 pr-2"
              type="text"
              id="search"
              placeholder="Search Users"
              value={searchUsers}
              onChange={(e) => setSearchUsers(e.target.value)}
            />
          </div>
        </div>
        {/* All users display */}
        <div className=" bg-white px-4 py-2 rounded-md mb-3">
          {loading && "Loading all the users"}
          {error && "Error in Fetching Users"}
          {allUsers &&
            searchUsers.trim().length === 0 &&
            allUsers.map((eachUser) => (
              <div
                key={eachUser._id}
                className="font-semibold w-full border-b-4 py-2 flex not-last"
              >
                <div className="flex-1 truncate pr-2">{eachUser.username}</div>
                <div
                  className={`cursor-pointer px-4 py-1 rounded-lg ${
                    selectedUsers.includes(eachUser._id)
                      ? "bg-green-200"
                      : "bg-blue-200"
                  }`}
                  onClick={() => addUserstoGroup(eachUser._id)}
                >
                  Add
                </div>
              </div>
            ))}

          {/* Show Search Users */}
          {allUsers &&
            searchUsers.trim().length > 0 &&
            allUsers.map((eachUser) => {
              if (
                eachUser.username
                  .toLowerCase()
                  .includes(searchUsers.trim().toLowerCase())
              ) {
                return (
                  <div
                    key={eachUser._id}
                    className="font-semibold w-full border-b-4 py-2 flex not-last"
                  >
                    <div className="flex-1 truncate pr-2">
                      {eachUser.username}
                    </div>
                    <div
                      className={`cursor-pointer px-4 py-1 rounded-lg ${
                        selectedUsers.includes(eachUser._id)
                          ? "bg-green-200"
                          : "bg-blue-200"
                      }`}
                      onClick={() => addUserstoGroup(eachUser._id)}
                    >
                      Add
                    </div>
                  </div>
                );
              } else {
                return "";
              }
            })}
        </div>
      </section>
      <button
        className="w-full bg-green-300 h-16 py-4 flex justify-center items-center font-bold text-xl cursor-pointer disabled:bg-slate-300 disabled:cursor-default"
        onClick={createNewGroup}
        disabled={groupName.trim().length === 0 || uploadLoading}
      >
        {uploadLoading ? "CreatingGroup..." : "Create Group"}
      </button>
      {uploadLoading && <div>Creating New Group</div>}
      {uploadError && <div>uploadError</div>}
    </main>
  );
};

export default GroupCreate;

GroupCreate.propTypes = {
  onClose: PropTypes.func,
};
