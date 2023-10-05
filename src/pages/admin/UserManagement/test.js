const collectionName = "Bright-Boost";
const documentId = "register-document";

const initialStudentData = {
  date: "dfads",
  subject: "fdfsfasd",
  time: "active",
};

const [data, setdata] = useState(initialStudentData);

const adddataRecord = async () => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, { student: arrayUnion(data) });
    console.log("Student record added successfully!");
  } catch (error) {
    console.error("Error adding student record: ", error);
  }
};
