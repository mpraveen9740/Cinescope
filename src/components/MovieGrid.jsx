import React from 'react';
import MovieCard from './MovieCard';
import { useWatchlist } from '../hooks/useMovieData';
import { useAuth } from '../context/AuthContext';

const MovieGrid = ({ movies, title, emptyMessage = 'No movies found' }) => {
  const { user } = useAuth();
  const { watchlist, toggleWatchlist } = useWatchlist(user?.id);

  if (!movies || movies.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">🎬</span>
        <p className="empty-msg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="movie-grid-section">
      {title && <h2 className="section-title">{title}</h2>}
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isInWatchlist={watchlist.includes(movie.id)}
            onWatchlistToggle={toggleWatchlist}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;
