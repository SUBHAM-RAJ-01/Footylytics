// Avatar icons for users
export const avatarIcons = [
  '⚽', // Soccer ball
  '🏆', // Trophy
  '⭐', // Star
  '🎯', // Target
  '🔥', // Fire
  '⚡'  // Lightning
];

// Generate consistent avatar based on email
export const getAvatarForEmail = (email) => {
  if (!email) return avatarIcons[0];
  
  // Create a simple hash from email
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use hash to select avatar
  const index = Math.abs(hash) % avatarIcons.length;
  return avatarIcons[index];
};

// Get avatar color based on email
export const getAvatarColor = (email) => {
  if (!email) return 'from-blue-500 to-blue-600';
  
  const colors = [
    'from-blue-500 to-blue-600',
    'from-emerald-500 to-emerald-600',
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600'
  ];
  
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
