import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const WriteReview = ({ movieId, onSubmit, existingReview }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState(existingReview?.text || existingReview?.review_text || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="write-review-prompt">
        <p>Please <Link to="/login" className="text-accent">sign in</Link> to write a review.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    if (text.trim().length < 10) { setError('Review must be at least 10 characters.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await onSubmit({ rating: rating * 2, text: text.trim(), movieId });
      setText('');
      setRating(0);
    } catch (err) {
      setError('Failed to submit review. Try again.');
    }
    setSubmitting(false);
  };

  const displayRating = hoverRating || rating;

  return (
    <form className="write-review-form" onSubmit={handleSubmit}>
      <h3 className="write-review-title">Write a Review</h3>

      {/* Star picker */}
      <div className="star-picker">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="star-pick-btn"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            aria-label={`Rate ${star} stars`}
          >
            <Star
              size={28}
              fill={star <= displayRating ? '#f59e0b' : 'none'}
              color={star <= displayRating ? '#f59e0b' : '#4b5563'}
              strokeWidth={1.5}
            />
          </button>
        ))}
        {rating > 0 && <span className="star-pick-label">{rating * 2}/10</span>}
      </div>

      <textarea
        className="review-textarea"
        placeholder="Share your thoughts about this movie..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        maxLength={1000}
      />
      <div className="review-char-count">{text.length}/1000</div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default WriteReview;
