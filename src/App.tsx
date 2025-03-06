import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Counselor from './pages/Counselor';
import About from './pages/About';
import Selection from './pages/Selections';

function AppContent() {
  const location = useLocation();

  const hideNavbarRoutes = ['/login', '/register', '/'];

  // Special handling for About page - check if we came from home
  const isAboutFromHome = location.pathname === '/about' && location.state?.from === '/';

  // Hide navbar if the route is in hideNavbarRoutes or if it's the About page and we came from Home
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname) || isAboutFromHome;

  return (
    <div className="min-h-screen">
      {!shouldHideNavbar && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/counselor" element={<Counselor />} />
          <Route path="/selection" element={<Selection />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
