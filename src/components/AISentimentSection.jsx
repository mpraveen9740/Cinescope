import React from 'react';
import { AI_INSIGHTS } from '../data/movies';
import { Brain, Smile, Meh, Frown } from 'lucide-react';

const SentimentBar = ({ label, value, color }) => (
  <div className="sentiment-row">
    <span className="sentiment-label">{label}</span>
    <div className="sentiment-bar-track">
      <div
        className="sentiment-bar-fill"
        style={{ width: `${value}%`, background: color, transition: 'width 1s ease' }}
      />
    </div>
    <span className="sentiment-pct">{value}%</span>
  </div>
);

const AISentimentSection = ({ movieId }) => {
  const insight = AI_INSIGHTS[movieId];

  if (!insight) return null;

  return (
    <div className="ai-section">
      <div className="ai-header">
        <div className="ai-badge">
          <Brain size={16} />
          <span>CineScope AI</span>
        </div>
        <span className="ai-demo-tag">Demo Mode</span>
      </div>

      <h3 className="ai-title">AI Sentiment Analysis</h3>
      <p className="ai-summary">
        {insight.positive >= 80
          ? 'Viewers overwhelmingly loved this film — emotionally powerful and technically masterful.'
          : insight.positive >= 70
          ? 'Most viewers found this movie highly engaging with strong emotional resonance.'
          : 'Audience reception was largely positive with some mixed opinions on pacing.'}
      </p>

      <div className="sentiment-bars">
        <SentimentBar label="Positive" value={insight.positive} color="linear-gradient(90deg,#22c55e,#16a34a)" />
        <SentimentBar label="Neutral" value={insight.neutral} color="linear-gradient(90deg,#f59e0b,#d97706)" />
        <SentimentBar label="Negative" value={insight.negative} color="linear-gradient(90deg,#ef4444,#dc2626)" />
      </div>

      <div className="mood-section">
        <h4 className="mood-title">Audience Mood</h4>
        <div className="mood-tags">
          {insight.moods.map((mood, i) => (
            <span key={i} className="mood-tag">{mood}</span>
          ))}
        </div>
      </div>

      <p className="ai-disclaimer">
        * AI insights are generated from aggregated community review sentiment analysis.
      </p>
    </div>
  );
};

export default AISentimentSection;
