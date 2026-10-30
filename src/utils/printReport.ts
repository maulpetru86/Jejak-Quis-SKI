import { AnswerLetter, GradeLevel, SoloGameState } from '../config/quizConfig';
import { KEMENAG_LOGO_BASE64 } from '../data/kemenagLogoBase64';

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
        ? `<span style="display:inline-block;padding:2px 8px;font-size:10px;font-weight:800;color:#065f46;background:#d1fae5;border-radius:4px;border:1px solid #10b981;">✓ BENAR</span>`
        : `<span style="display:inline-block;padding:2px 8px;font-size:10px;font-weight:800;color:#991b1b;background:#fee2e2;border-radius:4px;border:1px solid #f87171;">✗ SALAH</span>`;

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
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm 12mm 12mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      letter-spacing: normal !important;
      word-spacing: normal !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 12px;
      line-height: 1.5;
      text-rendering: geometricPrecision;
      -webkit-font-smoothing: antialiased;
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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
      width: 780px;
      max-width: 780px;
      margin: 0 auto;
      padding: 16px 20px 28px;
      background: #ffffff;
    }
    
    /* KOP RESMI MGMP SKI KABUPATEN NGANJUK */
    .kop-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 4px;
    }
    .kop-logo {
      width: 74px;
      height: 74px;
      flex-shrink: 0;
    }
    .kop-content {
      flex: 1;
      text-align: center;
    }
    .kop-instansi {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #334155;
      margin-bottom: 2px;
      line-height: 1.3;
    }
    .kop-kemenag {
      font-size: 11.5px;
      font-weight: 800;
      text-transform: uppercase;
      color: #0f172a;
      margin-bottom: 2px;
      line-height: 1.3;
    }
    .kop-madrasah {
      font-size: 14px;
      font-weight: 900;
      text-transform: uppercase;
      color: #047857;
      margin-bottom: 2px;
      line-height: 1.3;
    }
    .kop-subwilayah {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      color: #0f172a;
      margin-bottom: 3px;
      line-height: 1.3;
    }
    .kop-alamat {
      font-size: 8.5px;
      color: #475569;
      line-height: 1.45;
      margin-top: 2px;
    }
    .kop-divider {
      margin-top: 8px;
      margin-bottom: 10px;
      border-top: 2.5px solid #0f172a;
      border-bottom: 1px solid #047857;
      height: 4px;
    }
    .kop-judul-doc {
      text-align: center;
      margin-bottom: 12px;
    }
    .kop-judul-doc-title {
      font-size: 13px;
      font-weight: 900;
      text-transform: uppercase;
      color: #0f172a;
      text-decoration: underline;
      line-height: 1.4;
    }
    .kop-judul-doc-sub {
      font-size: 10.5px;
      font-weight: 700;
      color: #047857;
      text-transform: uppercase;
      margin-top: 3px;
      line-height: 1.4;
    }

    /* DOCUMENT METADATA TABLE */
    .doc-meta-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5px;
      color: #64748b;
      margin-bottom: 12px;
    }
    .doc-meta-badge {
      display: inline-block;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 2px 7px;
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
      color: #334155;
      display: flex;
      align-items: center;
      justify-content: space-between;
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
      gap: 14px;
    }
    .score-circle {
      width: 72px;
      height: 72px;
      min-width: 72px;
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
      font-size: 25px;
      font-weight: 900;
      color: #0f172a;
      line-height: 1;
    }
    .score-sub {
      font-size: 8px;
      font-weight: 800;
      color: #d97706;
      text-transform: uppercase;
      margin-top: 1px;
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
      padding: 2.5px 8px;
      border-radius: 4px;
      background: ${isPassed ? '#d1fae5' : '#fee2e2'};
      color: ${isPassed ? '#065f46' : '#991b1b'};
      border: 1px solid ${isPassed ? '#10b981' : '#f87171'};
    }
    .predikat-section {
      text-align: right;
    }
    .predikat-arab {
      font-family: 'Amiri', 'Traditional Arabic', 'Times New Roman', serif;
      font-size: 20px;
      font-weight: 700;
      color: #1e3a8a;
      line-height: 1.3;
    }
    .predikat-indo {
      font-size: 12px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 2px;
    }
    .predikat-desc {
      font-size: 10px;
      color: #475569;
      margin-top: 2px;
      max-width: 320px;
      line-height: 1.4;
    }

    /* QUESTION TABLE */
    .table-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
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
      width: 52px;
      height: 52px;
      border: 1.5px dashed #10b981;
      background: #ecfdf5;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 7.5px;
      font-weight: 800;
      color: #065f46;
      line-height: 1.2;
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
    <!-- KOP RESMI MGMP SKI KABUPATEN NGANJUK -->
    <div class="kop-wrapper">
      <div class="kop-logo" style="display: flex; align-items: center; justify-content: center;">
        <!-- Lambang Resmi Kementerian Agama RI -->
        <img
          src="${KEMENAG_LOGO_BASE64}"
          alt="Logo Kementerian Agama Republik Indonesia"
          style="width: 100%; height: 100%; object-fit: contain;"
        />
      </div>

      <div class="kop-content">
        <div class="kop-instansi">KEMENTERIAN AGAMA REPUBLIK INDONESIA</div>
        <div class="kop-kemenag">KANTOR KEMENTERIAN AGAMA KABUPATEN NGANJUK</div>
        <div class="kop-madrasah">MUSYAWARAH GURU MATA PELAJARAN (MGMP) SKI</div>
        <div class="kop-subwilayah">MADRASAH ALIYAH KABUPATEN NGANJUK</div>
        <div class="kop-alamat">Sekretariat: Jl. Dermojoyo No. 19, Payaman, Kec. Nganjuk, Kabupaten Nganjuk, Jawa Timur 64418<br>Surel: mgmpski.nganjuk@gmail.com · Laman: kemenagnganjuk.id</div>
      </div>

      <div class="kop-logo" style="display: flex; align-items: center; justify-content: center;">
        <!-- Lambang Resmi MGMP SKI Kabupaten Nganjuk -->
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
          <circle cx="50" cy="50" r="47" stroke="#D97706" stroke-width="2" stroke-dasharray="3 2"/>
          <rect x="23" y="23" width="54" height="54" rx="5" fill="#064E3B" stroke="#F59E0B" stroke-width="2"/>
          <rect x="23" y="23" width="54" height="54" rx="5" transform="rotate(45 50 50)" fill="#064E3B" stroke="#F59E0B" stroke-width="2"/>
          <circle cx="50" cy="50" r="24" fill="#047857" stroke="#F59E0B" stroke-width="1.5"/>
          <path d="M42 46 C42 38 58 38 58 46 H42 Z" fill="#FEF3C7" stroke="#D97706" stroke-width="1"/>
          <path d="M50 34 V40" stroke="#F59E0B" stroke-width="1.5"/>
          <circle cx="50" cy="33" r="1.5" fill="#F59E0B"/>
          <text x="50" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="7.5" font-weight="900" fill="#FFFDF7" text-anchor="middle">MGMP SKI</text>
          <text x="50" y="63" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="6" font-weight="800" fill="#FDE68A" text-anchor="middle">NGANJUK</text>
        </svg>
      </div>
    </div>

    <div class="kop-divider"></div>

    <div class="kop-judul-doc">
      <div class="kop-judul-doc-title">LEMBAR HASIL ASESMEN EVALUASI PEMBELAJARAN (CBT)</div>
      <div class="kop-judul-doc-sub">RAPOR KUIS SEJARAH KEBUDAYAAN ISLAM · MADRASAH ALIYAH KABUPATEN NGANJUK</div>
    </div>

    <!-- DOCUMENT METADATA STRIP -->
    <table class="doc-meta-table">
      <tr>
        <td style="text-align: left; padding: 2px 0;">
          <span style="color: #64748b;">ID Berkas: </span>
          <span class="doc-meta-badge">${docRefId}</span>
        </td>
        <td style="text-align: center; padding: 2px 0;">
          <span style="color: #64748b;">Status Dokumen: </span>
          <strong style="color: #047857;">TERVALIDASI SISTEM CBT</strong>
        </td>
        <td style="text-align: right; padding: 2px 0;">
          <span style="color: #64748b;">Waktu Asesmen: </span>
          <strong style="color: #0f172a;">${dateString}</strong>
        </td>
      </tr>
    </table>

    <!-- IDENTITAS SISWA CARD -->
    <div class="student-card">
      <div class="student-card-header">
        <span>A. DATA IDENTITAS PESERTA DIDIK</span>
        <span style="font-size: 10px; color: #64748b; font-weight: 600;">Formatif Mandiri</span>
      </div>
      <div style="padding: 10px 14px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 11.5px;">
          <tr>
            <td style="width: 120px; padding: 4px 0; color: #64748b; font-weight: 600;">Nama Siswa</td>
            <td style="width: 14px; padding: 4px 0; color: #94a3b8; text-align: center;">:</td>
            <td style="padding: 4px 10px 4px 0; color: #0f172a; font-weight: 700; font-size: 12px;">${escapeHtml(studentName)}</td>
            <td style="width: 130px; padding: 4px 0; color: #64748b; font-weight: 600;">Mata Pelajaran</td>
            <td style="width: 14px; padding: 4px 0; color: #94a3b8; text-align: center;">:</td>
            <td style="padding: 4px 0; color: #0f172a; font-weight: 700;">Sejarah Kebudayaan Islam (SKI)</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b; font-weight: 600;">Tingkat / Kelas</td>
            <td style="padding: 4px 0; color: #94a3b8; text-align: center;">:</td>
            <td style="padding: 4px 10px 4px 0; color: #0f172a; font-weight: 700;">${escapeHtml(gradeLabel)}</td>
            <td style="padding: 4px 0; color: #64748b; font-weight: 600;">Materi Pokok / Bab</td>
            <td style="padding: 4px 0; color: #94a3b8; text-align: center;">:</td>
            <td style="padding: 4px 0; color: #047857; font-weight: 700;">${escapeHtml(packageName)}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- SCORECARD & CAPAIAN PANEL -->
    <div class="scorecard-panel">
      <div class="scorecard-top">
        <div class="score-medallion">
          <div class="score-circle">
            <span class="score-number">${percentage}</span>
            <span class="score-sub">SKOR (0-100)</span>
          </div>
          <div class="score-verdict">
            <span class="status-kkm-badge">
              ${isPassed ? '✓ TUNTAS KKM (MEMENUHI SYARAT)' : '⚠ PERLU PENDAMPINGAN (REMIDIAL)'}
            </span>
            <div style="font-size: 11px; color: #475569; margin-top: 3px;">
              Batas Kriteria Ketuntasan Minimal (KKM): <strong style="color: #0f172a;">75.00</strong>
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

      <!-- STATS 4-GRID (TABLE-BASED FOR PRECISION RENDERING) -->
      <table style="width: 100%; border-collapse: separate; border-spacing: 8px 0; margin-top: 6px;">
        <tr>
          <td style="width: 25%; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 6px; text-align: center;">
            <div style="font-size: 14px; font-weight: 800; color: #059669;">${soloState.correctCount} / ${totalQuestions}</div>
            <div style="font-size: 9.5px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 2px;">Jawaban Benar</div>
          </td>
          <td style="width: 25%; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 6px; text-align: center;">
            <div style="font-size: 14px; font-weight: 800; color: #dc2626;">${soloState.wrongCount} Butir</div>
            <div style="font-size: 9.5px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 2px;">Jawaban Salah</div>
          </td>
          <td style="width: 25%; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 6px; text-align: center;">
            <div style="font-size: 14px; font-weight: 800; color: #d97706;">${soloState.score} Poin</div>
            <div style="font-size: 9.5px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 2px;">Total Skor Poin</div>
          </td>
          <td style="width: 25%; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 6px; text-align: center;">
            <div style="font-size: 14px; font-weight: 800; color: #2563eb;">${avgTimeSeconds}s</div>
            <div style="font-size: 9.5px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 2px;">Rata-Rata Waktu / Soal</div>
          </td>
        </tr>
      </table>
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
        Diterbitkan di: <strong>Nganjuk, Jawa Timur</strong>, ${dateString}
      </div>

      <div class="ttd-columns">
        <div class="ttd-card">
          <div style="font-size: 11px; color: #64748b;">Mengetahui,</div>
          <div class="ttd-role">Guru Pengampu Mata Pelajaran SKI</div>
          <div class="ttd-space">
            <div class="ttd-seal-placeholder">MGMP SKI<br>NGANJUK</div>
          </div>
          <div class="ttd-name">..........................................................</div>
          <div class="ttd-nip">NIP. .................................................</div>
        </div>

        <div class="ttd-card">
          <div style="font-size: 11px; color: #64748b;">Peserta Didik / Siswa,</div>
          <div class="ttd-role">Madrasah Aliyah Kab. Nganjuk</div>
          <div class="ttd-space"></div>
          <div class="ttd-name">${escapeHtml(studentName)}</div>
          <div class="ttd-nip">NIS / NISN: .......................................</div>
        </div>
      </div>
    </div>

    <!-- DOCUMENT FOOTER -->
    <div class="doc-footer">
      <div>
        <span>* Dokumen hasil evaluasi ini diterbitkan secara elektronik melalui Sistem Digital CBT MGMP SKI MA Kabupaten Nganjuk.</span>
      </div>
      <div>
        <span>Validitas: </span>
        <strong style="color: #047857;">Resmi & Terverifikasi MGMP</strong>
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
  // 1. Only remove stylesheets that actually contain Tailwind or Vite
  try {
    const linkElements = doc.querySelectorAll('link[rel="stylesheet"]');
    linkElements.forEach((link) => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      if (href.includes('vite') || href.includes('tailwind') || href.includes('src/')) {
        link.remove();
      }
    });
  } catch {
    // ignore
  }

  // 2. Remove or sanitize any style tags containing Tailwind v4 oklch variables
  try {
    const styleElements = doc.querySelectorAll('style');
    styleElements.forEach((styleTag) => {
      const text = styleTag.textContent || '';
      if (text.includes('@theme') || text.includes('@utility') || (text.includes('tailwindcss') && text.includes('oklch'))) {
        styleTag.remove();
      } else if (text.includes('oklch')) {
        styleTag.textContent = text.replace(/oklch\([^;}]*(\([^;}]*\)[^;}]*)*\)/gi, '#334155');
      }
    });
  } catch {
    // ignore
  }

  // 3. Patch the cloned document window's getComputedStyle so html2canvas never encounters oklch or letter-spacing
  try {
    const win = doc.defaultView;
    if (win && win.getComputedStyle) {
      const originalGCS = win.getComputedStyle;
      win.getComputedStyle = function (el: Element, pseudoElt?: string | null): CSSStyleDeclaration {
        const computed = originalGCS.call(this, el, pseudoElt);
        return new Proxy(computed, {
          get(target: CSSStyleDeclaration, prop: string | symbol) {
            if (prop === 'letterSpacing') {
              return 'normal';
            }
            const value = Reflect.get(target, prop);
            if (typeof value === 'string' && (value.includes('oklch') || value.includes('oklab') || value.includes('color('))) {
              return convertColorWithCanvas(value);
            }
            if (typeof value === 'function') {
              if (prop === 'getPropertyValue') {
                return function (propName: string): string {
                  if (propName === 'letter-spacing') {
                    return 'normal';
                  }
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

      if (el.style.letterSpacing && el.style.letterSpacing !== 'normal') {
        el.style.letterSpacing = 'normal';
      }

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
      tempIframe.style.top = '0';
      tempIframe.style.left = '0';
      tempIframe.style.width = '800px';
      tempIframe.style.height = '1200px';
      tempIframe.style.zIndex = '-9999';
      tempIframe.style.opacity = '0';
      tempIframe.style.border = 'none';
      tempIframe.style.pointerEvents = 'none';
      document.body.appendChild(tempIframe);

      const iframeDoc = tempIframe.contentWindow?.document || tempIframe.contentDocument;
      if (!iframeDoc) throw new Error('Cannot access iframe document for PDF export');

      iframeDoc.open();
      iframeDoc.write(source);
      iframeDoc.close();

      if (iframeDoc.fonts?.ready) {
        try {
          await iframeDoc.fonts.ready;
        } catch {
          // ignore font loading error
        }
      }

      // Allow DOM layout to settle
      await new Promise((resolve) => setTimeout(resolve, 250));

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
      windowWidth: 800,
      width: 800,
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
🏛️ *MGMP SKI MA KABUPATEN NGANJUK*
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

_Diterbitkan melalui Sistem Asesmen Digital MGMP SKI Madrasah Aliyah Kabupaten Nganjuk, Jawa Timur._`;
}
