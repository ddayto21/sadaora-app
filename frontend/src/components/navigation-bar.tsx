// src/components/Sidebar.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Home, Search, Plus, MessageCircle, User, Bell } from "lucide-react";
import { checkAuth, logout } from "../api/auth";
import { useAuth } from "../hooks/useAuth";

export const NavigationBar = () => {
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const userEmail = user?.email || "";
  const userName = user?.name || "";

  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!loading) {
      checkAuth()
        .then((user) => {
          console.log("User is authenticated:", user);
        })
        .catch((error) => {
          console.error("User is not authenticated:", error);
          setError(error);
          navigate("/login");
        });
    }
  }, [loading, setUser, navigate]);

  // Handle click outside menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login");
  };

  if (loading) return null;

  return (
    <aside className="hidden lg:flex flex-col justify-between h-screen fixed left-0 top-0 w-64 bg-black border-r border-neutral-800 py-10 px-6 text-white font-sans">
      <div>
        <img
          src="/images/sadaora-text.png"
          alt="Sadaora Text Logo"
          className="w-36 h-auto mb-10 invert opacity-95"
        />

        <nav className="flex flex-col gap-5 text-sm text-gray-300">
          {[
            "/",
            "/explore",
            "/create",
            "/messages",
            "/notifications",
            "/profile",
          ].map((path, idx) => {
            const labels = [
              "Home",
              "Explore",
              "Create",
              "Messages",
              "Notifications",
              "Profile",
            ];
            const icons = [Home, Search, Plus, MessageCircle, Bell, User];
            const Icon = icons[idx];
            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-2 py-2 rounded-md transition-all duration-150 ${
                    isActive
                      ? "text-white"
                      : "hover:text-white hover:bg-neutral-800"
                  }`
                }
              >
                <Icon className="h-5 w-5" /> {labels[idx]}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Account Control */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-full flex items-center justify-between px-2 py-3 rounded-md hover:bg-neutral-800 transition"
        >
          <div className="flex items-center gap-3">
            <img
              src="/placeholder-avatar.png"
              alt="User"
              className="h-9 w-9 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium">
                {userName} <span className="text-gray-500 ml-1">🔒</span>
              </p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
          </div>
          <span className="text-gray-500 text-xl">···</span>
        </button>

        {showMenu && (
          <div className="absolute bottom-16 left-0 w-full bg-neutral-900 border border-neutral-700 rounded-lg shadow-md p-2 text-sm z-10">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-neutral-800 rounded-md"
            >
              Log out {userEmail}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
