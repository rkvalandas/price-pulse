import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { searchProduct, logout as logoutAPI } from "../../api";
import { useAuth } from "../Authenticate/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logo.png";

export default function Header() {
  const [openNav, setOpenNav] = useState(false);
  const [url, setUrl] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items removed as per requirement
  const navItems = [];

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutAPI();
      logout(); // Call the auth context logout function to remove the token
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setOpenNav(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect to alerts page when logged in
  useEffect(() => {
    if (isAuthenticated && location.pathname === "/") {
      navigate("/alerts");
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      return; // Prevent empty searches
    }

    try {
      // First navigate to product page with loading state
      navigate("/product", { state: { isLoading: true } });

      // Then fetch the data
      const { data } = await searchProduct(url); // Call the helper function

      // Once data is fetched, navigate again with the actual data
      navigate("/product", {
        state: { data, user: data.user, isLoading: false },
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      // Navigate to product page with error state
      navigate("/product", {
        state: { error: "Failed to fetch product data", isLoading: false },
      });
      // Could redirect to an error page or show error message
    }
  };

  const closeNav = () => {
    setOpenNav(false);
  };

  return (
    <motion.nav
      className="fixed justify-self-center w-11/12 min-w-96 top-0 mx-auto mt-4 inset-x-0 rounded-3xl shadow-lg z-50 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-700 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.img
            src={logo}
            alt="Price Pulse Logo"
            className="h-9 w-9"
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
          <span className="text-lg font-bold text-gray-800 dark:text-white hidden sm:block">
            Price Pulse
          </span>
        </Link>

        {/* Navigation Links removed as per requirement */}
        <div className="hidden md:flex items-center justify-center flex-1 ml-6">
          <div className="flex ml-6 flex-1 max-w-md">
            <form onSubmit={handleSearch} className="w-full relative">
              <div className="relative flex items-center w-full">
                <input
                  name="search"
                  type="text"
                  className={`w-full pl-4 pr-10 py-2.5 rounded-2xl border ${
                    searchFocused
                      ? "border-teal-500 ring-2 ring-teal-200 dark:ring-teal-900/30"
                      : "border-gray-300 dark:border-gray-600"
                  } focus:outline-none bg-white dark:bg-gray-700 dark:text-white transition-all duration-200`}
                  placeholder="Search for products..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <motion.button
                  type="submit"
                  className="absolute right-2 h-8 w-8 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* User Menu / Login Button (hidden on mobile) */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium shadow-sm hover:shadow-md transition-all flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/login">
                    <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium shadow-sm hover:shadow-md transition-all flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      Login
                    </button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:block"
                >
                  <Link to="/signup">
                    <button className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium border border-gray-200 dark:border-gray-600 transition-all">
                      Sign Up
                    </button>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <div className="pr-3">
              <ThemeToggle />
            </div>
            {/* Mobile Menu Toggle */}
            <motion.button
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
              onClick={() => setOpenNav(!openNav)}
              whileTap={{ scale: 0.9 }}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700 dark:text-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700 dark:text-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden flex px-4 py-2.5">
        <form onSubmit={handleSearch} className="w-full flex">
          <div className="relative flex items-center w-full">
            <input
              name="search"
              type="text"
              className={`w-full pl-4 pr-10 py-2.5 rounded-lg border ${
                searchFocused
                  ? "border-teal-500 ring-2 ring-teal-200 dark:ring-teal-900/30"
                  : "border-gray-300 dark:border-gray-600"
              } focus:outline-none bg-white dark:bg-gray-700 dark:text-white transition-all duration-200`}
              placeholder="Search for products..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <motion.button
              type="submit"
              className="absolute right-2 h-8 w-8 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          </div>
        </form>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {openNav && (
          <motion.div
            className="md:hidden rounded-b-3xl overflow-hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Navigation items removed as per requirement */}

            <div className="p-4 border-gray-100 dark:border-gray-700 mt-2">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    closeNav();
                  }}
                  className="w-full py-2.5 px-4 flex items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium shadow-sm transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={closeNav}>
                    <button className="w-full py-2.5 px-4 flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium shadow-sm transition-all">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      Login
                    </button>
                  </Link>
                  <Link to="/signup" onClick={closeNav}>
                    <button className="w-full py-2.5 mt-3 px-4 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium border border-gray-200 dark:border-gray-600 transition-all">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
