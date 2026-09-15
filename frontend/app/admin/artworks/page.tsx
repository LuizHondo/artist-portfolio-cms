'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getArtworks } from '@/lib/api/artworks';
import { adminArtworksApi } from '@/lib/api/admin-artworks';
import type { Artwork } from '@/lib/types';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

function ArtworksContent() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setArtworks(await getArtworks());
    } catch (err) {
      setError('Failed to load artworks');
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artwork?')) return;
    try {
      await adminArtworksApi.delete(id);
      setArtworks((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError('Failed to delete artwork');
      console.error('Failed to delete:', err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 min-h-[calc(100vh-200px)]">
      <AdminSidebar />

      <main className="bg-white p-8 rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
        <h1 className="mt-0 text-[#333] mb-8">Manage Artworks</h1>

        <Link
          href="/admin/artworks/new"
          className="bg-[#28a745] text-white px-6 py-3 rounded-md cursor-pointer text-base mb-6 transition-all duration-300 inline-block hover:bg-[#218838] hover:-translate-y-0.5"
        >
          + Create New Artwork
        </Link>

        {error && (
          <div className="p-4 rounded-md mb-6 font-medium bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb]">{error}</div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading artworks...</div>
        ) : artworks.length === 0 ? (
          <p>No artworks found. Create your first one!</p>
        ) : (
          <table className="w-full border-collapse text-[0.9rem] md:text-base">
            <thead className="bg-[#f8f9fa] border-b-2 border-[#ddd]">
              <tr>
                <th className="p-2 md:p-4 text-left font-semibold text-[#333]">Title</th>
                <th className="p-2 md:p-4 text-left font-semibold text-[#333]">Medium</th>
                <th className="p-2 md:p-4 text-left font-semibold text-[#333]">Year</th>
                <th className="p-2 md:p-4 text-left font-semibold text-[#333]">Featured Priority</th>
                <th className="p-2 md:p-4 text-left font-semibold text-[#333]">Entries</th>
                <th className="p-2 md:p-4 text-left font-semibold text-[#333]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {artworks.map((artwork) => (
                <tr key={artwork.id} className="hover:bg-[#f8f9fa]">
                  <td className="p-2 md:p-4 border-b border-[#eee]">
                    <strong>{artwork.title}</strong>
                  </td>
                  <td className="p-2 md:p-4 border-b border-[#eee]">{artwork.medium}</td>
                  <td className="p-2 md:p-4 border-b border-[#eee]">{artwork.yearCreated}</td>
                  <td className="p-2 md:p-4 border-b border-[#eee]">{artwork.featuredPriority || 'Not featured'}</td>
                  <td className="p-2 md:p-4 border-b border-[#eee]">{artwork.entries.length}</td>
                  <td className="p-2 md:p-4 border-b border-[#eee]">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/artworks/${artwork.slug}/edit`}
                        className="px-[0.8rem] py-[0.4rem] rounded text-[0.9rem] transition-all duration-300 inline-block bg-indigo-500 text-white hover:bg-[#5568d3]"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(artwork.id)}
                        className="px-[0.8rem] py-[0.4rem] border-0 rounded cursor-pointer text-[0.9rem] transition-all duration-300 bg-[#dc3545] text-white hover:bg-[#c82333]"
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

export default function AdminArtworks() {
  return (
    <AdminGuard>
      <ArtworksContent />
    </AdminGuard>
  );
}
