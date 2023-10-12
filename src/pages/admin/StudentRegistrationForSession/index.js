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

const StudentRegistrationForSession = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const collectionName = "Bright-Boost";
  const documentId = "accounts";
  const docRef = doc(db, collectionName, documentId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const docData = docSnapshot.data();
          if (
            docData.hasOwnProperty("accounts") &&
            Array.isArray(docData.accounts)
          ) {
            const accountArray = docData.accounts;
            setData(accountArray);
          } else {
            setError("The 'accounts' field is missing or not an array.");
          }
        } else {
          setError("Document does not exist.");
        }
      } catch (error) {
        setError("Error fetching document: " + error.message);
      } finally {
        setLoading(false); // Set loading to false after data fetching is complete
      }
    };
    fetchData();
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

  const updateStudentStatus = async (email, newStatus) => {
    try {
      const updatedData = data.map((student) => {
        if (student.emailAddress === email) {
          return { ...student, active: newStatus };
        }
        return student;
      });

      await setDoc(docRef, { accounts: updatedData }, { merge: true });
      setData(updatedData);
    } catch (error) {
      console.error("Error updating student status:", error);
    }
  };

  const onSearch = (value) => console.log(value);
  // const onChange = (checkedValues) => {
  //   console.log("checked = ", checkedValues);
  // };

  const columns = [
    // ID
    {
      title: "Student Id",
      dataIndex: "id",
      key: "id",
      render: (row) => (
        <div>
          <div>{row}</div>
        </div>
      ),
    },
    // NAME
    {
      title: "Full Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (row) => (
        <div>
          <div>{row}</div>
        </div>
      ),
    },
    // Email
    {
      title: "Email",
      dataIndex: "emailAddress",
      key: "emailAddress",
      render: (row) => (
        <div>
          <div>{row}</div>
        </div>
      ),
    },
    // PHONE NUMBER
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (row) => (
        <div>
          <div>{row}</div>
        </div>
      ),
    },
    // LOCATION
    {
      title: "Location  ",
      dataIndex: "streetAddress",
      key: "streetAddress",
      render: (row) => (
        <div>
          <div>{row}</div>
        </div>
      ),
    },
    // COUNTRY
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (row) => (
        <div>
          <div>{row}</div>
        </div>
      ),
    },
    // USER STATUS
    {
      title: "User Status",
      dataIndex: "active",
      key: "active",
      render: (active, record) => {
        return (
          <div
            className={`${
              active ? "verified verification" : "verification inReview"
            } cPointer`}
            onClick={() => updateStudentStatus(record.emailAddress, !active)}
          >
            {active ? "Active" : "Inactive"}
          </div>
        );
      },
    },
    // ACTION
    {
      title: "Action",
      key: "action",
      render: () => (
        <>
          <div className="d-flex">
            <div className="mar-right-8 cPointer">
              {" "}
              <Link to="/admin/userManagement/edit">
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

  console.log(data);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <BreadCrumbs list={list} />
          <div className="user-management shadow-paper auto-height">
            <Row
              gutter={[
                { xs: 0, sm: 0 },
                { xs: 12, sm: 12 },
              ]}
              className="mar-bottom-20"
            >
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
                  <Button type="primary">
                    <Link to="/admin/userManagement/add">Add</Link>
                  </Button>
                </Row>
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={data.map((item) => ({
                ...item,
                key: item.id, // Assuming 'id' is a unique identifier
              }))}
              scroll={{ x: 980 }}
            />
          </div>
          <CustomModal
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <p>Are you sure you want to delete?</p>
          </CustomModal>
        </>
      )}
    </>
  );
};

export default StudentRegistrationForSession;
