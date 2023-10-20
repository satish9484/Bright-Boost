import React, { useState, useEffect, useContext } from "react";
import "./style.scss";
import { db } from "../../../firebase/firebase";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import dayjs from "dayjs";
import { Calendar, Radio, message } from "antd";
import { AuthContext } from "../../../context/AuthContext";

const Schedule = () => {
  const { currentUser } = useContext(AuthContext);

  const [value, setValue] = useState(() => dayjs("2023-10-01"));
  const [tutorEmail, setTutorEmail] = useState();
  const [tutorName, setTutorName] = useState();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState();
  const [availabilityData, setAvailabilityData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "Bright-Boost", "tutorsAvailability");
        const docSnap = await getDoc(docRef);
        const availabilityData = docSnap.data();
        const cleanedTutorEmail = removeSpecialCharacters(currentUser.email);
        setTutorEmail(cleanedTutorEmail);
        const tutorData = availabilityData[cleanedTutorEmail];

        setTutorName(tutorData.Name);
        setSubjects(Object.keys(tutorData.availabilityData));
        setAvailabilityData(tutorData.availabilityData);

        if (subjects.length > 0) {
          setSelectedSubject(subjects[0]);
        } else {
          console.error("No subjects available.");
        }

        // Check if availabilityData[selectedSubject] is undefined and set it to default if not available
        if (!availabilityData[selectedSubject]) {
          availabilityData[selectedSubject] = {};
          setAvailabilityData(availabilityData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [currentUser.email, selectedSubject]);

  const removeSpecialCharacters = (email) => {
    return email.replace(/[^a-zA-Z0-9]/g, "");
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const toggleAvailability = (dateString) => {
    const updatedAvailabilityData = { ...availabilityData };
    updatedAvailabilityData[selectedSubject][dateString] =
      !updatedAvailabilityData[selectedSubject][dateString];
    setAvailabilityData(updatedAvailabilityData);
  };

  const updateAvailability = async () => {
    try {
      const availabilityRef = doc(db, "Bright-Boost", "tutorsAvailability");
      const updateObject = {
        [`${tutorEmail}.availabilityData.${selectedSubject}`]:
          availabilityData[selectedSubject],
      };
      await updateDoc(availabilityRef, updateObject);
      message.success("Availability successfully updated!");
    } catch (error) {
      message.error("Failed to update availability. Please try again.");
    }
  };

  const renderAvailability = (date) => {
    if (date.day() === 0 || date.day() === 6) {
      return "Unavailable (Weekend)";
    }

    const dateString = date.format("DDMMYYYY");
    const isAvailable = availabilityData[selectedSubject]?.[dateString];
    return isAvailable ? "Available" : "Unavailable";
  };

  return (
    <div>
      <h2 className="tutor-info">{tutorName}</h2>

      <Radio.Group onChange={handleSubjectChange} value={selectedSubject}>
        {subjects.map((subject) => (
          <Radio key={subject} value={subject}>
            {subject}
          </Radio>
        ))}
      </Radio.Group>

      <Calendar
        value={value}
        onSelect={(newValue) => setValue(newValue)}
        cellRender={(date) => {
          const dateString = date.format("DDMMYYYY");
          const isAvailable = availabilityData[selectedSubject]?.[dateString];
          const isWeekend = date.day() === 0 || date.day() === 6;

          const cellStyle = {
            backgroundColor: isWeekend
              ? "#b5372f"
              : isAvailable
              ? "#22dc41"
              : "#ebe5e5",
            padding: "8px",
            textAlign: "center",
            cursor: "pointer",
          };

          return (
            <div
              style={cellStyle}
              onClick={() => {
                toggleAvailability(dateString);
              }}
            >
              {`${renderAvailability(date)}`}
            </div>
          );
        }}
      />
      <div className="button-container">
        <button className="button-submit" onClick={updateAvailability}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Schedule;
