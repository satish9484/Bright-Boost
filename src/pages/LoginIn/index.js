import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import { toAbsoluteUrl } from "../../utils";
import { setUser } from "../../Redux/AuthSlice";
import { useDispatch } from "react-redux";
import { auth, db } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
const LoginIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const COLLECTION_NAME = "Bright-Boost";
  const DOCUMENT_ID = "users";

  // Function to fetch a user's role by email
  const fetchUserRoleByEmail = async (email) => {
    console.log(email);
    try {
      // Reference to the user document
      const userDocRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const roleArray = userData.role || []; // Assuming "roleArray" is the name of your array field

        const userRole = roleArray.find((entry) => entry.email === email);

        if (userRole) {
          const userRoleName = userRole.userRole;
          return userRoleName;
        } else {
          throw new Error(`User with email ${email} not found.`);
        }
      } else {
        throw new Error("Document does not exist.");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      throw error;
    }
  };

  const handleFinish = async (values) => {
    await signInWithEmailAndPassword(
      auth,
      values.email.trim(),
      values.password.trim()
    )
      .then(async (userCredential) => {
        dispatch(setUser(userCredential?.user));

        fetchUserRoleByEmail(userCredential?.user?.email)
          .then((userRoleName) => {
            // console.log(
            //   `User role for ${userCredential?.user?.email}: ${userRoleName}`
            // );

            userRoleName === "admin"
              ? navigate("/admin/dashboard")
              : userRoleName === "student"
              ? navigate("/student/dashboard")
              : userRoleName === "tutor"
              ? navigate("/tutor/dashboard")
              : navigate("/dashboard");
          })
          .catch((error) => {
            console.error("Failed to fetch user role:", error);
          });

        // try {
        //   const userRef = ref(database, `users/${uid}`);
        //   await set(userRef, { role: "admin" });
        //   console.log("Role updated successfully");
        // } catch (error) {
        //   console.error("Error updating role:", error.message);
        // }

        /* as we will be using firestore database for all information, including the role information, this part will soon be replace */
        /* START */
        /*
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
	*/
        /* END */
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
              initialValues={{ email: "student@gmail.com", password: "123456" }}
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

            <Link to="/register" className="f-pwd">
              {" "}
              Don't have an Account?{" "}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginIn;
