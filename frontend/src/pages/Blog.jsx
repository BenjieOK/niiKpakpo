import { useEffect, useState, useMemo } from 'react';
import { getBlogPosts, getCategories } from '../api/apiService';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null); // article open in reader

  useEffect(() => {
    getBlogPosts().then(r => setPosts(r.data)).catch(() => {});
    getCategories().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  // Filter + search
  const filtered = useMemo(() => {
    let result = filter === 'all' ? posts : posts.filter(p => p.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q)
      );
    }
    return result;
  }, [posts, filter, search]);

  const featured = filtered.find(p => p.is_featured);
  const rest = filtered.filter(p => !p.is_featured);

  const CATEGORIES = [
    { key: 'all', label: 'All Posts', icon: 'fas fa-th-large' },
    ...categories.map(c => ({ key: c.slug, label: c.name, icon: c.icon })),
  ];

  // ── Split-panel reader view ──────────────────────────────────────────────
  if (selected) {
    const others = posts.filter(p => p.id !== selected.id);
    return (
      <main className="page-main" style={{ paddingTop: 0 }}>
        <div className="blog-reader-layout">
          {/* Left sidebar — 25% */}
          <aside className="blog-reader-sidebar">
            <div className="blog-reader-sidebar-header">
              <button className="blog-back-btn" onClick={() => setSelected(null)}>
                <i className="fas fa-arrow-left"></i> Back to Blog
              </button>
              <p className="blog-sidebar-label">Other Articles</p>
            </div>
            <div className="blog-reader-list">
              {others.map(p => (
                <button
                  key={p.id}
                  className={`blog-reader-list-item${selected?.id === p.id ? ' active' : ''}`}
                  onClick={() => setSelected(p)}
                >
                  {p.image_url && (
                    <div className="blog-reader-list-thumb">
                      <img src={p.image_url} alt={p.title} />
                    </div>
                  )}
                  <div className="blog-reader-list-info">
                    <span className="blog-reader-list-cat">{p.category.toUpperCase()}</span>
                    <p className="blog-reader-list-title">{p.title}</p>
                    <span className="blog-reader-list-date">{formatDate(p.date)}</span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Right article panel — 75% */}
          <article className="blog-reader-content">
            <button className="blog-reader-close" onClick={() => setSelected(null)}>
              <i className="fas fa-times"></i>
            </button>
            {selected.image_url && (
              <div className="blog-reader-hero">
                <img src={selected.image_url} alt={selected.title} />
                <div className="blog-reader-hero-overlay" />
              </div>
            )}
            <div className="blog-reader-body">
              <span className="post-category">{selected.category.toUpperCase()}</span>
              <h1>{selected.title}</h1>
              <p className="post-meta">
                By <strong>{selected.author || 'Edgar Nii Kpakpo Addo'}</strong> &bull; {formatDate(selected.date)}
              </p>
              <div className="blog-reader-text">
                {selected.content.split('\n').map((para, i) =>
                  para.trim() ? <p key={i}>{para}</p> : null
                )}
              </div>
            </div>
          </article>
        </div>
      </main>
    );
  }

  // ── Normal listing view ───────────────────────────────────────────────────
  return (
    <main className="page-main">
      <div className="container">
        <div className="blog-header">
          <h1 className="page-title">News &amp; Insights</h1>
          <p className="page-subtitle">Exploring topics in Maritime, Engineering, and Technical Education.</p>
        </div>

        {/* Toolbar: filters centered, search on right */}
        <div className="blog-toolbar">
          {/* Search — top row, right-aligned */}
          <div className="blog-toolbar-search-row">
            <div className="blog-search-wrap">
              <i className="fas fa-search blog-search-icon"></i>
              <input
                type="text"
                className="blog-search-input"
                placeholder="Search articles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="blog-search-clear" onClick={() => setSearch('')}>
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>

          {/* Filters — bottom row, centered */}
          <div className="blog-toolbar-filter-row">
            <div className="filter-controls">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  className={`filter-btn${filter === cat.key ? ' active' : ''}`}
                  onClick={() => setFilter(cat.key)}
                >
                  <i className={cat.icon}></i>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {(search || filter !== 'all') && (
          <p className="blog-results-count">
            {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
            {search && <> for "<strong>{search}</strong>"</>}
          </p>
        )}

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
            <i className="fas fa-search" style={{ fontSize: '2.5rem', opacity: 0.3, display: 'block', marginBottom: 16 }}></i>
            <p>No articles match your search.</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && filter === 'all' && !search && (
              <article className="blog-post featured">
                <div className="post-image-container">
                  {featured.image_url
                    ? <img src={featured.image_url} alt={featured.title} />
                    : <div className="post-img-placeholder"><i className="fas fa-newspaper"></i></div>
                  }
                </div>
                <div className="post-content">
                  <span className="post-category">{featured.category.toUpperCase()}</span>
                  <h2>{featured.title}</h2>
                  <p className="post-meta">
                    By {featured.author || 'Edgar Nii Kpakpo Addo'} &bull; {formatDate(featured.date)}
                  </p>
                  <p>{featured.summary}</p>
                  <button className="read-more-btn" onClick={() => setSelected(featured)}>
                    Read Full Article &rarr;
                  </button>
                </div>
              </article>
            )}

            {/* Cards grid */}
            <div className="blog-cards-grid">
              {(featured && filter === 'all' && !search ? rest : filtered).map(post => (
                <article key={post.id} className="blog-card">
                  <div className="blog-card-image">
                    {post.image_url
                      ? <img src={post.image_url} alt={post.title} />
                      : <div className="post-img-placeholder"><i className="fas fa-newspaper"></i></div>
                    }
                    <span className="blog-card-category">{post.category.toUpperCase()}</span>
                  </div>
                  <div className="blog-card-body">
                    <p className="post-meta">{formatDate(post.date)}</p>
                    <h3>{post.title}</h3>
                    <p className="blog-card-summary">{post.summary}</p>
                    <button className="read-more-btn" onClick={() => setSelected(post)}>
                      Read Article &rarr;
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
