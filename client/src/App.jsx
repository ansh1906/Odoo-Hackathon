import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import Layout from "./components/Layout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/features/Dashboard";
import ComingSoon from "./components/ComingSoon";
import OrganizationSetup from "./pages/features/OrganizationSetup";
import Assets from "./pages/features/Assets";


export default function App() {
  return (
    <AuthProvider>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />

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
            <Route path="/allocation-transfer" element={<ComingSoon title="Allocation & Transfer" />} />
            <Route path="/resource-booking" element={<ComingSoon title="Resource Booking" />} />
            <Route path="/maintenance" element={<ComingSoon title="Maintenance" />} />
            <Route path="/audit" element={<ComingSoon title="Audit" />} />
            <Route path="/reports" element={<ComingSoon title="Reports" />} />
            <Route path="/notifications" element={<ComingSoon title="Notifications" />} />
          </Route>
        </Routes>

    </AuthProvider>
  );
}