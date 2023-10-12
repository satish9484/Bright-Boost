import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import "./style.scss";

// import { db } from "../../../firebase/firebase";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import moment from "moment";
import { Button, DatePicker, Form, Select, ConfigProvider } from "antd";
import BreadCrumbs from "../../components/common/Breadcrumbs";
import Card from "../../components/common/Card";

import enUS from "antd/lib/locale/en_US";

const { Option } = Select;
const dateFormatList = "DD/MM/YYYY";

const subjects = [
	"English",
	"Mathematics",
	"Science",
	"Humanities and Social Sciences",
	"The Arts",
];

const tutorsBySubject = {
	English: ["Harvey", "John"],
	Mathematics: ["Rose", "Duane"],
	Science: ["Earl", "Clifford"],
	HumanitiesAndSocialSciences: ["Dennis", "Ophelia"],
	TheArts: ["Della", "Kate"],
};

const collectionName = "Bright-Boost";
const documentId = "helpline";

const initialStudentData = {
	email: "", // Add logic to populate this with the user's email
	subject: "English",
	tutor: tutorsBySubject["English"][0] || "",
	date: "",
	time: "",
	sessionTime: 1, // Set a default session time here
};

const Helpline = () => {
	const { currentUser } = useContext(AuthContext);
	const [currentTime] = useState(moment().format("HH:mm:ss"));
	const [lastDayOfYear] = useState(moment().endOf("year"));
	const [form] = Form.useForm();
	const [selectedDate, setSelectedDate] = useState(null);

	// Function to handle form submission
	const handleSubmit = async (values) => {
		try {
			const selectedMoment = moment(values?.date);
			setSelectedDate(selectedMoment.format(dateFormatList));

			const docRef = doc(db, collectionName, documentId);
			const docSnapshot = await getDoc(docRef);

			const dataToStore = {
				email: currentUser?.email || "",
				subject: values.subject,
				date: selectedDate,
				time: currentTime,
				// sessionTime: values.sessionTime,
				tutor: values.tutor,
			};

			if (docSnapshot.exists()) {
				await updateDoc(docRef, {
					[values.subject]: arrayUnion(dataToStore),
				});
			} else {
				const dataToSet = subjects.reduce((acc, subject) => {
					acc[subject] = [];
					return acc;
				}, {});
				dataToSet[values.subject] = [dataToStore];
				await setDoc(docRef, dataToSet);
			}

			console.log("Student record added successfully!");
		} catch (error) {
			console.error("Error adding student record: ", error);
		}
	};

	// Function to disable dates in the past and future
	const disabledDate = (current) => {
		return (
			(current && current < moment().startOf("day")) ||
			(current && current > lastDayOfYear.endOf("day"))
		);
	};

	// Function to handle date change
	const handleDateChange = (date, dateString) => {
		setSelectedDate(dateString);
	};

	// Function to handle subject selection
	// const handleSubjectChange = (value) => {
	// 	if (value in tutorsBySubject) {
	// 		setTutorListForSubject(tutorsBySubject[value]);
	// 		form.setFieldsValue({ tutor: tutorsBySubject[value][0] || "" });
	// 	} else {
	// 		console.log("false value");
	// 		setTutorListForSubject([]);
	// 	}
	// };

	return (
		<>
			<BreadCrumbs
			// list={[
			// 	{
			// 		name: "Session Registration",
			// 		link: "/student/sessionregistration",
			// 		isActive: false,
			// 	},
			// ]}
			/>
			<Card>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSubmit}
					initialValues={{ ...initialStudentData }}
				>
					<div className="row">
						<div className="col-md-12">
							<h3 className="pageLabel mar-bottom-18">
								Please, write your inqury
							</h3>
						</div>

						<Form.Item
							className="col-xl-6 col-md-8 form-group"
							label="Subject"
							labelWrap={true}
							name="subject"
							rules={[
								{
									required: true,
									message: "Please select a subject",
								},
							]}
						>
							<Select
								placeholder="Select Subject"
								// onChange={handleSubjectChange}
							>
								{subjects.map((subject) => (
									<Option key={subject} value={subject}>
										{subject}
									</Option>
								))}
							</Select>
						</Form.Item>

						<Form.Item
							className="col-xl-6 col-md-8 form-group"
							label="Tutor Name (if applicable)"
							labelWrap={true}
							name="tutor"
							rules={[
								{
									// required: true,
									message: "Please select a tutor",
								},
							]}
						>
							<Select placeholder="Tutor Name">
								{/* {tutorListForSubject.map((tutor) => (
									<Option key={tutor} value={tutor}>
										{tutor}
									</Option>
								))} */}
							</Select>
						</Form.Item>

						{/* <Form.Item
							className="col-xl-6 col-md-8 form-group"
							label="Session Duration"
							labelWrap={true}
							name="sessionTime"
						> */}
						{/* <Select placeholder="Select Subject"> */}
						{/* {sessionTime.map((sessionTime) => (
									<Option key={sessionTime} value={sessionTime}>
										{sessionTime} hour
									</Option>
								))} */}
						{/* </Select> */}
						{/* </Form.Item> */}

						{/* <ConfigProvider locale={enUS}> */}
						<div className="inquiry">
							<Form.Item
								className="col-xl-6 col-md-8 form-group"
								label="Your Inquiry"
								labelWrap={true}
								name="inquiry"
								rules={[
									{
										required: true,
										message: "Please select a date",
									},
								]}
							>
								<textarea className="inquiry-text"></textarea>
								{/* <DatePicker
									format={dateFormatList}
									disabledDate={disabledDate}
									onChange={handleDateChange}
								/> */}
							</Form.Item>
						</div>
						{/* </ConfigProvider> */}

						<div className="col-xl-12 d-flex justify-content-end mar-top-8">
							<Button className="mar-right-8">Cancel</Button>
							<Button type="primary" htmlType="submit">
								Save
							</Button>
						</div>
					</div>
				</Form>
			</Card>
		</>
	);
};

export default Helpline;
