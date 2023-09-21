import React, { useState, useEffect } from "react";
import { Button, Form, Input, Table, Spin, Space, Alert, Skeleton, Divider, Typography, notification, Tabs } from "antd";
import type { TabsProps } from 'antd';
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { toAbsoluteUrl } from "../../utils";
import { auth, database } from "../../firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { get, ref } from "firebase/database";
import { db } from "../../firebase/firebase";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

import '../MyProfile/MyProfile.scss';
import Card from '../../components/common/Card';

const { Title, Paragraph, Text } = Typography;



const KennethTest1 = () => {
  // const navigate = useNavigate();
  // const [err, setErr] = useState(false);

  // const dataSource = [];
	//
 // const [form] = Form.useForm(); 

  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (notifTitle, notifContent) => {
	 api.open({
      		message: notifTitle,
      		description: notifContent,
    	});
  };

  const queryResult = [];
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uid, setUid] = useState(null);
  const userPushed = {};
  var numUserPushed = 0;
  const orderPushed = {};

  const auth = getAuth();

  const columns_users = [
 	 {
		 title: 'ID',
		 dataIndex: 'id',
		 key: 'id'  
	 },
	 {
		 title: 'Name',
		 dataIndex: 'name',
		 key: 'name'
	 },
	 {
		 title: 'Email',
		 dataIndex: 'email',
		 key: 'email'
	 },
	 {
		 title: 'Number of Orders',
		 dataIndex: 'numOrders',
		 key: 'numOrders'
	 }
  ];

 const columns_orders = [
 	 {
		 title: 'Order No.',
		 dataIndex: 'order_no',
		 key: 'order_no'
 	 },
	 {
		 title: 'Address',
		 dataIndex: 'address',
		 key: 'address'
	 },
	 {
		 title: 'Amount',
		 dataIndex: 'amount',
		 key: 'amount'
	 }  
 ]; 
 

  onAuthStateChanged(auth, (user) => {
	  if (user) {
	  	setUid(user.uid);
		console.log("User details:");
		console.log(user);
	  }  
  });

  async function fetchData() {
	await getDocs(query(collection(db, "kenneth_test"))).then(async (userQuerySnapshot) => {
		if (queryResult.length == 0) {
			userQuerySnapshot.forEach(async (user) => {
				var userOrdersList = [];
				const orderQuery = query(collection(db, "kenneth_test_2"), where("user_id", "==", user.id)); 
				await getDocs(orderQuery).then(async (orderQuerySnapshot) => { 
					orderQuerySnapshot.forEach((order) => {
						if (!orderPushed[order.id]) {
							userOrdersList.push({
								// id: order.id
								order_no: order.data().order_no,
								address: order.data().address,
								amount: order.data().amount
							});
						}
						orderPushed[order.id] = 1;
					});
					if (!userPushed[user.id]) {
						queryResult.push({
		        				id: user.id,
							name: user.data().name,
							email: user.data().email,
							orders: userOrdersList,
							numOrders: userOrdersList.length
		    				});
						userPushed[user.id] = 1;
						numUserPushed++;
						// console.log(userQuerySnapshot.docs.length);
						if (numUserPushed == userQuerySnapshot.docs.length) {
							setDataSource(queryResult);
							setIsLoading(false);
							// console.log(queryResult);
							// console.log(dataSrc);
							// console.log(isLoading);
						}
					}					
				});
		    	});
		}
	})
  }

  useEffect(() => {	
	fetchData();
  }, []);

  const createFormRef = React.createRef();

  const handleCreate = async (values) => {
	//setIsLoading(true);
	
  	try {
		await addDoc(collection(db, "kenneth_test"), {
    			name: values.full_name,
    			email: values.email
  		});
		//setIsLoading(false);
		createFormRef.current.resetFields();
		fetchData();
		openNotification("Success", "Record addition is successful");
	} catch (e) {
		//setIsLoading(false);
		openNotification("Failed", "Record addition is failed: " + e);
	}
  }

  const handleUpdate = async (values) => {
  	const docRef = doc(collection(db, "kenneth_test"), values.id);
	try {
		await updateDoc(docRef, values);
		openNotification("Success", "Record update is successful");
	}
	catch (e) {
		openNotification("Failed", "Record update is failed: " + e);
	}
  }

  const handleDelete = async (values) => {	
	try {
		await deleteDoc(doc(collection(db, "kenneth_test"), values.id));
		openNotification("Success", "Record deletion with id " + values.id + " is successful");
	}
	catch (e) {
		openNotification("Failed", "Record deletion is failed: " + e);
	}
  }
 
  // console.log(isLoading);
  if (isLoading) {
	return (
		<Skeleton />	
	);
  }
  else if (!uid) {
	return (
		<>
			Please login before proceeding...
		</>
	);
  }
  // console.log(dataSource); 
  return (
	<>
	  	{contextHolder}
	  	<Typography>
	  		<Title>{"Kenneth's test CRUD page"}</Title>
	  		<Title level={2}>Reading record: Customers (users) and their online Orders</Title>
	  		<Table dataSource={dataSource} columns={columns_users} />
	  		{dataSource.map((user) => (
				<>
					<Title level={4}>{user.name}{"'s orders"}</Title>
					<Table dataSource={user.orders} columns={columns_orders} />
				</>
				
			))}
	  		<Title level={2}>Creating a record</Title>
	  	</Typography>
				
	  		<Form
              		        labelCol={{ span: 8 }}
    				wrapperCol={{ span: 16 }}
    				style={{ maxWidth: 600 }}	
              			onFinish={handleCreate}
	  			ref={createFormRef}
              		>
	  		
	  			<Form.Item
                    			label="Full Name"
	  				className="form-group"	
                    			name="full_name"
                    			rules={[
                      				{ required: true, message: "Please enter the full name!" },
                    			]}
                  		>
                    			<Input />
                  		</Form.Item>
	  			<Form.Item
                    			label="Email"
	  				className="form-group"
                    			name="email"
                    			rules={[
                      				{ required: true, message: "Please enter the email!" },
                    			]}
                  		>
                    			<Input />
                  		</Form.Item>
	  			<Button type="primary" htmlType="submit">Create</Button>
	  		</Form>
	  		
	  		
	  	<Typography>
	  		<Title level={2}>Updating a record</Title>
		</Typography>
	  		<Form
              		        labelCol={{ span: 8 }}
    				wrapperCol={{ span: 16 }}
    				style={{ maxWidth: 600 }}	
              			onFinish={handleDelete}
              		>
	  			<Form.Item
                    			label="Doc ID"
	  				className="form-group"	
                    			name="id"
                    			rules={[
                      				{ required: true, message: "Please enter the document ID!" },
                    			]}
                  		>
                    			<Input />
                  		</Form.Item> 			
	  			<Form.Item
                    			label="Full Name"
	  				className="form-group"	
                    			name="name"
                    			rules={[
                      				{ required: true, message: "Please enter the full name!" },
                    			]}
                  		>
                    			<Input />
                  		</Form.Item>
	  			<Form.Item
                    			label="Email"
	  				className="form-group"
                    			name="email"
                    			rules={[
                      				{ required: true, message: "Please enter the email!" },
                    			]}
                  		>
                    			<Input />
                  		</Form.Item>
	  			<Button type="primary" htmlType="submit">Update</Button>
	  		</Form>
			<Typography>
	  			<Title level={2}>Deleting a record</Title>
			</Typography>
	  		<Form
              		        labelCol={{ span: 8 }}
    				wrapperCol={{ span: 16 }}
    				style={{ maxWidth: 600 }}	
              			onFinish={handleDelete}
              		>
	  			<Form.Item
                    			label="Doc ID"
	  				className="form-group"	
                    			name="id"
                    			rules={[
                      				{ required: true, message: "Please enter the document ID!" },
                    			]}
                  		>
                    			<Input />
                  		</Form.Item> 	  			
	  			<Button type="primary" htmlType="submit">Delete</Button>
	  		</Form>
	
	  </>
  );
}

  export default KennethTest1;
