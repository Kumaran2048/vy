import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TransportProvider, useTransport } from './context/TransportContext';
import TransportLayout from './layouts/TransportLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BusPass from './pages/BusPass';
import TrackBus from './pages/TrackBus';
import TransportApplication from './components/TransportApplication';
import { Toaster } from 'react-hot-toast';

// Route protection wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useTransport();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  return (
    <Router>
      <TransportLayout>
        <Routes>
          {/* Public Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transport"
            element={
              <ProtectedRoute>
                <TransportApplication onClose={() => window.history.back()} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pass"
            element={
              <ProtectedRoute>
                <BusPass />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track"
            element={
              <ProtectedRoute>
                <TrackBus />
              </ProtectedRoute>
            }
          />
          
          {/* Default Redirection */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </TransportLayout>
    </Router>
  );
}

function App() {
  return (
    <TransportProvider>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#120d26',
            color: '#e2e8f0',
            border: '1px solid rgba(139, 92, 246, 0.15)',
            fontSize: '13px',
            fontWeight: '600',
            borderRadius: '12px'
          }
        }} 
      />
      <AppContent />
    </TransportProvider>
  );
}

export default App;
