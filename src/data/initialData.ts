import { SiteSettings, Course, StaffProfile, Notice, GalleryImage, Student, Quiz } from '../../types';

export const DEFAULT_SETTINGS: SiteSettings = {
  schoolName: 'শিবগঞ্জ ইসলামী একাডেমী',
  tagline: 'সততা, নৈতিকতা ও শিক্ষার সমন্বয়ে একটি শ্রেষ্ঠ আদর্শ বিদ্যাপীঠ',
  eiin: '১২৪৬১১',
  estYear: '১৯৯৮',
  motto: 'জ্ঞানই আলো, নৈতিকতাই শক্তি',
  logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&h=200&fit=crop&q=80',
  phone1: '০১৭১৬-১৩৭৭০৮',
  phone2: '০১৮৭৭-৫৫০৫৫৮',
  email: 's124611@gmail.com',
  address: 'শিবগঞ্জ বাজার রোড, ডাকঘর: শিবগঞ্জ, উপজেলা: শিবগঞ্জ, জেলা: চাঁপাইনবাবগঞ্জ - ৬৩৩০',
  officeHours: 'শনিবার - বৃহস্পতিবার: সকাল ৮:০০ - বিকাল ৪:০০ (শুক্রবার বন্ধ)',
  googleMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14523.568448550756!2d88.2583!3d24.685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fbc41c73a8e9d7%3A0x6b696f8a42f7783a!2sShibganj%2C%20Chapai%20Nawabganj!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd',
  facebookUrl: 'https://facebook.com',
  youtubeUrl: 'https://youtube.com',
  whatsapp: '01716137708',
  principalName: 'মোহা: ইব্রাহিম খলিল',
  principalDesignation: 'প্রধান শিক্ষক',
  principalMsg: 'বিসমিল্লাহির রাহমানির রাহিম। শিবগঞ্জ ইসলামী একাডেমী একবিংশ শতাব্দীর চ্যালেঞ্জ মোকাবেলায় সুশিক্ষিত, নৈতিকতাসম্পন্ন ও দেশপ্রেমিক নাগরিক গড়ার দৃঢ় প্রত্যয় নিয়ে কাজ করে যাচ্ছে। আমরা পুঁথিগত বিদ্যার পাশাপাশি বিশুদ্ধ কুরআন তিলাওয়াত, নৈতিক মূল্যবোধ ও আধুনিক বিজ্ঞান-প্রযুক্তির সুষম সমন্বয় নিশ্চিত করি। আপনার সন্তানের উজ্জ্বল ভবিষ্যৎ গঠনে আমাদের সাথে থাকুন।',
  principalPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&h=600&fit=crop&crop=faces&q=80',
  chairmanName: 'আলহাজ্ব মোঃ জয়নাল আবেদিন',
  chairmanDesignation: 'সম্মানিত সভাপতি, গভর্নিং বডি',
  chairmanMsg: 'শিক্ষাই জাতির মেরুদণ্ড, আর নৈতিকতা তার ভিত্তি। যে শিক্ষা মানুষকে ভালো ও মন্দের পার্থক্য শেখায় না, সে শিক্ষা প্রকৃত কল্যাণ বয়ে আনতে পারে না। আমাদের প্রতিষ্ঠান চাঁপাইনবাবগঞ্জের প্রত্যন্ত জনপদে শিক্ষার আলো ছড়িয়ে দিতে নিরলসভাবে কাজ করছে। অভিভাবক, শিক্ষক ও শিক্ষার্থীদের যৌথ প্রচেষ্টায় একাডেমী উত্তরোত্তর উন্নতির শিখরে আরোহণ করবে—এটাই আমার প্রত্যাশা।',
  chairmanPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=faces&q=80',
  bannerImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&h=800&fit=crop&q=80',
  scrollingHeadline: '📢 ২০২৩-২০২৪ শিক্ষাবর্ষের প্লে থেকে নবম শ্রেণিতে ভর্তি ফরম বিতরণ চলছে ••• অর্ধবার্ষিক পরীক্ষার ফলাফল প্রকাশিত হয়েছে ••• আগামী ১৫ই নভেম্বর বার্ষিক ক্রীড়া প্রতিযোগিতা অনুষ্ঠিত হবে।',
  sliderImages: [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&h=900&fit=crop&q=80',
      title: 'আধুনিক শিক্ষা ও ইসলামী আদর্শের অনন্য সমন্বয়',
      subtitle: 'শিবগঞ্জ ইসলামী একাডেমী — আলোকিত মানুষ গড়ার বিশ্বস্ত প্রতিষ্ঠান',
      buttonText: 'অনলাইন ভর্তি আবেদন',
      buttonLink: '/admission'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&h=900&fit=crop&q=80',
      title: 'স্মার্ট মাল্টিমিডিয়া ক্লাসরুম ও দক্ষ শিক্ষক পরিষদ',
      subtitle: 'প্রযুক্তিবান্ধব শিক্ষণ পদ্ধতি ও সার্বক্ষণিক সিসিটিভি নিয়ন্ত্রিত ক্যাম্পাস',
      buttonText: 'একাডেমিক কার্যক্রম',
      buttonLink: '/courses'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&h=900&fit=crop&q=80',
      title: 'বিশুদ্ধ কুরআন শিক্ষা ও চরিত্র গঠনের নিরাপদ পরিবেশ',
      subtitle: 'জাতীয় পাঠ্যক্রমের সাথে নূরানী কুরআন তিলাওয়াত ও মাসয়ালা শিক্ষা',
      buttonText: 'ফলাফল যাচাই করুন',
      buttonLink: '/results'
    }
  ],
  aboutTitle: 'প্রতিষ্ঠার ইতিহাস ও আমাদের মিশন',
  aboutHistory: 'চাঁপাইনবাবগঞ্জের ঐতিহ্যবাহী শিবগঞ্জ উপজেলায় ১৯৯৮ সালে বিশিষ্ট শিক্ষানুরাগী, সচেতন অভিভাবক ও আলেম-ওলামাদের ঐকান্তিক প্রচেষ্টায় শিবগঞ্জ ইসলামী একাডেমীর শুভ সূচনা ঘটে। আধুনিক বিজ্ঞান-প্রযুক্তি এবং বিশুদ্ধ ইসলামী শিক্ষার সুষম মেলবন্ধন ঘটিয়ে এই অঞ্চলের পিছিয়ে পড়া জনগোষ্ঠীকে জ্ঞানের আলোয় আলোকিত করাই ছিল এর মূল দর্শন। গত আড়াই দশকে প্রতিষ্ঠানটি অসংখ্য কৃতি শিক্ষার্থী তৈরি করেছে যারা আজ দেশ ও বিদেশের বিভিন্ন গুরুত্বপূর্ণ ক্ষেত্রে অবদান রাখছে।',
  aboutMission: 'আমাদের লক্ষ্য হলো জাতীয় শিক্ষাক্রমের আলোকে আধুনিক শিক্ষার সাথে ইসলামী মূল্যবোধের সংমিশ্রণ ঘটিয়ে শিক্ষার্থীদের শারীরিক, মানসিক ও আত্মিক উৎকর্ষ সাধন করা, যাতে তারা চরিত্রবান, কর্মঠ এবং আদর্শ দেশপ্রেমিক নাগরিক হিসেবে আত্মপ্রকাশ করতে পারে।',
  aboutVision: 'একটি আধুনিক, ডিজিটালাইজড ও আদর্শ ইসলামী শিক্ষাপ্রতিষ্ঠান হিসেবে সমগ্র উত্তরবঙ্গে শীর্ষস্থান অর্জন এবং শিক্ষার্থীদের সর্বোচ্চ একাডেমিক সাফল্যের পাশাপাশি দ্বীন ও নৈতিকতায় অনুকরণীয় ব্যক্তিত্ব হিসেবে গড়ে তোলা।',
  aboutImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&h=800&fit=crop&q=80',
  stats: [
    { id: '1', label: 'অভিজ্ঞ শিক্ষক ও স্টাফ', value: '২৮+', icon: 'fas fa-chalkboard-teacher' },
    { id: '2', label: 'বর্তমান শিক্ষার্থী', value: '১,২০০+', icon: 'fas fa-user-graduate' },
    { id: '3', label: 'পাবলিক পরীক্ষায় পাশের হার', value: '১০০%', icon: 'fas fa-award' },
    { id: '4', label: 'ডিজিটাল ল্যাব ও শ্রেণিকক্ষ', value: '২০+', icon: 'fas fa-laptop-code' }
  ],
  features: [
    {
      id: '1',
      title: 'আধুনিক ও দ্বীনি শিক্ষা',
      description: 'জাতীয় পাঠ্যক্রমের শতভাগ অনুসরণসহ তাজবীদভিত্তিক সহিহ কুরআন ও মাসয়ালা শিক্ষাদান।',
      icon: 'fas fa-book-reader',
      color: 'emerald'
    },
    {
      id: '2',
      title: 'ডিজিটাল স্মার্ট ক্লাসরুম',
      description: 'মাল্টিমিডিয়া প্রজেক্টর, কম্পিউটার ল্যাব ও ইন্টারঅ্যাক্টিভ অডিও-ভিজ্যুয়াল কনটেন্ট।',
      icon: 'fas fa-desktop',
      color: 'blue'
    },
    {
      id: '3',
      title: 'সিসিটিভি ও নিরাপদ ক্যাম্পাস',
      description: '২৪ ঘণ্টা ক্লোজড-সার্কিট ক্যামেরা নজরদারি ও শিক্ষার্থীদের জন্য সুরক্ষিত মনোরম পরিবেশ।',
      icon: 'fas fa-shield-alt',
      color: 'amber'
    },
    {
      id: '4',
      title: 'সহ-শিক্ষা ও ক্রীড়া কার্যক্রম',
      description: 'প্রতি শুক্রবার বিতর্ক প্রতিযোগিতা, ক্বিরাত প্রতিযোগিতা, দেয়ালিকা প্রকাশ ও বার্ষিক খেলাধুলা।',
      icon: 'fas fa-trophy',
      color: 'purple'
    }
  ],
  admissionOpen: true,
  admissionDeadline: '২০ ডিসেম্বর, ২০২৪',
  currentSession: '২০২৪-২০২৫',
  homeLayout: 'classic'
};

