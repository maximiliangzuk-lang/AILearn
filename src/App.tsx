import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useStore } from './lib/store';
import Login from './pages/Login';
import LearningPath from './pages/LearningPath';
import Lesson from './pages/Lesson';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

type AuthContextType = {
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ loading: true });

function useAuthLoading() {
  return useContext(AuthContext);
}

/**
 * Sync Supabase Auth mit Zustand Store
 */
function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const { setCurrentUser } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function mapUser(user: any, isAdmin: boolean) {
      return {
        id: user.id,
        username: user.email ?? 'User',
        email: user.email ?? '',
        password: '',
        isAdmin,
        createdAt: new Date().toISOString(),
        streak: 1,
        lastActiveDate: new Date().toISOString(),
        totalXP: 0,
        hearts: 5,
        gems: 0,
      };
    }

    async function fetchUser(sessionUser: any) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', sessionUser.id)
          .single();

        const isAdmin = profile?.role === 'admin';
        return await mapUser(sessionUser, isAdmin);
      } catch {
        return await mapUser(sessionUser, false);
      }
    }

    async function init() {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data?.session ?? null;

        if (session?.user && mounted) {
          const user = await fetchUser(session.user);
          setCurrentUser(user);
        } else if (mounted) {
          setCurrentUser(null);
        }
      } catch {
        if (mounted) setCurrentUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        const user = await fetchUser(session.user);
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      mounted = false;
      try {
        listener.subscription.unsubscribe();
      } catch {
        // ignore
      }
    };
  }, [setCurrentUser]);

  return (
    <AuthContext.Provider value={{ loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Protected Route
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useStore();
  const { loading } = useAuthLoading();

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/" replace />;
  return <>{children}</>;
}

/**
 * Admin Route
 */
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useStore();
  const { loading } = useAuthLoading();

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/" replace />;
  if (!currentUser.isAdmin) return <Navigate to="/learn" replace />;
  return <>{children}</>;
}

/**
 * App Router
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthSyncProvider>
        <Routes>
          <Route path="/" element={<AuthLandingGuard />} />
          <Route path="/learn" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
          <Route path="/lesson/:lessonId" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthSyncProvider>
    </BrowserRouter>
  );
}

/**
 * Root Guard
 */
function AuthLandingGuard() {
  const { currentUser } = useStore();
  const { loading } = useAuthLoading();

  if (loading) return <div>Loading...</div>;
  return currentUser ? <Navigate to="/learn" replace /> : <Login />;
}