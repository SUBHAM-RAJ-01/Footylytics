// Push Notification Utilities for PWA

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

// Check if notifications are supported and enabled
export const areNotificationsEnabled = () => {
  return (
    "Notification" in window &&
    Notification.permission === "granted" &&
    "serviceWorker" in navigator
  );
};

// Show a local notification
export const showNotification = (title, options = {}) => {
  if (!areNotificationsEnabled()) {
    console.log("Notifications not enabled");
    return;
  }

  const defaultOptions = {
    icon: "/flogo.svg",
    badge: "/flogo.svg",
    vibrate: [200, 100, 200],
    tag: "footylytics-notification",
    requireInteraction: false,
    ...options,
  };

  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    // Use service worker to show notification
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, defaultOptions);
    });
  } else {
    // Fallback to regular notification
    new Notification(title, defaultOptions);
  }
};

// Schedule a notification for a specific time
export const scheduleNotification = (matchData, notifyTime) => {
  const now = Date.now();
  const delay = notifyTime - now;

  if (delay <= 0) {
    console.log("Match time has passed or is too soon");
    return null;
  }

  // Store in localStorage for persistence
  const scheduledNotifications = JSON.parse(
    localStorage.getItem("scheduledNotifications") || "[]"
  );

  const notification = {
    id: matchData.matchId,
    matchData,
    notifyTime,
    scheduled: now,
  };

  scheduledNotifications.push(notification);
  localStorage.setItem(
    "scheduledNotifications",
    JSON.stringify(scheduledNotifications)
  );

  // Set timeout for notification
  const timeoutId = setTimeout(() => {
    showNotification(`⚽ Match Starting Soon!`, {
      body: `${matchData.homeTeam} vs ${matchData.awayTeam}\nKick-off in 30 minutes at ${matchData.matchTime}`,
      icon: "/flogo.svg",
      badge: "/flogo.svg",
      tag: `match-${matchData.matchId}`,
      data: {
        url: "/live-scores",
        matchId: matchData.matchId,
      },
      actions: [
        {
          action: "view",
          title: "View Match",
        },
        {
          action: "close",
          title: "Dismiss",
        },
      ],
    });

    // Remove from scheduled notifications
    removeScheduledNotification(matchData.matchId);
  }, delay);

  return timeoutId;
};

// Remove a scheduled notification
export const removeScheduledNotification = (matchId) => {
  const scheduledNotifications = JSON.parse(
    localStorage.getItem("scheduledNotifications") || "[]"
  );

  const filtered = scheduledNotifications.filter((n) => n.id !== matchId);
  localStorage.setItem("scheduledNotifications", JSON.stringify(filtered));
};

// Check and reschedule notifications on app load
export const checkScheduledNotifications = () => {
  const scheduledNotifications = JSON.parse(
    localStorage.getItem("scheduledNotifications") || "[]"
  );

  const now = Date.now();
  const validNotifications = [];

  scheduledNotifications.forEach((notification) => {
    const timeUntilNotification = notification.notifyTime - now;

    // If notification time hasn't passed and is within next 24 hours
    if (
      timeUntilNotification > 0 &&
      timeUntilNotification < 24 * 60 * 60 * 1000
    ) {
      validNotifications.push(notification);
      // Reschedule
      scheduleNotification(notification.matchData, notification.notifyTime);
    }
  });

  // Update localStorage with valid notifications only
  localStorage.setItem(
    "scheduledNotifications",
    JSON.stringify(validNotifications)
  );
};

// Calculate notification time (30 minutes before match)
export const calculateNotificationTime = (matchDate) => {
  const matchTime = new Date(matchDate).getTime();
  const thirtyMinutesBefore = matchTime - 30 * 60 * 1000; // 30 minutes in milliseconds
  return thirtyMinutesBefore;
};

// Send periodic match score updates
export const sendMatchScoreNotification = (matchData) => {
  if (!areNotificationsEnabled()) return;

  showNotification(
    `⚽ ${matchData.homeTeam} ${matchData.homeScore} - ${matchData.awayScore} ${matchData.awayTeam}`,
    {
      body: `${matchData.competition} - ${matchData.status}`,
      icon: "/flogo.svg",
      badge: "/flogo.svg",
      tag: `score-${matchData.matchId}`,
      data: {
        url: "/live-scores",
        matchId: matchData.matchId,
      },
    }
  );
};

// Send team score update notification
export const sendTeamScoreNotification = (teamName, matchData) => {
  if (!areNotificationsEnabled()) return;

  showNotification(`🎯 ${teamName} Update!`, {
    body: `${matchData.homeTeam} ${matchData.homeScore} - ${matchData.awayScore} ${matchData.awayTeam}\n${matchData.competition}`,
    icon: "/flogo.svg",
    badge: "/flogo.svg",
    tag: `team-${teamName}`,
    data: {
      url: "/my-team",
    },
  });
};

// Start periodic notifications for live matches (every 15 minutes)
export const startPeriodicNotifications = (matches) => {
  if (!areNotificationsEnabled()) return null;

  const liveMatches = matches.filter(
    (m) => m.status === "IN_PLAY" || m.status === "PAUSED"
  );

  if (liveMatches.length === 0) return null;

  // Send notification every 15 minutes for live matches
  const intervalId = setInterval(
    () => {
      liveMatches.forEach((match) => {
        sendMatchScoreNotification({
          matchId: match.id,
          homeTeam: match.homeTeam?.name,
          awayTeam: match.awayTeam?.name,
          homeScore:
            match.score?.fullTime?.home ?? match.score?.halfTime?.home ?? 0,
          awayScore:
            match.score?.fullTime?.away ?? match.score?.halfTime?.away ?? 0,
          competition: match.competition?.name,
          status: "Live",
        });
      });
    },
    15 * 60 * 1000
  ); // 15 minutes

  return intervalId;
};

// Stop periodic notifications
export const stopPeriodicNotifications = (intervalId) => {
  if (intervalId) {
    clearInterval(intervalId);
  }
};
