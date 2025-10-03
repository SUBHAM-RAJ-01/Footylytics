import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiCheck, FiX, FiSmartphone, FiClock, FiPlay } from 'react-icons/fi';
import {
  requestNotificationPermission,
  areNotificationsEnabled,
  showNotification,
  scheduleNotification,
  calculateNotificationTime
} from '../utils/notifications';

export default function NotificationTester() {
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [isSupported, setIsSupported] = useState(false);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    // Check initial state
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    setPermissionStatus(Notification.permission);
  }, []);

  const addTestResult = (test, success, message) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      test,
      success,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const requestPermission = async () => {
    try {
      const granted = await requestNotificationPermission();
      setPermissionStatus(Notification.permission);
      addTestResult(
        'Permission Request',
        granted,
        granted ? 'Notification permission granted!' : 'Permission denied or not supported'
      );
    } catch (error) {
      addTestResult('Permission Request', false, `Error: ${error.message}`);
    }
  };

  const testBasicNotification = () => {
    try {
      showNotification('🔔 Test Notification', {
        body: 'This is a basic test notification from Footylytics PWA',
        icon: '/web/icon-192.png',
        badge: '/web/icon-192.png',
        tag: 'test-basic'
      });
      addTestResult('Basic Notification', true, 'Basic notification sent successfully');
    } catch (error) {
      addTestResult('Basic Notification', false, `Error: ${error.message}`);
    }
  };

  const testMatchNotification = () => {
    try {
      showNotification('⚽ Match Starting Soon!', {
        body: 'Manchester United vs Liverpool\nKick-off in 30 minutes at 15:00',
        icon: '/web/icon-192.png',
        badge: '/web/icon-192.png',
        tag: 'test-match',
        data: { url: '/live-scores' },
        actions: [
          { action: 'view', title: 'View Match' },
          { action: 'close', title: 'Dismiss' }
        ],
        vibrate: [200, 100, 200]
      });
      addTestResult('Match Notification', true, 'Match notification with actions sent');
    } catch (error) {
      addTestResult('Match Notification', false, `Error: ${error.message}`);
    }
  };

  const testScheduledNotification = () => {
    try {
      const futureTime = Date.now() + 10000; // 10 seconds from now
      const mockMatch = {
        matchId: 'test-123',
        homeTeam: 'Test Team A',
        awayTeam: 'Test Team B',
        matchTime: '15:00',
        competition: 'Test League'
      };

      scheduleNotification(mockMatch, futureTime);
      addTestResult('Scheduled Notification', true, 'Notification scheduled for 10 seconds from now');
    } catch (error) {
      addTestResult('Scheduled Notification', false, `Error: ${error.message}`);
    }
  };

  const testScoreNotification = () => {
    try {
      showNotification('🎯 GOAL! Manchester United 2-1 Liverpool', {
        body: 'Premier League - 67th minute\nMarcus Rashford scores!',
        icon: '/web/icon-192.png',
        badge: '/web/icon-192.png',
        tag: 'test-score',
        requireInteraction: true,
        vibrate: [300, 100, 300, 100, 300]
      });
      addTestResult('Score Notification', true, 'Goal notification sent with vibration');
    } catch (error) {
      addTestResult('Score Notification', false, `Error: ${error.message}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">📱 PWA Notification Tester</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test mobile notifications for your PWA
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border-2 ${
            isSupported
              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
              : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
          }`}
        >
          <div className="flex items-center space-x-3">
            <FiSmartphone className={`w-6 h-6 ${isSupported ? 'text-green-600' : 'text-red-600'}`} />
            <div>
              <h3 className="font-semibold">Browser Support</h3>
              <p className={`text-sm ${isSupported ? 'text-green-600' : 'text-red-600'}`}>
                {isSupported ? 'Notifications & Service Worker supported' : 'Not supported in this browser'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-4 rounded-xl border-2 ${
            permissionStatus === 'granted'
              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
              : permissionStatus === 'denied'
              ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiBell className={`w-6 h-6 ${
                permissionStatus === 'granted' ? 'text-green-600' :
                permissionStatus === 'denied' ? 'text-red-600' : 'text-yellow-600'
              }`} />
              <div>
                <h3 className="font-semibold">Permission Status</h3>
                <p className={`text-sm capitalize ${
                  permissionStatus === 'granted' ? 'text-green-600' :
                  permissionStatus === 'denied' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {permissionStatus}
                </p>
              </div>
            </div>
            {permissionStatus !== 'granted' && (
              <button
                onClick={requestPermission}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Request
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Test Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700"
      >
        <h2 className="text-xl font-semibold mb-4">Notification Tests</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={testBasicNotification}
            disabled={!areNotificationsEnabled()}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiBell className="w-4 h-4" />
            <span>Basic</span>
          </button>

          <button
            onClick={testMatchNotification}
            disabled={!areNotificationsEnabled()}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiPlay className="w-4 h-4" />
            <span>Match</span>
          </button>

          <button
            onClick={testScheduledNotification}
            disabled={!areNotificationsEnabled()}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiClock className="w-4 h-4" />
            <span>Scheduled</span>
          </button>

          <button
            onClick={testScoreNotification}
            disabled={!areNotificationsEnabled()}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>⚽</span>
            <span>Goal</span>
          </button>
        </div>
      </motion.div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            <button
              onClick={clearResults}
              className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {testResults.map((result) => (
              <div
                key={result.id}
                className={`flex items-start space-x-3 p-3 rounded-lg ${
                  result.success
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-red-50 dark:bg-red-900/20'
                }`}
              >
                {result.success ? (
                  <FiCheck className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <FiX className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{result.test}</p>
                    <span className="text-xs text-gray-500">{result.timestamp}</span>
                  </div>
                  <p className={`text-sm ${
                    result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                  }`}>
                    {result.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
      >
        <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">📋 Testing Instructions</h3>
        <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <p>• <strong>Mobile Testing:</strong> Open this page on your mobile device</p>
          <p>• <strong>Install PWA:</strong> Add to home screen first for best results</p>
          <p>• <strong>Permission:</strong> Grant notification permission when prompted</p>
          <p>• <strong>Background:</strong> Test notifications while app is in background</p>
          <p>• <strong>Actions:</strong> Tap notification actions to test interaction</p>
          <p>• <strong>Vibration:</strong> Feel for vibration patterns on mobile</p>
        </div>
      </motion.div>
    </div>
  );
}