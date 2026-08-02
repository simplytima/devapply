import Sidebar from "../components/Sidebar"
import { Outlet } from "react-router-dom"

function MainLayout() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mt-14 md:mt-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainLayout