import { NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import {
  FiGrid,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi"

function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { name: "Dashboard", path: "/", icon: <FiGrid size={20} /> },
    { name: "Applications", path: "/applications", icon: <FiFileText size={20} /> },
    { name: "Analytics", path: "/analytics", icon: <FiBarChart2 size={20} /> },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <h1 className="text-3xl font-bold text-violet-500">DevApply</h1>
        </div>
        <p className="text-slate-400 text-sm mt-1 ml-10">Job Tracker Dashboard</p>
      </div>

      {/* User Profile */}
      {user && (
        <div className="mb-6 p-3 bg-slate-800/50 rounded-xl">
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive ? "bg-violet-500 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}

        {/* Settings & Logout */}
        <div className="mt-auto pt-4 border-t border-slate-800">
          <NavLink
            to="/profile"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            <FiSettings size={20} />
            <span>Settings</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all mt-1"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  )

  return (
    <>
      {/* ✅ Desktop Sidebar - Always visible on large screens */}
      <aside className="hidden md:flex w-72 min-h-screen bg-slate-900 border-r border-slate-800 p-5 flex-col fixed left-0 top-0 bottom-0 z-40">
        <SidebarContent />
      </aside>

      {/* ✅ Mobile - Only the hamburger icon is visible */}
      <div className="md:hidden">
        {/* Hamburger Menu Button - Fixed top-left */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 z-50 bg-slate-800 p-2 rounded-lg text-white hover:bg-slate-700 transition-colors"
        >
          <FiMenu size={24} />
        </button>

        {/* Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile Sidebar - Slides in from left */}
        <div
          className={`fixed top-0 left-0 h-full w-80 bg-slate-900 border-r border-slate-800 p-5 z-50 transition-transform duration-300 ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setIsMobileOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
          <SidebarContent />
        </div>
      </div>

      {/* ✅ Main content spacing - desktop has sidebar offset */}
      <div className="md:ml-72 flex-1">
        {/* This div handles the sidebar offset on desktop */}
      </div>
    </>
  )
}

export default Sidebar