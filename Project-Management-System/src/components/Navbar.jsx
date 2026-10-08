import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Bell, User } from "lucide-react";

export const Navbar = ({ onMenuClick }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      {/* Left: mobile menu toggle + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={22} />
        </button>
        <NavLink to="/dashboard" className="text-lg font-bold text-gray-900">
          MyApp
        </NavLink>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="rounded-full p-2 text-gray-600 hover:bg-gray-100">
          <Bell size={20} />
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen((p) => !p)}
            className="flex items-center gap-2 rounded-full p-1.5 hover:bg-gray-100"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
              <User size={16} />
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
              <NavLink
                to="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </NavLink>
              <button onClick={()=>setIsLoggedIn(false)} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};