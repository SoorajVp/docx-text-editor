import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TabTitle = () => {
    const location = useLocation();

    useEffect(() => {
        const pathSegment = location.pathname.split('/')[1];
        const pathWithSpaces = pathSegment.replace(/-/g, ' '); // Replace hyphens with spaces
        const formattedPathName = pathWithSpaces
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        if (formattedPathName) {
            document.title = `${formattedPathName} - Documate Helper`;
        }
    }, [location]);

    return null;
};

export default TabTitle;