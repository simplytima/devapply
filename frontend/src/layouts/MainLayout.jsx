import Sidebar from "../components/Sidebar"
import { Outlet } from "react-router-dom"

function MainLayout() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />
      {/* Main content - automatically offset by sidebar spacer */}
      <main className="flex-1 min-h-screen overflow-y-auto w-full">
        <div className="p-4 md:p-6 pt-16 md:pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainLayout