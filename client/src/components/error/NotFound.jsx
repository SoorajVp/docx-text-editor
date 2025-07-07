import React from 'react';
import { Link } from 'react-router-dom'; // Optional if you're using React Router

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 px-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl mb-2">Page Not Found</p>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
                Sorry, the page you are looking for does not exist <br /> or has been moved.
            </p>
            <Link
                to="/"
                className="px-6 py-2 bg-orange-500 text-white hover:bg-orange-600 transition"
            >
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;
