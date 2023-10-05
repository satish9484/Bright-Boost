import { Link } from "react-router-dom";
import { Union, UserICon } from "../svg";

// Helper function to create sidebar items
function getSidebarItem(label, key, icon, link) {
  return {
    key,
    icon,
    label,
    link,
  };
}

// Sidebar items for admin
export const adminSidebarItems = [
  getSidebarItem(
    "Dashboard",
    "dashboard",
    <Link to="/admin/dashboard">
      <Union />
    </Link>
  ),
  getSidebarItem(
    "User Management",
    "user-management",
    <Link to="/admin/userManagement">
      <UserICon />
    </Link>
  ),
  getSidebarItem(
    "Tutor Availability",
    "tutor-availability",
    <Link to="/admin/tutoravailability">
      <UserICon />
    </Link>
  ),
  getSidebarItem(
    "Session Arrangement",
    "session-arrangement",
    <Link to="/admin/sessionarrangement">
      <UserICon />
    </Link>
  ),
];

// Sidebar items for student
export const studentSidebarItems = [
  getSidebarItem(
    "Dashboard",
    "dashboard",
    <Link to="/student/dashboard">
      <Union />
    </Link>
  ),
  getSidebarItem(
    "Session Registration",
    "session-registration",
    <Link to="/student/sessionregistration">
      <UserICon />
    </Link>
  ),
];

// Sidebar items for tutor
export const tutorSidebarItems = [
  getSidebarItem(
    "Dashboard",
    "dashboard",
    <Link to="/tutor/dashboard">
      <Union />
    </Link>
  ),
  getSidebarItem(
    "Organize Availability",
    "organize-availability",
    <Link to="/tutor/organizeavailability">
      <UserICon />
    </Link>
  ),
];
