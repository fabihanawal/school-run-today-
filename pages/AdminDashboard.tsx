
import React, { useState, useEffect } from 'react';
import { TermResult, SubjectMark } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Database States
  const [students, setStudents] = useState(() => JSON.parse(localStorage.getItem('sia_students_db') || '[]'));
  const [notices, setNotices] = useState(() => JSON.parse(localStorage.getItem('sia_notices') || '[]'));
  const [staff, setStaff] = useState(() => JSON.parse(localStorage.getItem('sia_staff') || '[]'));
  const [committee, setCommittee] = useState(() => JSON.parse(localStorage.getItem('sia_committee') || '[]'));
  
  // Site Settings (Principal/Chairman)
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('sia_site_settings');
    return saved ? JSON.parse(saved) : {
      schoolName: 'শিবগঞ্জ ইসলামী একাডেমী',
      tagline: 'সততা, নৈতিকতা ও শিক্ষার সমন্বয়',
      principalName: 'মোহা: ইব্রাহিম খলিল',
      principalMsg: 'আদর্শ মানুষ গড়াই আমাদের লক্ষ্য।',
      principalPhoto: 'https://picsum.photos/200/200?man',
      chairmanName: 'আলহাজ্ব মোঃ জয়নাল আবেদিন',
      chairmanMsg: 'শিক্ষাই জাতির মেরুদণ্ড, আর নৈতিকতা তার ভিত্তি।',
      chairmanPhoto: 'https://picsum.photos/200/200?elder'
    };
  });

  // Form States
  const [newStudent, setNewStudent] = useState({ id: '', name: '', class: '১০ম', section: 'ক', roll: '', fatherName: '', motherName: '', parentPhone: '' });
  const [newStaff, setNewStaff] = useState({ name: '', designation: '', subject: '', mobile: '', type: 'TEACHER', photo: '' });
  const [newNotice, setNewNotice] = useState({ title: '', type: 'একাডেমিক' });

  useEffect(() => {
    localStorage.setItem('sia_students_db', JSON.stringify(students));
    localStorage.setItem('sia_notices', JSON.stringify(notices));
    localStorage.setItem('sia_staff', JSON.stringify(staff));
    localStorage.setItem('sia_site_settings', JSON.stringify(settings));
  }, [students, notices, staff, settings]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'ওভারভিউ', icon: '📊' },
    { id: 'students', label: 'শিক্ষার্থী', icon: '👨‍🎓' },
    { id: 'staff', label: 'শিক্ষক ও কর্মচারী', icon: '🏫' },
    { id: 'results', label: 'ফলাফল এন্ট্রি', icon: '📝' },
    { id: 'messages', label: 'শীর্ষ বাণী', icon: '🗣️' },
    { id: 'notices', label: 'নোটিশ', icon: '📢' },
    { id: 'settings', label: 'সেটিংস', icon: '⚙️' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'students':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-8 rounded-[40px] shadow-sm">
              <h3 className="text-xl font-black mb-6">নতুন শিক্ষার্থী ভর্তি</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                setStudents([...students, { ...newStudent, academicResults: [] }]);
                setNewStudent({ id: '', name: '', class: '১০ম', section: 'ক', roll: '', fatherName: '', motherName: '', parentPhone: '' });
                alert('ভর্তি সম্পন্ন হয়েছে!');
              }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="স্টুডেন্ট আইডি" className="p-4 rounded-2xl bg-gray-50 border" value={newStudent.id} onChange={e => setNewStudent({...newStudent, id: e.target.value})} required />
                <input type="text" placeholder="শিক্ষার্থীর নাম" className="p-4 rounded-2xl bg-gray-50 border" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} required />
                <div className="flex gap-2">
                  <input type="text" placeholder="রোল" className="w-1/2 p-4 rounded-2xl bg-gray-50 border" value={newStudent.roll} onChange={e => setNewStudent({...newStudent, roll: e.target.value})} required />
                  <input type="text" placeholder="শাখা" className="w-1/2 p-4 rounded-2xl bg-gray-50 border" value={newStudent.section} onChange={e => setNewStudent({...newStudent, section: e.target.value})} required />
                </div>
                <input type="text" placeholder="পিতার নাম" className="p-4 rounded-2xl bg-gray-50 border" value={newStudent.fatherName} onChange={e => setNewStudent({...newStudent, fatherName: e.target.value})} />
                <input type="text" placeholder="মাতার নাম" className="p-4 rounded-2xl bg-gray-50 border" value={newStudent.motherName} onChange={e => setNewStudent({...newStudent, motherName: e.target.value})} />
                <input type="tel" placeholder="পিতা/মাতার মোবাইল" className="p-4 rounded-2xl bg-gray-50 border" value={newStudent.parentPhone} onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})} required />
                <button type="submit" className="md:col-span-3 bg-emerald-600 text-white p-4 rounded-2xl font-black shadow-lg">তথ্য সংরক্ষণ করুন</button>
              </form>
            </div>
            <div className="bg-white rounded-[40px] shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-black text-gray-400 uppercase">
                  <tr>
                    <th className="px-6 py-4">আইডি ও নাম</th>
                    <th className="px-6 py-4">শাখা ও রোল</th>
                    <th className="px-6 py-4">মোবাইল</th>
                    <th className="px-6 py-4">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {students.map((s: any) => (
                    <tr key={s.id}>
                      <td className="px-6 py-4"><p className="font-bold">{s.name}</p><span className="text-[10px] text-gray-400">{s.id}</span></td>
                      <td className="px-6 py-4 text-sm">{s.class} ({s.section}) - {s.roll}</td>
                      <td className="px-6 py-4 text-sm font-mono">{s.parentPhone}</td>
                      <td className="px-6 py-4"><button onClick={() => setStudents(students.filter((x:any)=>x.id !== s.id))} className="text-red-300 hover:text-red-500"><i className="fas fa-trash"></i></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'staff':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-8 rounded-[40px] shadow-sm">
              <h2 className="text-xl font-black mb-6">নতুন স্টাফ/শিক্ষক প্রোফাইল</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input type="text" placeholder="নাম" className="p-4 rounded-2xl bg-gray-50 border" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
                <input type="text" placeholder="পদবী" className="p-4 rounded-2xl bg-gray-50 border" value={newStaff.designation} onChange={e => setNewStaff({...newStaff, designation: e.target.value})} />
                <input type="text" placeholder="বিষয় (শিক্ষকদের জন্য)" className="p-4 rounded-2xl bg-gray-50 border" value={newStaff.subject} onChange={e => setNewStaff({...newStaff, subject: e.target.value})} />
                <input type="tel" placeholder="মোবাইল নম্বর" className="p-4 rounded-2xl bg-gray-50 border" value={newStaff.mobile} onChange={e => setNewStaff({...newStaff, mobile: e.target.value})} />
                <select className="p-4 rounded-2xl bg-gray-50 border" value={newStaff.type} onChange={e => setNewStaff({...newStaff, type: e.target.value})}>
                  <option value="TEACHER">শিক্ষক</option>
                  <option value="STAFF">কর্মচারী</option>
                </select>
                <div className="relative">
                  <input type="file" className="hidden" id="staff-photo" onChange={(e) => handlePhotoUpload(e, (url) => setNewStaff({...newStaff, photo: url}))} />
                  <label htmlFor="staff-photo" className="block p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-center font-bold cursor-pointer hover:bg-emerald-100">
                    {newStaff.photo ? 'ছবি পরিবর্তন করুন' : 'ছবি আপলোড করুন'}
                  </label>
                </div>
                <button onClick={() => { setStaff([...staff, { ...newStaff, id: Date.now().toString() }]); setNewStaff({ name: '', designation: '', subject: '', mobile: '', type: 'TEACHER', photo: '' }); }} className="lg:col-span-3 bg-emerald-600 text-white p-4 rounded-2xl font-black">ডাটাবেজে যুক্ত করুন</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {staff.map((s: any) => (
                <div key={s.id} className="bg-white p-6 rounded-[32px] shadow-sm flex items-center gap-5 group">
                  <img src={s.photo || "https://picsum.photos/100/100?user"} className="w-20 h-20 rounded-2xl object-cover border" />
                  <div className="flex-grow">
                    <h4 className="font-bold text-gray-800">{s.name}</h4>
                    <p className="text-xs text-emerald-600 font-bold">{s.designation} {s.subject ? `(${s.subject})` : ''}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-1"><i className="fas fa-phone mr-1"></i>{s.mobile}</p>
                  </div>
                  <button onClick={() => setStaff(staff.filter((x:any)=>x.id !== s.id))} className="text-red-200 hover:text-red-500"><i className="fas fa-trash"></i></button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-10 rounded-[40px] shadow-sm">
              <h2 className="text-2xl font-black mb-8">শীর্ষ ব্যক্তিদের বাণী ও ছবি</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Principal Info */}
                <div className="space-y-4 p-6 bg-gray-50 rounded-[32px]">
                  <h4 className="font-black text-emerald-800">প্রধান শিক্ষকের তথ্য</h4>
                  <img src={settings.principalPhoto} className="w-24 h-24 rounded-3xl mx-auto border-4 border-white shadow-lg" />
                  <input type="file" className="w-full text-xs" onChange={(e) => handlePhotoUpload(e, (url) => setSettings({...settings, principalPhoto: url}))} />
                  <input type="text" className="w-full p-3 rounded-xl border" placeholder="নাম" value={settings.principalName} onChange={e => setSettings({...settings, principalName: e.target.value})} />
                  <textarea className="w-full p-3 rounded-xl border h-24" placeholder="বাণী" value={settings.principalMsg} onChange={e => setSettings({...settings, principalMsg: e.target.value})} />
                </div>
                {/* Chairman Info */}
                <div className="space-y-4 p-6 bg-gray-50 rounded-[32px]">
                  <h4 className="font-black text-amber-800">সভাপতির তথ্য</h4>
                  <img src={settings.chairmanPhoto} className="w-24 h-24 rounded-3xl mx-auto border-4 border-white shadow-lg" />
                  <input type="file" className="w-full text-xs" onChange={(e) => handlePhotoUpload(e, (url) => setSettings({...settings, chairmanPhoto: url}))} />
                  <input type="text" className="w-full p-3 rounded-xl border" placeholder="নাম" value={settings.chairmanName} onChange={e => setSettings({...settings, chairmanName: e.target.value})} />
                  <textarea className="w-full p-3 rounded-xl border h-24" placeholder="বাণী" value={settings.chairmanMsg} onChange={e => setSettings({...settings, chairmanMsg: e.target.value})} />
                </div>
              </div>
              <button onClick={() => alert('সংরক্ষিত হয়েছে!')} className="w-full mt-8 bg-black text-white p-5 rounded-3xl font-black">সব আপডেট সেভ করুন</button>
            </div>
          </div>
        );

      case 'overview':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
            {[
              { label: 'শিক্ষার্থী', val: students.length, color: 'border-emerald-500', icon: '👨‍🎓' },
              { label: 'শিক্ষক-কর্মী', val: staff.length, color: 'border-blue-500', icon: '🏫' },
              { label: 'নোটিশ', val: notices.length, color: 'border-amber-500', icon: '📢' },
              { label: 'অ্যাক্টিভিটি', val: '৯৯+', color: 'border-purple-500', icon: '⚡' }
            ].map((stat, i) => (
              <div key={i} className={`bg-white p-8 rounded-[40px] shadow-sm border-b-4 ${stat.color}`}>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-black text-gray-400 uppercase">{stat.label}</p>
                  <span>{stat.icon}</span>
                </div>
                <p className="text-4xl font-black text-gray-800">{stat.val}</p>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-[32px] shadow-sm sticky top-24">
            <h1 className="text-center font-black text-emerald-800 mb-8 border-b pb-4 uppercase tracking-tighter">SIA Admin</h1>
            <nav className="space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-5 py-4 rounded-2xl flex items-center gap-4 transition-all ${activeTab === item.id ? 'bg-emerald-600 text-white font-bold shadow-xl' : 'text-gray-500 hover:bg-emerald-50'}`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
        <div className="lg:col-span-3">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
