import React, { useRef, useState } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  Edit3,
  Shuffle,
  Download,
  Upload,
  FileText,
  RotateCcw,
  ArrowLeft,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Check,
  BookOpen,
  Image as ImageIcon,
  FolderPlus,
  Save,
  X,
  UploadCloud,
  Layers,
  ListOrdered,
} from 'lucide-react';
import {
  AnswerLetter,
  OPTION_STYLES,
  QuestionPackage,
  QuestionType,
  QuizQuestion,
  SAMPLE_PASTE_FORMAT_TEXT,
} from '../config/quizConfig';
import { OttomanStarIcon } from './OttomanDecorations';
import { ConfirmDialog } from './ConfirmDialog';

interface QuestionManagerViewProps {
  packages: QuestionPackage[];
  selectedPackageId: string;
  onSelectPackage: (packageId: string) => void;
  onUpdatePackages: (packages: QuestionPackage[]) => void;
  onRestoreSamplePackages: () => void;
  onBackHome: () => void;
}

export const QuestionManagerView: React.FC<QuestionManagerViewProps> = ({
  packages,
  selectedPackageId,
  onSelectPackage,
  onUpdatePackages,
  onRestoreSamplePackages,
  onBackHome,
}) => {
  const activePackage =
    packages.find((p) => p.id === selectedPackageId) || packages[0] || null;

  // Mobile Tab View: 'questions' or 'packages'
  const [mobileTab, setMobileTab] = useState<'questions' | 'packages'>('questions');

  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [isCreatingNewQuestion, setIsCreatingNewQuestion] = useState(false);
  const [showOptionE, setShowOptionE] = useState(false);

  const [isRenamingPackage, setIsRenamingPackage] = useState(false);
  const [pkgNameDraft, setPkgNameDraft] = useState('');
  const [pkgSubtitleDraft, setPkgSubtitleDraft] = useState('');

  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteText, setPasteText] = useState(SAMPLE_PASTE_FORMAT_TEXT);
  const [pasteFeedback, setPasteFeedback] = useState<string | null>(null);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageUploadInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setStatusBanner(msg);
    window.setTimeout(() => setStatusBanner(null), 2600);
  };

  // --- PACKAGE CRUD ---
  const handleCreatePackage = () => {
    const newId = `pkg-${Date.now()}`;
    const newPkg: QuestionPackage = {
      id: newId,
      name: `Materi Baru (${packages.length + 1})`,
      subtitle: 'Kelas XI Madrasah Aliyah — SKI',
      updatedAt: new Date().toISOString().slice(0, 10),
      questions: [
        {
          id: `q-${Date.now()}`,
          type: 'multiple_choice',
          question: 'Tuliskan pertanyaan pertama untuk paket materi ini...',
          options: {
            A: 'Pilihan Jawaban A',
            B: 'Pilihan Jawaban B',
            C: 'Pilihan Jawaban C',
            D: 'Pilihan Jawaban D',
          },
          correctAnswer: 'A',
          explanation: 'Tuliskan penjelasan singkat di sini.',
          pageReference: 'Hlm. 1',
        },
      ],
    };
    onUpdatePackages([...packages, newPkg]);
    onSelectPackage(newId);
    setPkgNameDraft(newPkg.name);
    setPkgSubtitleDraft(newPkg.subtitle);
    setIsRenamingPackage(true);
    setMobileTab('questions');
    showToast('Paket soal baru berhasil dibuat!');
  };

  const handleDuplicatePackage = () => {
    if (!activePackage) return;
    const newId = `pkg-${Date.now()}`;
    const duplicated: QuestionPackage = {
      ...activePackage,
      id: newId,
      name: `${activePackage.name} (Salinan)`,
      updatedAt: new Date().toISOString().slice(0, 10),
      questions: activePackage.questions.map((q, idx) => ({
        ...q,
        id: `q-${Date.now()}-${idx}`,
        options: { ...q.options },
      })),
    };
    onUpdatePackages([...packages, duplicated]);
    onSelectPackage(newId);
    showToast(`Paket "${activePackage.name}" berhasil diduplikat!`);
  };

  const handleDeletePackage = () => {
    if (!activePackage) return;
    if (packages.length <= 1) {
      showToast('Minimal harus ada 1 paket soal tersimpan.');
      return;
    }
    setConfirmState({
      isOpen: true,
      title: `Hapus Paket "${activePackage.name}"?`,
      message: `Seluruh ${activePackage.questions.length} soal di dalam paket "${activePackage.name}" akan dihapus permanen.`,
      onConfirm: () => {
        const remaining = packages.filter((p) => p.id !== activePackage.id);
        onUpdatePackages(remaining);
        if (remaining[0]) {
          onSelectPackage(remaining[0].id);
        }
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        showToast('Paket soal berhasil dihapus.');
      },
    });
  };

  const handleSavePackageMeta = () => {
    if (!activePackage) return;
    const cleanName = pkgNameDraft.trim() || 'Paket Materi SKI';
    const cleanSub = pkgSubtitleDraft.trim() || 'SKI Kelas XI MA';
    const updated = packages.map((p) =>
      p.id === activePackage.id
        ? {
            ...p,
            name: cleanName,
            subtitle: cleanSub,
            updatedAt: new Date().toISOString().slice(0, 10),
          }
        : p
    );
    onUpdatePackages(updated);
    setIsRenamingPackage(false);
    showToast('Nama paket soal berhasil diperbarui.');
  };

  // --- QUESTION CRUD ---
  const updateActiveQuestions = (newQuestions: QuizQuestion[]) => {
    if (!activePackage) return;
    const updated = packages.map((p) =>
      p.id === activePackage.id
        ? {
            ...p,
            questions: newQuestions,
            updatedAt: new Date().toISOString().slice(0, 10),
          }
        : p
    );
    onUpdatePackages(updated);
  };

  const handleOpenNewQuestion = () => {
    setIsCreatingNewQuestion(true);
    setShowOptionE(false);
    setEditingQuestion({
      id: `q-${Date.now()}`,
      type: 'multiple_choice',
      question: '',
      options: {
        A: '',
        B: '',
        C: '',
        D: '',
        E: '',
      },
      correctAnswer: 'A',
      explanation: '',
      pageReference: 'Hlm. ',
      imageUrl: '',
      imageCaption: '',
    });
  };

  const handleSaveQuestionForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePackage || !editingQuestion) return;

    const cleanQuestionText = editingQuestion.question.trim();
    if (!cleanQuestionText) return;

    const finalQuestion: QuizQuestion = {
      ...editingQuestion,
      question: cleanQuestionText,
      options:
        editingQuestion.type === 'true_false'
          ? { A: 'Benar', B: 'Salah', C: '-', D: '-' }
          : {
              A: editingQuestion.options.A.trim() || 'Pilihan A',
              B: editingQuestion.options.B.trim() || 'Pilihan B',
              C: editingQuestion.options.C.trim() || 'Pilihan C',
              D: editingQuestion.options.D.trim() || 'Pilihan D',
              ...(showOptionE && editingQuestion.options.E?.trim()
                ? { E: editingQuestion.options.E.trim() }
                : {}),
            },
      correctAnswer:
        editingQuestion.type === 'true_false' &&
        editingQuestion.correctAnswer !== 'A' &&
        editingQuestion.correctAnswer !== 'B'
          ? 'A'
          : !showOptionE && editingQuestion.correctAnswer === 'E'
            ? 'A'
            : editingQuestion.correctAnswer,
      explanation: editingQuestion.explanation.trim(),
      pageReference: editingQuestion.pageReference.trim(),
      imageUrl: editingQuestion.imageUrl?.trim() || undefined,
      imageCaption: editingQuestion.imageCaption?.trim() || undefined,
    };

    if (isCreatingNewQuestion) {
      updateActiveQuestions([...activePackage.questions, finalQuestion]);
      showToast('Soal baru berhasil ditambahkan!');
    } else {
      updateActiveQuestions(
        activePackage.questions.map((q) => (q.id === finalQuestion.id ? finalQuestion : q))
      );
      showToast('Perubahan soal berhasil disimpan!');
    }

    setEditingQuestion(null);
    setIsCreatingNewQuestion(false);
  };

  const handleDuplicateQuestion = (q: QuizQuestion) => {
    if (!activePackage) return;
    const copy: QuizQuestion = {
      ...q,
      id: `q-${Date.now()}`,
      question: `${q.question} (Salinan)`,
      options: { ...q.options },
    };
    updateActiveQuestions([...activePackage.questions, copy]);
    showToast('Soal berhasil diduplikat.');
  };

  const handleDeleteQuestion = (q: QuizQuestion, idx: number) => {
    if (!activePackage) return;
    setConfirmState({
      isOpen: true,
      title: `Hapus Soal Nomor ${idx + 1}?`,
      message: `Soal "${q.question}" akan dihapus dari paket "${activePackage.name}".`,
      onConfirm: () => {
        updateActiveQuestions(activePackage.questions.filter((item) => item.id !== q.id));
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        showToast('Soal telah dihapus.');
      },
    });
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    if (!activePackage) return;
    const list = [...activePackage.questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    updateActiveQuestions(list);
  };

  const handleShuffleQuestions = () => {
    if (!activePackage || activePackage.questions.length < 2) return;
    const shuffled = [...activePackage.questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    updateActiveQuestions(shuffled);
    showToast('Urutan soal berhasil diacak!');
  };

  // Drag & drop handlers
  const handleDragStart = (idx: number) => {
    setDraggedIndex(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === idx || !activePackage) return;
    const list = [...activePackage.questions];
    const [moved] = list.splice(draggedIndex, 1);
    list.splice(idx, 0, moved);
    setDraggedIndex(idx);
    updateActiveQuestions(list);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingQuestion) return;

    if (file.size > 3 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setEditingQuestion({
        ...editingQuestion,
        imageUrl: dataUrl,
        imageCaption: editingQuestion.imageCaption || file.name.replace(/\.[^/.]+$/, ''),
      });
      showToast('Gambar berhasil diunggah!');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Export / Import
  const handleExportJson = () => {
    if (!activePackage) return;
    const dataStr = JSON.stringify(activePackage, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeFileName = activePackage.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.href = url;
    a.download = `paket-soal-${safeFileName}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('File JSON paket soal berhasil diunduh.');
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed.questions)) {
          const importedPkg: QuestionPackage = {
            id: `pkg-${Date.now()}`,
            name: parsed.name || file.name.replace(/\.json$/i, ''),
            subtitle: parsed.subtitle || 'Paket Soal Impor JSON',
            updatedAt: new Date().toISOString().slice(0, 10),
            questions: parsed.questions.map((q: Partial<QuizQuestion>, idx: number) => ({
              id: `q-${Date.now()}-${idx}`,
              type: q.type === 'true_false' ? 'true_false' : 'multiple_choice',
              question: String(q.question || `Soal ${idx + 1}`),
              options: {
                A: String(q.options?.A || 'Benar'),
                B: String(q.options?.B || 'Salah'),
                C: String(q.options?.C || '-'),
                D: String(q.options?.D || '-'),
                ...(q.options?.E && q.options.E.trim() !== '' && q.options.E !== '-'
                  ? { E: String(q.options.E) }
                  : {}),
              },
              correctAnswer: (['A', 'B', 'C', 'D', 'E'].includes(String(q.correctAnswer))
                ? q.correctAnswer
                : 'A') as AnswerLetter,
              explanation: String(q.explanation || ''),
              pageReference: String(q.pageReference || ''),
              imageUrl: q.imageUrl ? String(q.imageUrl) : undefined,
              imageCaption: q.imageCaption ? String(q.imageCaption) : undefined,
            })),
          };
          onUpdatePackages([...packages, importedPkg]);
          onSelectPackage(importedPkg.id);
          setMobileTab('questions');
          showToast(
            `Berhasil mengimpor paket "${importedPkg.name}" (${importedPkg.questions.length} soal)!`
          );
        } else {
          showToast('Format file JSON tidak sesuai struktur paket soal.');
        }
      } catch {
        showToast('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Quick Paste Parser
  const handleParsePasteText = () => {
    if (!activePackage) return;
    const lines = pasteText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setPasteFeedback('Masukkan minimal 1 baris soal.');
      return;
    }

    const parsedQuestions: QuizQuestion[] = [];

    lines.forEach((line, idx) => {
      const cleanLine = line.replace(/^\d+\.\s*/, '');
      const parts = cleanLine.split('|').map((p) => p.trim());
      if (parts.length < 2) return;

      const isExplicitTrueFalse = /^\[benar\/salah\]/i.test(parts[0]);
      const questionText = parts[0].replace(/^\[benar\/salah\]\s*/i, '').trim();

      if (parts.length >= 6 && !parts[1].toLowerCase().startsWith('jawaban:')) {
        const optA = parts[1].replace(/^A\.\s*/i, '').trim();
        const optB = parts[2].replace(/^B\.\s*/i, '').trim();
        const optC = parts[3].replace(/^C\.\s*/i, '').trim();
        const optD = parts[4].replace(/^D\.\s*/i, '').trim();

        let optE: string | undefined = undefined;
        let rawAns = '';
        let explanation = '';
        let pageRef = '';
        let imageUrl: string | undefined = undefined;

        if (
          parts[5].toUpperCase().startsWith('JAWABAN:') ||
          ['A', 'B', 'C', 'D', 'E', 'BENAR', 'SALAH'].includes(parts[5].toUpperCase())
        ) {
          rawAns = parts[5].replace(/^jawaban\s*:\s*/i, '').trim().toUpperCase();
          explanation = (parts[6] || '').replace(/^penjelasan\s*:\s*/i, '').trim();
          pageRef = (parts[7] || '').trim();
          imageUrl = parts[8] ? parts[8].trim() : undefined;
        } else if (parts.length >= 7) {
          optE = parts[5].replace(/^E\.\s*/i, '').trim();
          rawAns = parts[6].replace(/^jawaban\s*:\s*/i, '').trim().toUpperCase();
          explanation = (parts[7] || '').replace(/^penjelasan\s*:\s*/i, '').trim();
          pageRef = (parts[8] || '').trim();
          imageUrl = parts[9] ? parts[9].trim() : undefined;
        } else {
          rawAns = parts[5].replace(/^jawaban\s*:\s*/i, '').trim().toUpperCase();
        }

        const isTF =
          isExplicitTrueFalse ||
          (optA.toLowerCase() === 'benar' && optB.toLowerCase() === 'salah');

        let ansLetter: AnswerLetter = 'A';
        if (rawAns === 'BENAR') ansLetter = 'A';
        else if (rawAns === 'SALAH') ansLetter = 'B';
        else if (['A', 'B', 'C', 'D', 'E'].includes(rawAns)) ansLetter = rawAns as AnswerLetter;

        parsedQuestions.push({
          id: `q-paste-${Date.now()}-${idx}`,
          type: isTF ? 'true_false' : 'multiple_choice',
          question: questionText,
          options: isTF
            ? { A: 'Benar', B: 'Salah', C: '-', D: '-' }
            : { A: optA, B: optB, C: optC, D: optD, ...(optE ? { E: optE } : {}) },
          correctAnswer: ansLetter,
          explanation,
          pageReference: pageRef,
          imageUrl: imageUrl || undefined,
        });
      } else {
        let ansLetter: AnswerLetter = 'A';
        let explanation = '';
        let pageRef = '';

        parts.slice(1).forEach((segment) => {
          if (/^jawaban\s*:/i.test(segment)) {
            const val = segment.replace(/^jawaban\s*:/i, '').trim().toUpperCase();
            if (val === 'SALAH' || val === 'B') ansLetter = 'B';
            else ansLetter = 'A';
          } else if (/^penjelasan\s*:/i.test(segment)) {
            explanation = segment.replace(/^penjelasan\s*:/i, '').trim();
          } else if (/^hlm/i.test(segment)) {
            pageRef = segment.trim();
          }
        });

        parsedQuestions.push({
          id: `q-paste-${Date.now()}-${idx}`,
          type: 'true_false',
          question: questionText,
          options: { A: 'Benar', B: 'Salah', C: '-', D: '-' },
          correctAnswer: ansLetter,
          explanation,
          pageReference: pageRef,
        });
      }
    });

    if (parsedQuestions.length === 0) {
      setPasteFeedback(
        'Format teks belum dikenali. Gunakan pemisah tanda pipa (|) sesuai contoh.'
      );
      return;
    }

    updateActiveQuestions([...activePackage.questions, ...parsedQuestions]);
    setShowPasteModal(false);
    setPasteFeedback(null);
    showToast(`Berhasil menambahkan ${parsedQuestions.length} soal!`);
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8 animate-fade-slide-up">
      {/* Top Header */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705]">
            <OttomanStarIcon className="h-4 w-4" />
            <span>EDITOR MATERI GURU SKI</span>
          </div>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FFFDF7]">
            Kelola Paket & Daftar Soal
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-300">
            Materi dan soal bergambar dapat disesuaikan bebas oleh guru.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {statusBanner && (
            <div className="flex items-center gap-1.5 rounded-xl bg-[#059669] px-3 py-1.5 text-xs font-bold text-white shadow">
              <Check className="h-3.5 w-3.5" />
              <span>{statusBanner}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              setConfirmState({
                isOpen: true,
                title: 'Kembalikan Semua Soal Contoh Awal?',
                message:
                  'Paket soal contoh ("Daulah Usmani", "Daulah Safawi", "Daulah Mughal") akan dikembalikan ke kondisi awal.',
                onConfirm: () => {
                  onRestoreSamplePackages();
                  setConfirmState((prev) => ({ ...prev, isOpen: false }));
                  showToast('Soal contoh awal berhasil dikembalikan!');
                },
              })
            }
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/15 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Kembalikan Soal Contoh</span>
            <span className="sm:hidden">Reset Contoh</span>
          </button>

          <button
            type="button"
            onClick={onBackHome}
            className="flex items-center gap-1.5 rounded-xl bg-[#F2B705] px-4 py-2 text-xs font-extrabold text-[#0F1B3D] shadow-lg hover:bg-[#facc15] transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali</span>
          </button>
        </div>
      </div>

      {/* MOBILE SEGMENTED CONTROL: 'Daftar Soal' vs 'Pilih Paket' */}
      <div className="flex sm:hidden rounded-xl bg-[#0F1B3D] p-1 border border-white/10 mb-4">
        <button
          type="button"
          onClick={() => setMobileTab('questions')}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-colors ${
            mobileTab === 'questions'
              ? 'bg-[#F2B705] text-[#0F1B3D] shadow'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <ListOrdered className="h-3.5 w-3.5" />
          <span>Daftar Soal ({activePackage?.questions.length || 0})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('packages')}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-colors ${
            mobileTab === 'packages'
              ? 'bg-[#F2B705] text-[#0F1B3D] shadow'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Paket Soal ({packages.length})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12">
        {/* LEFT SIDEBAR: Packages */}
        <aside className={`${mobileTab === 'packages' ? 'block' : 'hidden'} sm:block space-y-4 lg:col-span-4`}>
          <div className="rounded-2xl border border-white/15 bg-[#162654]/90 p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-[#FFFDF7]">Daftar Paket Soal</h2>
              <button
                type="button"
                onClick={handleCreatePackage}
                className="flex items-center gap-1 rounded-xl bg-[#F2B705] px-2.5 py-1.5 text-xs font-extrabold text-[#0F1B3D] hover:bg-[#facc15] transition-colors whitespace-nowrap"
              >
                <FolderPlus className="h-3.5 w-3.5" />
                <span>Paket Baru</span>
              </button>
            </div>

            <div className="space-y-2">
              {packages.map((pkg) => {
                const isSelected = pkg.id === activePackage?.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => {
                      onSelectPackage(pkg.id);
                      setIsRenamingPackage(false);
                      setMobileTab('questions');
                    }}
                    className={`w-full rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-[#F2B705] bg-[#0F1B3D] shadow-md'
                        : 'border-white/10 bg-[#0F1B3D]/45 hover:bg-[#0F1B3D]/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm sm:text-base text-[#FFFDF7] truncate">{pkg.name}</span>
                      <span className="font-mono-tabular text-xs font-extrabold text-[#F2B705] shrink-0">
                        {pkg.questions.length} Soal
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[11px] sm:text-xs text-slate-300">{pkg.subtitle}</p>
                  </button>
                );
              })}
            </div>

            {activePackage && (
              <div className="border-t border-white/10 pt-3.5 space-y-2.5">
                <div className="text-xs font-semibold text-slate-300">
                  Aksi Paket &ldquo;{activePackage.name}&rdquo;:
                </div>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPkgNameDraft(activePackage.name);
                      setPkgSubtitleDraft(activePackage.subtitle);
                      setIsRenamingPackage(true);
                      setMobileTab('questions');
                    }}
                    className="flex items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-[#FFFDF7] hover:bg-white/15"
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>Ubah Nama</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDuplicatePackage}
                    className="flex items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-[#FFFDF7] hover:bg-white/15"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Duplikat</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDeletePackage}
                    className="flex items-center justify-center gap-1 rounded-xl border border-[#C8102E]/60 bg-[#C8102E]/20 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-[#FCA5A5] hover:bg-[#C8102E] hover:text-white"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            )}

            <div className="border-t border-white/10 pt-3 space-y-2">
              <div className="text-xs font-semibold text-slate-300">Impor & Ekspor:</div>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasteModal(true)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#F2B705]/50 bg-[#F2B705]/15 py-2 text-xs font-bold text-[#F2B705] hover:bg-[#F2B705]/25"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Impor Teks Tempel (Format Pipa)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2 text-xs font-bold text-slate-200 hover:bg-white/15"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Ekspor .JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2 text-xs font-bold text-slate-200 hover:bg-white/15"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Impor .JSON</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportJsonFile}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT: Questions List */}
        <div className={`${mobileTab === 'questions' ? 'block' : 'hidden'} sm:block space-y-4 lg:col-span-8`}>
          {activePackage ? (
            <>
              <div className="rounded-2xl border border-white/15 bg-[#162654]/90 p-4 sm:p-5 shadow-xl">
                {isRenamingPackage ? (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-[#F2B705]">
                      UBAH IDENTITAS PAKET SOAL
                    </div>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Judul Paket</label>
                        <input
                          type="text"
                          value={pkgNameDraft}
                          onChange={(e) => setPkgNameDraft(e.target.value)}
                          className="w-full rounded-xl border border-white/20 bg-[#0F1B3D] px-3 py-2 text-sm font-bold text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">
                          Subjudul / Bab Rujukan
                        </label>
                        <input
                          type="text"
                          value={pkgSubtitleDraft}
                          onChange={(e) => setPkgSubtitleDraft(e.target.value)}
                          className="w-full rounded-xl border border-white/20 bg-[#0F1B3D] px-3 py-2 text-sm text-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsRenamingPackage(false)}
                        className="rounded-xl border border-white/20 px-3.5 py-1.5 text-xs font-bold text-slate-200"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleSavePackageMeta}
                        className="rounded-xl bg-[#F2B705] px-4 py-1.5 text-xs font-extrabold text-[#0F1B3D]"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-[#FFFDF7]">
                        {activePackage.name}
                      </h2>
                      <p className="text-xs text-slate-300">
                        {activePackage.subtitle} · {activePackage.questions.length} butir soal
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleShuffleQuestions}
                        disabled={activePackage.questions.length < 2}
                        className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-bold text-[#FFFDF7] hover:bg-white/15 disabled:opacity-40 whitespace-nowrap"
                      >
                        <Shuffle className="h-3.5 w-3.5 text-[#F2B705]" />
                        <span>Acak Soal</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenNewQuestion}
                        className="flex items-center gap-1.5 rounded-xl bg-[#10B981] px-3.5 py-1.5 text-xs font-extrabold text-[#0F1B3D] shadow-md hover:bg-[#34D399] whitespace-nowrap"
                      >
                        <Plus className="h-3.5 w-3.5 stroke-[3]" />
                        <span>Tambah Soal</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {activePackage.questions.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-white/20 bg-[#162654]/50 p-8 text-center space-y-3">
                  <p className="text-base sm:text-lg font-bold text-[#FFFDF7]">
                    Belum Ada Soal di Paket &ldquo;{activePackage.name}&rdquo;
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Klik tombol &ldquo;Tambah Soal&rdquo; untuk mengisi soal baru.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenNewQuestion}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#F2B705] px-4 py-2 text-sm font-extrabold text-[#0F1B3D]"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Buat Soal Pertama</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {activePackage.questions.map((q, index) => (
                    <div
                      key={q.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`group rounded-xl sm:rounded-2xl border bg-[#162654]/90 p-3 sm:p-4 shadow-lg transition-all ${
                        draggedIndex === index
                          ? 'border-[#F2B705] opacity-60 scale-[0.99]'
                          : 'border-white/15 hover:border-white/30'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-3">
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <div className="flex flex-col items-center gap-0.5 pt-0.5 text-slate-400">
                            <span title="Geser urutan" className="hidden sm:inline-flex">
                              <GripVertical className="h-4 w-4 cursor-grab active:cursor-grabbing hover:text-[#F2B705]" />
                            </span>
                            <span className="font-mono-tabular text-xs font-extrabold text-[#F2B705]">
                              #{index + 1}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
                              <span className="font-bold text-[#F2B705]">
                                {q.type === 'true_false' ? 'Benar/Salah' : 'Pilihan Ganda'}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="font-bold text-[#34D399]">
                                Kunci: {q.correctAnswer}
                              </span>
                              {q.pageReference && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="inline-flex items-center gap-1 text-slate-300">
                                    <BookOpen className="h-3 w-3 text-[#F2B705]" />
                                    {q.pageReference}
                                  </span>
                                </>
                              )}
                              {q.imageUrl && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="inline-flex items-center gap-1 font-bold text-[#6EE7B7]">
                                    <ImageIcon className="h-3 w-3" />
                                    <span>Foto</span>
                                  </span>
                                </>
                              )}
                            </div>

                            <h3 className="text-sm sm:text-base font-bold text-[#FFFDF7] leading-snug">
                              {q.question}
                            </h3>

                            {q.imageUrl && (
                              <div className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-[#0F1B3D] p-1.5">
                                <img
                                  src={q.imageUrl}
                                  alt="Pratinjau Gambar Soal"
                                  className="h-10 w-14 rounded object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                                <span className="text-[11px] text-slate-300">
                                  {q.imageCaption || 'Gambar terlampir'}
                                </span>
                              </div>
                            )}

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-xs">
                              {(['A', 'B', 'C', 'D', 'E'] as AnswerLetter[]).map((letter) => {
                                if (
                                  q.type === 'true_false' &&
                                  (letter === 'C' || letter === 'D' || letter === 'E')
                                ) {
                                  return null;
                                }
                                if (
                                  letter === 'E' &&
                                  (!q.options.E || q.options.E.trim() === '' || q.options.E === '-')
                                ) {
                                  return null;
                                }
                                const isKey = q.correctAnswer === letter;
                                return (
                                  <div
                                    key={letter}
                                    className={`truncate rounded border px-2 py-1 ${
                                      isKey
                                        ? 'border-[#10B981] bg-[#064E3B]/60 font-bold text-[#6EE7B7]'
                                        : 'border-white/10 bg-[#0F1B3D]/60 text-slate-300'
                                    }`}
                                  >
                                    <span className="font-mono-tabular font-extrabold mr-1">
                                      {letter}.
                                    </span>
                                    {q.options[letter]}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Question Action Buttons */}
                        <div className="flex items-center justify-end gap-1 shrink-0 border-t border-white/10 pt-2 sm:border-t-0 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => handleMoveQuestion(index, 'up')}
                            disabled={index === 0}
                            title="Naik"
                            className="rounded p-1 text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveQuestion(index, 'down')}
                            disabled={index === activePackage.questions.length - 1}
                            title="Turun"
                            className="rounded p-1 text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreatingNewQuestion(false);
                              setShowOptionE(
                                Boolean(
                                  q.options?.E &&
                                    q.options.E.trim() !== '' &&
                                    q.options.E !== '-'
                                )
                              );
                              setEditingQuestion({ ...q, options: { ...q.options } });
                            }}
                            className="rounded bg-white/10 px-2 py-1 text-xs font-bold text-[#F2B705] hover:bg-white/20"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicateQuestion(q)}
                            className="rounded p-1 text-slate-300 hover:bg-white/10 hover:text-white"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(q, index)}
                            className="rounded p-1 text-[#FCA5A5] hover:bg-[#C8102E] hover:text-white"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* MODAL EDITOR SOAL */}
      {editingQuestion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 backdrop-blur-xs animate-fade-slide-up"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleSaveQuestionForm}
            className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#F2B705]/40 bg-[#162654] p-4 sm:p-6 shadow-2xl space-y-3 sm:space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#FFFDF7]">
                {isCreatingNewQuestion ? 'Tambah Soal Baru' : 'Edit Butir Soal'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-300">Tipe Pertanyaan:</span>
              <div className="flex rounded-xl bg-[#0F1B3D] p-1 border border-white/10">
                {(
                  [
                    { id: 'multiple_choice', label: 'Pilihan Ganda (A–E)' },
                    { id: 'true_false', label: 'Benar / Salah' },
                  ] as { id: QuestionType; label: string }[]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setEditingQuestion({
                        ...editingQuestion,
                        type: tab.id,
                        options:
                          tab.id === 'true_false'
                            ? { A: 'Benar', B: 'Salah', C: '-', D: '-' }
                            : {
                                A:
                                  editingQuestion.options.A === 'Benar'
                                    ? ''
                                    : editingQuestion.options.A,
                                B:
                                  editingQuestion.options.B === 'Salah'
                                    ? ''
                                    : editingQuestion.options.B,
                                C:
                                  editingQuestion.options.C === '-'
                                    ? ''
                                    : editingQuestion.options.C,
                                D:
                                  editingQuestion.options.D === '-'
                                    ? ''
                                    : editingQuestion.options.D,
                              },
                        correctAnswer:
                          tab.id === 'true_false' &&
                          editingQuestion.correctAnswer !== 'A' &&
                          editingQuestion.correctAnswer !== 'B'
                            ? 'A'
                            : editingQuestion.correctAnswer,
                      })
                    }
                    className={`rounded-lg px-2.5 sm:px-3.5 py-1 text-xs font-bold transition-colors ${
                      editingQuestion.type === tab.id
                        ? 'bg-[#F2B705] text-[#0F1B3D]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Teks Pertanyaan *
              </label>
              <textarea
                required
                rows={2}
                value={editingQuestion.question}
                onChange={(e) =>
                  setEditingQuestion({ ...editingQuestion, question: e.target.value })
                }
                placeholder="Masukkan kalimat pertanyaan..."
                className="w-full rounded-xl border border-white/20 bg-[#0F1B3D] p-2.5 sm:p-3 text-sm sm:text-base font-bold text-[#FFFDF7] focus:border-[#F2B705] focus:outline-none"
              />
            </div>

            {/* SOAL BERGAMBAR: URL & File Upload */}
            <div className="rounded-xl border border-[#F2B705]/40 bg-[#0F1B3D] p-3 sm:p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-[#F2B705]" />
                  <span className="text-xs font-bold text-[#F2B705]">
                    Gambar Pendukung Soal
                  </span>
                </div>
                {editingQuestion.imageUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setEditingQuestion({
                        ...editingQuestion,
                        imageUrl: undefined,
                        imageCaption: undefined,
                      })
                    }
                    className="text-[11px] font-bold text-[#FF6B81] hover:underline"
                  >
                    Hapus Gambar
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    Cara 1: Masukkan URL Gambar Web
                  </label>
                  <input
                    type="url"
                    value={editingQuestion.imageUrl?.startsWith('data:') ? '' : editingQuestion.imageUrl || ''}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, imageUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full rounded-lg border border-white/20 bg-black/30 px-2.5 py-1.5 text-xs text-white focus:border-[#F2B705] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    Cara 2: Unggah File dari Perangkat
                  </label>
                  <button
                    type="button"
                    onClick={() => imageUploadInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#F2B705]/50 bg-[#F2B705]/15 py-1.5 text-xs font-bold text-[#F2B705] hover:bg-[#F2B705]/25"
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>Pilih Gambar (JPG/PNG)</span>
                  </button>
                  <input
                    ref={imageUploadInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-0.5">
                  Keterangan Singkat Gambar (Opsional):
                </label>
                <input
                  type="text"
                  value={editingQuestion.imageCaption || ''}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, imageCaption: e.target.value })
                  }
                  placeholder="Contoh: Peta Penaklukan Konstantinopel"
                  className="w-full rounded-lg border border-white/20 bg-black/30 px-2.5 py-1 text-xs text-white focus:border-[#F2B705] focus:outline-none"
                />
              </div>

              {editingQuestion.imageUrl && (
                <div className="flex items-center gap-2.5 rounded-lg border border-white/15 bg-black/40 p-2">
                  <img
                    src={editingQuestion.imageUrl}
                    alt="Pratinjau Soal"
                    className="h-12 w-16 rounded object-contain bg-black/50"
                  />
                  <span className="text-xs text-[#34D399] font-semibold">
                    ✓ Gambar terpasang & siap ditayangkan
                  </span>
                </div>
              )}
            </div>

            {/* Options */}
            {editingQuestion.type === 'multiple_choice' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="block text-xs font-bold text-slate-200">
                    Pilihan Jawaban & Kunci:
                  </span>
                  <div className="flex items-center gap-1 rounded-lg border border-white/15 bg-[#0F1B3D] p-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowOptionE(false);
                        if (editingQuestion.correctAnswer === 'E') {
                          setEditingQuestion({
                            ...editingQuestion,
                            correctAnswer: 'A',
                            options: { ...editingQuestion.options, E: '' },
                          });
                        }
                      }}
                      className={`rounded px-2.5 py-0.5 text-[11px] font-bold transition-colors ${
                        !showOptionE
                          ? 'bg-[#F2B705] text-[#0F1B3D]'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      4 Opsi (A–D)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowOptionE(true);
                        setEditingQuestion({
                          ...editingQuestion,
                          options: {
                            ...editingQuestion.options,
                            E: editingQuestion.options.E || '',
                          },
                        });
                      }}
                      className={`rounded px-2.5 py-0.5 text-[11px] font-bold transition-colors ${
                        showOptionE
                          ? 'bg-[#8B5CF6] text-white'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      5 Opsi (A–E)
                    </button>
                  </div>
                </div>

                <div
                  className={`grid grid-cols-1 gap-2 ${
                    showOptionE ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'
                  }`}
                >
                  {(showOptionE
                    ? (['A', 'B', 'C', 'D', 'E'] as AnswerLetter[])
                    : (['A', 'B', 'C', 'D'] as AnswerLetter[])
                  ).map((letter) => {
                    const isKey = editingQuestion.correctAnswer === letter;
                    const style = OPTION_STYLES[letter];
                    return (
                      <div
                        key={letter}
                        className={`rounded-xl border p-2 sm:p-2.5 ${
                          isKey
                            ? 'border-[#10B981] bg-[#064E3B]/40'
                            : 'border-white/15 bg-[#0F1B3D]'
                        }`}
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <span
                            className="font-mono-tabular text-xs font-extrabold"
                            style={{ color: style.hex }}
                          >
                            Pilihan {letter}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingQuestion({ ...editingQuestion, correctAnswer: letter })
                            }
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                              isKey
                                ? 'bg-[#10B981] text-[#0F1B3D]'
                                : 'bg-white/10 text-slate-300 hover:bg-white/20'
                            }`}
                          >
                            {isKey ? 'Kunci ✓' : 'Pilih Kunci'}
                          </button>
                        </div>
                        <input
                          type="text"
                          required={letter !== 'E' || showOptionE}
                          value={editingQuestion.options[letter] || ''}
                          onChange={(e) =>
                            setEditingQuestion({
                              ...editingQuestion,
                              options: { ...editingQuestion.options, [letter]: e.target.value },
                            })
                          }
                          placeholder={`Pilihan ${letter}...`}
                          className="w-full rounded border border-white/15 bg-black/30 px-2 py-1 text-xs sm:text-sm font-semibold text-white focus:border-[#F2B705] focus:outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <span className="block text-xs font-bold text-slate-200">
                  Kunci Jawaban Benar / Salah:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { letter: 'A' as AnswerLetter, label: 'A — BENAR' },
                    { letter: 'B' as AnswerLetter, label: 'B — SALAH' },
                  ].map((item) => (
                    <button
                      key={item.letter}
                      type="button"
                      onClick={() =>
                        setEditingQuestion({ ...editingQuestion, correctAnswer: item.letter })
                      }
                      className={`rounded-xl border py-2.5 text-xs sm:text-sm font-extrabold transition-all ${
                        editingQuestion.correctAnswer === item.letter
                          ? 'border-[#10B981] bg-[#059669] text-white shadow-lg'
                          : 'border-white/15 bg-[#0F1B3D] text-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-200 mb-0.5">
                  Penjelasan / Pembahasan Singkat
                </label>
                <input
                  type="text"
                  value={editingQuestion.explanation}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
                  }
                  placeholder="Penjelasan ringkas..."
                  className="w-full rounded-xl border border-white/20 bg-[#0F1B3D] px-2.5 py-1.5 text-xs sm:text-sm text-white focus:border-[#F2B705] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-0.5">
                  Rujukan Halaman
                </label>
                <input
                  type="text"
                  value={editingQuestion.pageReference}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, pageReference: e.target.value })
                  }
                  placeholder="Contoh: Hlm. 15"
                  className="w-full rounded-xl border border-white/20 bg-[#0F1B3D] px-2.5 py-1.5 text-xs sm:text-sm text-white focus:border-[#F2B705] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-white/15 pt-3">
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="rounded-xl border border-white/20 px-3.5 py-1.5 text-xs font-bold text-slate-200"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-[#F2B705] px-4 py-1.5 text-xs font-extrabold text-[#0F1B3D] shadow-lg hover:bg-[#facc15]"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Simpan Soal</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL IMPOR TEKS TEMPEL */}
      {showPasteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 backdrop-blur-xs animate-fade-slide-up"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-3xl rounded-2xl border border-[#F2B705]/40 bg-[#162654] p-4 sm:p-6 shadow-2xl space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#FFFDF7]">
                  Impor Soal dari Teks Tempel
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300">
                  Gunakan pemisah tanda garis tegak ( | ).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <textarea
              rows={6}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-[#0F1B3D] p-2.5 font-mono-tabular text-xs leading-relaxed text-[#FFFDF7] focus:border-[#F2B705] focus:outline-none"
            />

            {pasteFeedback && (
              <p className="text-xs font-bold text-[#FCA5A5]">{pasteFeedback}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="rounded-xl border border-white/20 px-3.5 py-1.5 text-xs font-bold text-slate-200"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleParsePasteText}
                className="rounded-xl bg-[#F2B705] px-4 py-1.5 text-xs font-extrabold text-[#0F1B3D] hover:bg-[#facc15]"
              >
                Tambahkan Soal
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
