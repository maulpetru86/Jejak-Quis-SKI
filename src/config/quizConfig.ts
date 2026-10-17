export type QuestionType = 'multiple_choice' | 'true_false';
export type AnswerLetter = 'A' | 'B' | 'C' | 'D' | 'E';
export type GameMode = 'group' | 'solo';
export type GradeLevel = 'X' | 'XI' | 'XII';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
    E?: string;
  };
  correctAnswer: AnswerLetter;
  explanation: string;
  pageReference: string;
  imageUrl?: string;
  imageCaption?: string;
}

export interface SoloAnswerRecord {
  questionId: string;
  questionText: string;
  selectedAnswer: AnswerLetter | '-';
  correctAnswer: AnswerLetter;
  isCorrect: boolean;
  options: { A: string; B: string; C: string; D: string; E?: string };
  explanation: string;
  pageReference: string;
  timeSpentMs: number;
}

export interface SoloGameState {
  studentName: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  totalTimeMs: number;
  answers: SoloAnswerRecord[];
}

export interface QuestionPackage {
  id: string;
  gradeLevel: GradeLevel;
  name: string;
  subtitle: string;
  updatedAt: string;
  questions: QuizQuestion[];
}

export interface TeamKeyBindings {
  A: string;
  B: string;
  C: string;
  D: string;
  E: string;
}

export interface TeamConfig {
  id: string;
  name: string;
  color: string;
  emoji: string;
  keys: TeamKeyBindings;
}

export interface TeamGameState extends TeamConfig {
  score: number;
  previousScore: number;
  selectedAnswer: AnswerLetter | null;
  answerTimeMs: number | null;
  doublePointsUsed: boolean;
  doublePointsActiveThisRound: boolean;
  lastPointsDelta: number;
  lastSpeedBonus: number;
  correctCount: number;
  wrongCount: number;
}

export interface QuizSettings {
  gameMode: GameMode;
  studentName: string;
  teamCount: number;
  timerSeconds: number;
  timerEnabled: boolean;
  baseCorrectPoints: number;
  speedBonusEnabled: boolean;
  maxSpeedBonusPoints: number;
  wrongPenaltyEnabled: boolean;
  wrongPenaltyPoints: number;
  doublePointsPowerUpEnabled: boolean;
  shuffleQuestionsOnStart: boolean;
  shuffleOptionsOnStart: boolean;
  soundEnabled: boolean;
}

export const STORAGE_KEYS = {
  PACKAGES: 'ski_quiz_packages_v9',
  SELECTED_PACKAGE_ID: 'ski_quiz_selected_package_v9',
  TEAMS: 'ski_quiz_teams_v5',
  SETTINGS: 'ski_quiz_settings_v6',
  TEACHER_PIN: 'ski_quiz_teacher_pin_v1',
} as const;

export const DEFAULT_TEACHER_PIN = '1234';

export const THEME_COLORS = {
  nightBlue: '#0F1B3D',
  deepBlueSurface: '#162654',
  ottomanRed: '#C8102E',
  goldAccent: '#F2B705',
  creamWhite: '#FFFDF7',
} as const;

export const OPTION_STYLES: Record<
  AnswerLetter,
  {
    label: AnswerLetter;
    name: string;
    bg: string;
    hoverBg: string;
    border: string;
    badgeBg: string;
    hex: string;
  }
> = {
  A: {
    label: 'A',
    name: 'Biru Samudra',
    bg: 'bg-[#1E3A8A]',
    hoverBg: 'hover:bg-[#1D4ED8]',
    border: 'border-[#3B82F6]',
    badgeBg: 'bg-[#2563EB]',
    hex: '#3B82F6',
  },
  B: {
    label: 'B',
    name: 'Merah Usmani',
    bg: 'bg-[#881337]',
    hoverBg: 'hover:bg-[#9F1239]',
    border: 'border-[#F43F5E]',
    badgeBg: 'bg-[#E11D48]',
    hex: '#F43F5E',
  },
  C: {
    label: 'C',
    name: 'Kuning Keemasan',
    bg: 'bg-[#78350F]',
    hoverBg: 'hover:bg-[#92400E]',
    border: 'border-[#F59E0B]',
    badgeBg: 'bg-[#D97706]',
    hex: '#F59E0B',
  },
  D: {
    label: 'D',
    name: 'Hijau Zamrud',
    bg: 'bg-[#064E3B]',
    hoverBg: 'hover:bg-[#065F46]',
    border: 'border-[#10B981]',
    badgeBg: 'bg-[#059669]',
    hex: '#10B981',
  },
  E: {
    label: 'E',
    name: 'Ungu Kesultanan',
    bg: 'bg-[#4C1D95]',
    hoverBg: 'hover:bg-[#5B21B6]',
    border: 'border-[#8B5CF6]',
    badgeBg: 'bg-[#7C3AED]',
    hex: '#8B5CF6',
  },
};

export const TEAM_COLOR_PALETTE = [
  { name: 'Merah Usmani', hex: '#C8102E' },
  { name: 'Emas Kesultanan', hex: '#D99B00' },
  { name: 'Hijau Kubah', hex: '#059669' },
  { name: 'Biru Bosphorus', hex: '#2563EB' },
  { name: 'Ungu Iznik', hex: '#7C3AED' },
  { name: 'Jingga Sogut', hex: '#EA580C' },
  { name: 'Pirus Anatolia', hex: '#0891B2' },
  { name: 'Merah Delima', hex: '#DB2777' },
];

export const TEAM_EMOJI_OPTIONS = [
  '⚔️',
  '👑',
  '🕌',
  '🛡️',
  '🌙',
  '🦅',
  '📜',
  '🏹',
  '🐎',
  '🌟',
  '🔥',
  '💎',
];

export const DEFAULT_TEAMS: TeamConfig[] = [
  {
    id: 'team-1',
    name: 'Tim Al-Fatih',
    color: '#C8102E',
    emoji: '⚔️',
    keys: { A: 'Q', B: 'W', C: 'E', D: 'R', E: 'T' },
  },
  {
    id: 'team-2',
    name: 'Tim Al-Qanuni',
    color: '#D99B00',
    emoji: '👑',
    keys: { A: 'Y', B: 'U', C: 'I', D: 'O', E: 'P' },
  },
  {
    id: 'team-3',
    name: 'Tim Orkhan',
    color: '#059669',
    emoji: '🕌',
    keys: { A: 'A', B: 'S', C: 'D', D: 'F', E: 'G' },
  },
  {
    id: 'team-4',
    name: 'Tim Usman',
    color: '#2563EB',
    emoji: '🛡️',
    keys: { A: 'H', B: 'J', C: 'K', D: 'L', E: 'N' },
  },
  {
    id: 'team-5',
    name: 'Tim Bayazid',
    color: '#7C3AED',
    emoji: '🌙',
    keys: { A: 'Z', B: 'X', C: 'C', D: 'V', E: 'B' },
  },
  {
    id: 'team-6',
    name: 'Tim Murad',
    color: '#EA580C',
    emoji: '🦅',
    keys: { A: '6', B: '7', C: '8', D: '9', E: '0' },
  },
];

export const DEFAULT_SETTINGS: QuizSettings = {
  gameMode: 'group',
  studentName: 'Siswa SKI',
  teamCount: 4,
  timerSeconds: 25,
  timerEnabled: true,
  baseCorrectPoints: 100,
  speedBonusEnabled: true,
  maxSpeedBonusPoints: 50,
  wrongPenaltyEnabled: false,
  wrongPenaltyPoints: 25,
  doublePointsPowerUpEnabled: true,
  shuffleQuestionsOnStart: true,
  shuffleOptionsOnStart: true,
  soundEnabled: true,
};

