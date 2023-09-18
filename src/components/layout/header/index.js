// Properly organized imports, consistent naming, and added comments for clarity

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Button, Col, Dropdown, Layout, Row, Space } from "antd";
import { ProfileDown, ProfileUp } from "../../../svg";
import { toAbsoluteUrl } from "../../../utils";
import "./style.scss";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase";

const AppHeader = () => {
  const { Header } = Layout;
  const navigate = useNavigate(null);

  const [dropDownArrowDirection, setDropDownArrowDirection] = useState(false);

  const handleProfileClick = (e) => {
    e.preventDefault();
    setDropDownArrowDirection(false);
  };

  const handleSignout = async () => {
    await signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const items = [
    {
      key: "1",
      label: (
        <Button type="link" onClick={handleProfileClick}>
          <Link to="/myprofile">My Profile</Link>
        </Button>
      ),
      // icon: <Union />,
    },
    {
      key: "2",
      label: (
        <Button type="link" onClick={handleProfileClick}>
          <Link to="/myprofile/edit">Edit Profile</Link>
        </Button>
      ),
      // icon: <Union />,
    },
    {
      key: "3",
      label: (
        <Button type="link" onClick={handleProfileClick}>
          <Link to="/myprofile/changepassword">Change password</Link>
        </Button>
      ),
      // icon: <Union />,
    },

    {
      key: "4",
      label: (
        <Button type="link" onClick={handleSignout}>
          Sign Out
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
  );
};

export default AppHeader;
