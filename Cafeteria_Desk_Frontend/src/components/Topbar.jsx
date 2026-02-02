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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <h1 className="font-semibold text-xl text-gray-800 tracking-wide">
          Cafeteria & Desk Booking
        </h1>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 bg-white/60 hover:bg-white/80 px-4 py-2 rounded-full shadow transition"
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold uppercase">
              {user?.email?.[0]}
            </div>
            <span className="hidden sm:block text-gray-700 font-medium">
              {user?.email}
            </span>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl p-4 animate-fade-in">
              
              <div className="mb-3">
                <p className="text-sm text-gray-500">Signed in as</p>
                <p className="font-semibold text-gray-800 truncate">
                  {user?.email}
                </p>
                <span className="inline-block mt-1 text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                  {user?.role}
                </span>
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
