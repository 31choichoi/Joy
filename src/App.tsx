import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Booking from './pages/Booking';
import Admin from './pages/Admin';
import BundangInterior from './pages/BundangInterior';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/bundang-interior" element={<BundangInterior />} />
          </Routes>
        </Layout>
      </Router>
    </HelmetProvider>
  );
}

