import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
    const navigate = useNavigate();
    const isLoggedIn = useSelector(s => !!s?.auth?.user?.token);

    useEffect(() => {
        if (!isLoggedIn) navigate('/signin', { replace: true });
    }, [isLoggedIn, navigate])

    return (
        <>
            {children}
        </>
    )
}

export default AuthGuard;