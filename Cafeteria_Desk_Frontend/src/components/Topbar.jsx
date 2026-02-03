import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <h1 className="font-bold text-lg md:text-xl text-gray-800 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 truncate max-w-[200px] md:max-w-none">
            Cafeteria Management and Desk Booking System
          </h1>
        </div>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="group flex items-center gap-3 bg-white hover:bg-white/80 pr-4 pl-1 py-1 rounded-full shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300"
          >
            <div className={`w-9 h-9 flex items-center justify-center rounded-full text-white shadow-md transition-transform group-hover:scale-105 overflow-hidden ${user?.role === 'cafeteria_admin' ? 'bg-orange-100' :
                user?.role === 'desk_admin' ? 'bg-blue-100' :
                  'bg-indigo-100'
              }`}>
              <User className={`w-5 h-5 ${user?.role === 'cafeteria_admin' ? 'text-orange-600' :
                  user?.role === 'desk_admin' ? 'text-blue-600' :
                    'text-indigo-600'
                }`} />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none gap-0.5">
              <span className="text-gray-700 font-semibold text-sm">
                {user?.name || "User"}
              </span>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                {user?.role?.replace('_', ' ')}
              </span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-3 w-72 rounded-3xl bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 p-4 animate-in fade-in slide-in-from-top-2 duration-200">

              <div className="flex items-center gap-4 mb-4 p-2 bg-gray-50/50 rounded-2xl">
                <div className={`w-12 h-12 flex items-center justify-center rounded-2xl text-white font-bold text-xl shadow-inner ${user?.role === 'cafeteria_admin' ? 'bg-orange-500' :
                  user?.role === 'desk_admin' ? 'bg-blue-500' :
                    'bg-indigo-600'
                  }`}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 leading-tight">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 font-medium truncate max-w-[140px]">
                    {user?.email}
                  </p>
                </div>
              </div>

              <hr className="my-3" />

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-gray-700"
              >
                <User size={16} /> My Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-lg hover:bg-red-100 text-red-600 transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
