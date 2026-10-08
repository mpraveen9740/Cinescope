import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { signIn, isDemo } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    const { error: err } = await signIn({ email, password });
    if (err) setError(err.message || 'Login failed. Check your credentials.');
    else navigate('/');
    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await signIn({ email: 'demo@cinescope.com', password: 'demo123' });
    navigate('/');
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card">
        {/* Logo */}
        <Link to="/" className="auth-logo">
          <div className="logo-icon"><Film size={24} /></div>
          <span className="logo-text">CineScope</span>
        </Link>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        {isDemo && (
          <div className="demo-notice">
            <AlertCircle size={14} />
            <span>Demo Mode — any email/password works for testing</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
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
              <input id="password" type={showPass ? 'text' : 'password'} className="form-input" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
              <button type="button" className="input-icon-right" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <div className="form-error-msg"><AlertCircle size={14} /> {error}</div>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button className="btn btn-google btn-full" onClick={handleDemoLogin} disabled={loading}>
          <span className="google-icon">🎬</span>
          {isDemo ? 'Continue as Demo User' : 'Sign in with Google'}
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