export const DEFAULT_COURSES: Course[] = [
  {
    id: '1',
    title: 'কিন্ডারগার্টেন শাখা (প্লে - নার্সারি)',
    category: 'প্রাক-প্রাথমিক',
    description: 'ছোট্ট সোনামণিদের আনন্দঘন পরিবেশে অক্ষর জ্ঞান, ছড়া, ছবি আঁকা ও মৌলিক ইসলামী আদব-কায়দা হাতেখড়ি। খেলার ছলে আনন্দের সাথে শিক্ষা।',
    icon: '🎨',
    features: ['রঙিন ও সাজানো শ্রেণিকক্ষ', 'স্মার্ট কার্টুন ও ছড়ায় বর্ণমালা', 'মৌলিক দোয়া ও আদব শিক্ষা', 'নিয়মিত স্বাস্থ্য পরীক্ষা'],
    colorClass: 'bg-rose-50/70',
    borderClass: 'border-rose-200',
    ageGroup: '৪-৬ বছর',
    duration: '১ বছর মেয়াদী'
  },
  {
    id: '2',
    title: 'প্রাথমিক শাখা (১ম - ৫ম শ্রেণি)',
    category: 'প্রাথমিক শিক্ষা',
    description: 'সরকারি কারিকুলাম অনুযায়ী বাংলা, ইংরেজি ও গণিতের শক্তিশালী ভিত্তির পাশাপাশি নূরানী কুরআন তিলাওয়াত ও চরিত্র গঠন প্রশিক্ষণ।',
    icon: '📖',
    features: ['বিশুদ্ধ কুরআন ও নামাজ শিক্ষা', 'গণিত ও সাধারণ জ্ঞানে বিশেষ যত্ন', 'হাতে লেখার সুন্দরকরণ ক্লাস', 'দুর্বল শিক্ষার্থীদের এক্সট্রা কেয়ার'],
    colorClass: 'bg-emerald-50/70',
    borderClass: 'border-emerald-200',
    ageGroup: '৬-১১ বছর',
    duration: '৫ বছর মেয়াদী'
  },
  {
    id: '3',
    title: 'জুনিয়র ও মাধ্যমিক শাখা (৬ষ্ঠ - ১০ম শ্রেণি)',
    category: 'মাধ্যমিক শিক্ষা',
    description: 'নতুন শিক্ষাক্রমের আলোকে ব্যবহারিক বিজ্ঞান, তথ্যপ্রযুক্তি, ইংরেজি স্পোকেন ও SSC পরীক্ষায় জিপিএ-৫ নিশ্চিতকরণের নিবিড় একাডেমি প্রোগ্রাম।',
    icon: '🔬',
    features: ['আধুনিক কম্পিউটার ও বিজ্ঞান ল্যাব', 'স্পোকেন ইংলিশ ও প্রেজেন্টেশন', 'অধ্যায়ভিত্তিক মডেল টেস্ট ও গাইডলাইন', 'অভিজ্ঞ বিষয়ভিত্তিক শিক্ষক পরিষদ'],
    colorClass: 'bg-blue-50/70',
    borderClass: 'border-blue-200',
    ageGroup: '১১-১৬ বছর',
    duration: '৫ বছর মেয়াদী'
  },
  {
    id: '4',
    title: 'হিফযুল কুরআন ও নূরানী বিভাগ',
    category: 'বিশেষ বিভাগ',
    description: 'সাধারণ শিক্ষার পাশাপাশি অত্যন্ত যত্নসহকারে স্বল্প সময়ে সম্পূর্ণ কুরআনুল কারীম মুখস্থকরণের সুব্যবস্থা এবং আন্তর্জাতিক মানের ক্বিরাত প্রশিক্ষণ।',
    icon: '🕌',
    features: ['আন্তর্জাতিক সনদপ্রাপ্ত ক্বারী ও হাফেজ', 'পড়াশোনার পাশাপাশি হিফয করার সুযোগ', 'তাজবীদ ও মাখরাজ প্রশিক্ষণ', 'আবাসিক ও অনাবাসিক সুবিধা'],
    colorClass: 'bg-amber-50/70',
    borderClass: 'border-amber-200',
    ageGroup: '৭-১৫ বছর',
    duration: '২-৩ বছর মেয়াদী'
  }
];

