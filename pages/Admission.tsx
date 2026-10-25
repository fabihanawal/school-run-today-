import React, { useState } from 'react';
import { useSchoolSettings, useCollection, KEYS } from '../src/lib/storage';
import { AdmissionSubmission } from '../types';

const Admission: React.FC = () => {
  const [settings] = useSchoolSettings();
  const [, setAdmissions] = useCollection<AdmissionSubmission>(KEYS.ADMISSIONS, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<AdmissionSubmission | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

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
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof files) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('ফাইলের সাইজ সর্বোচ্চ ২ মেগাবাইট হতে পারবে।');
        e.target.value = '';
        return;
      }
      setErrorMessage('');
      const base64 = await toBase64(file);
      setFiles((prev) => ({ ...prev, [field]: base64 }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!files.studentPhoto) {
      setErrorMessage('শিক্ষার্থীর পাসপোর্ট সাইজের ছবি আপলোড করা আবশ্যক।');
      return;
    }

    setIsSubmitting(true);
    const trackingNo = 'SIA-' + Math.floor(100000 + Math.random() * 900000);
    const newSubmission: AdmissionSubmission = {
      ...formData,
      ...files,
      id: 'ADM-' + Date.now(),
      trackingNo,
      status: 'PENDING',
      appliedDate: new Date().toLocaleDateString('bn-BD')
    };

    try {
      const currentSubmissions: AdmissionSubmission[] = JSON.parse(localStorage.getItem(KEYS.ADMISSIONS) || '[]');
      const updated = [newSubmission, ...currentSubmissions];
      setAdmissions(updated);
      setSubmittedData(newSubmission);
      setFormData({
        name: '',
        fatherName: '',
        motherName: '',
        birthDate: '',
        targetClass: '১ম',
        gender: 'ছেলে',
        phone: '',
        address: ''
      });
      setFiles({ studentPhoto: '', birthCertificate: '', fatherPhoto: '', motherPhoto: '' });
    } catch {
      setErrorMessage('আবেদন জমা দিতে সমস্যা হয়েছে। ফাইল সাইজ ছোট করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            সেশন {settings.currentSession || '২০২৪-২০২৫'}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            অনলাইন ভর্তি আবেদন ফরম
          </h1>
          <p className="text-slate-600 mt-3 text-sm md:text-base">
            {settings.schoolName} — সঠিক তথ্য প্রদান করে অনলাইন আবেদন সম্পন্ন করুন এবং আবেদনপত্রটি সংরক্ষণ করুন।
          </p>
        </div>

        {/* Admission Closed State */}
        {!settings.admissionOpen && !submittedData && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-8 text-center max-w-2xl mx-auto mb-10 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mx-auto mb-4">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">অনলাইন ভর্তি বর্তমানে স্থগিত রয়েছে</h3>
            <p className="text-sm text-slate-600 mb-4">
              পরবর্তী ভর্তি সেশনের নোটিশ খুব শীঘ্রই নোটিশ বোর্ডে প্রকাশ করা হবে। জরুরি প্রয়োজনে অফিস চলাকালীন বিদ্যালয়ে যোগাযোগ করুন।
            </p>
            <p className="text-xs font-bold text-emerald-800">হেল্পলাইন: {settings.phone1}</p>
          </div>
        )}

        {/* Submission Success & Printable Slip */}
        {submittedData && (
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-emerald-200 shadow-xl mb-12 animate-fade-in">
            <div className="text-center pb-6 border-b border-slate-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                <i className="fas fa-check"></i>
              </div>
              <h2 className="text-2xl font-black text-slate-900">ভর্তি আবেদন সফলভাবে গৃহীত হয়েছে!</h2>
              <p className="text-sm text-slate-500 mt-1">
                আপনার আবেদনের ট্র্যাকিং নম্বর: <strong className="text-emerald-700 font-mono text-lg">{submittedData.trackingNo}</strong>
              </p>
            </div>

            {/* Official Admission Slip Content */}
            <div className="my-8 p-6 rounded-2xl bg-slate-50 border border-slate-200" id="admission-slip">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-black text-emerald-900">{settings.schoolName}</h3>
                  <p className="text-xs text-slate-500">EIIN: {settings.eiin} · {settings.address}</p>
                  <span className="inline-block bg-emerald-700 text-white text-[11px] font-bold px-3 py-0.5 rounded mt-2">
                    ভর্তি আবেদন কনফার্মেশন স্লিপ
                  </span>
                </div>
                {submittedData.studentPhoto && (
                  <img
                    src={submittedData.studentPhoto}
                    alt="Applicant"
                    className="w-24 h-28 object-cover rounded-xl border-2 border-emerald-600 shadow"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase block">শিক্ষার্থীর নাম</span>
                  <span className="font-black text-slate-900">{submittedData.name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase block">আবেদিত শ্রেণি</span>
                  <span className="font-black text-emerald-700">{submittedData.targetClass}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase block">পিতার নাম</span>
                  <span className="font-semibold text-slate-800">{submittedData.fatherName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase block">মাতার নাম</span>
                  <span className="font-semibold text-slate-800">{submittedData.motherName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase block">অভিভাবকের মোবাইল</span>
                  <span className="font-mono font-bold text-slate-900">{submittedData.phone}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase block">আবেদনের তারিখ</span>
                  <span className="font-medium text-slate-700">{submittedData.appliedDate}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>আবেদন স্ট্যাটাস: <strong className="text-amber-600">বিচারাধীন (Pending)</strong></span>
                <span>হেল্পলাইন: {settings.phone1}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => window.print()}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-6 py-3 rounded-xl text-sm transition shadow flex items-center gap-2"
              >
                <i className="fas fa-print"></i>
                <span>স্লিপ প্রিন্ট / ডাউনলোড করুন</span>
              </button>
              <button
                onClick={() => setSubmittedData(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-6 py-3 rounded-xl text-sm transition"
              >
                নতুন আবেদন করুন
              </button>
            </div>
          </div>
        )}

        {/* Application Form */}
        {settings.admissionOpen && !submittedData && (
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200/80 shadow-sm space-y-10">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold flex items-center gap-3">
                <i className="fas fa-exclamation-circle text-lg"></i>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Section 1: Student Information */}
            <div>
              <h2 className="text-xl font-black text-slate-900 pb-3 border-b border-slate-200 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">১</span>
                <span>শিক্ষার্থীর ব্যক্তিগত তথ্য</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    শিক্ষার্থীর পূর্ণ নাম (বাংলায়) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="যেমন: মোঃ আব্দুল্লাহ"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    আবেদিত শ্রেণি <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.targetClass}
                    onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="প্লে">প্লে (Play)</option>
                    <option value="নার্সারি">নার্সারি (Nursery)</option>
                    <option value="১ম">১ম শ্রেণি</option>
                    <option value="২য়">২য় শ্রেণি</option>
                    <option value="৩য়">৩য় শ্রেণি</option>
                    <option value="৪র্থ">৪র্থ শ্রেণি</option>
                    <option value="৫ম">৫ম শ্রেণি</option>
                    <option value="৬ষ্ঠ">৬ষ্ঠ শ্রেণি</option>
                    <option value="৭ম">৭ম শ্রেণি</option>
                    <option value="৮ম">৮ম শ্রেণি</option>
                    <option value="৯ম">৯ম শ্রেণি</option>
                    <option value="হিফয শাখা">হিফযুল কুরআন বিভাগ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    জন্ম তারিখ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    লিঙ্গ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ছেলে">ছাত্র (ছেলে)</option>
                    <option value="মেয়ে">ছাত্রী (মেয়ে)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Parents & Contact */}
            <div>
              <h2 className="text-xl font-black text-slate-900 pb-3 border-b border-slate-200 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">২</span>
                <span>পিতা-মাতা ও যোগাযোগের বিবরণ</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    পিতার নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    placeholder="পিতার নাম লিখুন"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    মাতার নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    placeholder="মাতার নাম লিখুন"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    অভিভাবকের সচল মোবাইল নম্বর <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="০১৭১xxxxxxxx"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    বর্তমান ঠিকানা <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="গ্রাম/রোড, ডাকঘর, উপজেলা, জেলা"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Document & Photo Upload */}
            <div>
              <h2 className="text-xl font-black text-slate-900 pb-3 border-b border-slate-200 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">৩</span>
                <span>প্রয়োজনীয় ছবি ও সনদ আপলোড</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="block text-xs font-bold text-slate-700 mb-3">
                    শিক্ষার্থীর পাসপোর্ট সাইজ ছবি <span className="text-red-500">*</span>
                  </span>
                  {files.studentPhoto ? (
                    <div className="relative inline-block">
                      <img src={files.studentPhoto} alt="Student" className="w-24 h-28 object-cover rounded-xl mx-auto border-2 border-emerald-500 mb-3" />
                      <button
                        type="button"
                        onClick={() => setFiles({ ...files, studentPhoto: '' })}
                        className="text-xs text-red-500 font-bold hover:underline"
                      >
                        ছবি পরিবর্তন করুন
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer inline-flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl hover:border-emerald-500 bg-white transition">
                      <i className="fas fa-camera text-2xl text-slate-400 mb-2"></i>
                      <span className="text-xs font-bold text-emerald-700">ফাইল নির্বাচন করুন</span>
                      <span className="text-[10px] text-slate-400 mt-1">সর্বোচ্চ ২ মেগাবাইট (JPG/PNG)</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'studentPhoto')} className="hidden" />
                    </label>
                  )}
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="block text-xs font-bold text-slate-700 mb-3">
                    জন্ম সনদের ছবি/কপি (ঐচ্ছিক)
                  </span>
                  {files.birthCertificate ? (
                    <div className="relative inline-block">
                      <img src={files.birthCertificate} alt="Certificate" className="w-24 h-28 object-cover rounded-xl mx-auto border-2 border-emerald-500 mb-3" />
                      <button
                        type="button"
                        onClick={() => setFiles({ ...files, birthCertificate: '' })}
                        className="text-xs text-red-500 font-bold hover:underline"
                      >
                        ফাইল পরিবর্তন করুন
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer inline-flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl hover:border-emerald-500 bg-white transition">
                      <i className="fas fa-file-invoice text-2xl text-slate-400 mb-2"></i>
                      <span className="text-xs font-bold text-emerald-700">ফাইল নির্বাচন করুন</span>
                      <span className="text-[10px] text-slate-400 mt-1">সর্বোচ্চ ২ মেগাবাইট (JPG/PNG)</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'birthCertificate')} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-black py-4 px-8 rounded-2xl transition shadow-xl hover:shadow-emerald-600/30 text-base flex items-center justify-center gap-3"
            >
              <i className="fas fa-paper-plane"></i>
              <span>{isSubmitting ? 'আবেদন জমা হচ্ছে...' : 'অনলাইন ভর্তি আবেদন সাবমিট করুন'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Admission;
