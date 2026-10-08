import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { DEMO_MOVIES, GENRES } from '../data/movies';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../hooks/useMovieData';
import MovieCard from '../components/MovieCard';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
];

const YEARS = ['All', ...Array.from({ length: 30 }, (_, i) => String(2024 - i))];
const RATINGS = ['All', '9+', '8+', '7+', '6+'];
const PAGE_SIZE = 8;

const DiscoverPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initQ = searchParams.get('q') || '';

  const [query, setQuery] = useState(initQ);
  const [genre, setGenre] = useState('All');
  const [year, setYear] = useState('All');
  const [minRating, setMinRating] = useState('All');
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { user } = useAuth();
  const { watchlist, toggleWatchlist } = useWatchlist(user?.id);

  // Sync URL search param
  useEffect(() => {
    const q = searchParams.get('q') || '';
    if (q !== query) setQuery(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...DEMO_MOVIES];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.genres.some(g => g.toLowerCase().includes(q)) ||
        m.director.toLowerCase().includes(q) ||
        m.cast.some(c => c.toLowerCase().includes(q))
      );
    }
    if (genre !== 'All') result = result.filter(m => m.genres.includes(genre));
    if (year !== 'All') result = result.filter(m => String(m.year) === year);
    if (minRating !== 'All') {
      const min = parseFloat(minRating);
      result = result.filter(m => m.rating >= min);
    }

    switch (sort) {
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => b.year - a.year); break;
      case 'oldest': result.sort((a, b) => a.year - b.year); break;
      default: result.sort((a, b) => b.popularity - a.popularity);
    }

    return result;
  }, [query, genre, year, minRating, sort]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  const clearFilters = () => {
    setQuery(''); setGenre('All'); setYear('All'); setMinRating('All'); setSort('popular'); setPage(1);
    setSearchParams({});
  };

  const activeFilters = [
    query && `"${query}"`,
    genre !== 'All' && genre,
    year !== 'All' && year,
    minRating !== 'All' && `${minRating} stars`,
  ].filter(Boolean);

  return (
    <div className="discover-page container">
      <div className="page-header">
        <h1 className="page-title">Discover Movies</h1>
        <p className="page-subtitle">Explore our entire collection of {DEMO_MOVIES.length} films</p>
      </div>

      {/* Search bar */}
      <div className="discover-search-wrap">
        <div className="discover-search-input-wrap">
          <Search size={18} className="discover-search-icon" />
          <input
            type="text"
            placeholder="Search movies, directors, actors..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="discover-search-input"
          />
          {query && <button className="discover-clear-btn" onClick={() => { setQuery(''); setPage(1); }}><X size={16} /></button>}
        </div>
        <button className="filter-toggle-btn" onClick={() => setFiltersOpen(!filtersOpen)}>
          <SlidersHorizontal size={16} />
          Filters {activeFilters.length > 0 && <span className="filter-count-badge">{activeFilters.length}</span>}
          <ChevronDown size={14} style={{ transform: filtersOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
        </button>
      </div>

      {/* Filters panel */}
      {filtersOpen && (
        <div className="filters-panel">
          <div className="filter-group">
            <label className="filter-label">Genre</label>
            <div className="filter-chips">
              {GENRES.map(g => (
                <button key={g} className={`filter-chip ${genre === g ? 'active' : ''}`} onClick={() => { setGenre(g); setPage(1); }}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group-sm">
              <label className="filter-label">Year</label>
              <select className="filter-select" value={year} onChange={e => { setYear(e.target.value); setPage(1); }}>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="filter-group-sm">
              <label className="filter-label">Min Rating</label>
              <select className="filter-select" value={minRating} onChange={e => { setMinRating(e.target.value); setPage(1); }}>
                {RATINGS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="filter-group-sm">
              <label className="filter-label">Sort By</label>
              <select className="filter-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <button className="clear-filters-btn" onClick={clearFilters}><X size={14} /> Clear Filters</button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="results-info">
        <span className="results-count">{filtered.length} movie{filtered.length !== 1 ? 's' : ''} found</span>
        {activeFilters.length > 0 && (
          <div className="active-filter-tags">
            {activeFilters.map((f, i) => (
              <span key={i} className="active-tag">{f}</span>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-lg">🎬</div>
          <h3 className="empty-title">No movies found</h3>
          <p className="empty-msg">Try adjusting your filters or search query</p>
          <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
        </div>
      ) : (
        <>
          <div className="movie-grid">
            {paginated.map(movie => (
              <MovieCard key={movie.id} movie={movie}
                isInWatchlist={watchlist.includes(movie.id)}
                onWatchlistToggle={toggleWatchlist}
              />
            ))}
          </div>
          {hasMore && (
            <div className="load-more-wrap">
              <button className="btn btn-outline btn-lg" onClick={() => setPage(p => p + 1)}>
                Load More ({filtered.length - paginated.length} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DiscoverPage;
