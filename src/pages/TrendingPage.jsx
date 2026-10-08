import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Flame, TrendingUp, Award } from 'lucide-react';
import { DEMO_MOVIES } from '../data/movies';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../hooks/useMovieData';
import MovieCard from '../components/MovieCard';

const RankNumber = ({ n }) => (
  <span className="rank-number">{String(n).padStart(2, '0')}</span>
);

const TrendingPage = () => {
  const { user } = useAuth();
  const { watchlist, toggleWatchlist } = useWatchlist(user?.id);

  const trendingToday = [...DEMO_MOVIES].sort((a, b) => b.popularity - a.popularity).slice(0, 5);
  const rising = [...DEMO_MOVIES].sort((a, b) => b.year - a.year).slice(0, 5);
  const topRatedWeek = [...DEMO_MOVIES].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const RankedList = ({ movies, accentColor }) => (
    <div className="ranked-list">
      {movies.map((movie, i) => (
        <Link key={movie.id} to={`/movie/${movie.id}`} className="ranked-item">
          <RankNumber n={i + 1} />
          <img src={movie.poster} alt={movie.title} className="ranked-poster"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/80x120/1a1a2e/e11d48?text=' + encodeURIComponent(movie.title[0]); }} />
          <div className="ranked-info">
            <h4 className="ranked-title">{movie.title}</h4>
            <div className="ranked-meta">
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.genres[0]}</span>
            </div>
          </div>
          <div className="ranked-rating" style={{ color: accentColor }}>
            <Star size={14} fill="currentColor" color="currentColor" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="trending-page container">
      <div className="page-header">
        <h1 className="page-title">Trending</h1>
        <p className="page-subtitle">The hottest films on CineScope right now</p>
      </div>

      {/* Featured trending grid */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">
            <Flame size={22} className="section-icon text-orange" /> Trending Today
          </h2>
        </div>
        <div className="movie-grid">
          {trendingToday.map(movie => (
            <MovieCard key={movie.id} movie={movie}
              isInWatchlist={watchlist.includes(movie.id)} onWatchlistToggle={toggleWatchlist} />
          ))}
        </div>
      </section>

      {/* Three ranked columns */}
      <div className="trending-columns">
        <div className="trending-col">
          <div className="trending-col-header orange">
            <Flame size={20} /> <span>Trending Today</span>
          </div>
          <RankedList movies={trendingToday} accentColor="#f97316" />
        </div>

        <div className="trending-col">
          <div className="trending-col-header green">
            <TrendingUp size={20} /> <span>Rising Movies</span>
          </div>
          <RankedList movies={rising} accentColor="#22c55e" />
        </div>

        <div className="trending-col">
          <div className="trending-col-header yellow">
            <Award size={20} /> <span>Top Rated This Week</span>
          </div>
          <RankedList movies={topRatedWeek} accentColor="#f59e0b" />
        </div>
      </div>

      {/* All trending grid */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">
            <TrendingUp size={22} className="section-icon" /> All Trending
          </h2>
        </div>
        <div className="movie-grid">
          {DEMO_MOVIES.slice(5).map(movie => (
            <MovieCard key={movie.id} movie={movie}
              isInWatchlist={watchlist.includes(movie.id)} onWatchlistToggle={toggleWatchlist} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default TrendingPage;
