import React, { useState } from "react";
import { forgotPassword, resetPassword } from "../../api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false); // Track if OTP is sent

  // Handle sending OTP (Forgot Password)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await forgotPassword({ email });
      setMessage(data.message);
      setIsOtpSent(true); // Move to the reset password stage
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  // Handle resetting the password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await resetPassword({
        email,
        otp,
        newPassword,
      });
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 pt-24">
      <div className="max-w-md min-w-80 w-5/6 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          {!isOtpSent ? (
            // Stage 1: Send OTP
            <form onSubmit={handleSendOtp} className="space-y-4">
              <h1 className="text-xl font-bold text-center dark:text-white">
                Forgot Password
              </h1>
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
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="grow bg-transparent focus:outline-none dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg"
              >
                Send OTP
              </button>
              {message && (
                <p className="text-sm text-center text-red-500 dark:text-red-400">
                  {message}
                </p>
              )}
            </form>
          ) : (
            // Stage 2: Reset Password
            <form onSubmit={handleResetPassword} className="space-y-4">
              <h1 className="text-xl font-bold text-center dark:text-white">
                Reset Password
              </h1>
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
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="grow bg-transparent focus:outline-none dark:text-white"
                />
              </div>
              <div className="relative flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70 mr-2 text-gray-500 dark:text-gray-400"
                >
                  <path d="M6.5 2a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2ZM4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 11.5 2h-7ZM8 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-2.5-.5a.5.5 0 0 0-1 0v3a.5.5 0 0 0 1 0v-3Z" />
                </svg>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="grow bg-transparent focus:outline-none dark:text-white"
                />
              </div>
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
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="grow bg-transparent focus:outline-none dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg"
              >
                Reset Password
              </button>
              {message && (
                <p className="text-sm text-center text-red-500 dark:text-red-400">
                  {message}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
