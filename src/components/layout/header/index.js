// Properly organized imports, consistent naming, and added comments for clarity

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Button, Col, Dropdown, Layout, Row, Space, notification } from "antd";
import { ProfileDown, ProfileUp } from "../../../svg";
import { toAbsoluteUrl } from "../../../utils";
import {  signOut } from "firebase/auth";
import { auth } from '../../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import "./style.scss";

const AppHeader = () => {
  const { Header } = Layout;

  const [dropDownArrowDirection, setDropDownArrowDirection] = useState(false);

  const handleProfileClick = (e) => {
    e.preventDefault();
    setDropDownArrowDirection(false);
  };

  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (notifTitle, notifContent) => {
  	api.open({
		message: notifTitle,
		description: notifContent
	});
  };

  const handleLogout = (e) => {
	signOut(auth).then(() => {
		openNotification("Log out", "Logged out successfully");
		setTimeout(() => {navigate("/login")}, 1000);      
	}).catch((error) => {
              	openNotification("Log out", "Failed to log out! Error: " + error); 
	});
  };

  const items = [
    {
      key: "1",
      label: (
        <Button type="link" onClick={handleProfileClick}>
          <Link to="/myprofile">My profile</Link>
        </Button>
      ),
      // icon: <Union />,
    },
    {
      key: "2",
      label: (
        <Button type="link" onClick={handleProfileClick}>
          <Link to="/myprofile/edit">Edit profile</Link>
        </Button>
      ),
      // icon: <Union />,
    },
    {
      key: "3",
      label: (
        <Button type="link" onClick={handleProfileClick}>
          <Link to="/myprofile/changepassword">Change Password</Link>
        </Button>
      ),
      // icon: <Union />,
    },

    {
      key: "4",
      label: (
        <Button type="link" onClick={handleLogout}>
          <Link to="#">Logout</Link>
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
