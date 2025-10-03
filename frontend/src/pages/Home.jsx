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

  useEffect(() => {
    fetchTodayMatches();
    const interval = setInterval(fetchTodayMatches, 120000); // Refresh every 2 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchTodayMatches = async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/matches/live`);
      setMatches(data.matches || []);
    } catch (error) {
      console.error('Failed to fetch matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Mock data for demo when no real matches
  const getMockMatches = () => {
    const now = new Date();
    return [
      {
        id: 'mock-1',
        utcDate: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        status: 'TIMED',
        homeTeam: { 
          id: 66, 
          name: 'Manchester United', 
          crest: 'https://crests.football-data.org/66.png' 
        },
        awayTeam: { 
          id: 64, 
          name: 'Liverpool', 
          crest: 'https://crests.football-data.org/64.png' 
        },
        score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
        competition: { id: 2021, name: 'Premier League' }
      },
      {
        id: 'mock-2',
        utcDate: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        status: 'TIMED',
        homeTeam: { 
          id: 57, 
          name: 'Arsenal', 
          crest: 'https://crests.football-data.org/57.png' 
        },
        awayTeam: { 
          id: 61, 
          name: 'Chelsea', 
          crest: 'https://crests.football-data.org/61.png' 
        },
        score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
        competition: { id: 2021, name: 'Premier League' }
      },
      {
        id: 'mock-3',
        utcDate: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'FINISHED',
        homeTeam: { 
          id: 86, 
          name: 'Real Madrid', 
          crest: 'https://crests.football-data.org/86.png' 
        },
        awayTeam: { 
          id: 81, 
          name: 'Barcelona', 
          crest: 'https://crests.football-data.org/81.png' 
        },
        score: { fullTime: { home: 2, away: 1 }, halfTime: { home: 1, away: 0 } },
        competition: { id: 2014, name: 'La Liga' }
      },
      {
        id: 'mock-5',
        utcDate: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        status: 'TIMED',
        homeTeam: { 
          id: 98, 
          name: 'AC Milan', 
          crest: 'https://crests.football-data.org/98.png' 
        },
        awayTeam: { 
          id: 100, 
          name: 'Inter Milan', 
          crest: 'https://crests.football-data.org/100.png' 
        },
        score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
        competition: { id: 2001, name: 'Champions League' }
      },
      {
        id: 'mock-6',
        utcDate: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'TIMED',
        homeTeam: { 
          id: 5, 
          name: 'Bayern Munich', 
          crest: 'https://crests.football-data.org/5.png' 
        },
        awayTeam: { 
          id: 4, 
          name: 'Borussia Dortmund', 
          crest: 'https://crests.football-data.org/4.png' 
        },
        score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
        competition: { id: 2002, name: 'Bundesliga' }
      },
      {
        id: 'mock-4',
        utcDate: now.toISOString(),
        status: 'IN_PLAY',
        minute: 67,
        homeTeam: { 
          id: 65, 
          name: 'Manchester City', 
          crest: 'https://crests.football-data.org/65.png' 
        },
        awayTeam: { 
          id: 73, 
          name: 'Tottenham', 
          crest: 'https://crests.football-data.org/73.png' 
        },
        score: { fullTime: { home: null, away: null }, halfTime: { home: 1, away: 1 } },
        competition: { id: 2021, name: 'Premier League' }
      }
    ];
  };

  const liveMatches = matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
  const upcomingMatches = matches.filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED');
  
  // Recent matches (finished in last 24 hours)
  const recentMatches = matches.filter(m => {
    if (m.status !== 'FINISHED' || !m.utcDate) return false;
    const matchDate = new Date(m.utcDate);
    const hoursSince = (new Date() - matchDate) / (1000 * 60 * 60);
    return hoursSince <= 24;
  });
  
  const finishedMatches = matches.filter(m => m.status === 'FINISHED');

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
            <span className="text-2xl font-bold">{matches.length}</span>
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

      {/* Recent Results (Last 24 hours) */}
      {recentMatches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <span>Recent Results</span>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(Last 24 hours)</span>
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Upcoming Matches</h2>
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
          
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-200 dark:bg-slate-800 rounded-xl h-48 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* No Matches */}
      {!loading && matches.length === 0 && liveMatches.length === 0 && upcomingMatches.length === 0 && recentMatches.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-slate-800 rounded-xl">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No matches available</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Check back later for live scores and fixtures
          </p>
        </div>
      )}
    </div>
  );
}
