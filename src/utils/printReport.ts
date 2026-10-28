import { AnswerLetter, GradeLevel, SoloGameState } from '../config/quizConfig';

export interface ReportPrintData {
  packageName: string;
  gradeLevel?: GradeLevel;
  totalQuestions: number;
  soloState: SoloGameState;
  percentage: number;
  predikatArab: string;
  predikatIndo: string;
  avgTimeSeconds: string;
}

/**
 * Generate formatted Indonesian date string: e.g. "Kamis, 8 Oktober 2026, 16:00 WIB"
 */
export function getFormattedDate(): string {
  const now = new Date();
  return now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) + ' WIB';
}

/**
 * Generate official, prestigious, printable HTML document for Madrasah Aliyah SKI student evaluation.
 * Complete with official Islamic Madrasah emblem, Kemenag header structure, certified achievement scorecard,
 * item-by-item pedagogical analysis table, formal signature block, and document verification seal.
 */
export function generateOfficialReportHtml(data: ReportPrintData): string {
  const {
    packageName,
    gradeLevel,
    totalQuestions,
    soloState,
    percentage,
    predikatArab,
    predikatIndo,
    avgTimeSeconds,
  } = data;

  const dateString = getFormattedDate();
  const studentName = soloState.studentName?.trim() || 'Siswa Peserta Kuis';
  const gradeLabel = gradeLevel ? `Kelas ${gradeLevel} Madrasah Aliyah` : 'Madrasah Aliyah';
  const isPassed = percentage >= 75;
  const docRefId = `SKI-MA-${Date.now().toString(36).toUpperCase()}`;

  const rowsHtml = soloState.answers
    .map((ans, idx) => {
      const isCorrect = ans.isCorrect;
      const statusBadge = isCorrect
        ? `<span style="display:inline-block;padding:2px 8px;font-size:10px;font-weight:800;color:#065f46;background:#d1fae5;border-radius:4px;border:1px solid #10b981;letter-spacing:0.5px;">✓ BENAR</span>`
        : `<span style="display:inline-block;padding:2px 8px;font-size:10px;font-weight:800;color:#991b1b;background:#fee2e2;border-radius:4px;border:1px solid #f87171;letter-spacing:0.5px;">✗ SALAH</span>`;

      const studentAnsText =
        ans.selectedAnswer === '-'
          ? '<i style="color:#64748b;">Tidak Dijawab (Waktu Habis)</i>'
          : `<strong>${ans.selectedAnswer}</strong> — ${escapeHtml(ans.options[ans.selectedAnswer as AnswerLetter] || '-')}`;

      const correctAnsText = `<strong>${ans.correctAnswer}</strong> — ${escapeHtml(ans.options[ans.correctAnswer] || '-')}`;

      return `
        <tr style="border-bottom: 1px solid #e2e8f0; page-break-inside: avoid; background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
          <td style="padding: 10px 8px; text-align: center; font-weight: 700; vertical-align: top; color: #475569; font-size: 12px;">${idx + 1}</td>
          <td style="padding: 10px 12px; vertical-align: top;">
            <div style="font-weight: 700; color: #0f172a; margin-bottom: 6px; font-size: 12.5px; line-height: 1.5;">${escapeHtml(ans.questionText)}</div>
            ${
              ans.explanation
                ? `<div style="font-size: 11px; color: #334155; background: #f1f5f9; padding: 6px 10px; border-left: 3px solid #0f172a; margin-top: 6px; border-radius: 2px; line-height: 1.5;">
                    <strong style="color: #0f172a;">Pembahasan:</strong> ${escapeHtml(ans.explanation)}
                   </div>`
                : ''
            }
            ${
              ans.pageReference
                ? `<div style="font-size: 10.5px; color: #64748b; margin-top: 4px;">
                    📖 <em>Rujukan Resmi: ${escapeHtml(ans.pageReference)}</em>
                   </div>`
                : ''
            }
          </td>
          <td style="padding: 10px 8px; vertical-align: top; font-size: 11.5px; color: ${isCorrect ? '#065f46' : '#991b1b'}; line-height: 1.4;">
            ${studentAnsText}
          </td>
          <td style="padding: 10px 8px; vertical-align: top; font-size: 11.5px; color: #047857; line-height: 1.4;">
            ${correctAnsText}
          </td>
          <td style="padding: 10px 8px; text-align: center; vertical-align: top;">
            ${statusBadge}
          </td>
        </tr>
      `;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Rapor Asesmen SKI - ${escapeHtml(studentName)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 10mm 12mm 12mm 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 12px;
      line-height: 1.5;
    }
    .print-bar {
      background: #0f172a;
      color: #ffffff;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 999;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.15);
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    }
    .print-btn {
      background: #f59e0b;
      color: #0f172a;
      border: none;
      font-weight: 700;
      padding: 7px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .print-btn:hover {
      background: #d97706;
    }
    .page-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 16px 20px 28px;
      background: #ffffff;
    }
    
    /* KOP RESMI MADRASAH ALIYAH */
    .kop-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 8px;
    }
    .kop-logo {
      width: 66px;
      height: 66px;
      flex-shrink: 0;
    }
    .kop-content {
      flex: 1;
      text-align: center;
    }
    .kop-instansi {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #334155;
      margin-bottom: 1px;
    }
    .kop-kemenag {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #475569;
      margin-bottom: 2px;
    }
    .kop-madrasah {
      font-size: 15.5px;
      font-weight: 900;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .kop-judul {
      font-size: 12px;
      font-weight: 800;
      color: #047857;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .kop-sub {
      font-size: 10px;
      color: #64748b;
      margin-top: 1px;
      font-style: italic;
    }
    .kop-divider {
      margin-top: 6px;
      margin-bottom: 12px;
      border-top: 2.5px solid #0f172a;
      border-bottom: 1px solid #d97706;
      height: 4px;
    }

    /* REGISTRATION / VERIFICATION BAR */
    .doc-meta-strip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #64748b;
      margin-bottom: 12px;
      padding: 0 2px;
    }
    .doc-meta-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 2px 8px;
      border-radius: 4px;
      font-family: monospace;
      font-weight: 700;
      color: #334155;
    }

    /* DATA SISWA CARD */
    .student-card {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      margin-bottom: 14px;
      overflow: hidden;
    }
    .student-card-header {
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 6px 12px;
      font-size: 10.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #334155;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .student-card-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 8px 12px;
      gap: 6px 16px;
      font-size: 11.5px;
    }
    .data-row {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }
    .data-label {
      width: 110px;
      flex-shrink: 0;
      color: #64748b;
      font-weight: 600;
    }
    .data-sep {
      color: #94a3b8;
      margin-right: 4px;
    }
    .data-val {
      color: #0f172a;
      font-weight: 700;
      flex: 1;
    }

    /* SCORECARD & CERTIFICATE PANEL */
    .scorecard-panel {
      border: 1.5px solid #d97706;
      border-radius: 8px;
      background: #fffcf4;
      padding: 12px 16px;
      margin-bottom: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .scorecard-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      border-bottom: 1px dashed #f59e0b;
      padding-bottom: 12px;
      margin-bottom: 10px;
    }
    .score-medallion {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .score-circle {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 3px solid #d97706;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(217, 119, 6, 0.2);
    }
    .score-number {
      font-size: 26px;
      font-weight: 900;
      color: #0f172a;
      line-height: 1;
    }
    .score-sub {
      font-size: 8.5px;
      font-weight: 800;
      color: #d97706;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .score-verdict {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .status-kkm-badge {
      display: inline-block;
      align-self: flex-start;
      font-size: 10px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 4px;
      letter-spacing: 0.5px;
      background: ${isPassed ? '#d1fae5' : '#fee2e2'};
      color: ${isPassed ? '#065f46' : '#991b1b'};
      border: 1px solid ${isPassed ? '#10b981' : '#f87171'};
    }
    .predikat-section {
      text-align: right;
    }
    .predikat-arab {
      font-family: 'Amiri', 'Traditional Arabic', serif;
      font-size: 21px;
      font-weight: 700;
      color: #1e3a8a;
      line-height: 1.2;
    }
    .predikat-indo {
      font-size: 12px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 1px;
    }
    .predikat-desc {
      font-size: 10.5px;
      color: #475569;
      margin-top: 1px;
    }

    /* STATS 4-GRID */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      text-align: center;
    }
    .stat-pill {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 4px;
    }
    .stat-val {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
    }
    .stat-label {
      font-size: 9.5px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      margin-top: 1px;
      letter-spacing: 0.4px;
    }

    /* QUESTION TABLE */
    .table-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #0f172a;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .soal-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
    }
    .soal-table th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      font-size: 11px;
      padding: 8px 10px;
      text-align: left;
      letter-spacing: 0.5px;
    }

    /* TANDA TANGAN */
    .ttd-wrapper {
      margin-top: 24px;
      page-break-inside: avoid;
    }
    .ttd-date-line {
      text-align: right;
      font-size: 11.5px;
      color: #334155;
      margin-bottom: 10px;
      padding-right: 12px;
    }
    .ttd-columns {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      padding: 0 16px;
    }
    .ttd-card {
      width: 250px;
      text-align: center;
      font-size: 11.5px;
    }
    .ttd-role {
      font-weight: 700;
      color: #0f172a;
      margin-top: 1px;
    }
    .ttd-space {
      height: 65px;
      position: relative;
    }
    .ttd-seal-placeholder {
      position: absolute;
      left: 20px;
      top: 10px;
      width: 50px;
      height: 50px;
      border: 1px dashed #cbd5e1;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      color: #94a3b8;
    }
    .ttd-name {
      font-weight: 800;
      color: #0f172a;
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 2px;
      display: inline-block;
      min-width: 190px;
    }
    .ttd-nip {
      font-size: 10.5px;
      color: #64748b;
      margin-top: 3px;
    }

    /* FOOTER VALIDASI */
    .doc-footer {
      margin-top: 28px;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9.5px;
      color: #64748b;
      page-break-inside: avoid;
    }

    @media print {
      .print-bar {
        display: none !important;
      }
      .page-container {
        padding: 0 !important;
        max-width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <!-- BROWSER PREVIEW ACTION TOOLBAR -->
  <div class="print-bar">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 16px;">📜</span>
      <div>
        <strong style="font-size: 13.5px;">Lembar Rapor Resmi Kuis SKI Madrasah Aliyah</strong>
        <span style="opacity: 0.75; font-size: 11.5px; margin-left: 8px;">(${escapeHtml(studentName)} · ${escapeHtml(packageName)})</span>
      </div>
    </div>
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-size: 11px; opacity: 0.8;">Orientasi: A4 Potret (Portrait)</span>
      <button class="print-btn" onclick="window.print()">
        🖨️ Cetak Dokumen / Simpan PDF
      </button>
    </div>
  </div>

  <div class="page-container">
    <!-- KOP RESMI MADRASAH ALIYAH KEMENAG RI -->
    <div class="kop-wrapper">
      <div class="kop-logo">
        <svg width="66" height="66" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Outer Gold Star Ring -->
          <circle cx="50" cy="50" r="47" stroke="#D97706" stroke-width="2" stroke-dasharray="3 2"/>
          <!-- Rub el Hizb 8-Pointed Star -->
          <rect x="25" y="25" width="50" height="50" rx="4" fill="#047857" stroke="#F59E0B" stroke-width="2"/>
          <rect x="25" y="25" width="50" height="50" rx="4" transform="rotate(45 50 50)" fill="#047857" stroke="#F59E0B" stroke-width="2"/>
          <!-- Inner Medallion -->
          <circle cx="50" cy="50" r="23" fill="#064E3B" stroke="#F59E0B" stroke-width="1.5"/>
          <!-- Open Book of Knowledge -->
          <path d="M38 52C42 49 47 50 50 53C53 50 58 49 62 52V42C58 39 53 40 50 43C47 40 42 39 38 42V52Z" fill="#FFFDF7" stroke="#F59E0B" stroke-width="1.2" stroke-linejoin="round"/>
          <!-- Crescent & Star -->
          <path d="M50 33C48 33 46 34.5 46 36.5C46 38.5 48 40 50 40C49 39.5 48.5 38 48.5 36.5C48.5 35 49 33.5 50 33Z" fill="#F59E0B"/>
          <polygon points="52,35.5 53,37 54.5,37 53.2,38 53.7,39.5 52.5,38.5 51.3,39.5 51.8,38 50.5,37 52,37" fill="#F59E0B"/>
          <!-- Quill Pen Base -->
          <path d="M50 53L50 63M48.5 63L51.5 63" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>

      <div class="kop-content">
        <div class="kop-instansi">KEMENTERIAN AGAMA REPUBLIK INDONESIA</div>
        <div class="kop-kemenag">DIREKTORAT JENDERAL PENDIDIKAN ISLAM · KANTOR WILAYAH MADRASAH</div>
        <div class="kop-madrasah">MADRASAH ALIYAH SEJARAH KEBUDAYAAN ISLAM</div>
        <div class="kop-judul">LEMBAR HASIL ASESMEN EVALUASI PEMBELAJARAN MANDIRI (CBT)</div>
        <div class="kop-sub">Berdasarkan Capaian Pembelajaran Kurikulum Resmi Kemenag RI</div>
      </div>

      <div class="kop-logo" style="display: flex; align-items: center; justify-content: center;">
        <!-- Right Balancing Seal: Emblem Bintang Delapan -->
        <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="38" stroke="#047857" stroke-width="1.5"/>
          <polygon points="40,6 48,26 68,26 52,40 58,60 40,48 22,60 28,40 12,26 32,26" fill="#047857" opacity="0.12"/>
          <circle cx="40" cy="40" r="22" stroke="#D97706" stroke-width="1.5"/>
          <text x="40" y="38" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="bold" fill="#047857" text-anchor="middle">MA</text>
          <text x="40" y="47" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="bold" fill="#D97706" text-anchor="middle">SKI</text>
        </svg>
      </div>
    </div>

    <div class="kop-divider"></div>

    <!-- DOCUMENT METADATA STRIP -->
    <div class="doc-meta-strip">
      <div>
        <span>ID Berkas: </span>
        <span class="doc-meta-badge">${docRefId}</span>
      </div>
      <div>
        <span>Status Dokumen: </span>
        <strong style="color: #047857;">TERVALIDASI SISTEM CBT</strong>
      </div>
      <div>
        <span>Waktu Asesmen: </span>
        <strong>${dateString}</strong>
      </div>
    </div>

    <!-- IDENTITAS SISWA CARD -->
    <div class="student-card">
      <div class="student-card-header">
        <span>A. Data Identitas Peserta Didik</span>
        <span style="font-size: 10px; color: #64748b; font-weight: 600;">Formatif Mandiri</span>
      </div>
      <div class="student-card-grid">
        <div class="data-row">
          <span class="data-label">Nama Siswa</span>
          <span class="data-sep">:</span>
          <span class="data-val" style="color: #0f172a; font-size: 12.5px;">${escapeHtml(studentName)}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Mata Pelajaran</span>
          <span class="data-sep">:</span>
          <span class="data-val">Sejarah Kebudayaan Islam (SKI)</span>
        </div>
        <div class="data-row">
          <span class="data-label">Tingkat / Kelas</span>
          <span class="data-sep">:</span>
          <span class="data-val">${escapeHtml(gradeLabel)}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Materi Pokok / Bab</span>
          <span class="data-sep">:</span>
          <span class="data-val" style="color: #047857;">${escapeHtml(packageName)}</span>
        </div>
      </div>
    </div>

    <!-- SCORECARD & CAPAIAN PANEL -->
    <div class="scorecard-panel">
      <div class="scorecard-top">
        <div class="score-medallion">
          <div class="score-circle">
            <span class="score-number">${percentage}</span>
            <span class="score-sub">NILAI / 100</span>
          </div>
          <div class="score-verdict">
            <span class="status-kkm-badge">
              ${isPassed ? '✓ TUNTAS KKM (MEMENUHI SYARAT)' : '⚠ PERLU PENDAMPINGAN (REMIDIAL)'}
            </span>
            <div style="font-size: 11px; color: #475569; margin-top: 2px;">
              Batas Kriteria Ketuntasan Minimal (KKM): <strong>75.00</strong>
            </div>
          </div>
        </div>

        <div class="predikat-section">
          <div class="predikat-arab">${escapeHtml(predikatArab)}</div>
          <div class="predikat-indo">${escapeHtml(predikatIndo)}</div>
          <div class="predikat-desc">
            ${
              percentage >= 90
                ? 'Sangat memuaskan, menguasai kronologi, tokoh, dan nilai-nilai sejarah peradaban Islam secara komprehensif.'
                : percentage >= 75
                  ? 'Kompeten dan tuntas. Disarankan memperdalam pemahaman pada analisis butir soal yang belum tepat.'
                  : 'Belum mencapai ketuntasan minimum. Disarankan membaca ulang rujukan materi buku siswa dan mengulang latihan.'
            }
          </div>
        </div>
      </div>

      <!-- STATS 4-GRID -->
      <div class="stats-row">
        <div class="stat-pill">
          <div class="stat-val" style="color: #059669;">${soloState.correctCount} / ${totalQuestions}</div>
          <div class="stat-label">Jawaban Benar</div>
        </div>
        <div class="stat-pill">
          <div class="stat-val" style="color: #dc2626;">${soloState.wrongCount} Butir</div>
          <div class="stat-label">Jawaban Salah</div>
        </div>
        <div class="stat-pill">
          <div class="stat-val" style="color: #d97706;">${soloState.score} Poin</div>
          <div class="stat-label">Total Skor Poin</div>
        </div>
        <div class="stat-pill">
          <div class="stat-val" style="color: #2563eb;">${avgTimeSeconds}s</div>
          <div class="stat-label">Rata-Rata Waktu / Soal</div>
        </div>
      </div>
    </div>

    <!-- TABEL RINCIAN SOAL -->
    <div class="table-title">
      <span>B. Rincian & Analisis Butir Soal Evaluasi</span>
      <span style="font-size: 10.5px; color: #64748b; font-weight: 600;">Total ${totalQuestions} Butir Soal</span>
    </div>

    <table class="soal-table">
      <thead>
        <tr>
          <th style="width: 32px; text-align: center;">No</th>
          <th>Pertanyaan & Analisis Materi</th>
          <th style="width: 130px; text-align: left;">Pilihan Siswa</th>
          <th style="width: 105px; text-align: left;">Kunci Resmi</th>
          <th style="width: 75px; text-align: center;">Hasil</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <!-- LEMBAR PENGESAHAN / TANDA TANGAN -->
    <div class="ttd-wrapper">
      <div class="ttd-date-line">
        Diterbitkan di: <strong>Madrasah Aliyah</strong>, ${dateString}
      </div>

      <div class="ttd-columns">
        <div class="ttd-card">
          <div style="font-size: 11px; color: #64748b;">Mengetahui,</div>
          <div class="ttd-role">Guru Pengampu Mata Pelajaran SKI</div>
          <div class="ttd-space">
            <div class="ttd-seal-placeholder">Stempel/Paraf</div>
          </div>
          <div class="ttd-name">..........................................................</div>
          <div class="ttd-nip">NIP. .................................................</div>
        </div>

        <div class="ttd-card">
          <div style="font-size: 11px; color: #64748b;">Peserta Didik yang Dinilai,</div>
          <div class="ttd-role">Madrasah Aliyah</div>
          <div class="ttd-space"></div>
          <div class="ttd-name">${escapeHtml(studentName)}</div>
          <div class="ttd-nip">NIS / NISN: .......................................</div>
        </div>
      </div>
    </div>

    <!-- DOCUMENT FOOTER -->
    <div class="doc-footer">
      <div>
        <span>* Dokumen hasil evaluasi ini diterbitkan secara elektronik melalui Sistem Digital CBT SKI Madrasah Aliyah.</span>
      </div>
      <div>
        <span>Validitas: </span>
        <strong style="color: #0f172a;">Resmi & Terverifikasi</strong>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Trigger print via hidden iframe and fallback.
 * Uses print sheet container mounting so browser print works reliably even if sandboxed.
 */
export function printReportWithIframe(htmlContent: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // 1. First, mount an invisible dedicated print container in the main document
      // which @media print will exclusively display (see index.css)
      const existingContainer = document.getElementById('ski-printable-report-root');
      if (existingContainer) existingContainer.remove();

      const printContainer = document.createElement('div');
      printContainer.id = 'ski-printable-report-root';
      printContainer.className = 'print-only';
      printContainer.style.display = 'none';

      // Extract body content from htmlContent
      const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      printContainer.innerHTML = bodyMatch ? bodyMatch[1] : htmlContent;
      document.body.appendChild(printContainer);

      // 2. Also prepare print iframe
      const existingIframe = document.getElementById('ski-print-iframe');
      if (existingIframe) existingIframe.remove();

      const iframe = document.createElement('iframe');
      iframe.id = 'ski-print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.top = '-10000px';
      iframe.style.left = '-10000px';
      iframe.style.width = '850px';
      iframe.style.height = '1100px';
      iframe.style.border = 'none';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }

      setTimeout(() => {
        let printed = false;
        try {
          if (iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            printed = true;
          }
        } catch (e1) {
          console.warn('Iframe print threw:', e1);
        }

        if (!printed) {
          try {
            window.focus();
            window.print();
            printed = true;
          } catch (e2) {
            console.warn('Window print threw:', e2);
          }
        }

        // Clean up root container after delay
        setTimeout(() => {
          printContainer.remove();
        }, 10000);

        resolve(printed);
      }, 400);
    } catch (err) {
      console.warn('Error while preparing print:', err);
      resolve(false);
    }
  });
}

