import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./style.scss";
import { toAbsoluteUrl } from "../../utils";
import { setUser } from "../../Redux/AuthSlice";
import { useDispatch } from "react-redux";

const LoginIn = () => {
  const dispatch = useDispatch();
  // const [err, setErr] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleFinish = async (values) => {
    dispatch(
      setUser({ email: values.email.trim(), password: values.password.trim() })
    );
  };

  return (
    <>
      <div className="login-wrap">
        <div className="login-detail">
          <div className="bg">
            <Link to="#" className="link-logo">
              <figure>
                <img
                  className="logo"
                  src={toAbsoluteUrl("/images/logo-icon.svg")}
                  alt="logo"
                />
              </figure>
              <p>BRIGHT BOOST</p>
            </Link>

            <Form
              className="login-form"
              onFinish={handleFinish}
              initialValues={{ email: "test123@gmail.com", password: "123456" }}
            >
              <div className="row">
                {/* email */}
                <div className="col-sm-12 mar-bottom-8">
                  <Form.Item
                    className="form-group"
                    name="email"
                    rules={[
                      { required: true, message: "Please Enter Your Email!" },
                    ]}
                  >
                    <Input
                      placeholder="Email"
                      suffix={<UserOutlined className="iconDesing" />}
                    />
                  </Form.Item>
                </div>

                {/* password */}
                <div className="col-sm-12 mar-bottom-8">
                  <Form.Item
                    className="form-group"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Your password!",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="input password"
                      visibilityToggle={{
                        visible: passwordVisible,
                        onVisibleChange: setPasswordVisible,
                      }}
                    />
                  </Form.Item>
                </div>
                <div className="col-sm-12">
                  <Form.Item className="form-group">
                    <Button type="primary" htmlType="submit">
                      {" "}
                      Login
                    </Button>
                    <Link to="/forgotpassword" className="f-pwd">
                      {" "}
                      Forgot password?{" "}
                    </Link>
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

export default LoginIn;
