import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import MatchCard from '../components/MatchCard';
import { FiRefreshCw, FiActivity, FiSearch, FiX } from 'react-icons/fi';

export default function LiveScores() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLiveScores();
    const interval = setInterval(() => {
      fetchLiveScores();
    }, 60000); // Refresh every minute for live scores
    return () => clearInterval(interval);
  }, []);

  const fetchLiveScores = async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/matches/live`);
      setMatches(data.matches || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch live scores:', error);
      setMatches([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter matches based on search query
  const filteredMatches = matches.filter(match => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      match.homeTeam?.name?.toLowerCase().includes(query) ||
      match.awayTeam?.name?.toLowerCase().includes(query) ||
      match.competition?.name?.toLowerCase().includes(query)
    );
  });

  const liveMatches = filteredMatches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
  const otherMatches = filteredMatches.filter(m => m.status !== 'IN_PLAY' && m.status !== 'PAUSED');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <FiActivity className="text-red-500" />
            <span>Live Scores</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Last updated: {lastUpdate.toLocaleTimeString('en-IN')} IST
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchLiveScores(true)}
          disabled={refreshing}
          className="flex items-center space-x-1 px-3 py-2 md:px-5 md:py-3 bg-blue-600 dark:bg-emerald-600 text-white rounded-full hover:opacity-90 disabled:opacity-50 shadow-lg text-sm md:text-base"
        >
          <FiRefreshCw className={`w-4 h-4 md:w-5 md:h-5 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline font-medium">Refresh</span>
        </motion.button>
      </div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-2xl mx-auto"
      >
        <div className="relative">
          <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by team name or competition..."
            className="w-full pl-14 pr-12 py-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 focus:border-transparent transition-all shadow-lg hover:shadow-xl"
          />
          {searchQuery && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 dark:bg-slate-700 rounded-full hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </motion.button>
          )}
        </div>
        {searchQuery && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center"
          >
            Found {filteredMatches.length} match{filteredMatches.length !== 1 ? 'es' : ''} for "{searchQuery}"
          </motion.p>
        )}
      </motion.div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-gray-200 dark:bg-slate-800 rounded-xl h-56 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          {/* Live Matches */}
          {liveMatches.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="w-3 h-3 bg-red-500 rounded-full live-pulse"></span>
                <h2 className="text-2xl font-bold">Live Now ({liveMatches.length})</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {liveMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          )}

          {/* Other Matches */}
          {otherMatches.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Today's Matches</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {otherMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          )}

          {/* No Matches */}
          {matches.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-gray-50 dark:bg-slate-800 rounded-2xl"
            >
              <FiActivity className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-xl font-medium">
                No live matches at the moment
              </p>
              <p className="text-gray-400 dark:text-gray-500 mt-2">
                Check back later for live scores
              </p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