// ==========================================
// KELAS X: PAKET 1 — DAULAH UMAYYAH DI DAMASKUS (10 SOAL)
// Materi SKI Kelas X MA — Bab IV
// ==========================================
export const INITIAL_DAULAH_UMAYYAH_QUESTIONS: QuizQuestion[] = [
  {
    id: 'umayyah-1',
    type: 'multiple_choice',
    question: 'Pendiri Daulah Umayyah di Damaskus pada tahun 661 M (41 H) setelah peristiwa Amul Jama\'ah adalah...',
    options: {
      A: 'Marwan bin Hakam',
      B: 'Yazid bin Muawiyah',
      C: 'Muawiyah bin Abu Sufyan',
      D: 'Abdul Malik bin Marwan',
      E: 'Umar bin Abdul Aziz',
    },
    correctAnswer: 'C',
    explanation:
      'Muawiyah bin Abu Sufyan mendirikan Daulah Umayyah setelah Hasan bin Ali menyerahkan kekhalifahan demi persatuan umat Islam dalam peristiwa Amul Jama\'ah (Tahun Persatuan) pada 41 H / 661 M.',
    pageReference: 'Hlm. 42 (Kelas X)',
  },
  {
    id: 'umayyah-2',
    type: 'multiple_choice',
    question: 'Daulah Umayyah berpusat di kota Damaskus dan mengubah sistem suksesi kepemimpinan Islam dari musyawarah syura menjadi...',
    options: {
      A: 'Demokrasi Parlementer',
      B: 'Demokrasi Parlementer',
      C: 'Teokrasi Tertutup',
      D: 'Aristokrasi Militer',
      E: 'Republik Terpimpin',
    },
    correctAnswer: 'B',
    explanation:
      'Muawiyah bin Abu Sufyan mengangkat putranya Yazid sebagai putra mahkota, meresmikan sistem monarki dinasti turun-temurun pertama dalam sejarah pemerintahan Islam.',
    pageReference: 'Hlm. 44 (Kelas X)',
  },
  {
    id: 'umayyah-3',
    type: 'multiple_choice',
    question: 'Lembaga pos dan pengiriman surat resmi negara pada masa Daulah Umayyah yang menghubungkan Damaskus dengan provinsi luar disebut...',
    options: {
      A: 'Diwanul Rasail',
      B: 'Diwanul Kharaj',
      C: 'Diwanul Jund',
      D: 'Diwanul Barid',
      E: 'Diwanul Khatam',
    },
    correctAnswer: 'D',
    explanation:
      'Diwanul Barid adalah departemen pos kilat yang menggunakan kuda-kuda pos cepat untuk menyampaikan instruksi khalifah dan laporan para gubernur.',
    pageReference: 'Hlm. 48 (Kelas X)',
  },
  {
    id: 'umayyah-4',
    type: 'multiple_choice',
    question: 'Khalifah Daulah Umayyah yang memelopori arabisasi administrasi pemerintahan dan mencetak mata uang dinar Islam independen pertama adalah...',
    options: {
      A: 'Abdul Malik bin Marwan',
      B: 'Muawiyah bin Abu Sufyan',
      C: 'Walid bin Abdul Malik',
      D: 'Sulaiman bin Abdul Malik',
      E: 'Hisyam bin Abdul Malik',
    },
    correctAnswer: 'A',
    explanation:
      'Khalifah Abdul Malik bin Marwan (685–705 M) menetapkan bahasa Arab sebagai bahasa resmi pembukuan negara dan mencetak mata uang dinar emas dan dirham perak bertuliskan kalimat tauhid.',
    pageReference: 'Hlm. 52 (Kelas X)',
  },
  {
    id: 'umayyah-5',
    type: 'multiple_choice',
    question: 'Monumen arsitektur Islam tertua yang dibangun oleh Khalifah Abdul Malik bin Marwan di Yerusalem dengan kubah emas megah adalah...',
    options: {
      A: 'Masjid Kordoba',
      B: 'Masjid Nabawi',
      C: 'Masjid Al-Azhar',
      D: 'Masjid Quba',
      E: 'Qubbah As-Sakhrah (Dome of the Rock)',
    },
    correctAnswer: 'E',
    explanation:
      'Qubbah As-Sakhrah (Kubah Batu) di Kompleks Masjidil Aqsha Yerusalem selesai dibangun pada tahun 691 M sebagai mahakarya seni bina Islam awal.',
    pageReference: 'Hlm. 53 (Kelas X)',
  },
  {
    id: 'umayyah-6',
    type: 'multiple_choice',
    question: 'Panglima militer muslim perkasa Daulah Umayyah yang memimpin penaklukan Semenanjung Andalusia (Spanyol) pada tahun 711 M adalah...',
    options: {
      A: 'Khalid bin Walid',
      B: 'Khalid bin Walid',
      C: 'Amr bin Ash',
      D: 'Sa\'ad bin Abi Waqqas',
      E: 'Uqbah bin Nafi',
    },
    correctAnswer: 'B',
    explanation:
      'Thariq bin Ziyad bersama pasukannya menyeberangi selat sempit yang kemudian diabadikan namanya menjadi Jabal Thariq (Gibraltar) dan mengalahkan Raja Roderick dari Visigoth.',
    pageReference: 'Hlm. 56 (Kelas X)',
  },
  {
    id: 'umayyah-7',
    type: 'multiple_choice',
    question: 'Khalifah Daulah Umayyah yang terkenal adil, hidup sangat zuhud, dan kerap dijuluki Khulafaur Rasyidin kelima adalah...',
    options: {
      A: 'Marwan bin Muhammad',
      B: 'Yazid bin Abdul Malik',
      C: 'Walid bin Abdul Malik',
      D: 'Umar bin Abdul Aziz',
      E: 'Muawiyah II',
    },
    correctAnswer: 'D',
    explanation:
      'Khalifah Umar bin Abdul Aziz (memerintah 717–720 M) mereformasi pajak, menghapus diskriminasi terhadap kaum Mawali, dan menghidupkan kembali keteladanan kakek buyutnya, Umar bin Khattab.',
    pageReference: 'Hlm. 59 (Kelas X)',
  },
  {
    id: 'umayyah-8',
    type: 'true_false',
    question:
      'Kota Kordoba di Semenanjung Iberia (Andalusia) didirikan sebagai kelanjutan Daulah Umayyah Barat oleh Abdurrahman Ad-Dakhil yang selamat dari kejaran Dinasti Abbasiyah.',
    options: {
      A: 'Benar',
      B: 'Salah',
      C: '-',
      D: '-',
      E: '-',
    },
    correctAnswer: 'A',
    explanation:
      'Abdurrahman I (Ad-Dakhil / Sang Rajawali Quraisy) melarikan diri ke Spanyol pada 756 M dan mendirikan Keamiran Umayyah Kordoba yang bertahan ratusan tahun.',
    pageReference: 'Hlm. 64 (Kelas X)',
  },
  {
    id: 'umayyah-9',
    type: 'multiple_choice',
    question: 'Golongan non-Arab yang baru memeluk Islam pada era Daulah Umayyah namun pada masa awal diperlakukan berbeda dengan bangsa Arab disebut...',
    options: {
      A: 'Kaum Anshar',
      B: 'Kaum Muhajirin',
      C: 'Kaum Mawali',
      D: 'Kaum Zimmi',
      E: 'Kaum Badui',
    },
    correctAnswer: 'C',
    explanation:
      'Mawali adalah sebutan orang non-Arab (Persia, Koptik, Barbar) yang memeluk Islam. Kekecewaan kaum Mawali terhadap perlakuan dinasti awal menjadi faktor pendorong revolusi Abbasiyah.',
    pageReference: 'Hlm. 67 (Kelas X)',
  },
  {
    id: 'umayyah-10',
    type: 'multiple_choice',
    question: 'Daulah Umayyah di Damaskus mengalami keruntuhan pada tahun 750 M setelah kekalahan khalifah terakhir Marwan II dalam Pertempuran...',
    options: {
      A: 'Jamal',
      B: 'Yarmuk',
      C: 'Qadisiyah',
      D: 'Shiffin',
      E: 'Sungai Zab',
    },
    correctAnswer: 'E',
    explanation:
      'Pasukan koalisi Bani Hasyim (Abbasiyah) pimpinan Abdullah bin Ali mengalahkan pasukan Marwan bin Muhammad dalam Pertempuran Sungai Zab pada 750 M (132 H).',
    pageReference: 'Hlm. 70 (Kelas X)',
  },
];

