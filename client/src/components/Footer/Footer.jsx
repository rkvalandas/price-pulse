import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="p-6 bg-gray-100 dark:bg-slate-950 text-gray-700 dark:text-gray-300 w-full mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        {/* Company Info */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-teal-700 dark:text-teal-300">
            Price Pulse
          </h2>
          <p className="text-sm md:text-base mt-2">
            Track your favorite products' prices effortlessly with our tool.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <span className="text-lg font-semibold text-teal-600 dark:text-teal-400">
            Quick Links
          </span>
          <ul className="list-none mt-2 text-sm">
            <li>
              <Link
                to="/"
                className="hover:text-teal-600 dark:hover:text-teal-400 hover:underline"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="hover:text-teal-600 dark:hover:text-teal-400 hover:underline"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="hover:text-teal-600 dark:hover:text-teal-400 hover:underline"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="hover:text-teal-600 dark:hover:text-teal-400 hover:underline"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div className="text-center md:text-left">
          <span className="text-lg font-semibold text-teal-600 dark:text-teal-400">
            Follow Us
          </span>
          <div className="flex justify-center md:justify-start gap-4 mt-2">
            <a
              href="#"
              rel="noopener noreferrer"
              className="px-3 py-1 text-sm rounded-md hover:bg-teal-50 dark:hover:bg-teal-900 transition-colors"
            >
              Twitter
            </a>
            <a
              href="#"
              rel="noopener noreferrer"
              className="px-3 py-1 text-sm rounded-md hover:bg-teal-50 dark:hover:bg-teal-900 transition-colors"
            >
              Facebook
            </a>
            <a
              href="#"
              rel="noopener noreferrer"
              className="px-3 py-1 text-sm rounded-md hover:bg-teal-50 dark:hover:bg-teal-900 transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>© 2024 Price Pulse. All rights reserved.</p>
      </div>
    </footer>
  );
}
