import React, { useState, useEffect } from "react";
import TimezoneSelect from "react-timezone-select";
import { useNavigate } from "react-router-dom";
import { time } from "./resource";
import { toast } from "react-toastify";
import { handleCreateSchedule } from "../temp/server";

// FRom kenneth

// import React, { useState, useEffect } from "react";
import {
	Button,
	Form,
	Input,
	Table,
	Spin,
	Space,
	Alert,
	Skeleton,
	Divider,
	Typography,
	notification,
	Tabs,
} from "antd";
// import type { TabsProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import "./style.scss";
import { toAbsoluteUrl } from "../../utils";
import { auth, database } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { get, ref } from "firebase/database";

import { db } from "../../firebase/firebase";
import {
	collection,
	getDocs,
	doc,
	setDoc,
	addDoc,
	updateDoc,
	deleteDoc,
	query,
	where,
} from "firebase/firestore";

//

const Schedule1 = () => {
	const [availabilityData, setAvailabilityData] = useState([]); // Array of availability data
	const [selectedDate, setSelectedDate] = useState(null); // Date selected by the user

	// Fetch availability data from Firestore (assuming Firestore collection is named 'availability')
	useEffect(() => {
		//fetch from DB
		const fetchData = async () => {
			const querySnapshot = await getDocs(collection(db, "Bright-Boost"));
			const data = querySnapshot.docs.map((doc) => {
				// const id = doc.id; это дает айди из средней таблицы
				const restOfData = doc.data();
				// return { id, ...restOfData };
				return { ...restOfData };
			});
			setAvailabilityData(data[0]); // THIS IS TEMPPORARY
			console.log("line 65 Rita here");
			console.log(data[0]);
			data.forEach((doc) => {
				console.log(doc);
			});
		};
		fetchData();
	}, []); // Run once on component mount

	const renderCalendar = () => {
		const startDate = new Date(); // You can set the start date based on your requirements
		startDate.setDate(1); // Start from the 1st day of the current month
		const endDate = new Date(startDate);
		endDate.setMonth(endDate.getMonth() + 1); // End at the 1st day of the next month

		const calendarRows = [];
		const currentDate = new Date(startDate);

		while (currentDate < endDate) {
			const formattedDate = `${currentDate.getFullYear()}-${
				currentDate.getMonth() + 1
			}-${currentDate.getDate()}`;

			calendarRows.push(
				<tr key={formattedDate}>
					<td
						onClick={() => toggleAvailability(formattedDate)}
						style={{
							cursor: "pointer",
							padding: "10px",
							border: "1px solid #ccc",
							// background: availabilityData.availabilityData.map(
							// 	(day) => day.date === formattedDate
							// )?.available
							// 	? "green"
							// 	: "red",
						}}
					>
						{currentDate.getDate()}
					</td>
				</tr>
			);

			currentDate.setDate(currentDate.getDate() + 1);
		}

		return (
			<table>
				<button onClick={handleCreate}>Submit</button>
				<thead>
					<tr>
						<th>Sun</th>
						<th>Mon</th>
						<th>Tue</th>
						<th>Wed</th>
						<th>Thu</th>
						<th>Fri</th>
						<th>Sat</th>
					</tr>
				</thead>
				<tbody>{calendarRows}</tbody>
			</table>
		);
	};

	return (
		<div>
			<h2>Availability Calendar</h2>
			{renderCalendar()}
		</div>
	);
};

//create a new schedule for a  tutor
const handleCreate = async () => {
	try {
		const docRef = await setDoc(doc(db, "Bright-Boost", "tutorsAvailability"), {
			tutorAvailability: {
				name: "John",
				email: "tutor@gmail.com",
				subject: "English",
				availabilityData: [
					{ date: "1 October, 2023", available: false },
					{ date: "2 October, 2023", available: true },
					{ date: "3 October, 2023", available: true },
					{ date: "4 October, 2023", available: true },
					{ date: "5 October, 2023", available: true },
					{ date: "6 October, 2023", available: true },
					{ date: "7 October, 2023", available: false },
					{ date: "8 October, 2023", available: false },
					{ date: "9 October, 2023", available: true },
					{ date: "10 October, 2023", available: true },
					{ date: "11 October, 2023", available: true },
					{ date: "12 October, 2023", available: true },
					{ date: "13 October, 2023", available: true },
					{ date: "14 October, 2023", available: false },
					{ date: "15 October, 2023", available: false },
					{ date: "16 October, 2023", available: true },
					{ date: "17 October, 2023", available: true },
					{ date: "18 October, 2023", available: true },
					{ date: "19 October, 2023", available: true },
					{ date: "20 October, 2023", available: true },
					{ date: "21 October, 2023", available: false },
					{ date: "22 October, 2023", available: false },
					{ date: "23 October, 2023", available: true },
					{ date: "24 October, 2023", available: true },
					{ date: "25 October, 2023", available: true },
					{ date: "26 October, 2023", available: true },
					{ date: "27 October, 2023", available: true },
					{ date: "28 October, 2023", available: false },
					{ date: "29 October, 2023", available: false },
					{ date: "30 October, 2023", available: true },
					{ date: "31 October, 2023", available: true },
				],
			},
		});
		console.log("Document written with ID: ", docRef.id);
	} catch (e) {
		console.error("Error adding document: ", e);
	}
};

export default Schedule1;