/**
 * Helper to convert modern CSS color functions (like oklch, oklab, color())
 * to standard rgba/hex using the browser's native Canvas 2D rendering engine.
 */
function convertColorWithCanvas(colorStr: string): string {
  if (!colorStr || (!colorStr.includes('oklch') && !colorStr.includes('oklab') && !colorStr.includes('color('))) {
    return colorStr;
  }
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '#1e293b';

    // Directly convert single color
    if (/^oklch\(.+?\)$/i.test(colorStr.trim()) || /^color\(.+?\)$/i.test(colorStr.trim())) {
      ctx.fillStyle = '#000000';
      ctx.fillStyle = colorStr;
      return ctx.fillStyle;
    }

    // Replace all nested color function occurrences in complex properties (e.g. boxShadow, border)
    return colorStr.replace(/(?:oklch|oklab|color)\([^;}]*(\([^;}]*\)[^;}]*)*\)/gi, (match) => {
      try {
        ctx.fillStyle = '#000000';
        ctx.fillStyle = match;
        return ctx.fillStyle;
      } catch {
        return '#334155';
      }
    });
  } catch {
    return '#1e293b';
  }
}

/**
 * Sanitizes any CSS containing modern 'oklch' color functions
 * in cloned documents before html2canvas parses CSS declarations.
 */
