
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

interface LoginProps {
  setRole: (role: UserRole) => void;
  setCurrentUser: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ setRole, setCurrentUser }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous error

    // Safe input cleaning
    const cleanId = id.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Admin Login Logic
    if (cleanId === 'admin' && cleanPassword === 'admin123') {
      setRole(UserRole.ADMIN);
      setCurrentUser({ name: 'System Admin', id: 'admin' });
      // Saving to localStorage immediately to ensure route protection picks it up
      localStorage.setItem('sia_user_role', UserRole.ADMIN);
      localStorage.setItem('sia_current_user', JSON.stringify({ name: 'System Admin', id: 'admin' }));
      navigate('/admin');
      return;
    }

    // Student Login Logic
    const studentDb = JSON.parse(localStorage.getItem('sia_students_db') || '[]');
    const student = studentDb.find((s: any) => s.id === cleanId);

    if (student) {
      setRole(UserRole.STUDENT);
      setCurrentUser(student);
      localStorage.setItem('sia_user_role', UserRole.STUDENT);
      localStorage.setItem('sia_current_user', JSON.stringify(student));
      navigate('/student-profile');
    } else if (cleanId === '124611') { // Demo Student
      const demoStudent = {
        id: '124611',
        name: 'মোঃ হাসান আলি',
        class: '১০ম',
        roll: '১০১',
        guardianPhone: '০১৭১xxxxxxx',
        results: []
      };
      setRole(UserRole.STUDENT);
      setCurrentUser(demoStudent);
      localStorage.setItem('sia_user_role', UserRole.STUDENT);
      localStorage.setItem('sia_current_user', JSON.stringify(demoStudent));
      navigate('/student-profile');
    } else {
      setError('ভুল আইডি বা পাসওয়ার্ড। দয়া করে আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100">
        <div className="text-center mb-10">
          <div className="bg-emerald-100 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-6 transform -rotate-6 shadow-inner">
            <i className="fas fa-user-shield text-4xl text-emerald-600"></i>
          </div>
          <h2 className="text-3xl font-black text-gray-800">লগইন পোর্টাল</h2>
          <p className="text-gray-400 font-bold text-sm mt-2 uppercase tracking-widest">Student & Admin Access</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-bounce">
            <p className="text-red-600 text-sm font-bold flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i> {error}
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-500 mb-2 uppercase ml-1">ইউজার আইডি</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300">
                <i className="fas fa-user"></i>
              </span>
              <input 
                type="text" 
                className="w-full pl-12 pr-5 py-5 rounded-3xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all text-lg font-bold"
                placeholder="যেমন: admin"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-500 mb-2 uppercase ml-1">পাসওয়ার্ড</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300">
                <i className="fas fa-lock"></i>
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full pl-12 pr-12 py-5 rounded-3xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all text-lg font-bold"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-600 text-white font-black py-5 rounded-3xl hover:bg-emerald-700 transition shadow-xl transform active:scale-95 text-lg">
            প্রবেশ করুন ➔
          </button>
        </form>

        <div className="mt-10 text-center space-y-2">
          <p className="text-xs text-gray-400 font-bold uppercase">টিপস</p>
          <p className="text-[10px] text-gray-400 leading-relaxed italic">
            অ্যাডমিন লগইনের জন্য সব ছোট হাতের অক্ষরে টাইপ করুন। <br/>
            আইডি: <span className="text-emerald-600 font-black">admin</span> | পাসওয়ার্ড: <span className="text-emerald-600 font-black">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
