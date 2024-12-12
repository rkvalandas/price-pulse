import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Authenticate/AuthProvider";
import AlertInfo from "../UIcomponents/AlertInfo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const {isAuthenticated, login } = useAuth();

  const triggerAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000); // Hide alert after 5 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      triggerAlert();

      // Navigate to dashboard or other pages after successful login
      navigate("/");
    } catch (error) {
      // Handle errors gracefully
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      console.log(errorMessage);
    }
  };

  return (
    <>
    {!isAuthenticated && <div className="flex items-center justify-center h-screen bg-base-200 pt-24">
      {showAlert && <AlertInfo message="Login Successful" type="success" />}
      <div className="card max-w-md min-w-80 w-5/6 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-6">Login</h2>
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="form-control">
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

            {/* Password Input */}
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
              <Link to="/forgot-password">
                <label className="label link">Forgot password?</label>
              </Link>
            </div>

            {/* Login Button */}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="divider">OR</div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p>Don't have an account?</p>
            <Link to="/signup" className="link link-primary">
              Sign up now
            </Link>
          </div>
        </div>
      </div>
    </div>}
    </>
  );
};

export default Login;
