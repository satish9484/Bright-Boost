import React, { useEffect, useState } from "react";
import { db } from "../../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { List, Card, Typography } from "antd";

const { Title, Text } = Typography;

const ViewHelpline = () => {
	const [data, setData] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const docRef = doc(db, "Bright-Boost", "helpline");
				const docSnap = await getDoc(docRef);
				const data = docSnap.data();
				setData(data);
			} catch (error) {
				console.error("Error fetching data from Firebase:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div style={{ padding: 20 }}>
			{data &&
				Object.entries(data).map(([subject, records]) => (
					<Card key={subject} title={<Title level={3}>{subject}</Title>}>
						<List
							dataSource={records}
							renderItem={(record, index) => (
								<List.Item key={index}>
									<div>
										<Text strong>Email:</Text> {record.email}
									</div>
									<div>
										<Text strong>Inquiry:</Text> {record.inquiry}
									</div>
									<div>
										<Text strong>Urgency:</Text> {record.urgency}
									</div>
								</List.Item>
							)}
						/>
					</Card>
				))}
		</div>
	);
};

export default ViewHelpline;
