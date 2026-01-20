import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { LandingPage } from '@/pages/Landing';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Dashboard } from '@/pages/Admin/Dashboard';
import { Agenda } from '@/pages/Admin/Agenda';
import { Clients } from '@/pages/Admin/Clients';
import { Services } from '@/pages/Admin/Services';
import { Users } from '@/pages/Admin/Users';
import { Profile } from '@/pages/Admin/Profile';
import { SettingsPage } from '@/pages/Admin/Settings';
import { Login } from '@/pages/Auth/Login';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="agenda" element={<Agenda />} />
              <Route path="clients" element={<Clients />} />
              <Route path="services" element={<Services />} />
              <Route path="users" element={<Users />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
