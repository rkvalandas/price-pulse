"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import SetAlert from "../alerts/SetAlert";
import Image from "next/image";
import { motion } from "framer-motion";

// Define the product data interface to match the API response structure
interface ProductData {
  productId?: string;
  productTitle?: string;
  productImageUrl?: string;
  productPrice?: string;
  productOriginalPrice?: string;
  productUrl?: string;
  productGraph?: string;
  productSpecs?: string;
  productDescription?: string;
  website?: string;
}

export default function Product() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [showSetAlert, setShowSetAlert] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "specs" | "description" | "price-history"
  >("price-history");
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const { isAuthenticated } = useAuth();
  const historyChartRef = useRef<HTMLDivElement>(null);

  // Handle image loading error
  const handleImageError = () => {
    console.error("Error loading product image");
    setImageError(true);
  };

  // Format price with proper currency symbol and thousands separators
  const formatPrice = (price?: string): string => {
    if (!price) return "N/A";
    const numPrice = parseFloat(price.replace(/[^\d.-]/g, ""));

    if (isNaN(numPrice)) return price;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  // Handle sharing the product
  const shareProduct = () => {
    if (!productData?.productTitle || !productData?.productUrl) return;

    const shareData = {
      title: `Check out this deal: ${productData.productTitle}`,
      text: `I found ${productData.productTitle} at ${formatPrice(
        productData.productPrice
      )} on Price Pulse!`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback to copying to clipboard
      const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
      navigator.clipboard.writeText(shareText);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 3000);
    }
  };

  // Handle price history scroll
  const scrollToHistory = () => {
    if (historyChartRef.current) {
      historyChartRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Calculate percentage discount
  const calculateDiscount = (
    currentPrice?: string,
    originalPrice?: string
  ): string => {
    if (!currentPrice || !originalPrice) return "";

    const current = parseFloat(currentPrice.replace(/[^\d.-]/g, ""));
    const original = parseFloat(originalPrice.replace(/[^\d.-]/g, ""));

    if (isNaN(current) || isNaN(original) || original <= current) return "";

    const discount = ((original - current) / original) * 100;
    return `${Math.round(discount)}% OFF`;
  };

  // Extract website name from URL
  const extractWebsiteName = (url?: string): string => {
    if (!url) return "Online Store";

    try {
      const hostname = new URL(url).hostname;
      if (hostname.includes("amazon")) return "Amazon";
      if (hostname.includes("flipkart")) return "Flipkart";
      if (hostname.includes("walmart")) return "Walmart";

      // Extract domain name
      const matches = hostname.match(/(?:www\.)?(.*?)\.(?:com|in|org|net)/i);
      if (matches && matches[1]) {
        return matches[1].charAt(0).toUpperCase() + matches[1].slice(1);
      }
      return hostname;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      // Any error parsing the URL should result in a generic store name
      return "Online Store";
    }
  };

  useEffect(() => {
    // Check if there's an error in URL params
    const errorParam = searchParams.get("error");
    if (errorParam) {
      console.log("Error parameter found:", errorParam);
      setError(errorParam);
      setIsLoading(false);
      return;
    }

    // Check if we're in loading state
    const loadingParam = searchParams.get("loading");
    if (loadingParam === "true") {
      setIsLoading(true);
      return;
    }

    // Check if we have data in sessionStorage first
    try {
      const storedData = sessionStorage.getItem("productData");
      if (storedData) {
        console.log("Found product data in sessionStorage");
        const parsedData = JSON.parse(storedData);

        // Check if the data is nested in a 'product' property
        const productData = parsedData.product
          ? parsedData.product
          : parsedData;
        console.log("Extracted product data:", productData);

        // Clear the sessionStorage data after we've used it
        sessionStorage.removeItem("productData");

        setProductData(productData);
        setIsLoading(false);
        return;
      }

      // Fallback to URL params if sessionStorage doesn't have the data
      const productParam = searchParams.get("product");

      if (!productParam) {
        setError("No product data found");
        setIsLoading(false);
        return;
      }

      const decodedData = JSON.parse(decodeURIComponent(productParam));

      // Check if the data is nested in a 'product' property
      const productData = decodedData.product
        ? decodedData.product
        : decodedData;

      setProductData(productData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error retrieving or parsing product data:", error);
      setError("Failed to load product data");
      setIsLoading(false);
    }
  }, [searchParams]);

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto bg-white dark:bg-gray-900 flex justify-center w-full">
        <div className="w-full max-w-5xl flex flex-col rounded-xl p-4 mt-28">
          {/* Product Header Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg w-full overflow-hidden mb-8">
            <div className="flex flex-col md:flex-row w-full animate-pulse">
              {/* Product Image Skeleton */}
              <div className="md:w-2/5 bg-gray-50 dark:bg-gray-700 p-6 flex items-center justify-center">
                <div className="w-full h-64 md:h-80 bg-gray-200 dark:bg-gray-600 rounded-xl"></div>
              </div>

              {/* Product Details Skeleton */}
              <div className="md:w-3/5 p-6 md:p-8">
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
                <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
                <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-600 rounded mb-3"></div>
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-600 rounded mb-8"></div>

                <div className="flex gap-4 mb-8">
                  <div className="h-12 bg-gray-200 dark:bg-gray-600 rounded flex-1"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-600 rounded flex-1"></div>
                </div>

                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>

          {/* More Content Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 mb-8 animate-pulse">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-600 rounded mb-6"></div>
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg h-80 bg-gray-100 dark:bg-gray-700"></div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden mb-8 animate-pulse">
            <div className="p-6">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-600 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>

          {/* Loading indicator */}
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300 font-medium">
              Loading product data...
            </span>
          </div>
        </div>
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
          <Link href="/">
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
            We couldn&apos;t find any product information. Please go back and
            search for a product.
          </p>
          <Link href="/">
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
    productOriginalPrice,
    productUrl,
    productGraph,
    productSpecs,
    productDescription,
  } = productData;

  const encodedGraph = productGraph ? encodeURIComponent(productGraph) : "";
  const websiteName = extractWebsiteName(productUrl);
  const discount = calculateDiscount(productPrice, productOriginalPrice);
  const formattedCurrentPrice = formatPrice(productPrice);
  const formattedOriginalPrice = productOriginalPrice
    ? formatPrice(productOriginalPrice)
    : "";

  return (
    <div className="mx-auto bg-white dark:bg-gray-900 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col rounded-xl p-4 sm:p-4 mt-20 sm:mt-36">
        {/* Product Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg w-full overflow-hidden mb-4 sm:mb-8">
          <div className="flex flex-col md:flex-row w-full">
            {/* Product Image Section */}
            <div className="md:w-2/5 bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 flex items-center justify-center">
              <div
                className="relative w-full h-60 sm:h-64 md:h-80 flex items-center justify-center cursor-zoom-in"
                onClick={() => setIsImageZoomed(!isImageZoomed)}
              >
                {productImageUrl && !imageError ? (
                  <>
                    <motion.div
                      className={`relative rounded-xl shadow-md ${
                        isImageZoomed
                          ? "fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
                          : ""
                      }`}
                      initial={false}
                      animate={{
                        scale: isImageZoomed ? 1.2 : 1,
                        zIndex: isImageZoomed ? 50 : 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Image
                        src={productImageUrl}
                        alt={productTitle || "Product"}
                        width={isImageZoomed ? 640 : 320}
                        height={isImageZoomed ? 640 : 320}
                        className={`rounded-xl shadow-md object-contain max-h-full max-w-full ${
                          isImageZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                        }`}
                        unoptimized={true}
                        onError={handleImageError}
                        priority
                      />
                      {isImageZoomed && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsImageZoomed(false);
                          }}
                          className="absolute top-4 right-4 bg-white/10 hover:bg-white/30 rounded-full p-2 transition-colors"
                        >
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </button>
                      )}
                    </motion.div>
                  </>
                ) : (
                  <div className="h-64 w-64 bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">
                      No image available
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="md:w-3/5 p-4 sm:p-6 md:p-8">
              {/* Website Badge and Share Button */}
              <div className="flex items-center justify-between mb-3">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium py-1 px-2 rounded">
                  {websiteName}
                </span>

                <div className="relative">
                  <button
                    onClick={shareProduct}
                    className="flex items-center space-x-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg px-3 py-2 min-h-[44px] transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      ></path>
                    </svg>
                    <span>Share</span>
                  </button>

                  {/* Clipboard confirmation tooltip */}
                  {copiedToClipboard && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10"
                    >
                      Copied to clipboard!
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4 leading-tight">
                {productTitle}
              </h1>

              {/* Pricing Information */}
              <div className="mb-4">
                <div className="flex flex-wrap items-baseline">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mr-2">
                    {formattedCurrentPrice}
                  </span>
                  {productOriginalPrice &&
                    formattedOriginalPrice !== formattedCurrentPrice && (
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                        {formattedOriginalPrice}
                      </span>
                    )}
                  {discount && (
                    <span className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs sm:text-sm font-medium py-1 px-2 rounded">
                      {discount}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <a
                  href={productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <button className="w-full px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center">
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
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Buy Now
                  </button>
                </a>

                {isAuthenticated ? (
                  <button
                    onClick={() => setShowSetAlert(!showSetAlert)}
                    className="flex-1 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                  >
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
                      />
                    </svg>
                    Set Price Alert
                  </button>
                ) : (
                  <Link href="/login" className="flex-1">
                    <button className="w-full px-5 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center">
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
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      Login to Set Alert
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden mb-4 sm:mb-8">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => {
                setActiveTab("price-history");
                scrollToHistory(); // Utilize the scrollToHistory function
              }}
              className={`flex items-center px-3 sm:px-6 py-3 text-sm font-medium transition-colors duration-200 min-h-[44px] ${
                activeTab === "price-history"
                  ? "border-b-2 border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-500"
                  : "text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-500"
              }`}
            >
              <svg
                className={`w-5 h-5 mr-2 ${
                  activeTab === "price-history"
                    ? "text-teal-600 dark:text-teal-500"
                    : "text-gray-400"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                ></path>
              </svg>
              Price History
            </button>

            <button
              onClick={() => setActiveTab("specs")}
              className={`flex items-center px-3 sm:px-6 py-3 text-sm font-medium transition-colors duration-200 min-h-[44px] ${
                activeTab === "specs"
                  ? "border-b-2 border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-500"
                  : "text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-500"
              }`}
            >
              <svg
                className={`w-5 h-5 mr-2 ${
                  activeTab === "specs"
                    ? "text-teal-600 dark:text-teal-500"
                    : "text-gray-400"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
              Specifications
            </button>

            <button
              onClick={() => setActiveTab("description")}
              className={`flex items-center px-3 sm:px-6 py-3 text-sm font-medium transition-colors duration-200 min-h-[44px] ${
                activeTab === "description"
                  ? "border-b-2 border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-500"
                  : "text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-500"
              }`}
            >
              <svg
                className={`w-5 h-5 mr-2 ${
                  activeTab === "description"
                    ? "text-teal-600 dark:text-teal-500"
                    : "text-gray-400"
                }`}
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
              Description
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Price History Tab */}
            {activeTab === "price-history" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                ref={historyChartRef}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <svg
                      className="w-6 h-6 mr-2 text-teal-600 dark:text-teal-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                      ></path>
                    </svg>
                    Price History Analysis
                  </h2>
                  <span className="text-sm text-teal-600 dark:text-teal-500">
                    Updated daily
                  </span>
                </div>

                {productGraph ? (
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    <iframe
                      className="w-full"
                      src={`https://pricehistoryapp.com/embed/${encodedGraph}`}
                      width="100%"
                      height="450"
                      title="Product Price History"
                    ></iframe>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-8 rounded-lg text-center">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Price History Available
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We don&apos;t have enough pricing data for this product
                      yet.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Specifications Tab */}
            {activeTab === "specs" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-yellow-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                    Product Specifications
                  </h2>
                </div>

                {productSpecs ? (
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-gray-800 dark:prose-headings:text-gray-200 prose-p:text-gray-600 dark:prose-p:text-gray-300 scrollbar-hide"
                    dangerouslySetInnerHTML={{ __html: productSpecs }}
                  ></div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-8 rounded-lg text-center">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Specifications Available
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      No technical specifications are available for this
                      product.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Description Tab */}
            {activeTab === "description" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-green-500"
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
                    Product Description
                  </h2>
                </div>

                {productDescription ? (
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert prose-p:text-gray-600 dark:prose-p:text-gray-300 scrollbar-hide"
                    dangerouslySetInnerHTML={{ __html: productDescription }}
                  ></div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-8 rounded-lg text-center">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Description Available
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      No description is available for this product.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Price Alert Promotion */}
        <div className="bg-gradient-to-r from-teal-600/10 to-indigo-600/10 dark:from-teal-600/5 dark:to-indigo-600/5 rounded-xl p-4 sm:p-6 mb-4 sm:mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 text-center sm:text-left">
              Want to save money?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center sm:text-left">
              Set a price alert and we&apos;ll notify you when the price drops!
            </p>
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => setShowSetAlert(!showSetAlert)}
              className="px-5 py-3 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center w-full sm:w-auto min-h-[44px]"
            >
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
            </button>
          ) : (
            <Link href="/login" className="w-full sm:w-auto">
              <button className="px-5 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center w-full min-h-[44px]">
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
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  ></path>
                </svg>
                Login to Set Alert
              </button>
            </Link>
          )}
        </div>

        {/* Set Alert Form */}
        {showSetAlert && isAuthenticated && (
          <div className="mb-4 sm:mb-6 transition-all duration-300 ease-in-out">
            <SetAlert
              productId={productData.productId || ""}
              productData={{
                id: productData.productId || "",
                title: productData.productTitle || "",
                image: productData.productImageUrl || "",
                currentPrice: parseFloat(productPrice || "0"),
                url: productData.productUrl || "",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
