import { Col, Row } from "antd";
import "./style.scss";
import React from "react";

const demo = [
  { cardTitle: "demo1", patientCount: "55%", dashUserImg: "no-img" },
  { cardTitle: "demo1", patientCount: "55%", dashUserImg: "no-img" },
  { cardTitle: "demo1", patientCount: "55%", dashUserImg: "no-img" },
  { cardTitle: "demo1", patientCount: "55%", dashUserImg: "no-img" },
  { cardTitle: "demo1", patientCount: "55%", dashUserImg: "no-img" },
  { cardTitle: "demo2", patientCount: "35%", dashUserImg: "no-img" },
];

const Dashboard = () => {
  const DashCard = ({ cardTitle, patientCount, dashUserImg }) => {
    return (
      <>
        <Col className="gutter-row" lg={6} md={8} sm={12}>
          <div className="card-box">
            <figure>{dashUserImg}</figure>
            <h5>{cardTitle}</h5>
            <div>{patientCount}</div>
          </div>
        </Col>
      </>
    );
  };

  return (
    <>
      <Row gutter={[30, 16]} className="row-h-100">
        <Col md={24} xl={24} className="col-h-100">
          <div className="custon-scroll remove-scroll-sm">
            <Row
              gutter={{
                xs: 8,
                sm: 16,
                md: 24,
                lg: 32,
              }}
            >
              {demo?.map((dashCard, i) => (
                <React.Fragment key={i}>
                  <DashCard
                    key={i}
                    index={i}
                    // onClick={handleClick}
                    cardTitle={dashCard.cardTitle}
                    patientCount={dashCard.patientCount}
                    dashUser={dashCard.dashUserImg}
                  />
                </React.Fragment>
              ))}
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
