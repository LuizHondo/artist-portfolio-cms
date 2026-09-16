'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getBySlug } from '@/lib/api/artworks';
import { getTags } from '@/lib/api/tags';
import { adminArtworksApi } from '@/lib/api/admin-artworks';
import type { ArtworkEntry, ArtworkEntryImage, Tag } from '@/lib/types';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

const inputClass =
  'w-full p-3 border border-[#ddd] rounded-md text-base box-border transition-colors duration-300 focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]';
const deleteBtnClass =
  'px-[0.8rem] py-[0.4rem] border-0 rounded cursor-pointer text-[0.9rem] transition-all duration-300 bg-[#dc3545] text-white hover:bg-[#c82333]';

const emptyImage: ArtworkEntryImage = { url: '', title: '', description: '' };

function resizeImages(images: ArtworkEntryImage[], columns: number): ArtworkEntryImage[] {
  if (columns <= images.length) return images.slice(0, columns);
  return [...images, ...Array.from({ length: columns - images.length }, () => ({ ...emptyImage }))];
}

function entryFieldsChanged(a: Partial<ArtworkEntry>, b: Partial<ArtworkEntry>) {
  return a.columns !== b.columns || JSON.stringify(a.images) !== JSON.stringify(b.images) || a.displayOrder !== b.displayOrder;
}