// ==========================================
// KELAS X: PAKET 2 — DAULAH ABBASIYAH DI BAGHDAD (10 SOAL)
// Materi SKI Kelas X MA — Bab V
// ==========================================
export const INITIAL_DAULAH_ABBASIYAH_QUESTIONS: QuizQuestion[] = [
  {
    id: 'abbasiyah-1',
    type: 'multiple_choice',
    question: 'Daulah Abbasiyah didirikan pada tahun 750 M (132 H) dan menisbatkan nasabnya kepada paman Nabi Muhammad SAW yaitu...',
    options: {
      A: 'Al-Abbas bin Abdul Muthalib',
      B: 'Hamzah bin Abdul Muthalib',
      C: 'Abu Thalib',
      D: 'Abu Lahab',
      E: 'Harits bin Abdul Muthalib',
    },
    correctAnswer: 'A',
    explanation:
      'Bani Abbasiyah mengambil garis keturunan dari Al-Abbas bin Abdul Muthalib, paman Rasulullah SAW, melalui putranya Abdullah bin Abbas.',
    pageReference: 'Hlm. 82 (Kelas X)',
  },
  {
    id: 'abbasiyah-2',
    type: 'multiple_choice',
    question: 'Khalifah kedua Daulah Abbasiyah yang membangun kota bundar Baghdad sebagai ibu kota baru peradaban dunia Islam pada tahun 762 M adalah...',
    options: {
      A: 'Harun Ar-Rasyid',
      B: 'Abul Abbas As-Saffah',
      C: "Abu Ja'far Al-Mansur",
      D: 'Al-Makmun',
      E: 'Al-Mahdi',
    },
    correctAnswer: 'C',
    explanation:
      'Khalifah Abu Ja\'far Al-Mansur merancang kota bundar Baghdad (Madinat as-Salam / Kota Kedamaian) di tepi Sungai Tigris sebagai pusat geopolitik dan perdagangan dunia.',
    pageReference: 'Hlm. 85 (Kelas X)',
  },
  {
    id: 'abbasiyah-3',
    type: 'multiple_choice',
    question: 'Lembaga perpustakaan agung, akademi riset, dan pusat penerjemahan sains terbesar di Baghdad pada masa keemasan Abbasiyah bernama...',
    options: {
      A: 'Darul Nadwah',
      B: 'Darul Nadwah',
      C: 'Al-Azhar',
      D: 'Nizhamiyah',
      E: 'Darul Hadits',
    },
    correctAnswer: 'B',
    explanation:
      'Bayt al-Hikmah didirikan pada masa Harun Ar-Rasyid dan mencapai puncak di era Al-Makmun, menjadi tempat berkumpulnya para cendekiawan dunia untuk meneliti dan menerjemahkan sains.',
    pageReference: 'Hlm. 90 (Kelas X)',
  },
  {
    id: 'abbasiyah-4',
    type: 'multiple_choice',
    question: 'Daulah Abbasiyah mencapai puncak kejayaan peradaban, kemakmuran ekonomi, dan kemajuan ilmu pengetahuan pada masa khalifah...',
    options: {
      A: "Al-Mu'tashim",
      B: 'As-Saffah',
      C: "Al-Musta'shim",
      D: 'Harun Ar-Rasyid',
      E: 'Al-Watsiq',
    },
    correctAnswer: 'D',
    explanation:
      'Harun Ar-Rasyid (786–809 M) memimpin era The Golden Age of Islam yang masyhur dengan kestabilan negeri, kemajuan rumah sakit Bimaristan, perpustakaan, dan kisah peradaban termasyhur.',
    pageReference: 'Hlm. 94 (Kelas X)',
  },
  {
    id: 'abbasiyah-5',
    type: 'multiple_choice',
    question: 'Ilmuwan matematika muslim termasyhur era Abbasiyah yang menemukan angka nol, sistem desimal, dan menciptakan ilmu Aljabar adalah...',
    options: {
      A: 'Muhammad bin Musa Al-Khawarizmi',
      B: 'Al-Biruni',
      C: 'Umar Khayyam',
      D: 'Al-Battani',
      E: 'Tsabit bin Qurrah',
    },
    correctAnswer: 'A',
    explanation:
      'Al-Khawarizmi menulis kitab monumental Al-Jabr wa\'l-Muqabala yang menjadi akar kata Aljabar dan algoritma (algorism) di seluruh dunia.',
    pageReference: 'Hlm. 102 (Kelas X)',
  },
  {
    id: 'abbasiyah-6',
    type: 'multiple_choice',
    question: 'Dokter dan filsuf muslim terbesar era Abbasiyah yang digelari "Bapak Kedokteran Modern" dan menulis ensiklopedia kedokteran Al-Qanun fi at-Tibb adalah...',
    options: {
      A: 'Al-Farabi',
      B: 'Ar-Razi (Rhazes)',
      C: 'Ibnu Rusyd (Averroes)',
      D: 'Ibnu Thufail',
      E: 'Ibnu Sina (Avicenna)',
    },
    correctAnswer: 'E',
    explanation:
      'Kitab Al-Qanun fi at-Tibb karya Ibnu Sina menjadi rujukan wajib di fakultas-fakultas kedokteran Eropa dan dunia Islam selama lebih dari 500 tahun.',
    pageReference: 'Hlm. 106 (Kelas X)',
  },
  {
    id: 'abbasiyah-7',
    type: 'multiple_choice',
    question: 'Tokoh penerjemah agung beragama Kristen yang diangkat Khalifah Al-Makmun memimpin proyek penerjemahan risalah kedokteran Galen dan filsafat Yunani di Bayt al-Hikmah adalah...',
    options: {
      A: 'Yahya bin Khalid Al-Barmaki',
      B: 'Yahya bin Khalid Al-Barmaki',
      C: 'Ishaq bin Hunain',
      D: 'Qusta bin Luqa',
      E: 'Sinan bin Tsabit',
    },
    correctAnswer: 'B',
    explanation:
      'Hunain bin Ishaq menguasai bahasa Arab, Suryani, Yunani, dan Persia, serta diganjar emas seberat buku yang berhasil ia terjemahkan oleh khalifah Al-Makmun.',
    pageReference: 'Hlm. 108 (Kelas X)',
  },
  {
    id: 'abbasiyah-8',
    type: 'multiple_choice',
    question: 'Perguruan tinggi Islam pertama yang terorganisasi secara formal lengkap dengan beasiswa dan asrama yang didirikan Perdana Menteri Nizamul Mulk di Baghdad adalah...',
    options: {
      A: 'Mustansiriyah',
      B: 'Universitas Al-Qarawiyyin',
      C: 'Al-Azhar Kairo',
      D: 'Madrasah Nizhamiyah',
      E: 'Darul Hikmah',
    },
    correctAnswer: 'D',
    explanation:
      'Madrasah Nizhamiyah didirikan pada 1065 M di Baghdad, tempat Imam Al-Ghazali pernah mengajar sebagai guru besar fikih dan ushul.',
    pageReference: 'Hlm. 112 (Kelas X)',
  },
  {
    id: 'abbasiyah-9',
    type: 'true_false',
    question:
      'Mazhab fikih empat yang menjadi rujukan mayoritas umat Islam (Hanafi, Maliki, Syafii, dan Hanbali) berkembang pesat dan dibukukan pada masa kekhalifahan Daulah Abbasiyah.',
    options: {
      A: 'Benar',
      B: 'Salah',
      C: '-',
      D: '-',
      E: '-',
    },
    correctAnswer: 'A',
    explanation:
      'Para imam mujtahid agung mazhab arba\'ah (Abu Hanifah, Malik bin Anas, Muhammad bin Idris Asy-Syafii, dan Ahmad bin Hanbal) hidup dan menyusun metodologi ijtihad pada era kekhalifahan Abbasiyah.',
    pageReference: 'Hlm. 115 (Kelas X)',
  },
  {
    id: 'abbasiyah-10',
    type: 'multiple_choice',
    question: 'Ibu kota Baghdad luluh lantak dan kekhalifahan Abbasiyah di Baghdad resmi berakhir pada tahun 1258 M akibat serbuan bangsa Mongol di bawah pimpinan...',
    options: {
      A: 'Timur Lenk',
      B: 'Jenghis Khan',
      C: 'Hulagu Khan',
      D: 'Kubilai Khan',
      E: 'Batu Khan',
    },
    correctAnswer: 'C',
    explanation:
      'Hulagu Khan mengepung Baghdad pada Februari 1258 M, membantai khalifah Al-Musta\'shim, dan memusnahkan perpustakaan Bayt al-Hikmah ke Sungai Tigris.',
    pageReference: 'Hlm. 122 (Kelas X)',
  },
];

