import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiSearch, FiCalendar, FiTrendingUp, FiUsers, FiAward, FiActivity } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const popularTeams = [
  { id: 57, name: 'Arsenal FC', logo: 'https://crests.football-data.org/57.png', league: 'Premier League' },
  { id: 65, name: 'Manchester City FC', logo: 'https://crests.football-data.org/65.png', league: 'Premier League' },
  { id: 66, name: 'Manchester United FC', logo: 'https://crests.football-data.org/66.png', league: 'Premier League' },
  { id: 64, name: 'Liverpool FC', logo: 'https://crests.football-data.org/64.png', league: 'Premier League' },
  { id: 61, name: 'Chelsea FC', logo: 'https://crests.football-data.org/61.png', league: 'Premier League' },
  { id: 81, name: 'FC Barcelona', logo: 'https://crests.football-data.org/81.png', league: 'LaLiga' },
  { id: 86, name: 'Real Madrid CF', logo: 'https://crests.football-data.org/86.png', league: 'LaLiga' },
  { id: 5, name: 'FC Bayern München', logo: 'https://crests.football-data.org/5.png', league: 'Bundesliga' },
  { id: 98, name: 'AC Milan', logo: 'https://crests.football-data.org/98.png', league: 'Serie A' },
  { id: 109, name: 'Juventus FC', logo: 'https://crests.football-data.org/109.png', league: 'Serie A' },
];

export default function MyTeam() {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMatches, setTeamMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('favoriteTeam');
    if (saved) {
      setSelectedTeam(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamMatches();
    }
  }, [selectedTeam]);

  const fetchTeamMatches = async () => {
    setLoading(true);
    try {
      // Mock data for now - in production, fetch from API
      setTeamMatches([
        {
          id: 1,
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          opponent: 'Liverpool FC',
          venue: 'Home',
          competition: 'Premier League'
        },
        {
          id: 2,
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          opponent: 'Chelsea FC',
          venue: 'Away',
          competition: 'Premier League'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch team matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = popularTeams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectTeam = (team) => {
    setSelectedTeam(team);
    localStorage.setItem('favoriteTeam', JSON.stringify(team));
  };

  if (selectedTeam) {
    return (
      <div className="space-y-6">
        {/* Team Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-700 dark:to-emerald-700 rounded-2xl p-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full p-4 shadow-xl">
                <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{selectedTeam.name}</h1>
                <p className="text-lg opacity-90 flex items-center space-x-2">
                  <FiHeart className="w-5 h-5" />
                  <span>Your Favorite Team</span>
                </p>
                <p className="text-sm opacity-75 mt-1">{selectedTeam.league}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedTeam(null)}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors font-semibold"
            >
              Change Team
            </button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700"
          >
            <FiActivity className="w-8 h-8 text-blue-600 dark:text-emerald-400 mb-2" />
            <p className="text-2xl font-bold">15</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Matches Played</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700"
          >
            <FiAward className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
            <p className="text-2xl font-bold">10</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Wins</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700"
          >
            <FiTrendingUp className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mb-2" />
            <p className="text-2xl font-bold">3rd</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">League Position</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700"
          >
            <FiUsers className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
            <p className="text-2xl font-bold">32</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Goals Scored</p>
          </motion.div>
        </div>

        {/* Upcoming Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <FiCalendar className="text-blue-600 dark:text-emerald-400" />
              <span>Upcoming Fixtures</span>
            </h2>
            <Link
              to="/fixtures"
              className="text-sm text-blue-600 dark:text-emerald-400 hover:underline"
            >
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="bg-gray-200 dark:bg-slate-700 rounded-lg h-20 animate-pulse"></div>
              ))}
            </div>
          ) : teamMatches.length > 0 ? (
            <div className="space-y-4">
              {teamMatches.map(match => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{match.opponent}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{match.competition}</p>
                  </div>
                  <div className="text-center px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      match.venue === 'Home'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {match.venue}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(match.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FiCalendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming fixtures</p>
            </div>
          )}
        </motion.div>

        {/* Premium Features Teaser */}
        {!profile?.is_premium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-6 border-2 border-yellow-400/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Unlock Premium Team Features</h3>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li>• Detailed team statistics and analytics</li>
                  <li>• Player performance tracking</li>
                  <li>• Match predictions for your team</li>
                  <li>• Personalized notifications</li>
                </ul>
              </div>
              <Link
                to="/pricing"
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-xl transition-all whitespace-nowrap"
              >
                Upgrade Now
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700"
      >
        <div className="text-center mb-8">
          <FiHeart className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-3xl font-bold mb-2">Select Your Favorite Team</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Get personalized updates and follow your team's journey
          </p>
        </div>

        <div className="relative mb-6">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teams..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-full focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500"
          />
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTeams.map(team => (
            <motion.button
              key={team.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => selectTeam(team)}
              className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors border-2 border-transparent hover:border-blue-600 dark:hover:border-emerald-500"
            >
              <img src={team.logo} alt={team.name} className="w-16 h-16 mx-auto mb-3 object-contain" />
              <p className="font-semibold text-center text-sm">{team.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">{team.league}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
