import React from "react";
import { Button, Form, Image, Input } from "antd";
// import { v4 as uuidv4 } from "uuid";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import BreadCrumbs from "../../../../components/common/Breadcrumbs";
import Card from "../../../../components/common/Card";
import { db } from "../../../../firebase/firebase";
import "../../UserManagement/UserManagement.scss";
import { Link } from "react-router-dom";
// import { ProfileIcon } from "../../../../svg";

const list = [
  {
    name: "User Management",
    link: "/admin/userManagement",
    isActive: true,
  },
  {
    name: "Edit User Management",
    link: "/admin/userManagement/edit",
    isActive: false,
  },
];

const EditUserManagement = () => {
  // Function to update a student record by studentID
  const updateStudentRecord = async (studentIDToUpdate, updatedData) => {
    // Reference the "Bright-Boost" collection
    const collectionRef = collection(db, "Bright-Boost");

    // Create a query to find the document with the matching studentID
    const q = query(
      collectionRef,
      where("students.studentID", "==", studentIDToUpdate)
    );

    try {
      // Get the documents that match the query
      const querySnapshot = await getDocs(q);

      // Loop through the matching documents (there could be multiple if studentID is not unique)
      querySnapshot.forEach((docSnap) => {
        // Update the document with the new data
        const docToUpdateRef = doc(db, "Bright-Boost", docSnap.id);

        const updateObject = {
          "students.$.activeSubscription": updatedData.activeSubscription,
          "students.$.address": updatedData.address,
          "students.$.dateOfBirth": updatedData.dateOfBirth,
          "students.$.email": updatedData.email,
          "students.$.gender": updatedData.gender,
          "students.$.imageURL": updatedData.imageURL,
          "students.$.name": updatedData.name,
          "students.$.phoneNumber": updatedData.phoneNumber,
          "students.$.status": updatedData.status,
          "students.$.studentID": updatedData.studentID,
        };

        updateDoc(docToUpdateRef, updateObject);
      });

      console.log(
        "Updated student record(s) with studentID:",
        studentIDToUpdate
      );
    } catch (error) {
      console.error("Error updating student record:", error);
    }
  };

  const handleFinish = (values) => {
    console.log(values);
    // Data for the new student record
    const newStudentData = {
      activeSubscription: "6months",
      address: "2 First Street,Exp,Melbourne,VIC,3344",
      dateOfBirth: "02/06/1995",
      email: "abc@gmail.com",
      gender: "Male",
      imageURL:
        "https://firebasestorage.googleapis.com/v0/b/placement-app-862af.appspot.com/o/Notification_Image%2F1614771609186.jpg?alt=media&token=51a91456-eb56-4b0c-ba93-08adc066c264",
      name: "akshat",
      phoneNumber: "04568789",
      status: "active",
      studentID: "45612366",
    };
    updateStudentRecord("45612366", newStudentData);
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
              activeSubscription: "6months",
              address: "2 First Street,Exp,Melbourne,VIC,3344",
              dateOfBirth: "02/06/1995",
              email: "abc@gmail.com",
              gender: "Male",
              imageURL:
                "https://firebasestorage.googleapis.com/v0/b/placement-app-862af.appspot.com/o/Notification_Image%2F1614771609186.jpg?alt=media&token=51a91456-eb56-4b0c-ba93-08adc066c264",
              firstName: "akshat",
              lastName: "akshat",
              phoneNumber: "04568789",
              status: "active",
              studentID: "123456879",
            }}
          >
            <div className="row">
              {/* Forn Heading */}
              <div className="col-md-12">
                <h3 className="pageLabel mar-bottom-18">
                  Edit User Management
                </h3>
              </div>

              {/* Image */}
              <div className="col-12 d-flex justify-content-center">
                <Image
                  className="mar-bottom-10"
                  width={300}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
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

              {/* Action Buttons */}
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

export default EditUserManagement;
