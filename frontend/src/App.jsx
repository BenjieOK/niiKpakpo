import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollButton from './components/ScrollButton';
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import HeroManager from './admin/HeroManager';
import BlogManager from './admin/BlogManager';
import ProjectManager from './admin/ProjectManager';
import MessagesInbox from './admin/MessagesInbox';
import SiteSettingsPage from './admin/SiteSettingsPage';
import ExpertiseManager from './admin/ExpertiseManager';
import CategoriesManager from './admin/CategoriesManager';
import UserManager from './admin/UserManager';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ScrollButton />
    </>
  );
}

function RequireAuth({ children }) {
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/portfolio" element={<PublicLayout><Portfolio /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
          <Route index element={<Dashboard />} />
          <Route path="hero" element={<HeroManager />} />
          <Route path="blog" element={<BlogManager />} />
          <Route path="projects" element={<ProjectManager />} />
          <Route path="messages" element={<MessagesInbox />} />
          <Route path="settings" element={<SiteSettingsPage />} />
          <Route path="expertise" element={<ExpertiseManager />} />
          <Route path="categories" element={<CategoriesManager />} />
          <Route path="users" element={<UserManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