function sanitizeOklchInDoc(doc: Document): void {
  // 1. Remove all external Vite/Tailwind stylesheet links in cloned document
  try {
    const linkElements = doc.querySelectorAll('link[rel="stylesheet"]');
    linkElements.forEach((link) => {
      link.remove();
    });
  } catch {
    // ignore
  }

  // 2. Remove or sanitize any style tags containing Tailwind v4 oklch variables
  try {
    const styleElements = doc.querySelectorAll('style');
    styleElements.forEach((styleTag) => {
      const text = styleTag.textContent || '';
      if (text.includes('@theme') || text.includes('tailwindcss')) {
        // Strip full Tailwind stylesheets from the print document
        styleTag.remove();
      } else if (text.includes('oklch')) {
        styleTag.textContent = text.replace(/oklch\([^;}]*(\([^;}]*\)[^;}]*)*\)/gi, '#334155');
      }
    });
  } catch {
    // ignore
  }

  // 3. Patch the cloned document window's getComputedStyle so html2canvas never encounters oklch
  try {
    const win = doc.defaultView;
    if (win && win.getComputedStyle) {
      const originalGCS = win.getComputedStyle;
      win.getComputedStyle = function (el: Element, pseudoElt?: string | null): CSSStyleDeclaration {
        const computed = originalGCS.call(this, el, pseudoElt);
        return new Proxy(computed, {
          get(target: CSSStyleDeclaration, prop: string | symbol) {
            const value = Reflect.get(target, prop);
            if (typeof value === 'string' && (value.includes('oklch') || value.includes('oklab') || value.includes('color('))) {
              return convertColorWithCanvas(value);
            }
            if (typeof value === 'function') {
              if (prop === 'getPropertyValue') {
                return function (propName: string): string {
                  const raw = target.getPropertyValue(propName);
                  if (typeof raw === 'string' && (raw.includes('oklch') || raw.includes('oklab') || raw.includes('color('))) {
                    return convertColorWithCanvas(raw);
                  }
                  return raw;
                };
              }
              return value.bind(target);
            }
            return value;
          },
        });
      };
    }
  } catch {
    // ignore
  }

  // 4. Sanitize inline styles on all nodes
  try {
    const all = doc.querySelectorAll('*');
    all.forEach((node) => {
      const el = node as HTMLElement;
      if (!el.style) return;

      const inlineCss = el.style.cssText;
      if (inlineCss && (inlineCss.includes('oklch') || inlineCss.includes('oklab') || inlineCss.includes('color('))) {
        el.style.cssText = convertColorWithCanvas(inlineCss);
      }
    });
  } catch {
    // ignore
  }
}

