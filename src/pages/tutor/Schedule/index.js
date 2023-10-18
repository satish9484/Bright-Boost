import React, { useState, useEffect, useContext } from "react";
import "./style.scss";
import { db } from "../../../firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import dayjs from "dayjs";
import { Calendar, Radio, message } from "antd";
import { AuthContext } from "../../../context/AuthContext";

const Schedule = () => {
	const { currentUser } = useContext(AuthContext);

	const [value, setValue] = useState(() => dayjs("2023-10-01"));

	const [tutorEmail, setTutorEmail] = useState();

	//sanitise tutor email
	const removeSpecialCharacters = (email) => {
		return email.replace(/[^a-zA-Z0-9]/g, ""); // Regular expression to remove all special characters
	};

	// tutor FULL availability data for all subjects as {Subject1: {DDMMYYYY: true/false}, Subject2: {DDMMYYYY: true/false}}
	const [fullAvailabilityData, setFullAvailabilityData] = useState();

	// tutor availability data for a selected subject as {DDMMYYYY: true/false}
	const [availabilityData, setData] = useState([]);

	//   //tutor name
	const [tutorName, setName] = useState();

	//tutor subject which availability shoulbe be updated
	const [selectedSubject, setSelectedSubject] = useState();

	//all tutor subjects
	const [subjects, setSubjects] = useState([]);

	//to trigger fetchData()
	const [trigger, setTrigger] = useState(false);

	// subject selection to display availability accordingly
	const handleSubjectChange = (event) => {
		setSelectedSubject(event.target.value);
		const selectedSubject = event.target.value;

		// Get availability for the selected subject
		const availabilityForSelectedSubject =
			fullAvailabilityData[selectedSubject];
		setData(availabilityForSelectedSubject);
	};

	//to get tutor availability data on component mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				const docRef = doc(db, "Bright-Boost", "tutorsAvailability");
				const docSnap = await getDoc(docRef);
				const availabilityData = docSnap.data();
				const cleanedTutorEmail = removeSpecialCharacters(currentUser.email);
				setTutorEmail(cleanedTutorEmail);
				const tutorData = availabilityData[cleanedTutorEmail];

				setName(tutorData.Name);
				setFullAvailabilityData(tutorData.availabilityData);

				const allSubjects = Object.keys(tutorData.availabilityData);
				setSubjects(allSubjects);

				if (allSubjects.length > 0) {
					const firstSubject = allSubjects[0];

					setSelectedSubject(firstSubject);

					// Get availability for the first subject
					const availabilityForFirstSubject =
						tutorData.availabilityData[firstSubject];
					setData(availabilityForFirstSubject);
				} else {
					console.error("No subjects available.");
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, [trigger]); // Run on component mount and when updated availability submitted to DB

	const onSelect = (newValue) => {
		setValue(newValue);
	};

	const onPanelChange = (newValue) => {
		setValue(newValue);
	};

	//print tutor availability as "Available/Unavailable"
	const renderAvailability = (date, availability) => {
		if (date.day() === 0 || date.day() === 6) {
			return "Unavailable (Weekend)";
		}

		return availability ? "Unavailable" : "Available";
	};

	//toggle availsbility on click
	const toggleAvailability = (date) => {
		const dateString = date.format("DDMMYYYY");

		// Update availability for the clicked date
		const updatedAvailabilityData = {
			...availabilityData,
			[dateString]: !availabilityData[dateString],
		};
		// Update state with the updated availability data
		setData(updatedAvailabilityData);
	};

	//update tutor availability for a selected subject in DB on submit
	const updateAvailbility = async () => {
		try {
			const availabilityRef = doc(db, "Bright-Boost", "tutorsAvailability");
			const updatePath = `${tutorEmail}.availabilityData.${selectedSubject}`;
			const updateObject = {
				[updatePath]: availabilityData,
			};
			setTrigger(!trigger);
			await updateDoc(availabilityRef, updateObject);
			message.success("Availability successfully updated!");
		} catch (error) {
			message.error("Failed to update availability. Please try again.");
		}
	};

	return (
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
				onSelect={onSelect}
				onPanelChange={onPanelChange}
				cellRender={(date) => {
					const dateString = date.format("DDMMYYYY");
					const isAvailable = availabilityData[dateString]; // Check if date is available
					const isWeekend = date.day() === 0 || date.day() === 6; // 0 is Sunday, 6 is Saturday

					// Set weekends to always unavaiable
					const finalAvailability = isWeekend ? true : isAvailable;

					const cellStyle = {
						backgroundColor: finalAvailability ? "#b5372f" : "#53b563",
						padding: "8px",
						textAlign: "center",
					};

					return (
						<div
							style={cellStyle}
							onClick={() => {
								onSelect(date);
								toggleAvailability(date);
							}}
						>
							{`${renderAvailability(date, finalAvailability)} `}
						</div>
					);
				}}
			/>
			<div className="button-container">
				<button className="button-submit" onClick={updateAvailbility}>
					Submit
				</button>
			</div>
		</>
	);
};
export default Schedule;
