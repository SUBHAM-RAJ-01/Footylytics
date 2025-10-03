import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PWALoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if running as PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  window.navigator.standalone ||
                  document.referrer.includes('android-app://');

    if (!isPWA) {
      setIsVisible(false);
      return;
    }

    // Hide loader after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center"
    >
      <div className="text-center">
        {/* Animated Football */}
        <motion.div
          className="relative w-32 h-32 mx-auto mb-8"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: {
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          {/* Football SVG */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
            {/* Ball */}
            <circle cx="50" cy="50" r="45" fill="white" />
            
            {/* Pentagon pattern */}
            <path
              d="M50 15 L65 25 L60 42 L40 42 L35 25 Z"
              fill="#1f2937"
            />
            <path
              d="M65 25 L80 30 L75 48 L60 42 Z"
              fill="#374151"
            />
            <path
              d="M80 30 L85 50 L75 65 L75 48 Z"
              fill="#1f2937"
            />
            <path
              d="M75 65 L70 80 L55 75 L60 58 L75 48 Z"
              fill="#374151"
            />
            <path
              d="M55 75 L40 80 L35 65 L45 58 L60 58 Z"
              fill="#1f2937"
            />
            <path
              d="M35 65 L25 70 L20 50 L30 48 L40 42 L45 58 Z"
              fill="#374151"
            />
            <path
              d="M25 70 L30 85 L40 80 L35 65 Z"
              fill="#1f2937"
            />
            <path
              d="M20 50 L15 30 L30 25 L35 25 L40 42 L30 48 Z"
              fill="#374151"
            />
            
            {/* Ball shine */}
            <ellipse
              cx="35"
              cy="30"
              rx="15"
              ry="10"
              fill="white"
              opacity="0.3"
            />
          </svg>
        </motion.div>

        {/* App Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Footylytics</h1>
          <p className="text-white/80 text-sm">Loading your football experience...</p>
        </motion.div>

        {/* Loading Dots */}
        <div className="flex items-center justify-center space-x-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
