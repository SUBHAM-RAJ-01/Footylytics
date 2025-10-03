import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiActivity, FiCalendar, FiBarChart2, FiTrendingUp, FiHeart, FiSettings, FiX, FiAward, FiZap, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getAvatarForEmail } from '../utils/avatars';
import SignOutConfirm from './SignOutConfirm';

const navItems = [
  { to: '/', icon: FiHome, label: 'Home' },
  { to: '/live', icon: FiActivity, label: 'Live Scores' },
  { to: '/fixtures', icon: FiCalendar, label: 'Fixtures' },
  { to: '/standings/2001', icon: FiBarChart2, label: 'Standings' },
  { to: '/predictions', icon: FiTrendingUp, label: 'Predictions' },
  { to: '/my-team', icon: FiHeart, label: 'My Team' },
  { to: '/settings', icon: FiSettings, label: 'Settings' }
];

export default function MobileMenu({ isOpen, onClose }) {
  const { user, profile, signOut } = useAuth();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const handleSignOut = async () => {
    setShowSignOutConfirm(false);
    onClose();
    await signOut();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-800 shadow-2xl z-50 lg:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <img src="/flogo.svg" alt="Footylytics" className="h-8 w-8" />
                <span className="text-xl font-bold">Footylytics</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* User Profile */}
            {user && (
              <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <NavLink
                  to="/settings"
                  onClick={onClose}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    profile?.is_premium
                      ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-400/50'
                      : 'bg-gray-50 dark:bg-slate-700'
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {getAvatarForEmail(user.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{user.email?.split('@')[0]}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                      {profile?.is_premium ? (
                        <>
                          <FiAward className="w-3 h-3" />
                          <span>Premium</span>
                        </>
                      ) : (
                        <span>Free Plan</span>
                      )}
                    </p>
                  </div>
                </NavLink>
              </div>
            )}

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-emerald-400'
                        : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-700 space-y-3">
              {!profile?.is_premium && (
                <NavLink
                  to="/pricing"
                  onClick={onClose}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all"
                >
                  <FiZap className="w-5 h-5" />
                  <span>Upgrade to Premium</span>
                </NavLink>
              )}
              
              {user && (
                <button
                  onClick={() => setShowSignOutConfirm(true)}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </motion.div>
          
          <SignOutConfirm 
            isOpen={showSignOutConfirm}
            onClose={() => setShowSignOutConfirm(false)}
            onConfirm={handleSignOut}
          />
        </>
      )}
    </AnimatePresence>
  );
}
