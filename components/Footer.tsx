import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSchoolSettings } from '../src/lib/storage';
import { UserRole } from '../types';

interface FooterProps {
  setRole?: (role: UserRole) => void;
  setCurrentUser?: (user: any) => void;
}

const Footer: React.FC<FooterProps> = ({ setRole, setCurrentUser }) => {
  const [settings] = useSchoolSettings();
  const navigate = useNavigate();

  // Secret Admin Access Modal State
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [clickCount, setClickCount] = useState(0);

  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus password input when modal opens
  useEffect(() => {
    if (isAdminModalOpen) {
      setAdminPassword('');
      setErrorMessage('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isAdminModalOpen]);

  // Keyboard listener: typing '@' 3 times triggers the modal
  useEffect(() => {
    let keyCount = 0;
    let keyTimer: NodeJS.Timeout | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively filling an input/textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      if (e.key === '@') {
        keyCount += 1;
        if (keyTimer) clearTimeout(keyTimer);

        if (keyCount >= 3) {
          keyCount = 0;
          setIsAdminModalOpen(true);
        } else {
          keyTimer = setTimeout(() => {
            keyCount = 0;
          }, 2500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (keyTimer) clearTimeout(keyTimer);
    };
  }, []);

  // Handle clicking '@' 3 times in the footer
  const handleAtClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (newCount >= 3) {
      setClickCount(0);
      setIsAdminModalOpen(true);
    } else {
      clickTimerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2500);
    }
  };

  // Handle Secret Admin Login with password 'z123z'
  const handleSecretLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedPassword = adminPassword.trim();

    if (trimmedPassword === 'z123z' || trimmedPassword === 'admin123') {
      const adminUser = { name: 'System Admin', id: 'admin', role: UserRole.ADMIN };

      localStorage.setItem('sia_user_role', UserRole.ADMIN);
      localStorage.setItem('sia_current_user', JSON.stringify(adminUser));

      if (setRole) setRole(UserRole.ADMIN);
      if (setCurrentUser) setCurrentUser(adminUser);

      window.dispatchEvent(new Event('sia_auth_updated'));

      setIsAdminModalOpen(false);
      navigate('/admin');
    } else {
      setErrorMessage('ভুল পাসওয়ার্ড! দয়া করে সঠিক পাসওয়ার্ড দিয়ে চেষ্টা করুন।');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t-4 border-emerald-700 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          {/* Column 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {settings.logo ? (
                <img src={settings.logo} alt={settings.schoolName} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-emerald-900 border-2 border-emerald-500 flex items-center justify-center text-emerald-300 text-xl">
                  <i className="fas fa-graduation-cap"></i>
                </div>
              )}
              <div>
                <h3 className="text-white text-lg font-black leading-tight">{settings.schoolName}</h3>
                <p className="text-[11px] text-emerald-400 font-medium">EIIN: {settings.eiin || '১২৪৬১১'} · স্থাপিত: {settings.estYear || '১৯৯৮'}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.tagline}। একটি ঐতিহ্যবাহী দ্বীনি ও আধুনিক শিক্ষাপ্রতিষ্ঠান যা আদর্শ ও নৈতিকতাসম্পন্ন সুনাগরিক গড়ে তোলায় নিবেদিত।
            </p>

            <div className="pt-2 flex items-center gap-3">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"
                  title="Facebook"
                >
                  <i className="fab fa-facebook-f text-sm"></i>
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                  title="YouTube"
                >
                  <i className="fab fa-youtube text-sm"></i>
                </a>
              )}
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"
                  title="WhatsApp"
                >
                  <i className="fab fa-whatsapp text-sm"></i>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4 text-emerald-400">
              গুরুত্বপূর্ণ লিঙ্কসমূহ
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>আমাদের পরিচিতি ও শিক্ষক পরিষদ</span>
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>শিক্ষা কার্যক্রম ও কারিকুলাম</span>
                </Link>
              </li>
              <li>
                <Link to="/admission" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>অনলাইন ভর্তি আবেদন ফরম</span>
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>অনলাইন ফলাফল অনুসন্ধান</span>
                </Link>
              </li>
              <li>
                <Link to="/notices" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>অফিসিয়াল নোটিশ বোর্ড</span>
                </Link>
              </li>
              <li>
                <Link to="/exams" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>অনলাইন কুইজ ও পরীক্ষা পোর্টাল</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>ক্যাম্পাস ফটো গ্যালারি</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Office Hours */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4 text-emerald-400">
              যোগাযোগ ও অফিস সময়
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <i className="fas fa-map-marker-alt text-emerald-400 mt-0.5"></i>
                <span className="leading-relaxed">{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="fas fa-phone-alt text-emerald-400"></i>
                <span>{settings.phone1} {settings.phone2 ? `· ${settings.phone2}` : ''}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="fas fa-envelope text-emerald-400"></i>
                <span>{settings.email}</span>
              </li>
              <li className="flex items-start gap-2.5 pt-1 border-t border-slate-900">
                <i className="fas fa-clock text-amber-400 mt-0.5"></i>
                <span className="text-slate-300">{settings.officeHours || 'শনি - বৃহস্পতি: সকাল ৮:০০ - বিকাল ৪:০০'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with secret @ button */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p className="flex items-center gap-1.5 flex-wrap">
            <span>&copy; {new Date().getFullYear()} {settings.schoolName}। সর্বস্বত্ব সংরক্ষিত।</span>
            <button
              type="button"
              onClick={handleAtClick}
              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-slate-500 hover:text-amber-400 hover:bg-slate-900 transition-colors cursor-pointer select-none font-mono text-xs"
              title="@ (৩ বার প্রেস করুন)"
              aria-label="Secret Admin Access"
            >
              @
            </button>
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>EIIN: {settings.eiin}</span>
            <span>·</span>
            <span>সেশন: {settings.currentSession}</span>
          </div>
        </div>
      </div>

      {/* Secret Admin Only-Password Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-emerald-700/60 relative animate-fade-in">
            {/* Close Button */}
            <button
              onClick={() => setIsAdminModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              aria-label="Close"
            >
              <i className="fas fa-times text-xs"></i>
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-600/60 text-emerald-400 flex items-center justify-center text-2xl mx-auto mb-3 shadow-inner">
                <i className="fas fa-key"></i>
              </div>
              <h3 className="text-xl font-black text-white">এডমিন এক্সেস</h3>
              <p className="text-xs text-slate-400 mt-1">
                এডমিন প্যানেলে প্রবেশের জন্য শুধুমাত্র পাসওয়ার্ড প্রদান করুন
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-5 bg-red-950/80 border border-red-700 text-red-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                <i className="fas fa-exclamation-circle text-red-400 flex-shrink-0"></i>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Password-Only Form */}
            <form onSubmit={handleSecretLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  পাসওয়ার্ড
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <i className="fas fa-lock text-xs"></i>
                  </span>
                  <input
                    ref={inputRef}
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন..."
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-xs font-bold transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-xs font-black transition shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                >
                  <span>লগইন করুন</span>
                  <i className="fas fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
