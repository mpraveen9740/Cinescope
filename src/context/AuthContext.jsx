import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// Demo user for hackathon mode (no Supabase)
const DEMO_USER = {
  id: 'demo-user-001',
  email: 'demo@cinescope.com',
  user_metadata: { full_name: 'Demo User' }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured) {
      // Real Supabase auth
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) fetchProfile(session.user.id);
        setLoading(false);
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) fetchProfile(session.user.id);
        else setProfile(null);
      });
      return () => subscription.unsubscribe();
    } else {
      // Demo mode — check localStorage
      const saved = localStorage.getItem('cinescope_demo_user');
      if (saved) {
        setUser(JSON.parse(saved));
        setProfile(JSON.parse(localStorage.getItem('cinescope_demo_profile') || 'null'));
      }
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (userId) => {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setProfile(data);
  };

  // ── Auth Methods ──────────────────────────────────────────────────────────
  const signUp = async ({ email, password, name }) => {
    if (!isSupabaseConfigured) {
      // Demo signup
      const demoUser = { ...DEMO_USER, email, user_metadata: { full_name: name } };
      const demoProfile = { id: demoUser.id, username: name, avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`, email };
      localStorage.setItem('cinescope_demo_user', JSON.stringify(demoUser));
      localStorage.setItem('cinescope_demo_profile', JSON.stringify(demoProfile));
      setUser(demoUser);
      setProfile(demoProfile);
      return { error: null };
    }
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (!error && data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, username: name, avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}` });
    }
    return { error };
  };

  const signIn = async ({ email, password }) => {
    if (!isSupabaseConfigured) {
      // Demo login — accept any credentials
      const savedUser = localStorage.getItem('cinescope_demo_user');
      const demoUser = savedUser ? JSON.parse(savedUser) : { ...DEMO_USER, email };
      const name = demoUser.user_metadata?.full_name || 'CineScope User';
      const demoProfile = { id: demoUser.id, username: name, avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`, email };
      localStorage.setItem('cinescope_demo_user', JSON.stringify(demoUser));
      localStorage.setItem('cinescope_demo_profile', JSON.stringify(demoProfile));
      setUser(demoUser);
      setProfile(demoProfile);
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('cinescope_demo_user');
      localStorage.removeItem('cinescope_demo_profile');
      setUser(null);
      setProfile(null);
      return;
    }
    await supabase.auth.signOut();
  };

  const displayName = profile?.username || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, displayName, avatarUrl, isDemo: !isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
};
