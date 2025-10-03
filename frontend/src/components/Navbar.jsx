import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FiSun,
  FiMoon,
  FiBell,
  FiMenu,
  FiZap,
  FiAward,
  FiX,
  FiCalendar,
  FiDownload,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { format } from "date-fns";

export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, refreshProfile } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [showPWAPopup, setShowPWAPopup] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch notifications when user is logged in
  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Refresh profile to ensure premium status is up to date
      if (refreshProfile) {
        refreshProfile();
      }
    } else {
      setNotifications([]);
    }
  }, [user, refreshProfile]);

  // PWA Install Prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Show PWA prompt on mobile/tablet
      const isMobileOrTablet = window.innerWidth <= 1024;
      if (isMobileOrTablet) {
        setShowPWAPrompt(true);

        // Show popup notification once per 10 minutes
        const lastShown = localStorage.getItem("pwaPopupLastShown");
        const now = Date.now();
        const tenMinutes = 10 * 60 * 1000;

        if (!lastShown || now - parseInt(lastShown) > tenMinutes) {
          setTimeout(() => {
            setShowPWAPopup(true);
            localStorage.setItem("pwaPopupLastShown", now.toString());
          }, 2000); // Show after 2 seconds
        }
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handlePWAInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPWAPrompt(false);
      setShowPWAPopup(false);
    }

    setDeferredPrompt(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showNotifications]);

  const fetchNotifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://footylytics.onrender.com/api/notifications/user/${user.id}`
      );
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = () => {
    if (user) {
      setShowNotifications(!showNotifications);
      if (!showNotifications) {
        fetchNotifications();
      }
    } else {
      setShowNotifications(!showNotifications);
    }
  };

  const handleRemoveNotification = async (notificationId, matchId) => {
    try {
      await axios.post(`https://footylytics.onrender.com/api/notifications/toggle`, {
        userId: user.id,
        matchId: matchId,
        matchData: {},
      });
      setNotifications(notifications.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Failed to remove notification:", error);
    }
  };

  return (
    <>
      {/* PWA Install Banner */}
      <AnimatePresence>
        {showPWAPrompt && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 px-4 text-center relative z-50"
          >
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center space-x-2 flex-1">
                <FiDownload className="w-4 h-4 flex-shrink-0" />
                <p className="text-xs sm:text-sm font-medium">
                  Experience Footylytics as a PWA! Use Chrome to install.
                </p>
              </div>
              <div className="flex items-center space-x-2 ml-2">
                <button
                  onClick={handlePWAInstall}
                  className="px-3 py-1 bg-white text-blue-600 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  Get Now
                </button>
                <button
                  onClick={() => setShowPWAPrompt(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Install Popup Notification */}
      <AnimatePresence>
        {showPWAPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-4 right-4 z-50 max-w-sm"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-4 sm:p-5">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
                  <FiDownload className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Install Footylytics
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Get the app experience! Install now for quick access and
                    offline support.
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePWAInstall}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
                    >
                      Install Now
                    </button>
                    <button
                      onClick={() => setShowPWAPopup(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Later
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowPWAPopup(false)}
                  className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img src="/flogo.svg" alt="Footylytics" className="h-10 w-auto" />
            </Link>

            <div className="flex items-center space-x-4">
              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === 'development' && user && (
                <div className="text-xs text-gray-500 hidden lg:block">
                  Premium: {profile?.is_premium ? 'Yes' : 'No'} | Profile: {profile ? 'Loaded' : 'Loading...'}
                </div>
              )}
              
              {/* Show upgrade button for non-premium users or guests */}
              {user && !profile?.is_premium && (
                <Link
                  to="/pricing"
                  className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:opacity-90 shadow-lg hover:shadow-xl transition-all"
                >
                  <FiZap className="w-4 h-4" />
                  <span>Upgrade - ₹29/mo</span>
                </Link>
              )}

              {/* Show premium badge for premium users */}
              {user && profile?.is_premium && (
                <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium">
                  <FiAward className="w-4 h-4" />
                  <span>Premium</span>
                </div>
              )}

              {/* Notifications Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleNotificationClick}
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <FiBell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="fixed top-20 left-[5%] -translate-x-1/2 sm:absolute sm:top-auto sm:left-auto sm:translate-x-0 sm:right-0 sm:mt-2 w-[90vw] sm:w-96 max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden z-[100]"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                        <h3 className="font-semibold text-lg">
                          Match Notifications
                        </h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                          <div className="p-8 text-center">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                              Loading...
                            </p>
                          </div>
                        ) : !user ? (
                          <div className="p-8 text-center">
                            <FiBell className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              Sign in to view notifications
                            </p>
                            <Link
                              to="/login"
                              onClick={() => setShowNotifications(false)}
                              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Sign In
                            </Link>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <FiBell className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              No match notifications
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              Click the bell icon on fixtures to get notified
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-200 dark:divide-slate-700">
                            {notifications.map((notification) => (
                              <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onRemove={handleRemoveNotification}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                          <Link
                            to="/fixtures"
                            onClick={() => setShowNotifications(false)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center space-x-1"
                          >
                            <FiCalendar className="w-4 h-4" />
                            <span>View All Fixtures</span>
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                {theme === "light" ? (
                  <FiMoon className="w-5 h-5" />
                ) : (
                  <FiSun className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <FiMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

// Notification Item Component
function NotificationItem({ notification, onRemove }) {
  const matchData = notification.match_data;
  const matchDate = matchData.matchDate ? new Date(matchData.matchDate) : null;
  const formattedDate = matchDate
    ? format(matchDate, "MMM dd, yyyy")
    : matchData.matchDate;

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
      <div className="flex items-start space-x-3">
        {/* Team Crests */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          <img
            src={matchData.homeTeamCrest}
            alt={matchData.homeTeam}
            className="w-8 h-8 object-contain"
            onError={(e) => (e.target.style.display = "none")}
          />
          <span className="text-xs text-gray-400">vs</span>
          <img
            src={matchData.awayTeamCrest}
            alt={matchData.awayTeam}
            className="w-8 h-8 object-contain"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>

        {/* Match Details */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {matchData.homeTeam} vs {matchData.awayTeam}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {matchData.competition}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {matchData.matchTime}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(notification.id, notification.match_id)}
          className="flex-shrink-0 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors group"
          title="Remove notification"
        >
          <FiX className="w-4 h-4 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
        </button>
      </div>
    </div>
  );
}
