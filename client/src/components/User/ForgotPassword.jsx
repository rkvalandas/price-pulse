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
      })
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card shadow-lg w-full max-w-md bg-base-100">
        <div className="card-body">
          {!isOtpSent ? (
            // Stage 1: Send OTP
            <form onSubmit={handleSendOtp} className="space-y-4">
              <h1 className="text-xl font-bold text-center">Forgot Password</h1>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input input-bordered w-full"
              />
              <button type="submit" className="btn btn-primary w-full">
                Send OTP
              </button>
              {message && (
                <p className="text-sm text-center text-error">{message}</p>
              )}
            </form>
          ) : (
            // Stage 2: Reset Password
            <form onSubmit={handleResetPassword} className="space-y-4">
              <h1 className="text-xl font-bold text-center">Reset Password</h1>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input input-bordered w-full"
              />
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="input input-bordered w-full"
              />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="input input-bordered w-full"
              />
              <button type="submit" className="btn btn-primary w-full">
                Reset Password
              </button>
              {message && (
                <p className="text-sm text-center text-error">{message}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
