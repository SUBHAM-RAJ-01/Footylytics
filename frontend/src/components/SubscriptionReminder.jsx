import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertCircle, FiClock, FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function SubscriptionReminder({ isOpen, onClose, daysRemaining }) {
  if (!isOpen) return null;

  const getUrgencyColor = () => {
    if (daysRemaining === 1) return 'from-red-500 to-orange-500';
    if (daysRemaining === 2) return 'from-orange-500 to-yellow-500';
    if (daysRemaining === 3) return 'from-yellow-500 to-amber-500';
    return 'from-blue-500 to-emerald-500';
  };

  const getUrgencyMessage = () => {
    if (daysRemaining === 1) return 'Your subscription expires tomorrow!';
    if (daysRemaining === 2) return 'Only 2 days left on your subscription!';
    if (daysRemaining === 3) return 'Your subscription expires in 3 days';
    return `${daysRemaining} days remaining on your subscription`;
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${getUrgencyColor()} p-6 text-white relative`}>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-3 mb-2">
                  <FiAlertCircle className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">Subscription Reminder</h2>
                </div>
                <p className="text-white/90">{getUrgencyMessage()}</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Countdown Display */}
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${getUrgencyColor()} text-white mb-4`}>
                    <div className="text-center">
                      <div className="text-4xl font-bold">{daysRemaining}</div>
                      <div className="text-xs uppercase">Day{daysRemaining !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Don't lose access to premium features!
                  </p>
                </div>

                {/* Features Reminder */}
                <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                  <p className="font-semibold mb-3 flex items-center space-x-2">
                    <FiZap className="w-4 h-4 text-yellow-500" />
                    <span>Premium Features You'll Lose:</span>
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-emerald-500 rounded-full"></span>
                      <span>AI-Powered Match Predictions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-emerald-500 rounded-full"></span>
                      <span>Advanced Analytics & Statistics</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-emerald-500 rounded-full"></span>
                      <span>Ad-Free Experience</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-emerald-500 rounded-full"></span>
                      <span>Priority Match Notifications</span>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/pricing"
                    onClick={onClose}
                    className={`w-full py-3 px-4 bg-gradient-to-r ${getUrgencyColor()} text-white rounded-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center space-x-2`}
                  >
                    <FiClock className="w-5 h-5" />
                    <span>Renew Subscription - ₹29/mo</span>
                  </Link>
                  
                  <button
                    onClick={onClose}
                    className="w-full py-3 px-4 border-2 border-gray-300 dark:border-slate-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Remind Me Later
                  </button>
                </div>

                {/* Fine Print */}
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Your subscription will automatically expire on the end date. Renew now to continue enjoying premium features.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
