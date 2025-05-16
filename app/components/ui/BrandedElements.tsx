"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type PriceBadgeProps = {
  startPrice?: number;
  currentPrice?: number;
  discountPercentage?: number;
  className?: string;
};

export const PriceBadge = ({
  startPrice = 149.99,
  currentPrice = 99.99,
  discountPercentage = 33,
  className = "",
}: PriceBadgeProps) => {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/20 shadow-lg ${className}`}
      style={{ maxWidth: "220px" }}
    >
      {/* Shiny border */}
      <div className="p-0.5 bg-gradient-to-r from-[#00c6bc] via-[#0075ff] to-[#8b5cf6] relative">
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shine_3s_infinite]"></div>

        <div className="bg-white/90 dark:bg-gray-800/90 p-4 flex flex-col items-center justify-center relative">
          {/* Enhanced discount badge */}
          <div className="absolute -top-1 -right-1 transform rotate-12">
            <div className="bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {discountPercentage}% OFF
            </div>
          </div>

          {/* Original price */}
          <p className="text-sm text-gray-500 dark:text-gray-400 line-through mb-1">
            ₹{(startPrice * 75).toFixed(0)}
          </p>

          {/* Current price with more vivid gradient */}
          <p className="text-2xl font-bold bg-gradient-to-r from-[#00c6bc] via-[#0075ff] to-[#8b5cf6] bg-clip-text text-transparent">
            ₹{(currentPrice * 75).toFixed(0)}
          </p>

          {/* Added subtle description */}
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 opacity-80">
            Limited time offer
          </p>

          {/* Added pulsing dot */}
          <div className="absolute bottom-2 right-2">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00c6bc] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00c6bc]"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

type AnimatedPriceGraphProps = {
  className?: string;
  height?: number;
  width?: number;
};

export const AnimatedPriceGraph = ({
  className = "",
  height = 80,
  width = 200,
}: AnimatedPriceGraphProps) => {
  // Define the price points
  const pricePoints = [
    { month: "Jan", price: 5925 }, // ₹5,925 (79*75)
    { month: "Feb", price: 6375 }, // ₹6,375 (85*75)
    { month: "Mar", price: 6150 }, // ₹6,150 (82*75)
    { month: "Apr", price: 6750 }, // ₹6,750 (90*75)
    { month: "May", price: 6525 }, // ₹6,525 (87*75)
    { month: "Jun", price: 5625 }, // ₹5,625 (75*75)
    { month: "Jul", price: 4875 }, // ₹4,875 (65*75)
  ];

  // Calculate min/max for scaling
  const minPrice = Math.min(...pricePoints.map((p) => p.price)) - 5;
  const maxPrice = Math.max(...pricePoints.map((p) => p.price)) + 5;
  const range = maxPrice - minPrice;

  // Scale a price to the chart height
  const scaleY = (price: number) => {
    return height - ((price - minPrice) / range) * height;
  };

  // Generate SVG path
  const pointSpacing = width / (pricePoints.length - 1);
  const points = pricePoints
    .map((point, i) => `${i * pointSpacing},${scaleY(point.price)}`)
    .join(" ");

  return (
    <div
      className={`relative ${className}`}
      style={{ height: `${height}px`, width: `${width}px` }}
    >
      {/* Price graph */}
      <svg width="100%" height="100%" className="overflow-visible">
        {/* Grid lines */}
        <line
          x1="0"
          y1={height}
          x2={width}
          y2={height}
          stroke="currentColor"
          strokeOpacity="0.1"
          strokeWidth="1"
        />

        {/* Bottom line */}
        <line
          x1="0"
          y1="0"
          x2={width}
          y2="0"
          stroke="currentColor"
          strokeOpacity="0.1"
          strokeWidth="1"
        />

        {/* Price path */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d={`M ${points}`}
          fill="none"
          stroke="url(#graphGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Area below the line */}
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
          d={`M 0,${height} ${points} ${width},${height} Z`}
          fill="url(#areaGradient)"
        />

        {/* Points */}
        {pricePoints.map((point, i) => (
          <motion.circle
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 1 + i * 0.1,
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
            cx={i * pointSpacing}
            cy={scaleY(point.price)}
            r="4"
            fill="#0075ff"
            stroke="white"
            strokeWidth="2"
          />
        ))}

        {/* Today's price indicator */}
        <motion.circle
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 2,
            type: "spring",
            stiffness: 400,
            damping: 10,
          }}
          cx={width}
          cy={scaleY(65)}
          r="6"
          fill="#00c6bc"
          stroke="white"
          strokeWidth="2"
        />

        {/* Tooltip */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.5 }}
        >
          <rect
            x={width - 40}
            y={scaleY(65) - 35}
            width="50"
            height="25"
            rx="4"
            fill="#00c6bc"
          />
          <text
            x={width - 15}
            y={scaleY(65) - 19}
            fontSize="12"
            fontWeight="bold"
            fill="white"
            textAnchor="middle"
          >
            ₹4,875
          </text>
          <polygon
            points={`${width - 15},${scaleY(65) - 10} ${width - 20},${
              scaleY(65) - 15
            } ${width - 10},${scaleY(65) - 15}`}
            fill="#00c6bc"
          />
        </motion.g>

        {/* Gradients */}
        <defs>
          <linearGradient id="graphGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00c6bc" />
            <stop offset="100%" stopColor="#0075ff" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0075ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0075ff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Month labels */}
      <div className="flex justify-between absolute -bottom-6 w-full text-xs text-gray-600 dark:text-gray-400">
        {pricePoints.map((point, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${i * pointSpacing - 10}px`,
              fontWeight: i === pricePoints.length - 1 ? "bold" : "normal",
            }}
          >
            {point.month}
          </span>
        ))}
      </div>
    </div>
  );
};

