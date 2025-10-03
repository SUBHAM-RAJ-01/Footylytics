import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiLock, FiTrendingUp, FiTarget, FiBarChart2, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Predictions() {
  const { profile, user, session } = useAuth();
  const [fixtures, setFixtures] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingFixtures, setLoadingFixtures] = useState(true);

  useEffect(() => {
    if (profile?.is_premium) {
      fetchUpcomingFixtures();
    }
  }, [profile]);

  const fetchUpcomingFixtures = async () => {
    try {
      // Fetch from multiple top leagues
      const leagueIds = ['2021', '2014', '2019', '2002']; // PL, LaLiga, Serie A, Bundesliga
      const promises = leagueIds.map(id => 
        axios.get(`${import.meta.env.VITE_API_URL}/matches/fixtures/${id}`).catch(() => ({ data: { matches: [] } }))
      );
      const results = await Promise.all(promises);
      const allMatches = results.flatMap(r => r.data.matches || []);
      
      // Filter upcoming matches (next 7 days)
      const upcoming = allMatches
        .filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED')
        .slice(0, 20);
      
      setFixtures(upcoming);
    } catch (error) {
      console.error('Failed to fetch fixtures:', error);
    } finally {
      setLoadingFixtures(false);
    }
  };

  const getPrediction = async (match) => {
    setSelectedMatch(match);
    setLoading(true);
    setPrediction(null);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/predictions/predict`,
        { match },
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
        }
      );
      setPrediction(data);
    } catch (error) {
      console.error('Prediction error:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      setPrediction({
        error: true,
        message: error.response?.data?.error || error.response?.data?.message || 'Failed to generate prediction. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile?.is_premium) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 shadow-xl"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiLock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Premium Feature</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
            Unlock AI-powered match predictions with detailed analysis and confidence scores
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-8 text-left">
            <div className="flex items-start space-x-3">
              <FiTrendingUp className="w-6 h-6 text-blue-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold">AI Analysis</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Powered by Google Gemini</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FiTarget className="w-6 h-6 text-blue-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold">Confidence Scores</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Data-driven predictions</p>
              </div>
            </div>
          </div>
          <Link
            to="/pricing"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-full font-semibold hover:shadow-xl transition-all text-lg"
          >
            Upgrade to Premium - ₹29/mo
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <FiTrendingUp className="text-blue-600 dark:text-emerald-400" />
            <span>AI Match Predictions</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Get AI-powered predictions for upcoming matches
          </p>
        </div>
        {fixtures.length > 0 && (
          <button
            onClick={fetchUpcomingFixtures}
            className="flex items-center space-x-1 px-3 py-2 md:px-4 md:py-2 bg-gray-200 dark:bg-slate-700 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors text-sm"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Match Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Select a Match</h2>
          {loadingFixtures ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-200 dark:bg-slate-800 rounded-xl h-24 animate-pulse"></div>
              ))}
            </div>
          ) : fixtures.length > 0 ? (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {fixtures.map(match => (
                <motion.button
                  key={match.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => getPrediction(match)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedMatch?.id === match.id
                      ? 'border-blue-600 dark:border-emerald-500 bg-blue-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {match.competition?.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(match.utcDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold">{match.homeTeam?.name}</p>
                    </div>
                    <div className="px-3 text-gray-400">vs</div>
                    <div className="flex-1 text-right">
                      <p className="font-semibold">{match.awayTeam?.name}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-slate-800 rounded-xl">
              <FiBarChart2 className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No upcoming matches found</p>
            </div>
          )}
        </div>

        {/* Prediction Result */}
        <div className="lg:sticky lg:top-6 h-fit">
          {!selectedMatch ? (
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-12 text-center border-2 border-dashed border-gray-300 dark:border-slate-600">
              <FiTarget className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Select a match to see AI prediction
              </p>
            </div>
          ) : loading ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg">Analyzing match...</span>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ) : prediction?.error ? (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400">{prediction.message}</p>
            </div>
          ) : prediction ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-xl"
            >
              {/* Powered by Gemini Badge */}
              <div className="flex items-center justify-center mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 px-3 py-1.5 rounded-full">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#gradient1)" />
                    <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="url(#gradient2)" />
                    <defs>
                      <linearGradient id="gradient1" x1="2" y1="2" x2="22" y2="12">
                        <stop offset="0%" stopColor="#4285F4" />
                        <stop offset="100%" stopColor="#9B72F2" />
                      </linearGradient>
                      <linearGradient id="gradient2" x1="2" y1="12" x2="22" y2="22">
                        <stop offset="0%" stopColor="#9B72F2" />
                        <stop offset="100%" stopColor="#F439A0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Powered by Gemini
                  </span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-4">AI Prediction</h3>
              
              {/* Prediction Result */}
              <div className="bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Predicted Winner</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    {prediction.prediction || 'Draw'}
                  </p>
                  {prediction.confidence && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Confidence</p>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-3 max-w-xs">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-emerald-600 h-3 rounded-full transition-all"
                            style={{ width: `${prediction.confidence}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-lg">{prediction.confidence}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Analysis */}
              {prediction.analysis && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Analysis</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {prediction.analysis}
                  </p>
                </div>
              )}

              {/* Key Factors */}
              {prediction.keyFactors && prediction.keyFactors.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Key Factors</h4>
                  <ul className="space-y-2">
                    {prediction.keyFactors.map((factor, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600 dark:text-emerald-400">•</span>
                        <span className="text-gray-700 dark:text-gray-300">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Predictions are for entertainment purposes only.
                </p>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
