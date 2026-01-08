
import React, { useState, useEffect } from 'react';
import { HomeworkSubmission, TermResult } from '../types';

interface StudentProfilePageProps {
  student: any;
}

const StudentProfilePage: React.FC<StudentProfilePageProps> = ({ student }) => {
  const [activeView, setActiveView] = useState<'overview' | 'photos' | 'homework' | 'results'>('overview');
  const [localStudent, setLocalStudent] = useState(() => {
    const db = JSON.parse(localStorage.getItem('sia_students_db') || '[]');
    return db.find((s: any) => s.id === student.id) || student;
  });

  const academicResults: TermResult[] = localStudent.academicResults || [];

  const handleUpdatePhoto = (type: string) => {
    alert(`${type} আপডেট করার ফিচারটি শীঘ্রই যুক্ত করা হচ্ছে। বর্তমানে এটি একটি ডেমো ইন্টারফেস।`);
  };

  const handleHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('আপনার হোমওয়ার্কটি সফলভাবে শিক্ষকের নিকট পাঠানো হয়েছে।');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
            <div className="text-center mb-6">
              <img 
                src={localStudent.studentPhoto || "https://picsum.photos/200/200?student"} 
                className="w-24 h-24 rounded-[32px] mx-auto mb-3 object-cover border-4 border-emerald-50" 
              />
              <h2 className="font-black text-gray-800">{localStudent.name}</h2>
              <p className="text-xs font-bold text-emerald-600">আইডি: {localStudent.id}</p>
            </div>
            <nav className="space-y-1">
              {[
                { id: 'overview', label: 'ওভারভিউ', icon: '📊' },
                { id: 'photos', label: 'প্রোফাইল ও ফটো', icon: '📸' },
                { id: 'homework', label: 'হোমওয়ার্ক জমা', icon: '📝' },
                { id: 'results', label: 'একাডেমিক রেজাল্ট', icon: '🎓' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={`w-full text-left px-4 py-3 rounded-2xl flex items-center gap-3 transition-all ${activeView === item.id ? 'bg-emerald-600 text-white font-bold shadow-lg' : 'text-gray-500 hover:bg-emerald-50'}`}
                >
                  <span>{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {activeView === 'overview' && (
            <div className="animate-fade-in space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 text-center">
                  <p className="text-xs font-bold text-gray-400 mb-2 uppercase">লেটেস্ট জিপিএ</p>
                  <p className="text-4xl font-black text-emerald-700">
                    {academicResults.length > 0 ? academicResults[0].totalGPA.toFixed(2) : 'N/A'}
                  </p>
                </div>
                <div className="bg-emerald-600 p-8 rounded-[40px] text-white shadow-xl">
                  <p className="text-xs font-bold opacity-80 mb-2 uppercase">ফলাফল স্থিতি</p>
                  <p className="text-4xl font-black">
                    {academicResults.length > 0 ? (academicResults[0].isPassed ? 'পাস' : 'ফেল') : 'অপ্রকাশিত'}
                  </p>
                </div>
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 text-center">
                  <p className="text-xs font-bold text-gray-400 mb-2 uppercase">রোল পজিশন</p>
                  <p className="text-4xl font-black text-gray-800">{localStudent.roll || '---'}</p>
                </div>
              </div>
            </div>
          )}

          {activeView === 'photos' && (
            <div className="bg-white p-10 rounded-[40px] shadow-sm animate-fade-in space-y-8">
              <h3 className="text-2xl font-black text-gray-800">প্রোফাইল ফটো আপডেট</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 border-2 border-dashed border-gray-100 rounded-3xl text-center">
                  <p className="text-sm font-bold text-gray-400 mb-4">ছাত্রের ছবি</p>
                  <button onClick={() => handleUpdatePhoto('Student Photo')} className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl font-bold">ফাইল সিলেক্ট করুন</button>
                </div>
                <div className="p-6 border-2 border-dashed border-gray-100 rounded-3xl text-center">
                  <p className="text-sm font-bold text-gray-400 mb-4">পিতার ছবি</p>
                  <button onClick={() => handleUpdatePhoto('Father Photo')} className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl font-bold">ফাইল সিলেক্ট করুন</button>
                </div>
              </div>
            </div>
          )}

          {activeView === 'homework' && (
            <div className="bg-white p-10 rounded-[40px] shadow-sm animate-fade-in">
              <h3 className="text-2xl font-black text-gray-800 mb-6">নতুন হোমওয়ার্ক সাবমিট</h3>
              <form onSubmit={handleHomeworkSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <select className="p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none">
                    <option>শিক্ষক নির্বাচন করুন</option>
                    <option>মোঃ ইসমাইল হোসেন</option>
                    <option>মোসাঃ জেসমিন আরা</option>
                  </select>
                  <select className="p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none">
                    <option>বিষয়</option>
                    <option>বাংলা</option>
                    <option>ইংরেজি</option>
                    <option>গণিত</option>
                  </select>
                </div>
                <textarea placeholder="হোমওয়ার্ক এর বর্ণনা বা উত্তর এখানে লিখুন..." className="w-full h-40 p-5 rounded-3xl bg-gray-50 border border-gray-100 outline-none"></textarea>
                <div className="flex gap-4">
                   <button type="button" className="bg-gray-100 text-gray-600 px-6 py-4 rounded-2xl font-bold"><i className="fas fa-camera mr-2"></i> ছবি তুলুন</button>
                   <button type="submit" className="flex-grow bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black shadow-lg">জমা দিন ➔</button>
                </div>
              </form>
            </div>
          )}

          {activeView === 'results' && (
            <div className="animate-fade-in space-y-8">
              {academicResults.length === 0 ? (
                <div className="bg-white p-20 text-center rounded-[48px] border-2 border-dashed border-gray-100">
                  <p className="text-gray-300 font-black italic">এখনো কোনো একাডেমিক ফলাফল প্রকাশিত হয়নি।</p>
                </div>
              ) : (
                academicResults.map((term: any) => (
                  <div key={term.id} className="bg-white p-10 rounded-[56px] shadow-xl border border-gray-50 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-10 opacity-5 -mr-10 -mt-10">
                      <i className="fas fa-medal text-[200px] text-emerald-900"></i>
                    </div>
                    
                    <div className="flex justify-between items-start mb-10 relative z-10">
                      <div>
                        <h3 className="text-3xl font-black text-gray-800 mb-2">{term.termTitle}</h3>
                        <p className="text-sm font-bold text-gray-400">প্রকাশের তারিখ: {term.date}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-4xl font-black mb-1 ${term.isPassed ? 'text-emerald-600' : 'text-red-500'}`}>{term.finalGrade}</div>
                        <p className="text-xs font-black text-gray-300 uppercase tracking-widest">GPA: {term.totalGPA.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto relative z-10">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b-2 border-gray-50">
                            <th className="py-4 font-black text-gray-400 text-xs uppercase tracking-widest">বিষয়</th>
                            <th className="py-4 font-black text-gray-400 text-xs uppercase tracking-widest">প্রাপ্ত নম্বর</th>
                            <th className="py-4 font-black text-gray-400 text-xs uppercase tracking-widest text-right">গ্রেড</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {term.subjects.map((s: any, i: number) => (
                            <tr key={i} className="group hover:bg-gray-50 transition-colors">
                              <td className="py-4 font-bold text-gray-700">{s.subject}</td>
                              <td className="py-4">
                                <span className="font-black text-gray-900">{s.mark}</span>
                                <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.mark}%` }}></div>
                                </div>
                              </td>
                              <td className="py-4 text-right">
                                <span className={`font-black px-3 py-1 rounded-lg text-sm ${s.grade === 'F' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-700'}`}>
                                  {s.grade} ({s.point.toFixed(1)})
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-10 pt-8 border-t flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl">🏆</div>
                        <p className="text-sm font-bold text-gray-600 max-w-xs">
                          {term.isPassed ? 'অসাধারন পারফরম্যান্স! তোমার মেধার স্বাক্ষর বজায় রেখো।' : 'কিছু বিষয়ে আরও মনোযোগ প্রয়োজন। হাল ছেড়ো না!'}
                        </p>
                      </div>
                      <button onClick={() => window.print()} className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-lg transform active:scale-95 transition">
                        মার্কশিট ডাউনলোড
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
