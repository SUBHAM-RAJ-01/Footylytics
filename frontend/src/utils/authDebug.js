// Authentication debugging utilities
export const logAuthState = (user, profile, context = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔐 Auth Debug - ${context}`);
    console.log('User:', user ? {
      id: user.id,
      email: user.email,
      created_at: user.created_at
    } : null);
    console.log('Profile:', profile ? {
      id: profile.id,
      is_premium: profile.is_premium,
      subscription_start: profile.subscription_start,
      subscription_end: profile.subscription_end
    } : null);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }
};

export const clearAuthCache = () => {
  localStorage.removeItem('user_profile');
  localStorage.removeItem('supabase.auth.token');
  console.log('🧹 Auth cache cleared');
};