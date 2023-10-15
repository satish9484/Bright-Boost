import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { db } from "../../../firebase/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import moment from "moment";
import { Button, DatePicker, Form, Select, ConfigProvider } from "antd";
import BreadCrumbs from "../../../components/common/Breadcrumbs";
import Card from "../../../components/common/Card";
import enUS from "antd/lib/locale/en_US";
import { toast } from "react-toastify";

const { Option } = Select;
const dateFormatList = "DD/MM/YYYY";

// Available subjects for registration
const subjects = [
  "English",
  "Mathematics",
  "Science",
  "Humanities and Social Sciences",
  "The Arts",
];

// Tutors by subject
const tutorsBySubject = {
  English: ["Harvey", "John"],
  Mathematics: ["Rose", "Duane"],
  Science: ["Earl", "Clifford"],
  HumanitiesAndSocialSciences: ["Dennis", "Ophelia"],
  TheArts: ["Della", "Kate"],
};

const sessionTime = [1, 2];

// Firebase collection and document details
const collectionName = "Bright-Boost";
const documentId = "SessionRegistration";
const documentId_1 = "tutorsAvailability";

const docRef = doc(db, collectionName, documentId);
const docRef_1 = doc(db, collectionName, documentId_1);

// Initial data for session registration
const initialData = {
  email: "",
  subject: "English",
  tutor: tutorsBySubject["English"][0] || "",
  date: "",
  time: "",
  sessionTime: 1,
};

