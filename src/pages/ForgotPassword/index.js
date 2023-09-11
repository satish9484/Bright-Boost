import React from "react";
import { Button, Form, Input } from "antd";
// import { RightIcon } from '../Layout/MenuSvg';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../LoginIn/style.scss";
import { toAbsoluteUrl } from "../../utils";
import { MailOutlined } from "@ant-design/icons";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/resetpassword");
  };

  return (
    <>
      <div className="login-wrap">
        <div className="login-detail">
          <div className="bg">
            <Link to="#" className="link-logo">
              <img
                className="logo"
                src={toAbsoluteUrl("/images/white-logo.svg")}
                alt="logo"
              />
            </Link>
            <Form className="login-form">
              <div className="row">
                <div className="col-sm-12 mar-bottom-8">
                  <Form.Item
                    className="form-group"
                    name="firstname"
                    rules={[
                      { required: true, message: "Please Enter Your Email!" },
                    ]}
                  >
                    <Input
                      placeholder="Email"
                      suffix={<MailOutlined className="iconDesing" />}
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
          {/* <div className="note w-100">
            <p>
              <Link to="/login" className="link">
                Back to login
              </Link>
            </p>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
