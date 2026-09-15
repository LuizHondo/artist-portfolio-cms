'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getArtworks, getFeatured } from '@/lib/api/artworks';
import type { Artwork } from '@/lib/types';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

function DashboardContent() {
  const [stats, setStats] = useState({ total: 0, featured: 0 });
  const [recentArtworks, setRecentArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [all, featured] = await Promise.all([getArtworks(), getFeatured()]);
        setStats({ total: all.length, featured: featured.length });
        setRecentArtworks(all.slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 min-h-[calc(100vh-200px)]">
      <AdminSidebar />

      <main className="bg-white p-8 rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
        <h1 className="mt-0 text-[#333] mb-8">Dashboard</h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
              <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '2rem', borderRadius: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Total Artworks</h3>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: 'bold' }}>{stats.total}</p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '2rem', borderRadius: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Featured</h3>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: 'bold' }}>{stats.featured}</p>
              </div>
            </div>

            <h2>Recent Artworks</h2>
            <Link
              href="/admin/artworks/new"
              className="bg-[#28a745] text-white px-6 py-3 rounded-md cursor-pointer text-base mb-6 transition-all duration-300 inline-block hover:bg-[#218838] hover:-translate-y-0.5"
            >
              + Create New Artwork
            </Link>

            {recentArtworks.length === 0 ? (
              <p>No artworks yet. Create your first artwork!</p>
            ) : (
              <table className="w-full border-collapse text-[0.9rem] md:text-base">
                <thead className="bg-[#f8f9fa] border-b-2 border-[#ddd]">
                  <tr>
                    <th className="p-2 md:p-4 text-left font-semibold text-[#333]">Title</th>
                    <th className="p-2 md:p-4 text-left font-semibold text-[#333]">Medium</th>
                    <th className="p-2 md:p-4 text-left font-semibold text-[#333]">Year</th>
                    <th className="p-2 md:p-4 text-left font-semibold text-[#333]">Featured</th>
                    <th className="p-2 md:p-4 text-left font-semibold text-[#333]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentArtworks.map((artwork) => (
                    <tr key={artwork.id} className="hover:bg-[#f8f9fa]">
                      <td className="p-2 md:p-4 border-b border-[#eee]">
                        <strong>{artwork.title}</strong>
                      </td>
                      <td className="p-2 md:p-4 border-b border-[#eee]">{artwork.medium}</td>
                      <td className="p-2 md:p-4 border-b border-[#eee]">{artwork.yearCreated}</td>
                      <td className="p-2 md:p-4 border-b border-[#eee]">
                        {artwork.featuredPriority > 0 ? `Priority ${artwork.featuredPriority}` : 'No'}
                      </td>
                      <td className="p-2 md:p-4 border-b border-[#eee]">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/artworks/${artwork.slug}/edit`}
                            className="px-[0.8rem] py-[0.4rem] rounded text-[0.9rem] transition-all duration-300 inline-block bg-indigo-500 text-white hover:bg-[#5568d3]"
                          >
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

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  );
}
