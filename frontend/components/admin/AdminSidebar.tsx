'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const menuLinkClass = 'block px-4 py-3 text-[#666] rounded-md transition-all duration-300 hover:bg-indigo-500 hover:text-white';
const menuLinkActiveClass = 'block px-4 py-3 rounded-md transition-all duration-300 bg-indigo-500 text-white';

export function AdminSidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <aside className="bg-[#f8f9fa] p-8 rounded-lg h-fit flex gap-4 md:block">
      <h2 className="text-[1.3rem] mb-6 text-[#333]">Admin Menu</h2>
      <ul className="list-none p-0 m-0 flex gap-2 flex-wrap md:block">
        <li className="mb-2 flex-1 min-w-[100px] md:flex-none md:min-w-0">
          <Link href="/admin" className={pathname === '/admin' ? menuLinkActiveClass : menuLinkClass}>
            Dashboard
          </Link>
        </li>
        <li className="mb-2 flex-1 min-w-[100px] md:flex-none md:min-w-0">
          <Link href="/admin/artworks" className={pathname?.startsWith('/admin/artworks') ? menuLinkActiveClass : menuLinkClass}>
            Manage Artworks
          </Link>
        </li>
      </ul>

      <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ddd' }}>
        <p>
          <strong>Logged in as:</strong>
        </p>
        <p style={{ color: '#667eea', margin: 0 }}>{admin?.email}</p>
        <button onClick={handleLogout} className="mt-4 text-sm text-[#666] underline hover:text-[#333]">
          Log out
        </button>
      </div>
    </aside>
  );
}
