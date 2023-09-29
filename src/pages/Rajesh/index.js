import React from 'react';
// import { Link } from 'react-router-dom';
import { Button, Table, Form, Input, DatePicker, Select, Radio} from 'antd';
import { toAbsoluteUrl } from '../../utils';
import { useNavigate } from 'react-router-dom';
import './MyProfile.scss';
import Card from '../../components/common/Card';
import { collection, addDoc } from "firebase/firestore"; 
import { db } from "../../firebase/firebase";


  
  const App = () => {
    const handleCreate = async (values) => {
      try {
        // Use Firestore to add data to a collection (in this case, "students")
        const docRef = await addDoc(collection(db, "students"), {
          first: values.fname,
          last: values.lname,
          subject: values.radio, // Assuming you want to store the selected radio value
          dayOfWeek: values.select, // Assuming you want to store the selected day
          date: values.datePicker.format("YYYY-MM-DD"), // Assuming you want to store the selected date
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };
    
    return (
      <Form
  labelCol={{
    span: 4,
  }}
  wrapperCol={{
    span: 14,
  }}
  layout="horizontal"
  style={{
    maxWidth: 600,
  }}
  onFinish={handleCreate}
>
  <Form.Item label="SelectSubject " name="radio">
    <Radio.Group>
      <Radio value="maths"> Maths</Radio>
      <Radio value="science"> Science</Radio>
      <Radio value="english"> English</Radio>
    </Radio.Group>
  </Form.Item>
  <Form.Item label="SessionTime: " name="select">
    <Select>
      <Select.Option value="one">One Hour</Select.Option>
      <Select.Option value="two">Two Hour</Select.Option>
     
    </Select>
  </Form.Item>
  <Form.Item label="DatePicker: " name="datePicker">
    <DatePicker />
  </Form.Item>
  <Form.Item>
    <Button type="primary" htmlType="submit">
      Register
    </Button>
  </Form.Item>
</Form>

      
  )};
  export default App;

// const Rajesh = () => {

// 	const navigate = useNavigate();
// 	const dataSource = [
// 		{
// 		  key: '1',
// 		  name: 'Mike',
// 		  age: 32,
// 		  address: '10 Downing Street',
// 		},
// 		{
// 		  key: '2',
// 		  name: 'John',
// 		  age: 42,
// 		  address: '10 Downing Street',
// 		},
// 	  ];
	  
// 	  const columns = [
// 		{
// 		  title: 'Name',
// 		  dataIndex: 'name',
// 		  key: 'name',
// 		},
// 		{
// 		  title: 'Age',
// 		  dataIndex: 'age',
// 		  key: 'age',
// 		},
// 		{
// 		  title: 'Address',
// 		  dataIndex: 'address',
// 		  key: 'address',
// 		},
// 	  ];

// 	  const handleCreate  = async (values) => {
// 	  try {
// 		const docRef = await addDoc(collection(db, "users"), {
// 		  first: values.fname,
// 		  last: values.lname
// 		});
// 		console.log("Document written with ID: ", docRef.id);
// 	  } catch (e) {
// 		console.error("Error adding document: ", e);
// 	  }
// 	}

	
// 	return (
// 		<>
// 			<Form
//     			name="basic"
//     			labelCol={{ span: 8 }}
//     			wrapperCol={{ span: 16 }}
//     			style={{ maxWidth: 600 }}
//     			onFinish={handleCreate}
//   			>
//     		<Form.Item
//       			label="First name"
//       			name="fname"
//       			rules={[{ required: true, message: 'Please input your first name!' }]}
//     		>
//       			<Input />
//     		</Form.Item>

// 			<Form.Item
//       			label="Last name"
//       			name="lname"
//       			rules={[{ required: true, message: 'Please input your last name!' }]}
//     		>
//       			<Input />
//     		</Form.Item>

// 			<Button type="primary" htmlType="submit">
//         		Submit
//       		</Button>
// 			</Form>
// 		</>
// 	);
// }

// export default Rajesh;
