import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, BookmarkPlus, BookmarkCheck, Image } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MovieCard = ({ movie, onWatchlistToggle, isInWatchlist, size = 'md' }) => {
  const { user } = useAuth();
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    onWatchlistToggle?.(movie.id);
  };

  const posterClass = size === 'sm' ? 'movie-card-sm' : size === 'lg' ? 'movie-card-lg' : 'movie-card';

  return (
    <Link to={`/movie/${movie.id}`} className={`${posterClass} movie-card-link`}>
      <div className="movie-card-inner">
        {/* Poster */}
        <div className="movie-poster-wrap">
          {!imgLoaded && !imgError && <div className="skeleton" style={{ position: 'absolute', inset: 0, borderRadius: '12px 12px 0 0' }} />}
          {!imgError ? (
            <img
              src={movie.poster}
              alt={movie.title}
              className="movie-poster-img"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
            />
          ) : (
            <div className="movie-poster-fallback">
              <Image size={48} color="#4b5563" />
              <span>{movie.title}</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="movie-poster-overlay" />

          {/* Rating badge */}
          <div className="movie-rating-badge">
            <Star size={12} fill="#f59e0b" color="#f59e0b" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>

          {/* Watchlist btn */}
          <button className={`watchlist-btn ${isInWatchlist ? 'active' : ''}`} onClick={handleWatchlist} aria-label="Toggle watchlist">
            {isInWatchlist ? <BookmarkCheck size={16} /> : <BookmarkPlus size={16} />}
          </button>
        </div>

        {/* Info */}
        <div className="movie-card-info">
          <h3 className="movie-card-title">{movie.title}</h3>
          <div className="movie-card-meta">
            <span className="movie-year">{movie.year}</span>
            <span className="movie-genre">{movie.genres?.[0]}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
