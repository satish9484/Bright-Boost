import React from "react";
import "./style.scss";

const Card = (props) => {
  const { children, className } = props;

  return (
    <>
      <div className={`card ${className}`}>{children}</div>
    </>
  );
};

export default Card;
