import { Button, Form, Input, Switch } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import BreadCrumbs from "../../components/common/Breadcrumbs";
import Card from "../../components/common/Card";
import "../UserManagement/UserManagement.scss";

const list = [
  {
    name: "User Management",
    link: "/userManagement",
    isActive: true,
  },
  {
    name: "Edit User Management",
    link: "/userManagement/edit",
    isActive: false,
  },
];

const EditUserManagement = () => {
  return (
    <>
      <div className="editUserManagement">
        <BreadCrumbs list={list} />
        <Card>
          <Form layout="vertical">
            <div className="row">
              <div className="col-md-12">
                <h3 className="pageLabel mar-bottom-18">
                  Edit User Management
                </h3>
              </div>
              <div className="col-xl-6 col-md-8">
                <Form.Item
                  className="form-group"
                  label="Full Name"
                  labelWrap={true}
                  name="carName"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="col-md-4">
                <h3 className="label">Status</h3>
                <Switch />
              </div>
              <div className="col-xl-12 d-flex justify-content-end mar-top-8">
                <Button className="mar-right-8">
                  <Link to="/userManagement">Cancel</Link>
                </Button>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </div>
            </div>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default EditUserManagement;
