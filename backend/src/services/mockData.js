// Mock data for development when API is not available

export const mockMatches = {
  matches: [
    {
      id: 1,
      utcDate: new Date().toISOString(),
      status: 'IN_PLAY',
      minute: 67,
      homeTeam: { id: 1, name: 'Manchester United', crest: 'https://crests.football-data.org/66.png' },
      awayTeam: { id: 2, name: 'Liverpool', crest: 'https://crests.football-data.org/64.png' },
      score: {
        fullTime: { home: null, away: null },
        halfTime: { home: 1, away: 1 }
      },
      competition: { id: 2021, name: 'Premier League' }
    },
    {
      id: 2,
      utcDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      status: 'SCHEDULED',
      homeTeam: { id: 3, name: 'Arsenal', crest: 'https://crests.football-data.org/57.png' },
      awayTeam: { id: 4, name: 'Chelsea', crest: 'https://crests.football-data.org/61.png' },
      score: {
        fullTime: { home: null, away: null },
        halfTime: { home: null, away: null }
      },
      competition: { id: 2021, name: 'Premier League' }
    },
    {
      id: 3,
      utcDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'FINISHED',
      homeTeam: { id: 5, name: 'Real Madrid', crest: 'https://crests.football-data.org/86.png' },
      awayTeam: { id: 6, name: 'Barcelona', crest: 'https://crests.football-data.org/81.png' },
      score: {
        fullTime: { home: 2, away: 1 },
        halfTime: { home: 1, away: 0 }
      },
      competition: { id: 2014, name: 'La Liga' }
    }
  ]
};

export const mockStandings = {
  standings: [
    {
      type: 'TOTAL',
      table: [
        {
          position: 1,
          team: { id: 1, name: 'Manchester City', crest: 'https://crests.football-data.org/65.png' },
          playedGames: 20,
          won: 15,
          draw: 3,
          lost: 2,
          points: 48,
          goalsFor: 45,
          goalsAgainst: 15,
          goalDifference: 30
        },
        {
          position: 2,
          team: { id: 2, name: 'Arsenal', crest: 'https://crests.football-data.org/57.png' },
          playedGames: 20,
          won: 14,
          draw: 4,
          lost: 2,
          points: 46,
          goalsFor: 42,
          goalsAgainst: 18,
          goalDifference: 24
        },
        {
          position: 3,
          team: { id: 3, name: 'Liverpool', crest: 'https://crests.football-data.org/64.png' },
          playedGames: 20,
          won: 13,
          draw: 5,
          lost: 2,
          points: 44,
          goalsFor: 40,
          goalsAgainst: 20,
          goalDifference: 20
        }
      ]
    }
  ]
};

export const mockTeam = {
  id: 1,
  name: 'Manchester United',
  shortName: 'Man United',
  tla: 'MUN',
  crest: 'https://crests.football-data.org/66.png',
  address: 'Sir Matt Busby Way Manchester M16 0RA',
  website: 'http://www.manutd.com',
  founded: 1878,
  clubColors: 'Red / White',
  venue: 'Old Trafford',
  squad: []
};
