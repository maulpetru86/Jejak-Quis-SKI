import { GradeLevel, QuestionPackage } from '../config/quizConfig';
import { KELAS_X_PACKAGES } from './kelasXPackages';
import { KELAS_XI_PACKAGES } from './kelasXIPackages';
import { KELAS_XII_PACKAGES } from './kelasXIIPackages';

// ==========================================
// DAFTAR LENGKAP 16 PAKET SOAL RESMI SKI KEMENAG RI
// Mengacu Kurikulum Resmi & Buku Siswa Jejak SKI
// Kelas X (6 Bab), Kelas XI (5 Bab), Kelas XII (5 Bab)
// ==========================================
export const ALL_SKI_PACKAGES: QuestionPackage[] = [
  ...KELAS_X_PACKAGES,
  ...KELAS_XI_PACKAGES,
  ...KELAS_XII_PACKAGES,
];

export const getPackagesByGrade = (grade: 'ALL' | GradeLevel): QuestionPackage[] => {
  if (grade === 'ALL') return ALL_SKI_PACKAGES;
  return ALL_SKI_PACKAGES.filter((p) => p.gradeLevel === grade);
};

export const getPackageById = (id: string): QuestionPackage | undefined => {
  return ALL_SKI_PACKAGES.find((p) => p.id === id);
};
