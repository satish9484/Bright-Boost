import React, { useState, useEffect } from "react";
import styles from "./style.scss";
import { db } from "../../firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const Schedule = () => {
	// availability data as {date: DD Month YY, available: true}
	const [data, setData] = useState([]);

	//tutor name
	const [tutorName, setName] = useState();

	//tutor subejct
	const [tutorSubject, setSubject] = useState();

	//update availability on click, data stored in state
	const toggleAvailability = (index) => {
		const updatedData = [...data];
		updatedData[index].available = !updatedData[index].available;
		setData(updatedData);
	};

	// to get the day of the week for a given date
	const getDayOfWeek = (dateString) => {
		const date = new Date(dateString);
		const options = {
			weekday: "long",
			day: "2-digit",
			month: "long",
			year: "numeric",
		};
		return date.toLocaleDateString("en-AU", options);
	};

	//update tutor availability in DB on submit
	const updateAvailbility = async () => {
		const availabilityRef = doc(db, "Bright-Boost", "tutorsAvailability");
		await updateDoc(availabilityRef, {
			"tutorAvailability.availabilityData": data,
		});
	};

	// //to render tutor availability data on component mount
	useEffect(() => {
		const fetchData = async () => {
			const docRef = doc(db, "Bright-Boost", "tutorsAvailability");
			const docSnap = await getDoc(docRef);
			const data = docSnap.data().tutorAvailability;
			setSubject(data.subject);
			setName(data.name);
			setData(data.availabilityData);
		};
		fetchData();
	}, []); // Run once on component mount

	return (
		<div>
			<div>
				<h2>
					{tutorName} - {tutorSubject}
				</h2>
			</div>
			<div className="calendar">
				{data.map((day, index) => {
					const date = new Date(day.date);
					const dayOfWeek = getDayOfWeek(day.date);
					const cellClassName = day.available ? "available" : "unavailable";

					return (
						<div
							key={day.date}
							className={`calendar-cell ${cellClassName}`}
							onClick={() => toggleAvailability(index)}
						>
							<div className="day-of-week">{dayOfWeek}</div>
						</div>
					);
				})}
			</div>
			<button onClick={updateAvailbility}>Submit my Availability</button>
		</div>
	);
};

export default Schedule;
