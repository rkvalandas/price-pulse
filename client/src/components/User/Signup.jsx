import React, { useState } from "react";
import { signup } from "../../api";
import { verifyEmail } from "../../api";
import AlertInfo from "../UIcomponents/AlertInfo";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false); // To track whether OTP was sent
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const triggerAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000); // Hide alert after 5 seconds
  };

  // Function to handle registration and OTP request
  const handleGetOtp = async (e) => {
    e.preventDefault();
    try {
      await signup({
        name,
        email,
        password,
      });
      setIsOtpSent(true); // Switch to OTP verification stage
      triggerAlert();
    } catch (error) {
      console.log(error.response?.data?.message || "Something went wrong");
    }
  };

  // Function to handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await verifyEmail({
        email,
        otp,
      });
      triggerAlert();
      navigate("/login");
      console.log(data.message);
    } catch (error) {
      console.log(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 pt-36 pb-12">
      {showAlert && !isOtpSent && (
        <AlertInfo message="Signup Successful" type="success" />
      )}
      {showAlert && isOtpSent && (
        <AlertInfo
          message="An OTP has been sent to your email. Verify your email to complete signup"
          type="success"
        />
      )}
      <div className="max-w-md min-w-80 w-5/6 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">
            Create Account
          </h2>
          <form>
            <div className="mb-4">
              <label className="block mb-2">
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  Full Name
                </span>
              </label>
              <div className="relative flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70 mr-2 text-gray-500 dark:text-gray-400"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  type="text"
                  className="grow bg-transparent focus:outline-none dark:text-white"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <label className="block mb-2 mt-4">
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  Email
                </span>
              </label>
              <div className="relative flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70 mr-2 text-gray-500 dark:text-gray-400"
                >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  type="email"
                  className="grow bg-transparent focus:outline-none dark:text-white"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block mb-2">
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  Password
                </span>
              </label>
              <div className="relative flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70 mr-2 text-gray-500 dark:text-gray-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="password"
                  className="grow bg-transparent focus:outline-none dark:text-white"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                className="w-full px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg"
                onClick={handleGetOtp}
              >
                Get OTP
              </button>
            </div>
            {isOtpSent && (
              <div>
                <div className="relative flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mt-4 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4 opacity-70 mr-2 text-gray-500 dark:text-gray-400"
                  >
                    <path d="M6.5 2a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2ZM4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2h-7ZM8 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-2.5-.5a.5.5 0 0 0-1 0v3a.5.5 0 0 0 1 0v-3Z" />
                  </svg>
                  <input
                    type="number"
                    className="grow bg-transparent focus:outline-none dark:text-white"
                    placeholder="Enter your OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <div className="mt-6">
                  <button
                    className="w-full px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg"
                    onClick={handleVerifyOtp}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </form>
          <div className="relative flex py-4 items-center mt-4">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-600 dark:text-gray-400">
              OR
            </span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="text-center text-gray-700 dark:text-gray-300">
            <p>Already have an account?</p>
            <Link
              to="/login"
              className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
            >
              Login now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
