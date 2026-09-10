import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { artworksApi, Artwork } from '../../api/artworks';
import './Admin.css';

export default function AdminArtworks() {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    try {
      setLoading(true);
      const res = await artworksApi.getAll();
      setArtworks(res.data.data);
    } catch (err) {
      setError('Failed to load artworks');
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artwork?')) return;

    try {
      await artworksApi.delete(id);
      setArtworks(artworks.filter((a) => a.id !== id));
    } catch (err) {
      setError('Failed to delete artwork');
      console.error('Failed to delete:', err);
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>Admin Menu</h2>
        <ul className="admin-menu">
          <li>
            <Link to="/admin">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/artworks" className="active">
              Manage Artworks
            </Link>
          </li>
        </ul>
      </aside>

      <main className="admin-main">
        <h1>Manage Artworks</h1>

        <Link to="/admin/artworks/new" className="btn-new">
          + Create New Artwork
        </Link>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading artworks...</div>
        ) : artworks.length === 0 ? (
          <p>No artworks found. Create your first one!</p>
        ) : (
          <table className="artworks-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Medium</th>
                <th>Year</th>
                <th>Featured Priority</th>
                <th>Entries</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {artworks.map((artwork) => (
                <tr key={artwork.id}>
                  <td>
                    <strong>{artwork.title}</strong>
                  </td>
                  <td>{artwork.medium}</td>
                  <td>{artwork.yearCreated}</td>
                  <td>{artwork.featuredPriority || 'Not featured'}</td>
                  <td>{artwork.entries.length}</td>
                  <td>
                    <div className="artwork-actions">
                      <Link to={`/admin/artworks/${artwork.id}/edit`} className="btn-edit">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(artwork.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
