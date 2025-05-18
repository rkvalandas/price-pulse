"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signup, verifyEmail, resendVerification } from "../../api";
import AlertInfo from "../ui/AlertInfo";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define the signup schema with Zod
const signupSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" })
      // Enforce stronger password requirements
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions to proceed",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Path of the error
  });

// Create TypeScript type from the schema
type SignupFormData = z.infer<typeof signupSchema>;

const PasswordStrength = ({ password }: { password: string }) => {
  // Calculate password strength
  const getPasswordStrength = (
    password: string
  ): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: "", color: "bg-gray-200" };

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;

    // Contains lowercase letter
    if (/[a-z]/.test(password)) strength += 1;

    // Contains uppercase letter
    if (/[A-Z]/.test(password)) strength += 1;

    // Contains number
    if (/[0-9]/.test(password)) strength += 1;

    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const strengthMap = [
      { label: "Very weak", color: "bg-red-500" },
      { label: "Weak", color: "bg-orange-500" },
      { label: "Fair", color: "bg-yellow-500" },
      { label: "Good", color: "bg-blue-500" },
      { label: "Strong", color: "bg-green-500" },
    ];

    return {
      strength,
      label: strengthMap[strength - 1]?.label || "",
      color: strengthMap[strength - 1]?.color || "bg-gray-200",
    };
  };

  const { strength, label, color } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex justify-between mb-1">
        <div className="text-xs">{label}</div>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300 ease-in-out`}
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

const Signup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Add state for OTP verification
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  // Watch the password field to use with the strength indicator
  const password = watch("password");

  const showAlert = (message: string, type = "error") => {
    // Scroll to top of the form to ensure alert is visible
    window.scrollTo({ top: 0, behavior: "smooth" });

    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 8000); // Increased timeout for better readability
  };

  // Track last submission time for throttling
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
  const throttleDelay = 1000; // 1 second delay between submissions

  const onSubmit = async (data: SignupFormData) => {
    const now = Date.now();

    // Check if enough time has passed since the last submission
    if (now - lastSubmitTime < throttleDelay) {
      console.log("Form submission throttled. Please wait.");
      return;
    }

    // Update last submission time
    setLastSubmitTime(now);
    setLoading(true);

    try {
      // Extract only necessary fields for API call
      const { ...userData } = data;
      const response = await signup(userData);

      if (response.status === 201) {
        // Store the email for OTP verification
        setVerificationEmail(userData.email);

        // Show OTP form instead of success message
        setShowOtpForm(true);

        showAlert(
          "Registration successful! Please enter the OTP sent to your email to verify your account.",
          "success"
        );
      }
    } catch (error: unknown) {
      // Enhanced error handling with specific error messages
      let errorMessage = "Registration failed. Please try again.";

      if (typeof error === "object" && error !== null && "response" in error) {
        type ApiErrorType = {
          response?: {
            status?: number;
            data?: {
              message?: string;
              errors?: Record<string, string>;
            };
          };
          request?: unknown;
        };

        const apiError = error as ApiErrorType;

        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (apiError.response?.status === 400) {
          errorMessage =
            apiError.response.data?.message || "Invalid information provided.";
        } else if (apiError.response?.status === 409) {
          errorMessage =
            "This email is already registered. Please try logging in instead.";
        } else if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }

        // Check for field-specific errors
        if (apiError.response?.data?.errors) {
          const fieldErrors = apiError.response.data.errors;
          if (typeof fieldErrors === "object") {
            const errorList = Object.entries(fieldErrors)
              .map(([field, message]) => `${field}: ${message}`)
              .join(", ");
            errorMessage = `Validation errors: ${errorList}`;
          }
        }
      } else if (
        typeof error === "object" &&
        error !== null &&
        "request" in error
      ) {
        // The request was made but no response was received
        errorMessage =
          "Unable to reach the server. Please check your internet connection and try again.";
      }

      showAlert(errorMessage);
      console.error(
        "Registration error:",
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      showAlert("Please enter a valid 6-digit OTP", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await verifyEmail({
        email: verificationEmail,
        otp: otp,
      });

      if (response.status === 200) {
        setSuccess(true);
        setShowOtpForm(false);
        showAlert(
          "Email verified successfully! You can now log in.",
          "success"
        );

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (error: unknown) {
      let errorMessage =
        "Verification failed. Please check your OTP and try again.";

      if (typeof error === "object" && error !== null && "response" in error) {
        type ApiErrorType = {
          response?: {
            data?: {
              message?: string;
            };
          };
        };
        const apiError = error as ApiErrorType;
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      }

      showAlert(errorMessage, "error");
      console.error(
        "OTP verification error:",
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (!verificationEmail) {
      showAlert(
        "Email address is missing. Please try registering again.",
        "error"
      );
      return;
    }

    setLoading(true);

    try {
      // Use the dedicated resendVerification endpoint
      const response = await resendVerification({ email: verificationEmail });

      if (response.status === 200) {
        showAlert(
          "A new verification code has been sent to your email.",
          "success"
        );
      }
    } catch (error: unknown) {
      let errorMessage =
        "Failed to resend verification code. Please try again.";

      if (typeof error === "object" && error !== null && "response" in error) {
        type ApiErrorType = {
          response?: {
            data?: {
              message?: string;
            };
          };
        };
        const apiError = error as ApiErrorType;
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      }

      showAlert(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] from-teal-50 to-cyan-50 dark:bg-gray-900 pt-20 scrollbar-hide">
      {alert.show && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <AlertInfo
            message={alert.message}
            type={alert.type as "success" | "error" | "info" | "warning"}
          />
        </div>
      )}

      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          {showOtpForm ? "Verify Your Email" : "Create Account"}
        </h2>

        {success ? (
          <div className="text-center py-8">
            <div className="mb-4 text-green-500">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              Email Verified Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You can now log in to your account.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Redirecting to login...
            </p>
          </div>
        ) : showOtpForm ? (
          <div>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              We&apos;ve sent a 6-digit verification code to{" "}
              <strong>{verificationEmail}</strong>. Please enter it below to
              verify your account.
            </p>
            <div className="mb-6">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Verification Code (OTP)
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white text-center text-2xl letter-spacing-wide"
                placeholder="000000"
              />
            </div>
            <div className="flex flex-col space-y-4">
              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className={`flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                  loading || otp.length !== 6
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
              >
                {loading ? (
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
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </button>
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-teal-600 hover:text-teal-700 font-medium text-sm dark:text-teal-400"
                >
                  Didn&apos;t receive the code? Resend
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className={`w-full px-3 py-2 border ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

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
                className={`w-full px-3 py-2 border ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password")}
                  className={`w-full px-3 py-2 border ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
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

            <PasswordStrength password={password} />

            <div className="mt-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
              <p>Password requirements:</p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li
                  className={
                    password && password.length >= 8
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {password && password.length >= 8 ? "✓" : "✗"} At least 8
                  characters
                </li>
                <li
                  className={
                    password && /[a-z]/.test(password)
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {password && /[a-z]/.test(password) ? "✓" : "✗"} One lowercase
                  letter
                </li>
                <li
                  className={
                    password && /[A-Z]/.test(password)
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {password && /[A-Z]/.test(password) ? "✓" : "✗"} One uppercase
                  letter
                </li>
                <li
                  className={
                    password && /[0-9]/.test(password)
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {password && /[0-9]/.test(password) ? "✓" : "✗"} One number
                </li>
                <li
                  className={
                    password && /[^A-Za-z0-9]/.test(password)
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {password && /[^A-Za-z0-9]/.test(password) ? "✓" : "✗"} One
                  special character
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  className={`w-full px-3 py-2 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                >
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    {...register("acceptTerms")}
                    className={`focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded ${
                      errors.acceptTerms ? "border-red-500" : ""
                    }`}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="acceptTerms"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <Link
                      href="/terms"
                      className="text-teal-600 hover:text-teal-500"
                      target="_blank"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-teal-600 hover:text-teal-500"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.acceptTerms && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.acceptTerms.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    By creating an account, you agree to receive price alerts
                    and notifications based on your preferences.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
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
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400"
                >
                  Log in
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
