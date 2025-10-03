// Notification Templates and Customization Utilities

// Notification types with templates
export const NOTIFICATION_TYPES = {
  MATCH_STARTING: 'match_starting',
  GOAL_SCORED: 'goal_scored',
  MATCH_FINISHED: 'match_finished',
  TEAM_NEWS: 'team_news',
  LEAGUE_UPDATE: 'league_update',
  PREDICTION_READY: 'prediction_ready',
  CUSTOM: 'custom'
};

// Emoji sets for different notification types
const EMOJIS = {
  football: ['⚽', '🏈', '🥅', '🏟️'],
  celebration: ['🎉', '🎊', '🥳', '🔥'],
  goal: ['🎯', '⚽', '🚀', '💥'],
  time: ['⏰', '⏱️', '🕐', '⌚'],
  trophy: ['🏆', '🥇', '👑', '🎖️'],
  alert: ['🚨', '📢', '🔔', '⚠️']
};

// Get random emoji from category
function getRandomEmoji(category) {
  const emojis = EMOJIS[category] || EMOJIS.football;
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// Generate notification content based on type
export function generateNotification(type, data) {
  const { homeTeam, awayTeam, score, player, minute, league, team } = data;
  
  switch (type) {
    case NOTIFICATION_TYPES.MATCH_STARTING:
      return {
        title: `${getRandomEmoji('football')} Match Starting Soon!`,
        body: `${homeTeam} vs ${awayTeam}\nKicks off in 30 minutes`,
        url: '/live-scores',
        tag: `match-starting-${homeTeam}-${awayTeam}`.toLowerCase().replace(/\s+/g, '-'),
        image: '/web/icon-512.png',
        actions: [
          { action: 'view', title: 'Watch Live', icon: '/web/icon-192.png' },
          { action: 'remind', title: 'Remind Me', icon: '/web/icon-192.png' }
        ]
      };

    case NOTIFICATION_TYPES.GOAL_SCORED:
      return {
        title: `${getRandomEmoji('goal')} GOAL!`,
        body: `${homeTeam} ${score?.home || 0}-${score?.away || 0} ${awayTeam}\n${player || 'Goal'} ${minute ? minute + '\'' : ''}`,
        url: '/live-scores',
        tag: `goal-${homeTeam}-${awayTeam}`.toLowerCase().replace(/\s+/g, '-'),
        image: '/web/icon-512.png',
        requireInteraction: true,
        actions: [
          { action: 'view', title: 'View Match', icon: '/web/icon-192.png' },
          { action: 'share', title: 'Share Goal', icon: '/web/icon-192.png' }
        ]
      };

    case NOTIFICATION_TYPES.MATCH_FINISHED:
      return {
        title: `${getRandomEmoji('trophy')} Full Time`,
        body: `${homeTeam} ${score?.home || 0}-${score?.away || 0} ${awayTeam}\nMatch finished`,
        url: '/live-scores',
        tag: `finished-${homeTeam}-${awayTeam}`.toLowerCase().replace(/\s+/g, '-'),
        image: '/web/icon-512.png',
        actions: [
          { action: 'view', title: 'View Result', icon: '/web/icon-192.png' },
          { action: 'stats', title: 'Match Stats', icon: '/web/icon-192.png' }
        ]
      };

    case NOTIFICATION_TYPES.TEAM_NEWS:
      return {
        title: `${getRandomEmoji('alert')} ${team} News`,
        body: data.news || 'Latest team update available',
        url: '/my-team',
        tag: `team-news-${team}`.toLowerCase().replace(/\s+/g, '-'),
        image: '/web/icon-512.png'
      };

    case NOTIFICATION_TYPES.LEAGUE_UPDATE:
      return {
        title: `${getRandomEmoji('trophy')} ${league} Update`,
        body: data.update || 'New league standings available',
        url: '/standings',
        tag: `league-${league}`.toLowerCase().replace(/\s+/g, '-'),
        image: '/web/icon-512.png'
      };

    case NOTIFICATION_TYPES.PREDICTION_READY:
      return {
        title: `${getRandomEmoji('football')} AI Prediction Ready`,
        body: `${homeTeam} vs ${awayTeam}\nNew prediction available`,
        url: '/predictions',
        tag: `prediction-${homeTeam}-${awayTeam}`.toLowerCase().replace(/\s+/g, '-'),
        image: '/web/icon-512.png',
        actions: [
          { action: 'view', title: 'View Prediction', icon: '/web/icon-192.png' },
          { action: 'compare', title: 'Compare Odds', icon: '/web/icon-192.png' }
        ]
      };

    default:
      return {
        title: data.title || `${getRandomEmoji('football')} Footylytics`,
        body: data.body || 'New update available!',
        url: data.url || '/live-scores',
        tag: data.tag || 'custom-notification',
        image: data.image || '/web/icon-512.png'
      };
  }
}

// Advanced notification customization
export function customizeNotification(baseNotification, options = {}) {
  const {
    addVibration = true,
    silent = false,
    requireInteraction = false,
    badge = '/web/icon-192.png',
    icon = '/web/icon-192.png',
    renotify = false,
    timestamp = Date.now()
  } = options;

  return {
    ...baseNotification,
    badge,
    icon,
    silent,
    requireInteraction,
    renotify,
    timestamp,
    vibrate: addVibration ? [200, 100, 200] : undefined,
    data: {
      ...baseNotification.data,
      timestamp,
      customized: true
    }
  };
}

// Notification scheduling utilities
export function scheduleNotification(notification, delayMinutes = 0) {
  const scheduleTime = Date.now() + (delayMinutes * 60 * 1000);
  
  return {
    ...notification,
    data: {
      ...notification.data,
      scheduledFor: scheduleTime,
      delayed: delayMinutes > 0
    }
  };
}

// Bulk notification generator for multiple matches
export function generateMatchNotifications(matches, type = NOTIFICATION_TYPES.MATCH_STARTING) {
  return matches.map(match => {
    const notification = generateNotification(type, {
      homeTeam: match.homeTeam?.name || match.homeTeam,
      awayTeam: match.awayTeam?.name || match.awayTeam,
      score: match.score,
      player: match.lastGoalScorer,
      minute: match.minute
    });
    
    return {
      ...notification,
      data: {
        ...notification.data,
        matchId: match.id,
        competition: match.competition?.name
      }
    };
  });
}

// Priority levels for notifications
export const PRIORITY_LEVELS = {
  LOW: { requireInteraction: false, silent: false },
  NORMAL: { requireInteraction: false, silent: false, vibrate: [200, 100, 200] },
  HIGH: { requireInteraction: true, silent: false, vibrate: [300, 100, 300, 100, 300] },
  URGENT: { requireInteraction: true, silent: false, vibrate: [500, 200, 500, 200, 500] }
};

export default {
  NOTIFICATION_TYPES,
  generateNotification,
  customizeNotification,
  scheduleNotification,
  generateMatchNotifications,
  PRIORITY_LEVELS
};