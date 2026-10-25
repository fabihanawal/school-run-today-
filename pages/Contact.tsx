import React, { useState } from 'react';
import { useSchoolSettings, useCollection, KEYS } from '../src/lib/storage';
import { ContactMessage } from '../types';

const Contact: React.FC = () => {
  const [settings] = useSchoolSettings();
  const [, setMessages] = useCollection<ContactMessage>(KEYS.MESSAGES, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;

    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      subject: formData.subject || 'সাধারণ অনুসন্ধান',
      message: formData.message,
      date: new Date().toLocaleDateString('bn-BD'),
      read: false
    };

    const existing: ContactMessage[] = JSON.parse(localStorage.getItem(KEYS.MESSAGES) || '[]');
    const updated = [newMessage, ...existing];
    setMessages(updated);
    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            সরাসরি যোগাযোগ
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            আমাদের সাথে যোগাযোগ করুন
          </h1>
          <p className="text-slate-600 mt-3 text-base">
            ভর্তি, একাডেমিক তথ্য বা যেকোনো সাধারণ অনুসন্ধানের জন্য আমাদের অফিস চলাকালীন সময়ে সরাসরি বা অনলাইনে যোগাযোগ করতে পারেন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-slate-900 pb-3 border-b border-slate-100">
                বিদ্যালয়ের যোগাযোগের ঠিকানা
              </h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg flex-shrink-0">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">বিদ্যালয় চত্বর</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{settings.address}</p>
                    <p className="text-[11px] text-emerald-700 font-bold mt-1">EIIN: {settings.eiin}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg flex-shrink-0">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">টেলিফোন ও মোবাইল</h3>
                    <p className="text-xs text-slate-700 font-mono mt-0.5">{settings.phone1}</p>
                    {settings.phone2 && <p className="text-xs text-slate-700 font-mono">{settings.phone2}</p>}
                    <p className="text-[11px] text-slate-400 mt-1">অফিস চলাকালীন সময়ে কল করুন</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg flex-shrink-0">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">অফিসিয়াল ইমেইল</h3>
                    <p className="text-xs text-slate-700 font-mono mt-0.5">{settings.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-2 border-t border-slate-100">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg flex-shrink-0">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">অফিস সময়সূচি</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{settings.officeHours || 'শনি - বৃহস্পতি: সকাল ৮:০০ - বিকাল ৪:০০'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="rounded-3xl overflow-hidden h-72 border border-slate-200/80 shadow-sm bg-slate-200">
              <iframe
                title="School Location Map"
                src={settings.googleMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact & Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-2">বার্তা বা মতামত পাঠান</h2>
              <p className="text-xs text-slate-500 mb-8">
                আপনার যেকোনো প্রশ্ন বা মতামত এখানে লিখে পাঠান, আমাদের অফিসিয়াল প্রতিনিধি শীঘ্রই যোগাযোগ করবেন।
              </p>

              {submitted && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
                  <i className="fas fa-check-circle text-xl text-emerald-600"></i>
                  <div>
                    <p className="text-sm font-bold">ধন্যবাদ! আপনার বার্তাটি সফলভাবে সংরক্ষিত হয়েছে।</p>
                    <p className="text-xs text-emerald-700 mt-0.5">বিদ্যালয় কর্তৃপক্ষ শীঘ্রই আপনার প্রদত্ত নম্বরে যোগাযোগ করবে।</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      আপনার নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="যেমন: মোঃ কামরুল ইসলাম"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      মোবাইল নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="যেমন: ০১৭১xxxxxxxx"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      ইমেইল ঠিকানা (ঐচ্ছিক)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      বিষয়
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="যেমন: ভর্তি সংক্রান্ত তথ্য"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    আপনার বার্তা বা বিস্তারিত তথ্য <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="এখানে আপনার প্রশ্ন বা বার্তাটি পরিষ্কারভাবে লিখুন..."
                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 px-6 rounded-xl transition shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-paper-plane text-xs"></i>
                  <span>বার্তা পাঠিয়ে দিন</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
