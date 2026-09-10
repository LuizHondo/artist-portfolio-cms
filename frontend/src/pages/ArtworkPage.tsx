import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { artworksApi, Artwork } from '../api/artworks';
import './ArtworkPage.css';

export default function ArtworkPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadArtwork(slug);
    }
  }, [slug]);

  const loadArtwork = async (slug: string) => {
    try {
      setLoading(true);
      const res = await artworksApi.getBySlug(slug);
      setArtwork(res.data.data);
    } catch (err) {
      setError('Artwork not found');
      console.error('Failed to load artwork:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading artwork...</div>;

  if (error || !artwork) {
    return (
      <div className="error-container">
        <h2>{error || 'Artwork not found'}</h2>
        <button onClick={() => navigate('/')} className="btn-back">
          Back to Portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="artwork-page">
      {/* Header */}
      <div className="artwork-header">
        <button onClick={() => navigate('/')} className="btn-back-small">
          ← Back
        </button>
        <h1>{artwork.title}</h1>
        <div className="artwork-meta">
          <span className="year">{artwork.yearCreated}</span>
          <span className="medium">{artwork.medium}</span>
        </div>
      </div>

      {/* Summary */}
      <section className="summary-section">
        <p>{artwork.summary}</p>
      </section>

      {/* Tags */}
      {artwork.artworkTags.length > 0 && (
        <div className="tags-section">
          <h3>Categories</h3>
          <div className="tags">
            {artwork.artworkTags.map(({ tag }) => (
              <span key={tag.id} className="tag">
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Process Timeline */}
      {artwork.entries.length > 0 && (
        <section className="process-section">
          <h2>Creative Process</h2>
          <div className="timeline">
            {artwork.entries.map((entry, index) => (
              <div key={entry.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-marker">
                  <div className="marker-circle">{index + 1}</div>
                </div>

                <div className="timeline-content">
                  <div className="entry-card">
                    <h3>{entry.title}</h3>
                    <img src={entry.imageUrl} alt={entry.title} className="entry-image" />
                    <p>{entry.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cover image as gallery */}
      {!artwork.entries.length && (
        <section className="gallery-section">
          <img src={artwork.coverImage} alt={artwork.title} className="full-width-image" />
        </section>
      )}
    </div>
  );
}
