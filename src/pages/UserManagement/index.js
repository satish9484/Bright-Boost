import {  Table, Input, Row, Col } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./UserManagement.scss";
import { useState } from "react";
import CustomModal from "../../components/common/Modal";
import BreadCrumbs from "../../components/common/Breadcrumbs";
import { Link } from "react-router-dom";
const { Search } = Input;

const list = [
  {
    name: "User Management",
    link: "/",
    isActive: true,
  },
];
const UserManagement = () => {
  const onSearch = (value) => console.log(value);
  // const onChange = (checkedValues) => {
  //   console.log("checked = ", checkedValues);
  // };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "name",
      key: "name",
      render: (row) => (
        <div>
          <div>{row.name}</div>
        </div>
      ),
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
      render: (row) => (
        <div>
          <div>{row.emailaddress}</div>
        </div>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "number",
      key: "number",
      render: (row) => (
        <div>
          <div>{row.phonenumber}</div>
        </div>
      ),
    },
    {
      title: "Location  ",
      dataIndex: "location",
      key: "location",
      render: (row) => (
        <div>
          <div>{row.place}</div>
        </div>
      ),
    },
    {
      title: "Ad Posted",
      dataIndex: "ads",
      key: "ads",
      render: (row) => (
        <div>
          <div>{row.adposted}</div>
        </div>
      ),
    },
    {
      title: "User Verification",
      dataIndex: "verification",
      key: "verification",
      render: (_, { verification }) => {
        return verification.userverification === "verified" ? (
          <div className="verified verification">
            {verification.userverification}
          </div>
        ) : verification.userverification === "in review" ? (
          <div className="inReview verification">
            {verification.userverification}
          </div>
        ) : (
          <div className="verification">{verification.userverification}</div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <>
          <div className="d-flex">
            <div className="mar-right-8 cPointer">
              {" "}
              <Link to="/userManagement/edit">
                <EditOutlined style={{ fontSize: "20px", color: "white" }} />
              </Link>
            </div>
            <div onClick={showModal} className="cPointer">
              <DeleteOutlined style={{ fontSize: "20px" }} />
            </div>
          </div>
        </>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      name: { name: "Danesha Russ" },
      email: { emailaddress: "agileinfoways@gmail.com" },
      number: { phonenumber: 4578444242 },
      ads: { adposted: 1 },
      location: { place: "sarjah" },
      verification: { userverification: "verified" },
      tags: ["Active"],
    },
    {
      key: "2",
      name: { name: "William Korn unenrolled" },
      email: { emailaddress: "agileinfoways@gmail.com" },
      number: { phonenumber: 4578444242 },
      ads: { adposted: 1 },
      location: { place: "sarjah" },
      verification: { userverification: "in review" },
      tags: ["Inactive"],
    },
    {
      key: "3",
      name: { name: "Chakkira Wonnum" },
      email: { emailaddress: "agileinfoways@gmail.com" },
      number: { phonenumber: 4578444242 },
      ads: { adposted: 1 },
      location: { place: "sarjah" },
      verification: { userverification: "verified" },
      tags: ["Active"],
    },
    {
      key: "4",
      name: { name: "Paul Vines" },
      email: { emailaddress: "agileinfoways@gmail.com" },
      number: { phonenumber: 4578444242 },
      ads: { adposted: 1 },
      location: { place: "sarjah" },
      verification: { userverification: "in review" },
      tags: ["Inactive"],
    },
    {
      key: "5",
      name: { name: "Edward Canning" },
      email: { emailaddress: "agileinfoways@gmail.com" },
      number: { phonenumber: 4578444242 },
      ads: { adposted: 1 },
      location: { place: "sarjah" },
      verification: { userverification: "verified" },
      tags: ["Inactive"],
    },
    {
      key: "6",
      name: { name: "David Smith" },
      email: { emailaddress: "agileinfoways@gmail.com" },
      number: { phonenumber: 4578444242 },
      ads: { adposted: 1 },
      location: { place: "sarjah" },
      verification: { userverification: "verified" },
      tags: ["Inactive"],
    },
    {
      key: "7",
      name: { name: "Ann Hopkins" },
      email: { emailaddress: "agileinfoways@gmail.com" },
      number: { phonenumber: 4578444242 },
      ads: { adposted: 1 },
      location: { place: "sarjah" },
      verification: { userverification: "verified" },
      tags: ["Active"],
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <BreadCrumbs list={list} />
      <div className="user-management shadow-paper auto-height">
        <Row className="mar-bottom-20">
          <Col xl={12} lg={8} md={16} sm={24}>
            <div className="searchGrp">
              <Search
                placeholder="Search by name"
                size="large"
                onSearch={onSearch}
                className="search"
              />
            </div>
          </Col>
        </Row>
        <Table columns={columns} dataSource={data} scroll={{ x: 980 }} />
      </div>
      <CustomModal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Are you sure you want to delete?</p>
      </CustomModal>
    </>
  );
};

export default UserManagement;
