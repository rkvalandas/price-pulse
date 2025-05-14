// filepath: /Users/rkvalandasu/mini project/price_pulse/client/src/components/Home/Home.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/background.png";
import ThemeToggle from "../Header/ThemeToggle";
import { motion } from "framer-motion";
import { searchProduct } from "../../api";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleShareOnTwitter = () => {
    const tweetText = encodeURIComponent(
      "Check out Price Pulse - the best way to track prices and save money on your favorite products! #PricePulse #PriceTracking"
    );
    const tweetUrl = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`,
      "_blank"
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsSearching(true);
    try {
      const { data } = await searchProduct(url);
      navigate("/product", { state: { data, user: data.user } });
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full">
      {/* Main Hero Section */}
      <section
        className="relative flex items-center justify-center min-h-screen bg-opacity-1"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-10 dark:opacity-40"></div>
        <div className="flex items-center justify-center w-full px-4 py-12 text-center z-10">
          <div className="max-w-full min-w-72 w-full">
            <motion.h1
              className="text-5xl font-bold mb-4 text-white [text-shadow:_0_2px_0_rgb(0_0_0_/_900%)]"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Track Product Prices
            </motion.h1>
            <motion.p
              className="text-lg mb-8 text-white [text-shadow:_0_1px_0_rgb(0_0_0_/_100%)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Find the best deals and track the price history of your favorite
              products.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              className="max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <form onSubmit={handleSearch} className="relative">
                <div className="flex flex-col md:flex-row gap-3 items-center">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Paste an Amazon, Flipkart, or Myntra product URL here"
                      className="w-full pl-5 pr-5 py-8 text-lg rounded-full border-teal-500 border-2 shadow-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-300 bg-white dark:bg-gray-800 dark:text-white dark:border-teal-400 focus:outline-none"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </div>
                  <motion.button
                    className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 py-4 h-24 font-medium w-full md:w-auto"
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    ) : (
                      <span className="flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
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
                      </span>
                    )}
                  </motion.button>
                </div>
              </form>
              <p className="text-sm text-white mt-2">
                Track prices from Amazon, Flipkart, Myntra and more!
              </p>
            </motion.div>

            {/* Social Share Button */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <motion.button
                className="px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm flex items-center rounded-md"
                onClick={handleShareOnTwitter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="mr-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                </svg>
                Share on Twitter
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-teal-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 text-teal-800 dark:text-teal-300">
              About Price Pulse
            </h2>
            <div className="w-16 h-1 bg-teal-500 mx-auto mb-6"></div>
            <p className="text-lg max-w-3xl mx-auto text-teal-900 dark:text-teal-100">
              Price Pulse is your ultimate companion for smart shopping. We help
              you track prices of your favorite products across e-commerce
              platforms, notifying you when prices drop so you never miss a deal
              again. Our mission is to empower consumers to make informed
              purchasing decisions and save money.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <motion.div
              className="bg-white dark:bg-gray-700 border-teal-200 dark:border-teal-700 rounded-3xl border-2 shadow-xl hover:shadow-2xl transition-all"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="p-5">
                <div className="text-4xl text-teal-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-teal-700 dark:text-teal-300">
                  Real-time Tracking
                </h3>
                <p className="text-teal-800 dark:text-teal-200">
                  Monitor product prices in real-time across multiple e-commerce
                  platforms.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-700 border-teal-200 dark:border-teal-700 border-2 rounded-3xl shadow-xl hover:shadow-2xl transition-all"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="p-5">
                <div className="text-4xl text-teal-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-teal-700 dark:text-teal-300">
                  Instant Alerts
                </h3>
                <p className="text-teal-800 dark:text-teal-200">
                  Receive instant notifications when prices drop for your
                  tracked products.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-700 border-teal-200 dark:border-teal-700 border-2 rounded-3xl shadow-xl hover:shadow-2xl transition-all"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="p-5">
                <div className="text-4xl text-teal-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-teal-700 dark:text-teal-300">
                  Easy to Use
                </h3>
                <p className="text-teal-800 dark:text-teal-200">
                  Simple and intuitive interface for hassle-free price tracking
                  experience.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 text-teal-800 dark:text-teal-300">
              How It Works
            </h2>
            <div className="w-16 h-1 bg-teal-500 mx-auto mb-6"></div>
            <p className="text-lg max-w-3xl mx-auto text-teal-700 dark:text-teal-200">
              Start saving money in three simple steps
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <motion.div
              className="step-item text-center max-w-xs"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="step-number mb-4 mx-auto w-16 h-16 rounded-full bg-teal-600 text-white text-2xl flex items-center justify-center font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold mb-2 text-teal-800 dark:text-teal-300">
                Add Products
              </h3>
              <p className="text-teal-700 dark:text-teal-200">
                Simply paste the URL of the product you want to track from your
                favorite e-commerce site.
              </p>
            </motion.div>

            <motion.div
              className="hidden md:block text-teal-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </motion.div>

            <motion.div
              className="step-item text-center max-w-xs"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="step-number mb-4 mx-auto w-16 h-16 rounded-full bg-teal-600 text-white text-2xl flex items-center justify-center font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold mb-2 text-teal-800 dark:text-teal-300">
                Set Alerts
              </h3>
              <p className="text-teal-700 dark:text-teal-200">
                Configure price threshold alerts to be notified when the product
                price drops to your target.
              </p>
            </motion.div>

            <motion.div
              className="hidden md:block text-teal-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </motion.div>

            <motion.div
              className="step-item text-center max-w-xs"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="step-number mb-4 mx-auto w-16 h-16 rounded-full bg-teal-600 text-white text-2xl flex items-center justify-center font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold mb-2 text-teal-800 dark:text-teal-300">
                Save Money
              </h3>
              <p className="text-teal-700 dark:text-teal-200">
                Receive instant notifications and purchase the product at the
                best price.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-teal-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 text-teal-800 dark:text-teal-300">
              Key Features
            </h2>
            <div className="w-16 h-1 bg-teal-500 mx-auto mb-6"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              className="bg-white dark:bg-gray-700 shadow-xl hover:-translate-y-2 transition-all border-2 border-teal-100 dark:border-teal-700 rounded-3xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="p-5">
                <div className="mb-4 text-4xl bg-teal-100 dark:bg-teal-800 w-16 h-16 rounded-full flex items-center justify-center">
                  📊
                </div>
                <h3 className="text-lg font-bold mb-2 text-teal-700 dark:text-teal-300">
                  Price History
                </h3>
                <p className="text-teal-700 dark:text-teal-200">
                  View complete price history charts to make informed decisions.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-700 shadow-xl hover:-translate-y-2 transition-all border-2 border-teal-100 dark:border-teal-700 rounded-3xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="p-5">
                <div className="mb-4 text-4xl bg-teal-100 dark:bg-teal-800 w-16 h-16 rounded-full flex items-center justify-center">
                  🔔
                </div>
                <h3 className="text-lg font-bold mb-2 text-teal-700 dark:text-teal-300">
                  Custom Alerts
                </h3>
                <p className="text-teal-700 dark:text-teal-200">
                  Set custom price thresholds for alerts via email.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-700 shadow-xl hover:-translate-y-2 transition-all border-2 border-teal-100 dark:border-teal-700 rounded-3xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="p-5">
                <div className="mb-4 text-4xl bg-teal-100 dark:bg-teal-800 w-16 h-16 rounded-full flex items-center justify-center">
                  🔍
                </div>
                <h3 className="text-lg font-bold mb-2 text-teal-700 dark:text-teal-300">
                  Product Comparison
                </h3>
                <p className="text-teal-700 dark:text-teal-200">
                  Compare prices across different platforms at a glance.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-700 shadow-xl hover:-translate-y-2 transition-all border-2 border-teal-100 dark:border-teal-700 rounded-3xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}

              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="p-5">
                <div className="mb-4 text-4xl bg-teal-100 dark:bg-teal-800 w-16 h-16 rounded-full flex items-center justify-center">
                  📱
                </div>
                <h3 className="text-lg font-bold mb-2 text-teal-700 dark:text-teal-300">
                  Mobile Friendly
                </h3>
                <p className="text-teal-700 dark:text-teal-200">
                  Access from any device with our responsive design.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
