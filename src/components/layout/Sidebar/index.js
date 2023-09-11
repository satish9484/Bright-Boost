import { Layout, Menu } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toAbsoluteUrl } from "../../../utils";
import {
  LayoutCollapsed,
  LayoutUnCollapsed,
  UserICon,
  Union,
} from "../../../svg";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem(
    "Dashboard",
    "dashboard",
    <Link to="/dashboard">
      <Union />
    </Link>
  ),
  getItem(
    "User Management",
    "user-management",
    <Link to="/userManagement">
      <UserICon />
    </Link>
  ),
  // getItem("Car Management", "car management", <Union />, [
  //   getItem("New Car", "New car", <Link to="/newCar"></Link>),
  //   getItem("Used Car", "Used car", <Link to="/usedCar"></Link>),
  // ]),
];
console.log("items: ", items);

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

const Sidebar = () => {
  const { Sider } = Layout;
  const [collapsed, setCollapsed] = useState(false);

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
      <Menu mode="inline" selectedKeys={[currentActiveKey()]} items={items} />
    </Sider>
  );
};

export default Sidebar;
