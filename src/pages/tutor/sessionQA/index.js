import React, { useState, useEffect, useContext } from "react";
import { List, Typography, notification, Avatar, Collapse, Button } from "antd";

import "../Dashboard/style.scss";
import "./style.scss";

import { AuthContext } from "../../../context/AuthContext";

import { db } from "../../../firebase/firebase";
import { collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

import moment from "moment";

const { Title, Paragraph, Text } = Typography;

const SessionQA = () => {
    const queryResult = {};
    const queryResultLength = {};
    const [QA, setQA] = useState({});
    const [QACollapsible, setQACollapsible] = useState([]);
    const [numQAs, setNumQAs] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [notif, contextHolder] = notification.useNotification();
    const subjects = ["English", "Mathematics", "Science", "Humanities and Social Sciences", "The Arts"];
    const queryResultCollapsible = [];

    useEffect(() => {
        async function fetchData() {
            await getDocs(query(collection(db, "Bright-Boost"))).then(async (QAQuerySnapshot) => {
                if (Object.keys(queryResult).length === 0) {
                    for (var j = 0; j < subjects.length; j++) {
                        QAQuerySnapshot.forEach((QAArrray) => {
                            if (QAArrray.data().hasOwnProperty(subjects[j])) {
                                queryResult[subjects[j]] = [];
                                for (var i = 0; i < QAArrray.data()[subjects[j]].length; i++) {
                                    const questionStartDateTime = new Date(QAArrray.data()[subjects[j]][i].questionStartDateTime.seconds * 1000);
                                    var description = "Raised at: " + moment(questionStartDateTime).format("D MMMM YYYY HH:mm:ss");
                                    var meta = "";
                                    var answeredBy = "";
                                    var duration = "";
                                    if (QAArrray.data()[subjects[j]][i].status == "Answered" && QAArrray.data()[subjects[j]][i].questionEndDateTime && QAArrray.data()[subjects[j]][i].questionEndDateTime !== "") {
                                        const questionEndDateTime = new Date(QAArrray.data()[subjects[j]][i].questionEndDateTime.seconds * 1000);
                                        description += "; Answer finalised at: " + moment(questionEndDateTime).format("D MMMM YYYY HH:mm:ss");
                                    }
                                    if (QAArrray.data()[subjects[j]][i].status == "Answered") {
                                        const durationHours = Math.floor(QAArrray.data()[subjects[j]][i].durationInSeconds / 3600);
                                        const durationMinutes = Math.floor((QAArrray.data()[subjects[j]][i].durationInSeconds - durationHours * 3600) / 60);
                                        const durationSeconds = QAArrray.data()[subjects[j]][i].durationInSeconds - durationHours * 3600 - durationMinutes * 60;
                                        meta = <List.Item.Meta
                                        avatar={<Avatar src={`https://firebasestorage.googleapis.com/v0/b/placement-app-862af.appspot.com/o/Green-check-mark-icon.png?alt=media&token=de553e4c-5ad9-46c1-8bb9-0d4d2f58356f&_gl=1*av95ji*_ga*MTIyMDk0MDYzOC4xNjk2NDAwMjAw*_ga_CW55HF8NVT*MTY5NjQ3NjQ5OS40LjEuMTY5NjQ3NzMyMS4zLjAuMA..`} />}
                                        title={<a href="session-qa/edit">{QAArrray.data()[subjects[j]][i].topic}</a>}
                                        description={description} />;
                                        answeredBy = <div class="answererDetails"><strong>Answered by: {QAArrray.data()[subjects[j]][i].answerer} in {durationHours} hrs {durationMinutes} mins {durationSeconds} secs.</strong></div>;
                                    }
                                    else {
                                        meta = <List.Item.Meta
                                        title={<a href="session-qa/edit">{QAArrray.data()[subjects[j]][i].topic}</a>}
                                        description={description} />;
                                    }
                                    queryResult[subjects[j]].push({
                                        meta: meta,
                                        content: QAArrray.data()[subjects[j]][i].details,
                                        answeredBy: answeredBy
                                    });
                                }
                                queryResultLength[subjects[j]] = QAArrray.data()[subjects[j]].length;
                                queryResultCollapsible.push({
                                        key: subjects[j],
                                        label: subjects[j] + " (" + QAArrray.data()[subjects[j]].length + ")",
                                        children: 
                                            <List
                                            itemLayout="horizontal"
                                            dataSource={queryResult[subjects[j]]}
                                            pagination={{
                                                pageSize: 3,
                                            }}
                                            renderItem={(item, index) => (
                                                <List.Item
                                                    actions={[<a href="session-qa/edit">edit</a>]}
                                                >
                                                    {item.meta}
                                                    {item.content}
                                                    {item.answeredBy}
                                                </List.Item>
                                            )}
                                             />
                                    }
                                );
                            }
                        });
                    }
                    setQACollapsible(queryResultCollapsible);
                    setIsLoading(false);
                }
            })
        }
        fetchData();
    }, []);

  return (
    <>
        {contextHolder}
        <Typography>
			<Title>{"List of Session Q&As"}
                &nbsp;&nbsp;&nbsp;&nbsp;<Button type="primary" href="session-qa/new">New Q&amp;A</Button>
            </Title>
	  	</Typography>
        <Collapse items={QACollapsible} defaultActiveKey={subjects} />
    </>
)}

export default SessionQA