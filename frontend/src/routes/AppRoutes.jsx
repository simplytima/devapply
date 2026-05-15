import { Routes, Route } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import ProtectedRoute from "../components/ProtectedRoute"
import Dashboard from "../pages/Dashboard"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Applications from "../pages/Applications"
import Analytics from "../pages/Analytics"
// import AddJob from "../pages/AddJob"
import Profile from "../pages/Profile"

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes with layout */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes