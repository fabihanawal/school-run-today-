
import React, { useState, useEffect } from 'react';
import { TermResult, Course } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Database States
  const [students, setStudents] = useState(() => JSON.parse(localStorage.getItem('sia_students_db') || '[]'));
  const [notices, setNotices] = useState(() => JSON.parse(localStorage.getItem('sia_notices') || '[]'));
  const [staff, setStaff] = useState(() => JSON.parse(localStorage.getItem('sia_staff') || '[]'));
  const [gallery, setGallery] = useState(() => JSON.parse(localStorage.getItem('sia_gallery') || '[]'));
  const [courses, setCourses] = useState<Course[]>(() => JSON.parse(localStorage.getItem('sia_courses') || '[]'));
  
  // Site Settings (Principal/Chairman/Contact)
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('sia_site_settings');
    return saved ? JSON.parse(saved) : {
      schoolName: 'শিবগঞ্জ ইসলামী একাডেমী',
      tagline: 'সততা, নৈতিকতা ও শিক্ষার সমন্বয়',
      phone1: '০১৭১৬১৩৭৭০৮',
      email: 's124611@gmail.com',
      address: 'শিবগঞ্জ, চাঁপাইনবাবগঞ্জ',
      principalName: 'মোহা: ইব্রাহিম খলিল',
      principalMsg: 'আদর্শ মানুষ গড়াই আমাদের লক্ষ্য।',
      principalPhoto: 'https://picsum.photos/200/200?man',
      chairmanName: 'আলহাজ্ব মোঃ জয়নাল আবেদিন',
      chairmanMsg: 'শিক্ষাই জাতির মেরুদণ্ড, আর নৈতিকতা তার ভিত্তি।',
      chairmanPhoto: 'https://picsum.photos/200/200?elder'
    };
  });

  // Course Form State
  const [courseForm, setCourseForm] = useState<Partial<Course>>({
    title: '', category: '', description: '', icon: '🎓', colorClass: 'bg-emerald-50', borderClass: 'border-emerald-200', features: []
  });
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // Gallery Form State
  const [newGalleryImg, setNewGalleryImg] = useState({ title: '', url: '' });

  useEffect(() => {
    localStorage.setItem('sia_students_db', JSON.stringify(students));
    localStorage.setItem('sia_notices', JSON.stringify(notices));
    localStorage.setItem('sia_staff', JSON.stringify(staff));
    localStorage.setItem('sia_gallery', JSON.stringify(gallery));
    localStorage.setItem('sia_courses', JSON.stringify(courses));
    localStorage.setItem('sia_site_settings', JSON.stringify(settings));
  }, [students, notices, staff, gallery, courses, settings]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourseId) {
      setCourses(courses.map(c => c.id === editingCourseId ? { ...c, ...courseForm } as Course : c));
      setEditingCourseId(null);
    } else {
      setCourses([...courses, { ...courseForm, id: Date.now().toString() } as Course]);
    }
    setCourseForm({ title: '', category: '', description: '', icon: '🎓', colorClass: 'bg-emerald-50', borderClass: 'border-emerald-200', features: [] });
    setActiveTab('courses');
  };

  const menuItems = [
    { id: 'overview', label: 'ওভারভিউ', icon: '📊' },
    { id: 'students', label: 'শিক্ষার্থী', icon: '👨‍🎓' },
    { id: 'staff', label: 'শিক্ষক ও কর্মচারী', icon: '🏫' },
    { id: 'courses', label: 'কোর্স ম্যানেজমেন্ট', icon: '📚' },
    { id: 'gallery', label: 'গ্যালারি', icon: '🖼️' },
    { id: 'messages', label: 'শীর্ষ বাণী', icon: '🗣️' },
    { id: 'settings', label: 'সাইট সেটিংস', icon: '⚙️' },
    { id: 'notices', label: 'নোটিশ', icon: '📢' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'gallery':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-8 rounded-[40px] shadow-sm">
              <h3 className="text-xl font-black mb-6">নতুন ছবি যুক্ত করুন</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="ছবির শিরোনাম" className="p-4 rounded-2xl bg-gray-50 border" value={newGalleryImg.title} onChange={e => setNewGalleryImg({...newGalleryImg, title: e.target.value})} />
                <input type="file" className="hidden" id="gal-up" onChange={e => handlePhotoUpload(e, (url) => setNewGalleryImg({...newGalleryImg, url}))} />
                <label htmlFor="gal-up" className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-center font-bold cursor-pointer">
                  {newGalleryImg.url ? 'ছবি পরিবর্তন করুন' : 'ছবি নির্বাচন করুন'}
                </label>
                <button onClick={() => { setGallery([...gallery, { ...newGalleryImg, id: Date.now() }]); setNewGalleryImg({title:'', url:''}); }} className="md:col-span-2 bg-emerald-600 text-white p-4 rounded-2xl font-black">গ্যালারিতে সেভ করুন</button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((img: any) => (
                <div key={img.id} className="relative group bg-white p-2 rounded-2xl shadow-sm">
                  <img src={img.url} className="w-full h-32 object-cover rounded-xl" />
                  <p className="text-[10px] font-bold mt-2 truncate">{img.title}</p>
                  <button onClick={() => setGallery(gallery.filter((g:any)=>g.id !== img.id))} className="absolute top-4 right-4 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition"><i className="fas fa-times text-[10px]"></i></button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-10 rounded-[40px] shadow-sm">
              <h3 className="text-2xl font-black mb-8">সাইট কন্টাক্ট ও সাধারণ তথ্য</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase ml-1">প্রতিষ্ঠানের নাম</label>
                  <input type="text" className="w-full p-4 rounded-2xl bg-gray-50 border" value={settings.schoolName} onChange={e => setSettings({...settings, schoolName: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase ml-1">ট্যাগলাইন</label>
                  <input type="text" className="w-full p-4 rounded-2xl bg-gray-50 border" value={settings.tagline} onChange={e => setSettings({...settings, tagline: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase ml-1">মোবাইল নম্বর</label>
                  <input type="text" className="w-full p-4 rounded-2xl bg-gray-50 border" value={settings.phone1} onChange={e => setSettings({...settings, phone1: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase ml-1">ইমেইল</label>
                  <input type="email" className="w-full p-4 rounded-2xl bg-gray-50 border" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-black text-gray-400 uppercase ml-1">ঠিকানা</label>
                  <input type="text" className="w-full p-4 rounded-2xl bg-gray-50 border" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} />
                </div>
              </div>
              <button onClick={() => alert('সংরক্ষিত হয়েছে!')} className="w-full mt-8 bg-black text-white p-5 rounded-3xl font-black">সেটিংস সেভ করুন</button>
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-10 rounded-[40px] shadow-sm">
              <h2 className="text-2xl font-black mb-8">শীর্ষ ব্যক্তিদের বাণী ও ছবি</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4 p-6 bg-gray-50 rounded-[32px]">
                  <h4 className="font-black text-emerald-800">প্রধান শিক্ষকের তথ্য</h4>
                  <img src={settings.principalPhoto} className="w-24 h-24 rounded-3xl mx-auto border-4 border-white shadow-lg" />
                  <input type="file" className="w-full text-xs" onChange={(e) => handlePhotoUpload(e, (url) => setSettings({...settings, principalPhoto: url}))} />
                  <input type="text" className="w-full p-3 rounded-xl border" placeholder="নাম" value={settings.principalName} onChange={e => setSettings({...settings, principalName: e.target.value})} />
                  <textarea className="w-full p-3 rounded-xl border h-24" placeholder="বাণী" value={settings.principalMsg} onChange={e => setSettings({...settings, principalMsg: e.target.value})} />
                </div>
                <div className="space-y-4 p-6 bg-gray-50 rounded-[32px]">
                  <h4 className="font-black text-amber-800">সভাপতির তথ্য</h4>
                  <img src={settings.chairmanPhoto} className="w-24 h-24 rounded-3xl mx-auto border-4 border-white shadow-lg" />
                  <input type="file" className="w-full text-xs" onChange={(e) => handlePhotoUpload(e, (url) => setSettings({...settings, chairmanPhoto: url}))} />
                  <input type="text" className="w-full p-3 rounded-xl border" placeholder="নাম" value={settings.chairmanName} onChange={e => setSettings({...settings, chairmanName: e.target.value})} />
                  <textarea className="w-full p-3 rounded-xl border h-24" placeholder="বাণী" value={settings.chairmanMsg} onChange={e => setSettings({...settings, chairmanMsg: e.target.value})} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-white p-6 rounded-[32px] shadow-sm">
               <h2 className="text-xl font-black text-gray-800">কোর্স তালিকা</h2>
               <button onClick={() => { setEditingCourseId(null); setCourseForm({title:'', category:'', description:'', icon:'🎓', colorClass:'bg-emerald-50', borderClass:'border-emerald-200', features:[]}); setActiveTab('courses_form'); }} className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold">নতুন কোর্স +</button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {courses.map(course => (
                <div key={course.id} className="bg-white p-6 rounded-[32px] shadow-sm flex items-center justify-between group border border-transparent hover:border-emerald-100 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="text-4xl">{course.icon}</div>
                    <div>
                      <h4 className="font-bold text-lg">{course.title}</h4>
                      <p className="text-xs text-gray-400 font-bold uppercase">{course.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setCourseForm(course); setEditingCourseId(course.id); setActiveTab('courses_form'); }} className="bg-blue-50 text-blue-600 w-10 h-10 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><i className="fas fa-edit"></i></button>
                    <button onClick={() => setCourses(courses.filter(c => c.id !== course.id))} className="bg-red-50 text-red-600 w-10 h-10 rounded-xl hover:bg-red-600 hover:text-white transition-all"><i className="fas fa-trash"></i></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'courses_form':
        return (
          <div className="animate-fade-in">
            <div className="bg-white p-10 rounded-[40px] shadow-sm">
              <h2 className="text-2xl font-black mb-8">{editingCourseId ? 'কোর্স আপডেট করুন' : 'নতুন কোর্স তৈরি করুন'}</h2>
              <form onSubmit={handleSaveCourse} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" placeholder="কোর্সের নাম" className="w-full p-4 rounded-2xl bg-gray-50 border" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} />
                  <input type="text" placeholder="ক্যাটাগরি" className="w-full p-4 rounded-2xl bg-gray-50 border" value={courseForm.category} onChange={e => setCourseForm({...courseForm, category: e.target.value})} />
                </div>
                <textarea placeholder="বর্ণনা" className="w-full p-4 rounded-2xl bg-gray-50 border h-32" value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} />
                <button type="submit" className="w-full bg-emerald-600 text-white p-5 rounded-3xl font-black">সংরক্ষণ করুন</button>
              </form>
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
              { label: 'কোর্স', val: courses.length, color: 'border-rose-500', icon: '📚' },
              { label: 'গ্যালারি', val: gallery.length, color: 'border-amber-500', icon: '🖼️' }
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
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-left px-5 py-4 rounded-2xl flex items-center gap-4 transition-all ${activeTab === item.id ? 'bg-emerald-600 text-white font-bold shadow-xl' : 'text-gray-500 hover:bg-emerald-50'}`}>
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
