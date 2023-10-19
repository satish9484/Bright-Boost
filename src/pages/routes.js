  import React, { lazy, useContext, useEffect, useState } from "react";
  import { Routes, Route, Navigate } from "react-router-dom";

  import AuthGuard from "../components/auth";
  import { AuthContext } from "../context/AuthContext";
  import { db } from "../firebase/firebase";

  // Importing admin route components
  import EditUserManagement from "./admin/UserManagement/edit";
  import AddUserManagement from "./admin/UserManagement/add";
  import TutorAvailability from "./admin/TutorAvailability/index";
  import SessionArrangement from "./admin/SessionArrangement/index";

  // Importing student route components
  import SessionRegistration from "./student/SessionRegistration";

  // Importing tutor route components
  import OrganizeAvailability from "./tutor/organizeAvailability/index";
  import Schedule from "./tutor/Schedule/index.js";

  import { doc, getDoc } from "firebase/firestore";

  // Lazy-loaded route components
  const LoginIn = lazy(() => import("./LoginIn"));
  const Register = lazy(() => import("./Register"));
  const ForgotPassword = lazy(() => import("./ForgotPassword"));
  const ResetPassword = lazy(() => import("./ResetPassword"));
  const Layout = lazy(() => import("../components/layout"));
  const AdminDashboard = lazy(() => import("./admin/Dashboard/index"));
  const StudentDashboard = lazy(() => import("./student/Dashboard/index"));
  const TutorDashboard = lazy(() => import("./tutor/Dashboard/index"));
  const MyProfile = lazy(() => import("./MyProfile"));
  const EditProfile = lazy(() => import("./MyProfile/EditProfile"));
  const ChangePassword = lazy(() => import("./MyProfile/ChangePassword"));
  const UserManagement = lazy(() => import("./admin/UserManagement"));

  const Routing = () => {
    const { currentUser } = useContext(AuthContext);

    // State to hold the user's role
    const [userRole, setUserRole] = useState(null);

    // Constants for Firestore collection and document
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
      // Fetch and set the user's role when the currentUser changes
      if (currentUser?.email) {
        fetchUserRoleByEmail(currentUser?.email)
          .then((userRoleName) => {
            // Set the user's role
            setUserRole(userRoleName);
          })
          .catch((error) => {
            console.error("Failed to fetch user role:", error);
          });
      }
    }, [currentUser?.email]);
    // const [container, setContainer] = useState(null);

    return (
      <Routes>
        {currentUser ? ( // Check if the user is logged in
          <>
            {userRole ? ( // Check if userRole is available
              // Render routes based on userRole
              userRole === "admin" ? (
                <Route
                  path="/"
                  element={
                    // <AuthGuard>
                      <Layout />
                    // </AuthGuard>
                  }
                >
                  {/* Admin routes */}
                  <Route path="/" element={<Navigate replace to="/admin" />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/myprofile" element={<MyProfile />} />
                  <Route path="/admin/myprofile/edit" element={<EditProfile />} />
                  <Route
                    path="/admin/myprofile/changepassword"
                    element={<ChangePassword />}
                  />
                  <Route
                    path="/admin/userManagement"
                    element={<UserManagement />}
                  />
                  <Route
                    path="/admin/userManagement/edit"
                    element={<EditUserManagement />}
                  />
                  <Route
                    path="/admin/userManagement/add"
                    element={<AddUserManagement />}
                  />
                  <Route
                    path="/admin/tutoravailability"
                    element={<TutorAvailability />}
                  />
                  <Route
                    path="/admin/sessionarrangement"
                    element={<SessionArrangement />}
                  />
                </Route>
              ) : userRole === "student" ? (
                <Route
                  path="/"
                  element={
                    <AuthGuard>
                      <Layout />
                    </AuthGuard>
                  }
                >
                  {/* Student routes */}
                  <Route path="/" element={<Navigate replace to="/student" />} />
                  <Route path="/student" element={<StudentDashboard />} />
                  <Route
                    path="/student/dashboard"
                    element={<StudentDashboard />}
                  />
                  <Route path="/student/myprofile" element={<MyProfile />} />
                  <Route
                    path="/student/myprofile/edit"
                    element={<EditProfile />}
                  />
                  <Route
                    path="/student/myprofile/changepassword"
                    element={<ChangePassword />}
                  />
                  <Route
                    path="/student/sessionregistration"
                    element={<SessionRegistration />}
                  />
                </Route>
              ) : userRole === "tutor" ? (
                <Route
                  path="/"
                  element={
                    <AuthGuard>
                      <Layout />
                    </AuthGuard>
                  }
                >
                  {/* Tutor routes */}
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
                    element={<OrganizeAvailability />}
                  />
                  <Route path="/tutor/schedule" element={<Schedule />} />
                </Route>
              ) : (
                // Handle unknown roles here or redirect to an error page
                <Route path="*" element={<Navigate replace to="/" />} />
              )
            ) : (
              <Route path="*" element={<Navigate replace to="/" />} />
            )}

            {/* Include global or universal route */}
            <Route path="/register" element={<Register />} />
          </>
        ) : (
          // If the user is not logged in, show login and registration routes
          <>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<LoginIn />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
      </Routes>
    );
  };

  export default Routing;