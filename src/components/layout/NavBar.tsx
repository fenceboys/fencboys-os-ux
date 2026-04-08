import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Customers', path: '/customers' },
  { label: 'Tools', path: '/tools' },
  { label: 'Users', path: '/users' },
  { label: 'Admin', path: '/admin' },
  { label: 'Settings', path: '/settings' },
];

export const NavBar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
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
