import React from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp } from 'lucide-react';

const RecommendationCard = ({ movie, matchPercent, reason }) => {
  return (
    <Link to={`/movie/${movie.id}`} className="rec-card">
      <div className="rec-poster-wrap">
        <img
          src={movie.poster}
          alt={movie.title}
          className="rec-poster"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450/1a1a2e/e11d48?text=' + encodeURIComponent(movie.title); }}
        />
        <div className="rec-match-badge">
          <TrendingUp size={10} />
          <span>{matchPercent}% Match</span>
        </div>
      </div>
      <div className="rec-info">
        <h4 className="rec-title">{movie.title}</h4>
        <div className="rec-meta">
          <span className="rec-genre">{movie.genres?.[0]}</span>
          <span className="rec-rating">
            <Star size={11} fill="#f59e0b" color="#f59e0b" /> {movie.rating.toFixed(1)}
          </span>
        </div>
        {reason && <p className="rec-reason">{reason}</p>}
      </div>
    </Link>
  );
};

export default RecommendationCard;
