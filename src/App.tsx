import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { useStore } from './lib/store';
import Login from './pages/Login';
import LearningPath from './pages/LearningPath';
import Lesson from './pages/Lesson';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useStore();
  if (!currentUser) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useStore();
  if (!currentUser) return <Navigate to="/" replace />;
  if (!currentUser.isAdmin) return <Navigate to="/learn" replace />;
  return <>{children}</>;
}

export default function App() {
  const { currentUser } = useStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={currentUser ? <Navigate to="/learn" replace /> : <Login />} />
        <Route path="/learn" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
        <Route path="/lesson/:lessonId" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}
