import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Award } from 'lucide-react';
import { DEMO_MOVIES } from '../data/movies';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../hooks/useMovieData';
import MovieCard from '../components/MovieCard';
import RatingStars from '../components/RatingStars';

const TopRatedPage = () => {
  const { user } = useAuth();
  const { watchlist, toggleWatchlist } = useWatchlist(user?.id);
  const sorted = [...DEMO_MOVIES].sort((a, b) => b.rating - a.rating);
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const podiumColors = ['#f59e0b', '#9ca3af', '#cd7c3f'];
  const podiumLabels = ['🥇', '🥈', '🥉'];

  return (
    <div className="top-rated-page container">
      <div className="page-header">
        <h1 className="page-title">Top Rated</h1>
        <p className="page-subtitle">The highest-rated films as voted by our community</p>
      </div>

      {/* Podium - top 3 */}
      <section className="section">
        <div className="podium-grid">
          {/* 2nd place */}
          <Link to={`/movie/${top3[1].id}`} className="podium-card podium-2">
            <div className="podium-rank">{podiumLabels[1]}</div>
            <img src={top3[1].poster} alt={top3[1].title} className="podium-poster"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300/1a1a2e/9ca3af?text=' + encodeURIComponent(top3[1].title); }} />
            <h3 className="podium-title">{top3[1].title}</h3>
            <div className="podium-rating" style={{ color: podiumColors[1] }}>
              <Star size={16} fill="currentColor" color="currentColor" /> {top3[1].rating.toFixed(1)}
            </div>
          </Link>

          {/* 1st place */}
          <Link to={`/movie/${top3[0].id}`} className="podium-card podium-1">
            <div className="podium-crown">👑</div>
            <div className="podium-rank">{podiumLabels[0]}</div>
            <img src={top3[0].poster} alt={top3[0].title} className="podium-poster podium-poster-lg"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300/1a1a2e/f59e0b?text=' + encodeURIComponent(top3[0].title); }} />
            <h3 className="podium-title">{top3[0].title}</h3>
            <div className="podium-rating" style={{ color: podiumColors[0] }}>
              <Star size={18} fill="currentColor" color="currentColor" /> {top3[0].rating.toFixed(1)}
            </div>
          </Link>

          {/* 3rd place */}
          <Link to={`/movie/${top3[2].id}`} className="podium-card podium-3">
            <div className="podium-rank">{podiumLabels[2]}</div>
            <img src={top3[2].poster} alt={top3[2].title} className="podium-poster"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300/1a1a2e/cd7c3f?text=' + encodeURIComponent(top3[2].title); }} />
            <h3 className="podium-title">{top3[2].title}</h3>
            <div className="podium-rating" style={{ color: podiumColors[2] }}>
              <Star size={16} fill="currentColor" color="currentColor" /> {top3[2].rating.toFixed(1)}
            </div>
          </Link>
        </div>
      </section>

      {/* Rest of list */}
      <section className="section">
        <h2 className="section-title"><Award size={22} className="section-icon" /> Full Ranking</h2>
        <div className="top-rated-list">
          {sorted.map((movie, i) => (
            <Link key={movie.id} to={`/movie/${movie.id}`} className="top-rated-list-item">
              <span className="top-rated-num">{String(i + 1).padStart(2, '0')}</span>
              <img src={movie.poster} alt={movie.title} className="top-rated-list-poster"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/60x90/1a1a2e/e11d48?text=' + encodeURIComponent(movie.title[0]); }} />
              <div className="top-rated-list-info">
                <h4 className="top-rated-list-title">{movie.title}</h4>
                <div className="top-rated-list-meta">
                  <span>{movie.year}</span>
                  <span>•</span>
                  <span>{movie.genres.join(', ')}</span>
                  <span>•</span>
                  <span>{movie.runtime} min</span>
                </div>
              </div>
              <div className="top-rated-list-rating">
                <RatingStars rating={movie.rating} max={10} size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="section">
        <h2 className="section-title">Browse Top Rated</h2>
        <div className="movie-grid">
          {rest.map(movie => (
            <MovieCard key={movie.id} movie={movie}
              isInWatchlist={watchlist.includes(movie.id)} onWatchlistToggle={toggleWatchlist} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default TopRatedPage;
