import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import "./style.scss";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import moment from "moment";
import { Button, Form, Select, notification } from "antd";
import BreadCrumbs from "../../components/common/Breadcrumbs";
import Card from "../../components/common/Card";
const { Option } = Select;

const category = [
	"Technical issue",
	"Tutor-related",
	"Timing-related",
	"Subject-related",
	"Other matter",
];

const urgency = ["High", "Medium", "Low"];

const collectionName = "Bright-Boost";
const documentId = "helpline";

const initialStudentData = {
	email: "",
	subject: "",
	urgency: "Low",
	date: "",
	time: "",
	inquiry: "",
	answered: false,
};

const Helpline = () => {
	const { currentUser } = useContext(AuthContext);
	const [currentTime] = useState(moment().format("HH:mm:ss"));
	const [currentDate] = useState(moment().format());
	const [inquryMessage, setInquryMessage] = useState("");
	const [form] = Form.useForm();

	// Function to handle form submission
	const handleSubmit = async (values) => {
		try {
			const docRef = doc(db, collectionName, documentId);
			const docSnapshot = await getDoc(docRef);
			const dataToStore = {
				email: currentUser?.email || "",
				subject: values.subject,
				date: currentDate,
				time: currentTime,
				urgency: values.urgency,
				inquiry: inquryMessage,
				answered: false,
			};

			if (docSnapshot.exists()) {
				await updateDoc(docRef, {
					[values.subject]: arrayUnion(dataToStore),
				});
			} else {
				const dataToSet = category.reduce((acc, subject) => {
					acc[subject] = [];
					return acc;
				}, {});
				dataToSet[values.subject] = [dataToStore];
				await setDoc(docRef, dataToSet);
			}

			console.log("Student inquiry has been sent to Admin successfully!");
			showSuccessNotification(); // display a notification
			form.resetFields(); // Reset the form fields
			setInquryMessage(""); // Reset the inquiry message state
		} catch (error) {
			console.error("Error sending student inqury: ", error);
		}
	};

	//Set student inqury message
	const handleInquiryChange = (e) => {
		setInquryMessage(e.target.value);
	};

	//display a message once student inqury has been submitted
	const showSuccessNotification = () => {
		notification.success({
			message: "Success",
			description: "Your inquiry has been successfully submitted!",
		});
	};

	// Function to handle subject selection
	const handleSubjectChange = (value) => {
		form.setFieldValue(value);
		console.log("false value");
	};

	return (
		<>
			<BreadCrumbs />
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
							label="Select a category"
							labelWrap={true}
							name="subject"
							rules={[
								{
									required: true,
									message: "Please select a category",
								},
							]}
						>
							<Select
								placeholder="Select category"
								onChange={handleSubjectChange}
							>
								{category.map((subject) => (
									<Option key={subject} value={subject}>
										{subject}
									</Option>
								))}
							</Select>
						</Form.Item>

						<Form.Item
							className="col-xl-6 col-md-8 form-group"
							label="How urgent is your inquiry?"
							labelWrap={true}
							name="urgency"
							rules={[
								{
									message: "Please select an urgency",
								},
							]}
						>
							<Select>
								{urgency.map((item) => (
									<Option key={item} value={item}>
										{item}
									</Option>
								))}
							</Select>
						</Form.Item>
						<div className="inquiry">
							<Form.Item
								className="col-xl-6 col-md-8 form-group"
								label="Your Inquiry"
								labelWrap={true}
								name="inquiry"
								rules={[
									{
										required: true,
										message: "Please enter your inquiry",
									},
								]}
							>
								<textarea
									className="inquiry-text"
									value={inquryMessage} // Set the value of the textarea
									onChange={handleInquiryChange} // Update inquiryMessage on change
								></textarea>
							</Form.Item>
						</div>

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