export const DEFAULT_STAFF: StaffProfile[] = [
  {
    id: '1',
    name: 'মোহা: ইব্রাহিম খলিল',
    designation: 'প্রধান শিক্ষক',
    subject: 'ইসলামী শিক্ষা ও প্রশাসন',
    mobile: '০১৭১৬-১৩৭৭০৮',
    email: 'principal@sia.edu.bd',
    qualification: 'এম.এ (ইসলামিক স্টাডিজ), বি.এড (১ম শ্রেণি)',
    type: 'TEACHER',
    photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=400&fit=crop&crop=faces&q=80',
    joinDate: '১৯৯৮'
  },
  {
    id: '2',
    name: 'মোসাঃ জেসমিন আরা',
    designation: 'সহকারী প্রধান শিক্ষক',
    subject: 'বাংলা সাহিত্য',
    mobile: '০১৭১২-৩৪৫৬৭৮',
    email: 'jasmin@sia.edu.bd',
    qualification: 'এম.এ (বাংলা), এম.এড (রাবি)',
    type: 'TEACHER',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces&q=80',
    joinDate: '২০০৩'
  },
  {
    id: '3',
    name: 'মোঃ হাফিজুর রহমান',
    designation: 'সিনিয়র শিক্ষক (বিজ্ঞান)',
    subject: 'পদার্থ ও রসায়ন বিজ্ঞান',
    mobile: '০১৭১১-৮৮৯৯০০',
    qualification: 'বি.এস.সি (অনার্স), এম.এস.সি (পদার্থবিজ্ঞান)',
    type: 'TEACHER',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces&q=80',
    joinDate: '২০০৭'
  },
  {
    id: '4',
    name: 'হাফেজ ক্বারী মোঃ আব্দুল মালেক',
    designation: 'সিনিয়র ধর্মীয় শিক্ষক',
    subject: 'কুরআন ও আরবী ভাষা',
    mobile: '০১৮১৮-১১২২৩৩',
    qualification: 'দাওরায়ে হাদীস, কামিল (হাদীস)',
    type: 'TEACHER',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces&q=80',
    joinDate: '২০০৫'
  },
  {
    id: '5',
    name: 'তানভীর আহমেদ',
    designation: 'আইসিটি ও কম্পিউটার ইনস্ট্রাক্টর',
    subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
    mobile: '০১৭৯৯-৪৪৩৩২২',
    qualification: 'বি.এস.সি (কম্পিউটার সায়েন্স)',
    type: 'TEACHER',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces&q=80',
    joinDate: '২০১৫'
  },
  {
    id: '6',
    name: 'মোঃ আশরাফুল আলম',
    designation: 'প্রধান হিসাবরক্ষক ও অফিস সহকারী',
    subject: 'প্রশাসন ও হিসাব',
    mobile: '০১৮৭৭-৫৫০৫৫৮',
    qualification: 'বি.কম (হিসাববিজ্ঞান)',
    type: 'STAFF',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces&q=80',
    joinDate: '২০১০'
  },
  {
    id: '7',
    name: 'মোঃ রফিকুল ইসলাম',
    designation: 'ল্যাব ও লাইব্রেরি সহকারী',
    subject: 'আইটি সাপোর্ট ও লাইব্রেরি',
    mobile: '০১৭৫২-৯৯৮৮৭৭',
    qualification: 'এইচএসসি',
    type: 'STAFF',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces&q=80',
    joinDate: '২০১৮'
  }
];

