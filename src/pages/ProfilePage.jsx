import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../hooks/useMovieData';
import { DEMO_MOVIES, DEMO_REVIEWS } from '../data/movies';
import { Bookmark, Star, MessageSquare, ThumbsUp, Settings } from 'lucide-react';
import MovieCard from '../components/MovieCard';

const ProfilePage = () => {
  const { user, displayName, avatarUrl } = useAuth();
  const { watchlist, toggleWatchlist } = useWatchlist(user?.id);

  if (!user) {
    return (
      <div className="profile-page container">
        <div className="auth-prompt-card">
          <div className="auth-prompt-icon">👤</div>
          <h2>Sign In to View Your Profile</h2>
          <p>Access your reviews, watchlist, and personalised recommendations.</p>
          <Link to="/login" className="btn btn-primary btn-lg">Sign In</Link>
        </div>
      </div>
    );
  }

  const watchlistMovies = DEMO_MOVIES.filter(m => watchlist.includes(m.id));
  const userReviews = DEMO_REVIEWS.filter(r => r.userId === user.id || r.user_id === user.id);
  const totalLikes = userReviews.reduce((s, r) => s + (r.likes || 0), 0);

  const stats = [
    { icon: <MessageSquare size={20} />, label: 'Reviews', value: userReviews.length, color: '#6366f1' },
    { icon: <ThumbsUp size={20} />, label: 'Likes Received', value: totalLikes, color: '#e11d48' },
    { icon: <Bookmark size={20} />, label: 'Watchlist', value: watchlistMovies.length, color: '#f59e0b' },
    { icon: <Star size={20} />, label: 'Avg Rating', value: userReviews.length ? (userReviews.reduce((s, r) => s + r.rating, 0) / userReviews.length).toFixed(1) : '-', color: '#22c55e' },
  ];

  return (
    <div className="profile-page container">
      {/* Profile header */}
      <div className="profile-header">
        <div className="profile-avatar-wrap">
          <img src={avatarUrl} alt={displayName} className="profile-avatar-lg"
            onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`; }} />
          <div className="profile-avatar-glow" />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{displayName}</h1>
          <p className="profile-email">{user.email}</p>
          <p className="profile-joined">Member since 2026</p>
        </div>
        <Link to="/settings" className="btn btn-outline profile-settings-btn">
          <Settings size={16} /> Edit Profile
        </Link>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        {stats.map(({ icon, label, value, color }) => (
          <div key={label} className="stat-card">
            <div className="stat-card-icon" style={{ color }}>{icon}</div>
            <div className="stat-card-value">{value}</div>
            <div className="stat-card-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Watchlist */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title"><Bookmark size={20} className="section-icon" /> My Watchlist</h2>
          <Link to="/watchlist" className="see-all-link">View All</Link>
        </div>
        {watchlistMovies.length === 0 ? (
          <div className="empty-state">
            <span>🎬</span>
            <p className="empty-msg">No movies in your watchlist yet.</p>
            <Link to="/discover" className="btn btn-outline">Discover Movies</Link>
          </div>
        ) : (
          <div className="movie-grid">
            {watchlistMovies.slice(0, 4).map(movie => (
              <MovieCard key={movie.id} movie={movie}
                isInWatchlist={watchlist.includes(movie.id)} onWatchlistToggle={toggleWatchlist} />
            ))}
          </div>
        )}
      </section>

      {/* Reviews */}
      <section className="section">
        <h2 className="section-title"><MessageSquare size={20} className="section-icon" /> My Reviews</h2>
        {userReviews.length === 0 ? (
          <div className="empty-state">
            <span>✍️</span>
            <p className="empty-msg">You haven't written any reviews yet.</p>
            <Link to="/discover" className="btn btn-outline">Find Movies to Review</Link>
          </div>
        ) : (
          <div className="reviews-list">
            {userReviews.map(review => {
              const movie = DEMO_MOVIES.find(m => m.id === review.movieId);
              return (
                <div key={review.id} className="review-card">
                  <div className="review-movie-ref">
                    <Link to={`/movie/${review.movieId}`} className="review-movie-link">{movie?.title}</Link>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating / 2 ? '#f59e0b' : 'none'} color="#f59e0b" />
                    ))}
                    <span style={{ color: '#9ca3af', fontSize: '13px' }}>{review.date}</span>
                  </div>
                  <p className="review-text">{review.text}</p>
                  <div className="review-footer">
                    <span className="like-btn"><ThumbsUp size={13} /> {review.likes}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
