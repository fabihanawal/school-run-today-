import React, { useState } from 'react';
import { TermResult } from '../types';
import { useSchoolSettings, useCollection, KEYS } from '../src/lib/storage';

interface StudentProfilePageProps {
  student: any;
}

const StudentProfilePage: React.FC<StudentProfilePageProps> = ({ student }) => {
  const [settings] = useSchoolSettings();
  const [students, setStudents] = useCollection<any>(KEYS.STUDENTS, []);

  const [activeView, setActiveView] = useState<'overview' | 'photos' | 'homework' | 'results'>('overview');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const localStudent = students.find((s: any) => s.id === student?.id) || student;
  const academicResults: TermResult[] = localStudent?.academicResults || [];

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await toBase64(file);
      const updated = students.map((s: any) => (s.id === localStudent.id ? { ...s, studentPhoto: base64 } : s));
      setStudents(updated);
      localStorage.setItem('sia_current_user', JSON.stringify({ ...localStudent, studentPhoto: base64 }));
      setStatusMessage('প্রোফাইল ছবি সফলভাবে আপডেট করা হয়েছে!');
    }
  };

  const handleHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('আপনার হোমওয়ার্ক সফলভাবে শিক্ষকের ইনবক্সে পাঠানো হয়েছে!');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="text-center mb-6">
              {localStudent?.studentPhoto ? (
                <img
                  src={localStudent.studentPhoto}
                  alt={localStudent.name}
                  className="w-24 h-24 rounded-2xl mx-auto mb-3 object-cover border-4 border-emerald-50 shadow"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-3xl mx-auto mb-3 flex items-center justify-center border-4 border-emerald-50 shadow">
                  {localStudent?.name?.charAt(0) || 'S'}
                </div>
              )}
              <h2 className="font-black text-slate-900 text-lg leading-tight">{localStudent?.name}</h2>
              <p className="text-xs font-bold text-emerald-700 mt-0.5">আইডি: {localStudent?.id}</p>
              <p className="text-xs text-slate-400">
                শ্রেণি: {localStudent?.class} · রোল: {localStudent?.roll}
              </p>
            </div>

            <nav className="space-y-1.5">
              {[
                { id: 'overview', label: 'ওভারভিউ', icon: 'fas fa-chart-pie' },
                { id: 'photos', label: 'প্রোফাইল ছবি', icon: 'fas fa-camera' },
                { id: 'homework', label: 'হোমওয়ার্ক সাবমিট', icon: 'fas fa-book-reader' },
                { id: 'results', label: 'একাডেমিক ফলাফল', icon: 'fas fa-award' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id as any);
                    setStatusMessage(null);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-3 text-xs font-bold transition ${
                    activeView === item.id
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <i className={`${item.icon} w-4 text-center`}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {statusMessage && (
            <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between">
              <span>{statusMessage}</span>
              <button onClick={() => setStatusMessage(null)} className="text-emerald-700 hover:text-emerald-900">
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          {activeView === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">লেটেস্ট GPA</p>
                  <p className="text-3xl font-black text-emerald-700 font-mono">
                    {academicResults.length > 0 ? academicResults[0].totalGPA.toFixed(2) : 'N/A'}
                  </p>
                </div>
                <div className="bg-emerald-800 p-6 rounded-2xl text-white shadow-lg text-center">
                  <p className="text-xs font-bold opacity-80 mb-1 uppercase tracking-wider">ফলাফল স্থিতি</p>
                  <p className="text-3xl font-black">
                    {academicResults.length > 0 ? (academicResults[0].isPassed ? 'পাস' : 'ফেল') : 'অপ্রকাশিত'}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">রোল নম্বর</p>
                  <p className="text-3xl font-black text-slate-900 font-mono">{localStudent?.roll || '---'}</p>
                </div>
              </div>

              {/* Student Details Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
                  শিক্ষার্থীর আইডি কার্ড বিবরণ
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-bold">প্রতিষ্ঠানের নাম</span>
                    <span className="font-bold text-slate-800">{settings.schoolName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold">EIIN</span>
                    <span className="font-mono font-bold text-slate-800">{settings.eiin}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold">শ্রেণি ও শাখা</span>
                    <span className="font-bold text-slate-800">{localStudent?.class} ({localStudent?.section || 'সাধারণ'})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold">অভিভাবকের মোবাইল</span>
                    <span className="font-mono font-bold text-slate-800">{localStudent?.guardianPhone}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'photos' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm animate-fade-in space-y-6">
              <h3 className="text-lg font-black text-slate-900">প্রোফাইল ছবি পরিবর্তন</h3>
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center max-w-md">
                <div className="mb-4">
                  {localStudent?.studentPhoto ? (
                    <img src={localStudent.studentPhoto} alt="Preview" className="w-24 h-28 object-cover rounded-xl mx-auto border-2 border-emerald-500" />
                  ) : (
                    <i className="fas fa-user-circle text-6xl text-slate-300"></i>
                  )}
                </div>
                <label className="cursor-pointer inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition shadow">
                  নতুন ছবি নির্বাচন করুন
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {activeView === 'homework' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm animate-fade-in space-y-6">
              <h3 className="text-lg font-black text-slate-900">হোমওয়ার্ক সাবমিশন</h3>
              <form onSubmit={handleHomeworkSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষক নির্বাচন</label>
                    <select className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <option>মোহা: ইব্রাহিম খলিল (প্রধান শিক্ষক)</option>
                      <option>মোসাঃ জেসমিন আরা (সহকারী প্রধান)</option>
                      <option>মোঃ হাফিজুর রহমান (বিজ্ঞান)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">বিষয়</label>
                    <select className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <option>বাংলা</option>
                      <option>ইংরেজি</option>
                      <option>গণিত</option>
                      <option>বিজ্ঞান</option>
                      <option>ইসলাম শিক্ষা</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">হোমওয়ার্ক বিবরণ বা সমাধান</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="এখানে আপনার বাড়ির কাজের বিবরণ বা উত্তর লিখুন..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition shadow"
                >
                  হোমওয়ার্ক জমা দিন
                </button>
              </form>
            </div>
          )}

          {activeView === 'results' && (
            <div className="space-y-6 animate-fade-in">
              {academicResults.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
                  <p className="font-bold">এখনো কোনো একাডেমিক ফলাফল প্রকাশিত হয়নি।</p>
                </div>
              ) : (
                academicResults.map((term: any) => (
                  <div key={term.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-xl font-black text-slate-900">{term.termTitle}</h3>
                        <p className="text-xs text-slate-400">প্রকাশের তারিখ: {term.date}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-700 font-mono">{term.finalGrade}</span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">GPA: {term.totalGPA.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-700 font-bold uppercase">
                            <th className="py-2.5 px-3">বিষয়</th>
                            <th className="py-2.5 px-3 text-center">নম্বর</th>
                            <th className="py-2.5 px-3 text-right">গ্রেড</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {term.subjects.map((s: any, i: number) => (
                            <tr key={i}>
                              <td className="py-2.5 px-3 font-bold text-slate-800">{s.subject}</td>
                              <td className="py-2.5 px-3 text-center font-mono font-bold">{s.mark}</td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">{s.grade}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => window.print()}
                        className="bg-slate-900 hover:bg-black text-white px-5 py-2 rounded-xl font-bold text-xs transition shadow flex items-center gap-1.5"
                      >
                        <i className="fas fa-print"></i>
                        <span>মার্কশিট প্রিন্ট</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
