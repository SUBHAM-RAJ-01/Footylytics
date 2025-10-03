import axios from 'axios';
import CachedData from '../models/CachedData.js';
import { logger } from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

// Using Football-Data.org - Free tier: 10 requests/minute
const API_KEY = process.env.FOOTBALL_API_KEY || 'demo';
const BASE_URL = 'https://api.football-data.org/v4';

// In-memory cache as fallback
const memoryCache = new Map();

const apiHeaders = {
  'X-Auth-Token': API_KEY
};

class SportsDBService {
  async fetchWithCache(endpoint, cacheKey, cacheType, ttl) {
    try {
      // Try MongoDB cache first
      try {
        const cached = await CachedData.findOne({ key: cacheKey });
        if (cached && this.isCacheValid(cached, ttl)) {
          logger.debug(`Cache hit (DB): ${cacheKey}`);
          return cached.data;
        }
      } catch (dbError) {
        // MongoDB not available, check memory cache
        const memCached = memoryCache.get(cacheKey);
        if (memCached && this.isCacheValid(memCached, ttl)) {
          logger.debug(`Cache hit (memory): ${cacheKey}`);
          return memCached.data;
        }
      }

      logger.debug(`Cache miss: ${cacheKey}, fetching from API`);
      const url = `${BASE_URL}/${endpoint}`;
      logger.info(`Fetching: ${url}`);
      
      const response = await axios.get(url, { headers: apiHeaders });
      
      // Try to save to MongoDB
      try {
        await CachedData.findOneAndUpdate(
          { key: cacheKey },
          { key: cacheKey, data: response.data, type: cacheType, createdAt: new Date() },
          { upsert: true, new: true }
        );
      } catch (dbError) {
        // Save to memory cache as fallback
        memoryCache.set(cacheKey, { data: response.data, createdAt: new Date() });
        logger.debug(`Saved to memory cache: ${cacheKey}`);
      }

      return response.data;
    } catch (error) {
      logger.error(`SportsDB API error: ${error.message}`);
      
      // Try to return stale cache
      try {
        const cached = await CachedData.findOne({ key: cacheKey });
        if (cached) {
          logger.warn(`Returning stale cache for: ${cacheKey}`);
          return cached.data;
        }
      } catch (dbError) {
        const memCached = memoryCache.get(cacheKey);
        if (memCached) {
          logger.warn(`Returning stale memory cache for: ${cacheKey}`);
          return memCached.data;
        }
      }
      
      throw error;
    }
  }

  isCacheValid(cached, ttl) {
    const age = (Date.now() - cached.createdAt.getTime()) / 1000;
    return age < ttl;
  }

  async getLiveScores() {
    // Get today's matches (Football-Data doesn't have live endpoint in free tier)
    const today = new Date().toISOString().split('T')[0];
    return this.fetchWithCache(
      `matches?dateFrom=${today}&dateTo=${today}`,
      `matches_${today}`,
      'live',
      parseInt(process.env.CACHE_TTL_LIVE_MATCH) || 60
    );
  }

  async getTodayMatches() {
    const today = new Date().toISOString().split('T')[0];
    return this.fetchWithCache(
      `matches?dateFrom=${today}&dateTo=${today}`,
      `matches_${today}`,
      'fixtures',
      300
    );
  }

  async getLeagueStandings(leagueId) {
    return this.fetchWithCache(
      `competitions/${leagueId}/standings`,
      `standings_${leagueId}`,
      'standings',
      parseInt(process.env.CACHE_TTL_STANDINGS) || 3600
    );
  }

  async getTeamInfo(teamId) {
    return this.fetchWithCache(
      `teams/${teamId}`,
      `team_${teamId}`,
      'team',
      parseInt(process.env.CACHE_TTL_TEAM_INFO) || 86400
    );
  }

  async getUpcomingFixtures(leagueId) {
    // Fetch matches from 5 days ago to 14 days ahead
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const twoWeeksAhead = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return this.fetchWithCache(
      `competitions/${leagueId}/matches?dateFrom=${fiveDaysAgo}&dateTo=${twoWeeksAhead}`,
      `fixtures_${leagueId}`,
      'fixtures',
      parseInt(process.env.CACHE_TTL_FIXTURES) || 1800
    );
  }

  async getTeamLastMatches(teamId) {
    // Fetch all matches (past and future) for the team
    return this.fetchWithCache(
      `teams/${teamId}/matches`,
      `team_matches_${teamId}`,
      'other',
      1800
    );
  }

  async searchTeams(query) {
    try {
      // Football-Data doesn't have search, return empty
      logger.warn('Search not available in free tier');
      return { teams: [] };
    } catch (error) {
      logger.error(`Search teams error: ${error.message}`);
      return { teams: [] };
    }
  }

  async getLeagueTeams(leagueId) {
    return this.fetchWithCache(
      `competitions/${leagueId}/teams`,
      `league_teams_${leagueId}`,
      'other',
      86400
    );
  }

  async getH2H(team1Id, team2Id) {
    return this.fetchWithCache(
      `teams/${team1Id}/matches?limit=10`,
      `h2h_${team1Id}_${team2Id}`,
      'other',
      86400
    );
  }
}

export default new SportsDBService();
