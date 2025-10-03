import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import MatchCard from "../components/MatchCard";
import { FiCalendar, FiFilter, FiSearch, FiX } from "react-icons/fi";

const leagues = [
  { id: "2001", name: "UEFA Champions League" },
  { id: "2021", name: "Premier League" },
  { id: "2014", name: "LaLiga" },
  { id: "2002", name: "Bundesliga" },
  { id: "2019", name: "Serie A" },
  { id: "2015", name: "Ligue 1" },
  { id: "2146", name: "UEFA Europa League" },
  { id: "2000", name: "FIFA World Cup" },
];

const leagueLogos = {
  2001: "https://crests.football-data.org/CL.png",
  2021: "https://crests.football-data.org/PL.png",
  2014: "https://crests.football-data.org/PD.png",
  2002: "https://crests.football-data.org/BL1.png",
  2019: "https://crests.football-data.org/SA.png",
  2015: "https://crests.football-data.org/FL1.png",
  2146: "https://crests.football-data.org/EL.png",
  2000: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/2022_FIFA_World_Cup.svg/200px-2022_FIFA_World_Cup.svg.png",
};

export default function Fixtures() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState(
    searchParams.get("league") || "all"
  );
  const [teamSearchQuery, setTeamSearchQuery] = useState("");

  // Filter fixtures based on team search
  const filteredFixtures = fixtures.filter((match) => {
    if (!teamSearchQuery) return true;
    const query = teamSearchQuery.toLowerCase();
    return (
      match.homeTeam?.name?.toLowerCase().includes(query) ||
      match.awayTeam?.name?.toLowerCase().includes(query) ||
      match.competition?.name?.toLowerCase().includes(query)
    );
  });

  // Update selected league when URL changes
  useEffect(() => {
    const leagueParam = searchParams.get("league");
    if (leagueParam) {
      setSelectedLeague(leagueParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchFixtures();
  }, [selectedLeague]);

  const fetchFixtures = async () => {
    setLoading(true);
    try {
      if (selectedLeague === "all") {
        // Fetch fixtures from multiple top leagues
        const leagueIds = ["2001", "2021", "2014", "2146", "2000"]; // UCL, PL, LaLiga, Europa, World Cup
        const promises = leagueIds.map((id) =>
          axios
            .get(`https://footylytics.onrender.com/api/matches/fixtures/${id}`)
            .catch(() => ({ data: { matches: [] } }))
        );
        const results = await Promise.all(promises);
        const allMatches = results.flatMap((r) => r.data.matches || []);
        setFixtures(allMatches);
      } else {
        const { data } = await axios.get(
          `https://footylytics.onrender.com/api/matches/fixtures/${selectedLeague}`
        );
        setFixtures(data.matches || []);
      }
    } catch (error) {
      console.error("Failed to fetch fixtures:", error);
      console.error("Error details:", error.response?.data || error.message);
      setFixtures([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter matches by date
  const now = new Date();
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

  const recentResults = filteredFixtures
    .filter((m) => {
      if (m.status !== "FINISHED") return false;
      const matchDate = m.utcDate ? new Date(m.utcDate) : null;
      return matchDate && matchDate >= fiveDaysAgo && matchDate <= now;
    })
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));

  const upcomingFixtures = filteredFixtures
    .filter((m) => {
      if (m.status !== "SCHEDULED" && m.status !== "TIMED") return false;
      const matchDate = m.utcDate ? new Date(m.utcDate) : null;
      return matchDate && matchDate >= now;
    })
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center space-x-3">
          <FiCalendar />
          <span>Upcoming Fixtures</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View upcoming matches across all leagues
        </p>
      </div>

      {/* Team Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-2xl mx-auto"
      >
        <div className="relative">
          <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={teamSearchQuery}
            onChange={(e) => setTeamSearchQuery(e.target.value)}
            placeholder="Search by team name or competition..."
            className="w-full pl-14 pr-12 py-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 focus:border-transparent transition-all shadow-lg hover:shadow-xl"
          />
          {teamSearchQuery && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTeamSearchQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 dark:bg-slate-700 rounded-full hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </motion.button>
          )}
        </div>
        {teamSearchQuery && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center"
          >
            Found {filteredFixtures.length} match
            {filteredFixtures.length !== 1 ? "es" : ""} for "{teamSearchQuery}"
          </motion.p>
        )}
      </motion.div>

      {/* League Filter */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Filter by League
        </h3>

        {/* League Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSelectedLeague("all");
              setSearchParams({});
              setTeamSearchQuery(""); // Clear search when changing league
            }}
            className="flex flex-col items-center justify-center transition-all"
            title="All Leagues"
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all border-2 ${
                selectedLeague === "all"
                  ? "bg-gradient-to-br from-blue-600 to-emerald-600 text-white border-blue-600 dark:border-emerald-500"
                  : "bg-white dark:bg-slate-700 border-transparent hover:border-gray-300 dark:hover:border-slate-600"
              }`}
            >
              <FiFilter className="w-6 h-6" />
            </div>
            <span className="text-xs mt-1.5 font-medium">All</span>
          </motion.button>

          {leagues.map((league) => (
            <motion.button
              key={league.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setSelectedLeague(league.id);
                setSearchParams({ league: league.id });
                setTeamSearchQuery(""); // Clear search when changing league
              }}
              className="flex flex-col items-center justify-center transition-all"
              title={league.name}
            >
              <div
                className={`w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center p-2 transition-all border-2 ${
                  selectedLeague === league.id
                    ? "border-blue-600 dark:border-emerald-500 shadow-xl"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={leagueLogos[league.id] || "/placeholder-league.png"}
                  alt={league.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-xs mt-1.5 font-medium truncate w-full text-center">
                {league.name.split(" ")[0]}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-slate-800 rounded-xl h-56 animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <>
          {/* Upcoming Fixtures Section - SHOW FIRST */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Upcoming Fixtures</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {upcomingFixtures.length} match
                {upcomingFixtures.length !== 1 ? "es" : ""}
              </span>
            </div>
            {upcomingFixtures.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingFixtures.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                <FiCalendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-xl font-medium">
                  No upcoming fixtures found
                </p>
              </div>
            )}
          </div>

          {/* Recent Results Section - SHOW AFTER */}
          {recentResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                  <span>Recent Results</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    (Last 5 days)
                  </span>
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {recentResults.length} match
                  {recentResults.length !== 1 ? "es" : ""}
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentResults.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          )}

          {/* No Results Message */}
          {recentResults.length === 0 && upcomingFixtures.length === 0 && (
            <div className="text-center py-20 bg-gray-50 dark:bg-slate-800 rounded-2xl">
              <FiCalendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-xl font-medium">
                No matches found
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
