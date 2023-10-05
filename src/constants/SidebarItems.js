import { Link } from "react-router-dom";
import { Union, UserICon } from "../svg";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

export const adminSidebarItems = [
  getItem(
    "Dashboard",
    "dashboard",
    <Link to="/admin/dashboard">
      <Union />
    </Link>
  ),
  getItem(
    "User Management",
    "user-management",
    <Link to="/admin/userManagement">
      <UserICon />
    </Link>
  ),
  getItem(
    "TutorAvailability",
    "tutoavailability",
    <Link to="/admin/tutoavailability">
      <UserICon />
    </Link>
  ), getItem(
    "Session Arrangement",
    "sessionarrangement",
    <Link to="/admin/sessionarrangement">
      <UserICon />
    </Link>
  ),
  // getItem("Car Management", "car management", <Union />, [
  //   getItem("New Car", "New car", <Link to="/newCar"></Link>),
  //   getItem("Used Car", "Used car", <Link to="/usedCar"></Link>),
  // ]),
];

export const studentSidebarItems = [
  getItem(
    "Dashboard",
    "dashboard",
    <Link to="/studnet/dashboard">
      <Union />
    </Link>
  ),
  getItem(
    "Session Registration",
    "sessionregistration",
    <Link to="/student/sessionregistration">
      <UserICon />
    </Link>
  ),
  // getItem("Car Management", "car management", <Union />, [
  //   getItem("New Car", "New car", <Link to="/newCar"></Link>),
  //   getItem("Used Car", "Used car", <Link to="/usedCar"></Link>),
  // ]),
];

export const tutorSidebarItems = [
  getItem(
    "Dashboard",
    "dashboard",
    <Link to="/tutor/dashboard">
      <Union />
    </Link>
  ),
  getItem(
    "Organize Avability",
    "organizeavailability",
    <Link to="/tutor/organizeavailability">
      <UserICon />
    </Link>
  ),
  getItem(
    "Session Q&As",
    "session-qa",
    <Link to="/tutor/session-qa">
      <UserICon />
    </Link>
  ),
  // getItem("Car Management", "car management", <Union />, [
  //   getItem("New Car", "New car", <Link to="/newCar"></Link>),
  //   getItem("Used Car", "Used car", <Link to="/usedCar"></Link>),
  // ]),
];
