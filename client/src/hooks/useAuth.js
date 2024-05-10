import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/actions/authActions"; // Assuming UserActions is in the same directory

const useAuth = () => {
  const dispatch = useDispatch();
  const [isLoggedin, setIsLoggedin] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  const userFromStore = useSelector((state) => state.user); // Access store inside effect
  const accessTokenFromLocalStorage = localStorage.getItem("user");
  // console.log(userFromStore)
  useEffect(() => {
    if(userFromStore, accessTokenFromLocalStorage){
      setIsLoggedin(true)
    }
  }, [userFromStore, accessTokenFromLocalStorage]);

  return { isLoggedin};
  // return { loading, error };
};

//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // const userFromStore = useSelector((state) => state.user); // Access store inside effect
//   // console.log(userFromStore)
//   useEffect(() => {
//     const checkUser = async () => {
//       setLoading(userFromStore.loading);
//       setError(userFromStore.error);

//       const accessTokenFromLocalStorage = JSON.parse(
//         localStorage.getItem("user")
//       );

//       // Check user in store first
//       // if (userFromStore) {
//       //   try {
//       //     const response = dispatch(fetchUser(userFromStore.accessToken));
//       //     setCurrentUser(response);
//       //   } catch (error) {
//       //     setError(error.message);
//       //   } finally {
//       //     setLoading(false);
//       //   }
//       //   return;
//       // }

//       // Check user in localStorage if not in store
//       try {
//         await dispatch(fetchUser(accessTokenFromLocalStorage));
//       } catch (error) {
//         console.log(error.message)
//         setError(error.message);
//       } finally {
//         setLoading(userFromStore.loading);
//         setError(userFromStore.error);
//       }
//     };

//     if (!userFromStore.currentUser) {
//       checkUser();
//     }
//   }, [dispatch, userFromStore]);

//   return { loading, error };
// };

export default useAuth;
