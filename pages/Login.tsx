import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole, Student } from '../types';
import { useSchoolSettings, useCollection, KEYS } from '../src/lib/storage';

interface LoginProps {
  setRole: (role: UserRole) => void;
  setCurrentUser: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ setRole, setCurrentUser }) => {
  const [settings] = useSchoolSettings();
  const [students] = useCollection<Student>(KEYS.STUDENTS, []);

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanId = id.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Admin Login
    if (cleanId === 'admin' && (cleanPassword === 'admin123' || cleanPassword === 'admin' || cleanPassword === 'z123z')) {
      setRole(UserRole.ADMIN);
      const adminUser = { name: 'System Admin', id: 'admin', role: UserRole.ADMIN };
      setCurrentUser(adminUser);
      localStorage.setItem('sia_user_role', UserRole.ADMIN);
      localStorage.setItem('sia_current_user', JSON.stringify(adminUser));
      window.dispatchEvent(new Event('sia_auth_updated'));
      navigate('/admin');
      return;
    }

    // 2. Student Login
    const student = students.find((s) => s.id.toLowerCase() === cleanId);
    if (student) {
      setRole(UserRole.STUDENT);
      setCurrentUser(student);
      localStorage.setItem('sia_user_role', UserRole.STUDENT);
      localStorage.setItem('sia_current_user', JSON.stringify(student));
      navigate('/student-profile');
      return;
    }

    // 3. Fallback demo
    if (cleanId === '124611' || cleanId === '124612') {
      const demoStudent: Student = {
        id: cleanId,
        name: cleanId === '124611' ? 'মোঃ হাসান আলি' : 'মোসাঃ ফাতেমা খাতুন',
        class: cleanId === '124611' ? '১০ম' : '৯ম',
        roll: cleanId === '124611' ? '১০১' : '১০২',
        guardianPhone: '০১৭১xxxxxxx'
      };
      setRole(UserRole.STUDENT);
      setCurrentUser(demoStudent);
      localStorage.setItem('sia_user_role', UserRole.STUDENT);
      localStorage.setItem('sia_current_user', JSON.stringify(demoStudent));
      navigate('/student-profile');
      return;
    }

    setError('ভুল ইউজার আইডি বা পাসওয়ার্ড। দয়া করে আবার চেষ্টা করুন।');
  };



  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200/80">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
            <i className="fas fa-lock"></i>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">লগইন পোর্টাল</h2>
          <p className="text-xs text-slate-500 mt-1">
            {settings.schoolName} · শিক্ষার্থী ও এডমিন অ্যাক্সেস
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <i className="fas fa-exclamation-circle text-base"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ইউজার আইডি / রোল নম্বর
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <i className="fas fa-user"></i>
              </span>
              <input
                type="text"
                required
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="যেমন: admin বা 124611"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <i className="fas fa-key"></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 px-4 rounded-xl text-sm transition shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-2 mt-2"
          >
            <span>লগইন করুন</span>
            <i className="fas fa-arrow-right text-xs"></i>
          </button>
        </form>


        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-emerald-700 font-semibold">
            ← হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
