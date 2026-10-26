import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { useSchoolSettings } from '../src/lib/storage';

interface NavbarProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: any;
}

const Navbar: React.FC<NavbarProps> = ({ role, setRole, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings] = useSchoolSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setRole(UserRole.GUEST);
    localStorage.removeItem('sia_user_role');
    localStorage.removeItem('sia_current_user');
    navigate('/');
  };

  const navLinks = [
    { name: 'হোম', path: '/' },
    { name: 'পরিচিতি', path: '/about' },
    { name: 'শাখা ও কোর্স', path: '/courses' },
    { name: 'ভর্তি তথ্য', path: '/admission' },
    { name: 'ফলাফল', path: '/results' },
    { name: 'নোটিশ বোর্ড', path: '/notices' },
    { name: 'গ্যালারি', path: '/gallery' },
    { name: 'পরীক্ষা ও কুইজ', path: '/exams' },
    { name: 'যোগাযোগ', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top Notification & Contact Bar */}
      <div className="bg-emerald-950 text-emerald-200 text-xs py-1.5 border-b border-emerald-900/60 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <i className="fas fa-university text-emerald-400"></i>
              <span>EIIN: <strong>{settings.eiin || '১২৪৬১১'}</strong></span>
              <span className="text-emerald-700">|</span>
              <span>স্থাপিত: {settings.estYear || '১৯৯৮'}</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition">
              <i className="fas fa-phone-alt text-emerald-400"></i>
              <span>{settings.phone1}</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition hidden lg:inline-flex">
              <i className="fas fa-envelope text-emerald-400"></i>
              <span>{settings.email}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {settings.admissionOpen && (
              <Link
                to="/admission"
                className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded text-[11px] font-bold hover:bg-amber-500 hover:text-white transition"
              >
                ভর্তি চলছে ({settings.currentSession || '২০২৪-২০২৫'})
              </Link>
            )}
            <div className="flex items-center gap-3">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition" title="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}
              {settings.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className="hover:text-red-400 transition" title="YouTube">
                  <i className="fab fa-youtube"></i>
                </a>
              )}
              {settings.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-green-400 transition" title="WhatsApp">
                  <i className="fab fa-whatsapp"></i>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-emerald-900 text-white border-b border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* School Brand & Logo */}
            <Link to="/" className="flex items-center gap-3.5 group">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt={settings.schoolName}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-emerald-400/80 shadow-md group-hover:scale-105 transition"
                />
              ) : (
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-800 border-2 border-emerald-400/80 flex items-center justify-center text-emerald-300 text-2xl shadow-md group-hover:scale-105 transition">
                  <i className="fas fa-graduation-cap"></i>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black tracking-tight leading-tight group-hover:text-emerald-200 transition">
                  {settings.schoolName}
                </span>
                <span className="text-[11px] md:text-xs text-emerald-200/90 font-medium line-clamp-1">
                  {settings.tagline}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      active
                        ? 'bg-emerald-800/90 text-white border-b-2 border-amber-400'
                        : 'text-emerald-100/90 hover:text-white hover:bg-emerald-800/50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="pl-3 ml-2 border-l border-emerald-800/80 flex items-center gap-2.5">
                {role === UserRole.GUEST ? (
                  <Link
                    to="/login"
                    className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-black px-4 py-2 rounded-xl text-xs transition shadow hover:shadow-lg flex items-center gap-1.5"
                  >
                    <i className="fas fa-lock text-[10px]"></i>
                    <span>লগইন</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    {role === UserRole.STUDENT && (
                      <Link
                        to="/student-profile"
                        className="bg-emerald-800 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
                      >
                        <i className="fas fa-user-graduate text-emerald-300"></i>
                        <span>{currentUser?.name ? currentUser.name.split(' ')[0] : 'প্রোফাইল'}</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="text-red-300 hover:text-white hover:bg-red-900/40 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                      title="লগআউট"
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      <span>লগআউট</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="xl:hidden flex items-center gap-2">
              {role === UserRole.GUEST ? (
                <Link
                  to="/login"
                  className="bg-amber-500 text-emerald-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                >
                  লগইন
                </Link>
              ) : role === UserRole.STUDENT ? (
                <Link
                  to="/student-profile"
                  className="bg-white text-emerald-900 font-bold px-3 py-1.5 rounded-lg text-xs"
                >
                  প্রোফাইল
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-red-300 hover:text-white p-1.5 text-xs font-bold"
                  title="লগআউট"
                >
                  <i className="fas fa-sign-out-alt mr-1"></i> লগআউট
                </button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/80 focus:outline-none"
                aria-label="Toggle Menu"
              >
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="xl:hidden bg-emerald-950 px-4 pt-3 pb-6 border-t border-emerald-800 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                  isActive(link.path)
                    ? 'bg-emerald-800 text-white font-bold'
                    : 'text-emerald-100 hover:bg-emerald-900'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-emerald-900 mt-3 space-y-2">
              <div className="text-xs text-emerald-400 px-3">
                <p><i className="fas fa-phone mr-1.5"></i> {settings.phone1}</p>
                <p className="mt-1"><i className="fas fa-envelope mr-1.5"></i> {settings.email}</p>
              </div>
              {role !== UserRole.GUEST && (
                <button
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="w-full text-left text-red-400 px-3 py-2 text-sm font-bold hover:bg-red-950/40 rounded-lg"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i> লগআউট
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
