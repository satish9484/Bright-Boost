import React, { useState, useContext, useEffect } from "react";
import { Button, Form, Input, Skeleton, Typography, notification, DatePicker, Radio, Select, Checkbox } from "antd";

import "../Dashboard/style.scss";
import "./style.scss";

import { AuthContext } from "../../../context/AuthContext";

import { db } from "../../../firebase/firebase";
import { collection, doc, updateDoc, arrayUnion, getDocs, query } from "firebase/firestore";
import  { useParams, useNavigate } from 'react-router-dom';

import moment from "moment";


const { Title } = Typography;
const { TextArea } = Input;

const collectionId = "Bright-Boost";

const EditSessionQA = () => {

  const [notif, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false); 
  const { id } = useParams();

  const navigate = useNavigate();
  const openNotification = (notifTitle, notifContent) => {
        notif.open({
            message: notifTitle,
            description: notifContent,
        });
    };

  const { currentUser } = useContext(AuthContext);
  const subjects = ["English", "Mathematics", "Science", "Humanities and Social Sciences", "The Arts"];
  const queryResult = {};
  const [QA, setQA] = useState({});
  var reconstructedQAList = [];

  useEffect(() => {
    async function fetchData() {
        await getDocs(query(collection(db, "Bright-Boost"))).then(async (QAQuerySnapshot) => {
            if (Object.keys(queryResult).length == 0) {
                for (var j = 0; j < subjects.length; j++) {
                    QAQuerySnapshot.forEach((QAArray) => {
                        if (QAArray.id == "questionAnswer" && QAArray.data().hasOwnProperty(subjects[j])) {
                            for (var i = 0; i < QAArray.data()[subjects[j]].length; i++) {
                                if ((QAArray.data()[subjects[j]][i].questionStartDateTime) && QAArray.data()[subjects[j]][i].id == id) {
                                    const questionStartDateTime = new Date(QAArray.data()[subjects[j]][i].questionStartDateTime.toMillis());
                                    if (QAArray.data()[subjects[j]][i].status == "Answered" && QAArray.data()[subjects[j]][i].questionEndDateTime && QAArray.data()[subjects[j]][i].questionEndDateTime !== "") {
                                        const questionEndDateTime = new Date(QAArray.data()[subjects[j]][i].questionEndDateTime.toMillis());
                                    }
                                    queryResult['subject'] = subjects[j];
                                    queryResult['topic'] = QAArray.data()[subjects[j]][i].topic;
                                    queryResult['details'] = QAArray.data()[subjects[j]][i].details;
                                    queryResult['questionStartDateTime'] = QAArray.data()[subjects[j]][i].questionStartDateTime;
                                    if (QAArray.data()[subjects[j]][i].questionEndDateTime != "") {
                                        queryResult['questionEndDateTime'] = QAArray.data()[subjects[j]][i].questionEndDateTime;
                                    }
                                    queryResult['status'] = QAArray.data()[subjects[j]][i].status;
                                }
                            }
                        }
                    });
                }
                setQA(queryResult);
                setIsLoading(false);
            }
        })
    }
    fetchData();
    }, []);


async function reconstructQAEdit(subject, id, updatedQAEntry) {
    await getDocs(query(collection(db, "Bright-Boost"))).then(async (QAQuerySnapshot) => {
        var reconstructedQA = [];
        if (Object.keys(queryResult).length == 0) {
            QAQuerySnapshot.forEach((QAArray) => {
                if (QAArray.id == "questionAnswer" && QAArray.data().hasOwnProperty(subject)) {
                    for (var i = 0; i < QAArray.data()[subject].length; i++) {
                        if (QAArray.data()[subject][i].id == id) {
                            reconstructedQA.push(updatedQAEntry);
                        }
                        else {
                            reconstructedQA.push(QAArray.data()[subject][i]);
                        }
                    }
                }
            });
            reconstructedQAList = reconstructedQA;
        }
    })
}


  const updateSessionQA = async (values) => {
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
        const updatedQAEntry = {
            id: id,
            subjectName: subjectName,
            topic : topic,
            details : details,
            questionStartDateTime : questionStartDateTime.toDate(),
            questionEndDateTime : questionEndDateTime == undefined ? "" : questionEndDateTime.toDate(),
            status : status,
            answerer: answerer,
            durationInSeconds: durationInSeconds
        };
        await reconstructQAEdit(subjectName, id, updatedQAEntry).then(async () => {
            await updateDoc(doc(db, collectionId, "questionAnswer"), {
                [subjectName]: reconstructedQAList
            }).then(() => {
                openNotification("Success", "Session Q&A updated");
                window.setTimeout(function () {
                    navigate("/tutor/session-qa");
                }, 1000);
            });
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
  else if (Object.keys(QA).length > 0) {
        return (
            <>
                {contextHolder}
                <Typography>
                    <Title>{"Edit Session Q&A"}</Title>
                </Typography>
                <Form
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 27 }}
                        style={{ maxWidth: 1000 }}	
                        onFinish={updateSessionQA}
                        initialValues={
                            { 
                                subjectName: QA.subject, 
                                topic: QA.topic, 
                                details: QA.details, 
                                questionStartDateTime: moment.unix(QA.questionStartDateTime.toMillis()/1000),
                                questionEndDateTime: ("questionEndDateTime" in QA) ? moment.unix(QA.questionEndDateTime.toMillis()/1000) : "",
                                status: QA.status
                            }
                        }
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
                            <Radio value={"English"} disabled={true}>English</Radio>
                            <Radio value={"Mathematics"} disabled={true}>Mathematics</Radio>
                            <Radio value={"Science"} disabled={true}>Science</Radio>
                            <Radio value={"Humanities and Social Sciences"} disabled={true}>Humanities and Social Sciences</Radio>
                            <Radio value={"The Arts"} disabled={true}>The Arts</Radio>
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
                        <Button type="primary" htmlType="submit">Update Q&amp;A</Button>
                    </Form.Item>
                </Form>
            </>
        )
    }
}

export default EditSessionQA