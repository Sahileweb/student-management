import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import AdminSignup from './pages/Admin/AdminSignup';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import StudentLogin from './pages/Student/StudentLogin';
import StudentDashboard from './pages/Student/StudentDashboard';
import AdminTasks from './pages/Admin/AdminTasks';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
<Routes>
  <Route path="/" element={<Landing />} />

  <Route path="/admin/signup" element={<AdminSignup />} />
  
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route 
    path="/admin/dashboard" 
    element={
      <ProtectedRoute allowedRole={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    } 
  />
  
  <Route
    path="/admin/tasks"
    element={
      <ProtectedRoute allowedRole={['admin']}>
        <AdminTasks />
      </ProtectedRoute>
    }
  />
 
  <Route path="/student/login" element={<StudentLogin />} />
  <Route
    path="/student/dashboard"
    element={
      <ProtectedRoute allowedRole={['student']}>
        <StudentDashboard />
      </ProtectedRoute>
    }
  />
  
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
