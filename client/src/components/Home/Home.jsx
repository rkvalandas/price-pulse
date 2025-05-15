// filepath: /Users/rkvalandasu/mini project/price_pulse/client/src/components/Home/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { searchProduct } from "../../api";

// CSS for interactive background elements
const backgroundStyles = `
  .grid-pattern {
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 50px 50px;
    background-position: center;
    mask-image: radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%);
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 0.8; }
  }
  
  @keyframes shine {
    from {
      mask-position: 150%;
    }
    to {
      mask-position: -50%;
    }
  }
  
  @keyframes scanline {
    0% { transform: translateY(0); opacity: 0; }
    5% { opacity: 0.5; }
    95% { opacity: 0.5; }
    100% { transform: translateY(100vh); opacity: 0; }
  }
  
  @keyframes colorPulse {
    0%, 100% { filter: brightness(100%) hue-rotate(0deg); }
    50% { filter: brightness(120%) hue-rotate(10deg); }
  }
  
  @keyframes rotate3d {
    0% { transform: rotate3d(1, 1, 1, 0deg); }
    100% { transform: rotate3d(1, 1, 1, 360deg); }
  }
  
  /* Enhance selection color to match brand */
  ::selection {
    background-color: rgba(56, 178, 172, 0.4); /* teal-500 with opacity */
    color: inherit;
  }
`;

