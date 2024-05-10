import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Register } from "../../redux/actions/authActions";
import useAuthState from "../../hooks/useAuthState";

const SignupForm = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading, error } = useAuthState();

  // console.log(loading)
  // console.log(error)

  const [inputError, setInputError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    // Basic email validation (you can use a library like validator.js for more robust validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Password validation: at least 6 characters, containing at least one digit and one letter
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async () => {
    // console.log(formData);

    if (!formData.username.trim()) {
      setInputError("No username Provided");
      return;
    }

    // if (!validateEmail(formData.email)) {
    //   setInputError("Invalid email address");
    //   return;
    // }

    // if (!validatePassword(formData.password)) {
    //   setInputError(
    //     "Password must be at least 6 characters and contain a digit"
    //   );
    //   return;
    // }

    // if (formData.password !== formData.confirmPassword) {
    //   setInputError("Password should match with confirm Password");
    //   return;
    // }

    setInputError("");

    try {
      // useAuthState(mode)

      const response = await dispatch(
        Register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        })
      );

      if (!response.error) {
        navigate("/login");
      }

      // if (!error) {
      //   navigate("/login");
      // }
    } catch (error) {
      console.error("Register failed:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        {error && (
          <h4 className="font-bold mb-4 text-center text-red-600">{error}</h4>
        )}
        <h1 className="text-2xl font-bold mb-4">Register your account</h1>
        <input
          type="text"
          placeholder="User Name"
          className="w-full border rounded p-2 mb-2"
          name="username"
          // value={email}
          onChange={(e) => handleInputChange(e)}
        />
        <input
          type="email"
          placeholder="Email address"
          className="w-full border rounded p-2 mb-2"
          name="email"
          // value={email}
          onChange={(e) => handleInputChange(e)}
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"} // Toggle password visibility
            placeholder="Password"
            className="w-full border rounded p-2 mb-4"
            name="password"
            // value={password}
            onChange={(e) => handleInputChange(e)}
          />
          <button
            className="absolute top-2 right-2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"} // Toggle password visibility
            placeholder="Confirm Password"
            className="w-full border rounded p-2 mb-4"
            name="confirmPassword"
            // value={password}
            onChange={(e) => handleInputChange(e)}
          />
          <button
            className="absolute top-2 right-2 text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        {inputError && (
          <p className="text-red-500 text-sm mb-2">{inputError}</p>
        )}
        <button
          className="bg-purple-600 text-white w-full py-2 rounded font-bold active:bg-green-800 hover:bg-purple-700 disabled:bg-slate-500"
          onClick={handleRegister}
          disabled={loading}
        >
          Register
        </button>
        <p className="text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="font-bold underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
