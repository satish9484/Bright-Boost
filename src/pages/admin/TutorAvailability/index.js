import { Badge, Calendar } from "antd";
import moment from "moment";
import "./style.scss";
import BreadCrumbs from "../../../components/common/Breadcrumbs";

const list = [
  {
    name: "Tutor Availabilty",
    link: "/admin/tutoravailabilty",
    isActive: false,
  },
];

const getListData = (value) => {
  let listData;
  switch (value.date()) {
    case 8:
      listData = [
        {
          type: "warning",
          content: "This is warning event.",
        },
        {
          type: "success",
          content: "This is usual event.",
        },
      ];
      break;
    case 10:
      listData = [
        {
          type: "warning",
          content: "This is warning event.",
        },
        {
          type: "success",
          content: "This is usual event.",
        },
        {
          type: "error",
          content: "This is error event.",
        },
      ];
      break;
    case 15:
      listData = [
        {
          type: "warning",
          content: "This is warning event",
        },
        {
          type: "success",
          content: "This is very long usual event......",
        },
        {
          type: "error",
          content: "This is error event 1.",
        },
        {
          type: "error",
          content: "This is error event 2.",
        },
        {
          type: "error",
          content: "This is error event 3.",
        },
        {
          type: "error",
          content: "This is error event 4.",
        },
      ];
      break;
    default:
  }
  return listData || [];
};
const getMonthData = (value) => {
  if (value.month() === 8) {
    return 1394;
  }
};
const TutorAvailabilty = () => {
  const currentYear = moment().year(); // Get the current year
  const futureYear = 2040; // Set the future year

  // Define the validRange for the Calendar component
  const validRange = [
    moment(`${currentYear}-01-01`),
    moment(`${futureYear}-12-31`),
  ];

  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  // const headerRender = ({ value, type, onChange }) => {
  //   if (type === "date") {
  //     return (
  //       <div className="custom-calendar-header">
  //         <h2>{value.format("MMMM YYYY")}</h2>
  //         <div className="custom-calendar-header-nav">
  //           <span
  //             className="custom-calendar-header-prev"
  //             onClick={() => onChange(value.clone().subtract(1, "month"))}
  //           >
  //             Prev
  //           </span>
  //           <span
  //             className="custom-calendar-header-next"
  //             onClick={() => onChange(value.clone().add(1, "month"))}
  //           >
  //             Next
  //           </span>
  //         </div>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  return (
    <>
      <BreadCrumbs list={list} />
      <Calendar
        cellRender={cellRender}
        validRange={validRange}

        // headerRender={headerRender}
      />
    </>
  );
};
export default TutorAvailabilty;
