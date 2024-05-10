import { useState } from "react";
import { Login } from "../../redux/actions/authActions"; // Assuming UserActions is in the same directory
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useAuthState from "../../hooks/useAuthState";

const LoginForm = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading, error } = useAuthState();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state for toggling password visibility
  const [inputError, setInputError] = useState("");

  const validateEmail = (email) => {
    // Basic email validation (you can use a library like validator.js for more robust validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // const validatePassword = (password) => {
  //   // Password validation: at least 6 characters, containing at least one digit and one letter
  //   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  //   return passwordRegex.test(password);
  // };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setInputError("Invalid email address");
      return;
    }

    // if (!validatePassword(password)) {
    //   setInputError("Password must be at least 6 characters and contain a digit");
    //   return;
    // }

    setInputError("");

    // Perform login logic here (e.g., API call, authentication)
    // Replace this with your actual login implementation
    // console.log("Login successful! Email:", email, "Password:", password);
    try {
      // console.log("Above", authUser)
      const response = await dispatch(Login({ email, password }));

      if (response.payload["accessToken"]) {
        navigate("/chat");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        {error && (
          <h4 className="font-bold mb-4 text-center text-red-600">{error}</h4>
        )}
        <h1 className="text-2xl font-bold mb-4">Login to your account</h1>
        <input
          type="email"
          placeholder="Email address"
          className="w-full border rounded p-2 mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"} // Toggle password visibility
            placeholder="Password"
            className="w-full border rounded p-2 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="absolute top-2 right-2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {inputError && (
          <p className="text-red-500 text-sm mb-2">{inputError}</p>
        )}
        <button
          className="bg-purple-600 text-white w-full py-2 rounded font-bold active:bg-green-800 hover:bg-purple-700 disabled:bg-slate-500"
          onClick={handleLogin}
          disabled={loading}
        >
          Login
        </button>
        <p className="text-gray-500 text-sm mt-4">
          Don&apos;t have an account yet?{" "}
          <Link to="/signup" className="font-bold underline">
            Signup
          </Link>
          {/* <a href="/signup">Signup</a> */}
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
