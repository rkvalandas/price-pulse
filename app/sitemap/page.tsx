"use client";

import { motion } from "framer-motion";
import BrandedBackground from "../components/ui/BrandedBackground";

export default function Sitemap() {
  return (
    <BrandedBackground>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sitemap
        </motion.h1>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Site Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">
                Main Pages
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  •{" "}
                  <a
                    href="/"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Home
                  </a>
                </li>
                <li>
                  •{" "}
                  <a
                    href="/login"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Login
                  </a>
                </li>
                <li>
                  •{" "}
                  <a
                    href="/signup"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Sign Up
                  </a>
                </li>
                <li>
                  •{" "}
                  <a
                    href="/alerts"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Alerts
                  </a>
                </li>
                <li>
                  •{" "}
                  <a
                    href="/product"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Products
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">
                Information
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  •{" "}
                  <a
                    href="/careers"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  •{" "}
                  <a
                    href="/faq"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  •{" "}
                  <a
                    href="/terms"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  •{" "}
                  <a
                    href="/cookie-policy"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </BrandedBackground>
  );
}
