// Properly organized imports, consistent naming, and added comments for clarity

import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Layout,
  Row,
  Space,
  notification,
} from "antd";
import { ProfileDown, ProfileUp } from "../../../svg";
import { toAbsoluteUrl } from "../../../utils";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { auth, db } from "../../../firebase/firebase";
import { AuthContext } from "../../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";

const AppHeader = () => {
  const { Header } = Layout;
  const navigate = useNavigate(null);
  const [dropDownArrowDirection, setDropDownArrowDirection] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const handleProfileClick = (e) => {
    e.preventDefault();
    setDropDownArrowDirection(false);
  };

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

  const openNotification = (notifTitle, notifContent) => {
    api.open({
      message: notifTitle,
      description: notifContent,
    });
  };

  const handleLogout = (e) => {
    signOut(auth)
      .then(() => {
        openNotification("Log out", "Logged out successfully");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      })
      .catch((error) => {
        openNotification("Log out", "Failed to log out! Error: " + error);
      });
  };

  const items = [
    {
      key: "1",
      label: (
        <Button type="link" onClick={handleProfileClick}>
          <Link to={`/${userRole}/myprofile`}>My profile</Link>
        </Button>
      ),
      // icon: <Union />,
    },
    {
      key: "2",
      label: (
        <Button type="link" onClick={handleProfileClick}>
          <Link to={`/${userRole}/myprofile/edit`}>Edit profile</Link>
        </Button>
      ),
      // icon: <Union />,
    },
    {
      key: "3",
      label: (
        <Button type="link" onClick={handleProfileClick}>
          <Link to={`/${userRole}/myprofile/changepassword`}>
            Change Password
          </Link>
        </Button>
      ),
      // icon: <Union />,
    },

    {
      key: "4",
      label: (
        <Button type="link" onClick={handleLogout}>
          {" "}
          Logout
        </Button>
      ),
      // icon: <Union />,
    },
  ];

  // Function to handle dropdown open/close
  const handleDropdown = (open) => {
    setDropDownArrowDirection(open);
  };

  return (
    <>
      {contextHolder}
      <Header className="layout-header">
        <Row gutter={16}>
          <Col className="gutter-row d-flex-center-end" span={24}>
            <Dropdown
              trigger={["click"]}
              arrow={false}
              menu={{ items }}
              placement="bottomRight"
              overlayClassName="layout-header-dropdown"
              onOpenChange={handleDropdown}
            >
              <Link to="" onClick={handleProfileClick}>
                <Space>
                  <Avatar
                    size="large"
                    src={toAbsoluteUrl("/images/user-img.svg")}
                    className="profile-avatar"
                  />

                  {dropDownArrowDirection ? <ProfileUp /> : <ProfileDown />}
                </Space>
              </Link>
            </Dropdown>
          </Col>
        </Row>
      </Header>
    </>
  );
};

export default AppHeader;
