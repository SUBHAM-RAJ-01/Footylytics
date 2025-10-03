import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiHeart,
  FiSearch,
  FiCalendar,
  FiUsers,
  FiAward,
  FiActivity,
  FiShield,
  FiTarget,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import * as flags from 'country-flag-icons/react/3x2';

// Helper function to get country code from nationality
const getCountryCode = (nationality) => {
  const countryMap = {
    'England': 'GB-ENG',
    'Scotland': 'GB-SCT',
    'Wales': 'GB-WLS',
    'Northern Ireland': 'GB-NIR',
    'Spain': 'ES',
    'Germany': 'DE',
    'France': 'FR',
    'Italy': 'IT',
    'Portugal': 'PT',
    'Brazil': 'BR',
    'Argentina': 'AR',
    'Netherlands': 'NL',
    'Belgium': 'BE',
    'Croatia': 'HR',
    'Denmark': 'DK',
    'Sweden': 'SE',
    'Norway': 'NO',
    'Poland': 'PL',
    'Austria': 'AT',
    'Switzerland': 'CH',
    'Czech Republic': 'CZ',
    'Serbia': 'RS',
    'Ukraine': 'UA',
    'Turkey': 'TR',
    'Greece': 'GR',
    'Romania': 'RO',
    'Slovakia': 'SK',
    'Hungary': 'HU',
    'Republic of Ireland': 'IE',
    'Iceland': 'IS',
    'Finland': 'FI',
    'Bulgaria': 'BG',
    'Slovenia': 'SI',
    'Albania': 'AL',
    'North Macedonia': 'MK',
    'Bosnia-Herzegovina': 'BA',
    'Montenegro': 'ME',
    'Japan': 'JP',
    'South Korea': 'KR',
    'Australia': 'AU',
    'United States': 'US',
    'Canada': 'CA',
    'Mexico': 'MX',
    'Uruguay': 'UY',
    'Colombia': 'CO',
    'Chile': 'CL',
    'Peru': 'PE',
    'Ecuador': 'EC',
    'Paraguay': 'PY',
    'Venezuela': 'VE',
    'Morocco': 'MA',
    'Senegal': 'SN',
    'Nigeria': 'NG',
    'Ghana': 'GH',
    'Cameroon': 'CM',
    'Ivory Coast': 'CI',
    'Algeria': 'DZ',
    'Tunisia': 'TN',
    'Egypt': 'EG',
    'South Africa': 'ZA',
  };
  
  return countryMap[nationality] || null;
};

// Helper function to get flag component
const getFlagComponent = (nationality) => {
  const code = getCountryCode(nationality);
  if (!code) return null;
  
  // Handle special UK countries
  if (code.startsWith('GB-')) {
    return flags.GB; // Use GB flag for all UK countries
  }
  
  const FlagComponent = flags[code];
  return FlagComponent || null;
};

const popularTeams = [
  {
    id: 57,
    name: "Arsenal FC",
    logo: "https://crests.football-data.org/57.png",
    league: "Premier League",
  },
  {
    id: 65,
    name: "Manchester City FC",
    logo: "https://crests.football-data.org/65.png",
    league: "Premier League",
  },
  {
    id: 66,
    name: "Manchester United FC",
    logo: "https://crests.football-data.org/66.png",
    league: "Premier League",
  },
  {
    id: 64,
    name: "Liverpool FC",
    logo: "https://crests.football-data.org/64.png",
    league: "Premier League",
  },
  {
    id: 61,
    name: "Chelsea FC",
    logo: "https://crests.football-data.org/61.png",
    league: "Premier League",
  },
  {
    id: 81,
    name: "FC Barcelona",
    logo: "https://crests.football-data.org/81.png",
    league: "LaLiga",
  },
  {
    id: 86,
    name: "Real Madrid CF",
    logo: "https://crests.football-data.org/86.png",
    league: "LaLiga",
  },
  {
    id: 5,
    name: "FC Bayern München",
    logo: "https://crests.football-data.org/5.png",
    league: "Bundesliga",
  },
  {
    id: 98,
    name: "AC Milan",
    logo: "https://crests.football-data.org/98.png",
    league: "Serie A",
  },
  {
    id: 109,
    name: "Juventus FC",
    logo: "https://crests.football-data.org/109.png",
    league: "Serie A",
  },
];

