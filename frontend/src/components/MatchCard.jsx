import { useState, useEffect } from 'react';
import { format, formatDistanceToNow, differenceInSeconds } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiCalendar, FiBell, FiBellOff } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  requestNotificationPermission, 
  scheduleNotification, 
  removeScheduledNotification,
  calculateNotificationTime 
} from '../utils/notifications';

export default function MatchCard({ match }) {
  const [countdown, setCountdown] = useState('');
  const [timeAgo, setTimeAgo] = useState('');
  const [isNotifying, setIsNotifying] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const { user } = useAuth();

  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isFinished = match.status === 'FINISHED';
  const isScheduled = match.status === 'SCHEDULED' || match.status === 'TIMED';
  
  const homeScore = match.score?.fullTime?.home ?? match.score?.halfTime?.home ?? '-';
  const awayScore = match.score?.fullTime?.away ?? match.score?.halfTime?.away ?? '-';
  
  const matchDate = match.utcDate ? new Date(match.utcDate) : null;
  const matchTime = matchDate ? formatInTimeZone(matchDate, 'Asia/Kolkata', 'hh:mm a') : '';
  const matchDay = matchDate ? format(matchDate, 'dd MMM yyyy') : '';
  const matchDayShort = matchDate ? format(matchDate, 'dd MMM') : '';

  // Check if match is recent (within last 24 hours)
  const isRecent = matchDate && isFinished && 
    differenceInSeconds(new Date(), matchDate) < 24 * 60 * 60;

  // Check notification status
  useEffect(() => {
    const checkNotificationStatus = async () => {
      if (!user || !isScheduled) return;
      
      try {
        const { data } = await axios.get(`https://footylytics.onrender.com/api/notifications/user/${user.id}`);
        const isSubscribed = data.notifications?.some(n => n.match_id === match.id.toString());
        setIsNotifying(isSubscribed);
      } catch (error) {
        console.error('Failed to check notification status:', error);
      }
    };

    checkNotificationStatus();
  }, [user, match.id, isScheduled]);

  // Update countdown/time ago
  useEffect(() => {
    if (!matchDate) return;

    const updateTime = () => {
      const now = new Date();
      const diff = differenceInSeconds(matchDate, now);

      if (isScheduled && diff > 0) {
        // Countdown for upcoming matches
        const days = Math.floor(diff / 86400);
        const hours = Math.floor((diff % 86400) / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        
        if (days > 0) {
          setCountdown(`${days}d ${hours}h`);
        } else if (hours > 0) {
          setCountdown(`${hours}h ${minutes}m`);
        } else {
          setCountdown(`${minutes}m`);
        }
      } else if (isFinished) {
        // Time ago for finished matches
        setTimeAgo(formatDistanceToNow(matchDate, { addSuffix: true }));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [matchDate, isScheduled, isFinished]);

  const handleNotificationToggle = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      alert('Please sign in to set match notifications');
      return;
    }

    setNotifyLoading(true);
    try {
      const matchData = {
        matchId: match.id.toString(),
        homeTeam: match.homeTeam?.name,
        awayTeam: match.awayTeam?.name,
        homeTeamCrest: match.homeTeam?.crest,
        awayTeamCrest: match.awayTeam?.crest,
        competition: match.competition?.name,
        matchTime: matchTime + ' IST',
        matchDate: matchDay
      };

      const { data } = await axios.post(`https://footylytics.onrender.com/api/notifications/toggle`, {
        userId: user.id,
        matchId: match.id.toString(),
        matchData
      });

      setIsNotifying(data.subscribed);

      // Handle push notifications for PWA
      if (data.subscribed && matchDate) {
        // Request permission if not already granted
        const hasPermission = await requestNotificationPermission();
        
        if (hasPermission) {
          // Calculate notification time (30 minutes before match)
          const notifyTime = calculateNotificationTime(matchDate);
          
          // Schedule the notification
          scheduleNotification(matchData, notifyTime);
          
          alert('✅ Notification set! You\'ll be notified 30 minutes before the match starts.');
        } else {
          alert('⚠️ Please enable notifications in your browser settings to receive match alerts.');
        }
      } else if (!data.subscribed) {
        // Remove scheduled notification
        removeScheduledNotification(match.id.toString());
      }
    } catch (error) {
      console.error('Failed to toggle notification:', error);
      alert('Failed to update notification. Please try again.');
    } finally {
      setNotifyLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white dark:bg-slate-800 rounded-xl p-5 border-2 transition-all cursor-pointer ${
        isLive 
          ? 'border-red-500 shadow-lg shadow-red-500/20' 
          : 'border-gray-200 dark:border-slate-700 hover:shadow-xl'
      }`}
    >
      {/* Competition & Status */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {match.competition?.name || 'Football'}
        </span>
        <div className="flex items-center space-x-2">
          {isScheduled && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNotificationToggle}
              disabled={notifyLoading}
              className={`p-2 rounded-full transition-all ${
                isNotifying
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
              title={user ? (isNotifying ? 'Notification enabled' : 'Get notified before match') : 'Sign in to enable notifications'}
            >
              {notifyLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : isNotifying ? (
                <FiBell className="w-4 h-4" />
              ) : (
                <FiBellOff className="w-4 h-4" />
              )}
            </motion.button>
          )}
          {isLive && (
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-red-500 rounded-full live-pulse"></span>
              <span className="text-red-500 font-bold text-sm">LIVE {match.minute}'</span>
            </div>
          )}
          {isFinished && (
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
              FT
            </span>
          )}
        </div>
      </div>

      {/* Teams */}
      <div className="space-y-4">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <img 
              src={match.homeTeam?.crest || 'https://via.placeholder.com/40'} 
              alt={match.homeTeam?.name}
              className="w-10 h-10 object-contain"
              loading="lazy"
              onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
            />
            <span className="font-semibold text-lg">{match.homeTeam?.name}</span>
          </div>
          <motion.div 
            className="text-3xl font-bold min-w-[40px] text-center"
            animate={isLive ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {homeScore}
          </motion.div>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <img 
              src={match.awayTeam?.crest || 'https://via.placeholder.com/40'} 
              alt={match.awayTeam?.name}
              className="w-10 h-10 object-contain"
              loading="lazy"
              onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
            />
            <span className="font-semibold text-lg">{match.awayTeam?.name}</span>
          </div>
          <motion.div 
            className="text-3xl font-bold min-w-[40px] text-center"
            animate={isLive ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {awayScore}
          </motion.div>
        </div>
      </div>

      {/* Time/Date/Countdown */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            {isScheduled ? (
              <>
                <FiClock className="w-4 h-4" />
                <span>{matchTime} IST</span>
              </>
            ) : (
              <>
                <FiCalendar className="w-4 h-4" />
                <span>{matchDayShort}</span>
              </>
            )}
          </div>
          
          {/* Countdown or Time Ago */}
          {isScheduled && countdown && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold"
            >
              Starts in {countdown}
            </motion.div>
          )}
          
          {isRecent && timeAgo && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-semibold"
            >
              {timeAgo}
            </motion.div>
          )}
        </div>
        
        {/* Full Date */}
        {matchDay && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            {matchDay}
          </div>
        )}
      </div>
    </motion.div>
  );
}
