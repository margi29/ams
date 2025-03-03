import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[var(--background-light)]">
      <h1 className="text-4xl font-bold text-red-600">404</h1>
      <p className="text-lg text-[var(--primary-dark)] mt-2">Page Not Found</p>
    </div>
  );
};

export default NotFound;
