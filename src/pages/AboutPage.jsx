import React from 'react';
import { Film, Users, Code, Target, Zap, Shield, Globe, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const TEAM = [
  { name: 'Alex Johnson', role: 'Team Lead & Full-Stack Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexJohnson', github: '#' },
  { name: 'Priya Sharma', role: 'UI/UX Designer & Frontend', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaSharma', github: '#' },
  { name: 'Sam Chen', role: 'Backend & Database Architect', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SamChen', github: '#' },
  { name: 'Maria Rodriguez', role: 'AI Integration & Analytics', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MariaRodriguez', github: '#' },
];

const TECH_STACK = [
  { name: 'React + Vite', desc: 'Lightning-fast modern frontend framework' },
  { name: 'Tailwind CSS', desc: 'Utility-first CSS for rapid UI development' },
  { name: 'React Router', desc: 'Client-side routing for SPA navigation' },
  { name: 'Supabase', desc: 'Open-source Firebase alternative for auth & database' },
  { name: 'Lucide React', desc: 'Beautiful consistent icon library' },
  { name: 'TMDB API', desc: 'Rich movie database with posters & metadata' },
];

const FEATURES = [
  { icon: <Film size={24} />, title: 'Movie Discovery', desc: 'Browse thousands of films with smart filters' },
  { icon: <Star size={24} />, title: 'Community Reviews', desc: 'Rate and review films, see what others think' },
  { icon: <Zap size={24} />, title: 'AI Insights', desc: 'Sentiment analysis powered by community data' },
  { icon: <Shield size={24} />, title: 'Secure Auth', desc: 'Powered by Supabase with row-level security' },
  { icon: <Globe size={24} />, title: 'Responsive Design', desc: 'Perfect on desktop, tablet, and mobile' },
  { icon: <Target size={24} />, title: 'Personalized', desc: 'Recommendations tailored to your taste' },
];

const AboutPage = () => (
  <div className="about-page">
    {/* Hero */}
    <div className="about-hero">
      <div className="container about-hero-inner">
        <div className="logo-icon about-logo-icon"><Film size={40} /></div>
        <h1 className="about-title">About CineScope</h1>
        <p className="about-tagline">Discover. Review. Recommend.</p>
        <p className="about-intro">
          CineScope is a community-driven movie discovery and review platform that helps users discover
          movies, share their opinions, and receive personalised recommendations — all in a beautiful,
          cinematic interface.
        </p>
      </div>
    </div>

    <div className="container">
      {/* Mission */}
      <section className="about-section">
        <div className="about-section-header">
          <Target size={28} className="about-section-icon" />
          <h2>Our Mission</h2>
        </div>
        <div className="mission-card">
          <p>
            We believe that great movies have the power to inspire, connect, and transform. CineScope
            was built to make the journey of discovering exceptional cinema effortless and enjoyable.
            We combine powerful discovery tools with genuine community reviews and AI-powered insights
            to help you find your next favourite film — every single time.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="about-section">
        <div className="about-section-header">
          <Zap size={28} className="about-section-icon" />
          <h2>Key Features</h2>
        </div>
        <div className="features-grid">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div className="feature-icon">{icon}</div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology */}
      <section className="about-section">
        <div className="about-section-header">
          <Code size={28} className="about-section-icon" />
          <h2>Technology Stack</h2>
        </div>
        <div className="tech-grid">
          {TECH_STACK.map(({ name, desc }) => (
            <div key={name} className="tech-card">
              <h4 className="tech-name">{name}</h4>
              <p className="tech-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="about-section">
        <div className="about-section-header">
          <Users size={28} className="about-section-icon" />
          <h2>Meet the Team</h2>
          <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>
            (Replace with your actual hackathon team members)
          </p>
        </div>
        <div className="team-grid">
          {TEAM.map(({ name, role, avatar, github }) => (
            <div key={name} className="team-card">
              <img src={avatar} alt={name} className="team-avatar"
                onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${name}`; }} />
              <h3 className="team-name">{name}</h3>
              <p className="team-role">{role}</p>
              <a href={github} className="team-github">View GitHub</a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="about-cta">
        <h2>Ready to discover your next favourite film?</h2>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
          <Link to="/discover" className="btn btn-primary btn-lg">Start Discovering</Link>
          <Link to="/signup" className="btn btn-outline btn-lg">Join CineScope</Link>
        </div>
      </div>
    </div>
  </div>
);

export default AboutPage;