export default function Home() {
  const [url, setUrl] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  
  // Add styles to document head
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = backgroundStyles;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  
  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  const handleShareOnTwitter = () => {
    const tweetText = encodeURIComponent(
      "Check out Price Pulse - the best way to track prices and save money on your favorite products! #PricePulse #PriceTracking"
    );
    const tweetUrl = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`,
      "_blank"
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsSearching(true);
    try {
      // Navigate to product page with loading state first
      navigate("/product", { state: { isLoading: true } });

      // Then fetch the data
      const { data } = await searchProduct(url);

      // Once data is fetched, navigate again with the actual data
      navigate("/product", {
        state: { data, user: data.user, isLoading: false },
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      // Navigate to product page with error state
      navigate("/product", {
        state: { error: "Failed to fetch product data", isLoading: false },
      });
    }
  };

  return (
    <div className="w-full">

      {/* Main Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
        {/* Advanced interactive background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-teal-600 to-blue-900 dark:from-teal-900 dark:via-teal-800 dark:to-gray-900">
          {/* Animated gradient blobs */}
          <motion.div
            className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-teal-300 mix-blend-soft-light blur-3xl opacity-60 dark:opacity-30"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-blue-300 mix-blend-soft-light blur-3xl opacity-60 dark:opacity-30"
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1.1, 0.9, 1.1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute top-[40%] right-[30%] w-64 h-64 rounded-full bg-green-200 mix-blend-soft-light blur-3xl opacity-50 dark:opacity-20"
            animate={{
              x: [0, 50, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          {/* Interactive floating elements - with parallax effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Price tag SVGs with mouse parallax */}
            <motion.div 
              className="absolute top-[15%] left-[15%] text-white/30 dark:text-white/15"
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              style={{
                x: mousePosition.x * -30,
                y: mousePosition.y * -30 + (Math.sin(Date.now() * 0.001) * 10)
              }}
              transition={{ 
                y: { duration: 3, repeat: Infinity, repeatType: "reverse" },
                rotate: { duration: 6, repeat: Infinity, repeatType: "reverse" }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 md:h-24 md:w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5a1.99 1.99 0 013.465 0H21.5a1.5 1.5 0 011.5 1.5v3.505a1.5 1.5 0 01-.43 1.06l-7.07 7.07a1.5 1.5 0 01-2.12 0l-7.5-7.5a1.5 1.5 0 010-2.12L9.5 3.035A1.5 1.5 0 0111 3z" />
              </svg>
              <div className="absolute -right-6 -top-6 bg-red-500 text-white text-xs rounded-full w-12 h-12 flex items-center justify-center font-bold transform rotate-12 shadow-lg">
                -30%
              </div>
            </motion.div>

            <motion.div 
              className="absolute top-[65%] left-[75%] text-white/20 dark:text-white/10"
              animate={{ 
                y: [0, 20, 0],
                rotate: [0, -8, 0, 8, 0]
              }}
              style={{
                x: mousePosition.x * 20,
                y: mousePosition.y * 20 + (Math.sin(Date.now() * 0.0008) * 8)
              }}
              transition={{ 
                y: { duration: 4, repeat: Infinity, repeatType: "reverse" },
                rotate: { duration: 8, repeat: Infinity, repeatType: "reverse" }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 md:h-32 md:w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5a1.99 1.99 0 013.465 0H21.5a1.5 1.5 0 011.5 1.5v3.505a1.5 1.5 0 01-.43 1.06l-7.07 7.07a1.5 1.5 0 01-2.12 0l-7.5-7.5a1.5 1.5 0 010-2.12L9.5 3.035A1.5 1.5 0 0111 3z" />
              </svg>
              <div className="absolute -left-4 -bottom-4 bg-green-500 text-white text-xs rounded-full w-14 h-14 flex items-center justify-center font-bold transform -rotate-12 shadow-lg">
                SALE!
              </div>
            </motion.div>
            
            {/* "Price Pulse" branded element with pulse animation */}
            <motion.div
              className="absolute bottom-[15%] left-[50%] transform -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
                scale: [0.98, 1.02, 0.98]
              }}
              style={{
                x: mousePosition.x * -15,
                y: mousePosition.y * -15
              }}
              transition={{ 
                opacity: { duration: 3, repeat: Infinity, repeatType: "reverse" },
                scale: { duration: 4, repeat: Infinity, repeatType: "reverse" }
              }}
            >
              <div className="text-center backdrop-blur-lg bg-white/5 dark:bg-white/10 p-3 rounded-full">
                <div className="text-white text-opacity-30 dark:text-opacity-20 text-4xl md:text-5xl font-extrabold">
                  PRICE PULSE
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mt-1"></div>
              </div>
            </motion.div>

            {/* Interactive graph trend line with data points */}
            <motion.div
              className="absolute bottom-[20%] left-[8%] text-white/25 dark:text-white/15"
              style={{
                x: mousePosition.x * 25,
                y: mousePosition.y * 25
              }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1
              }}
              transition={{ 
                pathLength: { delay: 0.5, duration: 2 },
                opacity: { delay: 0.5, duration: 1 }
              }}
            >
              <svg width="200" height="100" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                {/* Chart grid lines */}
                <line x1="0" y1="80" x2="200" y2="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,5" opacity="0.3" />
                <line x1="0" y1="60" x2="200" y2="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,5" opacity="0.3" />
                <line x1="0" y1="40" x2="200" y2="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,5" opacity="0.3" />
                <line x1="0" y1="20" x2="200" y2="20" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,5" opacity="0.3" />
                
                {/* Price trend line */}
                <motion.path
                  d="M0,70 C20,70 30,60 40,60 C50,60 60,50 70,48 C80,46 90,30 100,30 C110,30 120,20 130,10 C140,10 150,20 160,15 C170,10 180,5 200,5"
                  fill="none"
                  stroke="url(#trendGradient)"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.5 }}
                />
                
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4fd1c5" />
                    <stop offset="100%" stopColor="#3182ce" />
                  </linearGradient>
                </defs>
                
                {/* Price drop points with animated dots */}
                <motion.circle cx="70" cy="48" r="4" fill="#10B981" 
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                />
                <motion.circle cx="100" cy="30" r="4" fill="#10B981"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                />
                <motion.circle cx="160" cy="15" r="4" fill="#10B981"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                  transition={{ delay: 1.8, duration: 0.8 }}
                />
                
                {/* Price labels */}
                <motion.text x="65" y="38" fontSize="8" fill="currentColor" opacity="0.9"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                >-10%</motion.text>
                <motion.text x="95" y="20" fontSize="8" fill="currentColor" opacity="0.9"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                >-25%</motion.text>
                <motion.text x="155" y="5" fontSize="8" fill="currentColor" opacity="0.9"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.9, duration: 0.5 }}
                >-40%</motion.text>
              </svg>
            </motion.div>

            {/* Animated coins with parallax */}
            <div className="coin-group">
              <motion.div
                className="absolute top-[30%] right-[12%] text-yellow-300/40 dark:text-yellow-300/20"
                style={{
                  x: mousePosition.x * -40,
                  y: mousePosition.y * -40
                }}
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 360]
                }}
                transition={{ 
                  y: { duration: 4, repeat: Infinity, repeatType: "reverse" },
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" fill="url(#coinGradient)" fillOpacity="0.2" />
                  <path d="M12 6v12M15 9h-6M15 15h-6" strokeWidth="2" stroke="currentColor" fill="none" />
                  <defs>
                    <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#FFA500" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
              
              {/* Additional coins scattered around */}
              <motion.div
                className="absolute top-[25%] right-[20%] text-yellow-300/30 dark:text-yellow-300/15"
                style={{
                  x: mousePosition.x * -25,
                  y: mousePosition.y * -25
                }}
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 360]
                }}
                transition={{ 
                  y: { duration: 3, repeat: Infinity, repeatType: "reverse" },
                  rotate: { duration: 6, repeat: Infinity, ease: "linear" }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" fill="url(#coinGradient)" fillOpacity="0.2" />
                  <path d="M12 6v12M15 9h-6M15 15h-6" strokeWidth="2" stroke="currentColor" fill="none" />
                </svg>
              </motion.div>
              
              <motion.div
                className="absolute top-[40%] right-[16%] text-yellow-300/20 dark:text-yellow-300/10"
                style={{
                  x: mousePosition.x * -35,
                  y: mousePosition.y * -35
                }}
                animate={{ 
                  y: [0, -12, 0],
                  rotate: [0, 360]
                }}
                transition={{ 
                  y: { duration: 5, repeat: Infinity, repeatType: "reverse" },
                  rotate: { duration: 7, repeat: Infinity, ease: "linear" }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" fill="url(#coinGradient)" fillOpacity="0.2" />
                  <path d="M12 6v12M15 9h-6M15 15h-6" strokeWidth="2" stroke="currentColor" fill="none" />
                </svg>
              </motion.div>
            </div>

            {/* Shopping cart icon with interactive notification */}
            <motion.div
              className="absolute bottom-[35%] right-[25%] text-white/25 dark:text-white/15"
              style={{
                x: mousePosition.x * 35,
                y: mousePosition.y * 35
              }}
              animate={{ 
                x: [0, 15, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                x: { duration: 5, repeat: Infinity, repeatType: "reverse" },
                rotate: { duration: 6, repeat: Infinity, repeatType: "reverse" }
              }}
            >
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                
                {/* Notification badge */}
                <motion.div 
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  3
                </motion.div>
                
                {/* Product added notification */}
                <motion.div
                  className="absolute -top-10 -right-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-white text-xs p-2 rounded shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0],
                    y: [10, 0, 0, -10]
                  }}
                  transition={{ 
                    delay: 3,
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 7
                  }}
                >
                  Product added to cart!
                </motion.div>
              </div>
            </motion.div>

            {/* Thematic messaging - stylized callout texts with parallax */}
            <motion.div
              className="absolute top-[15%] right-[15%] text-white/20 dark:text-white/10 transform -rotate-6"
              style={{
                x: mousePosition.x * 15,
                y: mousePosition.y * 15
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className="bg-gradient-to-r from-teal-500/20 to-blue-500/20 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <p className="text-2xl md:text-3xl font-bold text-white/80 dark:text-white/60">Never miss a deal!</p>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-[25%] left-[15%] text-white/20 dark:text-white/10 transform rotate-3"
              style={{
                x: mousePosition.x * -15,
                y: mousePosition.y * -15
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <p className="text-xl md:text-2xl font-bold text-white/80 dark:text-white/60">Save money today</p>
              </div>
            </motion.div>
            

            {/* Subtle interactive grid pattern with wave overlay */}
            <div className="absolute inset-0 grid-pattern opacity-[0.05] dark:opacity-[0.03]"></div>
            
            {/* Animated SVG wave overlay */}
            <div className="absolute inset-0 overflow-hidden">
              <svg className="absolute bottom-0 left-0 w-full opacity-10 dark:opacity-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <motion.path 
                  fill="#ffffff" 
                  fillOpacity="1" 
                  initial={{ d: "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,117.3C672,85,768,43,864,48C960,53,1056,107,1152,117.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" }}
                  animate={{ 
                    d: [
                      "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,117.3C672,85,768,43,864,48C960,53,1056,107,1152,117.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                      "M0,160L48,170.7C96,181,192,203,288,186.7C384,171,480,117,576,106.7C672,96,768,128,864,138.7C960,149,1056,139,1152,138.7C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                      "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,117.3C672,85,768,43,864,48C960,53,1056,107,1152,117.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ]
                  }}
                  transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                ></motion.path>
              </svg>
              
              <svg className="absolute bottom-0 left-0 w-full opacity-10 dark:opacity-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <motion.path 
                  fill="#ffffff" 
                  fillOpacity="0.5"
                  initial={{ d: "M0,192L48,202.7C96,213,192,235,288,229.3C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" }}
                  animate={{ 
                    d: [
                      "M0,192L48,202.7C96,213,192,235,288,229.3C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                      "M0,224L48,229.3C96,235,192,245,288,218.7C384,192,480,128,576,128C672,128,768,192,864,202.7C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                      "M0,192L48,202.7C96,213,192,235,288,229.3C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ]
                  }}
                  transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
                ></motion.path>
              </svg>
            </div>
            
            {/* Scanning line effect */}
            <motion.div 
              className="absolute inset-0 pointer-events-none z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ delay: 2, duration: 3, repeat: Infinity, repeatDelay: 5 }}
            >
              <motion.div 
                className="absolute h-px w-full bg-gradient-to-r from-transparent via-teal-400/50 to-transparent blur-sm"
                initial={{ top: 0 }}
                animate={{ top: '100%' }}
                transition={{ delay: 2, duration: 3, repeat: Infinity, repeatDelay: 5 }}
              />
            </motion.div>
          </div>
        </div>

        {/* Enhanced overlay for better text readability with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 dark:from-black/50 dark:to-black/60"></div>
        <div className="flex items-center justify-center w-full px-4 py-12 pt-48 text-center z-10">
          <div className="max-w-full min-w-72 w-full">
            <motion.h1
              className="text-5xl font-bold mb-4 text-white [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)] relative z-10"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Track Product Prices
            </motion.h1>
            <motion.div
              className="w-16 h-1 bg-white opacity-70 mx-auto mb-6"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.p
              className="text-xl mb-8 text-white [text-shadow:_0_1px_3px_rgba(0,0,0,0.5)] max-w-2xl mx-auto relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Find the best deals and track the price history of your favorite
              products.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              className="max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <form onSubmit={handleSearch} className="relative">
                <div className="flex flex-col md:flex-row gap-3 items-center">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Paste an Amazon, Flipkart, or Myntra product URL here"
                      className="w-full pl-5 pr-5 py-6 text-lg rounded-3xl border-teal-500 border-2 shadow-xl focus:border-teal-600 focus:ring-2 focus:ring-teal-300 bg-white/95 dark:bg-gray-800/95 dark:text-white dark:border-teal-400 focus:outline-none backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </div>
                  <motion.button
                    className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white rounded-full px-7 py-7 font-medium shadow-lg hover:shadow-xl w-full md:w-auto transition-all duration-300"
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    ) : (
                      <span className="flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </span>
                    )}
                  </motion.button>
                </div>
              </form>
              <p className="text-sm text-white [text-shadow:_0_1px_2px_rgba(0,0,0,0.5)] mt-2 bg-black/10 backdrop-blur-sm py-1.5 px-3 rounded-full inline-block">
                Track prices from Amazon, Flipkart, Myntra and more!
              </p>
            </motion.div>

            {/* Social Share Button */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <motion.button
                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm flex items-center rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                onClick={handleShareOnTwitter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="mr-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                </svg>
                Share on Twitter
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-teal-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 text-teal-800 dark:text-teal-300">
              About Price Pulse
            </h2>
            <div className="w-16 h-1 bg-teal-500 mx-auto mb-6"></div>
            <p className="text-lg max-w-3xl mx-auto text-teal-900 dark:text-teal-100">
              Price Pulse is your ultimate companion for smart shopping. We help
              you track prices of your favorite products across e-commerce
              platforms, notifying you when prices drop so you never miss a deal
              again. Our mission is to empower consumers to make informed
              purchasing decisions and save money.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <motion.div
              className="bg-white dark:bg-gray-700 border-teal-200 dark:border-teal-700 rounded-3xl border-2 shadow-xl hover:shadow-2xl transition-all"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="p-5">
                <div className="text-4xl text-teal-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-teal-700 dark:text-teal-300">
                  Real-time Tracking
                </h3>
                <p className="text-teal-800 dark:text-teal-200">
                  Monitor product prices in real-time across multiple e-commerce
                  platforms.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-700 border-teal-200 dark:border-teal-700 border-2 rounded-3xl shadow-xl hover:shadow-2xl transition-all"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="p-5">
                <div className="text-4xl text-teal-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-teal-700 dark:text-teal-300">
                  Instant Alerts
                </h3>
                <p className="text-teal-800 dark:text-teal-200">
                  Receive instant notifications when prices drop for your
                  tracked products.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-700 border-teal-200 dark:border-teal-700 border-2 rounded-3xl shadow-xl hover:shadow-2xl transition-all"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="p-5">
                <div className="text-4xl text-teal-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-teal-700 dark:text-teal-300">
                  Easy to Use
                </h3>
                <p className="text-teal-800 dark:text-teal-200">
                  Simple and intuitive interface for hassle-free price tracking
                  experience.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-teal-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 text-teal-800 dark:text-teal-300">
              How It Works
            </h2>
            <div className="w-16 h-1 bg-teal-500 mx-auto mb-6"></div>
            <p className="text-lg max-w-3xl mx-auto text-teal-700 dark:text-teal-200">
              Start saving money in three simple steps
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <motion.div
              className="step-item text-center max-w-xs"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="step-number mb-4 mx-auto w-16 h-16 rounded-full bg-teal-600 text-white text-2xl flex items-center justify-center font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold mb-2 text-teal-800 dark:text-teal-300">
                Add Products
              </h3>
              <p className="text-teal-700 dark:text-teal-200">
                Simply paste the URL of the product you want to track from your
                favorite e-commerce site.
              </p>
            </motion.div>

            <motion.div
              className="hidden md:block text-teal-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </motion.div>

            <motion.div
              className="step-item text-center max-w-xs"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="step-number mb-4 mx-auto w-16 h-16 rounded-full bg-teal-600 text-white text-2xl flex items-center justify-center font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold mb-2 text-teal-800 dark:text-teal-300">
                Set Alerts
              </h3>
              <p className="text-teal-700 dark:text-teal-200">
                Configure price threshold alerts to be notified when the product
                price drops to your target.
              </p>
            </motion.div>

            <motion.div
              className="hidden md:block text-teal-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </motion.div>

            <motion.div
              className="step-item text-center max-w-xs"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="step-number mb-4 mx-auto w-16 h-16 rounded-full bg-teal-600 text-white text-2xl flex items-center justify-center font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold mb-2 text-teal-800 dark:text-teal-300">
                Save Money
              </h3>
              <p className="text-teal-700 dark:text-teal-200">
                Receive instant notifications and purchase the product at the
                best price.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-teal-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 text-teal-800 dark:text-teal-300">
              Key Features
            </h2>
            <div className="w-16 h-1 bg-teal-500 mx-auto mb-6"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              className="bg-white dark:bg-gray-700 shadow-xl hover:-translate-y-2 transition-all border-2 border-teal-100 dark:border-teal-700 rounded-3xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="p-5">
                <div className="mb-4 text-4xl bg-teal-100 dark:bg-teal-800 w-16 h-16 rounded-full flex items-center justify-center">
                  📊
                </div>
                <h3 className="text-lg font-bold mb-2 text-teal-700 dark:text-teal-300">
                  Price History
                </h3>
                <p className="text-teal-700 dark:text-teal-200">
                  View complete price history charts to make informed decisions.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-700 shadow-xl hover:-translate-y-2 transition-all border-2 border-teal-100 dark:border-teal-700 rounded-3xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="p-5">
                <div className="mb-4 text-4xl bg-teal-100 dark:bg-teal-800 w-16 h-16 rounded-full flex items-center justify-center">
                  🔔
                </div>
                <h3 className="text-lg font-bold mb-2 text-teal-700 dark:text-teal-300">
                  Custom Alerts
                </h3>
                <p className="text-teal-700 dark:text-teal-200">
                  Set custom price thresholds for alerts via email.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-700 shadow-xl hover:-translate-y-2 transition-all border-2 border-teal-100 dark:border-teal-700 rounded-3xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="p-5">
                <div className="mb-4 text-4xl bg-teal-100 dark:bg-teal-800 w-16 h-16 rounded-full flex items-center justify-center">
                  🔍
                </div>
                <h3 className="text-lg font-bold mb-2 text-teal-700 dark:text-teal-300">
                  Product Comparison
                </h3>
                <p className="text-teal-700 dark:text-teal-200">
                  Compare prices across different platforms at a glance.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-700 shadow-xl hover:-translate-y-2 transition-all border-2 border-teal-100 dark:border-teal-700 rounded-3xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="p-5">
                <div className="mb-4 text-4xl bg-teal-100 dark:bg-teal-800 w-16 h-16 rounded-full flex items-center justify-center">
                  📱
                </div>
                <h3 className="text-lg font-bold mb-2 text-teal-700 dark:text-teal-300">
                  Mobile Friendly
                </h3>
                <p className="text-teal-700 dark:text-teal-200">
                  Access from any device with our responsive design.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
