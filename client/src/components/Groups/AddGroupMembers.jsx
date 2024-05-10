import axios from "axios";
import API_BASE_URL from "../../services/api.config";
import PropTypes from "prop-types";

const API_URL_Users = API_BASE_URL + "/users";
const API_URL_Groups = API_BASE_URL + "/groups";

import { useEffect, useState } from "react";
import Newgroup from "../../images/Add Users.png";
import { IoIosSearch } from "react-icons/io";
import { useDispatch } from "react-redux";
import { fetchGroupInfo } from "../../redux/actions/groupActions";
import useAuthState from "../../hooks/useAuthState";

const AddGroupMembers = ({ onClose, group }) => {
  const dispatch = useDispatch();

  const { authUser } = useAuthState();

  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

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
          const oldUsersIds = group.groupInfo?.members.map((user) => user._id);
          // console.log(oldUsersIds)

          const allUsersData = response.data.filter(
            (each) =>
              each._id !== authUser._id && !oldUsersIds.includes(each._id)
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
  const uploadUserstoGroup = async () => {
    setUploadLoading(true);
    setUploadError(null);

    try {
      const accessToken = JSON.parse(localStorage.getItem("user"));

      // Add Users to Group
      const addUserResponse = await axios.put(
        `${API_URL_Groups}/${group._id}/add-user`,
        {
          userIds: selectedUsers,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (addUserResponse.statusText === "OK") {
        await dispatch(fetchGroupInfo(group._id));
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
      <div className="flex-grow">
        <section>
          <div className="flex justify-center px-5">
            <div className="w-[150px]">
              <img src={Newgroup} alt="Group" />
            </div>
          </div>

          <div className="font-bold text-center text-xl">Add New Users</div>
        </section>
        {/* Add Members to Group */}
        <section>
          {/* Search the users */}
          <div className="bg-gray-100 h-16 flex items-center px-3 my-3">
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
      </div>
      <button
        className="w-full bg-green-300 h-16 py-4 flex justify-center items-center font-bold text-xl cursor-pointer disabled:bg-slate-300 disabled:cursor-default"
        onClick={uploadUserstoGroup}
        disabled={selectedUsers.length === 0 || uploadLoading}
      >
        {uploadLoading ? "Adding Users..." : "Add Users"}
      </button>
      {uploadLoading && <div>Adding New Users</div>}
      {uploadError && <div>uploadError</div>}
    </main>
  );
};

export default AddGroupMembers;

AddGroupMembers.propTypes = {
  onClose: PropTypes.func,
  group: PropTypes.shape({
    name: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  }).isRequired,
};