const SessionRegistration = () => {
  const { currentUser } = useContext(AuthContext);

  const [sessionRegistrationData, setSessionRegistrationData] =
    useState(initialData);

  // Initialize the last day of the current year
  const [lastDayOfYear] = useState(moment().endOf("year"));

  // Form setup
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState(null);
  const [tutorListForSubject, setTutorListForSubject] = useState(
    tutorsBySubject[sessionRegistrationData.subject] || []
  );

  const currentTime = moment().format("HH:mm:ss");

  useEffect(() => {
    // Additional setup can be added here if needed
  }, []);

  // Function to get available session slot limit
  const getAvailableSessionSlot = async (subjectName, date) => {
    const docSnapshot = await getDoc(docRef);
    try {
      if (docSnapshot?.exists()) {
        const data = docSnapshot?.data();
        if (data[subjectName] && data[subjectName][date]) {
          const limit = data[subjectName][date]?.limit;
          return limit;
        } else {
          return null;
        }
      } else {
        toast.info("No data available for this document");
      }
    } catch (error) {
      console.error("Error fetching limit: ", error);
    }
  };

  // Function to check tutor availability on a specific date
  const tutorsAvailability = async (tutorId, date) => {
    const docSnapshot_1 = await getDoc(docRef_1);
    try {
      if (docSnapshot_1?.exists()) {
        const data = docSnapshot_1?.data();

        if (
          data[tutorId]?.availabilityData?.hasOwnProperty(date) &&
          data[tutorId]?.availabilityData[date]
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        toast.warning("No data found in the document.");
      }
    } catch (error) {
      console.error("Error fetching data from Firestore: ", error);
    }
  };

  // Function to update data in Firebase
  const updateDataAtFirebase = async (limit, data) => {
    const docSnapshot = await getDoc(docRef);
    try {
      if (docSnapshot?.exists()) {
        const existingData = docSnapshot?.data() || {};

        if (existingData[sessionRegistrationData.subject]) {
          const subjectData = existingData[sessionRegistrationData?.subject];
          if (subjectData[selectedDate]) {
            subjectData[selectedDate.toString()].limit = 2;
            subjectData[selectedDate][currentTime] = data;
          } else {
            subjectData[selectedDate] = {
              limit: limit,
              [currentTime]: data,
            };
          }

          const updateData = {
            [sessionRegistrationData.subject]: subjectData,
          };

          await updateDoc(docRef, updateData);

          toast.success(
            `You have successfully registered for a session. Date: ${selectedDate} session time ${data.time}`
          );
        } else {
          const dataToSet = {
            [sessionRegistrationData.subject]: {
              [selectedDate]: {
                limit: limit,
                [currentTime]: data,
              },
            },
            ...existingData,
          };

          await setDoc(docRef, dataToSet);
        }
      } else {
        toast.success("Document doesn't exist");
      }
    } catch (error) {
      console.error("Error adding student record: ", error);
    }
  };

  // Function to handle form submission
  const handleFinish = async (values) => {
    const keyFormat = sessionRegistrationData.date.replace(/\//g, "");
    const tutorStatusOnSelectedDate = await tutorsAvailability(
      "tutor1gmailcom",
      keyFormat
    );

    const limit = await getAvailableSessionSlot(
      sessionRegistrationData.subject,
      sessionRegistrationData.date
    );
    const dataToStore = {
      email: currentUser?.email || "",
      time: currentTime,
      sessionTime: values.sessionTime,
      tutor: values.tutor,
    };
    try {
      if (tutorStatusOnSelectedDate) {
        if (limit === 1) {
          if (values.sessionTime === 1) {
            updateDataAtFirebase(values.sessionTime, dataToStore);
          } else {
            toast.info("Please select a session time as 1 hour");
          }
        } else if (limit === null) {
          updateDataAtFirebase(values.sessionTime, dataToStore);
        } else {
          toast.info("No slot available for this date.");
        }
      } else {
        toast.info("Tutor is not available");
      }
    } catch (error) {
      console.error("Error adding student record: ", error);
    }
  };

  // Function to disable dates in the past and beyond the current year
  const disabledDate = (current) => {
    return (
      (current && current < moment().startOf("day")) ||
      (current && current > lastDayOfYear.endOf("day"))
    );
  };

  // Function to handle date change
  const handleDateChange = async (date, dateString) => {
    const keyFormat = dateString.replace(/\//g, "");
    const tutorStatusOnSelectedDate = await tutorsAvailability(
      "tutor1gmailcom",
      keyFormat
    );
    const limit = await getAvailableSessionSlot(
      sessionRegistrationData.subject,
      dateString
    );
    setSelectedDate(dateString);
    setSessionRegistrationData({
      ...sessionRegistrationData,
      date: dateString,
    });

    if (tutorStatusOnSelectedDate) {
      limit === 1
        ? toast.info("Only 1-hour slot is available")
        : limit === 2
        ? toast.info("This day's slot is full.")
        : toast.info("For this day, all slots are available");
    } else {
      toast.info(
        "Please select any other date since the tutor is not available."
      );
    }
  };

  // Function to handle subject change
  const handleSubjectChange = (value) => {
    setSessionRegistrationData({ ...sessionRegistrationData, subject: value });
    if (value in tutorsBySubject) {
      setTutorListForSubject(tutorsBySubject[value]);
      form.setFieldsValue({ tutor: tutorsBySubject[value][0] || "" });
    } else {
      setTutorListForSubject([]);
    }
  };

  return (
    <>
      <BreadCrumbs
        list={[
          {
            name: "Session Registration",
            link: "/student/sessionregistration",
            isActive: false,
          },
        ]}
      />
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ ...initialData }}
        >
          <div className="row">
            <div className="col-md-12">
              <h3 className="pageLabel mar-bottom-18">Add New User</h3>
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
                onChange={handleSubjectChange}
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
              label="Tutor Names"
              labelWrap={true}
              name="tutor"
              rules={[
                {
                  required: true,
                  message: "Please select a tutor",
                },
              ]}
            >
              <Select placeholder="Tutor Names">
                {tutorListForSubject.map((tutor) => (
                  <Option key={tutor} value={tutor}>
                    {tutor}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              className="col-xl-6 col-md-8 form-group"
              label="Session Duration"
              labelWrap={true}
              name="sessionTime"
            >
              <Select placeholder="Select Subject">
                {sessionTime.map((sessionTime) => (
                  <Option key={sessionTime} value={sessionTime}>
                    {sessionTime} hour
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <ConfigProvider locale={enUS}>
              <Form.Item
                className="col-xl-6 col-md-8 form-group"
                label="Date"
                labelWrap={true}
                name="date"
                rules={[
                  {
                    required: true,
                    message: "Please select a date",
                  },
                ]}
              >
                <DatePicker
                  format={dateFormatList}
                  disabledDate={disabledDate}
                  onChange={handleDateChange}
                />
              </Form.Item>
            </ConfigProvider>

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

export default SessionRegistration;
