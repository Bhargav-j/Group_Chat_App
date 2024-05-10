import { IoIosSearch } from "react-icons/io";
// import avatar from "./../../images/Avatar.png";
import useGroups from "../../hooks/useGroups";
import { useContext, useState } from "react";
import GroupTile from "./GroupTile";
import { ChatContext  } from "../../context/ChatContext";

const GroupsDisplay = () => {

  const { setSelectedGroupId } = useContext(ChatContext);

  // const dispatch = useDispatch();

  const { UserGroups } = useGroups();

  const [searchGroup, setSearchGroup] = useState("");

  // const handleGroupSelect = async (groupId) => {
  //   if (Object.keys(UserGroups.groupInfo).length === 0) {
  //     await dispatch(fetchGroupInfo(groupId));
  //   }
  // };

  return (
    <>
      {/* search Bar */}
      <div className="bg-gray-100 h-16 flex items-center px-3">
        <div className="p-2 flex items-center w-full rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
          <IoIosSearch size={28} className="mr-2" />

          <input
            className="h-full w-full outline-none text-gray-700 pr-2"
            type="text"
            id="search"
            value={searchGroup}
            onChange={(e) => setSearchGroup(e.target.value)}
            placeholder="Search group.."
          />
        </div>
      </div>
      {/* < Groups list */}
      <ul className="px-1 overflow-y-auto no-scrollbar">
        {UserGroups &&
          !searchGroup.trim().length &&
          UserGroups.map((eachGroup) => (
            <li
              key={eachGroup._id}
              className="p-2 cursor-pointer hover:bg-slate-200 border-b-2"
              onClick={() => setSelectedGroupId(eachGroup._id)}
            >
              <GroupTile eachGroup={eachGroup} />
            </li>
          ))}

        {/* Search Groups */}
        {UserGroups &&
          searchGroup.trim().length > 0 &&
          UserGroups.map((eachGroup) => {
            if (
              eachGroup.name
                .toLowerCase()
                .includes(searchGroup.trim().toLowerCase())
            ) {
              return (
                <li
                  key={eachGroup._id}
                  className="p-2 cursor-pointer hover:bg-slate-200 border-b-2"
                >
                  <GroupTile eachGroup={eachGroup} />
                </li>
              );
            } else {
              return "";
            }
          })}
      </ul>
    </>
  );
};

export default GroupsDisplay;
