import React, { useState } from "react";
import { addAlert } from "../../api";
import AlertInfo from "../UIcomponents/AlertInfo";

export default function SetAlert({ user, productTitle, productPrice, productUrl,}) {
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
    const cleanedPrice = parseFloat(productPrice.replace(/[^\d.-]/g, '')); // Removes non-numeric characters
    const cleanedTargetPrice = parseFloat(targetPrice.replace(/[^\d.-]/g, '')); // Same for targetPrice
  
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
      {showAlert && <AlertInfo message="Alert created Successfully" type="success" />}
      {/* Button to toggle dropdown */}
      <button
        className="btn btn-warning w-36 rounded-3xl ml-3"
        onClick={toggleDropdown}
      >
        Create Alert
      </button>

      {/* Dropdown content */}
      {isOpen &&
        (user ? (
          <div
            className="absolute mt-2 right-0 w-80 bg-base-100 rounded-3xl shadow-lg z-40 p-4"
            style={{ minWidth: "300px" }}
          >
            <h2 className="text-lg font-semibold mb-4">Create Alert</h2>
            <form onSubmit={handleAddAlert} className="space-y-4">
              {/* Product Name */}
              <div>
                <label
                  htmlFor="productName"
                  className="label text-sm font-bold"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={productTitle || ""} // Default value from props
                  className="input input-bordered w-full rounded-2xl"
                  required
                  readOnly // Makes it uneditable (optional)
                />
              </div>

              {/* Desired Price */}
              <div>
                <label
                  htmlFor="desiredPrice"
                  className="label text-sm font-bold"
                >
                  Desired Price
                </label>
                <input
                  type="number"
                  id="desiredPrice"
                  name="desiredPrice"
                  placeholder="Enter your target price"
                  className="input input-bordered w-full rounded-2xl"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="label text-sm font-bold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user?.email || ""} // Default value from props
                  className="input input-bordered w-full rounded-2xl"
                  required
                  readOnly // Makes it uneditable (optional)
                />
              </div>

              {/* Submit Button */}
              <div className="text-right">
                <button type="submit" className="btn btn-success rounded-3xl">
                  Submit
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="absolute mt-2 right-0 w-44 bg-base-100 rounded-lg shadow-lg z-50 p-4">
            Login to set alerts
          </div>
        ))}
    </div>
  );
}
