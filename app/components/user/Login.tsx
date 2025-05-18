"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import AlertInfo from "../ui/AlertInfo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define the login schema with Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

// Create TypeScript type from the schema
type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Add password visibility toggle
  const [unverifiedAccount, setUnverifiedAccount] = useState({
    status: false,
    email: "",
    message: "",
  });
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Initialize state to store remembered email
  const [rememberedEmail, setRememberedEmail] = useState("");

  // Check for remembered email in localStorage on component mount
  React.useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    if (storedEmail) {
      setRememberedEmail(storedEmail);
    }
  }, []);

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: rememberedEmail || "",
      password: "",
      rememberMe: !!rememberedEmail, // Auto-check remember me if we have a saved email
    },
  });

  const triggerAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000); // Hide alert after 5 seconds
  };

  // Function to handle resending verification email
  const handleResendVerification = async () => {
    if (!unverifiedAccount.email) return;

    setIsResendingVerification(true);
    try {
      // Import from api.js
      const { resendVerification } = await import("../../api");

      // Send verification request
      await resendVerification({ email: unverifiedAccount.email });

      // Show success message
      setVerificationSent(true);
      setTimeout(() => {
        setVerificationSent(false);
      }, 10000); // Hide after 10 seconds
    } catch (error: unknown) {
      setErrorMessage(
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message ||
              "Failed to resend verification email. Please try again."
          : "Failed to resend verification email. Please try again."
      );
    } finally {
      setIsResendingVerification(false);
    }
  };

  // Function to handle verification code submission
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !verificationCode ||
      verificationCode.length !== 6 ||
      !unverifiedAccount.email
    ) {
      setErrorMessage("Please enter a valid 6-digit verification code");
      return;
    }

    setIsVerifying(true);
    try {
      // Import verifyEmail function from api.js
      const { verifyEmail } = await import("../../api");

      // Submit verification request
      const response = await verifyEmail({
        email: unverifiedAccount.email,
        otp: verificationCode,
      });

      if (response.status === 200) {
        // Reset states
        setUnverifiedAccount({ status: false, email: "", message: "" });
        setShowVerifyForm(false);
        setVerificationCode("");

        // Show success message
        setShowAlert(true);
        setErrorMessage("");

        // No need to set a message for success, empty errorMessage indicates success
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
      }
    } catch (error: unknown) {
      setErrorMessage(
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message ||
              "Verification failed. Please check your code and try again."
          : "Verification failed. Please check your code and try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // Track last submission time for throttling
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
  const throttleDelay = 1000; // 1 second delay between submissions

  const onSubmit = async (data: LoginFormData) => {
    const now = Date.now();

    // Check if enough time has passed since the last submission
    if (now - lastSubmitTime < throttleDelay) {
      console.log("Form submission throttled. Please wait.");
      return;
    }

    // Update last submission time
    setLastSubmitTime(now);
    setErrorMessage("");

    try {
      // If remember me is checked, store email in localStorage
      if (data.rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      const response = await login({
        email: data.email,
        password: data.password,
        rememberMe: !!data.rememberMe,
      });

      if (response && response.status === 200) {
        triggerAlert();
        // Navigate to dashboard or other pages after successful login
        router.push("/alerts");
      } else {
        setErrorMessage("Login failed. Authentication failed.");
      }
    } catch (error: unknown) {
      // Enhanced error handling with more specific messages
      let message = "An error occurred. Please try again.";

      // Handle API error responses
      if (typeof error === "object" && error !== null && "response" in error) {
        type ApiErrorType = {
          response?: {
            status?: number;
            data?: {
              message?: string;
              isVerified?: boolean;
              email?: string;
            };
          };
          request?: unknown;
        };

        const apiError = error as ApiErrorType;

        if (apiError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (apiError.response.status === 401) {
            // Check if this is an unverified account
            if (apiError.response.data?.isVerified === false) {
              // Handle unverified account
              setUnverifiedAccount({
                status: true,
                email: apiError.response.data.email || "",
                message:
                  apiError.response.data.message ||
                  "Account not verified. Please verify your account.",
              });
              return; // Exit early, no need to set error message
            } else {
              message = "Invalid email or password. Please try again.";
            }
          } else if (apiError.response.status === 403) {
            message = "Your account has been locked. Please contact support.";
          } else if (apiError.response.status === 404) {
            message = "Account not found. Please check your email or sign up.";
          } else if (apiError.response.data?.message) {
            message = apiError.response.data.message;
          }
        } else if (apiError.request) {
          // The request was made but no response was received
          message =
            "Unable to reach the server. Please check your internet connection.";
        }
      }

      setErrorMessage(message);
      console.error("Login error:", error);
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
          <div className="w-full max-w-md space-y-8 p-6 sm:p-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                You are already logged in
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                You've already been authenticated.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center mt-6">
              <button
                className="py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 min-h-[44px]"
                onClick={() => router.push("/alerts")}
              >
                Go to Alerts
              </button>
              <button
                className="py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 min-h-[44px]"
                onClick={() => router.push("/")}
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
          <div className="w-full max-w-md relative">
            {showAlert && (
              <div className="absolute top-0 left-0 right-0 -mt-12 mx-auto">
                <AlertInfo
                  message="Login successful. Redirecting..."
                  type="success"
                />
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl px-5 sm:px-8 py-8 border border-gray-200 dark:border-gray-700">
              <div className="mb-6 sm:mb-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome Back
                </h2>
                <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Sign in to track your product prices
                </p>
              </div>

              {/* Unverified account alert */}
              {unverifiedAccount.status && (
                <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-800 rounded-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-amber-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">
                        {unverifiedAccount.message}
                      </p>
                      <p className="mt-1 text-xs">
                        Email: {unverifiedAccount.email}
                      </p>

                      {verificationSent && (
                        <div className="mt-2 p-2 bg-green-50 text-green-800 text-sm rounded">
                          Verification email sent! Check your inbox.
                        </div>
                      )}

                      {/* Action buttons */}
                      {!showVerifyForm ? (
                        <div className="mt-3 flex flex-col sm:flex-row gap-2">
                          {!verificationSent && (
                            <button
                              onClick={handleResendVerification}
                              disabled={isResendingVerification}
                              className={`inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 min-h-[44px] ${
                                isResendingVerification
                                  ? "opacity-70 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {isResendingVerification ? (
                                <>
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Sending...
                                </>
                              ) : (
                                "Resend Verification Email"
                              )}
                            </button>
                          )}

                          <button
                            onClick={() => setShowVerifyForm(true)}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 min-h-[44px]"
                          >
                            Enter Verification Code
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleVerifySubmit} className="mt-4">
                          <div className="mb-4">
                            <label
                              htmlFor="verificationCode"
                              className="block text-sm font-medium text-amber-800 mb-1"
                            >
                              Enter 6-digit verification code
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                id="verificationCode"
                                value={verificationCode}
                                onChange={(e) =>
                                  setVerificationCode(
                                    e.target.value
                                      .replace(/[^\d]/g, "")
                                      .substring(0, 6)
                                  )
                                }
                                placeholder="000000"
                                maxLength={6}
                                className="w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 bg-white text-base"
                                style={{
                                  fontSize: "16px",
                                }} /* Prevents iOS zoom */
                                inputMode="numeric"
                                autoComplete="one-time-code"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              type="submit"
                              disabled={
                                isVerifying || verificationCode.length !== 6
                              }
                              className={`inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 min-h-[44px] ${
                                isVerifying || verificationCode.length !== 6
                                  ? "opacity-70 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {isVerifying ? (
                                <>
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Verifying...
                                </>
                              ) : (
                                "Verify"
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => setShowVerifyForm(false)}
                              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 min-h-[44px]"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {errorMessage && !unverifiedAccount.status && (
                <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
                  <p>{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className={`w-full px-3 py-3 border ${
                      errors.email
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white text-base min-h-[44px]`}
                    placeholder="your@email.com"
                    style={{ fontSize: "16px" }} /* Prevents iOS zoom */
                    autoComplete="email"
                    inputMode="email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex flex-wrap justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-teal-600 hover:text-teal-500 dark:text-teal-400"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      {...register("password")}
                      className={`w-full px-3 py-3 border ${
                        errors.password
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white text-base min-h-[44px]`}
                      placeholder="••••••••"
                      style={{ fontSize: "16px" }} /* Prevents iOS zoom */
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 min-h-[44px] min-w-[44px] justify-center"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center mb-6">
                  <input
                    id="rememberMe"
                    {...register("rememberMe")}
                    type="checkbox"
                    className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300 min-h-[44px] flex items-center"
                  >
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 min-h-[44px] ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      Or
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-center text-base text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
