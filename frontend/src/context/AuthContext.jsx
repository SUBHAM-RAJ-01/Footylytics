import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { logAuthState } from '../utils/authDebug';

// Check if Supabase credentials are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project.supabase.co') {
  supabase = createClient(supabaseUrl, supabaseKey);
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      console.log('⚠️ Supabase not configured, running in demo mode');
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        // Clear all user-related state on sign out
        setProfile(null);
        // Clear any cached data
        localStorage.removeItem('user_profile');
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    if (!supabase) return;
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Creating new profile for user:', userId);
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: userId, is_premium: false }])
          .select()
          .single();
          
        if (insertError) {
          console.error('Error creating profile:', insertError);
          return;
        }
        
        console.log('New profile created:', newProfile);
        setProfile(newProfile);
        localStorage.setItem('user_profile', JSON.stringify(newProfile));
      } else if (error) {
        console.error('Error fetching profile:', error);
      } else {
        console.log('Profile fetched:', data);
        setProfile(data);
        localStorage.setItem('user_profile', JSON.stringify(data));
        logAuthState(user, data, 'Profile Fetched');
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const signIn = async (email, password) => {
    if (!supabase) return { error: { message: 'Authentication not configured' } };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email, password) => {
    if (!supabase) return { error: { message: 'Authentication not configured' } };
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          app_name: 'Footylytics'
        }
      }
    });
    return { error };
  };



  const resetPassword = async (email) => {
    if (!supabase) return { error: { message: 'Authentication not configured' } };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { error };
  };

  const signOut = async () => {
    if (!supabase) return;
    
    try {
      console.log('Signing out user...');
      
      // Clear local state first
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Clear localStorage
      localStorage.removeItem('user_profile');
      localStorage.removeItem('supabase.auth.token');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
      } else {
        console.log('Successfully signed out');
      }
      
      // Force reload to clear any cached state
      window.location.href = '/';
      
    } catch (error) {
      console.error('Error in signOut:', error);
    }
  };

  const signInWithOAuth = async (provider) => {
    if (!supabase) return { error: { message: 'Authentication not configured' } };
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    return { error };
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user,
      session,
      profile, 
      loading, 
      signIn, 
      signUp, 
      resetPassword, 
      signOut, 
      signInWithOAuth,
      fetchProfile,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
