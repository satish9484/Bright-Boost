import React from "react";
import { Button, Form, Input, message, Upload } from "antd";
import { toAbsoluteUrl } from "../../utils";
import { ProfileIcon } from "../../svg";
import "./MyProfile.scss";
import Card from "../../components/common/Card";

const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },

  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }

    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const EditProfile = () => {
  return (
    <>
      <div className="editprofile">
        <Card className="d-flex edit">
          <div className="profile-img">
            <h3 className="edit-title">Profile image</h3>
            <figure>
              <img
                src={toAbsoluteUrl("../images/person-img.png")}
                alt="person-img"
              />
            </figure>
            <Upload {...props}>
              <Button icon={<ProfileIcon />}>Change profile picture</Button>
            </Upload>
          </div>
          <Form className="editprofile" layout="vertical">
            <div className="row">
              <div className="col-xl-12">
                <h3 className="edit-title">Personal details</h3>
              </div>
              <div className="col-xl-6">
                <Form.Item
                  className="form-group"
                  label="First name"
                  labelWrap={true}
                  name="firstname"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="col-xl-6">
                <Form.Item
                  className="form-group"
                  label="Last name"
                  name="lastname"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="col-xl-6">
                <Form.Item className="form-group" label="Email" name="email">
                  <Input />
                </Form.Item>
              </div>
              <div className="col-xl-6">
                <Form.Item
                  className="form-group"
                  label="Phone number"
                  name="number"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="col-xl-12">
                <Form.Item className="form-group edit-btn">
                  <Button type="primary" htmlType="submit">
                    {" "}
                    Save changes
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="btn-secondary"
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default EditProfile;