// ==========================================
// KELAS XI: PAKET 1 — DAULAH USMANI (10 SOAL)
// Materi SKI Kelas XI MA — Bab I
// ==========================================
export const INITIAL_DAULAH_USMANI_QUESTIONS: QuizQuestion[] = [
  {
    id: 'usmani-1',
    type: 'multiple_choice',
    question: 'Daulah Usmani bermula dari kabilah bangsa Turki yang dikenal dengan suku...',
    options: {
      A: 'Oghuz Seljuk',
      B: 'Quraisy',
      C: 'Tamim',
      D: 'Tatar',
      E: 'Kayi',
    },
    correctAnswer: 'E',
    explanation:
      'Daulah Usmani berawal dari suku Kayi di Turki Barat yang dipimpin oleh Sulaiman Syah dan kemudian dilanjutkan oleh putranya, Ertoghrul.',
    pageReference: 'Hlm. 3',
  },
  {
    id: 'usmani-2',
    type: 'multiple_choice',
    question: 'Usman bin Ertoghrul memproklamasikan berdirinya Daulah Usmani pada tahun...',
    options: {
      A: '1299 M',
      B: '1288 M',
      C: '1258 M',
      D: '1453 M',
      E: '1517 M',
    },
    correctAnswer: 'A',
    explanation:
      'Setelah berhasil membendung serangan Ghazan Khan dari Mongol pada tahun 1299 M, Usman memproklamirkan kemerdekaan wilayahnya sebagai Padishah Al-Usmaniah.',
    pageReference: 'Hlm. 4',
  },
  {
    id: 'usmani-3',
    type: 'multiple_choice',
    question: 'Pusat pemerintahan dan ibu kota pertama Daulah Usmani berada di kota...',
    options: {
      A: 'Konstantinopel',
      B: 'Bursa',
      C: 'Bursa',
      D: 'Adrianopel',
      E: 'Ankara',
    },
    correctAnswer: 'C',
    explanation:
      'Kota Sogut adalah pusat pemerintahan pertama sejak 1299 M, sebelum berpindah ke Bursa (1326 M), Adrianopel/Edirne (1366 M), dan Istanbul (1453 M).',
    pageReference: 'Hlm. 4',
  },
  {
    id: 'usmani-4',
    type: 'multiple_choice',
    question: 'Pasukan infanteri elite Daulah Usmani yang dibentuk pada masa Sultan Orkhan disebut...',
    options: {
      A: 'Sipahi',
      B: 'Yeniseri (Inkisyariyah)',
      C: 'Mamluk',
      D: 'Qizilbash',
      E: 'Akinji',
    },
    correctAnswer: 'B',
    explanation:
      'Yeniseri (Inkisyariyah) adalah tentara khusus infanteri yang sangat disiplin, tangguh, dan setia langsung kepada sultan.',
    pageReference: 'Hlm. 6',
  },
  {
    id: 'usmani-5',
    type: 'multiple_choice',
    question: 'Sultan Bayazid I dijuluki "Yaldrum" (Kilat) dan mengalami kekalahan dalam pertempuran melawan Timur Lenk di...',
    options: {
      A: 'Kosovo',
      B: 'Varna',
      C: 'Gallipoli',
      D: 'Ankara',
      E: 'Nikopolis',
    },
    correctAnswer: 'D',
    explanation:
      'Dalam Pertempuran Ankara (1402 M), pasukan Bayazid I dikalahkan oleh tentara Timur Lenk hingga sang sultan ditawan.',
    pageReference: 'Hlm. 9',
  },
  {
    id: 'usmani-6',
    type: 'multiple_choice',
    question: 'Sultan Muhammad I dijuluki "The Second Founder" (Pendiri Kedua) Daulah Usmani karena...',
    options: {
      A: 'Berhasil menaklukkan benteng Konstantinopel',
      B: 'Berhasil menaklukkan benteng Konstantinopel',
      C: 'Memindahkan ibu kota kerajaan ke Benua Eropa',
      D: 'Menaklukkan wilayah Hijaz dan Mesir',
      E: 'Membangun armada angkatan laut pertama Usmani',
    },
    correctAnswer: 'A',
    explanation:
      'Sultan Muhammad I berhasil mengakhiri masa kekacauan (Interregnum) selama 10 tahun dan mempersatukan kembali Daulah Usmani.',
    pageReference: 'Hlm. 11',
  },
  {
    id: 'usmani-7',
    type: 'multiple_choice',
    question: 'Sultan Muhammad Al-Fatih berhasil menaklukkan benteng Konstantinopel pada tanggal...',
    options: {
      A: '10 Muharram 1517',
      B: '15 Juni 1299',
      C: '1 Januari 1520',
      D: '25 Desember 1492',
      E: '29 Mei 1453',
    },
    correctAnswer: 'E',
    explanation:
      'Setelah pengepungan sekitar 54 hari, Sultan Muhammad II (Al-Fatih) berhasil menaklukkan Konstantinopel pada hari Selasa, 29 Mei 1453 M di usia 21 tahun.',
    pageReference: 'Hlm. 15',
  },
  {
    id: 'usmani-8',
    type: 'true_false',
    question:
      'Setelah menaklukkan Konstantinopel, Muhammad Al-Fatih memberikan maklumat jaminan keamanan jiwa, harta, dan kebebasan beragama bagi penduduk Kristen.',
    options: {
      A: 'Benar',
      B: 'Salah',
      C: '-',
      D: '-',
    },
    correctAnswer: 'A',
    explanation:
      'Sultan Muhammad Al-Fatih menegakkan prinsip Piagam Madinah dengan menjamin perlindungan tempat ibadah dan hak kebebasan beragama warga Kristen Bizantium.',
    pageReference: 'Hlm. 15',
  },
  {
    id: 'usmani-9',
    type: 'multiple_choice',
    question: 'Puncak keemasan peradaban Daulah Usmani terjadi pada masa Sultan Sulaiman I yang bergelar...',
    options: {
      A: 'Al-Fatih',
      B: 'Al-Qanuni',
      C: 'Al-Ghazali',
      D: 'Al-Mansur',
      E: 'Al-Akbar',
    },
    correctAnswer: 'B',
    explanation:
      'Sultan Sulaiman I (1520–1566 M) bergelar Al-Qanuni (The Magnificent) karena kodifikasi undang-undang negara yang tertata rapi dan pembangunan peradaban megah.',
    pageReference: 'Hlm. 18',
  },
  {
    id: 'usmani-10',
    type: 'multiple_choice',
    question: 'Sistem kekhalifahan Daulah Usmani resmi dihapuskan oleh Majelis Nasional Agung Turki pada tanggal 3 Maret 1924 di bawah pimpinan...',
    options: {
      A: 'Midhat Pasya',
      B: 'Ismet Inonu',
      C: 'Enver Pasya',
      D: 'Mustafa Kemal Ataturk',
      E: 'Fevzi Cakmak',
    },
    correctAnswer: 'D',
    explanation:
      'Mustafa Kemal Ataturk memimpin penghapusan khilafah pada 3 Maret 1924 dan mentransformasikan Turki menjadi negara republik berorientasi sekuler.',
    pageReference: 'Hlm. 22',
  },
];

// ==========================================
// PAKET 2: DAULAH SAFAWI (10 SOAL LENGKAP)
// Materi SKI Kelas XI MA — Bab II (jejak-ski.web.app)
// ==========================================
export const INITIAL_DAULAH_SAFAWI_QUESTIONS: QuizQuestion[] = [
  {
    id: 'safawi-1',
    type: 'multiple_choice',
    question: 'Cikal bakal Daulah Safawi di Persia berawal dari sebuah gerakan tarekat sufi yang bernama...',
    options: {
      A: 'Tarekat Qadiriyah',
      B: 'Tarekat Naqsyabandiyah',
      C: 'Tarekat Safawiyah',
      D: 'Tarekat Maulawiyah',
      E: 'Tarekat Suhrawardiyah',
    },
    correctAnswer: 'C',
    explanation:
      'Daulah Safawi bermula dari gerakan Tarekat Safawiyah yang didirikan oleh Syekh Safiuddin Ishaq Al-Ardabili di kota Ardabil, Azerbaijan.',
    pageReference: 'Hlm. 29',
  },
  {
    id: 'safawi-2',
    type: 'multiple_choice',
    question: 'Pemimpin yang secara resmi memproklamasikan berdirinya Daulah Safawi di Tabriz pada tahun 1501 M adalah...',
    options: {
      A: 'Syah Safiuddin',
      B: 'Syah Abbas I',
      C: 'Syah Tahmasp I',
      D: 'Syaikh Haidar',
      E: 'Syah Ismail I',
    },
    correctAnswer: 'E',
    explanation:
      'Ismail I memproklamasikan dirinya sebagai Syah pertama Daulah Safawi di Tabriz pada 1501 M dan menetapkan Syiah Itsna Asyariyah sebagai mazhab resmi negara.',
    pageReference: 'Hlm. 31',
  },
  {
    id: 'safawi-3',
    type: 'multiple_choice',
    question: 'Pasukan militer militan pengikut setia Daulah Safawi yang mengenakan sorban baret merah bertanduk dua belas disebut...',
    options: {
      A: 'Yeniseri',
      B: 'Yeniseri',
      C: 'Sipahi',
      D: 'Ghulam',
      E: 'Pasukan Cossack',
    },
    correctAnswer: 'A',
    explanation:
      'Qizilbash (bahasa Turki: Kepala Merah) adalah tentara tempur Safawi yang memakai penutup kepala merah dengan 12 lipatan melambangkan 12 imam Syiah.',
    pageReference: 'Hlm. 31',
  },
  {
    id: 'safawi-4',
    type: 'multiple_choice',
    question: 'Pertempuran militer dahsyat pada tahun 1514 M antara Daulah Safawi pimpinan Ismail I dan Daulah Usmani pimpinan Sultan Salim I terjadi di lembah...',
    options: {
      A: 'Yarmuk',
      B: 'Marj Dabiq',
      C: 'Chaldiran',
      D: 'Qadisiyah',
      E: 'Mohacs',
    },
    correctAnswer: 'C',
    explanation:
      'Pertempuran Chaldiran (1514 M) berakhir dengan kemenangan Daulah Usmani berkat keunggulan artileri mesiu dan meriam atas kavaleri Safawi.',
    pageReference: 'Hlm. 32',
  },
  {
    id: 'safawi-5',
    type: 'multiple_choice',
    question: 'Daulah Safawi berhasil mencapai puncak kejayaan politik, militer, dan kebudayaan pada masa pemerintahan...',
    options: {
      A: 'Syah Ismail I',
      B: 'Syah Tahmasp I',
      C: 'Syah Tahmasp I',
      D: 'Syah Safi',
      E: 'Syah Sulaiman',
    },
    correctAnswer: 'B',
    explanation:
      'Syah Abbas I (1588–1629 M) mengatasi ancaman Usmani dan Uzbek, merebut kembali Tabriz dan Baghdad, serta memodernisasi tata negara Safawi.',
    pageReference: 'Hlm. 34',
  },
  {
    id: 'safawi-6',
    type: 'true_false',
    question:
      'Kota Isfahan pada masa kejayaan Syah Abbas I dijuluki "Isfahan Nesf-e Jahan" yang bermakna Isfahan adalah separuh dunia.',
    options: {
      A: 'Benar',
      B: 'Salah',
      C: '-',
      D: '-',
    },
    correctAnswer: 'A',
    explanation:
      'Keindahan tata kota, kemegahan istana, jembatan, dan masjid-masjid di Isfahan membuat para musafir dunia menjulukinya "Isfahan Separuh Dunia".',
    pageReference: 'Hlm. 36',
  },
  {
    id: 'safawi-7',
    type: 'multiple_choice',
    question: 'Alun-alun megah di jantung kota Isfahan yang dikelilingi Masjid Shah, Masjid Syekh Lutfallah, dan Istana Ali Qapu bernama...',
    options: {
      A: 'Registan',
      B: 'Taksim',
      C: 'Tahrir',
      D: 'Naqsh-e Jahan',
      E: 'Topkapi Meydani',
    },
    correctAnswer: 'D',
    explanation:
      'Maidan Naqsh-e Jahan (Gambaran Dunia) adalah salah satu lapangan publik terluas dan mahakarya arsitektur Islam warisan Daulah Safawi.',
    pageReference: 'Hlm. 37',
  },
  {
    id: 'safawi-8',
    type: 'multiple_choice',
    question: 'Untuk mengurangi ketergantungan pada kelompok Qizilbash yang suka memberontak, Syah Abbas I membentuk resimen militer baru bernama...',
    options: {
      A: 'Ghulam',
      B: 'Kossack',
      C: 'Legiuner',
      D: 'Ksatria Templar',
      E: 'Spahi',
    },
    correctAnswer: 'A',
    explanation:
      'Pasukan Ghulam terdiri dari pemuda-pemuda terdidik dari Georgia dan Armenia yang dipersenjatai senapan modern dan setia mutlak kepada Syah.',
    pageReference: 'Hlm. 34',
  },
  {
    id: 'safawi-9',
    type: 'multiple_choice',
    question: 'Tokoh intelektual dan filsuf terkemuka dari Mazhab Filsafat Isfahan pada era Daulah Safawi yang mencetuskan teori "Hikmah Muta\'aliyah" adalah...',
    options: {
      A: 'Mir Damad',
      B: 'Al-Farabi',
      C: 'Ibnu Rusyd',
      D: 'Al-Kindi',
      E: 'Mulla Sadra (Sadr al-Din al-Shirazi)',
    },
    correctAnswer: 'E',
    explanation:
      'Mulla Sadra menyatukan pendekatan filsafat peripatetik, iluminasionisme Suhrawardi, dan tasawuf falsafi dalam mahakaryanya Al-Asfar Al-Arba\'ah.',
    pageReference: 'Hlm. 38',
  },
  {
    id: 'safawi-10',
    type: 'multiple_choice',
    question: 'Kemunduran Daulah Safawi memuncak pada tahun 1722 M ketika ibu kota Isfahan diserbu dan ditaklukkan oleh suku Afghan di bawah pimpinan...',
    options: {
      A: 'Nadir Syah',
      B: 'Nadir Syah',
      C: 'Ahmad Syah Durrani',
      D: 'Karim Khan Zand',
      E: 'Mirwais Hotak',
    },
    correctAnswer: 'B',
    explanation:
      'Penyerbuan Mahmud Khan dari suku Ghilzai Afghanistan berhasil menduduki Isfahan dan memaksa Syah Sultan Husain menyerahkan tahtanya pada 1722 M.',
    pageReference: 'Hlm. 40',
  },
];

