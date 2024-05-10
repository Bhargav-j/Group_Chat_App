import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "../components/Auth/LoginForm";
import SignupForm from "../components/Auth/SignupForm";
import NotFound from "../components/NotFound";
import Layout from "../Layout";
import useAuthState from "../hooks/useAuthState";

export default function AppRoutes() {
  const { authUser, accessToken } = useAuthState();

  return (
    <Routes>
      <Route
        path="/"
        element={
          accessToken || authUser ? (
            <Navigate to="/chat" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/login"
        exact
        element={
          accessToken || authUser ? (
            <Navigate to="/chat" replace />
          ) : (
            <LoginForm />
          )
        }
      />
      <Route
        path="/signup"
        exact
        element={
          accessToken || authUser ? (
            <Navigate to="/chat" replace />
          ) : (
            <SignupForm />
          )
        }
      />
      <Route
        path="/chat/*"
        element={
          accessToken || authUser ? (
            <Layout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
