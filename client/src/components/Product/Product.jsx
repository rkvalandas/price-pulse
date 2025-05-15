import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import SetAlert from "../Alerts/SetAlert";
import { useAuth } from "../Authenticate/AuthContext";

export default function Product() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState(null);

  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if there's an error in location state
    if (location.state?.error) {
      setError(location.state.error);
      setIsLoading(false);
      return;
    }

    // Check if data exists in location state
    if (location.state?.data?.product) {
      setProductData(location.state.data.product);
      setIsLoading(false);
    } else if (location.state?.isLoading) {
      // If still loading, keep loading state true
      setIsLoading(true);
    } else {
      // If navigated directly to /product without data
      setIsLoading(false);
    }
  }, [location.state]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-4">
        <div className="w-20 h-20 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-bold mb-2 dark:text-white">
          Loading Product Data
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Please wait while we fetch the product information...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-red-200 dark:border-red-700 max-w-md w-full text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 mx-auto mb-4"
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
          <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">
            Error Loading Product
          </h2>
          <p className="mb-6 dark:text-gray-300">
            {error ||
              "An error occurred while fetching the product data. Please try again."}
          </p>
          <Link to="/">
            <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200 w-full">
              Return to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // No product data state
  if (!productData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-teal-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            No Product Data Available
          </h2>
          <p className="mb-6 dark:text-gray-300">
            We couldn't find any product information. Please go back and search
            for a product.
          </p>
          <Link to="/">
            <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200 w-full">
              Return to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const {
    productTitle,
    productImageUrl,
    productPrice,
    productUrl,
    productGraph,
    productSpecs,
    productDescription,
  } = productData;
  const encodedGraph = encodeURIComponent(productGraph);

  return (
    <div className="mx-auto bg-white dark:bg-gray-900 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col rounded-xl p-2 mt-14">
        <div className="flex justify-center bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg w-full">
          <div className="flex flex-col md:flex-row items-center justify-center md:items-center md:gap-8 p-5 text-center md:text-left w-full">
            <img
              src={productImageUrl}
              alt="Product"
              className="max-w-xs rounded-xl shadow-lg m-3"
            />
            <div>
              <h1 className="text-2xl font-bold mb-4 mt-3 dark:text-white">
                {productTitle}
              </h1>
              <p className="text-xl mb-10 mt-6 dark:text-gray-200">
                <b>Price: </b> <span>&#8377;</span>
                {productPrice || "N/A"}
              </p>
              <div className="flex justify-center">
                <a href={productUrl} target="_blank" rel="noopener noreferrer">
                  <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium w-36 rounded-xl mr-3">
                    Buy Now
                  </button>
                </a>
                <SetAlert
                  user={userData}
                  productTitle={productTitle}
                  productPrice={productPrice}
                  productUrl={productUrl}
                />
              </div>
            </div>
          </div>
        </div>
        <h2 className="text-xl mt-8 text-center dark:text-white">
          <strong>Price History of the product</strong>
        </h2>
        <iframe
          className="rounded-xl mt-5 mx-auto border border-gray-200 dark:border-gray-600"
          src={`https://pricehistoryapp.com/embed/${encodedGraph}`}
          width="100%"
          height="450"
        ></iframe>

        <div className="mt-6 bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-md">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">
            Specifications:
          </h3>
          <div
            className="text-sm dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: productSpecs || "N/A" }}
          ></div>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">
            Description:
          </h3>
          <div
            className="text-sm dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: productDescription || "N/A" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