// ==========================================
// PAKET 3: DAULAH MUGHAL (10 SOAL LENGKAP)
// Materi SKI Kelas XI MA — Bab III (jejak-ski.web.app)
// ==========================================
export const INITIAL_DAULAH_MUGHAL_QUESTIONS: QuizQuestion[] = [
  {
    id: 'mughal-1',
    type: 'multiple_choice',
    question: 'Pendiri Daulah Mughal di India setelah memenangkan Pertempuran Panipat I pada tahun 1526 M adalah...',
    options: {
      A: 'Aurangzeb',
      B: 'Jalaluddin Akbar',
      C: 'Syah Jahan',
      D: 'Zahiruddin Muhammad Babur',
      E: 'Nasiruddin Humayun',
    },
    correctAnswer: 'D',
    explanation:
      'Zahiruddin Muhammad Babur mengalahkan Sultan Ibrahim Lodi dari Kesultanan Delhi dalam Pertempuran Panipat I (1526 M) dengan senjata api modern.',
    pageReference: 'Hlm. 48',
  },
  {
    id: 'mughal-2',
    type: 'multiple_choice',
    question: 'Sultan kedua Mughal yang sempat kehilangan tahta karena dikalahkan Sher Khan Suri dan mengungsi ke Persia adalah...',
    options: {
      A: 'Jahangir',
      B: 'Kamran',
      C: 'Humayun',
      D: 'Alamgir',
      E: 'Askari',
    },
    correctAnswer: 'C',
    explanation:
      'Humayun mengungsi ke istana Syah Tahmasp di Persia selama 15 tahun sebelum berhasil merebut kembali Delhi pada tahun 1555 M dengan bantuan Safawi.',
    pageReference: 'Hlm. 49',
  },
  {
    id: 'mughal-3',
    type: 'multiple_choice',
    question: 'Sultan Jalaluddin Muhammad Akbar naik tahta dalam usia 14 tahun dengan didampingi oleh seorang bupati/wali perkasa bernama...',
    options: {
      A: 'Abu al-Fazl',
      B: 'Asaf Khan',
      C: 'Todar Mal',
      D: 'Man Singh',
      E: 'Bairam Khan',
    },
    correctAnswer: 'E',
    explanation:
      'Bairam Khan bertindak sebagai wali yang cakap dan memimpin kemenangan pasukan muda Akbar dalam Pertempuran Panipat II (1556 M) melawan Hemu.',
    pageReference: 'Hlm. 50',
  },
  {
    id: 'mughal-4',
    type: 'multiple_choice',
    question: 'Prinsip kerukunan universal tanpa membedakan agama dan suku yang diterapkan oleh Sultan Akbar di India disebut...',
    options: {
      A: 'Sulakhul',
      B: 'Devshirme',
      C: 'Kanunname',
      D: 'Iqta',
      E: 'Din-i-Ilahi',
    },
    correctAnswer: 'A',
    explanation:
      'Doktrin Sulakhul (kedamaian universal) memandang semua rakyat India setara, merangkul bangsawan Hindu Rajput, dan menghapus pajak jizyah.',
    pageReference: 'Hlm. 52',
  },
  {
    id: 'mughal-5',
    type: 'multiple_choice',
    question: 'Mahakarya arsitektur marmer putih Taj Mahal di Agra dibangun pada masa pemerintahan Sultan...',
    options: {
      A: 'Jahangir',
      B: 'Akbar',
      C: 'Syah Jahan',
      D: 'Babur',
      E: 'Aurangzeb',
    },
    correctAnswer: 'C',
    explanation:
      'Sultan Syah Jahan (1628–1658 M) membangun Taj Mahal sebagai makam megah penuh cinta untuk mengenang permaisurinya, Mumtaz Mahal.',
    pageReference: 'Hlm. 54',
  },
  {
    id: 'mughal-6',
    type: 'multiple_choice',
    question: 'Kompleks istana dan benteng megah dari batu pasir merah yang dibangun Syah Jahan di Delhi dikenal dengan nama...',
    options: {
      A: 'Fatehpur Sikri',
      B: 'Fatehpur Sikri',
      C: 'Hawa Mahal',
      D: 'Golconda',
      E: 'Qutub Minar',
    },
    correctAnswer: 'B',
    explanation:
      'Lal Qila (Red Fort / Benteng Merah) dibangun saat Syah Jahan memindahkan ibu kota dari Agra ke Shahjahanabad (Delhi) pada 1648 M.',
    pageReference: 'Hlm. 54',
  },
  {
    id: 'mughal-7',
    type: 'multiple_choice',
    question: 'Sultan Mughal yang bergelar "Alamgir I" dan memprakarsai kodifikasi hukum Islam terlengkap di Asia Selatan adalah...',
    options: {
      A: 'Syah Alam',
      B: 'Dara Shikoh',
      C: 'Murad Bakhsh',
      D: 'Aurangzeb',
      E: 'Bahadur Syah',
    },
    correctAnswer: 'D',
    explanation:
      'Sultan Aurangzeb (1658–1707 M) memperluas wilayah Mughal ke India Selatan dan memerintahkan penyusunan ensiklopedia hukum fikih Fatawa Alamgiri.',
    pageReference: 'Hlm. 55',
  },
  {
    id: 'mughal-8',
    type: 'true_false',
    question:
      'Masjid Badshahi di Lahore yang memiliki kubah marmer putih megah dan empat menara tinggi dibangun oleh Sultan Aurangzeb.',
    options: {
      A: 'Benar',
      B: 'Salah',
      C: '-',
      D: '-',
    },
    correctAnswer: 'A',
    explanation:
      'Masjid Badshahi di Lahore selesai dibangun pada 1673 M di bawah titah Sultan Aurangzeb dan menjadi salah satu masjid terbesar di dunia.',
    pageReference: 'Hlm. 56',
  },
  {
    id: 'mughal-9',
    type: 'multiple_choice',
    question: 'Bahasa baru yang lahir di lingkungan istana dan perkemahan militer Mughal hasil asimilasi bahasa Persia, Arab, Turki, dan Hindi adalah...',
    options: {
      A: 'Bahasa Urdu',
      B: 'Bahasa Sanskerta',
      C: 'Bahasa Tamil',
      D: 'Bahasa Pashto',
      E: 'Bahasa Punjabi',
    },
    correctAnswer: 'A',
    explanation:
      'Kata "Urdu" berasal dari bahasa Turki ordu (perkemahan tentara), berkembang menjadi bahasa sastra dan percakapan resmi penting di anak benua India.',
    pageReference: 'Hlm. 57',
  },
  {
    id: 'mughal-10',
    type: 'multiple_choice',
    question: 'Kaisar terakhir Daulah Mughal yang digulingkan dan diasingkan oleh kolonialis Inggris ke Rangoon setelah Pemberontakan Sepoy 1857 adalah...',
    options: {
      A: 'Jahandar Syah',
      B: 'Akbar Syah II',
      C: 'Syah Alam II',
      D: 'Farrukhsiyar',
      E: 'Bahadur Syah II',
    },
    correctAnswer: 'E',
    explanation:
      'Inggris membubarkan Daulah Mughal pada 1858 M dan mengasingkan Bahadur Syah II ke Rangoon (Myanmar) hingga wafat di pengasingan.',
    pageReference: 'Hlm. 59',
  },
];

