import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const leagueLogos = {
  '2001': 'https://crests.football-data.org/CL.png', // Champions League
  '2021': 'https://crests.football-data.org/PL.png', // Premier League
  '2014': 'https://crests.football-data.org/PD.png', // LaLiga
  '2002': 'https://crests.football-data.org/BL1.png', // Bundesliga
  '2019': 'https://crests.football-data.org/SA.png', // Serie A
  '2015': 'https://crests.football-data.org/FL1.png', // Ligue 1
  '2146': 'https://crests.football-data.org/EL.png', // Europa League
  '2000': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/2022_FIFA_World_Cup.svg/200px-2022_FIFA_World_Cup.svg.png', // World Cup
};

export default function LeagueButton({ league }) {
  return (
    <Link to={`/fixtures?league=${league.id}`}>
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white dark:bg-gradient-to-br dark:from-blue-700 dark:to-emerald-700 rounded-xl p-4 border-2 border-emerald-500 dark:border-emerald-500 hover:shadow-2xl transition-all shadow-lg h-full flex flex-col"
      >
        <div className="text-center flex-1 flex flex-col justify-center">
          <div className="mb-2 flex justify-center">
            <div className="bg-white dark:bg-white/10 rounded-lg p-2 shadow-md">
              <img 
                src={leagueLogos[league.id] || league.badge} 
                alt={league.name}
                className="w-10 h-10 object-contain"
                loading="lazy"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          </div>
          <p className="text-xs font-bold text-gray-800 dark:text-white line-clamp-2">
            {league.name}
          </p>
          {league.liveCount > 0 && (
            <div className="mt-2 flex items-center justify-center space-x-1">
              <span className="w-2 h-2 bg-red-500 rounded-full live-pulse"></span>
              <span className="text-xs text-red-500 font-semibold">
                {league.liveCount} Live
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
