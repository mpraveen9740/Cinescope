import { useState, useEffect, useCallback } from 'react';
import { DEMO_MOVIES, DEMO_REVIEWS } from '../data/movies';
import { supabase, isSupabaseConfigured } from '../services/supabase';

// ── Watchlist Hook ────────────────────────────────────────────────────────────
export const useWatchlist = (userId) => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (isSupabaseConfigured && userId) {
      supabase.from('watchlist').select('movie_id').eq('user_id', userId)
        .then(({ data }) => data && setWatchlist(data.map(r => r.movie_id)));
    } else {
      const saved = JSON.parse(localStorage.getItem('cinescope_watchlist') || '[]');
      setWatchlist(saved);
    }
  }, [userId]);

  const toggleWatchlist = useCallback(async (movieId) => {
    const isIn = watchlist.includes(movieId);
    if (isSupabaseConfigured && userId) {
      if (isIn) {
        await supabase.from('watchlist').delete().eq('user_id', userId).eq('movie_id', movieId);
      } else {
        await supabase.from('watchlist').insert({ user_id: userId, movie_id: movieId });
      }
    }
    const next = isIn ? watchlist.filter(id => id !== movieId) : [...watchlist, movieId];
    setWatchlist(next);
    if (!isSupabaseConfigured) localStorage.setItem('cinescope_watchlist', JSON.stringify(next));
  }, [watchlist, userId]);

  return { watchlist, toggleWatchlist };
};

// ── Reviews Hook ──────────────────────────────────────────────────────────────
export const useReviews = (movieId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('reviews').select('*, profiles(username, avatar_url)').eq('movie_id', movieId).order('created_at', { ascending: false });
      setReviews(data || []);
    } else {
      const saved = JSON.parse(localStorage.getItem(`cinescope_reviews_${movieId}`) || '[]');
      const defaults = DEMO_REVIEWS.filter(r => r.movieId === movieId);
      // Merge, avoiding duplicates by id
      const merged = [...saved, ...defaults.filter(d => !saved.find(s => s.id === d.id))];
      setReviews(merged);
    }
    setLoading(false);
  }, [movieId]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const addReview = async (review) => {
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('reviews').insert(review).select().single();
      setReviews(prev => [data, ...prev]);
    } else {
      const newReview = { ...review, id: Date.now(), date: new Date().toISOString().split('T')[0], likes: 0, likedByUser: false };
      const saved = JSON.parse(localStorage.getItem(`cinescope_reviews_${movieId}`) || '[]');
      const updated = [newReview, ...saved];
      localStorage.setItem(`cinescope_reviews_${movieId}`, JSON.stringify(updated));
      setReviews(prev => [newReview, ...prev]);
    }
  };

  const deleteReview = async (reviewId) => {
    if (isSupabaseConfigured) {
      await supabase.from('reviews').delete().eq('id', reviewId);
    } else {
      const saved = JSON.parse(localStorage.getItem(`cinescope_reviews_${movieId}`) || '[]');
      const updated = saved.filter(r => r.id !== reviewId);
      localStorage.setItem(`cinescope_reviews_${movieId}`, JSON.stringify(updated));
    }
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const toggleLike = (reviewId) => {
    setReviews(prev => prev.map(r => {
      if (r.id !== reviewId) return r;
      const liked = !r.likedByUser;
      return { ...r, likedByUser: liked, likes: (r.likes || 0) + (liked ? 1 : -1) };
    }));
  };

  return { reviews, loading, addReview, deleteReview, toggleLike, refresh: loadReviews };
};

// ── Movies Hook ───────────────────────────────────────────────────────────────
export const useMovies = () => {
  const [movies] = useState(DEMO_MOVIES);

  const getMovie = (id) => movies.find(m => m.id === parseInt(id));
  const searchMovies = (query) => movies.filter(m =>
    m.title.toLowerCase().includes(query.toLowerCase()) ||
    m.genres.some(g => g.toLowerCase().includes(query.toLowerCase()))
  );
  const getByGenre = (genre) => genre === 'All' ? movies : movies.filter(m => m.genres.includes(genre));
  const getTrending = () => [...movies].sort((a, b) => b.popularity - a.popularity).slice(0, 10);
  const getTopRated = () => [...movies].sort((a, b) => b.rating - a.rating).slice(0, 10);

  return { movies, getMovie, searchMovies, getByGenre, getTrending, getTopRated };
};
