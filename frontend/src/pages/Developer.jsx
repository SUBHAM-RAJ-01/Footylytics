import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiCode, FiHeart, FiCoffee, FiExternalLink, FiCalendar } from 'react-icons/fi';

export default function Developer() {
  const lastUpdated = new Date('2025-10-03'); // Update this date when you make changes
  const version = 'v1.4.1';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">About the Developer</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Meet the person behind Footylytics
        </p>
        <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <FiCalendar className="w-4 h-4" />
            <span>Last Updated: {lastUpdated.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <span>•</span>
          <span>{version}</span>
        </div>
      </motion.div>

      {/* Developer Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 md:p-12 border-2 border-indigo-200 dark:border-indigo-900 shadow-xl"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
            whileHover={{ 
              scale: 1.15, 
              rotate: [0, -5, 5, -5, 0],
              transition: { duration: 0.5 }
            }}
            className="flex-shrink-0"
          >
            <motion.div 
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(99, 102, 241, 0.5)",
                  "0 0 40px rgba(139, 92, 246, 0.7)",
                  "0 0 20px rgba(99, 102, 241, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-indigo-500 dark:ring-purple-400"
            >
              <img 
                src="/resume photo.jpg" 
                alt="Subham Raj" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-5xl font-bold">S</div>';
                }}
              />
            </motion.div>
          </motion.div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
            >
              Subham Raj
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-4"
            >
              Full-Stack Developer & Football Enthusiast
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 dark:text-gray-400 mb-6"
            >
              Hi! I'm Subham Raj, the creator of Footylytics. I built this platform to combine my passion for 
              football with cutting-edge technology. Using React, Node.js, and AI-powered predictions, 
              I've created a comprehensive football analytics platform for fans worldwide.
            </motion.p>

            {/* Social Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center md:justify-start gap-3"
            >
              <motion.a
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/SUBHAM-RAJ-01"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
              >
                <FiGithub className="w-5 h-5" />
                <span>GitHub</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                href="https://suphamport.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg"
              >
                <FiExternalLink className="w-5 h-5" />
                <span>Portfolio</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:subhamraj.work@yahoo.com"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg"
              >
                <FiMail className="w-5 h-5" />
                <span>Email</span>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-8 border-2 border-indigo-100 dark:border-indigo-900 shadow-lg"
      >
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center space-x-2 mb-6"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <FiCode className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </motion.div>
          <h3 className="text-2xl font-bold">Tech Stack</h3>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'React',
            'Node.js',
            'Express',
            'MongoDB',
            'Tailwind CSS',
            'Supabase',
            'Stripe',
            'Google Gemini AI'
          ].map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              whileHover={{ scale: 1.1, y: -8, rotate: 2 }}
              className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 rounded-lg p-4 text-center font-medium border-2 border-indigo-200 dark:border-indigo-800 shadow-md hover:shadow-xl transition-shadow"
            >
              {tech}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Features Built */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-white to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border-2 border-indigo-100 dark:border-indigo-900 shadow-lg overflow-hidden relative"
      >
        {/* Animated Background */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none"
        />

        <motion.h3 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="text-2xl font-bold mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent relative z-10"
        >
          ✨ Key Features
        </motion.h3>
        
        <div className="grid md:grid-cols-2 gap-6 relative z-10">
          {[
            { icon: '⚽', title: 'Live Scores', desc: 'Real-time Updates', color: 'from-green-500 to-emerald-600' },
            { icon: '📊', title: 'League Standings', desc: 'Statistics', color: 'from-blue-500 to-cyan-600' },
            { icon: '🤖', title: 'AI Predictions', desc: 'Match Analysis', color: 'from-purple-500 to-pink-600' },
            { icon: '🔔', title: 'Notifications', desc: 'Match Alerts', color: 'from-orange-500 to-red-600' },
            { icon: '💳', title: 'Stripe Payment', desc: 'Secure Checkout', color: 'from-indigo-500 to-purple-600' },
            { icon: '🔐', title: 'Authentication', desc: 'Secure Login', color: 'from-gray-700 to-gray-900' },
            { icon: '🌙', title: 'Dark Mode', desc: 'Theme Support', color: 'from-slate-600 to-slate-800' },
            { icon: '📱', title: 'PWA', desc: 'App Experience', color: 'from-teal-500 to-cyan-600' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ 
                delay: 0.7 + index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.05,
                y: -8,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              className="relative group"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border-2 border-indigo-200 dark:border-indigo-800 shadow-md hover:shadow-2xl transition-all duration-300">
                {/* Gradient Bar */}
                <motion.div 
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} rounded-t-xl`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                />
                
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl flex-shrink-0"
                  >
                    {feature.icon}
                  </motion.div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.desc}
                    </p>
                  </div>
                  
                  {/* Hover Arrow */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    →
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Copyright & Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center shadow-2xl"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center space-x-2 mb-4"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <FiHeart className="w-6 h-6" />
          </motion.div>
          <h3 className="text-2xl font-bold">Made with Love</h3>
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FiCoffee className="w-6 h-6" />
          </motion.div>
        </motion.div>
        <p className="text-white/90 mb-4">
          Footylytics is built with passion for football and technology. 
          If you enjoy using this platform, consider upgrading to Premium to support development!
        </p>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
          <p className="text-sm text-white/80 mb-2">© {new Date().getFullYear()} Footylytics. All rights reserved.</p>
          <p className="text-xs text-white/70">
            Created and maintained by <span className="font-semibold">Subham Raj</span>
          </p>
        </div>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="/pricing"
          className="inline-block px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
        >
          Support Development
        </motion.a>
      </motion.div>
    </div>
  );
}
