import { motion } from 'framer-motion';

export default function FootballGraphics() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Football */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          rotate: [0, 360]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-12 h-12 opacity-20 dark:opacity-10"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="48" fill="white" stroke="#333" strokeWidth="2"/>
          <path d="M50 10 L60 30 L80 30 L65 45 L70 65 L50 50 L30 65 L35 45 L20 30 L40 30 Z" fill="#333"/>
        </svg>
      </motion.div>

      {/* Goal Post */}
      <div className="absolute bottom-10 right-10 opacity-10 dark:opacity-5">
        <svg width="100" height="80" viewBox="0 0 100 80" className="text-gray-600 dark:text-gray-400">
          <path d="M10 70 L10 10 L90 10 L90 70" stroke="currentColor" strokeWidth="3" fill="none"/>
          <path d="M15 15 L85 15 M15 25 L85 25 M15 35 L85 35 M15 45 L85 45 M15 55 L85 55 M15 65 L85 65" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
        </svg>
      </div>

      {/* Stadium Lights */}
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-10 right-32 opacity-20 dark:opacity-10"
      >
        <svg width="60" height="40" viewBox="0 0 60 40" className="text-yellow-500">
          <rect x="10" y="25" width="40" height="10" rx="5" fill="currentColor"/>
          <path d="M20 25 L25 5 L35 5 L40 25" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </motion.div>

      {/* Trophy */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-40 right-20 opacity-20 dark:opacity-10"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
          <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20.38C20.77 4 21.08 4.31 21.08 4.69C21.08 4.86 21.01 5.02 20.9 5.14L19 7.24V11C19 12.1 18.1 13 17 13H15.96L16.74 19H7.26L8.04 13H7C5.9 13 5 12.1 5 11V7.24L3.1 5.14C2.98 5.02 2.92 4.86 2.92 4.69C2.92 4.31 3.23 4 3.62 4H7Z"/>
        </svg>
      </motion.div>

      {/* Field Lines */}
      <div className="absolute bottom-0 left-0 right-0 opacity-5 dark:opacity-3">
        <svg width="100%" height="120" viewBox="0 0 400 120" className="text-green-500">
          <circle cx="200" cy="100" r="30" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="200" cy="100" r="3" fill="currentColor"/>
          <path d="M0 100 L400 100" stroke="currentColor" strokeWidth="2"/>
          <path d="M200 70 L200 120" stroke="currentColor" strokeWidth="2"/>
          <rect x="30" y="80" width="40" height="40" stroke="currentColor" strokeWidth="1" fill="none"/>
          <rect x="330" y="80" width="40" height="40" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
      </div>

      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            delay: i * 0.5
          }}
          className="absolute w-2 h-2 bg-blue-500 dark:bg-emerald-500 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            bottom: '10%'
          }}
        />
      ))}
    </div>
  );
}
