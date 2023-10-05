import React, { useState, useContext } from "react";
import { Button, Form, Input, Skeleton, Typography, notification, DatePicker, Radio, Select, Checkbox } from "antd";

import "../Dashboard/style.scss";
import "./style.scss";

import { AuthContext } from "../../../context/AuthContext";

import { db } from "../../../firebase/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import  { useNavigate } from 'react-router-dom';

import moment from "moment";


const { Title } = Typography;
const { TextArea } = Input;

const collectionId = "Bright-Boost";

const NewSessionQA = () => {

  const [notif, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false); 

  const navigate = useNavigate();
  const openNotification = (notifTitle, notifContent) => {
        notif.open({
            message: notifTitle,
            description: notifContent,
        });
    };

  const { currentUser } = useContext(AuthContext);

  const submitNewSessionQA = async (values) => {
	setIsLoading(true);
    const subjectName = values.subjectName;
    const topic = values.topic;
    const details = values.details;
    const questionStartDateTime = moment(values.questionStartDateTime.toString());
    var questionEndDateTime = undefined;
    if (values.questionEndDateTime && values.questionEndDateTime != "") {
        questionEndDateTime = moment(values.questionEndDateTime.toString());
    }
    const status = values.status;

    var durationInSeconds = -1; // -1 means unanswered or not fully answered, so not able to measure duration
    var answerer = "";

    // moment(values.dateOfBirth.toString()).toDate()

    if (status == "Answered" && values.questionEndDateTime && values.questionEndDateTime.toString() !== "" || status != "Answered") {
        if (status == "Answered") {
            answerer = currentUser.email;
            const momentDuration = moment.duration(questionEndDateTime.diff(questionStartDateTime));
            durationInSeconds = momentDuration.asSeconds();
        }
        await updateDoc(doc(db, collectionId, "questionAnswer"), {
            [subjectName]: arrayUnion({
                id: Math.random() * 10000000000000000000,
                subjectName: subjectName,
                topic : topic,
                details : details,
                questionStartDateTime : questionStartDateTime.toDate(),
                questionEndDateTime : questionEndDateTime == undefined ? "" : questionEndDateTime.toDate(),
                status : status,
                answerer: answerer,
                durationInSeconds: durationInSeconds
            })
        }).then(() => {
            openNotification("Success", "Session Q&A created");
            window.setTimeout(function () {
                navigate("/tutor/session-qa");
            }, 1000);
        });
    }
    else if (status == "Answered" && (!questionEndDateTime || questionEndDateTime === "")) {
        openNotification("Error", "Please input Question's End/Answered Date & Time");
        setIsLoading(false);
    }
  }

  if (isLoading) {
	return (
		<>
            {contextHolder}
			<Skeleton />
		</>
	);
  }

  return (
    <>
		{contextHolder}
        <Typography>
			<Title>{"Record Session Q&A"}</Title>
	  	</Typography>
        <Form
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 27 }}
                style={{ maxWidth: 1000 }}	
                onFinish={submitNewSessionQA}
        >
            <Form.Item
                    label="Subject Name"
                    className="form-group"	
                    name="subjectName"
                    rules={[
                        { required: true, message: "Please choose the subject name" },
                    ]}
                >
                <Radio.Group name="subjects">
                    <Radio value={"English"}>English</Radio>
                    <Radio value={"Mathematics"}>Mathematics</Radio>
                    <Radio value={"Science"}>Science</Radio>
                    <Radio value={"Humanities and Social Sciences"}>Humanities and Social Sciences</Radio>
                    <Radio value={"The Arts"}>The Arts</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                label="Topic"
                className="form-group"	
                name="topic"
                rules={[
                    { required: true, message: "Please input at least the question topic" },
                ]}
            >
                <TextArea autoSize />
            </Form.Item>
            <Form.Item
                label="Details"
                className="form-group"	
                name="details"
            >
                <TextArea autoSize />
            </Form.Item>
            <Form.Item
                label="Question Start Date & Time"
                className="form-group"
                name="questionStartDateTime"
                rules={[
                    { required: true, message: "Please input question start date and time" },
                ]}
            >
                <DatePicker showTime />
            </Form.Item>
            <Form.Item
                label="Question End Date & Time"
                className="form-group"
                name="questionEndDateTime"
            >
                <DatePicker showTime />
            </Form.Item>
            <Form.Item
                label="Question Status"
                className="bbformlabel"	
                name="status"
                rules={[
                    { required: true, message: "Question status is required" },
                ]}
            >
                <Radio.Group name="status">
                    <Radio value={"Unanswered"}>Unanswered</Radio>
                    <Radio value={"Answered"}>Answered</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit">Submit Q&amp;A</Button>
            </Form.Item>
        </Form>
    </>
  )
}

export default NewSessionQA