"use client";

import { motion } from "framer-motion";
import BrandedBackground from "../components/ui/BrandedBackground";

export default function Privacy() {
  return (
    <BrandedBackground>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Privacy Policy
        </motion.h1>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Our Commitment to Privacy
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            At Price Pulse, we take your privacy seriously. This policy outlines
            how we collect, use, and protect your personal information when you
            use our service.
          </p>

          <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">
            Information We Collect
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We collect information that you provide directly to us, such as when
            you create an account, set up price alerts, or contact us for
            support. This information may include your name, email address, and
            preferences.
          </p>

          <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">
            How We Use Your Information
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We use the information we collect to provide, maintain, and improve
            our services, including to send you price alerts and other
            notifications you have requested.
          </p>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>Last updated: May 18, 2025</p>
          </div>
        </motion.div>
      </div>
    </BrandedBackground>
  );
}
