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
    <div className="flex items-center justify-center min-h-screen bg-base-200 pt-36 pb-12">
      {showAlert && !isOtpSent && <AlertInfo message="Signup Successful" type="success" />}
      {showAlert && isOtpSent && (
        <AlertInfo
          message="An OTP has been sent to your email. Verify your email to complete signup"
          type="success"
        />
      )}
      <div className="card max-w-md min-w-80 w-5/6 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-6">Create Account</h2>
          <form>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  type="text"
                  className="grow"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  type="email"
                  className="grow"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="password"
                  className="grow"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary" onClick={handleGetOtp}>
                Get OTP
              </button>
            </div>
            {isOtpSent && (
              <div>
                <label className="input input-bordered flex items-center gap-2 mt-4">
                  <input
                    type="number"
                    className="grow"
                    placeholder="Enter your OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </label>
                <div className="mt-6">
                    <button
                      className="btn btn-primary w-full"
                      onClick={handleVerifyOtp}
                    >
                      Sign Up
                    </button>
                </div>
              </div>
            )}
          </form>
          <div className="divider">OR</div>
          <div className="text-center">
            <p>Already have an account?</p>
            <Link to="/login" className="link link-primary">
              Login now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
