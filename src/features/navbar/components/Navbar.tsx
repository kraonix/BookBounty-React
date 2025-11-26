/**
 * Navbar Component
 * 
 * The top navigation bar for the application.
 * 
 * Features:
 * - Logo and branding.
 * - Navigation links (Home, Categories, etc.).
 * - User authentication status (Login/Signup vs Profile).
 * - Admin link (visible only to admins).
 * - Sticky positioning with scroll effect.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, LogOut, Heart, Settings, ArrowLeft, Info, Phone } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import "@/features/navbar/navbar.css";

export const Navbar = () => {
  const { data: session } = useSession();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <>
      <nav className={`navbar ${isMobileSearchOpen ? "mobile-search-active" : ""}`}>
        <div className="navbar-container">
          {/* Logo */}
          {/* Logo */}
          <Link href="/" className={`navbar-logo ${isMobileSearchOpen ? "hidden-mobile" : ""}`}>
            <Image
              src="/logo.png"
              alt="BookBounty Logo"
              width={270}
              height={70}
              priority
            />
          </Link>

          {/* Search Bar */}
          <div className={`search-container ${isMobileSearchOpen ? "active" : ""}`}>
            {isMobileSearchOpen && (
              <button
                className="mobile-back-btn"
                onClick={() => setIsMobileSearchOpen(false)}
              >
                <ArrowLeft size={24} />
              </button>
            )}
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

          {/* Mobile Search Toggle */}
          {!isMobileSearchOpen && (
            <button
              className="mobile-search-toggle"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <Search size={24} />
            </button>
          )}

          {/* Navigation Links */}
          <ul className={`nav-links ${isMobileSearchOpen ? "hidden-mobile" : ""}`}>
            <li><Link href="/contact" className="nav-link desktop-only">Contact</Link></li>
            <li><Link href="/about" className="nav-link desktop-only">About</Link></li>

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
                    <span className="text-xs text-gray-500">Role: {session.user?.role || "none"}</span>
                  </div>
                  <div className="dropdown-divider" />
                  <Link href="/profile" className="dropdown-item">
                    <User size={16} /> Profile
                  </Link>
                  {session.user?.role === "admin" && (
                    <Link href="/admin" className="dropdown-item">
                      <Settings size={16} /> Admin Page
                    </Link>
                  )}
                  {/* Mobile-only menu items */}
                  <div className="mobile-menu-items">
                    <Link href="/contact" className="dropdown-item">
                      <Phone size={16} /> Contact
                    </Link>
                    <Link href="/about" className="dropdown-item">
                      <Info size={16} /> About
                    </Link>
                  </div>
                  <div className="dropdown-divider" />
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
      <div style={{ height: "80px" }} />
    </>
  );
};
