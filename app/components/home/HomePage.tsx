"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { searchProduct } from "../../api";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";
import BrandedBackground from "../ui/BrandedBackground";
import {
  PriceBadge,
  AnimatedPriceGraph,
  PulsingNotification,
  TaglineTyper,
} from "../ui/BrandedElements";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect logged-in users to alerts page
    if (isAuthenticated) {
      router.push("/alerts");
    }
  }, [isAuthenticated, router]);

  // ProductData interface moved to a type-level import or removed as unused

  const handleSearch = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!url.trim()) {
      return;
    }

    setLoading(true);

    try {
      // Navigate to product page with loading state
      router.push("/product?loading=true");

      // Then fetch the data
      const response = await searchProduct(url);

      if (response && response.data && response.data.product) {
        // Store the product data in sessionStorage for more reliable data transfer
        sessionStorage.setItem("productData", JSON.stringify(response.data));
        console.log("Product data stored in sessionStorage:", response.data);

        // Navigate to product page without parameters
        router.push("/product");
      } else {
        throw new Error("No product data found");
      }
    } catch (error: unknown) {
      console.error("Error fetching product:", error);
      // Navigate to product page with error state
      router.push(
        `/product?error=${encodeURIComponent("Failed to fetch product data")}`
      );
    }
  };

  return (
    <BrandedBackground>
      <div className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Decorative Circles */}
          <div className="absolute top-1/4 right-[15%] w-4 h-4 rounded-full bg-teal-500/30 blur-sm"></div>
          <div className="absolute top-1/3 left-[20%] w-6 h-6 rounded-full bg-blue-500/20 blur-sm"></div>
          <div className="absolute bottom-1/4 right-[35%] w-8 h-8 rounded-full bg-purple-500/20 blur-md"></div>

          {/* Subtle dotted pattern */}
          <div
            className="hidden md:block absolute top-20 left-20 right-20 bottom-20 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        {/* Hero Section - Better padding for mobile */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-16 md:py-36">
          {/* Logo and Header */}
          <motion.div
            className="text-center mt-4 sm:mt-10 mb-8 sm:mb-16"
            initial={{ opacity: 10, y: 40 }}
            animate={{ opacity: 4, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo - Smaller on mobile */}
            <motion.div
              className="mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-6 relative"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00c6bc] to-[#0075ff] rounded-full opacity-20 blur-lg animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Price Pulse Logo"
                  width={130}
                  height={130}
                  priority
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
            </motion.div>

            {/* Animated heading with responsive text sizing */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-2 sm:mb-3 px-1"
              style={{
                WebkitTextFillColor: "transparent",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                backgroundImage:
                  "linear-gradient(135deg, #00c6bc, #0075ff 60%, #8b5cf6)",
                filter: "drop-shadow(0 2px 4px rgba(0, 198, 188, 0.3))",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Price Pulse
            </motion.h1>

            {/* Subtitle - Better padding and font size for mobile */}
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-slate-800 dark:text-white mb-2 sm:mb-3 max-w-2xl mx-auto font-light px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Track prices effortlessly. Save money on every purchase.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-6 sm:mb-10 flex justify-center"
            >
              <TaglineTyper />
            </motion.div>

            {/* Search Form with enhanced styling for mobile */}
            <motion.div
              className="max-w-xl mx-auto relative z-10 px-3 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {/* Glowing effect around the search form */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00c6bc] via-[#0075ff] to-[#8b5cf6] rounded-xl sm:rounded-2xl opacity-50 blur-md -z-10"></div>

              <form
                onSubmit={handleSearch}
                className="relative backdrop-blur-sm"
              >
                <div className="flex flex-col sm:flex-row rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-slate-300/50 dark:border-gray-500/20 bg-white/80 dark:bg-white/5 backdrop-blur-2xl">
                  <input
                    type="text"
                    placeholder="Paste a product URL..."
                    className="flex-grow px-4 py-4 sm:px-5 sm:py-5 focus:outline-none text-slate-800 dark:text-white bg-transparent placeholder:text-slate-500 dark:placeholder:text-gray-300/80 text-base sm:text-lg"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="animated-gradient-button text-white font-medium px-5 py-3 sm:px-8 sm:py-5 flex items-center justify-center transition-all shadow-md relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      {loading ? (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
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
                          Track Price
                        </>
                      )}
                    </span>
                    {/* Button shine effect */}
                    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shine_2s_infinite]"></span>
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Supported sites badge - Better mobile styling */}
            <motion.div
              className="mt-4 sm:mt-8 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 sm:px-4 sm:py-1 border border-slate-300/30 dark:border-white/10 inline-block mx-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
            >
              <p className="text-xs sm:text-sm text-slate-700 dark:text-white">
                Works with Amazon, Flipkart, Myntra, and more!
              </p>
            </motion.div>

            {/* Feature Cards - Responsive grid with better spacing */}
            <motion.div
              className="mt-16 sm:mt-24 md:mt-32 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto relative z-10 px-4 sm:px-2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {/* Feature 1 */}
              <motion.div
                className="glass-card rounded-xl p-5 sm:p-6 relative overflow-hidden"
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00c6bc] to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#00c6bc]/10 to-transparent opacity-30 pointer-events-none"></div>
                <div className="bg-[#00c6bc] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-800 dark:text-white mb-2 sm:mb-3 text-center drop-shadow-sm">
                  Simple Tracking
                </h3>
                <p className="text-slate-600 dark:text-gray-300 text-center text-sm sm:text-base">
                  Just paste the product URL and we&apos;ll start monitoring
                  prices for you across multiple retailers
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                className="glass-card rounded-xl p-5 sm:p-6 relative overflow-hidden"
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0075ff] to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#0075ff]/10 to-transparent opacity-30 pointer-events-none"></div>
                <div className="bg-[#0075ff] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6 text-white"
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
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-800 dark:text-white mb-2 sm:mb-3 text-center drop-shadow-sm">
                  Price Alerts
                </h3>
                <p className="text-slate-600 dark:text-gray-300 text-center text-sm sm:text-base">
                  Get notified immediately when prices drop to your target
                  amount
                </p>

                <div className="mt-3 sm:mt-4 flex justify-center">
                  <PulsingNotification />
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                className="glass-card rounded-xl p-5 sm:p-6 relative overflow-hidden sm:col-span-2 md:col-span-1 mx-auto w-full max-w-sm sm:max-w-none"
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b5cf6] to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/10 to-transparent opacity-30 pointer-events-none"></div>
                <div className="bg-[#8b5cf6] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-800 dark:text-white mb-2 sm:mb-3 text-center drop-shadow-sm">
                  Price History
                </h3>
                <p className="text-slate-600 dark:text-gray-300 text-center text-sm sm:text-base">
                  View price trends and make informed buying decisions
                </p>

                <div className="mt-3 sm:mt-5 flex justify-center">
                  <AnimatedPriceGraph />
                </div>
              </motion.div>
            </motion.div>

            {/* Price Example Section - Better layout for mobile */}
            <motion.div
              className="mt-16 sm:mt-24 md:mt-32 flex flex-col md:flex-row gap-6 sm:gap-8 items-center justify-center px-4 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative"
              >
                {/* Decorative accent */}
                <div className="absolute inset-0 -m-2 bg-gradient-to-r from-[#00c6bc] to-[#0075ff] rounded-xl opacity-40 blur-sm -z-10"></div>
                <PriceBadge
                  startPrice={199.99}
                  currentPrice={139.99}
                  discountPercentage={30}
                />
              </motion.div>

              <div className="p-4 sm:p-5 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-slate-300/50 dark:border-white/10 relative overflow-hidden w-full md:w-auto">
                {/* Subtle animated gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 animate-pulse pointer-events-none -z-10"></div>

                <h3 className="font-semibold text-slate-800 dark:text-white/90 mb-1 sm:mb-2 text-base sm:text-lg">
                  Start Saving Today!
                </h3>
                <p className="text-slate-600 dark:text-gray-300 max-w-xs text-sm sm:text-base">
                  Join thousands of smart shoppers who never overpay again.
                  Track prices and get notified instantly.
                </p>

                {/* CTA button - Larger touch target for mobile */}
                <button className="w-full sm:w-auto mt-3 sm:mt-4 bg-teal-500/90 hover:bg-teal-600 dark:bg-white/10 dark:hover:bg-white/20 text-white px-4 py-3 sm:py-2 rounded-md border border-teal-500/50 dark:border-white/10 transition duration-300 flex items-center justify-center sm:justify-start gap-2 group shadow-sm">
                  <span>Get Started</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>

            {/* Added padding at the bottom for better mobile spacing */}
            <div className="h-8 sm:h-12"></div>
          </motion.div>
        </div>
      </div>
    </BrandedBackground>
  );
}
