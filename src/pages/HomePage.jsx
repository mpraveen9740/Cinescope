import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, BookmarkPlus, BookmarkCheck, Star, ChevronRight, Sparkles, Award, TrendingUp, Users } from 'lucide-react';
import { DEMO_MOVIES, DEMO_REVIEWS } from '../data/movies';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../hooks/useMovieData';
import MovieCard from '../components/MovieCard';
import ReviewCard from '../components/ReviewCard';
import MoodWidget from '../components/MoodWidget';
import RecommendationCard from '../components/RecommendationCard';

const FEATURED_MOVIE = DEMO_MOVIES[2]; // The Dark Knight as hero

const MATCH_PERCENTS = [97, 94, 91, 88, 85];

const WHY_FEATURES = [
  {
    icon: '🎬',
    title: 'Discover Great Movies',
    desc: 'Browse thousands of films across every genre with intelligent filters, trending charts, and personalized picks crafted just for you.'
  },
  {
    icon: '✍️',
    title: 'Share Your Opinion',
    desc: 'Write detailed reviews, rate movies with precision, and engage with a passionate community of fellow cinephiles.'
  },
  {
    icon: '🤖',
    title: 'AI-Powered Recommendations',
    desc: 'Our AI analyses your watch history and preferences to surface hidden gems and must-watch classics you\'ll love.'
  }
];