// ==========================================
// PAKET 4: PEMBARUAN ISLAM MODERN (10 SOAL LENGKAP)
// Materi SKI Kelas XI MA — Bab IV & V (jejak-ski.web.app)
// ==========================================
export const INITIAL_PEMBARUAN_ISLAM_QUESTIONS: QuizQuestion[] = [
  {
    id: 'pembaruan-1',
    type: 'multiple_choice',
    question: 'Peristiwa sejarah yang mengejutkan dan membuka mata dunia Islam akan kemajuan peradaban Barat modern adalah ekspedisi Napoleon Bonaparte ke...',
    options: {
      A: 'Konstantinopel (1453 M)',
      B: 'Konstantinopel (1453 M)',
      C: 'Baghdad (1258 M)',
      D: 'Cordoba (1492 M)',
      E: 'Damaskus (1860 M)',
    },
    correctAnswer: 'B',
    explanation:
      'Ekspedisi Napoleon ke Mesir pada 1798 M membawa para ilmuwan dan mesin cetak modern, menyadarkan para ulama dan pemimpin Islam akan ketertinggalan teknologi umat.',
    pageReference: 'Hlm. 68',
  },
  {
    id: 'pembaruan-2',
    type: 'multiple_choice',
    question: 'Penguasa Mesir yang dijuluki "Bapak Modernisasi Mesir" karena mendirikan percetakan Bulaq dan sekolah-sekolah teknik adalah...',
    options: {
      A: "Sa'id Pasya",
      B: 'Khedive Ismail',
      C: 'Ibrahim Pasya',
      D: 'Muhammad Ali Pasya',
      E: 'Abbas Hilmi Pasya',
    },
    correctAnswer: 'D',
    explanation:
      'Muhammad Ali Pasya mengirim ratusan pemuda Mesir belajar ke Prancis dan merintis industrialisasi, militer modern, dan sekolah teknik di Mesir.',
    pageReference: 'Hlm. 70',
  },
  {
    id: 'pembaruan-3',
    type: 'multiple_choice',
    question: 'Tokoh intelektual Mesir yang menulis buku "Takhlis al-Ibriz fi Talkhis Bariz" dan mempelopori penerjemahan sains modern adalah...',
    options: {
      A: 'Hasan al-Banna',
      B: 'Thaha Husein',
      C: "Rifa'ah Badawi ath-Tahtawi",
      D: 'Mustafa Kamil',
      E: 'Ali Mubarak',
    },
    correctAnswer: 'C',
    explanation:
      'Ath-Tahtawi mendirikan Sekolah Penerjemahan (Al-Alsun) di Kairo dan memperjuangkan pendidikan universal termasuk hak sekolah bagi kaum perempuan.',
    pageReference: 'Hlm. 72',
  },
  {
    id: 'pembaruan-4',
    type: 'multiple_choice',
    question: 'Gagasan Pan-Islamisme (solidaritas politik dan persatuan seluruh umat Islam untuk melawan penjajahan Barat) dipelopori oleh...',
    options: {
      A: 'Zia Gokalp',
      B: 'Syah Waliyullah',
      C: 'Sayyid Ahmad Khan',
      D: 'Namik Kemal',
      E: 'Jamaluddin al-Afghani',
    },
    correctAnswer: 'E',
    explanation:
      'Sayyid Jamaluddin al-Afghani menjelajahi Mesir, Turki, Iran, India, hingga Prancis untuk mengobarkan semangat persatuan Pan-Islamisme melawan hegemoni Barat.',
    pageReference: 'Hlm. 75',
  },
  {
    id: 'pembaruan-5',
    type: 'multiple_choice',
    question: 'Majalah politik dan pemikiran Islam revolusioner yang diterbitkan di Paris oleh Jamaluddin al-Afghani dan Muhammad Abduh adalah...',
    options: {
      A: 'Al-Urwatul Wutsqa',
      B: 'Al-Manar',
      C: 'Al-Ahram',
      D: 'Al-Muqtathaf',
      E: 'Al-Liwa',
    },
    correctAnswer: 'A',
    explanation:
      'Al-Urwatul Wutsqa (Ikatan yang Kuat) terbit pada 1884 M di Paris dan menyelundup ke berbagai negeri Muslim untuk membakar semangat antikolonialisme.',
    pageReference: 'Hlm. 76',
  },
  {
    id: 'pembaruan-6',
    type: 'multiple_choice',
    question: 'Ulama reformis Mesir yang menjabat Mufti Besar dan memelopori modernisasi kurikulum Universitas Al-Azhar serta keterbukaan pintu ijtihad adalah...',
    options: {
      A: 'Al-Baidhawi',
      B: 'Syekh Syaltut',
      C: 'Muhammad Abduh',
      D: 'Az-Zamakhsyari',
      E: 'Syekh Al-Maraghi',
    },
    correctAnswer: 'C',
    explanation:
      'Muhammad Abduh menegaskan bahwa ajaran Islam selaras dengan akal dan sains modern, serta menolak fanatisme buta terhadap tradisi taklid.',
    pageReference: 'Hlm. 78',
  },
  {
    id: 'pembaruan-7',
    type: 'multiple_choice',
    question: 'Murid utama Muhammad Abduh yang menerbitkan majalah "Al-Manar" dan menyusun Tafsir Al-Manar adalah...',
    options: {
      A: 'Farid Wajdi',
      B: 'Farid Wajdi',
      C: 'Mustafa al-Maraghi',
      D: 'Qasim Amin',
      E: 'Syakib Arsalan',
    },
    correctAnswer: 'B',
    explanation:
      'Rasyid Ridha mengembangkan pemikiran gurunya ke seluruh penjuru dunia Islam, termasuk mempengaruhi ulama-ulama pembaru di Nusantara.',
    pageReference: 'Hlm. 82',
  },
  {
    id: 'pembaruan-8',
    type: 'multiple_choice',
    question: 'Tokoh pembaru Islam di India yang mendirikan Aligarh Muslim University (MAO College) untuk memajukan sains di kalangan umat Islam adalah...',
    options: {
      A: 'Mirza Ghulam Ahmad',
      B: 'Maulana Abul Kalam Azad',
      C: 'Syah Alam',
      D: 'Sir Sayyid Ahmad Khan',
      E: 'Shibli Numani',
    },
    correctAnswer: 'D',
    explanation:
      'Sayyid Ahmad Khan meyakini bahwa kunci kebangkitan Muslim India adalah penguasaan sains, teknologi, dan bahasa Inggris melalui pendidikan modern.',
    pageReference: 'Hlm. 85',
  },
  {
    id: 'pembaruan-9',
    type: 'multiple_choice',
    question: 'Penyair dan filosof Muslim besar asal anak benua India yang menggagas konsep filosofis "Khudi" (kemandirian jiwa) dan ide negara Pakistan adalah...',
    options: {
      A: 'Dr. Muhammad Iqbal',
      B: 'Ali Jinnah',
      C: 'Rabindranath Tagore',
      D: 'Amir Ali',
      E: 'Chaudhry Rehmat Ali',
    },
    correctAnswer: 'A',
    explanation:
      'Dr. Muhammad Iqbal menulis karya filosofis "The Reconstruction of Religious Thought in Islam" dan menyerukan dinamisme serta keberanian berpikir kreatif.',
    pageReference: 'Hlm. 88',
  },
  {
    id: 'pembaruan-10',
    type: 'true_false',
    question:
      'Gagasan pembaruan Islam dari Timur Tengah turut menginspirasi berdirinya organisasi Islam modern di Indonesia seperti Muhammadiyah oleh KH Ahmad Dahlan pada 1912 M.',
    options: {
      A: 'Benar',
      B: 'Salah',
      C: '-',
      D: '-',
    },
    correctAnswer: 'A',
    explanation:
      'KH Ahmad Dahlan terinspirasi pemikiran Muhammad Abduh dan Rasyid Ridha melalui majalah Al-Manar untuk memurnikan tauhid dan mendirikan sekolah serta rumah sakit modern.',
    pageReference: 'Hlm. 92',
  },
];

