import React, { useState } from "react";
import { addAlert } from "../../api";
import AlertInfo from "../UIcomponents/AlertInfo";

export default function SetAlert({
  user,
  productTitle,
  productPrice,
  productUrl,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const triggerAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000); // Hide alert after 5 seconds
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleAddAlert = async (e) => {
    e.preventDefault(); // Prevent form submission

    // Clean the price and targetPrice
    const cleanedPrice = parseFloat(productPrice.replace(/[^\d.-]/g, "")); // Removes non-numeric characters
    const cleanedTargetPrice = parseFloat(targetPrice.replace(/[^\d.-]/g, "")); // Same for targetPrice

    // Check if cleaning was successful
    if (isNaN(cleanedPrice) || isNaN(cleanedTargetPrice)) {
      alert("Invalid price format.");
      return;
    }

    try {
      const alertData = {
        title: productTitle,
        url: productUrl,
        price: cleanedPrice, // Use cleaned price
        targetPrice: cleanedTargetPrice, // Use cleaned target price
      };

      // Log the cleaned data
      console.log("Alert Data being sent:", alertData);

      // Call the API method with the cleaned data
      await addAlert(alertData);

      // Handle success
      triggerAlert();
      setIsOpen(false); // Close the dropdown after submission
    } catch (error) {
      console.error("Error creating alert:", error);
    }
  };

  return (
    <div className="relative inline-block text-left">
      {showAlert && (
        <AlertInfo message="Alert created Successfully" type="success" />
      )}
      {/* Button to toggle dropdown */}
      <button
        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium w-36 rounded-xl ml-3"
        onClick={toggleDropdown}
      >
        Create Alert
      </button>

      {/* Dropdown content */}
      {isOpen &&
        (user ? (
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
                  value={user?.email || ""} // Default value from props
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
        ) : (
          <div className="absolute mt-2 right-0 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-lg z-50 p-4 border border-gray-200 dark:border-gray-700 dark:text-white">
            Login to set alerts
          </div>
        ))}
    </div>
  );
}
