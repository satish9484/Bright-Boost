import React, { useState, useEffect } from "react";
import "./style.scss";
import { db } from "../../../firebase/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import dayjs from "dayjs";
import moment from "moment";
import { Calendar, Skeleton, Radio } from "antd";

const filterBySubject = [
  {
    key: "English",
    label: (
      <a target="_blank" rel="noopener noreferrer">
        English
      </a>
    ),
  },
  {
    key: "Mathematics",
    label: (
      <a target="_blank" rel="noopener noreferrer">
        Mathematics
      </a>
    ),
  },
  {
    key: "Science",
    label: (
      <a target="_blank" rel="noopener noreferrer">
        Science
      </a>
    ),
  },
  {
    key: "Humanities and Social Sciences",
    label: (
      <a target="_blank" rel="noopener noreferrer">
        Humanities and Social Sciences
      </a>
    ),
  },
  {
    key: "The Arts",
    label: (
      <a target="_blank" rel="noopener noreferrer">
        The Arts
      </a>
    ),
  },
];

const Statistics = () => {
  const [value, setValue] = useState(() => dayjs(new Date().toString()));

  const allSubjects = [
    "English",
    "Mathematics",
    "Science",
    "Humanities and Social Sciences",
    "The Arts",
  ];

  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("All");
  var selectedSubjects = allSubjects;

  const [isLoading, setIsLoading] = useState(true);

  var numStudents = undefined;
  var numTutors = undefined;

  var queryResult = {};
  var assumptions = {
    English: {},
    Mathematics: {},
    Science: {},
    "Humanities and Social Sciences": {},
    "The Arts": {},
  };

  const [questionStatistics, setQuestionStatistics] = useState({});

  const subjectFilterChange = function (e) {
    selectedSubjects = [];
    if (e.target.value !== "All") {
      selectedSubjects.push(e.target.value);
    } else {
      selectedSubjects = allSubjects;
    }
    setSelectedSubjectFilter(e.target.value);
    queryResult = {};
    var assumptions = {
      English: {},
      Mathematics: {},
      Science: {},
      "Humanities and Social Sciences": {},
      "The Arts": {},
    };
    setQuestionStatistics({});
    fetchData();
  };

  async function fetchData() {
    setIsLoading(true);
    await getDocs(query(collection(db, "Bright-Boost"))).then(
      async (QAQuerySnapshot) => {
        if (Object.keys(queryResult).length === 0) {
          selectedSubjects.forEach((selectedSubject) => {
            QAQuerySnapshot.forEach((QAArray) => {
              if (
                QAArray.id === "questionAnswer" &&
                QAArray.data().hasOwnProperty(selectedSubject)
              ) {
                for (
                  var i = 0;
                  i < QAArray.data()[selectedSubject].length;
                  i++
                ) {
                  if (
                    queryResult[
                      moment(
                        new Date(
                          QAArray.data()[selectedSubject][
                            i
                          ].questionStartDateTime.toMillis()
                        )
                      ).format("YYYYMMDD")
                    ] === undefined
                  ) {
                    queryResult[
                      moment(
                        new Date(
                          QAArray.data()[selectedSubject][
                            i
                          ].questionStartDateTime.toMillis()
                        )
                      ).format("YYYYMMDD")
                    ] = {};
                    queryResult[
                      moment(
                        new Date(
                          QAArray.data()[selectedSubject][
                            i
                          ].questionStartDateTime.toMillis()
                        )
                      ).format("YYYYMMDD")
                    ]["numQuestions"] = 1;
                    if (
                      QAArray.data()[selectedSubject][i].status === "Answered"
                    ) {
                      queryResult[
                        moment(
                          new Date(
                            QAArray.data()[selectedSubject][
                              i
                            ].questionStartDateTime.toMillis()
                          )
                        ).format("YYYYMMDD")
                      ]["numAnswers"] = 1;
                    } else {
                      queryResult[
                        moment(
                          new Date(
                            QAArray.data()[selectedSubject][
                              i
                            ].questionStartDateTime.toMillis()
                          )
                        ).format("YYYYMMDD")
                      ]["numAnswers"] = 0;
                    }
                  } else if (
                    queryResult[
                      moment(
                        new Date(
                          QAArray.data()[selectedSubject][
                            i
                          ].questionStartDateTime.toMillis()
                        )
                      ).format("YYYYMMDD")
                    ]["numQuestions"] !== undefined
                  ) {
                    queryResult[
                      moment(
                        new Date(
                          QAArray.data()[selectedSubject][
                            i
                          ].questionStartDateTime.toMillis()
                        )
                      ).format("YYYYMMDD")
                    ]["numQuestions"] += 1;
                    if (
                      QAArray.data()[selectedSubject][i].status === "Answered"
                    ) {
                      queryResult[
                        moment(
                          new Date(
                            QAArray.data()[selectedSubject][
                              i
                            ].questionStartDateTime.toMillis()
                          )
                        ).format("YYYYMMDD")
                      ]["numAnswers"] += 1;
                    }
                  } else {
                    queryResult[
                      moment(
                        new Date(
                          QAArray.data()[selectedSubject][
                            i
                          ].questionStartDateTime.toMillis()
                        )
                      ).format("YYYYMMDD")
                    ]["numQuestions"] = 1;
                    if (
                      QAArray.data()[selectedSubject][i].status === "Answered"
                    ) {
                      queryResult[
                        moment(
                          new Date(
                            QAArray.data()[selectedSubject][
                              i
                            ].questionStartDateTime.toMillis()
                          )
                        ).format("YYYYMMDD")
                      ]["numAnswers"] = 1;
                    } else {
                      queryResult[
                        moment(
                          new Date(
                            QAArray.data()[selectedSubject][
                              i
                            ].questionStartDateTime.toMillis()
                          )
                        ).format("YYYYMMDD")
                      ]["numAnswers"] = 0;
                    }
                  }
                  // Assumption 1: When there is a question & answer, there must be at least 1 student and 1 tutor doing a session on a particular subject, regardless whether the schedules are recorded or not
                  // Assumption 2: Following from Assumption 1, a question & answer can only be recorded during session times (i.e. weekdays 3:30pm to 4:30p; Note: the timing restrictions are currently lifted in the system to allow greater flexibility in software demonstration)
                  // Assumption 3: For each student in a session, s/he will get 1 tutor and studying 1 subject only
                  if (
                    assumptions[selectedSubject][
                      moment(
                        new Date(
                          QAArray.data()[selectedSubject][
                            i
                          ].questionStartDateTime.toMillis()
                        )
                      ).format("YYYYMMDD")
                    ] === undefined
                  ) {
                    assumptions[selectedSubject][
                      moment(
                        new Date(
                          QAArray.data()[selectedSubject][
                            i
                          ].questionStartDateTime.toMillis()
                        )
                      ).format("YYYYMMDD")
                    ] = true;
                    if (
                      queryResult[
                        moment(
                          new Date(
                            QAArray.data()[selectedSubject][
                              i
                            ].questionStartDateTime.toMillis()
                          )
                        ).format("YYYYMMDD")
                      ]["numTutorsAssumed"] === undefined &&
                      queryResult[
                        moment(
                          new Date(
                            QAArray.data()[selectedSubject][
                              i
                            ].questionStartDateTime.toMillis()
                          )
                        ).format("YYYYMMDD")
                      ]["numStudentsAssumed"] === undefined
                    ) {
                      queryResult[
                        moment(
                          new Date(
                            QAArray.data()[selectedSubject][
                              i
                            ].questionStartDateTime.toMillis()
                          )
                        ).format("YYYYMMDD")
                      ]["numTutorsAssumed"] = 1;
                      queryResult[
                        moment(
                          new Date(
                            QAArray.data()[selectedSubject][
                              i
                            ].questionStartDateTime.toMillis()
                          )
                        ).format("YYYYMMDD")
                      ]["numStudentsAssumed"] = 1;
                    } else {
                      if (
                        queryResult[
                          moment(
                            new Date(
                              QAArray.data()[selectedSubject][
                                i
                              ].questionStartDateTime.toMillis()
                            )
                          ).format("YYYYMMDD")
                        ]["numTutorsAssumed"] !== undefined
                      ) {
                        queryResult[
                          moment(
                            new Date(
                              QAArray.data()[selectedSubject][
                                i
                              ].questionStartDateTime.toMillis()
                            )
                          ).format("YYYYMMDD")
                        ]["numTutorsAssumed"] += 1;
                      } else {
                        queryResult[
                          moment(
                            new Date(
                              QAArray.data()[selectedSubject][
                                i
                              ].questionStartDateTime.toMillis()
                            )
                          ).format("YYYYMMDD")
                        ]["numTutorsAssumed"] = 1;
                      }
                      if (
                        queryResult[
                          moment(
                            new Date(
                              QAArray.data()[selectedSubject][
                                i
                              ].questionStartDateTime.toMillis()
                            )
                          ).format("YYYYMMDD")
                        ]["numStudentsAssumed"] !== undefined
                      ) {
                        queryResult[
                          moment(
                            new Date(
                              QAArray.data()[selectedSubject][
                                i
                              ].questionStartDateTime.toMillis()
                            )
                          ).format("YYYYMMDD")
                        ]["numStudentsAssumed"] += 1;
                      } else {
                        queryResult[
                          moment(
                            new Date(
                              QAArray.data()[selectedSubject][
                                i
                              ].questionStartDateTime.toMillis()
                            )
                          ).format("YYYYMMDD")
                        ]["numStudentsAssumed"] = 1;
                      }
                    }
                  }
                }
              } else if (
                QAArray.id === "SessionRegistration" &&
                QAArray.data().hasOwnProperty(selectedSubject)
              ) {
                if (QAArray.data()[selectedSubject].length !== undefined) {
                  // alternative flow if data format somehow changes
                  for (
                    var j = 0;
                    j < QAArray.data()[selectedSubject].length;
                    j++
                  ) {
                    if (QAArray.data()[selectedSubject][j].date !== undefined) {
                      if (
                        queryResult[
                          moment(
                            QAArray.data()[selectedSubject][j].date,
                            "DD/MM/YYYY"
                          ).format("YYYYMMDD")
                        ] === undefined
                      ) {
                        queryResult[
                          moment(
                            QAArray.data()[selectedSubject][j].date,
                            "DD/MM/YYYY"
                          ).format("YYYYMMDD")
                        ] = {};
                        queryResult[
                          moment(
                            QAArray.data()[selectedSubject][j].date,
                            "DD/MM/YYYY"
                          ).format("YYYYMMDD")
                        ]["numStudents"] = 1;
                      } else {
                        queryResult[
                          moment(
                            QAArray.data()[selectedSubject][j].date,
                            "DD/MM/YYYY"
                          ).format("YYYYMMDD")
                        ]["numStudents"] += 1;
                      }
                      if (
                        assumptions[selectedSubject][
                          moment(
                            QAArray.data()[selectedSubject][j].date,
                            "DD/MM/YYYY"
                          ).format("YYYYMMDD")
                        ] === undefined
                      ) {
                        assumptions[selectedSubject][
                          moment(
                            QAArray.data()[selectedSubject][j].date,
                            "DD/MM/YYYY"
                          ).format("YYYYMMDD")
                        ] = true;
                        if (
                          queryResult[
                            moment(
                              QAArray.data()[selectedSubject][j].date,
                              "DD/MM/YYYY"
                            ).format("YYYYMMDD")
                          ]["numStudentsAssumed"] === undefined
                        ) {
                          queryResult[
                            moment(
                              QAArray.data()[selectedSubject][j].date,
                              "DD/MM/YYYY"
                            ).format("YYYYMMDD")
                          ]["numStudentsAssumed"] = 1;
                        } else {
                          queryResult[
                            moment(
                              QAArray.data()[selectedSubject][j].date,
                              "DD/MM/YYYY"
                            ).format("YYYYMMDD")
                          ]["numStudentsAssumed"] += 1;
                        }
                      }
                    }
                  }
                } else {
                  Object.keys(QAArray.data()[selectedSubject]).forEach(
                    (dateKey) => {
                      var numStudents = 0;
                      const regex = /[0-9]{1,2}:[0-9]{1,2}(:[0-9]{1,2})?$/i;
                      if (
                        Object.keys(QAArray.data()[selectedSubject][dateKey])
                          .length > 1
                      ) {
                        Object.keys(
                          QAArray.data()[selectedSubject][dateKey]
                        ).forEach((additionalKey) => {
                          if (regex.test(additionalKey)) {
                            numStudents += 1;
                          }
                        });
                      } else if (
                        QAArray.data()[selectedSubject][dateKey].length !==
                        undefined
                      ) {
                        numStudents +=
                          QAArray.data()[selectedSubject][dateKey].length;
                      }
                      if (
                        queryResult[
                          moment(dateKey, "DD/MM/YYYY").format("YYYYMMDD")
                        ] === undefined
                      ) {
                        queryResult[
                          moment(dateKey, "DD/MM/YYYY").format("YYYYMMDD")
                        ] = {};
                        queryResult[
                          moment(dateKey, "DD/MM/YYYY").format("YYYYMMDD")
                        ]["numStudents"] = Math.max(numStudents, 1);
                      } else {
                        queryResult[
                          moment(dateKey, "DD/MM/YYYY").format("YYYYMMDD")
                        ]["numStudents"] += Math.max(numStudents, 1);
                      }
                      if (
                        assumptions[selectedSubject][
                          moment(dateKey, "DD/MM/YYYY").format("YYYYMMDD")
                        ] === undefined
                      ) {
                        assumptions[selectedSubject][
                          moment(dateKey, "DD/MM/YYYY").format("YYYYMMDD")
                        ] = true;
                        if (
                          queryResult[
                            moment(dateKey, "DD/MM/YYYY").format("YYYYMMDD")
                          ]["numStudentsAssumed"] === undefined
                        ) {
                          queryResult[
                            moment(dateKey, "DD/MM/YYYY").format("YYYYMMDD")
                          ]["numStudentsAssumed"] = 1;
                        } else {
                          queryResult[
                            moment(dateKey, "DD/MM/YYYY").format("YYYYMMDD")
                          ]["numStudentsAssumed"] += 1;
                        }
                      }
                    }
                  );
                }
              } else if (QAArray.id === "tutorsAvailability") {
                Object.keys(QAArray.data()).forEach((tutorEmail) => {
                  if (
                    selectedSubject
                      ?.toLowerCase()
                      .includes(
                        QAArray.data()[tutorEmail].Subject?.toLowerCase()
                      ) ||
                    QAArray.data()
                      [tutorEmail].Subject?.toLowerCase()
                      .includes(selectedSubject?.toLowerCase())
                  ) {
                    Object.keys(
                      QAArray.data()[tutorEmail]["availabilityData"]
                    ).forEach((dateKey) => {
                      if (
                        queryResult[
                          moment(dateKey, "DDMMYYYY").format("YYYYMMDD")
                        ] === undefined
                      ) {
                        queryResult[
                          moment(dateKey, "DDMMYYYY").format("YYYYMMDD")
                        ] = {};
                      }
                      if (
                        QAArray.data()[tutorEmail]["availabilityData"][
                          dateKey
                        ] === true
                      ) {
                        if (
                          queryResult[
                            moment(dateKey, "DDMMYYYY").format("YYYYMMDD")
                          ]["numTutors"] === undefined
                        ) {
                          queryResult[
                            moment(dateKey, "DDMMYYYY").format("YYYYMMDD")
                          ]["numTutors"] = 1;
                        } else {
                          queryResult[
                            moment(dateKey, "DDMMYYYY").format("YYYYMMDD")
                          ]["numTutors"] += 1;
                        }
                        if (
                          assumptions[selectedSubject][
                            moment(dateKey, "DDMMYYYY").format("YYYYMMDD")
                          ] === undefined
                        ) {
                          assumptions[selectedSubject][
                            moment(dateKey, "DDMMYYYY").format("YYYYMMDD")
                          ] = true;
                          if (
                            queryResult[
                              moment(dateKey, "DDMMYYYY").format("YYYYMMDD")
                            ]["numTutorsAssumed"] === undefined
                          ) {
                            queryResult[
                              moment(dateKey, "DDMMYYYY").format("YYYYMMDD")
                            ]["numTutorsAssumed"] = 1;
                          } else {
                            queryResult[
                              moment(dateKey, "DD/MM/YYYY").format("YYYYMMDD")
                            ]["numTutorsAssumed"] += 1;
                          }
                        }
                      }
                    });
                  }
                });
              }
            });
          });
          setQuestionStatistics(queryResult);
          setIsLoading(false);
        }
      }
    );
  }

  useEffect(() => {
    fetchData();
  }, []);

  const onPanelChange = (newValue) => {
    setValue(newValue);
  };

  if (isLoading) {
    return (
      <>
        <Skeleton />
      </>
    );
  }

  return (
    <>
      Filter by subject:&nbsp;&nbsp;
      <Radio.Group
        name="subjects"
        value={selectedSubjectFilter}
        onChange={subjectFilterChange}
      >
        <Radio value={"All"}>All</Radio>
        <Radio value={"English"}>English</Radio>
        <Radio value={"Mathematics"}>Mathematics</Radio>
        <Radio value={"Science"}>Science</Radio>
        <Radio value={"Humanities and Social Sciences"}>
          Humanities and Social Sciences
        </Radio>
        <Radio value={"The Arts"}>The Arts</Radio>
      </Radio.Group>
      <Calendar
        value={value}
        onPanelChange={onPanelChange}
        cellRender={(date) => {
          const currentDate = moment(new Date()).format("YYYYMMDD");
          const currentTime = moment(new Date()).format("HHmmss");
          const calendarDate = date.format("YYYYMMDD");
          var dateNotPast = true;
          if (calendarDate < currentDate) {
            dateNotPast = false;
          } else if (calendarDate === currentDate && currentTime >= "161500") {
            // since a session runs from 3:30pm to 5:30pm each day, if the current time has passed 4:15pm of that day, it is considered that the (statistics of the) day can be finalised and no more indication of "TBD"
            dateNotPast = false;
          }
          if (
            questionStatistics[date.format("YYYYMMDD")] !== undefined &&
            (questionStatistics[date.format("YYYYMMDD")].numQuestions !==
              undefined ||
              questionStatistics[date.format("YYYYMMDD")].numStudents !==
                undefined ||
              questionStatistics[date.format("YYYYMMDD")].numTutors)
          ) {
            return (
              <>
                <span>
                  Stu:{" "}
                  {questionStatistics[date.format("YYYYMMDD")][
                    "numStudents"
                  ] !== undefined &&
                  questionStatistics[date.format("YYYYMMDD")][
                    "numStudentsAssumed"
                  ] !== undefined
                    ? questionStatistics[date.format("YYYYMMDD")][
                        "numStudents"
                      ] >=
                      questionStatistics[date.format("YYYYMMDD")][
                        "numStudentsAssumed"
                      ]
                      ? questionStatistics[date.format("YYYYMMDD")][
                          "numStudents"
                        ]
                      : questionStatistics[date.format("YYYYMMDD")][
                          "numStudentsAssumed"
                        ].toString() + " (act + asm)"
                    : questionStatistics[date.format("YYYYMMDD")][
                        "numStudentsAssumed"
                      ] !== undefined
                    ? questionStatistics[date.format("YYYYMMDD")][
                        "numStudentsAssumed"
                      ].toString() + " (asm)"
                    : dateNotPast
                    ? "0 (TBD)"
                    : "0"}
                </span>
                <br />
                <span>
                  Tut:{" "}
                  {questionStatistics[date.format("YYYYMMDD")]["numTutors"] !==
                    undefined &&
                  questionStatistics[date.format("YYYYMMDD")][
                    "numTutorsAssumed"
                  ] !== undefined
                    ? questionStatistics[date.format("YYYYMMDD")][
                        "numTutors"
                      ] >=
                      questionStatistics[date.format("YYYYMMDD")][
                        "numTutorsAssumed"
                      ]
                      ? questionStatistics[date.format("YYYYMMDD")]["numTutors"]
                      : questionStatistics[date.format("YYYYMMDD")][
                          "numTutorsAssumed"
                        ].toString() + " (act + asm)"
                    : questionStatistics[date.format("YYYYMMDD")][
                        "numTutorsAssumed"
                      ] !== undefined
                    ? questionStatistics[date.format("YYYYMMDD")][
                        "numTutorsAssumed"
                      ].toString() + " (asm)"
                    : dateNotPast
                    ? "0 (TBD)"
                    : "0"}
                </span>
                <br />
                <span>
                  A:{" "}
                  {questionStatistics[date.format("YYYYMMDD")]["numAnswers"] !==
                  undefined
                    ? questionStatistics[date.format("YYYYMMDD")]["numAnswers"]
                    : dateNotPast
                    ? "0 (TBD)"
                    : "0"}
                </span>
                &nbsp;/&nbsp;
                <span>
                  Q:{" "}
                  {questionStatistics[date.format("YYYYMMDD")][
                    "numQuestions"
                  ] !== undefined
                    ? questionStatistics[date.format("YYYYMMDD")][
                        "numQuestions"
                      ]
                    : dateNotPast
                    ? "0 (TBD)"
                    : "0"}
                </span>
              </>
            );
          }
        }}
      />
    </>
  );
};
export default Statistics;
