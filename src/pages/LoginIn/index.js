import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import { toAbsoluteUrl } from "../../utils";
import { setUser } from "../../Redux/AuthSlice";
import { useDispatch } from "react-redux";
import { auth, database } from "../../firebase/firebase";
import { get, ref, set } from "firebase/database";
import { signInWithEmailAndPassword } from "firebase/auth";
const LoginIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleFinish = async (values) => {
    await signInWithEmailAndPassword(
      auth,
      values.email.trim(),
      values.password.trim()
    )
      .then(async (userCredential) => {
        dispatch(setUser(userCredential?.user));
        navigate("/dashboard");

        const uid = userCredential.user.uid;

        try {
          const userRef = ref(database, `users/${uid}`);
          await set(userRef, { role: "admin" });
          console.log("Role updated successfully");
        } catch (error) {
          console.error("Error updating role:", error.message);
        }

        try {
          const userRef = ref(database, `users/${uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const userRole = userData.role;
            console.log(userRole);
          } else {
            console.log("User data not found");
          }
        } catch (error) {
          console.error("Error fetching role:", error.message);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("User login ErrorCode " + errorCode);
        console.log("User login  Error Message " + errorMessage);
        // setErr(true);
      });
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
