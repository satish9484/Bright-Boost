import { Layout, Menu } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import {
  adminSidebarItems,
  studentSidebarItems,
  tutorSidebarItems,
} from "../../../constants/SidebarItems";
import React, { useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import {
  adminSidebarItems,
  studentSidebarItems,
  tutorSidebarItems,
} from "../../../constants/SidebarItems";
import { toAbsoluteUrl } from "../../../utils";
import { LayoutCollapsed, LayoutUnCollapsed } from "../../../svg";
import { db } from "../../../firebase/firebase";
import { AuthContext } from "../../../context/AuthContext";

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

const Sidebar = () => {
  const { Sider } = Layout;
  const { currentUser } = useContext(AuthContext);

  const [current, setCurrent] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (currentUser?.email) {
      fetchUserRoleByEmail(currentUser?.email)
        .then((userRoleName) => {
          let sidebarItems = [];

          // Determine which sidebar items to use based on user role
          if (userRoleName === "admin") {
            sidebarItems = adminSidebarItems;
          } else if (userRoleName === "student") {
            sidebarItems = studentSidebarItems;
          } else if (userRoleName === "tutor") {
            sidebarItems = tutorSidebarItems;
          }

          setItems(sidebarItems);
        })
        .catch((error) => {
          console.error("Failed to fetch user role:", error);
        });
    }
  }, [currentUser?.email]);

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <Sider
      collapsible
      width="270px"
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      trigger={collapsed ? <LayoutUnCollapsed /> : <LayoutCollapsed />}
      reverseArrow={true}
      breakpoint="md"
    >
      <figure className="layout-logo">
        <p className="logo">BRIGHT BOOST</p>
        <img
          className="logo-icon"
          src={toAbsoluteUrl("/images/logo-icon.svg")}
          alt="logo"
        />
      </figure>
      <Menu
        mode="inline"
        onClick={onClick}
        selectedKeys={[current]}
        items={items}
        theme="dark"
      />
    </Sider>
  );
};

export default Sidebar;