export const DEFAULT_NOTICES: Notice[] = [
  {
    id: '1',
    title: '২০২৪-২০২৫ শিক্ষাবর্ষে প্লে থেকে ৯ম শ্রেণিতে নতুন শিক্ষার্থী ভর্তি বিজ্ঞপ্তি',
    date: '২০২৪-১১-০১',
    type: 'ADMISSION',
    pinned: true,
    content: 'সকল অভিভাবক ও শিক্ষার্থীদের অবগতির জন্য জানানো যাচ্ছে যে, আগামী ১৫ই নভেম্বর থেকে শিবগঞ্জ ইসলামী একাডেমীর ২০২৪-২০২৫ শিক্ষাবর্ষের ভর্তি ফরম বিতরণ শুরু হবে। অফিস কক্ষ থেকে অথবা বিদ্যালয়ের অফিশিয়াল ওয়েবসাইট থেকে অনলাইন ফরম পূরণ করা যাবে। বিস্তারিত জানতে অফিস চলাকালীন সময়ে যোগাযোগ করুন।',
    attachmentName: 'Admission_Notice_2025.pdf'
  },
  {
    id: '2',
    title: 'বার্ষিক পরীক্ষার চূড়ান্ত সময়সূচি ও প্রবেশপত্র বিতরণ সংক্রান্ত নোটিশ',
    date: '২০২৪-১০-২৮',
    type: 'EXAM',
    pinned: true,
    content: 'আগামী ০১ ডিসেম্বর ২০২৪ থেকে ৬ষ্ঠ থেকে ১০ম শ্রেণির বার্ষিক পরীক্ষা অনুষ্ঠিত হবে। সকল বকেয়া ফি পরিশোধ সাপেক্ষে আগামী ২৫ নভেম্বরের মধ্যে অফিস থেকে প্রবেশপত্র সংগ্রহ করার নির্দেশ দেওয়া হচ্ছে।',
    attachmentName: 'Exam_Routine_2024.pdf'
  },
  {
    id: '3',
    title: 'পবিত্র ঈদে মিলাদুন্নবী (সা.) ও জাতীয় ছুটি উপলক্ষে বিদ্যালয় বন্ধের নোটিশ',
    date: '২০২৪-০৯-১৫',
    type: 'HOLIDAY',
    pinned: false,
    content: 'পবিত্র ঈদে মিলাদুন্নবী (সা.) উপলক্ষে আগামী রবিবার বিদ্যালয় বন্ধ থাকবে। সোমবার থেকে যথারীতি নিয়মিত ক্লাস পরিচালিত হবে।'
  },
  {
    id: '4',
    title: 'অভিভাবক সমাবেশ ও ত্রৈমাসিক ফলাফল মূল্যায়ন সভার আহ্বান',
    date: '২০২৪-০৯-০৫',
    type: 'ACADEMIC',
    pinned: false,
    content: 'শিক্ষার্থীদের সার্বিক পড়াশোনার মানোন্নয়ন ও চরিত্র গঠন পর্যালোচনার জন্য আগামী শনিবার সকাল ১০ ঘটিকায় একাডেমীর অডিটোরিয়ামে এক বিশেষ অভিভাবক সমাবেশ অনুষ্ঠিত হবে। সকল সম্মানিত অভিভাবককে উপস্থিত থাকার বিনীত অনুরোধ রইল।'
  }
];

