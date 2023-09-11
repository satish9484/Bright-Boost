import React from "react";
import { Link } from "react-router-dom";
import "./style.scss";

const BreadCrumbs = (props) => {
  const { list } = props;

  return (
    <>
      <div className="breadcrumbs-grp">
        <ul className="breadcrumbsList">
          {list?.map((i, index) => {
           
            return (
              <li key={index}>
                {i.isActive ? (
                  <Link to={`${i.link}`}>
                    <h4>{i.name}</h4>
                  </Link>
                ) : (
                  <h4>{i.name}</h4>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default BreadCrumbs;
