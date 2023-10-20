import { Link } from "react-router-dom";
import { Union, UserICon } from "../svg";

function getSidebarItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
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

  getSidebarItem(
    "Statistics",
    "statistics",
    <Link to="/admin/statistics">
      <UserICon />
    </Link>
  ),
  getSidebarItem(
    "ViewHelpline",
    "ViewHelpline",
    <Link to="/admin/ViewHelpline">
      <UserICon />
    </Link>
  ),
  getSidebarItem("Report And Graph", "ReportAndGraph", <Union />, [
    getSidebarItem(
      "Popular Subject",
      "popularsubject",
      <Link to="/admin/popularsubject"></Link>
    ),
  ]),
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
  getSidebarItem(
    "Helpline",
    "helpline",
    <Link to="/student/helpline">
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
    "Session Q&As",
    "session-qa",
    <Link to="/tutor/session-qa">
      <UserICon />
    </Link>
  ),
 
  getSidebarItem(
    "Schedule",
    "schedule",
    <Link to="/tutor/schedule">
      <UserICon />
    </Link>
  ),
];
