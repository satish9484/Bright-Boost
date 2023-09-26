import { useEffect, useState } from "react";
import { Table, Input, Row, Col, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  // arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  // updateDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import CustomModal from "../../../components/common/Modal";
import BreadCrumbs from "../../../components/common/Breadcrumbs";
import { db } from "../../../firebase/firebase";
import "./UserManagement.scss";

const { Search } = Input;

const list = [
  {
    name: "User Management",
    link: "/",
    isActive: true,
  },
];
const UserManagement = () => {
  useEffect(() => {
    // const addStudent = async () => {
    //   await updateDoc(doc(db, "Bright-Boost", "students"), {
    //     student: arrayUnion({
    //       activeSubscription: "6months",
    //       address: "2 First Street,Exp,Melbourne,VIC,3344",
    //       dateOfBirth: "02/06/1995",
    //       email: "abc@gmail.com",
    //       gender: "Male",
    //       imageURL:
    //         "https://firebasestorage.googleapis.com/v0/b/placement-app-862af.appspot.com/o/Notification_Image%2F1614771609186.jpg?alt=media&token=51a91456-eb56-4b0c-ba93-08adc066c264",
    //       name: "Naruto",
    //       phoneNumber: "04568789",
    //       status: "active",
    //       studentID: "45612366",
    //     }),
    //   });
    // };
    // const docSnap = async () => {
    //   const docRef = doc(db, "Bright-Boost", "students");
    //   const querySnapshot = await getDoc(docRef);
    //   if (querySnapshot.exists()) {
    //     console.log("Document data:", querySnapshot.data().student);
    //   } else {
    //     console.log("No such document!");
    //   }
    // };
    // docSnap();
  }, []);

  const onSearch = (value) => console.log(value);
  // const onChange = (checkedValues) => {
  //   console.log("checked = ", checkedValues);
  // };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "name",
      key: "name",
      render: (row) => (
        <div>
          <div>{row.name}</div>
        </div>
      ),
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
      render: (row) => (
        <div>
          <div>{row.emailaddress}</div>
        </div>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "number",
      key: "number",
      render: (row) => (
        <div>
          <div>{row.phonenumber}</div>
        </div>
      ),
    },
    {
      title: "Location  ",
      dataIndex: "location",
      key: "location",
      render: (row) => (
        <div>
          <div>{row.place}</div>
        </div>
      ),
    },
    {
      title: "Ad Posted",
      dataIndex: "ads",
      key: "ads",
      render: (row) => (
        <div>
          <div>{row.adposted}</div>
        </div>
      ),
    },
    {
      title: "User Verification",
      dataIndex: "verification",
      key: "verification",
      render: (_, { verification }) => {
        return verification.userverification === "verified" ? (
          <div className="verified verification">
            {verification.userverification}
          </div>
        ) : verification.userverification === "in review" ? (
          <div className="inReview verification">
            {verification.userverification}
          </div>
        ) : (
          <div className="verification">{verification.userverification}</div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <>
          <div className="d-flex">
            <div className="mar-right-8 cPointer">
              {" "}
              <Link to="/userManagement/edit">
                <EditOutlined style={{ fontSize: "20px", color: "black" }} />
              </Link>
            </div>
            <div onClick={showModal} className="cPointer">
              <DeleteOutlined style={{ fontSize: "20px" }} />
            </div>
          </div>
        </>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      name: { name: "Danesha Russ" },
      email: { emailaddress: "agileinfoways@gmail.com" },
      number: { phonenumber: 4578444242 },
      ads: { adposted: 1 },
      location: { place: "sarjah" },
      verification: { userverification: "verified" },
      tags: ["Active"],
    },
    {
      key: "2",
      name: { name: "William Korn unenrolled" },
      email: { emailaddress: "agileinfoways@gmail.com" },
      number: { phonenumber: 4578444242 },
      ads: { adposted: 1 },
      location: { place: "sarjah" },
      verification: { userverification: "in review" },
      tags: ["Inactive"],
    },
    {
      key: "3",
      name: { name: "Chakkira Wonnum" },
      email: { emailaddress: "agileinfoways@gmail.com" },
      number: { phonenumber: 4578444242 },
      ads: { adposted: 1 },
      location: { place: "sarjah" },
      verification: { userverification: "verified" },
      tags: ["Active"],
    },
    {
      key: "4",
      name: { name: "Paul Vines" },
      email: { emailaddress: "agileinfoways@gmail.com" },
      number: { phonenumber: 4578444242 },
      ads: { adposted: 1 },
      location: { place: "sarjah" },
      verification: { userverification: "in review" },
      tags: ["Inactive"],
    },
    {
      key: "5",
      name: { name: "Edward Canning" },
      email: { emailaddress: "agileinfoways@gmail.com" },
      number: { phonenumber: 4578444242 },
      ads: { adposted: 1 },
      location: { place: "sarjah" },
      verification: { userverification: "verified" },
      tags: ["Inactive"],
    },
    {
      key: "6",
      name: { name: "David Smith" },
      email: { emailaddress: "agileinfoways@gmail.com" },
      number: { phonenumber: 4578444242 },
      ads: { adposted: 1 },
      location: { place: "sarjah" },
      verification: { userverification: "verified" },
      tags: ["Inactive"],
    },
    {
      key: "7",
      name: { name: "Ann Hopkins" },
      email: { emailaddress: "agileinfoways@gmail.com" },
      number: { phonenumber: 4578444242 },
      ads: { adposted: 1 },
      location: { place: "sarjah" },
      verification: { userverification: "verified" },
      tags: ["Active"],
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    const docRef = doc(db, "Bright-Boost", "students");
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
      studentID: uuidv4(),
    };

    // Add the new student record to the "students" array within the document
    await setDoc(docRef, { students: [newStudentData] }, { merge: true });

    // Function to delete a student record by studentID
    const deleteStudentRecord = async (studentIDToDelete) => {
      // Reference the "Bright-Boost" collection
      const collectionRef = collection(db, "Bright-Boost");

      // Create a query to find the document with the matching studentID
      const q = query(
        collectionRef,
        where("students.studentID", "==", studentIDToDelete)
      );

      try {
        // Get the documents that match the query
        const querySnapshot = await getDocs(q);

        // Loop through the matching documents (there could be multiple if studentID is not unique)
        querySnapshot.forEach((docSnap) => {
          // Delete the document
          const docToDeleteRef = doc(db, "Bright-Boost", docSnap.id);
          deleteDoc(docToDeleteRef);
        });

        console.log(
          "Deleted student record(s) with studentID:",
          studentIDToDelete
        );
      } catch (error) {
        console.error("Error deleting student record:", error);
      }
    };

    // Example usage to delete a student record by studentID
    deleteStudentRecord("45612366");

    setIsModalOpen(false);

    const querySnapshot = await getDoc(docRef);
    if (querySnapshot.exists()) {
      console.log("Document data after ok data:", querySnapshot.data().student);
    } else {
      console.log("No such document!");
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <BreadCrumbs list={list} />
      <div className="user-management shadow-paper auto-height">
        <Row gutter={[{ xs: 0, sm: 0 }, { xs:12,sm: 12 }]} className="mar-bottom-20">
          <Col xl={12} lg={8} md={16} sm={24}>
            <div className="searchGrp">
              <Search
                placeholder="Search by name"
                size="large"
                onSearch={onSearch}
                className="search"
              />
            </div>
          </Col>
          <Col xl={12} lg={16} md={8} sm={24}>
            <Row justify="end">
              <Button type="primary">Add</Button>
            </Row>
          </Col>
        </Row>
        <Table columns={columns} dataSource={data} scroll={{ x: 980 }} />
      </div>
      <CustomModal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Are you sure you want to delete?</p>
      </CustomModal>
    </>
  );
};

export default UserManagement;
