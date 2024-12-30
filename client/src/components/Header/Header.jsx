import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { searchProduct } from "../../api";
import { useAuth } from "../Authenticate/AuthContext";
import logo from "../../assets/logo.png";

export default function Header() {
  const [openNav, setOpenNav] = useState(false);
  const [url, setUrl] = useState("");
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { title: "Home", href: "/" },
    { title: "Alerts", href: "/alerts" },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setOpenNav(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const { data } = await searchProduct(url); // Call the helper function

      // Log the user for debugging
      console.log("User Data:", data.user);

      // Redirect to Product Page with product data
      navigate("/product", { state: { data, user: data.user } });
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  return (
    <nav className="fixed justify-self-center max-w-full min-w-80 w-5/6 top-0 object-center mx-2 mt-4 inset-x-0 rounded-3xl shadow-md z-50 bg-base-300">
      <div className="px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <div className="text-md font-semibold">
          <img src={logo} alt="Logo" className="h-10 w-10" />
        </div>

        {/* Center Navigation Links (hidden on mobile) */}
        <div className="hidden md:flex space-x-6 justify-center flex-1">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.href}
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 ${
                  isActive ? "text-teal-500" : ""
                }`
              }
            >
              {item.title}
            </NavLink>
          ))}
          <div className="flex">
            <label className="input input-bordered flex items-center gap-2 rounded-3xl h-10">
              <input
                name="search"
                type="text"
                className="grow"
                placeholder="Search"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </label>
            <button
              className="btn btn-circle btn-outline btn-sm ml-2 h-10 w-10"
              onClick={handleSearch}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-5 w-5 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="hidden md:block mr-2">
          <ThemeToggle />
        </div>
        {/* Login Button (hidden on mobile) */}
        <div className="hidden md:block">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className=" text-sm h-10 w-16 font-semibold bg-red-500 border border-red-600 hover:bg-red-600 hover:transition-colors text-black shadow-gray-600 rounded-3xl"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button className=" text-sm h-10 w-16 font-semibold bg-teal-300 border border-teal-700 hover:bg-teal-400 hover:transition-colors text-black shadow-gray-600 rounded-3xl">
                Login
              </button>
            </Link>
          )}
        </div>
        <div className="md:hidden flex">
          <div className="md:hidden pr-2">
            <ThemeToggle />
          </div>
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden rounded-xl"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                className="swap-on fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
              </svg>
            ) : (
              <svg
                className="swap-off fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {/* Mobile Search Bar */}
      <div className="md:hidden flex px-4 py-2">
        <label className="input input-bordered flex items-center gap-2 rounded-3xl h-10 max-w-full min-w-40 w-full">
          <input
            name="search"
            type="text"
            className="grow"
            placeholder="Search"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
        <button
          className="btn btn-circle btn-outline btn-sm ml-2 h-10 w-10"
          onClick={handleSearch}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-5 w-5 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {/* Mobile Navigation */}
      {openNav && (
        <div className="md:hidden rounded-b-3xl">
          <div className="space-y-1 py-2">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="block px-4 py-2 font-medium text-center"
              >
                {item.title}
              </a>
            ))}
          </div>
          <div className="px-4 py-2">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className=" text-sm h-11 w-full font-semibold bg-red-500 border border-red-600 hover:bg-red-600 hover:transition-colors text-black shadow-gray-600 rounded-2xl"
              >
                Logout
              </button>
            ) : (
              <Link to="/login">
                <button className=" text-sm h-11 w-full font-semibold bg-teal-300 border border-teal-700 hover:bg-teal-400 hover:transition-colors text-black shadow-gray-600 rounded-2xl">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
