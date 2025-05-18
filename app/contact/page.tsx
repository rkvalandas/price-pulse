"use client";

import { motion } from "framer-motion";
import BrandedBackground from "../components/ui/BrandedBackground";

export default function Contact() {
  return (
    <BrandedBackground>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Contact Us
        </motion.h1>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Get in Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We&apos;d love to hear from you! Whether you have a question about
            our service, need help with your account, or want to provide
            feedback, our team is here to assist.
          </p>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">
              Email
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              <span className="text-blue-600 dark:text-blue-400">
                contact@pricepulse.com
              </span>
            </p>

            <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">
              Connect With Us
            </h3>
            <div className="flex space-x-4 mt-2">
              <a
                href="https://twitter.com/rkvalandas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com/in/ramakrishnavalandasu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </BrandedBackground>
  );
}
