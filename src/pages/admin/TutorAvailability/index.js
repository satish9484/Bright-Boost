import React, { useEffect, useState } from "react";
import { Badge, Calendar, Col, Row, Select } from "antd";
import moment from "moment";
import BreadCrumbs from "../../../components/common/Breadcrumbs";
import { db } from "../../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./style.scss";

const { Option } = Select;

// Define a list of navigation items for breadcrumbs
const breadcrumbsList = [
  {
    name: "Tutor Availability",
    link: "/admin/tutoravailability",
    isActive: false,
  },
];

// Available subjects
const subjects = [
  "English",
  "Mathematics",
  "Science",
  "Humanities and Social Sciences",
  "The Arts",
];

// Tutors by subject
const tutorsBySubject = {
  English: [],
  Mathematics: [],
  Science: [],
  "Humanities and Social Sciences": [],
  "The Arts": [],
};

// Firebase collection and document details
const collectionName = "Bright-Boost";
const documentId = "tutorsAvailability";
const endOfYear = moment().endOf("year");
const validRange = [moment(), endOfYear];

const docRef = doc(db, collectionName, documentId);

const TutorAvailability = () => {
  const [selectedSubject, setSelectedSubject] = useState("English");
  const [tutorListForSubject, setTutorListForSubject] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState("");
  const [avabilty, setAvabilty] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docSnapshot = await getDoc(docRef);

        if (!docSnapshot.exists()) {
          console.log("Document doesn't exist.");
          setLoading(false); // Data loading is complete
          return tutorsBySubject;
        }

        const data = docSnapshot.data();

        if (!data || !Object.keys(data).length) {
          console.log("No data to process.");
          setLoading(false); // Data loading is complete
          return tutorsBySubject;
        }

        for (const [tutorEmail, tutorInfo] of Object.entries(data)) {
          const tutorName = tutorInfo?.Name;
          const tutorProfessionalSubject = tutorInfo?.availabilityData;

          for (const subjectName of Object.keys(tutorProfessionalSubject)) {
            if (subjects.includes(subjectName)) {
              if (!tutorsBySubject[subjectName]) {
                tutorsBySubject[subjectName] = [];
              }

              const existingTutor = tutorsBySubject[subjectName].find(
                (tutor) => tutor.email === tutorEmail
              );

              if (!existingTutor) {
                tutorsBySubject[subjectName].push({
                  name: tutorName,
                  email: tutorEmail,
                });
              }
            }
          }
        }

        setLoading(false); // Data loading is complete
      } catch (error) {
        setError("Error fetching data from Firestore: " + error.message);
        setLoading(false); // Data loading is complete
      }
    };

    fetchData();

    const tutorInfo = tutorsBySubject[selectedSubject]?.find(
      (tutor) => tutor.name === selectedTutor
    );
    if (tutorInfo) {
      tutorsAvailability(tutorInfo.email);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubject, selectedTutor]);

  useEffect(() => {
    const tutors = tutorsBySubject[selectedSubject];
    console.log(tutors);
    setTutorListForSubject(tutors);
    setSelectedTutor(tutors[0]?.name);
  }, [selectedSubject]);

  // Function to check tutor availability on a specific date
  const tutorsAvailability = async (tutorId) => {
    try {
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot?.exists()) {
        const data = docSnapshot?.data();
        const availabilityData = data[tutorId]?.availabilityData;
        setAvabilty(availabilityData[selectedSubject] || {});
      }
    } catch (error) {
      setError("Error fetching data from Firestore: " + error.message);
    }
  };

  // Function to handle subject change
  const handleSubjectChange = (value) => {
    if (value in tutorsBySubject) {
      const tutors = tutorsBySubject[value];
      console.log(tutors);
      setTutorListForSubject(tutors);
      setSelectedTutor(tutors[0]?.name);
    }
    setSelectedSubject(value);

    tutorsAvailability("tutor1gmailcom");
  };

  const handleTutorNameChange = (value) => {
    setSelectedTutor(value);
  };

  const dateCellRender = (value) => {
    const today = moment(); // Get the current date
    const listData = getListData(value);

    // Check if the date is in the past
    if (value.isBefore(today, "day")) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            border: "1px solid #ccc",
          }}
        >
          {/* No data to display for past dates */}
        </div>
      );
    }

    const availability = listData[0]; // Assuming there's only one event per date

    const cellStyle = {
      width: "100%",
      height: "100%",
      backgroundColor:
        availability && availability.type === "success" ? "white" : "#8eff8e",
      border: "1px solid #ccc",
    };

    return (
      <div style={cellStyle}>
        <ul className="events">
          {availability && (
            <li key={availability.content}>
              <Badge status={availability.type} text={availability.content} />
            </li>
          )}
        </ul>
      </div>
    );
  };

  // Function to retrieve data for a specific month
  // const monthCellRender = (value) => {
  //   const num = getMonthData(value);
  //   return num ? (
  //     <div className="notes-month">
  //       <section>{num}</section>
  //       <span>Backlog number</span>
  //     </div>
  //   ) : null;
  // };

  // Function to render the Calendar cells
  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    // if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  const getListData = (value) => {
    const dateKey = value.format("DDMMYYYY"); // Convert the date to a key in the format DDMMYY
    const isAvailable = avabilty[dateKey?.toString()];

    if (value.isBefore(moment(), "day")) {
      // Date is in the past
      return [
        {
          type: "error",
          content: "Unavailable",
        },
      ];
    }

    if (isAvailable === true) {
      return [
        {
          type: "success",
          content: "Available",
        },
      ];
    } else if (isAvailable === false) {
      return [
        {
          type: "error",
          content: "Unavailable",
        },
      ];
    } else {
      return [
        {
          type: "error",
          content: "Unavailable",
        },
      ];
    }
  };

  return (
    <>
      <BreadCrumbs list={breadcrumbsList} />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        // Display error state
        <div>Error: {error}</div>
      ) : (
        <Row
          gutter={[
            { xs: 0, sm: 0 },
            { xs: 12, sm: 12 },
          ]}
          className="mar-bottom-20"
        >
          <Col xl={12} lg={8} md={16} sm={24}>
            <Select
              className="w-100"
              placeholder="Select Subject"
              onChange={handleSubjectChange}
              value={selectedSubject}
            >
              {subjects.map((subject) => (
                <Option key={subject} value={subject}>
                  {subject}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xl={12} lg={16} md={8} sm={24}>
            <Select
              className="w-100 pad-left"
              placeholder="Tutor Names"
              onChange={handleTutorNameChange}
              value={selectedTutor}
            >
              {tutorListForSubject.map((tutor, i) => (
                <Option key={i} value={tutor.name}>
                  {tutor.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      )}
      <Calendar cellRender={cellRender} validRange={validRange} />
    </>
  );
};

export default TutorAvailability;
