import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ArtworkPage from './pages/ArtworkPage';
import AdminDashboard from './pages/admin/Dashboard';
import AdminArtworks from './pages/admin/Artworks';
import AdminArtworkForm from './pages/admin/ArtworkForm';
import LoginPage from './pages/admin/Login';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/artwork/:slug" element={<ArtworkPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />

          {isAuthenticated && (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/artworks" element={<AdminArtworks />} />
              <Route path="/admin/artworks/new" element={<AdminArtworkForm />} />
              <Route path="/admin/artworks/:id/edit" element={<AdminArtworkForm />} />
            </>
          )}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