/**
 * Directly generates and downloads a real, crisp PDF file (.pdf)
 * using jsPDF and html2canvas from either an HTML string or a DOM element.
 * Immune to Tailwind CSS v4 'oklch' color parsing errors.
 */
export async function exportReportToPdf(
  source: HTMLElement | string,
  filename: string
): Promise<boolean> {
  let tempIframe: HTMLIFrameElement | null = null;
  try {
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas'),
    ]);

    let targetElement: HTMLElement;

    if (typeof source === 'string') {
      // Create isolated iframe with self-contained HTML (pure CSS, no Tailwind v4 oklch variables)
      tempIframe = document.createElement('iframe');
      tempIframe.style.position = 'fixed';
      tempIframe.style.left = '-9999px';
      tempIframe.style.top = '0';
      tempIframe.style.width = '820px';
      tempIframe.style.height = '1200px';
      tempIframe.style.border = 'none';
      tempIframe.style.opacity = '0';
      tempIframe.style.pointerEvents = 'none';
      document.body.appendChild(tempIframe);

      const iframeDoc = tempIframe.contentWindow?.document || tempIframe.contentDocument;
      if (!iframeDoc) throw new Error('Cannot access iframe document for PDF export');

      iframeDoc.open();
      iframeDoc.write(source);
      iframeDoc.close();

      // Allow fonts and styles to initialize
      await new Promise((resolve) => setTimeout(resolve, 300));

      targetElement =
        (iframeDoc.querySelector('.page-container') as HTMLElement) || iframeDoc.body;
    } else {
      targetElement = source;
    }

    // Render to high-res canvas (scale 2 for crisp print clarity)
    const canvas = await html2canvas(targetElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 850,
      onclone: (clonedDoc) => {
        sanitizeOklchInDoc(clonedDoc);
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth - 16; // 8mm margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 8; // top margin

    // First page
    pdf.addImage(imgData, 'JPEG', 8, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight - 16;

    // Additional pages if report spans multiple pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 8;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 8, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight - 16;
    }

    pdf.save(filename);
    return true;
  } catch (err) {
    console.error('Failed to generate PDF via jsPDF/html2canvas:', err);
    return false;
  } finally {
    if (tempIframe) {
      try {
        tempIframe.remove();
      } catch {
        // ignore
      }
    }
  }
}