export const DEFAULT_GALLERY: GalleryImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=600&fit=crop&q=80',
    title: 'ডিজিটাল ক্লাসরুমে পাঠদান ও আলোচনা',
    category: 'CLASSROOM',
    date: '২০২৪'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=600&fit=crop&q=80',
    title: 'বিদ্যালয় চত্বরে বার্ষিক সাংস্কৃতিক ও ক্বিরাত প্রতিযোগিতা',
    category: 'EVENTS',
    date: '২০২৪'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop&q=80',
    title: 'একাডেমীর মনোরম ক্যাম্পাস ভবন ও প্রাঙ্গণ',
    category: 'CAMPUS',
    date: '২০২৪'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=800&h=600&fit=crop&q=80',
    title: 'বার্ষিক ক্রীড়া প্রতিযোগিতা ও ফুটবল টুর্নামেন্ট',
    category: 'SPORTS',
    date: '২০২৪'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop&q=80',
    title: 'বিজ্ঞান মেলা ও শিক্ষার্থীদের প্রজেক্ট প্রদর্শনী',
    category: 'EVENTS',
    date: '২০২৪'
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop&q=80',
    title: 'অভিভাবক সমাবেশ ও কৃতি সংবর্ধনা অনুষ্ঠান',
    category: 'EVENTS',
    date: '২০২৪'
  }
];

