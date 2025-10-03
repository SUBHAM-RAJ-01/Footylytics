import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiAward, FiSun, FiMoon, FiBell, FiLogOut, FiCreditCard, FiShield, FiClock, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { getAvatarForEmail, getAvatarColor } from '../utils/avatars';
import SubscriptionReminder from '../components/SubscriptionReminder';

export default function Settings() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    matchStart: true,
    goals: true,
    results: false
  });
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(null);

  // Refresh profile when component mounts
  useEffect(() => {
    if (refreshProfile && user) {
      refreshProfile();
    }
  }, [refreshProfile, user]);

  // Calculate days remaining on subscription
  useEffect(() => {
    if (profile?.is_premium && profile?.subscription_end) {
      const endDate = new Date(profile.subscription_end);
      const today = new Date();
      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      console.log('Subscription end date:', profile.subscription_end);
      console.log('Days remaining:', diffDays);
      
      setDaysRemaining(diffDays);

      // Show reminder popup at 5, 3, 2, and 1 days remaining
      const reminderDays = [5, 3, 2, 1];
      const lastShownKey = `reminder_shown_${diffDays}`;
      const hasShownToday = localStorage.getItem(lastShownKey);

      if (reminderDays.includes(diffDays) && !hasShownToday) {
        setShowReminderModal(true);
        localStorage.setItem(lastShownKey, 'true');
        
        // Clear old reminder flags
        reminderDays.forEach(day => {
          if (day !== diffDays) {
            localStorage.removeItem(`reminder_shown_${day}`);
          }
        });
      }
    } else if (profile?.is_premium && !profile?.subscription_end) {
      // If premium but no end date, set to 30 days from subscription_start or now
      console.log('Premium user but no subscription_end date');
      const startDate = profile?.subscription_start ? new Date(profile.subscription_start) : new Date();
      const estimatedEnd = new Date(startDate);
      estimatedEnd.setDate(estimatedEnd.getDate() + 30);
      
      const today = new Date();
      const diffTime = estimatedEnd - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setDaysRemaining(diffDays > 0 ? diffDays : 0);
    }
  }, [profile]);

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  const handleRefreshProfile = async () => {
    if (refreshProfile) {
      await refreshProfile();
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
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                  <FiAward className="w-4 h-4" />
                  <span className="text-sm font-bold whitespace-nowrap">⭐ Premium Member</span>
                </div>
                
                {/* Subscription Countdown */}
                {daysRemaining !== null && daysRemaining > 0 && (
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-md ${
                    daysRemaining <= 3 
                      ? 'bg-red-500/30 backdrop-blur-sm border border-red-300/50' 
                      : daysRemaining <= 5
                      ? 'bg-yellow-500/30 backdrop-blur-sm border border-yellow-300/50'
                      : 'bg-white/20 backdrop-blur-sm border border-white/30'
                  }`}>
                    <FiClock className="w-4 h-4" />
                    <span className="text-sm font-semibold whitespace-nowrap">
                      {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                    </span>
                    {daysRemaining <= 3 && (
                      <FiAlertCircle className="w-4 h-4 animate-pulse" />
                    )}
                  </div>
                )}
                
                {daysRemaining !== null && daysRemaining <= 0 && (
                  <div className="flex items-center space-x-2 bg-red-500/40 backdrop-blur-sm px-4 py-2 rounded-full border border-red-300/50 shadow-md">
                    <FiAlertCircle className="w-4 h-4" />
                    <span className="text-sm font-bold whitespace-nowrap">Subscription Expired</span>
                  </div>
                )}
                
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
            <div className="flex items-center space-x-2">
              {profile?.is_premium && (
                <button className="text-sm text-blue-600 dark:text-emerald-400 hover:underline">
                  Manage
                </button>
              )}
              <button 
                onClick={handleRefreshProfile}
                className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                title="Refresh account status"
              >
                Refresh
              </button>
            </div>
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
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>
      {/* Subscription Reminder Modal */}
      <SubscriptionReminder
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        daysRemaining={daysRemaining}
      />
    </div>
  );
}
