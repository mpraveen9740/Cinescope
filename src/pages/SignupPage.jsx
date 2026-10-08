import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const { signUp, isDemo } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirm) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    const { error: err } = await signUp({ name, email, password });
    if (err) setError(err.message || 'Signup failed. Please try again.');
    else navigate('/');
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <div className="logo-icon"><Film size={24} /></div>
          <span className="logo-text">CineScope</span>
        </Link>

        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join thousands of movie lovers today</p>

        {isDemo && (
          <div className="demo-notice">
            <AlertCircle size={14} />
            <span>Demo Mode — account saved locally in your browser</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <div className="input-wrap">
              <User size={16} className="input-icon" />
              <input id="name" type="text" className="form-input" placeholder="John Doe"
                value={name} onChange={e => setName(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input id="email" type="email" className="form-input" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input id="password" type={showPass ? 'text' : 'password'} className="form-input" placeholder="At least 6 characters"
                value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
              <button type="button" className="input-icon-right" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirm" className="form-label">Confirm Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input id="confirm" type="password" className="form-input" placeholder="Repeat your password"
                value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" />
            </div>
          </div>

          {error && <div className="form-error-msg"><AlertCircle size={14} /> {error}</div>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
