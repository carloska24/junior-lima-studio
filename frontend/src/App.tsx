import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { LandingPage } from '@/pages/Landing';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Dashboard } from '@/pages/Admin/Dashboard';
import { Agenda } from '@/pages/Admin/Agenda';
import { Clients } from '@/pages/Admin/Clients';
import { Services } from '@/pages/Admin/Services';
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
              {/* Future routes will go here */}
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
