import React, { useState, useEffect, useContext } from "react";
import { List, Typography, notification, Avatar, Collapse, Button, Skeleton } from "antd";

import "../Dashboard/style.scss";
import "./style.scss";

import { AuthContext } from "../../../context/AuthContext";

import { db } from "../../../firebase/firebase";
import { collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, query, where, deleteField } from "firebase/firestore";
import  { useNavigate } from 'react-router-dom';

import moment from "moment";
import { useLocation, Link } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

const collectionId = "Bright-Boost";

const SessionQA = () => {
    const { state } = useLocation();
    var queryResult = {};
    var queryResultLength = {};
    const [QA, setQA] = useState({});
    const [QACollapsible, setQACollapsible] = useState([]);
    const [numQAs, setNumQAs] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [notif, contextHolder] = notification.useNotification();
    const subjects = ["English", "Mathematics", "Science", "Humanities and Social Sciences", "The Arts"];
    var queryResultCollapsible = [];
    var reconstructedQAList = [];

    const navigate = useNavigate();
    const openNotification = (notifTitle, notifContent) => {
        notif.open({
            message: notifTitle,
            description: notifContent,
        });
    };

    async function fetchData() {
        await getDocs(query(collection(db, "Bright-Boost"))).then(async (QAQuerySnapshot) => {
            if (Object.keys(queryResult).length == 0) {
                for (var j = 0; j < subjects.length; j++) {
                    QAQuerySnapshot.forEach((QAArray) => {
                        if (QAArray.id == "questionAnswer" && QAArray.data().hasOwnProperty(subjects[j])) {
                            queryResult[subjects[j]] = [];
                            for (var i = 0; i < QAArray.data()[subjects[j]].length; i++) {
                                if ((QAArray.data()[subjects[j]][i].questionStartDateTime)) {
                                    const questionStartDateTime = new Date(QAArray.data()[subjects[j]][i].questionStartDateTime.toMillis());
                                    var description = "Raised at: " + moment(questionStartDateTime).format("D MMMM YYYY HH:mm:ss");
                                    var meta = "";
                                    var answeredBy = "";
                                    var duration = "";
                                    if (QAArray.data()[subjects[j]][i].status == "Answered" && QAArray.data()[subjects[j]][i].questionEndDateTime && QAArray.data()[subjects[j]][i].questionEndDateTime !== "") {
                                        const questionEndDateTime = new Date(QAArray.data()[subjects[j]][i].questionEndDateTime.toMillis());
                                        description += "; Answer finalised at: " + moment(questionEndDateTime).format("D MMMM YYYY HH:mm:ss");
                                    }
                                    const QAUrl = `session-qa/edit/` + QAArray.data()[subjects[j]][i].id;
                                    if (QAArray.data()[subjects[j]][i].status == "Answered") {
                                        const durationHours = Math.floor(QAArray.data()[subjects[j]][i].durationInSeconds / 3600);
                                        const durationMinutes = Math.floor((QAArray.data()[subjects[j]][i].durationInSeconds - durationHours * 3600) / 60);
                                        const durationSeconds = QAArray.data()[subjects[j]][i].durationInSeconds - durationHours * 3600 - durationMinutes * 60;
                                        meta = <List.Item.Meta
                                        avatar={<Avatar src={`https://firebasestorage.googleapis.com/v0/b/placement-app-862af.appspot.com/o/Green-check-mark-icon.png?alt=media&token=de553e4c-5ad9-46c1-8bb9-0d4d2f58356f&_gl=1*av95ji*_ga*MTIyMDk0MDYzOC4xNjk2NDAwMjAw*_ga_CW55HF8NVT*MTY5NjQ3NjQ5OS40LjEuMTY5NjQ3NzMyMS4zLjAuMA..`} />}
                                        title={<Link to={`/tutor/session-qa/edit/` + QAArray.data()[subjects[j]][i].id}>{QAArray.data()[subjects[j]][i].topic}</Link>}
                                        description={description} />;
                                        answeredBy = <><br /><span className="answererDetails"><strong>Answered by: {QAArray.data()[subjects[j]][i].answerer} in {durationHours} hrs {durationMinutes} mins {durationSeconds} secs.</strong></span></>;
                                    }
                                    else {
                                        meta = <List.Item.Meta
                                        title={<Link to={`/tutor/session-qa/edit/` + QAArray.data()[subjects[j]][i].id}>{QAArray.data()[subjects[j]][i].topic}</Link>}
                                        description={description} />;
                                    }
                                    queryResult[subjects[j]].push({
                                        meta: meta,
                                        content: QAArray.data()[subjects[j]][i].details,
                                        answeredBy: answeredBy,
                                        id: QAArray.data()[subjects[j]][i].id,
                                        subject: subjects[j]
                                    });
                                }
                            }
                            queryResultLength[subjects[j]] = QAArray.data()[subjects[j]].length;
                            queryResultCollapsible.push({
                                    key: subjects[j],
                                    label: subjects[j] + " (" + QAArray.data()[subjects[j]].length + ")",
                                    children: 
                                        <List
                                        itemLayout="horizontal"
                                        dataSource={queryResult[subjects[j]]}
                                        pagination={{
                                            pageSize: 3,
                                        }}
                                        renderItem={(item, index) => (
                                            <List.Item
                                                actions={[
                                                    <Link to={`edit/` + item.id}>edit</Link>, 
                                                    <Link onClick={() => {deleteQA(item.subject, item.id)}}>delete</Link>
                                                ]}
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

    async function reconstructQADelete(subject, id) {
        await getDocs(query(collection(db, "Bright-Boost"))).then(async (QAQuerySnapshot) => {
            var reconstructedQA = [];
            QAQuerySnapshot.forEach((QAArray) => {
                if (QAArray.id == "questionAnswer" && QAArray.data().hasOwnProperty(subject)) {
                    for (var i = 0; i < QAArray.data()[subject].length; i++) {
                        if (QAArray.data()[subject][i].id != id) {
                            reconstructedQA.push(QAArray.data()[subject][i]);
                        }
                    }
                }
            });
            reconstructedQAList = reconstructedQA;
        })
    }
    
    async function deleteQA(subject, id) {
        setIsLoading(true);
        var updaterObj = {};
        await reconstructQADelete(subject, id).then(async () => {
            console.log(reconstructedQAList);
            if (reconstructedQAList.length > 0) {
                updaterObj = {
                    [subject]: reconstructedQAList
                };
            }
            else {
                updaterObj = {
                    [subject]: deleteField()
                };
            }
            await updateDoc(doc(db, collectionId, "questionAnswer"), updaterObj).then(() => {
                openNotification("Success", "Session Q&A deleted");
                window.setTimeout(function () {
                    queryResult = {};
                    queryResultLength = {};
                    setQACollapsible([]);
                    queryResultCollapsible = [];
                    fetchData().then(() => {
                        navigate("/tutor/session-qa");
                    });
                }, 1000);
            });
        });

    }

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <>
                {contextHolder}
			    <Skeleton />
		    </>
        )
    }

    return (
        <>
            {contextHolder}
            <Typography>
                <Title>{"List of Session Q&As"}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary">
                        <Link to={`/tutor/session-qa/new`}>New Q&amp;A</Link>
                    </Button>
                </Title>
            </Typography>
            <Collapse items={QACollapsible} defaultActiveKey={subjects} />
        </>
    )

}

export default SessionQA