export const DEFAULT_STUDENTS: Student[] = [
  {
    id: '124611',
    name: 'মোঃ হাসান আলি',
    class: '১০ম',
    roll: '১০১',
    section: 'ক (বিজ্ঞান)',
    guardianPhone: '০১৭১২-৯৮৭৬৫৪',
    bloodGroup: 'B+',
    studentPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&crop=faces&q=80',
    academicResults: [
      {
        id: 'term-1',
        termTitle: 'অর্ধবার্ষিক পরীক্ষা ২০২৪',
        date: '২০২৪-০৭-১৫',
        totalGPA: 4.88,
        finalGrade: 'A+',
        isPassed: true,
        subjects: [
          { subject: 'বাংলা ১ম ও ২য়', mark: 86, grade: 'A+', point: 5.0 },
          { subject: 'ইংরেজি ১ম ও ২য়', mark: 79, grade: 'A', point: 4.0 },
          { subject: 'গণিত', mark: 94, grade: 'A+', point: 5.0 },
          { subject: 'ইসলাম ও নৈতিক শিক্ষা', mark: 98, grade: 'A+', point: 5.0 },
          { subject: 'পদার্থবিজ্ঞান', mark: 88, grade: 'A+', point: 5.0 },
          { subject: 'রসায়ন', mark: 84, grade: 'A+', point: 5.0 },
          { subject: 'তথ্য ও যোগাযোগ প্রযুক্তি', mark: 48, grade: 'A+', point: 5.0 }
        ]
      }
    ]
  },
  {
    id: '124612',
    name: 'মোসাঃ ফাতেমা খাতুন',
    class: '৯ম',
    roll: '১০২',
    section: 'খ',
    guardianPhone: '০১৮১৮-৪৫৬৭৮৯',
    bloodGroup: 'A+',
    studentPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=faces&q=80',
    academicResults: [
      {
        id: 'term-1',
        termTitle: 'অর্ধবার্ষিক পরীক্ষা ২০২৪',
        date: '২০২৪-০৭-১৫',
        totalGPA: 5.00,
        finalGrade: 'A+',
        isPassed: true,
        subjects: [
          { subject: 'বাংলা ১ম ও ২য়', mark: 90, grade: 'A+', point: 5.0 },
          { subject: 'ইংরেজি ১ম ও ২য়', mark: 85, grade: 'A+', point: 5.0 },
          { subject: 'গণিত', mark: 96, grade: 'A+', point: 5.0 },
          { subject: 'ইসলাম ও নৈতিক শিক্ষা', mark: 99, grade: 'A+', point: 5.0 },
          { subject: 'সাধারণ বিজ্ঞান', mark: 92, grade: 'A+', point: 5.0 }
        ]
      }
    ]
  }
];

