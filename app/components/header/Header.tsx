"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { searchProduct, logout as logoutAPI } from "@/app/api";
import { useAuth } from "@/app/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [openNav, setOpenNav] = useState(false);
  const [url, setUrl] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Navigation items removed as per requirement
  // Previous navItems array removed

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutAPI();
      logout(); // Call the auth context logout function to remove the token
      router.push("/");
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
    if (isAuthenticated && pathname === "/") {
      router.push("/alerts");
    }
  }, [isAuthenticated, pathname, router]);

  // Interface for the product data
  interface ProductData {
    [key: string]: unknown;
  }

  // Interface for the API response
  interface SearchProductResponse {
    data: ProductData;
  }

  const handleSearch = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!url.trim()) {
      return; // Prevent empty searches
    }

    try {
      // First navigate to product page with loading state
      router.push("/product?loading=true");

      // Then fetch the data
      const response = (await searchProduct(url)) as SearchProductResponse; // Call the helper function

      if (response && response.data) {
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

  const closeNav = () => {
    setOpenNav(false);
  };

  return (
    <motion.nav
      className="fixed justify-self-center max-w-7xl w-11/12 top-0 mx-auto mt-4 inset-x-0 rounded-3xl shadow-lg z-50 bg-gray-100 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Image
              src="/assets/logo.png"
              alt="Price Pulse Logo"
              className="h-9 w-9 bg-slate-700 dark:bg-slate-950 rounded-full p-1"
              width={36}
              height={36}
              priority
            />
          </motion.div>
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
                  <Link href="/login">
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
                  <Link href="/signup">
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

      {/* Mobile Search */}
      <AnimatePresence>
        {openNav && (
          <motion.div
            className="md:hidden px-4 pb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative flex items-center w-full mb-3">
                <input
                  name="search"
                  type="text"
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-teal-500 bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="Search for products..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 h-8 w-8 flex items-center justify-center text-gray-500 dark:text-gray-300"
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
                </button>
              </div>

              {/* Mobile Login/Signup buttons */}
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    className="flex justify-center items-center px-4 py-2 rounded-xl bg-teal-500 text-white font-medium text-center"
                    onClick={closeNav}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="flex justify-center items-center px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white font-medium border border-gray-200 dark:border-gray-600 text-center"
                    onClick={closeNav}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="flex w-full">
                  <button
                    onClick={() => {
                      handleLogout();
                      closeNav();
                    }}
                    className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium shadow-sm flex items-center justify-center"
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
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
