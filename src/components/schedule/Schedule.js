import React, { useEffect } from "react";
import styles from "./style.scss";
import { useState } from "react";

const Schedule = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		setData(availabilityData);
	}, []);

	const availabilityData = [
		{ date: "October 1, 2023", available: false },
		{ date: "October 2, 2023", available: true },
		{ date: "October 3, 2023", available: true },
		{ date: "2023-10-04", available: true },
		{ date: "2023-10-05", available: true },
		{ date: "2023-10-06", available: true },
		{ date: "2023-10-07", available: true },
		{ date: "2023-10-08", available: true },
		{ date: "2023-10-09", available: true },
		{ date: "2023-10-10", available: true },
		{ date: "2023-10-11", available: true },
		{ date: "2023-10-12", available: true },
		{ date: "2023-10-13", available: true },
		{ date: "2023-10-14", available: true },
		{ date: "2023-10-15", available: true },
		{ date: "2023-10-16", available: true },
		{ date: "2023-10-17", available: true },
		{ date: "2023-10-18", available: true },
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
	];

	const toggleAvailability = (index) => {
		const updatedData = [...data];
		updatedData[index].available = !updatedData[index].available;
		setData(updatedData);
	};

	// Helper function to get the day of the week for a given date
	// const getDayOfWeek = (dateString) => {
	// 	const date = new Date(dateString);
	// 	const daysOfWeek = [
	// 		"Monday",
	// 		"Tuesday",
	// 		"Wednesday",
	// 		"Thursday",
	// 		"Friday",
	// 		"Saturday",
	// 		"Sunday",
	// 	];
	// 	return daysOfWeek[date.getDay()];
	// };
	const getDayOfWeek = (dateString) => {
		const date = new Date(dateString);
		const options = {
			weekday: "long",
			day: "2-digit",
			month: "long",
			year: "numeric",
		};

		return date.toLocaleDateString("en-US", options);
	};

	return (
		<div className="calendar">
			{data.map((day, index) => {
				const date = new Date(day.date);
				const formattedDate = date.toLocaleDateString("en-AU", {
					day: "2-digit",
					month: "long",
					year: "numeric",
				});
				const dayOfWeek = getDayOfWeek(day.date);
				const cellClassName = day.available ? "available" : "unavailable";

				return (
					<div
						key={day.date}
						className={`calendar-cell ${cellClassName}`}
						onClick={() => toggleAvailability(index)}
					>
						{/* <div className="date">{formattedDate}</div> */}
						<div className="day-of-week">{dayOfWeek}</div>
					</div>
				);
			})}
		</div>
	);
};

export default Schedule;
