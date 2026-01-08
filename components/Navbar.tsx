
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

interface NavbarProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: any;
}

const Navbar: React.FC<NavbarProps> = ({ role, setRole, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('sia_site_settings');
    return saved ? JSON.parse(saved) : { schoolName: 'শিবগঞ্জ ইসলামী একাডেমী', tagline: 'সততা, নৈতিকতা ও শিক্ষার সমন্বয়' };
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('sia_site_settings');
      if (saved) setSettings(JSON.parse(saved));
    };
    const interval = setInterval(handleStorageChange, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    setRole(UserRole.GUEST);
    localStorage.removeItem('sia_user_role');
    localStorage.removeItem('sia_current_user');
    navigate('/');
  };

  const links = [
    { name: 'হোম', path: '/' },
    { name: 'আমাদের সম্পর্কে', path: '/about' },
    { name: 'কোর্সসমূহ', path: '/courses' },
    { name: 'ফলাফল', path: '/results' },
    { name: 'পরীক্ষা ও কুইজ', path: '/exams' },
    { name: 'নোটিশ', path: '/notices' },
    { name: 'যোগাযোগ', path: '/contact' },
  ];

  return (
    <nav className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tight leading-none mb-1">{settings.schoolName}</span>
              <span className="text-[10px] md:text-xs text-emerald-200 opacity-80 font-medium tracking-wide">{settings.tagline}</span>
            </Link>
          </div>
          
          <div className="hidden xl:flex items-center space-x-6">
            {links.map((link) => (
              <Link key={link.path} to={link.path} className="hover:text-emerald-300 transition-colors text-sm font-medium">
                {link.name}
              </Link>
            ))}
            
            {role === UserRole.GUEST ? (
              <Link to="/login" className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-xl font-bold transition text-sm shadow-md">
                লগইন
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
                {role === UserRole.ADMIN ? (
                  <Link to="/admin" className="bg-white text-emerald-800 px-5 py-2 rounded-full font-black hover:bg-emerald-100 transition text-xs shadow-lg">
                    ড্যাশবোর্ড
                  </Link>
                ) : (
                  <Link to="/student-profile" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition">
                    <i className="fas fa-user-circle"></i>
                    <span className="text-xs font-bold">{currentUser?.name?.split(' ')[0]}</span>
                  </Link>
                )}
                <button onClick={handleLogout} className="text-red-300 hover:text-red-400 text-xs font-bold">লগআউট</button>
              </div>
            )}
          </div>

          <div className="xl:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-emerald-300 focus:outline-none">
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="xl:hidden bg-emerald-900 px-6 py-6 space-y-3 border-t border-emerald-700 animate-fade-in">
          {links.map((link) => (
            <Link key={link.path} to={link.path} className="block hover:bg-emerald-800 p-3 rounded-xl font-medium transition" onClick={() => setIsOpen(false)}>
              {link.name}
            </Link>
          ))}
          {role === UserRole.GUEST ? (
            <Link to="/login" className="block bg-emerald-600 p-4 rounded-2xl font-bold text-center shadow-lg" onClick={() => setIsOpen(false)}>
              লগইন
            </Link>
          ) : (
            <div className="space-y-3">
               <Link to={role === UserRole.ADMIN ? "/admin" : "/student-profile"} className="block bg-white text-emerald-800 p-4 rounded-2xl font-black text-center shadow-lg" onClick={() => setIsOpen(false)}>
                  {role === UserRole.ADMIN ? "ড্যাশবোর্ড" : "আমার প্রোফাইল"}
               </Link>
               <button onClick={handleLogout} className="w-full text-red-300 font-bold p-2">লগআউট</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
