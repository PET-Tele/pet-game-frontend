import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchCookieData } from '../../middleware/UserService';

// todo: verificar se realmente é necessario e melhorar \/
const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const { userData, setUserData } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                // If we already have userData in context, no need to fetch again
                if (userData) {
                    setIsLoading(false);
                    return;
                }

                // Try to fetch user data from cookie
                const userFromCookie = await fetchCookieData();
                
                if (userFromCookie) {
                    setUserData(userFromCookie);
                } else {
                    // No valid session, redirect to login
                    console.warn("ProtectedRoute: No valid session, redirecting to login");
                    navigate('/login');
                    return;
                }
            } catch (error) {
                console.error('Authentication check failed:', error);
                setError(error.message || "Authentication failed");
                navigate('/login');
                return;
            }
            
            setIsLoading(false);
        };

        checkAuthentication();
    }, [userData, setUserData, navigate]);

    // Show loading state while checking authentication
    if (isLoading) {
        return <div>Loading... {error && <p>Error: {error}</p>}</div>;
    }

    // If we have userData, render the protected component
    return userData ? children : null;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