// ==========================================
// KELAS XII: PAKET 1 — ISLAM MASUK KE NUSANTARA & WALISONGO (10 SOAL)
// Materi SKI Kelas XII MA — Bab I & II
// ==========================================
export const INITIAL_NUSANTARA_WALISONGO_QUESTIONS: QuizQuestion[] = [
  {
    id: 'nusantara-1',
    type: 'multiple_choice',
    question: 'Teori yang menyatakan bahwa Islam masuk ke Nusantara langsung dari kawasan Arab (Makkah/Madinah) sejak abad ke-7 Masehi (abad ke-1 H) dipelopori oleh...',
    options: {
      A: 'Slamet Muljana',
      B: 'Snouck Hurgronje',
      C: 'J.P. Moquette',
      D: 'Hoesein Djajadiningrat',
      E: 'Buya HAMKA dan Anthony H. Johns',
    },
    correctAnswer: 'E',
    explanation:
      'Buya HAMKA dalam Seminar Sejarah Masuknya Islam di Medan (1963) menegaskan Teori Makkah, dibuktikan dengan keberadaan perkampungan pedagang Arab muslim di Barus (Pantai Barat Sumatera) sejak abad ke-7 M.',
    pageReference: 'Hlm. 12 (Kelas XII)',
  },
  {
    id: 'nusantara-2',
    type: 'multiple_choice',
    question: 'Jalur perdagangan dan pelayaran internasional yang strategis di Selat Malaka menjadi pintu gerbang utama penyebaran Islam di Nusantara karena dilalui saudagar muslim dari...',
    options: {
      A: 'Romawi dan Yunani Kuno',
      B: 'Romawi dan Yunani Kuno',
      C: 'Portugis dan Spanyol',
      D: 'Belanda dan Inggris',
      E: 'Turki Usmani dan Venesia',
    },
    correctAnswer: 'B',
    explanation:
      'Selat Malaka adalah jalur sutra maritim tempat bertemunya para saudagar muslim dari Timur Tengah dan Asia yang berdagang sambil menyebarkan ajaran dan akhlak Islam.',
    pageReference: 'Hlm. 15 (Kelas XII)',
  },
  {
    id: 'nusantara-3',
    type: 'multiple_choice',
    question: 'Bukti arkeologis tertua makam seorang wanita muslimah bernama Fatimah binti Maimun yang berangka tahun 1082 M (475 H) ditemukan di daerah...',
    options: {
      A: 'Demak, Jawa Tengah',
      B: 'Trowulan, Mojokerto',
      C: 'Pasai, Aceh Utara',
      D: 'Leran, Manyar, Gresik (Jawa Timur)',
      E: 'Banten Girang',
    },
    correctAnswer: 'D',
    explanation:
      'Prasasti nisan batu Fatimah binti Maimun di Leran, Gresik, membuktikan bahwa komunitas muslim telah bermukim di pesisir utara Jawa Timur sejak abad ke-11 Masehi.',
    pageReference: 'Hlm. 18 (Kelas XII)',
  },
  {
    id: 'nusantara-4',
    type: 'multiple_choice',
    question: 'Tokoh pelopor Walisongo yang dipandang sebagai sesepuh / wali pertama yang berdakwah di tanah Jawa dan dimakamkan di Gresik (wafat 1419 M) adalah...',
    options: {
      A: 'Sunan Bonang',
      B: 'Sunan Ampel',
      C: 'Maulana Malik Ibrahim (Sunan Gresik)',
      D: 'Sunan Giri',
      E: 'Sunan Gunung Jati',
    },
    correctAnswer: 'C',
    explanation:
      'Maulana Malik Ibrahim (Syekh Maghribi) merintis dakwah dengan membuka lahan pertanian, pengobatan cuma-cuma, dan perniagaan tanpa membeda-bedakan kasta masyarakat.',
    pageReference: 'Hlm. 28 (Kelas XII)',
  },
  {
    id: 'nusantara-5',
    type: 'multiple_choice',
    question: 'Sunan Ampel (Raden Rahmat) mendirikan pusat kaderisasi dakwah di Ampeldenta (Surabaya) dan mengajarkan falsafah moral terkenal bernama "Moh Limo", yang bermakna...',
    options: {
      A: 'Bersedekah kepada lima golongan fakir',
      B: 'Menjalankan rukun Islam yang lima',
      C: 'Berpuasa lima hari dalam sebulan',
      D: 'Membaca lima surah pilihan Al-Qur\'an',
      E: 'Menolak lima perbuatan maksiat (judi, madat, minum, maling, madon)',
    },
    correctAnswer: 'E',
    explanation:
      'Ajaran Moh Limo (Moh Main, Moh Ngombe, Moh Maling, Moh Madat, Moh Madon) adalah metode dakwah kultural Sunan Ampel untuk membenahi budi pekerti masyarakat Jawa.',
    pageReference: 'Hlm. 32 (Kelas XII)',
  },
  {
    id: 'nusantara-6',
    type: 'multiple_choice',
    question: 'Media kesenian wayang kulit, tembang Dhandhanggula, dan gamelan sekaten dimanfaatkan sebagai sarana dakwah Islam yang sangat efektif dan akulturatif oleh...',
    options: {
      A: 'Sunan Kalijaga (Raden Said)',
      B: 'Sunan Giri',
      C: 'Sunan Kudus',
      D: 'Sunan Muria',
      E: 'Sunan Drajat',
    },
    correctAnswer: 'A',
    explanation:
      'Sunan Kalijaga memasukkan nilai tauhid, syahadatain (sekaten), dan kisah kepahlawanan Islam ke dalam pertunjukan wayang kulit tanpa meminta upah materi, melainkan mengajak penonton membaca syahadat.',
    pageReference: 'Hlm. 38 (Kelas XII)',
  },
  {
    id: 'nusantara-7',
    type: 'multiple_choice',
    question: 'Sunan Kudus (Ja\'far Shadiq) menunjukkan toleransi dan kearifan lokal yang tinggi terhadap masyarakat Hindu di Kudus dengan cara...',
    options: {
      A: 'Mewajibkan semua warga mengenakan jubah putih',
      B: 'Membagikan beras kuning setiap hari raya',
      C: 'Mengganti sembelihan sapi dengan kerbau dan membangun menara masjid bercorak candi',
      D: 'Menghapus semua tradisi ziarah kubur',
      E: 'Mengadakan pertunjukan tari kecak di alun-alun kota',
    },
    correctAnswer: 'C',
    explanation:
      'Sunan Kudus menghormati masyarakat pemeluk Hindu dengan mengganti sembelihan sapi dengan kerbau, serta merancang Menara Masjid Kudus dengan perpaduan arsitektur bata merah bercorak Hindu-Jawa.',
    pageReference: 'Hlm. 44 (Kelas XII)',
  },
  {
    id: 'nusantara-8',
    type: 'true_false',
    question:
      'Sunan Giri (Raden Paku) mendirikan Giri Kedaton di Gresik yang tidak hanya menjadi pesantren santri dari penjuru Nusantara, tetapi juga memiliki pengaruh politik dan legitimasi raja-raja Islam di kepulauan Maluku.',
    options: {
      A: 'Benar',
      B: 'Salah',
      C: '-',
      D: '-',
      E: '-',
    },
    correctAnswer: 'A',
    explanation:
      'Giri Kedaton berperan ganda sebagai pusat pendidikan Islam dan mahkamah spiritual penasihat kesultanan-kesultanan Islam di Nusantara (termasuk Ternate, Tidore, dan Hitu).',
    pageReference: 'Hlm. 35 (Kelas XII)',
  },
  {
    id: 'nusantara-9',
    type: 'multiple_choice',
    question: 'Anggota Walisongo yang memimpin dakwah dan mendirikan Kesultanan Cirebon serta meletakkan fondasi Kesultanan Banten di Jawa Barat adalah...',
    options: {
      A: 'Sunan Muria',
      B: 'Sunan Muria',
      C: 'Sunan Drajat',
      D: 'Sunan Bonang',
      E: 'Syekh Siti Jenar',
    },
    correctAnswer: 'B',
    explanation:
      'Sunan Gunung Jati menyebarkan Islam di tatar Pasundan, memimpin Kesultanan Cirebon, dan menugaskan putranya Sultan Maulana Hasanuddin memimpin Banten.',
    pageReference: 'Hlm. 50 (Kelas XII)',
  },
  {
    id: 'nusantara-10',
    type: 'multiple_choice',
    question: 'Karya sastra tembang suluk Suluk Wijil dan penciptaan gending gamelan bonang serta tembang Tombo Ati merupakan warisan dakwah salah satu Walisongo yaitu...',
    options: {
      A: 'Sunan Muria',
      B: 'Sunan Ampel',
      C: 'Sunan Drajat',
      D: 'Sunan Bonang (Raden Makhdum Ibrahim)',
      E: 'Sunan Kudus',
    },
    correctAnswer: 'D',
    explanation:
      'Sunan Bonang memadukan sastra tasawuf dengan alunan gamelan Jawa, menciptakan alat musik bonang serta tembang Tombo Ati yang lestari hingga masa kini.',
    pageReference: 'Hlm. 34 (Kelas XII)',
  },
];

