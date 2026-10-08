import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, Star } from 'lucide-react';
import { DEMO_MOVIES } from '../data/movies';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../hooks/useMovieData';

const WatchlistPage = () => {
  const { user } = useAuth();
  const { watchlist, toggleWatchlist } = useWatchlist(user?.id);

  const watchlistMovies = DEMO_MOVIES.filter(m => watchlist.includes(m.id));

  if (!user) {
    return (
      <div className="watchlist-page container">
        <div className="auth-prompt-card">
          <div className="auth-prompt-icon">🔐</div>
          <h2>Sign In to Access Your Watchlist</h2>
          <p>Create a free account to save movies and access your watchlist on any device.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-primary btn-lg">Sign In</Link>
            <Link to="/signup" className="btn btn-outline btn-lg">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-page container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Bookmark size={28} className="section-icon" /> My Watchlist</h1>
          <p className="page-subtitle">{watchlistMovies.length} movie{watchlistMovies.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      {watchlistMovies.length === 0 ? (
        <div className="empty-state empty-state-lg">
          <div className="empty-icon-lg">🎬</div>
          <h3 className="empty-title">Your watchlist is empty</h3>
          <p className="empty-msg">Start adding movies you want to watch later!</p>
          <Link to="/discover" className="btn btn-primary btn-lg">Discover Movies</Link>
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlistMovies.map(movie => (
            <div key={movie.id} className="watchlist-card">
              <Link to={`/movie/${movie.id}`} className="watchlist-card-link">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="watchlist-poster"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450/1a1a2e/e11d48?text=' + encodeURIComponent(movie.title); }}
                />
                <div className="watchlist-info">
                  <h3 className="watchlist-title">{movie.title}</h3>
                  <div className="watchlist-meta">
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span>{movie.genres[0]}</span>
                    <span>•</span>
                    <span>{movie.runtime} min</span>
                  </div>
                  <div className="watchlist-rating">
                    <Star size={13} fill="#f59e0b" color="#f59e0b" />
                    <span>{movie.rating.toFixed(1)}</span>
                  </div>
                  <p className="watchlist-desc">{movie.description.slice(0, 120)}...</p>
                </div>
              </Link>
              <button
                className="watchlist-remove-btn"
                onClick={() => toggleWatchlist(movie.id)}
                aria-label="Remove from watchlist"
              >
                <Trash2 size={16} /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
