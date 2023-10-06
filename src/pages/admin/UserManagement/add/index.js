import React, { useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../../../firebase/firebase";

const AddUser = () => {
  const docRef = doc(db, "Bright-Boost");

  useEffect(() => {
    // Data for the new student record
    const newStudentData = {
      activeSubscription: "6months",
      address: "2 First Street,Exp,Melbourne,VIC,3344",
      dateOfBirth: "02/06/1995",
      email: "abc@gmail.com",
      gender: "Male",
      imageURL:
        "https://firebasestorage.googleapis.com/v0/b/placement-app-862af.appspot.com/o/Notification_Image%2F1614771609186.jpg?alt=media&token=51a91456-eb56-4b0c-ba93-08adc066c264",
      name: "akshat",
      phoneNumber: "04568789",
      status: "active",
      studentID: uuidv4(),
    };
    // Add the new student record to the "students" array within the document
    setDoc(docRef, { students: [newStudentData] }, { merge: true });
  }, [docRef]);

  return <>addUser</>;
};

export default AddUser;
