import axios from 'axios';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

// League ID mapping
const LEAGUE_MAP = {
  '2001': 2,   // UEFA Champions League
  '2021': 39,  // Premier League
  '2014': 140, // La Liga
  '2002': 78,  // Bundesliga
  '2019': 135, // Serie A
  '2015': 61,  // Ligue 1
  '2146': 3,   // UEFA Europa League
  '2000': 1    // World Cup
};

// Make API request
const makeRequest = async (endpoint, params = {}) => {
  try {
    if (!API_KEY) {
      throw new Error('API_FOOTBALL_KEY not configured');
    }

    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        'x-apisports-key': API_KEY
      },
      params: {
        ...params,
        timezone: 'Asia/Kolkata'
      }
    });

    if (response.data.errors && Object.keys(response.data.errors).length > 0) {
      throw new Error(JSON.stringify(response.data.errors));
    }

    return response.data.response;
  } catch (error) {
    logger.error(`API-Football error (${endpoint}):`, error.message);
    throw error;
  }
};

// Convert match to our format
const convertMatch = (fixture) => {
  return {
    id: fixture.fixture.id,
    utcDate: fixture.fixture.date,
    status: getMatchStatus(fixture.fixture.status.short),
    minute: fixture.fixture.status.elapsed,
    homeTeam: {
      id: fixture.teams.home.id,
      name: fixture.teams.home.name,
      crest: fixture.teams.home.logo
    },
    awayTeam: {
      id: fixture.teams.away.id,
      name: fixture.teams.away.name,
      crest: fixture.teams.away.logo
    },
    score: {
      fullTime: {
        home: fixture.goals.home,
        away: fixture.goals.away
      },
      halfTime: {
        home: fixture.score.halftime.home,
        away: fixture.score.halftime.away
      }
    },
    competition: {
      id: fixture.league.id,
      name: fixture.league.name,
      emblem: fixture.league.logo
    }
  };
};

// Convert status
const getMatchStatus = (status) => {
  const statusMap = {
    'TBD': 'SCHEDULED',
    'NS': 'SCHEDULED',
    '1H': 'IN_PLAY',
    'HT': 'PAUSED',
    '2H': 'IN_PLAY',
    'ET': 'IN_PLAY',
    'P': 'IN_PLAY',
    'FT': 'FINISHED',
    'AET': 'FINISHED',
    'PEN': 'FINISHED',
    'PST': 'POSTPONED',
    'CANC': 'CANCELLED',
    'ABD': 'CANCELLED',
    'AWD': 'FINISHED',
    'WO': 'FINISHED'
  };
  return statusMap[status] || 'SCHEDULED';
};

// Get today's matches
export const getLiveScores = async () => {
  try {
    logger.info('Fetching matches from API-Football...');
    
    const today = new Date().toISOString().split('T')[0];
    const fixtures = await makeRequest('/fixtures', { date: today });

    const matches = fixtures.map(convertMatch);
    
    logger.info(`Fetched ${matches.length} matches for today`);
    return { matches };
  } catch (error) {
    logger.error('Failed to fetch live scores:', error.message);
    throw error;
  }
};

// Get fixtures for a league
export const getUpcomingFixtures = async (leagueId) => {
  try {
    const apiLeagueId = LEAGUE_MAP[leagueId] || leagueId;
    logger.info(`Fetching fixtures for league ${leagueId} (API ID: ${apiLeagueId})`);

    const currentYear = new Date().getFullYear();
    const fixtures = await makeRequest('/fixtures', {
      league: apiLeagueId,
      season: currentYear,
      next: 50
    });

    const matches = fixtures.map(convertMatch);
    
    logger.info(`Fetched ${matches.length} fixtures`);
    return { matches };
  } catch (error) {
    logger.error(`Failed to fetch fixtures:`, error.message);
    throw error;
  }
};

// Get standings
export const getStandings = async (leagueId) => {
  try {
    const apiLeagueId = LEAGUE_MAP[leagueId] || leagueId;
    logger.info(`Fetching standings for league ${leagueId}`);

    const currentYear = new Date().getFullYear();
    const standings = await makeRequest('/standings', {
      league: apiLeagueId,
      season: currentYear
    });

    if (!standings || standings.length === 0) {
      return { standings: [] };
    }

    const table = standings[0].league.standings[0].map(team => ({
      position: team.rank,
      team: {
        id: team.team.id,
        name: team.team.name,
        crest: team.team.logo
      },
      playedGames: team.all.played,
      won: team.all.win,
      draw: team.all.draw,
      lost: team.all.lose,
      points: team.points,
      goalsFor: team.all.goals.for,
      goalsAgainst: team.all.goals.against,
      goalDifference: team.goalsDiff
    }));

    return { 
      standings: [{ table }]
    };
  } catch (error) {
    logger.error(`Failed to fetch standings:`, error.message);
    throw error;
  }
};

export default {
  getLiveScores,
  getUpcomingFixtures,
  getStandings
};