// ==========================================
// KELAS XII: PAKET 2 — KERAJAAN ISLAM NUSANTARA & PERAN ORGANISASI ISLAM (10 SOAL)
// Materi SKI Kelas XII MA — Bab III & IV
// ==========================================
export const INITIAL_KERAJAAN_ORGANISASI_QUESTIONS: QuizQuestion[] = [
  {
    id: 'kerajaan-1',
    type: 'multiple_choice',
    question: 'Kerajaan Islam pertama di kepulauan Indonesia yang berdiri pada abad ke-13 M di pesisir utara Aceh adalah...',
    options: {
      A: 'Kesultanan Samudera Pasai',
      B: 'Kesultanan Aceh Darussalam',
      C: 'Kesultanan Malaka',
      D: 'Kesultanan Demak',
      E: 'Kesultanan Perlak',
    },
    correctAnswer: 'A',
    explanation:
      'Samudera Pasai didirikan oleh Meurah Silu yang bergelar Sultan Malik As-Saleh (wafat 1297 M), sebagaimana dicatat oleh pengembara dunia Ibnu Battuta dan Marco Polo.',
    pageReference: 'Hlm. 62 (Kelas XII)',
  },
  {
    id: 'kerajaan-2',
    type: 'multiple_choice',
    question: 'Kesultanan Islam pertama di Pulau Jawa yang berdiri pada akhir abad ke-15 M dengan raja pertama Raden Patah adalah...',
    options: {
      A: 'Kesultanan Cirebon',
      B: 'Kesultanan Pajang',
      C: 'Kesultanan Mataram Islam',
      D: 'Kesultanan Banten',
      E: 'Kesultanan Demak',
    },
    correctAnswer: 'E',
    explanation:
      'Demak didirikan atas dukungan para Walisongo sekitar tahun 1478/1500 M dan Masjid Agung Demak menjadi simbol pusat peradaban Islam di Pulau Jawa.',
    pageReference: 'Hlm. 74 (Kelas XII)',
  },
  {
    id: 'kerajaan-3',
    type: 'multiple_choice',
    question: 'Panglima perang Demak yang dijuluki "Pangeran Sabrang Lor" karena memimpin armada laut muslim menyerang benteng penjajah Portugis di Malaka pada 1513 M adalah...',
    options: {
      A: 'Sultan Trenggana',
      B: 'Sultan Trenggana',
      C: 'Fatahillah',
      D: 'Sunan Prawoto',
      E: 'Jaka Tingkir',
    },
    correctAnswer: 'B',
    explanation:
      'Pati Unus memimpin armada gabungan puluhan kapal perang Demak menyeberangi Laut Jawa ke Selat Malaka guna mengusir penjajah Portugis.',
    pageReference: 'Hlm. 76 (Kelas XII)',
  },
  {
    id: 'kerajaan-4',
    type: 'multiple_choice',
    question: 'Peristiwa pembebasan Sunda Kelapa dari cengkeraman Portugis pada 22 Juni 1527 M dipimpin oleh Fatahillah dan nama pelabuhan tersebut diubah menjadi...',
    options: {
      A: 'Surabaya',
      B: 'Batavia',
      C: 'Nusantara',
      D: 'Jayakarta (Kemenangan Sempurna)',
      E: 'Tanjung Priok',
    },
    correctAnswer: 'D',
    explanation:
      'Nama Jayakarta (Fathan Mubina / Kemenangan yang Nyata) diambil dari Surah Al-Fath ayat 1 dan tanggal bersejarah 22 Juni kini diperingati sebagai Hari Jadi Kota Jakarta.',
    pageReference: 'Hlm. 78 (Kelas XII)',
  },
  {
    id: 'kerajaan-5',
    type: 'multiple_choice',
    question: 'Sultan terbesar Kesultanan Aceh Darussalam yang membawa Aceh ke puncak kejayaan politik maritim, perdagangan rempah, dan armada laut tangguh pada abad ke-17 adalah...',
    options: {
      A: 'Sultan Iskandar Tsani',
      B: 'Sultan Ali Mughayat Syah',
      C: 'Sultan Iskandar Muda',
      D: 'Sultan Alauddin Riayat Syah',
      E: 'Sultan Malik Az-Zahir',
    },
    correctAnswer: 'C',
    explanation:
      'Sultan Iskandar Muda (1607–1636 M) memperluas wilayah kekuasaan Aceh hingga Semenanjung Malaya dan menyusun tata hukum kenegaraan Adat Meukuta Alam.',
    pageReference: 'Hlm. 68 (Kelas XII)',
  },
  {
    id: 'kerajaan-6',
    type: 'multiple_choice',
    question: 'Raja Mataram Islam yang memimpin penyerbuan akbar mengepung benteng VOC di Batavia sebanyak dua kali (1628 dan 1629 M) adalah...',
    options: {
      A: 'Pangeran Puger',
      B: 'Panembahan Senopati',
      C: 'Amangkurat I',
      D: 'Sultan Hamengkubuwono I',
      E: 'Sultan Agung Hanyokrokusumo',
    },
    correctAnswer: 'E',
    explanation:
      'Sultan Agung memadukan kalender Saka dan Hijriyah menjadi Penanggalan Jawa Islam serta gigih melawan monopoli dagang VOC Belanda di Batavia.',
    pageReference: 'Hlm. 82 (Kelas XII)',
  },
  {
    id: 'kerajaan-7',
    type: 'multiple_choice',
    question: 'Pahlawan nasional penguasa Kesultanan Gowa-Tallo di Sulawesi Selatan yang dijuluki Belanda "Ayam Jantan dari Timur" (De Haantjes van Het Oosten) adalah...',
    options: {
      A: 'Sultan Hasanuddin',
      B: 'Aru Palakka',
      C: 'Sultan Alauddin',
      D: 'Karaeng Matoaya',
      E: 'Sultan Muhammad Said',
    },
    correctAnswer: 'A',
    explanation:
      'Sultan Hasanuddin memimpin perlawanan mempertahankan kedaulatan maritim kepulauan rempah Indonesia timur dari monopoli dagang VOC.',
    pageReference: 'Hlm. 92 (Kelas XII)',
  },
  {
    id: 'kerajaan-8',
    type: 'multiple_choice',
    question: 'Lembaga pendidikan tradisional Islam khas Nusantara yang berbasis asrama (pondok), masjid, pengajian kitab kuning, dan keteladanan kiai disebut...',
    options: {
      A: 'Sekolah Rakyat',
      B: 'Madrasah Ibtidaiyah',
      C: 'Pondok Pesantren',
      D: 'Surau Kaum',
      E: 'Padepokan Adat',
    },
    correctAnswer: 'C',
    explanation:
      'Pesantren adalah institusi pendidikan tertua di Indonesia yang mendidik kader ulama, menjaga transmisi keilmuan Islam, dan menjadi benteng perjuangan kemerdekaan.',
    pageReference: 'Hlm. 104 (Kelas XII)',
  },
  {
    id: 'kerajaan-9',
    type: 'multiple_choice',
    question: 'Organisasi Islam terbesar di Indonesia yang didirikan oleh KH Hasyim Asy\'ari pada 16 Rajab 1344 H (31 Januari 1926 M) di Surabaya untuk melestarikan ajaran Ahlussunnah wal Jama\'ah adalah...',
    options: {
      A: 'Muhammadiyah',
      B: 'Muhammadiyah',
      C: 'Al-Irsyad Al-Islamiyyah',
      D: 'Persatuan Islam (Persis)',
      E: 'Matla\'ul Anwar',
    },
    correctAnswer: 'B',
    explanation:
      'Nahdlatul Ulama (Kebangkitan Ulama) diprakarsai oleh KH Hasyim Asy\'ari dan para ulama pesantren untuk melestarikan tradisi keagamaan Aswaja bermazhab empat dan membela keutuhan tanah air.',
    pageReference: 'Hlm. 112 (Kelas XII)',
  },
  {
    id: 'kerajaan-10',
    type: 'true_false',
    question:
      'Resolusi Jihad yang difatwakan oleh Hadratussyaikh KH Hasyim Asy\'ari pada 22 Oktober 1945 menggerakkan santri dan rakyat bertempur mempertahankan kemerdekaan Indonesia di Surabaya, yang kini diabadikan sebagai Hari Santri Nasional.',
    options: {
      A: 'Benar',
      B: 'Salah',
      C: '-',
      D: '-',
      E: '-',
    },
    correctAnswer: 'A',
    explanation:
      'Fatwa Resolusi Jihad mewajibkan fardhu \'ain bagi kaum muslimin dalam radius 94 km untuk berjihad membela tanah air dari agresi tentara Sekutu/NICA di Surabaya.',
    pageReference: 'Hlm. 118 (Kelas XII)',
  },
];

// ==========================================
// DAFTAR LENGKAP 16 PAKET SOAL RESMI SKI KEMENAG RI
// Sesuai Kurikulum Resmi Jejak SKI: Kelas X (6 Bab), Kelas XI (5 Bab), Kelas XII (5 Bab)
// ==========================================
import { ALL_SKI_PACKAGES } from '../data/allPackages';

export { ALL_SKI_PACKAGES };
export const INITIAL_PACKAGES: QuestionPackage[] = ALL_SKI_PACKAGES;

export const SAMPLE_PASTE_FORMAT_TEXT = `Siapakah pendiri Daulah Usmani? | Usman bin Ertoghrul | Orkhan | Murad I | Bayazid I | A | Usman bin Ertoghrul memproklamasikan Daulah Usmani pada 1299 M. | Hlm. 4
Sultan Muhammad Al-Fatih berhasil membebaskan Konstantinopel pada tahun... | 1450 M | 1453 M | 1481 M | 1512 M | 1520 M | B | Konstantinopel ditaklukkan pada 29 Mei 1453 M (857 H). | Hlm. 14
[Benar/Salah] Ibu kota Daulah Usmani dipindahkan ke Konstantinopel (Istanbul) oleh Sultan Muhammad Al-Fatih pada tahun 1453 M. | Benar | Salah | - | - | A | Setelah penaklukan 29 Mei 1453, Konstantinopel menjadi ibu kota baru bernama Istanbul. | Hlm. 15`;