export const PulsingNotification = () => {
  return (
    <div className="relative flex items-center px-4 py-3 bg-gradient-to-r from-[rgba(0,198,188,0.15)] to-[rgba(0,117,255,0.15)] dark:border-white/10 border-teal-200/30 rounded-lg border backdrop-blur-sm overflow-hidden">
      {/* Animated background pulse */}
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,198,188,0.05)] to-[rgba(0,117,255,0.05)] animate-pulse opacity-50"></div>

      <div className="mr-3 relative">
        <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 animate-ping"></span>
        <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500"></span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-blue-500 dark:text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </div>
      <div>
        <p className="font-medium text-sm text-gray-800 dark:text-white">
          Price drop alert activated!
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-xs">
          We&apos;ll notify you when prices drop.
        </p>
      </div>
    </div>
  );
};

export const TaglineTyper = ({
  taglines = [
    "Never miss a deal again!",
    "Save money on every purchase",
    "Track prices across all stores",
    "Get notified of price drops instantly",
    "The smartest way to shop online",
  ],
}) => {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const tagline = taglines[currentTagline];

    if (!isDeleting && displayText === tagline) {
      // Pause at the end of typing
      const timeout = setTimeout(() => {
        setIsDeleting(true);
        setTypingSpeed(50);
      }, 2000);

      return () => clearTimeout(timeout);
    } else if (isDeleting && displayText === "") {
      // Move to next tagline
      setIsDeleting(false);
      setTypingSpeed(100);
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }

    // Handle typing animation
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(tagline.substring(0, displayText.length + 1));
      } else {
        setDisplayText(displayText.substring(0, displayText.length - 1));
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentTagline, displayText, isDeleting, taglines, typingSpeed]);

  return (
    <div className="h-8 flex items-center justify-center">
      {/* Background pill for the tagline */}
      <div className="relative px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
        {/* Subtle animated gradient in the background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,198,188,0.05)] via-[rgba(0,117,255,0.07)] to-[rgba(139,92,246,0.05)] rounded-full opacity-20"></div>

        <p className="text-lg md:text-xl">
          <span className="bg-gradient-to-r from-[#00c6bc] via-[#0075ff] to-[#8b5cf6] bg-clip-text text-transparent font-medium">
            {displayText}
          </span>
          <span className="inline-block w-0.5 h-5 bg-[#0075ff] animate-blink ml-0.5"></span>
        </p>
      </div>
    </div>
  );
};
