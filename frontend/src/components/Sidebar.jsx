import { NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import {
  FiGrid,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiChevronDown,
  FiLogOut,
} from "react-icons/fi"

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <FiGrid size={20} />,
    },
    {
      name: "Applications",
      path: "/applications",
      icon: <FiFileText size={20} />,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <FiBarChart2 size={20} />,
    },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-72 h-full bg-slate-900 border-r border-slate-800 p-5 flex flex-col">
      
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
            DevApply
          </h1>
        </div>
        <p className="text-slate-400 text-sm mt-2">
          Job Tracker Dashboard
        </p>
      </div>

      {/* User Profile Summary */}
      {user && (
        <div className="mb-6 p-3 bg-slate-800/50 rounded-xl">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
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
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${
                isActive
                  ? "bg-violet-500 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}

        {/* Settings Dropdown */}
        <div className="mt-auto pt-4 border-t border-slate-800">
          <div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <FiSettings size={20} />
                <span>Settings</span>
              </div>
              <FiChevronDown
                size={18}
                className={`transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="ml-6 mt-2 flex flex-col gap-2">
                <NavLink
                  to="/profile"
                  className="text-slate-400 hover:text-white text-sm py-1"
                >
                  Profile
                </NavLink>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm py-1 transition-colors"
                >
                  <FiLogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar