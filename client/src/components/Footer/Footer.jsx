import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer p-6 bg-base-300 text-base-content w-full mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        {/* Company Info */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold">Price Pulse</h2>
          <p className="text-sm md:text-base mt-2">
            Track your favorite products' prices effortlessly with our tool.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <span className="footer-title text-lg">Quick Links</span>
          <ul className="list-none mt-2 text-sm">
            <li>
              <Link to="/" className="link link-hover">
                Home
              </Link>
            </li>
            <li>
              <Link to="#" className="link link-hover">
                About Us
              </Link>
            </li>
            <li>
              <Link to="#" className="link link-hover">
                Contact
              </Link>
            </li>
            <li>
              <Link to="#" className="link link-hover">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div className="text-center md:text-left">
          <span className="footer-title text-lg">Follow Us</span>
          <div className="flex justify-center md:justify-start gap-4 mt-2">
            <a
              href="#"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
            >
              Twitter
            </a>
            <a
              href="#"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
            >
              Facebook
            </a>
            <a
              href="#"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>© 2024 Price Pulse. All rights reserved.</p>
      </div>
    </footer>
  );
}
