import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import MatchCard from '../components/MatchCard';
import LeagueButton from '../components/LeagueButton';
import { FiRefreshCw } from 'react-icons/fi';

const topLeagues = [
  { id: '2001', name: 'Champions League', badge: '🏆', liveCount: 0 },
  { id: '2021', name: 'Premier League', badge: '🦁', liveCount: 0 },
  { id: '2014', name: 'La Liga', badge: '⚽', liveCount: 0 },
  { id: '2002', name: 'Bundesliga', badge: '🇩🇪', liveCount: 0 },
  { id: '2019', name: 'Serie A', badge: '🇮🇹', liveCount: 0 },
  { id: '2015', name: 'Ligue 1', badge: '🇫🇷', liveCount: 0 }
];

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('live'); // 'live' or 'recent'

  useEffect(() => {
    fetchTodayMatches();
    const interval = setInterval(fetchTodayMatches, 120000); // Refresh every 2 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchTodayMatches = async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      // Fetch matches from multiple top leagues
      const leagueIds = ['2021', '2014', '2001', '2002', '2019', '2015']; // PL, LaLiga, UCL, Bundesliga, Serie A, Ligue 1
      const promises = leagueIds.map(id => 
        axios.get(`https://footylytics.onrender.com/api/matches/fixtures/${id}`)
          .catch(() => ({ data: { matches: [] } }))
      );
      
      const results = await Promise.all(promises);
      const allMatches = results.flatMap(r => r.data.matches || []);
      
      // Filter to get only today's and recent matches
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      const relevantMatches = allMatches.filter(match => {
        if (!match.utcDate) return false;
        const matchDate = new Date(match.utcDate);
        return matchDate >= twoDaysAgo && matchDate <= tomorrow;
      });
      
      setMatches(relevantMatches);
    } catch (error) {
      console.error('Failed to fetch matches:', error);
      console.error('Error details:', error.response?.data || error.message);
      setMatches([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Count matches for today only (till 12 AM)
  const getTodayMatchCount = () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    
    return matches.filter(match => {
      if (!match.utcDate) return false;
      const matchDate = new Date(match.utcDate);
      return matchDate >= todayStart && matchDate <= todayEnd;
    }).length;
  };



  const liveMatches = matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
  const upcomingMatches = matches.filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED');
  
  // Recent matches (finished in last 2 days)
  const recentMatches = matches.filter(m => {
    if (m.status !== 'FINISHED' || !m.utcDate) return false;
    const matchDate = new Date(m.utcDate);
    const hoursSince = (new Date() - matchDate) / (1000 * 60 * 60);
    return hoursSince <= 48; // Last 2 days
  }).sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-700 dark:to-emerald-700 rounded-2xl p-8 text-white"
      >
        <h1 className="text-4xl font-bold mb-2">Welcome to Footylytics</h1>
        <p className="text-lg opacity-90">
          AI-powered football predictions and live scores
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-2xl font-bold">{getTodayMatchCount()}</span>
            <span className="text-sm ml-2">Matches Today</span>
          </div>
          {liveMatches.length > 0 && (
            <div className="bg-red-500/30 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center space-x-2">
              <span className="w-2 h-2 bg-white rounded-full live-pulse"></span>
              <span className="text-sm font-semibold">{liveMatches.length} Live Now</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Top Leagues */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Top Leagues</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topLeagues.map((league, index) => (
            <motion.div
              key={league.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <LeagueButton league={league} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live/Recent Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('live')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
              viewMode === 'live'
                ? 'bg-white dark:bg-slate-700 shadow-md'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {liveMatches.length > 0 && (
              <span className="w-2 h-2 bg-red-500 rounded-full live-pulse"></span>
            )}
            <span>Live & Upcoming</span>
            {liveMatches.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {liveMatches.length}
              </span>
            )}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('recent')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'recent'
                ? 'bg-white dark:bg-slate-700 shadow-md'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Recent Results
          </motion.button>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchTodayMatches(true)}
          disabled={refreshing}
          className="flex items-center space-x-1 px-3 py-2 md:px-4 md:py-2 bg-blue-600 dark:bg-emerald-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 text-sm"
        >
          <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </motion.button>
      </div>

      {/* Live & Upcoming View */}
      {viewMode === 'live' && (
        <>
          {/* Live Matches */}
          {liveMatches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full live-pulse"></span>
                  <span>Live Matches</span>
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {liveMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Matches */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Upcoming Matches</h2>
            </div>
            
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-gray-200 dark:bg-slate-800 rounded-xl h-48 animate-pulse"></div>
                ))}
              </div>
            ) : upcomingMatches.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-slate-800 rounded-xl">
                <p className="text-gray-500 dark:text-gray-400">No upcoming matches</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Recent Results View */}
      {viewMode === 'recent' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <span>Recent Results</span>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(Last 2 days)</span>
            </h2>
          </div>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-200 dark:bg-slate-800 rounded-xl h-48 animate-pulse"></div>
              ))}
            </div>
          ) : recentMatches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-slate-800 rounded-xl">
              <p className="text-gray-500 dark:text-gray-400">No recent results</p>
            </div>
          )}
        </div>
      )}


    </div>
  );
}
