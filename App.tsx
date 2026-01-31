
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Admission from './pages/Admission';
import Results from './pages/Results';
import Notices from './pages/Notices';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Exams from './pages/Exams';
import AdminDashboard from './pages/AdminDashboard';
import StudentProfilePage from './pages/StudentProfilePage';
import { UserRole } from './types';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('sia_user_role');
    return (savedRole as UserRole) || UserRole.GUEST;
  });

  const [currentUser, setCurrentUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('sia_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Initial Data Fetch from Hosting Server
  useEffect(() => {
    const fetchServerData = async () => {
      try {
        // Only attempt to fetch if api.php exists and we are on a web server
        const response = await fetch('api.php', { cache: 'no-store' });
        
        if (!response.ok) {
            console.warn("Cloud DB not initialized or not found. Falling back to local data.");
            return;
        }

        const data = await response.json();
        
        // Skip if response is an error message or empty status
        if (data.error || data.status === 'new' || data.status === 'empty') {
            console.log("No existing cloud data found. Initializing with local data...");
            return;
        }

        // Only sync if we have meaningful data
        if (data.settings || data.notices || data.staff) {
          if (data.settings) localStorage.setItem('sia_site_settings', JSON.stringify(data.settings));
          if (data.notices) localStorage.setItem('sia_notices', JSON.stringify(data.notices));
          if (data.staff) localStorage.setItem('sia_staff', JSON.stringify(data.staff));
          if (data.gallery) localStorage.setItem('sia_gallery', JSON.stringify(data.gallery));
          if (data.courses) localStorage.setItem('sia_courses', JSON.stringify(data.courses));
          if (data.students) localStorage.setItem('sia_students_db', JSON.stringify(data.students));
          console.log("✅ Server data successfully synced to your browser.");
        }
      } catch (err) {
        // Silently fail locally or provide clear instructions
        console.log("ℹ️ Cloud sync status: Offline or Localhost. Local storage in use.");
      }
    };
    fetchServerData();
  }, []);

  useEffect(() => {
    localStorage.setItem('sia_user_role', role);
    if (currentUser) {
      localStorage.setItem('sia_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sia_current_user');
    }
  }, [role, currentUser]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar role={role} setRole={setRole} currentUser={currentUser} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/results" element={<Results />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/exams" element={<Exams currentUser={currentUser} role={role} />} />
            <Route path="/login" element={<Login setRole={setRole} setCurrentUser={setCurrentUser} />} />
            
            <Route 
              path="/student-profile" 
              element={role === UserRole.STUDENT ? <StudentProfilePage student={currentUser} /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/admin/*" 
              element={role === UserRole.ADMIN ? <AdminDashboard /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
