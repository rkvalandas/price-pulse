"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { deleteAlert, getAlerts, searchProduct } from "../../api";
import { useAuth } from "../../context/AuthContext";
import AlertInfo from "../ui/AlertInfo";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Define TypeScript interfaces aligned with backend models
interface Alert {
  _id: string;
  id?: string; // For backward compatibility
  title: string;
  url: string;
  imageUrl: string;
  price: number;
  targetPrice: number;
  userEmail: string;
  createdAt: string;
  product?: {
    title?: string;
    image?: string;
    url?: string;
    currentPrice?: string;
    website?: string;
  };
}

// Reusable Alert Card Component
const AlertCard = ({
  alert,
  onDelete,
  onViewPrice,
}: {
  alert: Alert;
  onDelete: (id: string) => Promise<void>;
  onViewPrice: (url: string) => Promise<void>;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(alert._id);
    // No need to set back to false since the component will unmount
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl overflow-hidden scrollbar-hide"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        y: -8,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
            Price Alert
          </h3>
          <motion.span
            className="px-2 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 text-xs font-medium rounded-full flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <span className="w-2 h-2 rounded-full bg-teal-500 mr-1"></span>
            Active
          </motion.span>
        </div>

        <div className="mb-3">
          <h2 className="font-bold text-base sm:text-lg text-gray-800 dark:text-white line-clamp-2">
            {alert.title}
          </h2>
        </div>

        {/* Product Image */}
        <div className="mb-4">
          <div className="relative h-40 sm:h-48 w-full rounded-lg overflow-hidden">
            {alert.imageUrl ? (
              <Image
                src={alert.imageUrl}
                alt={alert.title || "Product Image"}
                fill
                style={{ objectFit: "contain" }}
                className="rounded-lg"
              />
            ) : (
              <div className="h-full w-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">
                  No image
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Price and Target Information */}
        <div className="mb-5">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              Current Price:
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              ₹{new Intl.NumberFormat("en-IN").format(alert.price)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              Target Price:
            </span>
            <span className="font-semibold text-teal-600 dark:text-teal-400">
              ₹{new Intl.NumberFormat("en-IN").format(alert.targetPrice)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onViewPrice(alert.url)}
            className="flex-1 py-2.5 sm:py-2 px-3 sm:px-2 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 font-medium rounded-lg transition-colors hover:bg-teal-200 dark:hover:bg-teal-900/50 flex items-center justify-center text-sm min-h-[44px]"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path>
            </svg>
            Check Price
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 py-2.5 sm:py-2 px-3 sm:px-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 font-medium rounded-lg transition-colors hover:bg-red-200 dark:hover:bg-red-900/50 flex items-center justify-center text-sm min-h-[44px]"
          >
            {isDeleting ? (
              <svg
                className="animate-spin h-4 w-4"
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
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
                Delete Alert
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Main User Alerts Component
export default function UserAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true); // Unified loading state
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: string;
  } | null>(null);
  // State for checking price - removed as unused
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Fetch alerts
  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAlerts();
      if (response.data && Array.isArray(response.data.alerts)) {
        setAlerts(response.data.alerts);
      } else {
        setAlerts([]);
      }
    } catch (err: unknown) {
      console.error("Error fetching alerts:", err);
      setError(
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Failed to load alerts"
          : "Failed to load alerts"
      );
    }
    setLoading(false);
  }, []);

  // Delete an alert
  const handleDeleteAlert = async (id: string) => {
    try {
      await deleteAlert(id);
      setAlerts((prev) => prev.filter((alert) => alert._id !== id));

      // Show success notification
      setNotification({
        message: "Alert deleted successfully",
        type: "success",
      });

      // Auto hide notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err: unknown) {
      console.error(
        "Error deleting alert:",
        err && typeof err === "object"
          ? (err as Error).message ||
              ("response" in err &&
                (err as { response?: { data?: { message?: string } } }).response
                  ?.data?.message) ||
              "Unknown error"
          : "Unknown error"
      );

      // Show error notification
      setNotification({
        message: "Failed to delete alert. Please try again.",
        type: "error",
      });

      // Auto hide notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  // Handle view current price button click
  const handleViewCurrentPrice = async (url: string) => {
    if (!url) {
      setNotification({
        message: "Invalid product URL",
        type: "error",
      });
      return;
    }

    // No need to set loading state here as router will handle loading indication
    setNotification({
      message: "Checking current price...",
      type: "info",
    });

    try {
      // First navigate to product page with loading state
      router.push("/product?loading=true");
      console.log("current url", url);

      // Then fetch the data
      const response = await searchProduct(url);
      console.log("response", response.data);

      if (response && response.data) {
        // Store the product data in sessionStorage for more reliable data transfer
        sessionStorage.setItem("productData", JSON.stringify(response.data));
        console.log("Product data stored in sessionStorage:", response.data);

        // Navigate to product page without parameters
        router.push("/product");
      } else {
        throw new Error("No product data found");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      // Navigate to product page with error state
      router.push(
        `/product?error=${encodeURIComponent("Failed to check current price")}`
      );
    } finally {
      // Router is already handling state changes
    }
  };

  useEffect(() => {
    if (typeof isAuthenticated === "undefined") return;

    if (isAuthenticated) {
      fetchAlerts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, fetchAlerts]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Render Loading
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-teal-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 mt-4 font-medium">Loading your alerts...</p>
      </div>
    );
  }

  // Render Error
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-bold mb-2 dark:text-white">
            Error Loading Alerts
          </h3>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={fetchAlerts}
            className="px-4 py-2 text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center mx-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-white dark:bg-gray-900 pt-16 sm:pt-20 pb-8 sm:pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                Your Price Alerts
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                We&apos;ll notify you when prices drop below your target
              </p>
            </div>
            <motion.div
              className="mt-4 sm:mt-0"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/"
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg flex items-center transition-colors shadow-md min-h-[44px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Track New Product
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {isAuthenticated ? (
          alerts.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center py-12 sm:py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                className="bg-teal-100 dark:bg-teal-900/30 p-4 rounded-full mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.3,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-teal-500 dark:text-teal-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </motion.div>
              <motion.h3
                className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                No Price Alerts
              </motion.h3>
              <motion.p
                className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                You haven&apos;t created any price alerts yet. Search for
                products and set price targets to get notified on price drops.
              </motion.p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href="/"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg flex items-center transition-colors shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Find Products to Track
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {alerts.map((alert) => (
                <AlertCard
                  key={alert._id}
                  alert={alert}
                  onDelete={handleDeleteAlert}
                  onViewPrice={handleViewCurrentPrice}
                />
              ))}
            </motion.div>
          )
        ) : (
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 text-center border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full inline-block mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </motion.div>
            <motion.h3
              className="text-2xl font-bold mb-2 text-gray-800 dark:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Authentication Required
            </motion.h3>
            <motion.p
              className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Please log in to view and manage your price alerts. Creating an
              account allows you to track prices and receive notifications.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors shadow-md min-h-[44px] flex items-center justify-center"
                >
                  Log In
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/signup"
                  className="px-5 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg transition-colors shadow-md min-h-[44px] flex items-center justify-center"
                >
                  Sign Up
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Notification Toast */}
        {notification && (
          <motion.div
            className={`fixed bottom-4 left-0 right-0 mx-auto w-max max-w-md px-6 py-3 rounded-lg shadow-lg z-50 flex items-center ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : notification.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            {notification.type === "success" && (
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            )}
            {notification.type === "error" && (
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            )}
            {notification.type === "info" && (
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </section>
    </motion.div>
  );
}
