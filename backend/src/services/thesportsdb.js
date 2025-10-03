import axios from 'axios';
import { logger } from '../utils/logger.js';

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

// League ID mapping for TheSportsDB
const LEAGUE_MAP = {
  '2001': '4480', // UEFA Champions League
  '2021': '4328', // Premier League
  '2014': '4335', // La Liga
  '2002': '4331', // Bundesliga
  '2019': '4332', // Serie A
  '2015': '4334', // Ligue 1
  '2146': '4481', // UEFA Europa League
  '2000': '4424'  // World Cup
};

// Convert TheSportsDB event to our format
const convertEvent = (event) => {
  const isFinished = event.strStatus === 'Match Finished' || event.intHomeScore !== null;
  const isLive = event.strStatus === 'In Play';
  
  // Get team badges - try multiple sources
  const homeCrest = event.strHomeTeamBadge || 
                    event.strThumb || 
                    `https://www.thesportsdb.com/images/media/team/badge/${event.idHomeTeam}.png` ||
                    'https://via.placeholder.com/40';
                    
  const awayCrest = event.strAwayTeamBadge || 
                    event.strThumb || 
                    `https://www.thesportsdb.com/images/media/team/badge/${event.idAwayTeam}.png` ||
                    'https://via.placeholder.com/40';
  
  return {
    id: event.idEvent,
    utcDate: `${event.dateEvent}T${event.strTime || '00:00:00'}Z`,
    status: isFinished ? 'FINISHED' : isLive ? 'IN_PLAY' : 'SCHEDULED',
    homeTeam: {
      id: event.idHomeTeam,
      name: event.strHomeTeam,
      crest: homeCrest
    },
    awayTeam: {
      id: event.idAwayTeam,
      name: event.strAwayTeam,
      crest: awayCrest
    },
    score: {
      fullTime: {
        home: event.intHomeScore,
        away: event.intAwayScore
      },
      halfTime: {
        home: null,
        away: null
      }
    },
    competition: {
      id: event.idLeague,
      name: event.strLeague
    }
  };
};

// Get today's matches
export const getLiveScores = async () => {
  try {
    logger.info('Fetching matches from TheSportsDB...');
    
    const today = new Date().toISOString().split('T')[0];
    const { data } = await axios.get(`${BASE_URL}/eventsday.php`, {
      params: {
        d: today,
        s: 'Soccer'
      }
    });

    const events = data.events || [];
    
    // Filter out old matches and only keep recent ones
    const currentYear = new Date().getFullYear();
    const recentMatches = events.filter(event => {
      const eventYear = new Date(event.dateEvent).getFullYear();
      return eventYear >= currentYear - 1; // Only matches from last year onwards
    });
    
    const matches = recentMatches.map(convertEvent);
    
    logger.info(`Fetched ${matches.length} matches for today (filtered from ${events.length})`);
    return { matches };
  } catch (error) {
    logger.error('Failed to fetch matches:', error.message);
    return { matches: [] };
  }
};

// Get fixtures for a specific league
export const getUpcomingFixtures = async (leagueId) => {
  try {
    const dbLeagueId = LEAGUE_MAP[leagueId] || leagueId;
    logger.info(`Fetching fixtures for league ${leagueId} (DB ID: ${dbLeagueId})`);

    // Get next 15 events
    const { data } = await axios.get(`${BASE_URL}/eventsnextleague.php`, {
      params: { id: dbLeagueId }
    });

    // Get last 15 events
    const { data: pastData } = await axios.get(`${BASE_URL}/eventspastleague.php`, {
      params: { id: dbLeagueId }
    });

    const upcoming = (data.events || []).map(convertEvent);
    const past = (pastData.events || []).slice(0, 10).map(convertEvent);
    
    // Filter out very old matches
    const currentYear = new Date().getFullYear();
    const filteredPast = past.filter(match => {
      const matchYear = new Date(match.utcDate).getFullYear();
      return matchYear >= currentYear - 1;
    });
    
    const matches = [...upcoming, ...filteredPast];
    
    logger.info(`Fetched ${matches.length} fixtures for league ${leagueId}`);
    return { matches };
  } catch (error) {
    logger.error(`Failed to fetch fixtures for league ${leagueId}:`, error.message);
    return { matches: [] };
  }
};

// Get league standings
export const getStandings = async (leagueId) => {
  try {
    const dbLeagueId = LEAGUE_MAP[leagueId] || leagueId;
    logger.info(`Fetching standings for league ${leagueId} (DB ID: ${dbLeagueId})`);

    const season = new Date().getFullYear();
    const { data } = await axios.get(`${BASE_URL}/lookuptable.php`, {
      params: {
        l: dbLeagueId,
        s: season
      }
    });

    if (!data.table || data.table.length === 0) {
      // Try previous season
      const { data: prevData } = await axios.get(`${BASE_URL}/lookuptable.php`, {
        params: {
          l: dbLeagueId,
          s: season - 1
        }
      });
      
      if (!prevData.table || prevData.table.length === 0) {
        return { standings: [] };
      }
      
      data.table = prevData.table;
    }

    const table = data.table.map(team => ({
      position: parseInt(team.intRank),
      team: {
        id: team.idTeam,
        name: team.strTeam,
        crest: team.strTeamBadge
      },
      playedGames: parseInt(team.intPlayed),
      won: parseInt(team.intWin),
      draw: parseInt(team.intDraw),
      lost: parseInt(team.intLoss),
      points: parseInt(team.intPoints),
      goalsFor: parseInt(team.intGoalsFor),
      goalsAgainst: parseInt(team.intGoalsAgainst),
      goalDifference: parseInt(team.intGoalDifference)
    }));

    logger.info(`Fetched standings for league ${leagueId}: ${table.length} teams`);
    return { 
      standings: [{
        table: table
      }]
    };
  } catch (error) {
    logger.error(`Failed to fetch standings for league ${leagueId}:`, error.message);
    return { standings: [] };
  }
};

export default {
  getLiveScores,
  getUpcomingFixtures,
  getStandings
};
