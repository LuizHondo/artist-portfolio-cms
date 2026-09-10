import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { artworksApi, Artwork } from '../api/artworks';
import { tagsApi, Tag } from '../api/tags';
import './HomePage.css';

export default function HomePage() {
  const [featured, setFeatured] = useState<Artwork[]>([]);
  const [all, setAll] = useState<Artwork[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      loadByTag(selectedTag);
    } else {
      loadAll();
    }
  }, [selectedTag]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [featuredRes, tagsRes] = await Promise.all([
        artworksApi.getFeatured(),
        tagsApi.getAll(),
      ]);
      setFeatured(featuredRes.data.data);
      setTags(tagsRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  };

  const loadAll = async () => {
    try {
      const res = await artworksApi.getAll();
      setAll(res.data.data);
    } catch (error) {
      console.error('Failed to load artworks:', error);
    }
  };

  const loadByTag = async (tagSlug: string) => {
    try {
      const res = await artworksApi.getAll(tagSlug);
      setAll(res.data.data);
    } catch (error) {
      console.error('Failed to load artworks:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="home-page">
      {/* Hero Section */}
      {featured.length > 0 && (
        <section className="hero-section">
          <div className="hero-content">
            <img src={featured[0].coverImage} alt={featured[0].title} className="hero-image" />
            <div className="hero-text">
              <h1>{featured[0].title}</h1>
              <p>{featured[0].summary}</p>
              <Link to={`/artwork/${featured[0].slug}`} className="btn-primary">
                View Details
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Grid */}
      {featured.length > 1 && (
        <section className="featured-section">
          <h2>Featured Works</h2>
          <div className="featured-grid">
            {featured.slice(1).map((artwork) => (
              <Link
                key={artwork.id}
                to={`/artwork/${artwork.slug}`}
                className="featured-card"
              >
                <img src={artwork.coverImage} alt={artwork.title} />
                <h3>{artwork.title}</h3>
                <p>{artwork.medium}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tag Filter */}
      <section className="filter-section">
        <h2>Filter by Category</h2>
        <div className="tag-list">
          <button
            className={`tag-btn ${!selectedTag ? 'active' : ''}`}
            onClick={() => setSelectedTag(null)}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              className={`tag-btn ${selectedTag === tag.slug ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag.slug)}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="portfolio-section">
        <h2>Portfolio</h2>
        {all.length === 0 ? (
          <p>No artworks found.</p>
        ) : (
          <div className="portfolio-grid">
            {all.map((artwork) => (
              <Link
                key={artwork.id}
                to={`/artwork/${artwork.slug}`}
                className="portfolio-card"
              >
                <div className="card-image">
                  <img src={artwork.coverImage} alt={artwork.title} />
                </div>
                <div className="card-content">
                  <h3>{artwork.title}</h3>
                  <p className="year">{artwork.yearCreated}</p>
                  <p className="medium">{artwork.medium}</p>
                  <div className="tags">
                    {artwork.artworkTags.map(({ tag }) => (
                      <span key={tag.id} className="tag-badge">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