export const DEFAULT_QUIZZES: Quiz[] = [
  {
    id: '1',
    title: 'সাধারণ জ্ঞান ও ইসলামিক স্টাডিজ কুইজ',
    subject: 'ইসলাম ও সাধারণ জ্ঞান',
    targetClass: 'সকল শ্রেণি',
    durationMinutes: 10,
    createdDate: '২০২৪-১০-১৫',
    questions: [
      {
        question: 'পবিত্র কুরআনের সর্ববৃহৎ সূরার নাম কী?',
        options: ['সূরা ফাতিহা', 'সূরা বাক্বারা', 'সূরা ইয়াসীন', 'সূরা ইখলাস'],
        correctIndex: 1
      },
      {
        question: 'শিবগঞ্জ উপজেলা কোন জেলায় অবস্থিত?',
        options: ['রাজশাহী', 'চাঁপাইনবাবগঞ্জ', 'নওগাঁ', 'নাটোর'],
        correctIndex: 1
      },
      {
        question: 'ইসলামের প্রথম খলিফার নাম কী?',
        options: ['হযরত আবু বকর (রা.)', 'হযরত উমর (রা.)', 'হযরত উসমান (রা.)', 'হযরত আলী (রা.)'],
        correctIndex: 0
      },
      {
        question: 'কম্পিউটারের জনক কে?',
        options: ['চার্লস ব্যাবেজ', 'বিল গেটস', 'অ্যালান টুরিং', 'স্টিভ জবস'],
        correctIndex: 0
      }
    ]
  }
];
