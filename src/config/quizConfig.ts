export type QuestionType = 'multiple_choice' | 'true_false';
export type AnswerLetter = 'A' | 'B' | 'C' | 'D' | 'E';
export type GameMode = 'group' | 'solo';

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
  soundEnabled: boolean;
}

export const STORAGE_KEYS = {
  PACKAGES: 'ski_quiz_packages_v4',
  SELECTED_PACKAGE_ID: 'ski_quiz_selected_package_v4',
  TEAMS: 'ski_quiz_teams_v4',
  SETTINGS: 'ski_quiz_settings_v4',
} as const;

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
  shuffleQuestionsOnStart: false,
  soundEnabled: true,
};

// ==========================================
// PAKET 1: DAULAH USMANI (10 SOAL LENGKAP)
// Materi SKI Kelas XI MA — Bab I (jejak-ski.web.app)
// ==========================================
export const INITIAL_DAULAH_USMANI_QUESTIONS: QuizQuestion[] = [
  {
    id: 'usmani-1',
    type: 'multiple_choice',
    question: 'Daulah Usmani bermula dari kabilah bangsa Turki yang dikenal dengan suku...',
    options: {
      A: 'Kayi',
      B: 'Quraisy',
      C: 'Tamim',
      D: 'Tatar',
      E: 'Oghuz Seljuk',
    },
    correctAnswer: 'A',
    explanation:
      'Daulah Usmani berawal dari suku Kayi di Turki Barat yang dipimpin oleh Sulaiman Syah dan kemudian dilanjutkan oleh putranya, Ertoghrul.',
    pageReference: 'Hlm. 3',
  },
  {
    id: 'usmani-2',
    type: 'multiple_choice',
    question: 'Usman bin Ertoghrul memproklamasikan berdirinya Daulah Usmani pada tahun...',
    options: {
      A: '1258 M',
      B: '1288 M',
      C: '1299 M',
      D: '1453 M',
      E: '1517 M',
    },
    correctAnswer: 'C',
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
      B: 'Sogut',
      C: 'Bursa',
      D: 'Adrianopel',
      E: 'Ankara',
    },
    correctAnswer: 'B',
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
      B: 'Ankara',
      C: 'Gallipoli',
      D: 'Varna',
      E: 'Nikopolis',
    },
    correctAnswer: 'B',
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
      B: 'Menyatukan kembali negeri Usmani setelah perang saudara pasca-serangan Timur Lenk',
      C: 'Memindahkan ibu kota kerajaan ke Benua Eropa',
      D: 'Menaklukkan wilayah Hijaz dan Mesir',
      E: 'Membangun armada angkatan laut pertama Usmani',
    },
    correctAnswer: 'B',
    explanation:
      'Sultan Muhammad I berhasil mengakhiri masa kekacauan (Interregnum) selama 10 tahun dan mempersatukan kembali Daulah Usmani.',
    pageReference: 'Hlm. 11',
  },
  {
    id: 'usmani-7',
    type: 'multiple_choice',
    question: 'Sultan Muhammad Al-Fatih berhasil menaklukkan benteng Konstantinopel pada tanggal...',
    options: {
      A: '29 Mei 1453',
      B: '15 Juni 1299',
      C: '1 Januari 1520',
      D: '25 Desember 1492',
      E: '10 Muharram 1517',
    },
    correctAnswer: 'A',
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
      A: 'Mustafa Kemal Ataturk',
      B: 'Ismet Inonu',
      C: 'Enver Pasya',
      D: 'Midhat Pasya',
      E: 'Fevzi Cakmak',
    },
    correctAnswer: 'A',
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
      A: 'Tarekat Safawiyah',
      B: 'Tarekat Naqsyabandiyah',
      C: 'Tarekat Qadiriyah',
      D: 'Tarekat Maulawiyah',
      E: 'Tarekat Suhrawardiyah',
    },
    correctAnswer: 'A',
    explanation:
      'Daulah Safawi bermula dari gerakan Tarekat Safawiyah yang didirikan oleh Syekh Safiuddin Ishaq Al-Ardabili di kota Ardabil, Azerbaijan.',
    pageReference: 'Hlm. 29',
  },
  {
    id: 'safawi-2',
    type: 'multiple_choice',
    question: 'Pemimpin yang secara resmi memproklamasikan berdirinya Daulah Safawi di Tabriz pada tahun 1501 M adalah...',
    options: {
      A: 'Syah Ismail I',
      B: 'Syah Abbas I',
      C: 'Syah Tahmasp I',
      D: 'Syaikh Haidar',
      E: 'Syah Safiuddin',
    },
    correctAnswer: 'A',
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
      B: 'Qizilbash',
      C: 'Sipahi',
      D: 'Ghulam',
      E: 'Pasukan Cossack',
    },
    correctAnswer: 'B',
    explanation:
      'Qizilbash (bahasa Turki: Kepala Merah) adalah tentara tempur Safawi yang memakai penutup kepala merah dengan 12 lipatan melambangkan 12 imam Syiah.',
    pageReference: 'Hlm. 31',
  },
  {
    id: 'safawi-4',
    type: 'multiple_choice',
    question: 'Pertempuran militer dahsyat pada tahun 1514 M antara Daulah Safawi pimpinan Ismail I dan Daulah Usmani pimpinan Sultan Salim I terjadi di lembah...',
    options: {
      A: 'Chaldiran',
      B: 'Marj Dabiq',
      C: 'Yarmuk',
      D: 'Qadisiyah',
      E: 'Mohacs',
    },
    correctAnswer: 'A',
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
      C: 'Syah Abbas I',
      D: 'Syah Safi',
      E: 'Syah Sulaiman',
    },
    correctAnswer: 'C',
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
      A: 'Naqsh-e Jahan',
      B: 'Taksim',
      C: 'Tahrir',
      D: 'Registan',
      E: 'Topkapi Meydani',
    },
    correctAnswer: 'A',
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
      A: 'Mulla Sadra (Sadr al-Din al-Shirazi)',
      B: 'Al-Farabi',
      C: 'Ibnu Rusyd',
      D: 'Al-Kindi',
      E: 'Mir Damad',
    },
    correctAnswer: 'A',
    explanation:
      'Mulla Sadra menyatukan pendekatan filsafat peripatetik, iluminasionisme Suhrawardi, dan tasawuf falsafi dalam mahakaryanya Al-Asfar Al-Arba\'ah.',
    pageReference: 'Hlm. 38',
  },
  {
    id: 'safawi-10',
    type: 'multiple_choice',
    question: 'Kemunduran Daulah Safawi memuncak pada tahun 1722 M ketika ibu kota Isfahan diserbu dan ditaklukkan oleh suku Afghan di bawah pimpinan...',
    options: {
      A: 'Mahmud Khan Ghilzai',
      B: 'Nadir Syah',
      C: 'Ahmad Syah Durrani',
      D: 'Karim Khan Zand',
      E: 'Mirwais Hotak',
    },
    correctAnswer: 'A',
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
      A: 'Zahiruddin Muhammad Babur',
      B: 'Jalaluddin Akbar',
      C: 'Syah Jahan',
      D: 'Aurangzeb',
      E: 'Nasiruddin Humayun',
    },
    correctAnswer: 'A',
    explanation:
      'Zahiruddin Muhammad Babur mengalahkan Sultan Ibrahim Lodi dari Kesultanan Delhi dalam Pertempuran Panipat I (1526 M) dengan senjata api modern.',
    pageReference: 'Hlm. 48',
  },
  {
    id: 'mughal-2',
    type: 'multiple_choice',
    question: 'Sultan kedua Mughal yang sempat kehilangan tahta karena dikalahkan Sher Khan Suri dan mengungsi ke Persia adalah...',
    options: {
      A: 'Humayun',
      B: 'Kamran',
      C: 'Jahangir',
      D: 'Alamgir',
      E: 'Askari',
    },
    correctAnswer: 'A',
    explanation:
      'Humayun mengungsi ke istana Syah Tahmasp di Persia selama 15 tahun sebelum berhasil merebut kembali Delhi pada tahun 1555 M dengan bantuan Safawi.',
    pageReference: 'Hlm. 49',
  },
  {
    id: 'mughal-3',
    type: 'multiple_choice',
    question: 'Sultan Jalaluddin Muhammad Akbar naik tahta dalam usia 14 tahun dengan didampingi oleh seorang bupati/wali perkasa bernama...',
    options: {
      A: 'Bairam Khan',
      B: 'Asaf Khan',
      C: 'Todar Mal',
      D: 'Man Singh',
      E: 'Abu al-Fazl',
    },
    correctAnswer: 'A',
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
      A: 'Syah Jahan',
      B: 'Akbar',
      C: 'Jahangir',
      D: 'Babur',
      E: 'Aurangzeb',
    },
    correctAnswer: 'A',
    explanation:
      'Sultan Syah Jahan (1628–1658 M) membangun Taj Mahal sebagai makam megah penuh cinta untuk mengenang permaisurinya, Mumtaz Mahal.',
    pageReference: 'Hlm. 54',
  },
  {
    id: 'mughal-6',
    type: 'multiple_choice',
    question: 'Kompleks istana dan benteng megah dari batu pasir merah yang dibangun Syah Jahan di Delhi dikenal dengan nama...',
    options: {
      A: 'Lal Qila (Benteng Merah)',
      B: 'Fatehpur Sikri',
      C: 'Hawa Mahal',
      D: 'Golconda',
      E: 'Qutub Minar',
    },
    correctAnswer: 'A',
    explanation:
      'Lal Qila (Red Fort / Benteng Merah) dibangun saat Syah Jahan memindahkan ibu kota dari Agra ke Shahjahanabad (Delhi) pada 1648 M.',
    pageReference: 'Hlm. 54',
  },
  {
    id: 'mughal-7',
    type: 'multiple_choice',
    question: 'Sultan Mughal yang bergelar "Alamgir I" dan memprakarsai kodifikasi hukum Islam terlengkap di Asia Selatan adalah...',
    options: {
      A: 'Aurangzeb',
      B: 'Dara Shikoh',
      C: 'Murad Bakhsh',
      D: 'Syah Alam',
      E: 'Bahadur Syah',
    },
    correctAnswer: 'A',
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
      A: 'Bahadur Syah II',
      B: 'Akbar Syah II',
      C: 'Syah Alam II',
      D: 'Farrukhsiyar',
      E: 'Jahandar Syah',
    },
    correctAnswer: 'A',
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
      A: 'Mesir (1798 M)',
      B: 'Konstantinopel (1453 M)',
      C: 'Baghdad (1258 M)',
      D: 'Cordoba (1492 M)',
      E: 'Damaskus (1860 M)',
    },
    correctAnswer: 'A',
    explanation:
      'Ekspedisi Napoleon ke Mesir pada 1798 M membawa para ilmuwan dan mesin cetak modern, menyadarkan para ulama dan pemimpin Islam akan ketertinggalan teknologi umat.',
    pageReference: 'Hlm. 68',
  },
  {
    id: 'pembaruan-2',
    type: 'multiple_choice',
    question: 'Penguasa Mesir yang dijuluki "Bapak Modernisasi Mesir" karena mendirikan percetakan Bulaq dan sekolah-sekolah teknik adalah...',
    options: {
      A: 'Muhammad Ali Pasya',
      B: 'Khedive Ismail',
      C: 'Ibrahim Pasya',
      D: 'Sa\'id Pasya',
      E: 'Abbas Hilmi Pasya',
    },
    correctAnswer: 'A',
    explanation:
      'Muhammad Ali Pasya mengirim ratusan pemuda Mesir belajar ke Prancis dan merintis industrialisasi, militer modern, dan sekolah teknik di Mesir.',
    pageReference: 'Hlm. 70',
  },
  {
    id: 'pembaruan-3',
    type: 'multiple_choice',
    question: 'Tokoh intelektual Mesir yang menulis buku "Takhlis al-Ibriz fi Talkhis Bariz" dan mempelopori penerjemahan sains modern adalah...',
    options: {
      A: 'Rifa\'ah Badawi ath-Tahtawi',
      B: 'Thaha Husein',
      C: 'Hasan al-Banna',
      D: 'Mustafa Kamil',
      E: 'Ali Mubarak',
    },
    correctAnswer: 'A',
    explanation:
      'Ath-Tahtawi mendirikan Sekolah Penerjemahan (Al-Alsun) di Kairo dan memperjuangkan pendidikan universal termasuk hak sekolah bagi kaum perempuan.',
    pageReference: 'Hlm. 72',
  },
  {
    id: 'pembaruan-4',
    type: 'multiple_choice',
    question: 'Gagasan Pan-Islamisme (solidaritas politik dan persatuan seluruh umat Islam untuk melawan penjajahan Barat) dipelopori oleh...',
    options: {
      A: 'Jamaluddin al-Afghani',
      B: 'Syah Waliyullah',
      C: 'Sayyid Ahmad Khan',
      D: 'Namik Kemal',
      E: 'Zia Gokalp',
    },
    correctAnswer: 'A',
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
      A: 'Muhammad Abduh',
      B: 'Syekh Syaltut',
      C: 'Al-Baidhawi',
      D: 'Az-Zamakhsyari',
      E: 'Syekh Al-Maraghi',
    },
    correctAnswer: 'A',
    explanation:
      'Muhammad Abduh menegaskan bahwa ajaran Islam selaras dengan akal dan sains modern, serta menolak fanatisme buta terhadap tradisi taklid.',
    pageReference: 'Hlm. 78',
  },
  {
    id: 'pembaruan-7',
    type: 'multiple_choice',
    question: 'Murid utama Muhammad Abduh yang menerbitkan majalah "Al-Manar" dan menyusun Tafsir Al-Manar adalah...',
    options: {
      A: 'Muhammad Rasyid Ridha',
      B: 'Farid Wajdi',
      C: 'Mustafa al-Maraghi',
      D: 'Qasim Amin',
      E: 'Syakib Arsalan',
    },
    correctAnswer: 'A',
    explanation:
      'Rasyid Ridha mengembangkan pemikiran gurunya ke seluruh penjuru dunia Islam, termasuk mempengaruhi ulama-ulama pembaru di Nusantara.',
    pageReference: 'Hlm. 82',
  },
  {
    id: 'pembaruan-8',
    type: 'multiple_choice',
    question: 'Tokoh pembaru Islam di India yang mendirikan Aligarh Muslim University (MAO College) untuk memajukan sains di kalangan umat Islam adalah...',
    options: {
      A: 'Sir Sayyid Ahmad Khan',
      B: 'Maulana Abul Kalam Azad',
      C: 'Syah Alam',
      D: 'Mirza Ghulam Ahmad',
      E: 'Shibli Numani',
    },
    correctAnswer: 'A',
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

export const INITIAL_PACKAGES: QuestionPackage[] = [
  {
    id: 'pkg-daulah-usmani',
    name: 'Daulah Usmani',
    subtitle: 'Buku SKI Kemenag Kelas XI MA — Bab I (10 Butir Soal)',
    updatedAt: '2025-01-15',
    questions: INITIAL_DAULAH_USMANI_QUESTIONS,
  },
  {
    id: 'pkg-daulah-safawi',
    name: 'Daulah Safawi',
    subtitle: 'Buku SKI Kemenag Kelas XI MA — Bab II (10 Butir Soal)',
    updatedAt: '2025-01-15',
    questions: INITIAL_DAULAH_SAFAWI_QUESTIONS,
  },
  {
    id: 'pkg-daulah-mughal',
    name: 'Daulah Mughal',
    subtitle: 'Buku SKI Kemenag Kelas XI MA — Bab III (10 Butir Soal)',
    updatedAt: '2025-01-15',
    questions: INITIAL_DAULAH_MUGHAL_QUESTIONS,
  },
  {
    id: 'pkg-pembaruan-islam',
    name: 'Pembaruan Islam Modern',
    subtitle: 'Buku SKI Kemenag Kelas XI MA — Bab IV & V (10 Butir Soal)',
    updatedAt: '2025-01-15',
    questions: INITIAL_PEMBARUAN_ISLAM_QUESTIONS,
  },
];

export const SAMPLE_PASTE_FORMAT_TEXT = `Siapakah pendiri Daulah Usmani? | Usman bin Ertoghrul | Orkhan | Murad I | Bayazid I | A | Usman bin Ertoghrul memproklamasikan Daulah Usmani pada 1299 M. | Hlm. 4
Sultan Muhammad Al-Fatih berhasil membebaskan Konstantinopel pada tahun... | 1450 M | 1453 M | 1481 M | 1512 M | 1520 M | B | Konstantinopel ditaklukkan pada 29 Mei 1453 M (857 H). | Hlm. 14
[Benar/Salah] Ibu kota Daulah Usmani dipindahkan ke Konstantinopel (Istanbul) oleh Sultan Muhammad Al-Fatih pada tahun 1453 M. | Benar | Salah | - | - | A | Setelah penaklukan 29 Mei 1453, Konstantinopel menjadi ibu kota baru bernama Istanbul. | Hlm. 15`;
