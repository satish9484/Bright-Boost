import React, { useState, useEffect, useContext } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import dayjs from "dayjs";
import { Calendar, Radio } from "antd";
import moment from "moment";
import { toast } from "react-toastify";
import { db } from "../../../firebase/firebase";
import { AuthContext } from "../../../context/AuthContext";
import "./style.scss";

const Schedule = () => {
  const { currentUser } = useContext(AuthContext);

  // Initialize the end of the year for the valid date range
  const endOfYear = moment().endOf("year");
  const validRange = [moment(), endOfYear];

  // Helper function to remove special characters from an email
  const removeSpecialCharacters = (email) => {
    return email.replace(/[^a-zA-Z0-9]/g, "");
  };

  // Initialize state variables for tutor details and availability
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(() => dayjs("2023-10-01"));
  const [tutorEmail, setTutorEmail] = useState("");
  const [tutorName, setTutorName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [availabilityData, setAvailabilityData] = useState({});

  // Fetch tutor availability data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get tutor availability data from Firestore
        const docRef = doc(db, "Bright-Boost", "tutorsAvailability");
        const docSnap = await getDoc(docRef);
        const tutorAvailabilityData = docSnap?.data();

        // Clean the tutor's email for matching
        const cleanedTutorEmail = removeSpecialCharacters(currentUser?.email);
        setTutorEmail(cleanedTutorEmail);
        const tutorData = tutorAvailabilityData[cleanedTutorEmail];

        if (tutorData) {
          setTutorName(tutorData.Name);

          // Get and sort available subjects
          const tutorProfessionSubjects = Object.keys(
            tutorData.availabilityData
          );
          const sortedSubjects = tutorProfessionSubjects.sort();
          setSubjects(sortedSubjects);

          if (sortedSubjects.length > 0) {
            setSelectedSubject(sortedSubjects[0]);
          }
          setAvailabilityData(tutorData.availabilityData);
        }

        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [currentUser.email]);

  // Handle subject selection
  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  // Toggle tutor's availability for a selected date
  const toggleAvailability = (dateString) => {
    setAvailabilityData((prevData) => {
      const updatedAvailabilityData = {
        ...prevData,
        [selectedSubject]: {
          ...prevData[selectedSubject],
          [dateString]: !prevData[selectedSubject][dateString],
        },
      };
      return updatedAvailabilityData;
    });
  };

  // Update tutor's availability data in Firestore
  const updateAvailability = async () => {
    try {
      const availabilityRef = doc(db, "Bright-Boost", "tutorsAvailability");
      const updateObject = {
        [`${tutorEmail}.availabilityData.${selectedSubject}`]:
          availabilityData[selectedSubject],
      };
      await updateDoc(availabilityRef, updateObject);
      toast.success("Availability successfully updated!");
    } catch (error) {
      toast.error("Failed to update availability. Please try again.");
    }
  };

  return (
    <div>
      {loading ? (
        <div className="center" tip="Loading">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
            <div className={`wave wave-${index}`} key={index}></div>
          ))}
        </div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
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
            // validRange={validRange}
            onSelect={(newValue) => setValue(newValue)}
            cellRender={(date, info) => {
              const dateString = date.format("DDMMYYYY");
              const isAvailable =
                availabilityData[selectedSubject] &&
                availabilityData[selectedSubject][dateString];
              const isWeekend = date.day() === 0 || date.day() === 6;
              const isPastDate = dayjs(date).isBefore(dayjs(), "day");

              const cellStyle = {
                padding: "8px",
                textAlign: "center",
              };

              if (isPastDate) {
                cellStyle.backgroundColor = "";
              } else {
                if (isWeekend) {
                  cellStyle.backgroundColor = isAvailable
                    ? "#ebe5e5"
                    : "#f0f0f0";
                } else {
                  cellStyle.backgroundColor = isAvailable
                    ? "#22dc41"
                    : "#ebe5e5";
                }
              }

              const displayText = isPastDate
                ? ""
                : isWeekend
                ? "Weekend"
                : isAvailable
                ? "Available"
                : "Unavailable";

              return (
                <div
                  style={cellStyle}
                  onClick={() => {
                    if (!isPastDate) {
                      toggleAvailability(dateString);
                    }
                  }}
                >
                  {displayText}
                </div>
              );
            }}
          />

          <div className="button-container">
            <button className="button-submit" onClick={updateAvailability}>
              Update Availability
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Schedule;
