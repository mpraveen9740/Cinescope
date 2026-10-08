import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, BookmarkPlus, BookmarkCheck, Star, Clock, Calendar, User, ChevronLeft, Image } from 'lucide-react';
import { DEMO_MOVIES } from '../data/movies';
import { useAuth } from '../context/AuthContext';
import { useWatchlist, useReviews } from '../hooks/useMovieData';
import RatingStars from '../components/RatingStars';
import ReviewCard from '../components/ReviewCard';
import WriteReview from '../components/WriteReview';
import AISentimentSection from '../components/AISentimentSection';
import RecommendationCard from '../components/RecommendationCard';

const RatingBreakdown = ({ reviews }) => {
  const counts = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => {
      const normalized = Math.round((r.rating || 0) / 2);
      return normalized === star;
    }).length;
    return { star, count };
  });
  const total = reviews.length || 1;
  return (
    <div className="rating-breakdown">
      <h3 className="breakdown-title">Rating Breakdown</h3>
      {counts.map(({ star, count }) => {
        const pct = Math.round((count / total) * 100);
        return (
          <div key={star} className="breakdown-row">
            <span className="breakdown-star">{star} ★</span>
            <div className="breakdown-bar-track">
              <div className="breakdown-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="breakdown-pct">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
};

const MATCH_PERCENTS = [96, 92, 88, 85, 82];

const MovieDetailPage = () => {
  const { id } = useParams();
  const movie = DEMO_MOVIES.find(m => m.id === parseInt(id));
  const { user } = useAuth();
  const { watchlist, toggleWatchlist } = useWatchlist(user?.id);
  const { reviews, loading: reviewsLoading, addReview, deleteReview, toggleLike } = useReviews(parseInt(id));
  const [backdropError, setBackdropError] = useState(false);

  if (!movie) {
    return (
      <div className="not-found-page container">
        <h1>Movie not found</h1>
        <Link to="/discover" className="btn btn-primary">Browse Movies</Link>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : movie.rating.toFixed(1);

  const recommended = DEMO_MOVIES
    .filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g)))
    .slice(0, 5);

  const handleReview = async (data) => {
    await addReview({
      movieId: movie.id,
      userId: user.id,
      username: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
      rating: data.rating,
      text: data.text,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      likedByUser: false
    });
  };

  return (
    <div className="movie-detail-page">
      {/* Backdrop */}
      <div className="detail-backdrop">
        {!backdropError ? (
          <img src={movie.backdrop} alt="" className="detail-backdrop-img" onError={() => setBackdropError(true)} />
        ) : (
          <div className="detail-backdrop-fallback" />
        )}
        <div className="detail-backdrop-gradient" />
      </div>

      {/* Main info */}
      <div className="container detail-main">
        <Link to="/discover" className="back-link"><ChevronLeft size={18} /> Back</Link>

        <div className="detail-layout">
          {/* Poster */}
          <div className="detail-poster-col">
            <img src={movie.poster} alt={movie.title} className="detail-poster"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450/1a1a2e/e11d48?text=' + encodeURIComponent(movie.title); }} />
            <div className="detail-poster-glow" />
          </div>

          {/* Info */}
          <div className="detail-info-col">
            <div className="detail-genres">
              {movie.genres.map(g => <span key={g} className="genre-tag">{g}</span>)}
            </div>
            <h1 className="detail-title">{movie.title}</h1>

            <div className="detail-meta-row">
              <span className="detail-meta-item"><Calendar size={14} /> {movie.year}</span>
              <span className="detail-meta-item"><Clock size={14} /> {movie.runtime} min</span>
              <span className="detail-meta-item">
                <Star size={14} fill="#f59e0b" color="#f59e0b" /> {avgRating} / 10
                <span className="detail-vote-count">({reviews.length} reviews)</span>
              </span>
            </div>

            <div className="detail-stars-row">
              <RatingStars rating={parseFloat(avgRating)} max={10} size={20} showNumber={false} />
            </div>

            <p className="detail-overview">{movie.description}</p>

            <div className="detail-crew">
              <div className="crew-item">
                <span className="crew-label">Director</span>
                <span className="crew-value">{movie.director}</span>
              </div>
              <div className="crew-item">
                <span className="crew-label">Cast</span>
                <span className="crew-value">{movie.cast.join(', ')}</span>
              </div>
            </div>

            <div className="detail-actions">
              <a href={movie.trailerUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-lg">
                <Play size={18} fill="currentColor" /> Watch Trailer
              </a>
              <button
                className={`btn btn-lg ${watchlist.includes(movie.id) ? 'btn-success' : 'btn-outline'}`}
                onClick={() => toggleWatchlist(movie.id)}
              >
                {watchlist.includes(movie.id) ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />}
                {watchlist.includes(movie.id) ? 'Saved' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Body sections */}
      <div className="container detail-body">
        {/* AI Sentiment */}
        <AISentimentSection movieId={movie.id} />

        {/* Rating Breakdown */}
        <RatingBreakdown reviews={reviews} />

        {/* Reviews */}
        <div className="reviews-section">
          <h2 className="reviews-section-title">
            Community Reviews <span className="reviews-count">({reviews.length})</span>
          </h2>

          <WriteReview movieId={movie.id} onSubmit={handleReview} />

          {reviewsLoading ? (
            <p className="loading-text">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">💬</span>
              <p className="empty-msg">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="reviews-list">
              {reviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  currentUserId={user?.id}
                  onLike={toggleLike}
                  onDelete={deleteReview}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        {recommended.length > 0 && (
          <div className="rec-section">
            <h2 className="section-title">More Like This</h2>
            <div className="rec-grid">
              {recommended.map((m, i) => (
                <RecommendationCard key={m.id} movie={m} matchPercent={MATCH_PERCENTS[i] || 80} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
