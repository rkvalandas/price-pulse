"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "../../api";
import AlertInfo from "../ui/AlertInfo";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const [alertMessage, setAlertMessage] = useState("");

  // Define interfaces
  interface ForgotPasswordResponse {
    status: number;
    data: {
      message?: string;
    };
  }

  interface ApiError {
    response?: {
      data?: {
        message?: string;
      };
    };
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setAlertType("error");
      setAlertMessage("Please enter your email address");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response: ForgotPasswordResponse = await forgotPassword({ email });

      if (response.status === 200) {
        setSuccessMessage(
          response.data.message ||
            "Password reset email sent! Check your inbox."
        );
        setEmail(""); // Clear email field
        setAlertType("success");
        setAlertMessage("Password reset email sent! Check your inbox.");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
      }
    } catch (error: unknown) {
      const typedError = error as ApiError;
      const message =
        typedError.response?.data?.message ||
        "Failed to send reset email. Try again later.";
      setErrorMessage(message);
      setAlertType("error");
      setAlertMessage(message);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] bg-gray-100 dark:bg-gray-900 pt-20">
      {showAlert && <AlertInfo message={alertMessage} type={alertType} />}

      <div className="max-w-md w-5/6 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">
            Forgot Password
          </h2>

          {successMessage ? (
            <div className="mb-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">
                Email Sent!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {successMessage}
              </p>
              <Link
                href="/login"
                className="text-teal-600 hover:text-teal-500 dark:text-teal-400 font-medium"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
                  <p>{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <Link
                    href="/login"
                    className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400"
                  >
                    Back to Login
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