/**
 * Downloads the full printable report as a self-contained HTML file.
 * The student or teacher can open it anywhere (Chrome/Edge/phone) and click print or save as PDF.
 */
export function downloadReportHtml(htmlContent: string, filename: string): void {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generates plain text summary of the student quiz result for WhatsApp or Chat.
 */
export function generateReportSummaryText(data: ReportPrintData): string {
  const {
    packageName,
    gradeLevel,
    totalQuestions,
    soloState,
    percentage,
    predikatArab,
    predikatIndo,
    avgTimeSeconds,
  } = data;

  const dateString = getFormattedDate();
  const studentName = soloState.studentName?.trim() || 'Siswa Peserta';
  const gradeLabel = gradeLevel ? `Kelas ${gradeLevel} MA` : 'Madrasah Aliyah';

  return `*HASIL EVALUASI LATIHAN KUIS SKI MANDIRI*
----------------------------------------
👤 *Nama Siswa:* ${studentName}
📚 *Mata Pelajaran:* Sejarah Kebudayaan Islam (SKI)
🏛️ *Jenjang:* ${gradeLabel}
📖 *Materi:* ${packageName}
📅 *Waktu:* ${dateString}

📊 *REKAPITULASI NILAI:*
• Nilai Akhir: *${percentage} / 100*
• Predikat: *${predikatArab}* (${predikatIndo})
• Jawaban Benar: *${soloState.correctCount}* dari ${totalQuestions} soal
• Jawaban Salah: *${soloState.wrongCount}* soal
• Total Poin: *${soloState.score}* poin
• Rata-rata Waktu: *${avgTimeSeconds} detik / soal*

_Dihasilkan melalui Aplikasi Kuis Interaktif SKI Madrasah Aliyah._`;
}
