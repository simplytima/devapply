import { NavLink } from "react-router-dom"
import { useState } from "react"

import {
  FiGrid,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi"


function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

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

  return (
    <aside className="w-72 min-h-screen bg-slate-900 border-r border-slate-800 p-5">
      
      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-violet-500">
          DevApply
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          Job Tracker Dashboard
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">

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
                className="text-slate-400 hover:text-white text-sm"
              >
                Profile
              </NavLink>

              <button className="text-left text-slate-400 hover:text-red-400 text-sm">
                Logout
              </button>
            </div>
          )}
        </div>

      </nav>
    </aside>
  )
}

export default Sidebar