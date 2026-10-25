import React, { useState } from 'react';
import { useSchoolSettings, useCollection, KEYS } from '../src/lib/storage';
import { Student, TermResult } from '../types';

const Results: React.FC = () => {
  const [settings] = useSchoolSettings();
  const [students] = useCollection<Student>(KEYS.STUDENTS, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedTermIndex, setSelectedTermIndex] = useState(0);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const clean = searchQuery.trim().toLowerCase();
    const found = students.find(
      (s) => s.id.toLowerCase() === clean || s.roll.toLowerCase() === clean
    );
    setSelectedStudent(found || null);
    setSelectedTermIndex(0);
  };

  const currentResult: TermResult | undefined = selectedStudent?.academicResults?.[selectedTermIndex];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Page Title */}
        <div className="text-center mb-12">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            একাডেমিক মূল্যায়ন ও গ্রেডশিট
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            অনলাইন পরীক্ষার ফলাফল
          </h1>
          <p className="text-slate-600 mt-2 text-sm md:text-base">
            শিক্ষার্থীর আইডি (যেমন: 124611 অথবা 124612) বা রোল নম্বর প্রদান করে অফিসিয়াল মার্কশিট দেখুন।
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-md mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ছাত্র আইডি বা রোল নম্বর লিখুন (উদা: 124611)"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-3.5 rounded-xl text-sm transition shadow hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>ফলাফল অনুসন্ধান</span>
              <i className="fas fa-arrow-right text-xs"></i>
            </button>
          </form>

          {/* Quick Demo ID helper */}
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <span>ডেমো আইডি পরীক্ষা করুন:</span>
            <button
              type="button"
              onClick={() => { setSearchQuery('124611'); }}
              className="text-emerald-700 font-bold hover:underline font-mono"
            >
              124611
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => { setSearchQuery('124612'); }}
              className="text-emerald-700 font-bold hover:underline font-mono"
            >
              124612
            </button>
          </div>
        </div>

        {/* Not Found State */}
        {searched && !selectedStudent && (
          <div className="bg-white p-10 rounded-3xl border border-red-100 shadow-sm text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl mx-auto mb-4">
              <i className="fas fa-user-times"></i>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">কোনো ফলাফল পাওয়া যায়নি</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              প্রদত্ত আইডি বা রোল নম্বরের কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি। অনুগ্রহ করে সঠিক আইডি দিয়ে আবার চেষ্টা করুন অথবা বিদ্যালয় অফিসে যোগাযোগ করুন।
            </p>
          </div>
        )}

        {/* Found Marksheet */}
        {selectedStudent && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden print:shadow-none print:border-none animate-fade-in" id="marksheet-print">
            {/* Header with Official School Crest */}
            <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white p-8 sm:p-10 text-center relative">
              <div className="max-w-2xl mx-auto">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block mb-1">
                  গভর্নমেন্ট অনুমোদিত শিক্ষা প্রতিষ্ঠান · EIIN: {settings.eiin}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mb-1">{settings.schoolName}</h2>
                <p className="text-xs text-emerald-200">{settings.address}</p>
                <div className="inline-block bg-amber-400 text-emerald-950 text-xs font-black px-4 py-1 rounded-md mt-4 shadow">
                  একাডেমিক গ্রেডশিট / মার্কশিট
                </div>
              </div>
            </div>

            {/* Term Selector */}
            {selectedStudent.academicResults && selectedStudent.academicResults.length > 1 && (
              <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center gap-2 overflow-x-auto print:hidden">
                <span className="text-xs font-bold text-slate-600">টার্ম নির্বাচন:</span>
                {selectedStudent.academicResults.map((r, i) => (
                  <button
                    key={r.id || i}
                    onClick={() => setSelectedTermIndex(i)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      selectedTermIndex === i
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {r.termTitle}
                  </button>
                ))}
              </div>
            )}

            {/* Student Profile Card */}
            <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50/50">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                  {selectedStudent.studentPhoto ? (
                    <img
                      src={selectedStudent.studentPhoto}
                      alt={selectedStudent.name}
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-600 shadow"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl font-black">
                      {selectedStudent.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{selectedStudent.name}</h3>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-slate-600 font-medium">
                      <span>আইডি: <strong className="text-slate-900 font-mono">{selectedStudent.id}</strong></span>
                      <span>·</span>
                      <span>শ্রেণি: <strong className="text-slate-900">{selectedStudent.class}</strong></span>
                      <span>·</span>
                      <span>রোল: <strong className="text-slate-900 font-mono">{selectedStudent.roll}</strong></span>
                      {selectedStudent.section && (
                        <>
                          <span>·</span>
                          <span>শাখা: <strong>{selectedStudent.section}</strong></span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Overall Score Badge */}
                {currentResult && (
                  <div className="text-center sm:text-right bg-white p-4 rounded-2xl border border-slate-200 shadow-sm min-w-[140px]">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">চূড়ান্ত ফলাফল</span>
                    <div className="text-3xl font-black text-emerald-700 mt-1">
                      {currentResult.finalGrade}
                    </div>
                    <div className="text-xs font-black text-slate-600 font-mono mt-0.5">
                      GPA: {currentResult.totalGPA?.toFixed(2)}
                    </div>
                    <span className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full mt-2 ${
                      currentResult.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {currentResult.isPassed ? 'উত্তীর্ণ (PASSED)' : 'অনুত্তীর্ণ (FAILED)'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Results Subject Table */}
            {currentResult ? (
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-black text-slate-900">
                    {currentResult.termTitle} ({currentResult.date})
                  </h4>
                  <span className="text-xs text-slate-500">মূল্যায়ন পদ্ধতি: গ্রেডিং স্কেল ৫.০০</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-black">
                        <th className="py-3 px-4">বিষয়</th>
                        <th className="py-3 px-4 text-center">প্রাপ্ত নম্বর</th>
                        <th className="py-3 px-4 text-center">লেটার গ্রেড</th>
                        <th className="py-3 px-4 text-right">গ্রেড পয়েন্ট (GP)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentResult.subjects.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-800">{sub.subject}</td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">{sub.mark}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-block font-black px-2.5 py-0.5 rounded text-xs ${
                              sub.grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {sub.grade}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-700">
                            {sub.point?.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Signatures & Footer for Print */}
                <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-500">
                  <div>
                    <div className="h-12 flex items-end justify-center mb-1">
                      <span className="border-b border-slate-400 w-36 inline-block"></span>
                    </div>
                    <p className="font-bold text-slate-700">শ্রেণি শিক্ষকের স্বাক্ষর</p>
                  </div>
                  <div>
                    <div className="h-12 flex items-end justify-center mb-1">
                      <span className="border-b border-slate-400 w-36 inline-block"></span>
                    </div>
                    <p className="font-bold text-slate-700">প্রধান শিক্ষকের স্বাক্ষর ও সিল</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 print:hidden">
                  <span className="text-xs text-slate-400">
                    * এটি একটি কম্পিউটার জেনারেটেড অনলাইন মার্কশিট।
                  </span>
                  <button
                    onClick={() => window.print()}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-2.5 rounded-xl text-xs transition shadow flex items-center gap-2"
                  >
                    <i className="fas fa-print"></i>
                    <span>মার্কশিট প্রিন্ট / পিডিএফ সংরক্ষণ</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                <i className="fas fa-file-excel text-3xl mb-2 text-slate-300"></i>
                <p className="text-sm font-bold">এই শিক্ষার্থীর কোনো ফলাফল এখনো প্রকাশিত হয়নি।</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
