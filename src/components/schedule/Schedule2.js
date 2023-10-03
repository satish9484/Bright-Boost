import React from "react";
import Calendar from "react-calendar";
import { useState, useEffect } from "react";
import styles from "./style.scss";
import moment from "moment/moment";

import { db } from "../../firebase/firebase";
import {
	collection,
	getDocs,
	doc,
	addDoc,
	updateDoc,
	deleteDoc,
	query,
	where,
} from "firebase/firestore";

const Schedule2 = () => {
	const sample = {
		name: "John",
		email: "tutor@gmail.com",
		availabilityData: [
			{ date: "October 1, 2023", available: true },
			{ date: "October 2, 2023", available: true },
			{ date: "October 3, 2023", available: false },
			{ date: "2023-10-04", available: true },
			{ date: "2023-10-05", available: true },
			{ date: "2023-10-06", available: false },
			{ date: "2023-10-07", available: true },
			{ date: "2023-10-08", available: true },
			{ date: "2023-10-09", available: true },
			{ date: "2023-10-10", available: false },
			{ date: "2023-10-11", available: true },
			{ date: "2023-10-12", available: true },
			{ date: "2023-10-13", available: true },
			{ date: "2023-10-14", available: true },
			{ date: "2023-10-15", available: true },
			{ date: "2023-10-16", available: true },
			{ date: "2023-10-17", available: true },
			{ date: "2023-10-18", available: false },
			{ date: "2023-10-19", available: true },
			{ date: "2023-10-20", available: true },
			{ date: "2023-10-21", available: true },
			{ date: "2023-10-22", available: true },
			{ date: "2023-10-23", available: true },
			{ date: "2023-10-24", available: true },
			{ date: "2023-10-25", available: true },
			{ date: "2023-10-26", available: true },
			{ date: "2023-10-27", available: true },
			{ date: "2023-10-28", available: true },
			{ date: "2023-10-29", available: true },
			{ date: "2023-10-30", available: true },
			{ date: "2023-10-31", available: true },
		],
	};

	const [availabilityData, setAvailabilityData] = useState([]); // Array of availability data

	// chosen date will be stored here
	const [date, setDate] = useState(new Date());

	const func = async (date) => {
		const temp = moment(date).format("LL");
		console.log(typeof availabilityData.availabilityData);
		console.log(date + " date");
		console.log(temp + " temp");
	};

	//to check if date is if the sample
	const checkDate = (date) => {
		const temp = moment(date).format("LL");
		console.log(temp);
		const temp2 = sample.availabilityData[2].date;
		console.log(temp2);
		if (temp == temp2) {
			console.log("equals");
			console.log(sample.availabilityData[2].available);
		} else {
			console.log("not equals");
		}

		// if (date == undefined) {
		// 	console.log("still udnefined");
		// } else if (sample.availabilityData[0].date == date) {
		// 	console.log(date + " equal");
		// }
	};

	// // Fetch availability data from Firestore (assuming Firestore collection is named 'availability')
	// useEffect(() => {
	// 	//fetch from DB
	// 	const fetchData = async () => {
	// 		const querySnapshot = await getDocs(collection(db, "margarita-test"));
	// 		const data = querySnapshot.docs.map((doc) => {
	// 			// const id = doc.id; это дает айди из средней таблицы
	// 			const restOfData = doc.data();
	// 			// return { id, ...restOfData };
	// 			return { ...restOfData };
	// 		});
	// 		setAvailabilityData(data[0]); // THIS IS TEMPPORARY
	// 		// console.log("line 43 Rita here");
	// 		// console.log(data[0]);
	// 		// data.forEach((doc) => {
	// 		// console.log(doc);
	// 		// console.log(`${doc.id} => ${doc.availabilityData[0].date}`);
	// 		// console.log(`${doc.id} => ${doc.availabilityData[0].available}`);
	// 		// console.log(`${doc.id} => ${doc.name}`);
	// 		// console.log(`${doc.id} => ${doc.email}`);
	// 		// });
	// 	};
	// 	fetchData();
	// }, []); // Run once on component mount

	return (
		<div className="app">
			<h1 className="header">React Calendar</h1>
			<div className="calendar-container">
				<Calendar onChange={setDate} onClick={checkDate(date)} value={date} />
				{/* <Calendar onChange={func} value={date} /> */}
			</div>
			<div className="text-center">Selected date: {date.toDateString()}</div>
		</div>
	);
};

export default Schedule2;
