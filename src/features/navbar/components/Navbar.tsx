"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, LogOut, Heart, Settings } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import "../navbar.css";

export const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <Image
            src="/logo.png"
            alt="BookBounty Logo"
            width={270}
            height={70}
            priority
          />
        </Link>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search Book..."
              className="search-input"
            />
            <button className="search-btn">
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li><Link href="/contact" className="nav-link">Contact</Link></li>
          <li><Link href="/about" className="nav-link">About</Link></li>

          {session ? (
            <li className="profile-menu-container">
              <button className="profile-btn">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="profile-img"
                    unoptimized
                  />
                ) : (
                  <div className="profile-placeholder">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <span className="user-name">{session.user?.name}</span>
                  <span className="user-email">{session.user?.email}</span>
                </div>
                <div className="dropdown-divider" />
                <Link href="/profile" className="dropdown-item">
                  <User size={16} /> Profile
                </Link>
                <Link href="/wishlist" className="dropdown-item">
                  <Heart size={16} /> Wishlist
                </Link>
                <Link href="/settings" className="dropdown-item">
                  <Settings size={16} /> Settings
                </Link>
                <div className="dropdown-divider" />
                <button onClick={() => signOut()} className="dropdown-item danger">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </li>
          ) : (
            <li><Link href="/login" className="login-btn">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};
