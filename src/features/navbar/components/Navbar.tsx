import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import "../navbar.css";

export const Navbar = () => {
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
              <Search size={18} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Links */}
        <ul className="nav-links">
          <li>
            <Link href="/contact" className="nav-link">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/about" className="nav-link">
              About
            </Link>
          </li>
          <li>
            <Link href="/login" className="login-btn">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