function ArtworkFormContent({ slug }: { slug?: string }) {
  const router = useRouter();
  const isEditing = !!slug;
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [artworkId, setArtworkId] = useState<string | undefined>(undefined);

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
  const [originalEntries, setOriginalEntries] = useState<Partial<ArtworkEntry>[]>([]);
  const [newEntry, setNewEntry] = useState<{ columns: number; images: ArtworkEntryImage[]; displayOrder: number }>({
    columns: 1,
    images: [{ ...emptyImage }],
    displayOrder: 1,
  });

  useEffect(() => {
    (async () => {
      try {
        setAllTags(await getTags());

        if (isEditing && slug) {
          const artwork = await getBySlug(slug);
          if (!artwork) {
            setError('Artwork not found');
            setLoading(false);
            return;
          }
          setArtworkId(artwork.id);
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
          setOriginalEntries(artwork.entries);
        }

        setLoading(false);
      } catch {
        setError('Failed to load data');
        setLoading(false);
      }
    })();
  }, [isEditing, slug]);

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
      tagIds: formData.tagIds.includes(tagId) ? formData.tagIds.filter((t) => t !== tagId) : [...formData.tagIds, tagId],
    });
  };

  const newEntryComplete = newEntry.images.every((img) => img.url && img.title && img.description);

  const handleAddEntry = () => {
    if (newEntryComplete) {
      setEntries([...entries, { ...newEntry, displayOrder: entries.length + 1 }]);
      setNewEntry({ columns: 1, images: [{ ...emptyImage }], displayOrder: 1 });
    }
  };

  const handleRemoveEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleEntryColumnsChange = (index: number, columns: number) => {
    setEntries(
      entries.map((entry, i) => (i === index ? { ...entry, columns, images: resizeImages(entry.images ?? [], columns) } : entry))
    );
  };

  const handleEntryImageFieldChange = (index: number, imageIndex: number, field: keyof ArtworkEntryImage, value: string) => {
    setEntries(
      entries.map((entry, i) =>
        i === index
          ? { ...entry, images: (entry.images ?? []).map((img, j) => (j === imageIndex ? { ...img, [field]: value } : img)) }
          : entry
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isEditing && artworkId) {
        await adminArtworksApi.update(artworkId, formData);

        const originalById = new Map(originalEntries.filter((entry) => entry.id).map((entry) => [entry.id as string, entry]));
        const currentIds = new Set(entries.filter((entry) => entry.id).map((entry) => entry.id as string));

        for (const entry of entries) {
          if (!entry.id) {
            await adminArtworksApi.createEntry(artworkId, entry);
          } else {
            const original = originalById.get(entry.id);
            if (original && entryFieldsChanged(original, entry)) {
              await adminArtworksApi.updateEntry(entry.id, entry);
            }
          }
        }

        for (const entryId of originalById.keys()) {
          if (!currentIds.has(entryId)) {
            await adminArtworksApi.deleteEntry(entryId);
          }
        }

        setSuccess('Artwork updated successfully!');
      } else {
        const created = await adminArtworksApi.create(formData);
        const newArtworkId = created.data.data.id;

        for (const entry of entries) {
          await adminArtworksApi.createEntry(newArtworkId, entry);
        }

        setSuccess('Artwork created successfully!');
      }

      setTimeout(() => router.push('/admin/artworks'), 1500);
    } catch (err) {
      setError('Failed to save artwork');
      console.error('Failed to save:', err);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 min-h-[calc(100vh-200px)]">
      <AdminSidebar />

      <main className="bg-white p-8 rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
        <h1 className="mt-0 text-[#333] mb-8">{isEditing ? 'Edit Artwork' : 'Create New Artwork'}</h1>

        {error && <div className="p-4 rounded-md mb-6 font-medium bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb]">{error}</div>}
        {success && <div className="p-4 rounded-md mb-6 font-medium bg-[#d4edda] text-[#155724] border border-[#c3e6cb]">{success}</div>}

        <form onSubmit={handleSubmit} className="max-w-[600px]">
          <div className="mb-6">
            <label htmlFor="title" className="block mb-2 font-medium text-[#333]">
              Title
            </label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleFormChange} required className={inputClass} />
          </div>

          <div className="mb-6">
            <label htmlFor="summary" className="block mb-2 font-medium text-[#333]">
              Summary
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleFormChange}
              required
              className={`${inputClass} resize-y min-h-[100px]`}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="medium" className="block mb-2 font-medium text-[#333]">
              Medium
            </label>
            <input type="text" id="medium" name="medium" value={formData.medium} onChange={handleFormChange} required className={inputClass} />
          </div>

          <div className="mb-6">
            <label htmlFor="yearCreated" className="block mb-2 font-medium text-[#333]">
              Year Created
            </label>
            <input
              type="number"
              id="yearCreated"
              name="yearCreated"
              value={formData.yearCreated}
              onChange={handleFormChange}
              required
              className={inputClass}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="coverImage" className="block mb-2 font-medium text-[#333]">
              Cover Image URL
            </label>
            <input
              type="url"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleFormChange}
              required
              className={inputClass}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="featuredPriority" className="block mb-2 font-medium text-[#333]">
              Featured Priority
            </label>
            <select
              id="featuredPriority"
              name="featuredPriority"
              value={formData.featuredPriority}
              onChange={handleFormChange}
              className={inputClass}
            >
              <option value="0">Not Featured</option>
              <option value="1">Hero Section (Priority 1)</option>
              <option value="2">Featured Grid (Priority 2)</option>
              <option value="3">Featured Grid (Priority 3)</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium text-[#333]">Tags</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {allTags.map((tag) => (
                <label key={tag.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" checked={formData.tagIds.includes(tag.id)} onChange={() => handleTagChange(tag.id)} />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>

          <hr style={{ margin: '2rem 0' }} />

          <h3>Creative Process Entries</h3>

          {entries.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              {entries.map((entry, index) => (
                <div
                  key={entry.id ?? `new-${index}`}
                  data-testid={`entry-card-${index}`}
                  style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>Step {index + 1}</p>
                    <button type="button" onClick={() => handleRemoveEntry(index)} className={deleteBtnClass}>
                      Remove
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 font-medium text-[#333]">Columns</label>
                    <select
                      value={entry.columns ?? 1}
                      onChange={(e) => handleEntryColumnsChange(index, parseInt(e.target.value))}
                      className={inputClass}
                      required
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(entry.images ?? []).map((image, imageIndex) => (
                    <div key={imageIndex} style={{ borderTop: imageIndex > 0 ? '1px dashed #ddd' : undefined, paddingTop: imageIndex > 0 ? '1rem' : 0, marginTop: imageIndex > 0 ? '1rem' : 0 }}>
                      <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Image {imageIndex + 1}</p>

                      <div className="mb-4">
                        <label className="block mb-2 font-medium text-[#333]">Image URL</label>
                        <input
                          type="url"
                          value={image.url}
                          onChange={(e) => handleEntryImageFieldChange(index, imageIndex, 'url', e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block mb-2 font-medium text-[#333]">Image Title</label>
                        <input
                          type="text"
                          value={image.title}
                          onChange={(e) => handleEntryImageFieldChange(index, imageIndex, 'title', e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="block mb-2 font-medium text-[#333]">Image Description</label>
                        <textarea
                          value={image.description}
                          onChange={(e) => handleEntryImageFieldChange(index, imageIndex, 'description', e.target.value)}
                          className={`${inputClass} resize-y min-h-[80px]`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '6px' }}>
            <h4 style={{ marginTop: 0 }}>Add New Entry</h4>

            <div className="mb-6">
              <label htmlFor="entry-columns" className="block mb-2 font-medium text-[#333]">
                Columns
              </label>
              <select
                id="entry-columns"
                value={newEntry.columns}
                onChange={(e) => {
                  const columns = parseInt(e.target.value);
                  setNewEntry({ ...newEntry, columns, images: resizeImages(newEntry.images, columns) });
                }}
                className={inputClass}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {newEntry.images.map((image, imageIndex) => (
              <div
                key={imageIndex}
                style={{
                  borderTop: imageIndex > 0 ? '1px dashed #ddd' : undefined,
                  paddingTop: imageIndex > 0 ? '1rem' : 0,
                  marginTop: imageIndex > 0 ? '1rem' : 0,
                }}
              >
                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Image {imageIndex + 1}</p>

                <div className="mb-6">
                  <label className="block mb-2 font-medium text-[#333]">Image URL</label>
                  <input
                    type="url"
                    value={image.url}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        images: newEntry.images.map((img, i) => (i === imageIndex ? { ...img, url: e.target.value } : img)),
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <div className="mb-6">
                  <label className="block mb-2 font-medium text-[#333]">Image Title</label>
                  <input
                    type="text"
                    value={image.title}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        images: newEntry.images.map((img, i) => (i === imageIndex ? { ...img, title: e.target.value } : img)),
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <div className="mb-6">
                  <label className="block mb-2 font-medium text-[#333]">Image Description</label>
                  <textarea
                    value={image.description}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        images: newEntry.images.map((img, i) => (i === imageIndex ? { ...img, description: e.target.value } : img)),
                      })
                    }
                    className={`${inputClass} resize-y min-h-[100px]`}
                  />
                </div>
              </div>
            ))}

            {(() => {
              const canAddEntry = newEntryComplete;
              return (
                <button
                  type="button"
                  onClick={handleAddEntry}
                  disabled={!canAddEntry}
                  style={{
                    background: '#17a2b8',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: canAddEntry ? 'pointer' : 'not-allowed',
                    opacity: canAddEntry ? 1 : 0.6,
                  }}
                >
                  Add Entry
                </button>
              );
            })()}
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <button
              type="submit"
              className="bg-[#28a745] text-white px-8 py-3 border-0 rounded-md cursor-pointer text-base font-semibold transition-all duration-300 hover:bg-[#218838] hover:-translate-y-0.5 w-full md:w-auto"
            >
              {isEditing ? 'Update Artwork' : 'Create Artwork'}
            </button>
            <Link
              href="/admin/artworks"
              className="bg-[#6c757d] text-white px-8 py-3 rounded-md cursor-pointer text-base font-semibold transition-all duration-300 inline-block hover:bg-[#5a6268] w-full md:w-auto text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export function ArtworkForm({ slug }: { slug?: string }) {
  return (
    <AdminGuard>
      <ArtworkFormContent slug={slug} />
    </AdminGuard>
  );
}
