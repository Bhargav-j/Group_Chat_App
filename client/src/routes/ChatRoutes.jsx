import { Routes, Route } from "react-router-dom";
import ChatContainer from "../components/Chat/ChatContainer";
import UserProfile from "../components/Chat/UserProfile";
import NotFound from "../components/NotFound";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUser } from "../redux/actions/authActions";
import { fetchGroups } from "../redux/actions/groupActions";
import useAuthState from "../hooks/useAuthState";
import useGroups from "../hooks/useGroups";

function ChatRoutes() {
  const dispatch = useDispatch();

  const userFromStore = useSelector((state) => state.user.currentUser);
  const groupsFromStore = useSelector((state) => state.groups.userGroups);

  const { loading, error, authUser } = useAuthState();
  const { Groupsloading, Groupserror, UserGroups } = useGroups();

  useEffect(() => {
    const checkUser = async () => {
      // setLoading(true);
      //  Check user in localStorage if not in store
      await dispatch(fetchUser());
    };
    const checkGroups = async () => {

      await dispatch(fetchGroups());
    };

    if (!userFromStore) {
      checkUser();
    }
    if (!groupsFromStore) {
      checkGroups();
    }
  }, [dispatch, userFromStore, groupsFromStore]);

  // console.log(userFromStore)

  return (
    <>
      {(loading || Groupsloading) && <p>Loading user information...</p>}
      {(error || Groupserror) && (
        <p>Error fetching user: {error ? error : Groupserror}</p>
      )}
      {authUser && UserGroups && (
        <Routes>
          <Route path="/" element={<ChatContainer />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  );
}

export default ChatRoutes;
