import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { artworksApi, Artwork } from '../../api/artworks';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/auth';
import './Admin.css';

export default function AdminDashboard() {
  const { admin } = useAuthStore();
  const [stats, setStats] = useState({ total: 0, featured: 0 });
  const [recentArtworks, setRecentArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [allRes, featuredRes] = await Promise.all([
        artworksApi.getAll(),
        artworksApi.getFeatured(),
      ]);

      setStats({
        total: allRes.data.count,
        featured: featuredRes.data.count,
      });

      setRecentArtworks(allRes.data.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>Admin Menu</h2>
        <ul className="admin-menu">
          <li>
            <Link to="/admin" className="active">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/artworks">Manage Artworks</Link>
          </li>
        </ul>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ddd' }}>
          <p>
            <strong>Logged in as:</strong>
          </p>
          <p style={{ color: '#667eea', margin: 0 }}>{admin?.email}</p>
        </div>
      </aside>

      <main className="admin-main">
        <h1>Dashboard</h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '2rem',
                  borderRadius: '8px',
                }}
              >
                <h3 style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Total Artworks</h3>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: 'bold' }}>{stats.total}</p>
              </div>

              <div
                style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  padding: '2rem',
                  borderRadius: '8px',
                }}
              >
                <h3 style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Featured</h3>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: 'bold' }}>{stats.featured}</p>
              </div>
            </div>

            {/* Recent Artworks */}
            <h2>Recent Artworks</h2>
            <Link to="/admin/artworks/new" className="btn-new">
              + Create New Artwork
            </Link>

            {recentArtworks.length === 0 ? (
              <p>No artworks yet. Create your first artwork!</p>
            ) : (
              <table className="artworks-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Medium</th>
                    <th>Year</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentArtworks.map((artwork) => (
                    <tr key={artwork.id}>
                      <td>
                        <strong>{artwork.title}</strong>
                      </td>
                      <td>{artwork.medium}</td>
                      <td>{artwork.yearCreated}</td>
                      <td>{artwork.featuredPriority > 0 ? `Priority ${artwork.featuredPriority}` : 'No'}</td>
                      <td>
                        <div className="artwork-actions">
                          <Link to={`/admin/artworks/${artwork.id}/edit`} className="btn-edit">
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </main>
    </div>
  );
}
