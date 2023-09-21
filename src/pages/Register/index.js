import React, { useState, useEffect } from "react";
import { Button, Form, Input, Table, Spin, Space, Alert, Skeleton, Divider, Typography, notification, DatePicker, Radio, Select } from "antd";
import type { TabsProps } from 'antd';
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { toAbsoluteUrl } from "../../utils";
import { auth, database } from "../../firebase/firebase";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { get, ref } from "firebase/database";
import { db } from "../../firebase/firebase";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

import '../MyProfile/MyProfile.scss';
import Card from '../../components/common/Card';

const { Title, Paragraph, Text } = Typography;



const Register = () => {

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (notifTitle, notifContent) => {
	 api.open({
      		message: notifTitle,
      		description: notifContent,
    	});
  };

  const queryResult = [];
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 

  // console.log("Loading . . .");

  /*
  async function fetchData() {
	await getDocs(query(collection(db, "kenneth_test"))).then(async (userQuerySnapshot) => {
		if (queryResult.length == 0) {
		
		}
	})
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
      // Signed in 
	  //     const user = userCredential.user;
	  //         // ...
	  //           })
	  //             .catch((error) => {
	  //                 const errorCode = error.code;
	  //                     const errorMessage = error.message;
	  //                         // ..
	  //                           });}
  */
/*
  useEffect(() => {	
	fetchData();
  }, []);
*/

  const registerFormRef = React.createRef();
  const auth = getAuth();

  const handleRegister = async (values) => {
	setIsLoading(true);
	createUserWithEmailAndPassword(auth, values.emailAddress, values.password).then((userCredential) => {
    		const user = userCredential.user;
		setIsLoading(false);
		openNotification("Success", "Student registration is successful");
  	}).catch((error) => {
    		const errorCode = error.code;
    		const errorMessage = error.message;
		setIsLoading(false);
		openNotification("Failed", "Student registration is failed (" + errorCode + "): " + errorMessage);

  	});

	/*
  	try {
		await addDoc(collection(db, "brightboost_credential"), {
    			userName: values.userName,
    			password: values.password,
			role: "Student"
  		});
		
		setIsLoading(false);
		createFormRef.current.resetFields();
		openNotification("Success", "Student registration is successful");
	} catch (e) {
		setIsLoading(false);
		openNotification("Failed", "Student registration is failed: " + e);
	}
	*/
  } 

  // console.log(isLoading);
  if (isLoading) {
	return (
		<>
			{contextHolder}
			<Skeleton />	
		</>
	);
  }
  // console.log(dataSource); 
  return (
	<>
		{contextHolder}
	  	<div class="bg">	
	  		<Typography>
				<Title>{"Bright Boost - Student Registration"}</Title>
	  		</Typography>
	  		<Form
              		        labelCol={{ span: 8 }}
    				wrapperCol={{ span: 16 }}
    				style={{ maxWidth: 600 }}	
              			onFinish={handleRegister}
	  			ref={registerFormRef}
              		>
	  			
	  			<Form.Item
                    			label="E-mail Address"
	  				className="form-group"	
                    			name="emailAddress"
                    			rules={[
                      				{ required: true, message: "Please enter the e-mail address!" },
                    			]}
                  		>
                    			<Input />
                  		</Form.Item>
	
	  			<Form.Item
                    			label="Password"
	  				className="form-group"
                    			name="password"
                    			rules={[
                      				{ required: true, message: "Please enter the password!" },
                    			]}
                  		>
                    			<Input.Password />
                  		</Form.Item>
	  			<Form.Item
                    			label="Confirm Password"
	  				className="form-group"
                    			name="confirmPassword"
                    			rules={[
                      				{ required: true, message: "Please confirm the password!" },
                    			]}
                  		>
                    			<Input.Password />
                  		</Form.Item>

	  			<Form.Item
                    			label="First Name"
	  				className="form-group"
                    			name="firstName"
                    			rules={[
                      				{ required: true, message: "Please input your first name" },
                    			]}
                  		>
                    			<Input />
                  		</Form.Item>
	
				<Form.Item
                    			label="Last Name"	
	  				className="form-group"
                    			name="lastName"
                    			rules={[
                      				{ required: true, message: "Please input your last name" },
                    			]}
                  		>
                    			<Input />
                  		</Form.Item>

			 	<Form.Item
                    			label="Date of Birth"
	  				className="form-group"
                    			name="dateOfBirth"
                    			rules={[
                      				{ required: true, message: "Please input your date of birth" },
                    			]}
                  		>
                    			<DatePicker />
                  		</Form.Item>
					
				<Form.Item
                    			label="Gender"
	  				className="form-group"
                    			name="gender"
                    			rules={[
                      				{ required: true, message: "Please input your gender" },
                    			]}
                  		>
                    			<Radio.Group>
	  					<Radio value="F">Female</Radio>
	  					<Radio value="M">Male</Radio>
	  					<Radio value="O">Other</Radio>
	  				</Radio.Group>
                  		</Form.Item>
			
	  			<Form.Item
                    			label="Phone Number"
	  				className="form-group"	
                    			name="phoneNumber"
                    			rules={[
                      				{ required: true, message: "Please enter the phone number!" },
                    			]}
                  		>
                    			<Input />
                  		</Form.Item>
	
				<Form.Item
                    			label="Street Address"
	  				className="form-group"	
                    			name="streetAddress"                  		
	  			>
                    			<Input />
                  		</Form.Item>		
			
				<Form.Item
                    			label="City"
	  				className="form-group"
                    			name="city"
                      		>
                    			<Input />
                  		</Form.Item>

	  			<Form.Item
                    			label="Country"
	  				className="form-group"	
                    			name="country"
                    		>
                    			<Select placeholder="Please select a country">
        					<Select.Option value="Australia">Australia</Select.Option>
       						<Select.Option value="Other">Other</Select.Option>
      					</Select>		
                  		</Form.Item>	

	  			<Form.Item
                    			label="Postal code"
	  				className="form-group"	
                    			name="postCode"          		
				>
                    			<Input />
                  		</Form.Item>	

	  			<Button type="primary" htmlType="submit">Register</Button>
	  		</Form> 
	  	</div>
	  </>
  );
}

  export default Register;
