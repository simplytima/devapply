import Sidebar from "../components/Sidebar"
import { Outlet } from "react-router-dom"

function MainLayout() {
  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>

    </div>
  )
}

export default MainLayout