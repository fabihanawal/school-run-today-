
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

interface LoginProps {
  setRole: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ setRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setRole(UserRole.ADMIN);
      navigate('/admin');
    } else {
      alert('ভুল ইউজারনেম বা পাসওয়ার্ড। দয়া করে সঠিক তথ্য দিন।');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">অ্যাডমিন লগইন</h2>
          <p className="text-gray-500 text-sm mt-1">আপনার অ্যাকাউন্ট অ্যাক্সেস করতে লগইন করুন</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ইউজারনেম</label>
            <input 
              type="text" 
              className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">পাসওয়ার্ড</label>
            <input 
              type="password" 
              className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="rounded text-emerald-600" /> আমাকে মনে রাখুন
            </label>
            <a href="#" className="text-emerald-600 font-bold hover:underline">পাসওয়ার্ড ভুলে গেছেন?</a>
          </div>

          <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition shadow-lg transform active:scale-95">
            লগইন করুন
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>শুধুমাত্র অনুমোদিত শিক্ষক এবং স্টাফদের জন্য</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