const HomePage = () => {
  const { user } = useAuth();
  const { watchlist, toggleWatchlist } = useWatchlist(user?.id);
  const [heroLoaded, setHeroLoaded] = useState(false);

  const trending = [...DEMO_MOVIES].sort((a, b) => b.popularity - a.popularity).slice(0, 8);
  const topRated = [...DEMO_MOVIES].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const recommendedMovies = DEMO_MOVIES.filter(m => m.genres.includes('Sci-Fi')).slice(0, 5);

  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-backdrop">
          <img
            src={FEATURED_MOVIE.backdrop}
            alt=""
            className="hero-bg-img"
            onLoad={() => setHeroLoaded(true)}
            style={{ opacity: heroLoaded ? 1 : 0, transition: 'opacity 1s ease' }}
          />
          <div className="hero-gradient" />
        </div>

        <div className="hero-content container">
          <div className="hero-text">
            <div className="hero-genres">
              {FEATURED_MOVIE.genres.map(g => <span key={g} className="genre-tag">{g}</span>)}
            </div>
            <h1 className="hero-title">{FEATURED_MOVIE.title}</h1>
            <div className="hero-meta">
              <span className="hero-year">{FEATURED_MOVIE.year}</span>
              <span className="hero-sep">•</span>
              <span className="hero-runtime">{FEATURED_MOVIE.runtime} min</span>
              <span className="hero-sep">•</span>
              <span className="hero-rating">
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                {FEATURED_MOVIE.rating.toFixed(1)} / 10
              </span>
            </div>
            <p className="hero-desc">{FEATURED_MOVIE.description}</p>
            <div className="hero-actions">
              <a
                href={FEATURED_MOVIE.trailerUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-lg"
              >
                <Play size={18} fill="currentColor" /> Watch Trailer
              </a>
              <Link to={`/movie/${FEATURED_MOVIE.id}`} className="btn btn-outline btn-lg">
                Read Reviews
              </Link>
              <button
                className={`btn ${watchlist.includes(FEATURED_MOVIE.id) ? 'btn-success' : 'btn-ghost'} btn-lg`}
                onClick={() => toggleWatchlist(FEATURED_MOVIE.id)}
              >
                {watchlist.includes(FEATURED_MOVIE.id) ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />}
                {watchlist.includes(FEATURED_MOVIE.id) ? 'Saved' : 'Watchlist'}
              </button>
            </div>
          </div>

          {/* Hero poster */}
          <div className="hero-poster-wrap">
            <img src={FEATURED_MOVIE.poster} alt={FEATURED_MOVIE.title} className="hero-poster" />
            <div className="hero-poster-glow" />
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="stats-bar">
        <div className="container stats-inner">
          <div className="stat-item"><span className="stat-num">15,000+</span><span className="stat-label">Movies</span></div>
          <div className="stat-divider" />
          <div className="stat-item"><span className="stat-num">50,000+</span><span className="stat-label">Reviews</span></div>
          <div className="stat-divider" />
          <div className="stat-item"><span className="stat-num">120K+</span><span className="stat-label">Users</span></div>
          <div className="stat-divider" />
          <div className="stat-item"><span className="stat-num">98%</span><span className="stat-label">Satisfaction</span></div>
        </div>
      </div>

      {/* ── Trending ── */}
      <section className="section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <TrendingUp size={22} className="section-icon" /> Trending Movies
            </h2>
            <p className="section-sub">What everyone's watching right now</p>
          </div>
          <Link to="/trending" className="see-all-link">See All <ChevronRight size={16} /></Link>
        </div>
        <div className="movie-grid">
          {trending.map(movie => (
            <MovieCard key={movie.id} movie={movie} isInWatchlist={watchlist.includes(movie.id)} onWatchlistToggle={toggleWatchlist} />
          ))}
        </div>
      </section>

      {/* ── Mood Widget ── */}
      <MoodWidget />

      {/* ── Top Rated ── */}
      <section className="section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <Award size={22} className="section-icon" /> Top Rated
            </h2>
            <p className="section-sub">Critically acclaimed masterpieces</p>
          </div>
          <Link to="/top-rated" className="see-all-link">See All <ChevronRight size={16} /></Link>
        </div>
        <div className="horizontal-scroll-wrap">
          <div className="horizontal-scroll">
            {topRated.map((movie, idx) => (
              <Link key={movie.id} to={`/movie/${movie.id}`} className="top-rated-card">
                <span className="top-rated-rank">{String(idx + 1).padStart(2, '0')}</span>
                <img src={movie.poster} alt={movie.title} className="top-rated-poster"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150x225/1a1a2e/e11d48?text=' + encodeURIComponent(movie.title); }} />
                <div className="top-rated-info">
                  <h4>{movie.title}</h4>
                  <span className="top-rated-rating"><Star size={12} fill="#f59e0b" color="#f59e0b" /> {movie.rating.toFixed(1)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recommended For You ── */}
      <section className="section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <Sparkles size={22} className="section-icon" /> Recommended For You
            </h2>
            <p className="section-sub">Because you liked <span className="text-accent">Interstellar</span></p>
          </div>
        </div>
        <div className="rec-grid">
          {recommendedMovies.map((movie, i) => (
            <RecommendationCard key={movie.id} movie={movie} matchPercent={MATCH_PERCENTS[i]} reason="Similar themes & atmosphere" />
          ))}
        </div>
      </section>

      {/* ── Popular Reviews ── */}
      <section className="section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <Users size={22} className="section-icon" /> Popular Reviews
            </h2>
            <p className="section-sub">What the community is saying</p>
          </div>
        </div>
        <div className="reviews-grid">
          {DEMO_REVIEWS.slice(0, 3).map(review => {
            const movie = DEMO_MOVIES.find(m => m.id === review.movieId);
            return (
              <div key={review.id} className="review-card-home">
                <div className="review-movie-label">
                  <Link to={`/movie/${review.movieId}`} className="review-movie-link">{movie?.title}</Link>
                </div>
                <ReviewCard review={review} />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Why CineScope ── */}
      <section className="why-section">
        <div className="container">
          <div className="section-header-center">
            <h2 className="section-title-lg">Why CineScope?</h2>
            <p className="section-subtitle">Everything you need to find your next favourite film</p>
          </div>
          <div className="why-grid">
            {WHY_FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="why-card">
                <div className="why-icon">{icon}</div>
                <h3 className="why-title">{title}</h3>
                <p className="why-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
