import React from "react";

import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  // Function to handle redirection based on user role
  const handleGoHome = () => {
    const userRole = localStorage.getItem("role"); // Assuming role is stored in localStorage

    if (userRole === "admin") {
      navigate("/admin/dashboard");
    } else if (userRole === "manager") {
      navigate("/manager/dashboard");
    } else if (userRole === "employee") {
      navigate("/employee/dashboard");
    } else {
      navigate("/"); // Default homepage if no role found
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-2">Oops! Page Not Found</p>
      <p className="text-md text-gray-500 mt-1">
        The page you're looking for might have been removed or doesn't exist.
      </p>
      <button
        onClick={handleGoHome}
        className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
