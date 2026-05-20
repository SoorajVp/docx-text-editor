// src/components/ErrorPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = ({ type }) => {
    return (
        // <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
        //     <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        //         <h1 className="text-4xl font-bold text-red-500 mb-4">
        //             {type === "offline" ? "No Internet Connection" : "Server Unavailable"}
        //         </h1>
        //         <p className="text-gray-600 mb-6">
        //             {type === "offline"
        //                 ? "Please check your internet connection and try again."
        //                 : "The server is currently down. Please try again later."}
        //         </p>
        //         <button
        //             onClick={() => window.location.reload()}
        //             className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        //         >
        //             Retry
        //         </button>
        //     </div>
        // </div>
        <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 px-4">
            {/* <h1 className="text-6xl font-bold mb-4">404</h1> */}
            <p className="text-2xl font-bold mb-2">
                {type === "offline" ? "No Internet Connection" : "Server Unavailable"}
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
                {type === "offline"
                    ? "Please check your internet connection and try again."
                    : "The server is currently down. Please try again later."}
            </p>
            <Link
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-orange-500 text-white hover:bg-orange-600 transition"
                         >
                Retry
            </Link>
        </div>
    );
};

export default ErrorPage;
