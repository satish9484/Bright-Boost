import React, { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../../../../firebase/firebase";
import { Button, Form, Upload, Image, Input } from "antd";
import { Link } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import BreadCrumbs from "../../../../components/common/Breadcrumbs";
import "../../UserManagement/UserManagement.scss";
import Card from "../../../../components/common/Card";

const initialStudentData = {
  activeSubscription: "6months",
  address: "2 First Street,Exp,Melbourne,VIC,3344",
  dateOfBirth: "02/06/1995",
  email: "abc@gmail.com",
  gender: "Male",
  imageURL: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  status: "active",
  studentID: uuidv4(),
};

const list = [
  { name: "User Management", link: "/admin/userManagement", isActive: true },
  { name: "Add New User", link: "/admin/userManagement/add", isActive: false },
];

const AddUserManagement = () => {
  const collectionName = "Bright-Boost";
  const documentId = "students";

  const [newStudent, setNewStudent] = useState(initialStudentData);

  const addNewStudentRecord = async () => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, { student: arrayUnion(newStudent) });
      console.log("Student record added successfully!");
    } catch (error) {
      console.error("Error adding student record: ", error);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const storageRef = ref(storage, `images/${file.name}`);

      // Upload the file to the specified storage location
      await uploadBytes(storageRef, file);

      // Handle upload completion here
      const downloadURL = await getDownloadURL(storageRef);
      setNewStudent({
        ...newStudent,
        imageURL: downloadURL,
      });
    } catch (error) {
      console.error("Error handling image upload: ", error);
    }
  };

  const handleFinish = (values) => {
    const firstName = values?.firstName;
    const lastName = values?.lastName;

    // Check if either first name or last name is provided
    if (firstName || lastName) {
      const fullName = [firstName, lastName].filter(Boolean).join(" ");
      console.log(fullName);
      setNewStudent({
        firstName: values?.firstName,
        lastName: values?.firstName,
        ...newStudent,
      });

      addNewStudentRecord();
    } else {
      // Display an error message or handle the case where both first name and last name are empty
      console.error("Both first name and last name are empty.");
    }
  };

  const customRequest = ({ file, onSuccess, onError }) => {
    handleImageUpload(file)
      .then(() => {
        onSuccess();
      })
      .catch((error) => {
        onError(error);
      });
  };

  return (
    <>
      <div className="editUserManagement">
        <BreadCrumbs list={list} />
        <Card>
          <Form
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              ...initialStudentData,
              firstName: "car",
              lastName: "test",
            }}
          >
            <div className="row">
              <div className="col-md-12">
                <h3 className="pageLabel mar-bottom-18">Add New User</h3>
              </div>
              <div className="col-12 d-flex justify-content-center">
                <Image
                  className="mar-bottom-10"
                  width="60%"
                  height={400}
                  src={
                    newStudent?.imageURL ||
                    "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  }
                />
              </div>
              <div className="col-12 d-flex justify-content-center">
                <Form.Item
                  name="image"
                  valuePropName="fileList"
                  getValueFromEvent={(e) =>
                    Array.isArray(e) ? e : e && e.fileList
                  }
                  initialValue={[]}
                >
                  <Upload listType="picture-card" customRequest={customRequest}>
                    Upload
                  </Upload>
                </Form.Item>
              </div>

              {/* Student Id */}
              <div className="col-xl-6 col-md-8">
                <Form.Item
                  className="form-group"
                  label="Student Id"
                  labelWrap={true}
                  name="studentID"
                >
                  <Input />
                </Form.Item>
              </div>

              {/* First Name */}
              <div className="col-xl-6 col-md-8">
                <Form.Item
                  className="form-group"
                  label="First Name"
                  labelWrap={true}
                  name="firstName"
                  rules={[
                    { required: true, message: "Please enter First Name" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              {/* Last Name */}
              <div className="col-xl-6 col-md-8">
                <Form.Item
                  className="form-group"
                  label="Last Name"
                  labelWrap={true}
                  name="lastName"
                  rules={[
                    { required: true, message: "Please enter Last Name" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              {/* Contact Number */}
              <div className="col-xl-6 col-md-8">
                <Form.Item
                  className="form-group"
                  label="Contact Number"
                  labelWrap={true}
                  name="phoneNumber"
                >
                  <Input />
                </Form.Item>
              </div>

              {/* Email */}
              <div className="col-xl-6 col-md-8">
                <Form.Item
                  className="form-group"
                  label="Email"
                  labelWrap={true}
                  name="email"
                  rules={[
                    { required: true, message: "Please enter email address" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              {/* Status */}
              <div className="col-xl-6 col-md-8">
                <Form.Item
                  className="form-group"
                  label="Status"
                  labelWrap={true}
                  name="status"
                >
                  <Input />
                </Form.Item>
              </div>

              {/* Subscription period */}
              <div className="col-xl-6 col-md-8">
                <Form.Item
                  className="form-group"
                  label="Subscription Period"
                  labelWrap={true}
                  name="activeSubscription"
                >
                  <Input />
                </Form.Item>
              </div>

              {/* Address */}
              <div className="col-xl-6 col-md-8">
                <Form.Item
                  className="form-group"
                  label="Address"
                  labelWrap={true}
                  name="address"
                >
                  <Input />
                </Form.Item>
              </div>

              {/* Gender */}
              <div className="col-xl-6 col-md-8">
                <Form.Item
                  className="form-group"
                  label="Gender"
                  labelWrap={true}
                  name="gender"
                >
                  <Input />
                </Form.Item>
              </div>

              {/* DateOfBirth */}
              <div className="col-xl-6 col-md-8">
                <Form.Item
                  className="form-group"
                  label="Date Of Birth"
                  labelWrap={true}
                  name="dateOfBirth"
                >
                  <Input />
                </Form.Item>
              </div>

              <div className="col-xl-12 d-flex justify-content-end mar-top-8">
                <Button className="mar-right-8">
                  <Link to="/admin/userManagement">Cancel</Link>
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

export default AddUserManagement;
