import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import BreadCrumbs from "../../../../components/common/Breadcrumbs";
import Card from "../../../../components/common/Card";

const breadcrumbsList = [
  {
    name: "Report and Graph",
    link: "/admin/popularsubject",
    isActive: false,
  },
  {
    name: "Popular Subject",
    link: "/admin/popularsubject",
    isActive: false,
  },
];

const data = [
  { name: "English", dataset1: 300 },
  { name: "Mathematics", dataset1: 700 },
  { name: "Science", dataset1: 650 },
  { name: "The Arts", dataset1: 400 },
  { name: "Social Sciences", dataset1: 450 },
];

function App() {
  return (
    <>
      <BreadCrumbs list={breadcrumbsList} />
      <Card>
        {/* <h2>Bar Chart Example (Using recharts)</h2> */}
        <BarChart width={800} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="dataset1"
            fill="rgba(255, 99, 132, 0.5)"
            name="Subject popularity as registered sessions counts for the subject.."
          />
          {/* <Bar
          dataKey="dataset2"
          fill="rgba(53, 162, 235, 0.5)"
          name="Dataset 2"
        /> */}
        </BarChart>
      </Card>
    </>
  );
}

export default App;
