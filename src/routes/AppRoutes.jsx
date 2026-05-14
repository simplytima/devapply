import { Routes, Route } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import Dashboard from "../pages/Dashboard"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Applications from "../pages/Applications"
import Analytics from "../pages/Analytics"
import AddJob from "../pages/AddJob"
import Profile from "../pages/Profile"

function AppRoutes() {
  return (
    <Routes>
      {/* Layout routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/add-job" element={<AddJob />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default AppRoutes