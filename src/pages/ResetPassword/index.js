import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../LoginIn/style.scss";
// import { LockOutlined } from "@ant-design/icons";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleClick = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <div className="login-wrap">
        <div className="login-detail">
          <div className="bg">
            <h1 className="title">Reset password</h1>
            <Form className="login-form">
              <div className="row">
                <div className="col-sm-12 mar-bottom-8">
                  <Form.Item
                    className="form-group"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Your New password!",
                      },
                    ]}
                  >
                    <Input.Password
                      type={"password"}
                      placeholder="New password"
                      visibilityToggle={{
                        visible: passwordVisible,
                        onVisibleChange: setPasswordVisible,
                      }}
                    />
                  </Form.Item>
                </div>
                <div className="col-sm-12 mar-bottom-8">
                  <Form.Item
                    className="form-group"
                    name="confirmpassword"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Your Confirm password!",
                      },
                    ]}
                  >
                    <Input.Password
                      type={"password"}
                      placeholder="Confirm password"
                      visibilityToggle={{
                        visible: confirmPasswordVisible,
                        onVisibleChange: setConfirmPasswordVisible,
                      }}
                    />
                  </Form.Item>
                </div>
                <div className="col-sm-12">
                  <Form.Item className="form-group">
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={handleClick}
                    >
                      {" "}
                      Submit
                    </Button>
                    <div className="note">
                      <Link to="/login" className="f-pwd">
                        Back to login
                      </Link>
                    </div>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
