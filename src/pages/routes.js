import React, { lazy, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import EditUserManagement from "./UserManagement/edit";
import AuthGuard from "../components/auth";
import { AuthContext } from "../context/AuthContext";

const LoginIn = lazy(() => import("./LoginIn"));
const ForgotPassword = lazy(() => import("./ForgotPassword"));
const ResetPassword = lazy(() => import("./ResetPassword"));

const Layout = lazy(() => import("../components/layout"));
const Dashboard = lazy(() => import("./Dashboard"));
const MyProfile = lazy(() => import("./MyProfile"));
const EditProfile = lazy(() => import("./MyProfile/EditProfile"));
const ChangePassword = lazy(() => import("./MyProfile/ChangePassword"));
const UserManagement = lazy(() => import("./UserManagement"));

const Routing = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <Routes>
      {!currentUser ? (
        <>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginIn />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
        </>
      ) : (
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route path="/" element={<Navigate replace to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/myprofile/edit" element={<EditProfile />} />
          <Route
            path="/myprofile/changepassword"
            element={<ChangePassword />}
          />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/myprofile/edit" element={<EditProfile />} />
          <Route
            path="/myprofile/changepassword"
            element={<ChangePassword />}
          />
          <Route path="/userManagement" element={<UserManagement />} />
          <Route path="/userManagement/edit" element={<EditUserManagement />} />
        </Route>
      )}

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};

export default Routing;
