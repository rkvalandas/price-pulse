"use client";

import { motion } from "framer-motion";
import BrandedBackground from "../components/ui/BrandedBackground";

export default function Blog() {
  return (
    <BrandedBackground>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Price Pulse Blog
        </motion.h1>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Coming Soon
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our blog is under development. Check back soon for articles on
            saving money, deal hunting, and online shopping tips.
          </p>
        </motion.div>
      </div>
    </BrandedBackground>
  );
}
