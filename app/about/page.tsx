"use client";

import React from "react";
import { motion } from "framer-motion";
import BrandedBackground from "../components/ui/BrandedBackground";

export default function About() {
  return (
    <BrandedBackground>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Price Pulse
        </motion.h1>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Price Pulse is India&apos;s leading price tracking platform, helping
            shoppers save money on their online purchases through smart price
            alerts and comprehensive price history tracking.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our mission is to empower consumers with the information they need
            to make smarter purchasing decisions and never miss a great deal
            again.
          </p>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white mt-8">
            What We Do
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Price Pulse tracks products across major e-commerce platforms
            including Amazon, Flipkart, and Walmart. Our sophisticated
            algorithms monitor price changes in real-time and notify you when
            prices drop on items you&apos;re interested in.
          </p>
        </motion.div>
      </div>
    </BrandedBackground>
  );
}
