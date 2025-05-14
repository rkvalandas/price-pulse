import React, { useEffect, useState } from "react";

const AlertInfo = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Alert disappears after 5 seconds

    return () => clearTimeout(timer); // Cleanup the timeout on unmount
  }, []);

  if (!isVisible) return null;

  // Determine the appropriate colors based on alert type
  const alertColors = {
    success:
      "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 border-green-500",
    error:
      "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 border-red-500",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 border-yellow-500",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 border-blue-500",
  };

  return (
    <div
      className={`fixed top-64 left-1/2 transform -translate-x-1/2 mt-4 px-6 py-3 w-60 rounded-lg shadow-md border flex items-center ${
        alertColors[type] || alertColors.info
      }`}
      style={{ zIndex: 9999 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="h-6 w-6 shrink-0 stroke-current mr-2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span>{message}</span>
    </div>
  );
};

export default AlertInfo;
