import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { artworksApi, Artwork, ArtworkEntry, Tag } from '../../api/artworks';
import { tagsApi } from '../../api/tags';
import './Admin.css';

export default function AdminArtworkForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [isEditing] = useState(!!id);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [allTags, setAllTags] = useState<Tag[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    medium: '',
    yearCreated: new Date().getFullYear(),
    coverImage: '',
    featuredPriority: 0,
    tagIds: [] as string[],
  });

  const [entries, setEntries] = useState<Partial<ArtworkEntry>[]>([]);
  const [newEntry, setNewEntry] = useState({
    title: '',
    description: '',
    imageUrl: '',
    displayOrder: 1,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const tagsRes = await tagsApi.getAll();
        setAllTags(tagsRes.data.data);

        if (isEditing && id) {
          const artworkRes = await artworksApi.getBySlug(id);
          const artwork = artworkRes.data.data;
          setFormData({
            title: artwork.title,
            summary: artwork.summary,
            medium: artwork.medium,
            yearCreated: artwork.yearCreated,
            coverImage: artwork.coverImage,
            featuredPriority: artwork.featuredPriority,
            tagIds: artwork.artworkTags.map((at) => at.tag.id),
          });
          setEntries(artwork.entries);
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, [isEditing, id]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'yearCreated' || name === 'featuredPriority' ? parseInt(value) : value,
    });
  };

  const handleTagChange = (tagId: string) => {
    setFormData({
      ...formData,
      tagIds: formData.tagIds.includes(tagId)
        ? formData.tagIds.filter((t) => t !== tagId)
        : [...formData.tagIds, tagId],
    });
  };

  const handleAddEntry = () => {
    if (newEntry.title && newEntry.imageUrl && newEntry.description) {
      setEntries([...entries, { ...newEntry, displayOrder: entries.length + 1 }]);
      setNewEntry({ title: '', description: '', imageUrl: '', displayOrder: 1 });
    }
  };

  const handleRemoveEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isEditing && id) {
        await artworksApi.update(id, formData);
        setSuccess('Artwork updated successfully!');
      } else {
        await artworksApi.create(formData);
        setSuccess('Artwork created successfully!');
      }

      setTimeout(() => navigate('/admin/artworks'), 1500);
    } catch (err) {
      setError('Failed to save artwork');
      console.error('Failed to save:', err);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>Admin Menu</h2>
        <ul className="admin-menu">
          <li>
            <a href="/admin" style={{ color: '#666' }}>
              Dashboard
            </a>
          </li>
          <li>
            <a href="/admin/artworks" style={{ color: '#666' }}>
              Manage Artworks
            </a>
          </li>
        </ul>
      </aside>

      <main className="admin-main">
        <h1>{isEditing ? 'Edit Artwork' : 'Create New Artwork'}</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="artwork-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="summary">Summary</label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="medium">Medium</label>
            <input
              type="text"
              id="medium"
              name="medium"
              value={formData.medium}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="yearCreated">Year Created</label>
            <input
              type="number"
              id="yearCreated"
              name="yearCreated"
              value={formData.yearCreated}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverImage">Cover Image URL</label>
            <input
              type="url"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="featuredPriority">Featured Priority</label>
            <select
              id="featuredPriority"
              name="featuredPriority"
              value={formData.featuredPriority}
              onChange={handleFormChange}
            >
              <option value="0">Not Featured</option>
              <option value="1">Hero Section (Priority 1)</option>
              <option value="2">Featured Grid (Priority 2)</option>
              <option value="3">Featured Grid (Priority 3)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {allTags.map((tag) => (
                <label key={tag.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.tagIds.includes(tag.id)}
                    onChange={() => handleTagChange(tag.id)}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>

          {/* Process Entries Section */}
          <hr style={{ margin: '2rem 0' }} />

          <h3>Creative Process Entries</h3>

          {entries.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              {entries.map((entry, index) => (
                <div
                  key={index}
                  style={{
                    background: '#f8f9fa',
                    padding: '1rem',
                    borderRadius: '6px',
                    marginBottom: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{entry.title}</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                      Step {index + 1}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveEntry(index)}
                    className="btn-delete"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '6px' }}>
            <h4 style={{ marginTop: 0 }}>Add New Entry</h4>

            <div className="form-group">
              <label htmlFor="entry-title">Entry Title</label>
              <input
                type="text"
                id="entry-title"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="entry-image">Entry Image URL</label>
              <input
                type="url"
                id="entry-image"
                value={newEntry.imageUrl}
                onChange={(e) => setNewEntry({ ...newEntry, imageUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="entry-description">Entry Description</label>
              <textarea
                id="entry-description"
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
              />
            </div>

            <button
              type="button"
              onClick={handleAddEntry}
              style={{
                background: '#17a2b8',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Add Entry
            </button>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-save">
              {isEditing ? 'Update Artwork' : 'Create Artwork'}
            </button>
            <a href="/admin/artworks" className="btn-cancel">
              Cancel
            </a>
          </div>
        </form>
      </main>
    </div>
  );
}
