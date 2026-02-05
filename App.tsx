
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

  useEffect(() => {
    const fetchServerData = async (retries = 3, delay = 1500) => {
      try {
        const response = await fetch('api.php', { cache: 'no-store' });
        if (response.status === 503 && retries > 0) {
          setTimeout(() => fetchServerData(retries - 1, delay * 2), delay);
          return;
        }
        if (!response.ok) return;
        const data = await response.json();
        if (data.status === 'new' || data.error) return;

        const syncMap = {
          'sia_site_settings': data.settings,
          'sia_notices': data.notices,
          'sia_staff': data.staff,
          'sia_gallery': data.gallery,
          'sia_courses': data.courses,
          'sia_students_db': data.students,
          'sia_quizzes': data.quizzes,
          'sia_admissions': data.admissions
        };

        Object.entries(syncMap).forEach(([key, val]) => {
          if (val) localStorage.setItem(key, JSON.stringify(val));
        });
        console.log("☁️ All data synced.");
      } catch (err) {
        console.log("Local mode active.");
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
            <Route path="/student-profile" element={role === UserRole.STUDENT ? <StudentProfilePage student={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/admin/*" element={role === UserRole.ADMIN ? <AdminDashboard /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
