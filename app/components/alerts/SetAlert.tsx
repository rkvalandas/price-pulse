"use client";

import { useState } from "react";
import { addAlert } from "../../api";
import AlertInfo from "../ui/AlertInfo";

interface SetAlertProps {
  productId: string;
  productData: {
    id: string;
    title: string;
    image: string;
    currentPrice: number;
    url: string;
  };
}

const SetAlert: React.FC<SetAlertProps> = ({ productData }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [targetPrice, setTargetPrice] = useState(
    productData.currentPrice ? (productData.currentPrice * 0.9).toFixed(2) : ""
  );
  const [loading, setLoading] = useState(false);

  const handleSetAlert = async () => {
    if (!targetPrice || parseFloat(targetPrice) <= 0) {
      setAlertMessage("Please enter a valid target price");
      setAlertType("error");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
      return;
    }

    setLoading(true);

    try {
      const alertData = {
        title: productData.title,
        price: productData.currentPrice,
        targetPrice: parseFloat(targetPrice),
        url: productData.url,
        imageUrl: productData.image,
      };

      const response = await addAlert(alertData);

      if (response.status === 201 || response.status === 200) {
        setAlertMessage("Price alert has been set successfully!");
        setAlertType("success");
      } else {
        throw new Error("Failed to set price alert");
      }
    } catch (error: unknown) {
      console.error("Error setting alert:", error);
      setAlertMessage(
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Failed to set price alert"
          : "Failed to set price alert"
      );
      setAlertType("error");
    } finally {
      setLoading(false);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }
  };

  return (
    <div className="relative">
      {showAlert && (
        <AlertInfo
          message={alertMessage}
          type={alertType as "success" | "error" | "info" | "warning"}
        />
      )}

      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
        <div className="mb-4">
          <label
            htmlFor="target-price"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Set Price Alert
          </label>
          <div className="flex items-center">
            <span className="text-gray-500 dark:text-gray-400 mr-2">$</span>
            <input
              type="number"
              id="target-price"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              min="0"
              step="0.01"
              placeholder="Enter target price"
              className="flex-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm dark:bg-gray-800 dark:text-white"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            We&apos;ll notify you when the price drops to or below this amount.
          </p>
        </div>

        <button
          onClick={handleSetAlert}
          disabled={loading}
          className="w-full bg-gray-800 hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Setting Alert...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
              Set Price Alert
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SetAlert;
