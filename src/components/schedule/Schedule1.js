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
			const querySnapshot = await getDocs(collection(db, "margarita-test"));
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
				// console.log(`${doc.id} => ${doc.availabilityData[0].date}`);
				// console.log(`${doc.id} => ${doc.availabilityData[0].available}`);
				// console.log(`${doc.id} => ${doc.name}`);
				// console.log(`${doc.id} => ${doc.email}`);
			});
		};
		fetchData();
	}, []); // Run once on component mount

	const toggleAvailability = async (date) => {
		console.log(date + " availabilty data line 75");
		// console.log(available + " availabilty data line 75");

		// const updatedAvailabilityData = availabilityData.map((day) => {
		// 	console.log(day + date + " = line 78");
		// 	console.log(day.availabilityData);
		// 	if (day.availabilityData.date == date) {
		// 		return { ...day, available: !day.available };
		// 	}
		// 	// console.log(day);

		// 	return day;
		// });
		console.log(" updatedAvailabilityData line 86");
		// console.log(updatedAvailabilityData[0]);
		// Update availability data in Firestore
		// await updateAvailabilityDataInFirestore(updatedAvailabilityData);
		console.log("updated availbility line 82");

		// setAvailabilityData(updatedAvailabilityData);
	};

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

// const navigate = useNavigate();

// useEffect(() => {
// 	fetchData();
// }, []);

// const createFormRef = React.createRef();

// const [api, contextHolder] = notification.useNotification();

// const queryResult = [];
// const [dataSource, setDataSource] = useState([]);
// const [isLoading, setIsLoading] = useState(true);
// const userPushed = {};
// var numUserPushed = 0;
// const orderPushed = {};

// const openNotification = (notifTitle, notifContent) => {
// 	api.open({
// 		message: notifTitle,
// 		description: notifContent,
// 	});
// };

//create a new schedule for a  tutor
const handleCreate = async () => {
	try {
		const docRef = await addDoc(collection(db, "margarita-test"), {
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
		});
		console.log("Document written with ID: ", docRef.id);
	} catch (e) {
		console.error("Error adding document: ", e);
	}
};

// async function fetchData() {
// 	await getDocs(query(collection(db, "margarita_test"))).then(
// 		async (userQuerySnapshot) => {
// 			if (queryResult.length == 0) {
// 				userQuerySnapshot.forEach(async (user) => {
// 					var userOrdersList = [];
// 					const orderQuery = query(
// 						collection(db, "margarita_test_2"),
// 						where("user_id", "==", user.id)
// 					);
// 					await getDocs(orderQuery).then(async (orderQuerySnapshot) => {
// 						orderQuerySnapshot.forEach((order) => {
// 							if (!orderPushed[order.id]) {
// 								userOrdersList.push({
// 									// id: order.id
// 									order_no: order.data().order_no,
// 									address: order.data().address,
// 									amount: order.data().amount,
// 								});
// 							}
// 							orderPushed[order.id] = 1;
// 						});
// 						if (!userPushed[user.id]) {
// 							queryResult.push({
// 								id: user.id,
// 								name: user.data().name,
// 								email: user.data().email,
// 								orders: userOrdersList,
// 								numOrders: userOrdersList.length,
// 							});
// 							userPushed[user.id] = 1;
// 							numUserPushed++;
// 							// console.log(userQuerySnapshot.docs.length);
// 							if (numUserPushed == userQuerySnapshot.docs.length) {
// 								setDataSource(queryResult);
// 								setIsLoading(false);
// 								// console.log(queryResult);
// 								// console.log(dataSrc);
// 								// console.log(isLoading);
// 							}
// 						}
// 					});
// 				});
// 			}
// 		}
// 	);
// }

//👇🏻 Logs the user's schedule to the console after setting the availability
// const handleSaveSchedules = () => {
// 	if (JSON.stringify(selectedTimezone) !== "{}") {
// 		console.log(schedule);
// 	} else {
// 		toast.error("Select your timezone");
// 	}
// };

// // tutor schedule
// const [schedule, setSchedule] = useState([
// 	{ day: "Mon", startTime: "", endTime: "" },
// 	{ day: "Tue", startTime: "", endTime: "" },
// 	{ day: "Wed", startTime: "", endTime: "" },
// 	{ day: "Thu", startTime: "", endTime: "" },
// 	{ day: "Fri", startTime: "", endTime: "" },
// 	{ day: "Sat", startTime: "", endTime: "" },
// 	{ day: "Sun", startTime: "", endTime: "" },
// ]);

// //👇🏻 This updates the schedule array with the start and end time.
// const handleTimeChange = (e, id) => {
// 	const { name, value } = e.target;
// 	if (value === "Select") return;
// 	const list = [...schedule];
// 	list[id][name] = value;
// 	setSchedule(list);
// };

export default Schedule1;
