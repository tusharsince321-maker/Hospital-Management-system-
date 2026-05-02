import React from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Sahayak from "./components/Sahayak";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Appointment from "./pages/Appointment";
import MyAppointments from "./pages/MyAppointments";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Department from "./pages/Department";
import Doctors from "./pages/Doctors";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAppointments from "./pages/admin/Appointments";
import AdminDoctors from "./pages/admin/Doctors";
import AdminAddDoctor from "./pages/admin/AddDoctor";
import AdminEditDoctor from "./pages/admin/EditDoctor";
import AdminAddAdmin from "./pages/admin/AddAdmin";
import AdminMessages from "./pages/admin/Messages";
import AdminNotFound from "./pages/admin/NotFound";

// Admin Components
import AdminProtectedRoute from "./components/admin/ProtectedRoute";
import RoleRoute from "./components/admin/RoleRoute";

import { useAuth } from "./state/AuthContext";
import { Navigate } from "react-router-dom";

const AdminLoginGate = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/admin" replace />;
  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Admin Portal */}
      <Route path="/admin">
        <Route
          path="login"
          element={
            <AdminLoginGate>
              <Login defaultRole="Admin" />
            </AdminLoginGate>
          }
        />
        <Route
          index
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="appointments"
          element={
            <AdminProtectedRoute>
              <AdminAppointments />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="doctors"
          element={
            <AdminProtectedRoute>
              <RoleRoute allow={["Admin"]}>
                <AdminDoctors />
              </RoleRoute>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="doctors/add"
          element={
            <AdminProtectedRoute>
              <RoleRoute allow={["Admin"]}>
                <AdminAddDoctor />
              </RoleRoute>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="doctors/:id/edit"
          element={
            <AdminProtectedRoute>
              <RoleRoute allow={["Admin"]}>
                <AdminEditDoctor />
              </RoleRoute>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="admins/add"
          element={
            <AdminProtectedRoute>
              <RoleRoute allow={["Admin"]}>
                <AdminAddAdmin />
              </RoleRoute>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="messages"
          element={
            <AdminProtectedRoute>
              <RoleRoute allow={["Admin"]}>
                <AdminMessages />
              </RoleRoute>
            </AdminProtectedRoute>
          }
        />
        <Route path="*" element={<AdminNotFound />} />
      </Route>

      {/* Patient Portal */}
      <Route
        path="*"
        element={
          <div className="min-h-full">
            <Navbar />
            <Sahayak />
            <main className="min-h-[calc(100vh-140px)]">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/department" element={<Department />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/appointment"
                  element={
                    <ProtectedRoute>
                      <Appointment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-appointments"
                  element={
                    <ProtectedRoute>
                      <MyAppointments />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        }
      />
    </Routes>
  );
};

export default App;

