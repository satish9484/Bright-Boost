import React, { useState, useEffect } from "react";
import "./style.scss";
import { db } from "../../../firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import dayjs from "dayjs";
import { Calendar } from "antd";

const Schedule = () => {
	const [value, setValue] = useState(() => dayjs("2023-10-01"));

	//   //tutor email (should be unique for every tutor)
	const tutorEmail = "tutor1gmailcom";

	// tutor availability data as {DDMMYYYY: true/false}
	const [availabilityData, setData] = useState([]);

	//   //tutor name
	const [tutorName, setName] = useState();

	//   //tutor subejct
	const [tutorSubject, setSubject] = useState();

	//to get tutor availability data on component mount
	useEffect(() => {
		const fetchData = async () => {
			const docRef = doc(db, "Bright-Boost", "tutorsAvailability");
			const docSnap = await getDoc(docRef);
			const availabilityData = docSnap.data();
			const tutorData = availabilityData[tutorEmail];
			console.log(tutorData);
			setSubject(tutorData.Subject);
			console.log(tutorData.Subject);
			setName(tutorData.Name);
			console.log(tutorData.Name);
			setData(tutorData.availabilityData);
			console.log(tutorData.availabilityData);
		};
		fetchData();
	}, []); // Run once on component mount

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

		return availability ? "Available" : "Unavailable";
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

	//update tutor availability in DB on submit
	const updateAvailbility = async () => {
		const availabilityRef = doc(db, "Bright-Boost", "tutorsAvailability");
		const updatePath = `${tutorEmail}.availabilityData`;
		const updateObject = {
			[updatePath]: availabilityData,
		};
		await updateDoc(availabilityRef, updateObject);
	};

	return (
		<>
			<h2 className="tutor-info">
				{tutorName} - {tutorSubject}
			</h2>
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
