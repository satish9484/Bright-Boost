import React, { lazy, useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AuthGuard from "../components/auth";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase/firebase";

// Admin routes imports
import EditUserManagement from "./admin/UserManagement/edit";
import TutorAvailability from "./admin/TutorAvailability/index";
import SessionArrangement from "./admin/SessionArrangement/index";

// student routes imports
import SessionRegistration from "./student/sessionRegistration/index";

// tutor
import OrganizeAvability from "./tutor/organizeAvailability/index";
import { doc, getDoc } from "firebase/firestore";

const LoginIn = lazy(() => import("./LoginIn"));
const Register = lazy(() => import("./Register"));
const ForgotPassword = lazy(() => import("./ForgotPassword"));
const ResetPassword = lazy(() => import("./ResetPassword"));

const Layout = lazy(() => import("../components/layout"));

// const Dashboard = lazy(() => import("./Dashboard"));
const AdminDashboard = lazy(() => import("./admin/Dashboard/index"));
const StudentDashboard = lazy(() => import("./student/Dashboard/index"));
const TutorDashboard = lazy(() => import("./tutor/Dashboard/index"));
const MyProfile = lazy(() => import("./MyProfile"));
const EditProfile = lazy(() => import("./MyProfile/EditProfile"));
const ChangePassword = lazy(() => import("./MyProfile/ChangePassword"));
const UserManagement = lazy(() => import("./admin/UserManagement"));

const Routing = () => {
  const { currentUser } = useContext(AuthContext);

  const [userRole, setUserRole] = useState(null);

  const COLLECTION_NAME = "Bright-Boost";
  const DOCUMENT_ID = "users";

  // Function to fetch a user's role by email
  const fetchUserRoleByEmail = async (email) => {
    try {
      // Reference to the user document
      const userDocRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const roleArray = userData.role || [];

        const userDetails = roleArray.find((entry) => entry.email === email);

        if (userDetails) {
          const userRoleName = userDetails.userRole;
          return userRoleName;
        } else {
          throw new Error(`User with email ${email} not found.`);
        }
      } else {
        throw new Error("Document does not exist.");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (currentUser?.email) {
      fetchUserRoleByEmail(currentUser?.email)
        .then((userRoleName) => {
          // console.log(`User role for ${currentUser?.email}: ${userRoleName}`);
          setUserRole(userRoleName);
        })
        .catch((error) => {
          console.error("Failed to fetch user role:", error);
        });
    }
  }, [currentUser?.email]);

  // console.log(currentUser && userRole !== null && userRole === "admin");
  return (
    <Routes>
      {!currentUser ? (
        <>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginIn />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          {/* <Route
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
            <Route
              path="/userManagement/edit"
              element={<EditUserManagement />}
            />
          </Route> */}
        </>
      ) : currentUser && userRole !== null && userRole === "admin" ? (
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route path="/" element={<Navigate replace to="/admin" />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/myprofile" element={<MyProfile />} />
          <Route path="/admin/myprofile/edit" element={<EditProfile />} />
          <Route
            path="/admin/myprofile/changepassword"
            element={<ChangePassword />}
          />
          <Route path="/admin/userManagement" element={<UserManagement />} />
          <Route
            path="/admin/userManagement/edit"
            element={<EditUserManagement />}
          />
          <Route
            path="/admin/tutoavailability"
            element={<TutorAvailability />}
          />
          <Route
            path="/admin/sessionarrangement"
            element={<SessionArrangement />}
          />
        </Route>
      ) : currentUser && userRole !== null && userRole === "student" ? (
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route path="/" element={<Navigate replace to="/student" />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/myprofile" element={<MyProfile />} />
          <Route path="/student/myprofile/edit" element={<EditProfile />} />
          <Route
            path="/student/myprofile/changepassword"
            element={<ChangePassword />}
          />

          <Route
            path="/student/sessionregistration"
            element={<SessionRegistration />}
          />
        </Route>
      ) : currentUser && userRole !== null && userRole === "tutor" ? (
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route path="/" element={<Navigate replace to="/tutor" />} />
          <Route path="/tutor" element={<TutorDashboard />} />
          <Route path="/tutor/dashboard" element={<TutorDashboard />} />
          <Route path="/tutor/myprofile" element={<MyProfile />} />
          <Route path="/tutor/myprofile/edit" element={<EditProfile />} />
          <Route
            path="/tutor/myprofile/changepassword"
            element={<ChangePassword />}
          />

          <Route
            path="/tutor/organizeavailability"
            element={<OrganizeAvability />}
          />
        </Route>
      ) : (
        "login Rout"
      )}

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};

export default Routing;
