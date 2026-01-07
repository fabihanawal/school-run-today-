
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

interface NavbarProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const Navbar: React.FC<NavbarProps> = ({ role, setRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setRole(UserRole.GUEST);
    navigate('/');
  };

  const links = [
    { name: 'হোম', path: '/' },
    { name: 'আমাদের সম্পর্কে', path: '/about' },
    { name: 'কোর্সসমূহ', path: '/courses' },
    { name: 'ভর্তি', path: '/admission' },
    { name: 'ফলাফল', path: '/results' },
    { name: 'পরীক্ষা ও কুইজ', path: '/exams' },
    { name: 'নোটিশ', path: '/notices' },
    { name: 'গ্যালারী', path: '/gallery' },
    { name: 'যোগাযোগ', path: '/contact' },
  ];

  return (
    <nav className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold tracking-tight">শিবগঞ্জ ইসলামী একাডেমী</span>
              <span className="text-xs text-emerald-200">সততা, নৈতিকতা ও শিক্ষার সমন্বয়</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link key={link.path} to={link.path} className="hover:text-emerald-300 transition-colors text-sm">
                {link.name}
              </Link>
            ))}
            {role === UserRole.ADMIN ? (
              <div className="flex items-center space-x-3">
                <Link to="/admin" className="bg-white text-emerald-800 px-4 py-1.5 rounded-full font-bold hover:bg-emerald-100 transition text-sm">
                  ড্যাশবোর্ড
                </Link>
                <button onClick={handleLogout} className="text-red-300 hover:text-red-400 text-sm">লগআউট</button>
              </div>
            ) : (
              <Link to="/login" className="bg-emerald-600 hover:bg-emerald-700 px-5 py-2 rounded-lg font-medium transition text-sm">
                লগইন
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-emerald-300 focus:outline-none">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-emerald-900 px-4 py-4 space-y-2 border-t border-emerald-700">
          {links.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="block hover:bg-emerald-800 p-2 rounded" 
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {role === UserRole.ADMIN ? (
            <Link 
              to="/admin" 
              className="block bg-white text-emerald-800 p-2 rounded font-bold text-center" 
              onClick={() => setIsOpen(false)}
            >
              ড্যাশবোর্ড
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="block bg-emerald-600 p-2 rounded font-medium text-center" 
              onClick={() => setIsOpen(false)}
            >
              লগইন
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
