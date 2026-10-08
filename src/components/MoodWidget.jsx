import React, { useState } from 'react';
import { DEMO_MOVIES, MOOD_RECOMMENDATIONS } from '../data/movies';
import { useWatchlist } from '../hooks/useMovieData';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Star, Sparkles } from 'lucide-react';

const MOODS = [
  { key: 'action', emoji: '🔥', label: 'Action' },
  { key: 'comedy', emoji: '😂', label: 'Comedy' },
  { key: 'romance', emoji: '❤️', label: 'Romance' },
  { key: 'horror', emoji: '😱', label: 'Horror' },
  { key: 'mindbending', emoji: '🧠', label: 'Mind-bending' },
  { key: 'scifi', emoji: '🚀', label: 'Sci-Fi' },
  { key: 'drama', emoji: '🎭', label: 'Drama' },
];

const MoodWidget = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const { user } = useAuth();
  const { watchlist, toggleWatchlist } = useWatchlist(user?.id);

  const recommendations = selectedMood
    ? MOOD_RECOMMENDATIONS[selectedMood]?.map(id => DEMO_MOVIES.find(m => m.id === id)).filter(Boolean)
    : [];

  return (
    <section className="mood-widget-section">
      <div className="section-header-center">
        <div className="section-badge">
          <Sparkles size={14} />
          <span>Tonight's Pick</span>
        </div>
        <h2 className="section-title-lg">What Should I Watch Tonight?</h2>
        <p className="section-subtitle">Tell us your mood and we'll find the perfect movie for you</p>
      </div>

      <div className="mood-buttons">
        {MOODS.map(({ key, emoji, label }) => (
          <button
            key={key}
            className={`mood-btn ${selectedMood === key ? 'active' : ''}`}
            onClick={() => setSelectedMood(selectedMood === key ? null : key)}
          >
            <span className="mood-emoji">{emoji}</span>
            <span className="mood-label">{label}</span>
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="mood-results">
          <h3 className="mood-results-title">
            Perfect for your <span className="text-accent">{MOODS.find(m => m.key === selectedMood)?.label}</span> mood
          </h3>
          <div className="mood-movies-row">
            {recommendations.map((movie) => (
              <Link key={movie.id} to={`/movie/${movie.id}`} className="mood-movie-card">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="mood-movie-poster"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300/1a1a2e/e11d48?text=' + encodeURIComponent(movie.title); }}
                />
                <div className="mood-movie-overlay">
                  <h4 className="mood-movie-title">{movie.title}</h4>
                  <div className="mood-movie-rating">
                    <Star size={12} fill="#f59e0b" color="#f59e0b" />
                    <span>{movie.rating.toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default MoodWidget;
