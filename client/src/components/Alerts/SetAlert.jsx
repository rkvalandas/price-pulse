import React, { useState } from "react";
import { addAlert } from "../../api";
import AlertInfo from "../UIcomponents/AlertInfo";
import { useAuth } from "../Authenticate/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SetAlert({
  productTitle,
  productPrice,
  productUrl,
}) {
  const { isAuthenticated, userData } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const triggerAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000); // Hide alert after 5 seconds
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleAddAlert = async (e) => {
    e.preventDefault(); // Prevent form submission
    
    // First check if user is authenticated
    if (!isAuthenticated) {
      setErrorMessage("Please log in to set price alerts");
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    // Clean the price and targetPrice
    const cleanedPrice = parseFloat(productPrice.replace(/[^\d.-]/g, "")); // Removes non-numeric characters
    const cleanedTargetPrice = parseFloat(targetPrice.replace(/[^\d.-]/g, "")); // Same for targetPrice

    // Check if cleaning was successful
    if (isNaN(cleanedPrice) || isNaN(cleanedTargetPrice)) {
      setErrorMessage("Invalid price format.");
      return;
    }

    try {
      const alertData = {
        title: productTitle,
        url: productUrl,
        price: cleanedPrice, // Use cleaned price
        targetPrice: cleanedTargetPrice, // Use cleaned target price
      };

      // Call the API method with the cleaned data
      await addAlert(alertData);

      // Handle success
      triggerAlert();
      setIsOpen(false); // Close the dropdown after submission
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating alert:", error);
      setErrorMessage(error.response?.data?.error || "Failed to create alert. Please try again.");
    }
  };

  return (
    <div className="relative inline-block text-left">
      {showAlert && (
        <AlertInfo message="Alert created Successfully" type="success" />
      )}
      {errorMessage && (
        <AlertInfo message={errorMessage} type="error" />
      )}
      {/* Button to toggle dropdown */}
      <button
        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium w-36 rounded-xl ml-3"
        onClick={toggleDropdown}
      >
        Create Alert
      </button>

      {/* Dropdown content */}
      {isOpen && (
        <div
          className="absolute mt-2 right-0 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg z-40 p-4 border border-gray-200 dark:border-gray-700"
          style={{ minWidth: "300px" }}
        >
          <h2 className="text-lg font-semibold mb-4 dark:text-white">
            Create Alert
          </h2>
          <form onSubmit={handleAddAlert} className="space-y-4">
            {/* Product Name */}
            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-bold mb-2 dark:text-gray-200"
              >
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={productTitle || ""} // Default value from props
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                required
                readOnly // Makes it uneditable (optional)
              />
            </div>

            {/* Desired Price */}
            <div>
              <label
                htmlFor="desiredPrice"
                className="block text-sm font-bold mb-2 dark:text-gray-200"
              >
                Desired Price
              </label>
              <input
                type="number"
                id="desiredPrice"
                name="desiredPrice"
                placeholder="Enter your target price"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold mb-2 dark:text-gray-200"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData?.email || ""} // Use userData from auth context
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                required
                readOnly // Makes it uneditable (optional)
              />
            </div>

            {/* Submit Button */}
            <div className="text-right">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
