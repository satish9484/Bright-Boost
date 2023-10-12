import { useEffect, useState } from "react";
import { Table, Input, Row, Col, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
	// arrayUnion,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
	// updateDoc,
	where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import CustomModal from "../../../components/common/Modal";
import BreadCrumbs from "../../../components/common/Breadcrumbs";
import { db } from "../../../firebase/firebase";
import "./style.scss";

const { Search } = Input;

const list = [
	{
		name: "View Student Inquiries",
		link: "/",
		isActive: true,
	},
];

const ViewHelpline = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const collectionName = "Bright-Boost";
	const documentId = "helpline";
	const docRef = doc(db, collectionName, documentId);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const docSnapshot = await getDoc(docRef);
				if (docSnapshot.exists()) {
					const docData = docSnapshot.data();
					setData(docData);
					console.log(docData);
				}
			} catch (error) {
				setError("Error fetching document: " + error.message);
			} finally {
				setLoading(false); // Set loading to false after data fetching is complete
			}
		};
		fetchData();
	}, []);

	const columns = [
		// ID
		{
			title: "Student Id",
			dataIndex: "id",
			key: "id",
			render: (row) => (
				<div>
					<div>{row}</div>
				</div>
			),
		},
		// NAME
		{
			title: "Full Name",
			dataIndex: "firstName",
			key: "firstName",
			render: (row) => (
				<div>
					<div>{row}</div>
				</div>
			),
		},
		// Email
		{
			title: "Email",
			dataIndex: "emailAddress",
			key: "emailAddress",
			render: (row) => (
				<div>
					<div>{row}</div>
				</div>
			),
		},
		// PHONE NUMBER
		{
			title: "Phone Number",
			dataIndex: "phoneNumber",
			key: "phoneNumber",
			render: (row) => (
				<div>
					<div>{row}</div>
				</div>
			),
		},
		// LOCATION
		{
			title: "Location  ",
			dataIndex: "streetAddress",
			key: "streetAddress",
			render: (row) => (
				<div>
					<div>{row}</div>
				</div>
			),
		},
		// COUNTRY
		{
			title: "Country",
			dataIndex: "country",
			key: "country",
			render: (row) => (
				<div>
					<div>{row}</div>
				</div>
			),
		},
		// USER STATUS
		{
			title: "User Status",
			dataIndex: "active",
			key: "active",
			render: (active, record) => {
				return (
					<div
						className={`${
							active ? "verified verification" : "verification inReview"
						} cPointer`}
						onClick={() => updateStudentStatus(record.emailAddress, !active)}
					>
						{active ? "Active" : "Inactive"}
					</div>
				);
			},
		},
		// ACTION
		{
			title: "Action",
			key: "action",
			render: () => (
				<>
					<div className="d-flex">
						<div className="mar-right-8 cPointer">
							{" "}
							<Link to="/admin/userManagement/edit">
								<EditOutlined style={{ fontSize: "20px", color: "black" }} />
							</Link>
						</div>
						<div onClick={showModal} className="cPointer">
							<DeleteOutlined style={{ fontSize: "20px" }} />
						</div>
					</div>
				</>
			),
		},
	];

	const [isModalOpen, setIsModalOpen] = useState(false);
	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			{/* {loading ? (
				<div>Loading...</div>
			) : error ? (
				<div>Error: {error}</div>
			) : (
				<>
					<BreadCrumbs list={list} />
					<div className="user-management shadow-paper auto-height">
						<Row
							gutter={[
								{ xs: 0, sm: 0 },
								{ xs: 12, sm: 12 },
							]}
							className="mar-bottom-20"
						>
							<Col xl={12} lg={8} md={16} sm={24}>
								<div className="searchGrp">
									<Search
										placeholder="Search by name"
										size="large"
										onSearch={onSearch}
										className="search"
									/>
								</div>
							</Col>
							<Col xl={12} lg={16} md={8} sm={24}>
								<Row justify="end">
									<Button type="primary">
										<Link to="/admin/userManagement/add">Add</Link>
									</Button>
								</Row>
							</Col>
						</Row>
						<Table
							columns={columns}
							dataSource={data.map((item) => ({
								...item,
								key: item.id, // Assuming 'id' is a unique identifier
							}))}
							scroll={{ x: 980 }}
						/>
					</div>
					<CustomModal
						open={isModalOpen}
						onOk={handleOk}
						onCancel={handleCancel}
					>
						<p>Are you sure you want to delete?</p>
					</CustomModal>
				</>
			)} */}
		</>
	);
};

export default ViewHelpline;
