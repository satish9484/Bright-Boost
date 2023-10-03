import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Schedule from "../components/schedule/Schedule";
// import AvailabilityCalendar from "../components/schedule/AvailabilityCalendar";
import View from "../components/View/View";

import EditUserManagement from "./UserManagement/edit";

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
	// const [container, setContainer] = useState(null);

	return (
		<Routes>
			<Route path="/" element={<Navigate replace to="/login" />} />
			<Route path="/login" element={<LoginIn />} />
			<Route path="/forgotpassword" element={<ForgotPassword />} />
			<Route path="/resetpassword" element={<ResetPassword />} />
			<Route path="/schedule" element={<Schedule />}></Route>
			<Route path="/view" element={<View />}></Route>

			<Route
				path="/"
				// element={<Layout setContainer={setContainer} container={container} />}
				element={<Layout />}
			>
				<Route path="/" element={<Navigate replace to="/dashboard" />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/myprofile" element={<MyProfile />} />
				<Route path="/myprofile/edit" element={<EditProfile />} />
				<Route path="/myprofile/changepassword" element={<ChangePassword />} />
				<Route path="/myprofile" element={<MyProfile />} />
				<Route path="/myprofile/edit" element={<EditProfile />} />
				<Route path="/myprofile/changepassword" element={<ChangePassword />} />
				<Route path="/userManagement" element={<UserManagement />} />
				<Route path="/userManagement/edit" element={<EditUserManagement />} />
			</Route>
			<Route path="*" element={<Navigate replace to="/" />} />
		</Routes>
	);
};

export default Routing;
