import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole, Student } from '../types';
import { useSchoolSettings, useCollection, KEYS } from '../src/lib/storage';
import { signInWithGoogle } from '../src/lib/firebase';

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

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      const user = await signInWithGoogle();
      if (user.email === 'tayebkjl@gmail.com' || user.email?.includes('admin')) {
        const adminUser = {
          name: user.displayName || 'System Admin',
          id: user.uid,
          email: user.email,
          role: UserRole.ADMIN
        };
        setRole(UserRole.ADMIN);
        setCurrentUser(adminUser);
        localStorage.setItem('sia_user_role', UserRole.ADMIN);
        localStorage.setItem('sia_current_user', JSON.stringify(adminUser));
        window.dispatchEvent(new Event('sia_auth_updated'));
        navigate('/admin');
      } else {
        const studentUser = {
          name: user.displayName || 'Student',
          id: user.uid,
          email: user.email,
          role: UserRole.STUDENT
        };
        setRole(UserRole.STUDENT);
        setCurrentUser(studentUser);
        localStorage.setItem('sia_user_role', UserRole.STUDENT);
        localStorage.setItem('sia_current_user', JSON.stringify(studentUser));
        navigate('/student-profile');
      }
    } catch (err: any) {
      if (!err.message?.includes('popup-closed-by-user')) {
        setError('গুগল লগইন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।');
      }
    } finally {
      setIsGoogleLoading(false);
    }
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

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-bold">অথবা</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl text-sm border border-slate-200 transition shadow-sm hover:shadow flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isGoogleLoading ? (
            <i className="fas fa-spinner fa-spin text-emerald-600"></i>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          )}
          <span>Google দিয়ে লগইন (Firebase)</span>
        </button>

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
