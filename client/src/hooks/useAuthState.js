import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useAuthState = () => {
  // const dispatch = useDispatch();
  const userFromStore = useSelector((state) => state.user); // Access store inside effect
  // console.log(userFromStore)

  const [loading, setLoading] = useState(userFromStore.loading);
  const [error, setError] = useState(userFromStore.error);
  const [authUser, setauthUser] = useState(userFromStore.currentUser);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("user"));
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [authUser, setauthUser] = useState(null);

  // console.log(userFromStore)
  useEffect(() => {
    const checkUser = async () => {
      setLoading(userFromStore.loading);
      setError(userFromStore.error);
      setauthUser(userFromStore.currentUser)
      setAccessToken(localStorage.getItem("user"))
    };
    checkUser();
  }, [userFromStore]);

  return { loading, error, authUser, accessToken };
};

export default useAuthState;
