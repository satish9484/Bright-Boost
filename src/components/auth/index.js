import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AuthGuard = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate(null);

  useEffect(() => {
    if (!currentUser) navigate("/login", { replace: true });
  }, [currentUser, navigate]);

  return <>{children}</>;
};

export default AuthGuard;
