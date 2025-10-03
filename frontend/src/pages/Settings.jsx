import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiAward, FiSun, FiMoon, FiBell, FiLogOut, FiCreditCard, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { getAvatarForEmail, getAvatarColor } from '../utils/avatars';

export default function Settings() {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    matchStart: true,
    goals: true,
    results: false
  });

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-8 text-white shadow-xl ${
          profile?.is_premium
            ? 'bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500'
            : 'bg-gradient-to-br from-blue-600 to-emerald-600'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar with Premium Ring */}
          <div className="relative">
            <div className={`w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl font-bold shadow-lg ${
              profile?.is_premium ? 'border-4 border-white/50 ring-4 ring-white/30' : 'border-4 border-white/30'
            }`}>
              {getAvatarForEmail(user?.email)}
            </div>
            {profile?.is_premium && (
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl">
                <FiAward className="w-6 h-6 text-yellow-500" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-1">
              {user?.email?.split('@')[0] || 'User'}
            </h2>
            <p className="text-white/90 mb-3 text-sm md:text-base">{user?.email}</p>
            
            {profile?.is_premium ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start space-x-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full inline-flex">
                  <FiAward className="w-5 h-5" />
                  <span className="text-sm font-bold">⭐ Premium Member</span>
                </div>
                {profile?.subscription_start && (
                  <p className="text-white/80 text-sm">
                    Member since {new Date(profile.subscription_start).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center md:justify-start space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full inline-flex">
                <FiUser className="w-4 h-4" />
                <span className="text-sm font-semibold">Free Plan</span>
              </div>
            )}
          </div>

          {/* Upgrade Button - Only show for free users */}
          {!profile?.is_premium && (
            <Link
              to="/pricing"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105"
            >
              Upgrade to Premium
            </Link>
          )}
        </div>
      </motion.div>

      {/* Premium Benefits - Only show for premium users */}
      {profile?.is_premium && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-6 border-2 border-yellow-400/50"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <FiAward className="text-yellow-600 dark:text-yellow-400" />
            <span>Your Premium Benefits</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">🤖</span>
              </div>
              <div>
                <p className="font-semibold">AI Predictions</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Powered by Google Gemini</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">📊</span>
              </div>
              <div>
                <p className="font-semibold">Advanced Analytics</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Detailed stats & charts</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">🚫</span>
              </div>
              <div>
                <p className="font-semibold">Ad-Free Experience</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">No distractions</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">⚡</span>
              </div>
              <div>
                <p className="font-semibold">Priority Support</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get help faster</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Account Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: profile?.is_premium ? 0.2 : 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <FiUser />
          <span>Account Information</span>
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <FiMail className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <FiCreditCard className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Subscription</p>
                <p className="font-medium">{profile?.is_premium ? 'Premium' : 'Free'}</p>
              </div>
            </div>
            {profile?.is_premium && (
              <button className="text-sm text-blue-600 dark:text-emerald-400 hover:underline">
                Manage
              </button>
            )}
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <FiShield className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Account Status</p>
                <p className="font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700"
      >
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {theme === 'light' ? <FiSun className="text-yellow-500" /> : <FiMoon className="text-blue-400" />}
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
          >
            Switch to {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <FiBell />
          <span>Notifications</span>
        </h2>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {key === 'matchStart' && 'Get notified when matches start'}
                  {key === 'goals' && 'Get notified when goals are scored'}
                  {key === 'results' && 'Get notified of final results'}
                </p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !value })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-blue-600 dark:bg-emerald-600' : 'bg-gray-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-red-200 dark:border-red-900"
      >
        <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">Danger Zone</h2>
        <div className="space-y-4">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FiLogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
