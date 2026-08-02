import Sidebar from "../components/Sidebar"
import { Outlet } from "react-router-dom"

function MainLayout() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />
      {/* Main content - with sidebar offset on desktop */}
      <main className="flex-1 md:ml-72 min-h-screen overflow-y-auto">
        <div className="p-4 md:p-6 pt-16 md:pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainLayout