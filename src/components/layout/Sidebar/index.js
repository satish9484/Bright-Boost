import { Layout, Menu } from "antd";
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

  const currentActiveKey = () => {
    let result = "dashboard";

    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      if (window.location.pathname.includes(element.key)) {
        result = element.key;
        return result;
      }
    }
  };

  useEffect(() => {
    if (currentUser?.email) {
      fetchUserRoleByEmail(currentUser?.email)
        .then((userRoleName) => {
          // console.log(`User role for ${currentUser?.email}: ${userRoleName}`);

          if (userRoleName === "admin") {
            setItems(adminSidebarItems);
          } else if (userRoleName === "student") {
            setItems(studentSidebarItems);
          } else if (userRoleName === "tutor") {
            setItems(tutorSidebarItems);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user role:", error);
        });
    }
  }, [currentUser?.email]);

  const onClick = (e) => {
    console.log(e.key);
    setCurrent(e.key);
  };

  return (
    <Sider
      collapsible
      width="270px"
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      trigger={collapsed === true ? <LayoutUnCollapsed /> : <LayoutCollapsed />}
      reverseArrow={true}
      breakpoint="md"
    >
      <figure className="layout-logo">
        <p className="logo">BRIGHT BOOST</p>
        {/* <img
          className="logo"
          src={toAbsoluteUrl("/images/logo-white.svg")}
          alt="logo"
        /> */}
        <img
          className="logo-icon"
          src={toAbsoluteUrl("/images/logo-icon.svg")}
          alt="logo"
        />
      </figure>
      <Menu
        mode="inline"
        onClick={onClick}
        openKeys={["dashboard"]}
        selectedKeys={[current]}
        items={items}
        theme="dark"
      />
    </Sider>
  );
};

export default Sidebar;
