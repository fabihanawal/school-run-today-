
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
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Admin Login Logic
    if (id === 'admin' && password === 'admin123') {
      setRole(UserRole.ADMIN);
      setCurrentUser({ name: 'System Admin', id: 'admin' });
      navigate('/admin');
      return;
    }

    // Student Login Logic (Simulating checking the database)
    const studentDb = JSON.parse(localStorage.getItem('sia_students_db') || '[]');
    const student = studentDb.find((s: any) => s.id === id);

    if (student) {
      // In a real app, we would verify a password here
      setRole(UserRole.STUDENT);
      setCurrentUser(student);
      navigate('/student-profile');
    } else if (id === '124611') { // Demo Student
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
      navigate('/student-profile');
    } else {
      alert('ভুল আইডি বা পাসওয়ার্ড। ছাত্র আইডি দিয়ে চেষ্টা করুন।');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100">
        <div className="text-center mb-10">
          <div className="bg-emerald-100 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-6 transform -rotate-6 shadow-inner">
            <i className="fas fa-user-graduate text-4xl text-emerald-600"></i>
          </div>
          <h2 className="text-3xl font-black text-gray-800">লগইন করুন</h2>
          <p className="text-gray-400 font-bold text-sm mt-2 uppercase tracking-widest">Student & Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-500 mb-2 uppercase ml-1">আইডি নম্বর / ইউজারনেম</label>
            <input 
              type="text" 
              className="w-full p-5 rounded-3xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all text-lg font-bold"
              placeholder="যেমন: 124611"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 mb-2 uppercase ml-1">পাসওয়ার্ড</label>
            <input 
              type="password" 
              className="w-full p-5 rounded-3xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all text-lg font-bold"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-emerald-600 text-white font-black py-5 rounded-3xl hover:bg-emerald-700 transition shadow-xl transform active:scale-95 text-lg">
            প্রবেশ করুন ➔
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-400 font-bold">নতুন শিক্ষার্থীর ভর্তির জন্য <a href="#/admission" className="text-emerald-600 underline">এখানে ক্লিক করুন</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
