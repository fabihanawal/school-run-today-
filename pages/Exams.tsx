import React, { useState } from 'react';
import { useCollection, KEYS, useSchoolSettings } from '../src/lib/storage';
import { Quiz } from '../types';

interface ExamsProps {
  currentUser: any;
  role: string;
}

const Exams: React.FC<ExamsProps> = ({ currentUser, role }) => {
  const [settings] = useSchoolSettings();
  const [availableQuizzes] = useCollection<Quiz>(KEYS.QUIZZES, []);

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleNext = () => {
    if (!activeQuiz) return;
    const isCorrect = selectedAnswer === activeQuiz.questions[currentStep].correctIndex;
    const newScore = isCorrect ? score + 1 : score;

    if (currentStep < activeQuiz.questions.length - 1) {
      setScore(newScore);
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
    } else {
      setScore(newScore);
      setIsFinished(true);

      // Save to student profile if logged in
      if (role === 'STUDENT' && currentUser) {
        const studentDb = JSON.parse(localStorage.getItem('sia_students_db') || '[]');
        const studentIndex = studentDb.findIndex((s: any) => s.id === currentUser.id);

        const newResult = {
          quizId: activeQuiz.id,
          quizTitle: activeQuiz.title,
          score: newScore,
          totalQuestions: activeQuiz.questions.length,
          date: new Date().toLocaleDateString('bn-BD')
        };

        if (studentIndex > -1) {
          if (!studentDb[studentIndex].results) studentDb[studentIndex].results = [];
          studentDb[studentIndex].results.unshift(newResult);
          localStorage.setItem('sia_students_db', JSON.stringify(studentDb));
        }
      }
    }
  };

  const resetQuiz = () => {
    setActiveQuiz(null);
    setCurrentStep(0);
    setScore(0);
    setIsFinished(false);
    setSelectedAnswer(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {!activeQuiz ? (
          <div className="space-y-12 animate-fade-in">
            <div className="text-center max-w-3xl mx-auto">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                অনলাইন পরীক্ষা ও মূল্যায়ন
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                মেধা মূল্যায়ন ও কুইজ পোর্টাল
              </h1>
              <p className="text-slate-600 mt-2 text-sm md:text-base">
                {settings.schoolName}-এর শিক্ষার্থীদের জন্য বিভিন্ন বিষয়ের বহু নির্বাচনী প্রশ্নব্যাংক ও স্ব-মূল্যায়ন টেস্ট।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white p-7 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-xl transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-[11px] font-bold">
                        {quiz.targetClass}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        <i className="far fa-clock mr-1"></i> {quiz.durationMinutes} মিনিট
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-emerald-700 transition">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-bold mb-4">
                      বিষয়: <span className="text-slate-700">{quiz.subject}</span> · {quiz.questions?.length || 0} টি প্রশ্ন
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveQuiz(quiz)}
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-black text-xs transition shadow flex items-center justify-center gap-2"
                  >
                    <span>কুইজ শুরু করুন</span>
                    <i className="fas fa-play text-[10px]"></i>
                  </button>
                </div>
              ))}

              {availableQuizzes.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-slate-200 text-slate-400">
                  <i className="fas fa-brain text-4xl mb-3 text-slate-300"></i>
                  <p className="font-bold">বর্তমানে কোনো অনলাইন কুইজ সক্রিয় নেই</p>
                  <p className="text-xs text-slate-400 mt-1">এডমিন প্যানেল থেকে নতুন কুইজ যুক্ত করা যাবে।</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {!isFinished ? (
              <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200 relative overflow-hidden animate-fade-in">
                <div
                  className="absolute top-0 left-0 h-1.5 bg-emerald-600 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / (activeQuiz.questions?.length || 1)) * 100}%` }}
                ></div>

                <div className="flex justify-between items-center mb-8">
                  <button onClick={resetQuiz} className="text-slate-400 hover:text-red-500 font-bold text-xs flex items-center gap-1">
                    <i className="fas fa-times"></i>
                    <span>বাতিল</span>
                  </button>
                  <span className="bg-emerald-50 text-emerald-800 px-3.5 py-1 rounded-full font-black text-xs">
                    প্রশ্ন {currentStep + 1} / {activeQuiz.questions.length}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black mb-8 leading-snug text-slate-900">
                  {activeQuiz.questions[currentStep].question}
                </h2>

                <div className="space-y-3">
                  {activeQuiz.questions[currentStep].options.map((opt: string, i: number) => {
                    const isSelected = selectedAnswer === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedAnswer(i)}
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 font-bold transition text-sm flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                            : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-full text-center leading-7 text-xs font-black flex-shrink-0 ${
                              isSelected ? 'bg-white text-emerald-700' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isSelected && <i className="fas fa-check-circle text-white"></i>}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={selectedAnswer === null}
                  onClick={handleNext}
                  className="w-full mt-8 bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white py-4 rounded-2xl font-black text-sm shadow-xl transition"
                >
                  {currentStep === activeQuiz.questions.length - 1 ? 'কুইজ সমাপ্ত করুন' : 'পরবর্তী প্রশ্ন ➔'}
                </button>
              </div>
            ) : (
              <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl text-center border border-slate-200 animate-fade-in">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl">
                  🎉
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">অভিনন্দন!</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-8">
                  {activeQuiz.title} সম্পন্ন হয়েছে
                </p>

                <div className="bg-emerald-50/70 p-8 rounded-3xl mb-8 border border-emerald-100">
                  <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-1">
                    আপনার মোট স্কোর
                  </p>
                  <div className="text-6xl font-black text-emerald-950 font-mono">
                    {score} <span className="text-xl text-emerald-600/70">/ {activeQuiz.questions.length}</span>
                  </div>
                </div>

                {role === 'STUDENT' ? (
                  <p className="text-emerald-700 font-bold text-xs mb-8 flex items-center justify-center gap-1.5">
                    <i className="fas fa-check-circle"></i> আপনার স্কোর ছাত্র প্রোফাইলে সংরক্ষিত হয়েছে
                  </p>
                ) : (
                  <p className="text-amber-700 font-bold text-xs mb-8 flex items-center justify-center gap-1.5">
                    <i className="fas fa-info-circle"></i> অতিথি হিসেবে অংশগ্রহণ করায় স্কোর সংরক্ষণ হয়নি (লগইন করে দিন)
                  </p>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={resetQuiz}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3.5 rounded-xl font-bold text-xs transition"
                  >
                    আবার কুইজ দিন
                  </button>
                  <a
                    href="#/"
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-xl font-bold text-xs transition shadow"
                  >
                    হোমপেজে ফিরে যান
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exams;
