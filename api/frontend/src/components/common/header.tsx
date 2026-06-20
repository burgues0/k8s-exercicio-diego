"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

function LogoutButton() {
  const router = useRouter();
  const handleLogout = () => {
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };
  return (
    <button
      onClick={handleLogout}
      className="ml-4 px-6 py-1 bg-[#2C607A] text-white rounded hover:bg-[#22506a] transition-colors"
    >
      Sair
    </button>
  );
}

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <header
      style={{ background: '#F1860C', boxShadow: '0 16px 48px 0 rgba(0,0,0,0.28)', zIndex: 50, position: 'relative' }}
      className="text-white p-4 shadow-2xl"
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center h-10">
          <Link href="/">
            <img
              src="/logo.png"
              alt="Logo"
              style={{ height: 45, width: 'auto', objectFit: 'contain', display: 'block' }}
              className="drop-shadow cursor-pointer"
              draggable={false}
            />
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-4 items-center">
        <li>
          <Link
            href="/"
            className={
          `header-home-link relative transition-colors duration-150 ` +
          (isHome ? "active text-white" : "text-white")
            }
          >
            Página inicial
          </Link>
        </li>
        <li><LogoutButton /></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}