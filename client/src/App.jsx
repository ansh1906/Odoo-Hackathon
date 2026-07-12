import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import Layout from "./components/Layout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/features/Dashboard";
import ComingSoon from "./components/ComingSoon";
import OrganizationSetup from "./pages/features/OrganizationSetup";
import Assets from "./pages/features/Assets";
import Allocation from "./pages/features/Allocation";
import ResourceBooking from "./pages/features/ResourceBooking";
import Audit from "./pages/features/Audit";
import Reports from "./pages/features/Reports";
import Notifications from "./pages/features/Notifications"; 


export default function App() {
  return (
    <AuthProvider>

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/organization-setup" element={<OrganizationSetup />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/allocation-transfer" element={<Allocation/>} />
            <Route path="/resource-booking" element={< ResourceBooking />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Routes>

    </AuthProvider>
  );
}