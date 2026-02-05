
import React, { useState } from 'react';
import { AdmissionSubmission } from '../types';

const Admission: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const [files, setFiles] = useState<{
    studentPhoto: string;
    birthCertificate: string;
    fatherPhoto: string;
    motherPhoto: string;
  }>({
    studentPhoto: '',
    birthCertificate: '',
    fatherPhoto: '',
    motherPhoto: ''
  });

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof files) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit
        alert('ফাইলের সাইজ ২ মেগাবাইটের বেশি হওয়া যাবে না।');
        e.target.value = '';
        return;
      }
      const base64 = await toBase64(file);
      setFiles(prev => ({ ...prev, [field]: base64 }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.studentPhoto || !files.birthCertificate) {
      alert('শিক্ষার্থীর ছবি এবং জন্ম সনদ আপলোড করা বাধ্যতামূলক।');
      return;
    }
    
    setIsSubmitting(true);
    const newSubmission: AdmissionSubmission = {
      ...formData,
      ...files,
      id: 'ADM-' + Date.now(),
      status: 'PENDING',
      appliedDate: new Date().toLocaleDateString('bn-BD')
    };

    try {
      const currentSubmissions = JSON.parse(localStorage.getItem('sia_admissions') || '[]');
      localStorage.setItem('sia_admissions', JSON.stringify([newSubmission, ...currentSubmissions]));
      
      alert('ভর্তি আবেদন সফলভাবে জমা হয়েছে! শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।');
      
      setFormData({
        name: '', fatherName: '', motherName: '', birthDate: '',
        targetClass: '১ম', gender: 'ছেলে', phone: '', address: ''
      });
      setFiles({ studentPhoto: '', birthCertificate: '', fatherPhoto: '', motherPhoto: '' });
    } catch (err) {
      alert('আবেদন জমা দিতে সমস্যা হয়েছে। ফাইলগুলো অনেক বড় হলে ছোট করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-black text-emerald-800 text-center mb-12 uppercase tracking-tighter">অনলাইন ভর্তি ফরম</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-emerald-50 p-8 rounded-[48px] shadow-inner space-y-6">
              <h3 className="text-xl font-black text-emerald-900 border-b border-emerald-200 pb-4 mb-6">১. ব্যক্তিগত তথ্য</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-black text-emerald-900 uppercase ml-2">শিক্ষার্থীর পূর্ণ নাম</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 rounded-3xl bg-white border-none shadow-sm focus:ring-4 focus:ring-emerald-200 outline-none" placeholder="যেমন: মোঃ আব্দুল্লাহ" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-emerald-900 uppercase ml-2">জন্ম তারিখ</label>
                  <input type="date" required value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="w-full p-4 rounded-3xl bg-white border-none shadow-sm focus:ring-4 focus:ring-emerald-200 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-black text-emerald-900 uppercase ml-2">পিতার নাম</label>
                  <input type="text" required value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} className="w-full p-4 rounded-3xl bg-white border-none shadow-sm focus:ring-4 focus:ring-emerald-200 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-emerald-900 uppercase ml-2">মাতার নাম</label>
                  <input type="text" required value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} className="w-full p-4 rounded-3xl bg-white border-none shadow-sm focus:ring-4 focus:ring-emerald-200 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-black text-emerald-900 uppercase ml-2">ভর্তির শ্রেণি</label>
                  <select value={formData.targetClass} onChange={e => setFormData({...formData, targetClass: e.target.value})} className="w-full p-4 rounded-3xl bg-white border-none shadow-sm outline-none">
                    <option>প্লে</option><option>নার্সারি</option><option>১ম</option><option>২য়</option><option>৩য়</option><option>৪র্থ</option><option>৫ম</option><option>৬ষ্ঠ</option><option>৭ম</option><option>৮ম</option><option>৯ম</option><option>১০ম</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-emerald-900 uppercase ml-2">লিঙ্গ</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full p-4 rounded-3xl bg-white border-none shadow-sm outline-none">
                    <option>ছেলে</option><option>মেয়ে</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-emerald-900 uppercase ml-2">মোবাইল নম্বর</label>
                  <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-4 rounded-3xl bg-white border-none shadow-sm outline-none" placeholder="017xxxxxxxx" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-emerald-900 uppercase ml-2">স্থায়ী ঠিকানা</label>
                <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-4 rounded-3xl bg-white border-none shadow-sm outline-none h-24"></textarea>
              </div>
            </div>

            <div className="bg-amber-50 p-8 rounded-[48px] shadow-inner space-y-8">
              <h3 className="text-xl font-black text-amber-900 border-b border-amber-200 pb-4 mb-6">২. প্রয়োজনীয় কাগজপত্র আপলোড</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-amber-900 uppercase ml-2">শিক্ষার্থীর পাসপোর্ট ছবি *</label>
                  <div className="relative h-40 border-4 border-dashed border-amber-200 bg-white rounded-3xl overflow-hidden hover:bg-amber-100 transition">
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'studentPhoto')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {files.studentPhoto ? <img src={files.studentPhoto} className="w-full h-full object-contain" /> : <div className="h-full flex flex-col items-center justify-center text-amber-400"><i className="fas fa-camera text-2xl mb-1"></i><span className="text-[10px] font-bold">সিলেক্ট করুন</span></div>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-amber-900 uppercase ml-2">জন্ম নিবন্ধন সনদ *</label>
                  <div className="relative h-40 border-4 border-dashed border-amber-200 bg-white rounded-3xl overflow-hidden hover:bg-amber-100 transition">
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'birthCertificate')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {files.birthCertificate ? <img src={files.birthCertificate} className="w-full h-full object-contain" /> : <div className="h-full flex flex-col items-center justify-center text-amber-400"><i className="fas fa-file-contract text-2xl mb-1"></i><span className="text-[10px] font-bold">সিলেক্ট করুন</span></div>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-amber-900 uppercase ml-2">পিতার ছবি (ঐচ্ছিক)</label>
                  <div className="relative h-40 border-4 border-dashed border-amber-200 bg-white rounded-3xl overflow-hidden hover:bg-amber-100 transition">
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'fatherPhoto')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {files.fatherPhoto ? <img src={files.fatherPhoto} className="w-full h-full object-contain" /> : <div className="h-full flex flex-col items-center justify-center text-amber-400"><i className="fas fa-user text-2xl mb-1"></i><span className="text-[10px] font-bold">সিলেক্ট করুন</span></div>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-amber-900 uppercase ml-2">মাতার ছবি (ঐচ্ছিক)</label>
                  <div className="relative h-40 border-4 border-dashed border-amber-200 bg-white rounded-3xl overflow-hidden hover:bg-amber-100 transition">
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'motherPhoto')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {files.motherPhoto ? <img src={files.motherPhoto} className="w-full h-full object-contain" /> : <div className="h-full flex flex-col items-center justify-center text-amber-400"><i className="fas fa-user text-2xl mb-1"></i><span className="text-[10px] font-bold">সিলেক্ট করুন</span></div>}
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'} text-white font-black py-5 rounded-3xl transition-all shadow-xl text-xl transform active:scale-95`}>
              {isSubmitting ? 'প্রসেসিং হচ্ছে...' : 'আবেদন জমা দিন ➔'}
            </button>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl sticky top-28">
              <h3 className="text-xl font-black text-emerald-900 mb-6 uppercase tracking-tighter">ভর্তির নিয়মাবলী</h3>
              <ul className="text-sm space-y-6 text-gray-700 font-medium">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-black flex-shrink-0">১</div><p>ফরমটি নির্ভুলভাবে পূরণ করুন।</p></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-black flex-shrink-0">২</div><p>শিক্ষার্থীর ছবি এবং জন্ম সনদ বাধ্যতামূলক।</p></li>
              </ul>
              <div className="mt-10 p-5 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-[10px] font-black text-red-600 uppercase mb-1">হেল্পলাইন</p>
                <p className="text-sm font-black text-red-800">০১৭১৬১৩৭৭০৮</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admission;
