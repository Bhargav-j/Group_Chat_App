import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useGroups = () => {
  // const dispatch = useDispatch();
  const [Groupsloading, setGroupsLoading] = useState(false);
  const [Groupserror, setGroupsError] = useState(null);
  const [UserGroups, setUserGroups] = useState(null);

  const GroupsFromStore = useSelector((state) => state.groups); // Access store inside effect
  // console.log(userFromStore)
  useEffect(() => {
    const checkUser = async () => {
        setGroupsLoading(GroupsFromStore.loading);
        setGroupsError(GroupsFromStore.error);
        setUserGroups(GroupsFromStore.userGroups)
    };
    checkUser();
  }, [GroupsFromStore]);

  // console.log(UserGroups)

  return { Groupsloading, Groupserror, UserGroups };
};

export default useGroups;
