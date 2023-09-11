// Properly organized imports, consistent naming, and added comments for clarity

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Col, Dropdown, Layout, Row, Space } from "antd";
import { ProfileDown, ProfileUp } from "../../../svg";
import { toAbsoluteUrl } from "../../../utils";
import "./style.scss";

const AppHeader = () => {
  const { Header } = Layout;

  const [dropDownArrowDirection, setDropDownArrowDirection] = useState(false);

  const handleProfileClick = (e) => {
    e.preventDefault();
    setDropDownArrowDirection(false);
  };

  const items = [
    {
      key: "1",
      label: (
        <Link onClick={handleProfileClick} to="/myprofile">
          My profile
        </Link>
      ),
      // icon: <Union />,
    },
    {
      key: "2",
      label: (
        <Link onClick={handleProfileClick} to="/myprofile/edit">
          Edit profile
        </Link>
      ),
      // icon: <Union />,
    },
    {
      key: "3",
      label: (
        <Link onClick={handleProfileClick} to="/myprofile/changepassword">
          Change password
        </Link>
      ),
      // icon: <Union />,
    },
    {
      key: "4",
      label: <a href="/">Email notifications</a>,
      // icon: <Union />,
    },
    {
      key: "5",
      label: (
        <Link onClick={handleProfileClick} to="/login">
          Logout
        </Link>
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
