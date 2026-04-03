import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  path: string;
  hasDropdown?: boolean;
}

interface AdminMenuItem {
  label: string;
  path: string;
}

const adminMenuItems: AdminMenuItem[] = [
  { label: 'Project Statuses', path: '/admin/statuses' },
  { label: 'Request Types', path: '/admin/request-types' },
  { label: 'Proposal Tags', path: '/admin/proposal-tags' },
  { label: 'Photo Categories', path: '/admin/photo-categories' },
  { label: 'Document Categories', path: '/admin/document-categories' },
  { label: 'Customer Status', path: '/admin/customer-status' },
];

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Customers', path: '/customers' },
  { label: 'Tools', path: '/tools' },
  { label: 'Users', path: '/users' },
  { label: 'Admin', path: '/admin', hasDropdown: true },
  { label: 'Settings', path: '/settings' },
];

export const NavBar: React.FC = () => {
  const location = useLocation();
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAdminDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when navigating
  useEffect(() => {
    setAdminDropdownOpen(false);
  }, [location.pathname]);

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setAdminDropdownOpen(!adminDropdownOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center">
            <img
              src="/fence-boys-logo.jpg"
              alt="FenceBoysOS"
              className="h-12 w-auto rounded-lg mr-3"
            />
            <span className="font-semibold text-gray-900">FenceBoysOS</span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              item.hasDropdown ? (
                <div key={item.path} className="relative" ref={dropdownRef}>
                  <button
                    onClick={handleAdminClick}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center
                      ${isActive(item.path)
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }
                    `}
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 ml-1 transition-transform ${adminDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {adminDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      {adminMenuItems.map((menuItem) => (
                        <Link
                          key={menuItem.path}
                          to={menuItem.path}
                          className={`
                            block px-4 py-2 text-sm transition-colors
                            ${location.pathname === menuItem.path
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-gray-700 hover:bg-gray-100'
                            }
                          `}
                        >
                          {menuItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* User Avatar */}
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-sm font-medium">U</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
