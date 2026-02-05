
import React, { useState } from 'react';
import { AdmissionSubmission } from '../types';

const Admission: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    birthDate: '',
    targetClass: '১ম',
    gender: 'ছেলে',
    phone: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSubmission: AdmissionSubmission = {
      ...formData,
      id: 'ADM-' + Date.now(),
      status: 'PENDING',
      appliedDate: new Date().toLocaleDateString('bn-BD')
    };

    const currentSubmissions = JSON.parse(localStorage.getItem('sia_admissions') || '[]');
    localStorage.setItem('sia_admissions', JSON.stringify([newSubmission, ...currentSubmissions]));
    
    alert('ভর্তি আবেদন সফলভাবে জমা হয়েছে! শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।');
    setFormData({
      name: '', fatherName: '', motherName: '', birthDate: '',
      targetClass: '১ম', gender: 'ছেলে', phone: '', address: ''
    });
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-black text-emerald-800 text-center mb-8 uppercase tracking-tighter">অনলাইন ভর্তি ফরম</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 bg-emerald-50 p-10 rounded-[48px] shadow-inner">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-emerald-900 mb-2 uppercase ml-2">শিক্ষার্থীর পূর্ণ নাম</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 rounded-3xl bg-white border-none shadow-sm focus:ring-4 focus:ring-emerald-200 outline-none" placeholder="যেমন: মোঃ আব্দুল্লাহ" />
                </div>
                <div>
                  <label className="block text-xs font-black text-emerald-900 mb-2 uppercase ml-2">জন্ম তারিখ</label>
                  <input type="date" required value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="w-full p-4 rounded-3xl bg-white border-none shadow-sm focus:ring-4 focus:ring-emerald-200 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-emerald-900 mb-2 uppercase ml-2">পিতার নাম</label>
                  <input type="text" required value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} className="w-full p-4 rounded-3xl bg-white border-none shadow-sm focus:ring-4 focus:ring-emerald-200 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black text-emerald-900 mb-2 uppercase ml-2">মাতার নাম</label>
                  <input type="text" required value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} className="w-full p-4 rounded-3xl bg-white border-none shadow-sm focus:ring-4 focus:ring-emerald-200 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-black text-emerald-900 mb-2 uppercase ml-2">ভর্তির শ্রেণি</label>
                  <select value={formData.targetClass} onChange={e => setFormData({...formData, targetClass: e.target.value})} className="w-full p-4 rounded-3xl bg-white border-none shadow-sm outline-none">
                    <option>প্লে</option><option>নার্সারি</option><option>১ম</option><option>২য়</option><option>৩য়</option><option>৪র্থ</option><option>৫ম</option><option>৬ষ্ঠ</option><option>৭ম</option><option>৮ম</option><option>৯ম</option><option>১০ম</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-emerald-900 mb-2 uppercase ml-2">লিঙ্গ</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full p-4 rounded-3xl bg-white border-none shadow-sm outline-none">
                    <option>ছেলে</option><option>মেয়ে</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-emerald-900 mb-2 uppercase ml-2">মোবাইল নম্বর</label>
                  <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-4 rounded-3xl bg-white border-none shadow-sm outline-none" placeholder="017xxxxxxxx" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-emerald-900 mb-2 uppercase ml-2">স্থায়ী ঠিকানা</label>
                <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-4 rounded-3xl bg-white border-none shadow-sm outline-none h-24"></textarea>
              </div>

              <button type="submit" className="w-full bg-emerald-600 text-white font-black py-5 rounded-3xl hover:bg-emerald-700 transition-all shadow-xl text-xl">
                আবেদন জমা দিন ➔
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-amber-50 p-8 rounded-[40px] border border-amber-100 shadow-sm">
              <h3 className="text-xl font-black text-amber-900 mb-4 uppercase">গুরুত্বপূর্ণ তথ্য</h3>
              <ul className="text-sm space-y-4 text-gray-700 font-medium">
                <li className="flex gap-3"><span className="text-amber-500">★</span> অনলাইন আবেদন সম্পূর্ণ করার পর অফিস থেকে আপনার মোবাইলে যোগাযোগ করা হবে।</li>
                <li className="flex gap-3"><span className="text-amber-500">★</span> ভর্তির সময় শিক্ষার্থীর ২ কপি পাসপোর্ট সাইজ ফটো এবং জন্ম নিবন্ধনের ফটোকপি অবশ্যই সাথে আনতে হবে।</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admission;
