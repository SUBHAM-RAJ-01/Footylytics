import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiMinus, FiAward } from 'react-icons/fi';

const leagues = [
  { id: '2001', name: 'UEFA Champions League', logo: 'https://crests.football-data.org/CL.png' },
  { id: '2021', name: 'Premier League', logo: 'https://crests.football-data.org/PL.png' },
  { id: '2014', name: 'LaLiga', logo: 'https://crests.football-data.org/PD.png' },
  { id: '2002', name: 'Bundesliga', logo: 'https://crests.football-data.org/BL1.png' },
  { id: '2019', name: 'Serie A', logo: 'https://crests.football-data.org/SA.png' },
  { id: '2015', name: 'Ligue 1', logo: 'https://crests.football-data.org/FL1.png' },
  { id: '2146', name: 'UEFA Europa League', logo: 'https://crests.football-data.org/EL.png' },
  { id: '2000', name: 'FIFA World Cup', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/2022_FIFA_World_Cup.svg/200px-2022_FIFA_World_Cup.svg.png' }
];

export default function Standings() {
  const { leagueId } = useParams();
  const navigate = useNavigate();
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Default to Champions League (2001) if no leagueId
  const defaultLeagueId = leagueId || '2001';
  const currentLeague = leagues.find(l => l.id === defaultLeagueId) || leagues[0]; // UCL is index 0
  
  // Redirect to UCL if no league specified
  useEffect(() => {
    if (!leagueId) {
      navigate('/standings/2001', { replace: true });
    }
  }, [leagueId, navigate]);

  useEffect(() => {
    if (leagueId) {
      fetchStandings();
    }
  }, [leagueId]);

  const fetchStandings = async () => {
    setLoading(true);
    const idToFetch = leagueId || '2001';
    try {
      const { data } = await axios.get(`https://footylytics.onrender.com/api/leagues/${idToFetch}/standings`);
      setStandings(data.standings?.[0]?.table || []);
    } catch (error) {
      console.error('Failed to fetch standings:', error);
      setStandings([]);
    } finally {
      setLoading(false);
    }
  };

  const getPositionColor = (position) => {
    // Champions League & Europa League format (36 teams)
    if (defaultLeagueId === '2001' || defaultLeagueId === '2146') {
      if (position <= 8) return 'bg-green-500'; // Direct to Round of 16
      if (position <= 24) return 'bg-blue-500'; // Playoff round
      return 'bg-red-500'; // Elimination
    }
    // Regular league format
    if (position <= 4) return 'bg-green-500'; // Champions League
    if (position <= 6) return 'bg-blue-500'; // Europa League
    if (position >= standings.length - 2) return 'bg-red-500'; // Relegation
    return 'bg-gray-400';
  };

  const getPositionLabel = (position) => {
    // European competitions format
    if (defaultLeagueId === '2001' || defaultLeagueId === '2146') {
      if (position <= 8) return 'Round of 16';
      if (position <= 24) return 'Playoff';
      return 'Eliminated';
    }
    // Regular leagues
    if (position <= 4) return 'Champions League';
    if (position <= 6) return 'Europa League';
    if (position >= standings.length - 2) return 'Relegation';
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Header with League Switcher */}
      <div>
        <h1 className="text-3xl font-bold mb-4">League Standings</h1>
        
        {/* League Selector - Circular Logos */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {leagues.map(league => (
            <motion.button
              key={league.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(`/standings/${league.id}`)}
              className="flex flex-col items-center justify-center transition-all"
              title={league.name}
            >
              {/* Circular logo with border */}
              <div className={`w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center p-2 transition-all border-2 ${
                defaultLeagueId === league.id
                  ? 'border-blue-600 dark:border-emerald-500 shadow-xl'
                  : 'border-transparent hover:border-gray-300'
              }`}>
                <img 
                  src={league.logo} 
                  alt={league.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-xs mt-1.5 font-medium truncate w-full text-center">{league.name.split(' ')[0]}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-slate-800 rounded-lg h-16 animate-pulse"></div>
          ))}
        </div>
      ) : standings.length > 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-1 md:gap-2 p-3 md:p-4 bg-gray-50 dark:bg-slate-900 font-semibold text-xs md:text-sm border-b border-gray-200 dark:border-slate-700">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-4 md:col-span-5">Team</div>
            <div className="col-span-1 text-center hidden md:block">P</div>
            <div className="col-span-1 text-center">W</div>
            <div className="col-span-1 text-center">D</div>
            <div className="col-span-1 text-center">L</div>
            <div className="col-span-2 md:col-span-1 text-center">GD</div>
            <div className="col-span-1 text-center font-bold">Pts</div>
          </div>

          {/* Table Body */}
          {standings.map((team, index) => (
            <motion.div
              key={team.team.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="grid grid-cols-12 gap-1 md:gap-2 p-3 md:p-4 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              {/* Position */}
              <div className="col-span-1 flex items-center justify-center">
                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${getPositionColor(team.position)} text-white flex items-center justify-center font-bold text-xs md:text-sm`}>
                  {team.position}
                </div>
              </div>

              {/* Team */}
              <div className="col-span-4 md:col-span-5 flex items-center space-x-2 md:space-x-3">
                <img 
                  src={team.team.crest} 
                  alt={team.team.name}
                  className="w-6 h-6 md:w-8 md:h-8 object-contain flex-shrink-0"
                  loading="lazy"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <span className="font-semibold truncate text-xs md:text-base">{team.team.name}</span>
              </div>

              {/* Stats */}
              <div className="col-span-1 text-center hidden md:flex items-center justify-center text-gray-600 dark:text-gray-400">
                {team.playedGames}
              </div>
              <div className="col-span-1 text-center flex items-center justify-center text-green-600 dark:text-green-400 text-xs md:text-base font-semibold">
                {team.won}
              </div>
              <div className="col-span-1 text-center flex items-center justify-center text-gray-600 dark:text-gray-400 text-xs md:text-base font-semibold">
                {team.draw}
              </div>
              <div className="col-span-1 text-center flex items-center justify-center text-red-600 dark:text-red-400 text-xs md:text-base font-semibold">
                {team.lost}
              </div>
              <div className="col-span-2 md:col-span-1 text-center flex items-center justify-center font-medium text-xs md:text-base">
                {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
              </div>
              <div className="col-span-1 text-center flex items-center justify-center font-bold text-sm md:text-lg">
                {team.points}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-slate-800 rounded-2xl">
          <FiAward className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-xl font-medium">
            No standings available
          </p>
        </div>
      )}

      {/* Legend */}
      {standings.length > 0 && (
        <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
          <h3 className="font-semibold mb-3">Legend</h3>
          {(defaultLeagueId === '2001' || defaultLeagueId === '2146') ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Round of 16 (1-8)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span>Playoff (9-24)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span>Eliminated (25-36)</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Champions League</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span>Europa League</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span>Relegation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                <span>Mid-table</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