export default function MyTeam() {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMatches, setTeamMatches] = useState([]);
  const [teamInfo, setTeamInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('ALL');

  useEffect(() => {
    const saved = localStorage.getItem("favoriteTeam");
    if (saved) {
      setSelectedTeam(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamData();
    }
  }, [selectedTeam]);

  const fetchTeamData = async () => {
    if (!selectedTeam) return;
    
    setLoading(true);
    try {
      // Fetch team info and matches in parallel
      const [infoResponse, matchesResponse] = await Promise.all([
        axios.get(`https://footylytics.onrender.com/api/teams/${selectedTeam.id}`),
        axios.get(`https://footylytics.onrender.com/api/teams/${selectedTeam.id}/matches`)
      ]);
      
      console.log('Team Info:', infoResponse.data);
      console.log('Squad:', infoResponse.data.squad);
      
      setTeamInfo(infoResponse.data);
      setTeamMatches(matchesResponse.data.matches || []);
    } catch (error) {
      console.error("Failed to fetch team data:", error);
      setTeamInfo(null);
      setTeamMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = popularTeams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectTeam = (team) => {
    setSelectedTeam(team);
    localStorage.setItem("favoriteTeam", JSON.stringify(team));
  };

  if (selectedTeam) {
    return (
      <div className="space-y-6">
        {/* Team Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-700 dark:to-emerald-700 rounded-2xl p-4 sm:p-6 md:p-8 text-white"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left w-full sm:w-auto">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full p-3 sm:p-4 shadow-xl flex-shrink-0">
                <img
                  src={selectedTeam.logo}
                  alt={selectedTeam.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{selectedTeam.name}</h1>
                <p className="text-base sm:text-lg opacity-90 flex items-center justify-center sm:justify-start space-x-2">
                  <FiHeart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Your Favorite Team</span>
                </p>
                <p className="text-xs sm:text-sm opacity-75 mt-1">{selectedTeam.league}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedTeam(null)}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors font-semibold text-sm sm:text-base"
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
            <p className="text-2xl font-bold">
              {teamInfo?.runningCompetitions?.length || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Active Competitions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700"
          >
            <FiUsers className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
            <p className="text-2xl font-bold">
              {teamInfo?.squad?.length || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Squad Size</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700"
          >
            <FiCalendar className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mb-2" />
            <p className="text-2xl font-bold">
              {teamMatches.filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upcoming Matches
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700"
          >
            <FiAward className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
            <p className="text-2xl font-bold">
              {teamInfo?.founded || 'N/A'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Founded
            </p>
          </motion.div>
        </div>

        {/* Upcoming Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
              <FiCalendar className="text-blue-600 dark:text-emerald-400" />
              <span>Upcoming Fixtures</span>
            </h2>
            <Link
              to="/fixtures"
              className="text-sm text-blue-600 dark:text-emerald-400 hover:underline self-start sm:self-auto"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-200 dark:bg-slate-700 rounded-lg h-24 animate-pulse"
                ></div>
              ))}
            </div>
          ) : teamMatches.filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED').length > 0 ? (
            <div className="space-y-4">
              {teamMatches
                .filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED')
                .slice(0, 5)
                .map((match) => {
                  const isHome = match.homeTeam?.id === selectedTeam.id;
                  const opponent = isHome ? match.awayTeam : match.homeTeam;
                  
                  return (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <img
                          src={opponent?.crest}
                          alt={opponent?.name}
                          className="w-10 h-10 object-contain"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                        <div>
                          <p className="font-semibold">{opponent?.name || 'TBD'}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {match.competition?.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-center px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isHome
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {isHome ? 'Home' : 'Away'}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(match.utcDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(match.utcDate).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FiCalendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming fixtures</p>
            </div>
          )}
        </motion.div>

        {/* Squad Section */}
        {teamInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
                <FiUsers className="text-blue-600 dark:text-emerald-400" />
                <span>Squad</span>
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                {['ALL', 'Goalkeeper', 'Defence', 'Midfield', 'Offence'].map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setSelectedPosition(pos)}
                    className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      selectedPosition === pos
                        ? 'bg-blue-600 dark:bg-emerald-600 text-white'
                        : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {pos === 'ALL' ? 'All' : pos.replace('Defence', 'Def').replace('Midfield', 'Mid').replace('Offence', 'Att')}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-200 dark:bg-slate-700 rounded-lg h-24 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : !teamInfo?.squad || teamInfo.squad.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FiUsers className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Squad information not available</p>
                <p className="text-sm mt-2">This team's squad data is not provided by the API</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {teamInfo.squad
                  .filter(player => selectedPosition === 'ALL' || player.position === selectedPosition)
                  .map((player) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-all border border-gray-200 dark:border-slate-600"
                    >
                      <div className="flex items-start space-x-3">
                        {/* Player Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {player.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                        </div>
                        
                        {/* Player Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold truncate flex-1">{player.name}</p>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              player.position === 'Goalkeeper' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              player.position === 'Defence' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                              player.position === 'Midfield' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {player.position?.substring(0, 3).toUpperCase() || 'N/A'}
                            </span>
                            {player.nationality && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {player.nationality}
                              </span>
                            )}
                          </div>
                          {player.dateOfBirth && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Age: {new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear()}
                            </p>
                          )}
                        </div>

                        {/* Jersey Number & Flag */}
                        <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                          {/* Country Flag */}
                          {player.nationality && (() => {
                            const FlagComponent = getFlagComponent(player.nationality);
                            return FlagComponent ? (
                              <div className="w-8 h-6 rounded overflow-hidden shadow-sm" title={player.nationality}>
                                <FlagComponent className="w-full h-full object-cover" />
                              </div>
                            ) : null;
                          })()}
                          
                          {/* Jersey Number */}
                          {player.shirtNumber && (
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                              <span className="text-white font-bold text-sm">
                                {player.shirtNumber}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}

            {teamInfo.squad.filter(player => selectedPosition === 'ALL' || player.position === selectedPosition).length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FiUsers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No players found for this position</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Team Info Section */}
        {teamInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center space-x-2">
              <FiShield className="text-blue-600 dark:text-emerald-400" />
              <span>Team Information</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="font-semibold">{teamInfo.name}</p>
                </div>
                {teamInfo.shortName && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Short Name</p>
                    <p className="font-semibold">{teamInfo.shortName}</p>
                  </div>
                )}
                {teamInfo.tla && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Abbreviation</p>
                    <p className="font-semibold">{teamInfo.tla}</p>
                  </div>
                )}
                {teamInfo.founded && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Founded</p>
                    <p className="font-semibold">{teamInfo.founded}</p>
                  </div>
                )}
              </div>

              {/* Stadium & Colors */}
              <div className="space-y-4">
                {teamInfo.venue && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Stadium</p>
                    <p className="font-semibold">{teamInfo.venue}</p>
                  </div>
                )}
                {teamInfo.clubColors && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Club Colors</p>
                    <p className="font-semibold">{teamInfo.clubColors}</p>
                  </div>
                )}
                {teamInfo.website && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                    <a
                      href={teamInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-emerald-400 hover:underline font-semibold"
                    >
                      Visit Official Site
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Active Competitions */}
            {teamInfo.runningCompetitions && teamInfo.runningCompetitions.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Active Competitions</p>
                <div className="flex flex-wrap gap-2">
                  {teamInfo.runningCompetitions.map((comp) => (
                    <span
                      key={comp.id}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium flex items-center space-x-1"
                    >
                      <FiTarget className="w-3 h-3" />
                      <span>{comp.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Premium Features Teaser */}
        {!profile?.is_premium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-6 border-2 border-yellow-400/50"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  Unlock Premium Team Features
                </h3>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <li>• Detailed team statistics and analytics</li>
                  <li>• Player performance tracking</li>
                  <li>• Match predictions for your team</li>
                  <li>• Personalized notifications</li>
                </ul>
              </div>
              <Link
                to="/pricing"
                className="w-full sm:w-auto text-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-xl transition-all whitespace-nowrap text-sm sm:text-base"
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
          {filteredTeams.map((team) => (
            <motion.button
              key={team.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => selectTeam(team)}
              className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors border-2 border-transparent hover:border-blue-600 dark:hover:border-emerald-500"
            >
              <img
                src={team.logo}
                alt={team.name}
                className="w-16 h-16 mx-auto mb-3 object-contain"
              />
              <p className="font-semibold text-center text-sm">{team.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                {team.league}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
