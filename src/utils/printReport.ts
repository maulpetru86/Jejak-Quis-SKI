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
 * Generate official, printable HTML document for Madrasah Aliyah SKI student evaluation.
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

  const rowsHtml = soloState.answers
    .map((ans, idx) => {
      const isCorrect = ans.isCorrect;
      const statusBadge = isCorrect
        ? `<span style="display:inline-block;padding:2px 8px;font-size:11px;font-weight:bold;color:#065f46;background:#d1fae5;border-radius:4px;border:1px solid #10b981;">BENAR</span>`
        : `<span style="display:inline-block;padding:2px 8px;font-size:11px;font-weight:bold;color:#991b1b;background:#fee2e2;border-radius:4px;border:1px solid #ef4444;">SALAH</span>`;

      const studentAnsText =
        ans.selectedAnswer === '-'
          ? '<i style="color:#6b7280;">Tidak Dijawab (Waktu Habis)</i>'
          : `<strong>${ans.selectedAnswer}</strong> (${ans.options[ans.selectedAnswer as AnswerLetter] || '-'})`;

      const correctAnsText = `<strong>${ans.correctAnswer}</strong> (${ans.options[ans.correctAnswer] || '-'})`;

      return `
        <tr style="border-bottom: 1px solid #e5e7eb; page-break-inside: avoid;">
          <td style="padding: 10px 8px; text-align: center; font-weight: bold; vertical-align: top; color: #374151;">${idx + 1}</td>
          <td style="padding: 10px 10px; vertical-align: top;">
            <div style="font-weight: 600; color: #111827; margin-bottom: 6px; font-size: 13px;">${ans.questionText}</div>
            <div style="font-size: 11.5px; color: #4b5563; margin-top: 4px;">
              <span style="color: #1f2937; font-weight: 600;">Jawaban Siswa:</span> ${studentAnsText}
            </div>
            ${
              !isCorrect
                ? `<div style="font-size: 11.5px; color: #047857; margin-top: 2px;">
                    <span style="font-weight: 600;">Kunci Jawaban:</span> ${correctAnsText}
                   </div>`
                : ''
            }
            ${
              ans.explanation
                ? `<div style="font-size: 11px; color: #4b5563; background: #f9fafb; padding: 6px 8px; border-left: 3px solid #f59e0b; margin-top: 6px; border-radius: 2px;">
                    <strong>Pembahasan:</strong> ${ans.explanation}
                   </div>`
                : ''
            }
            ${
              ans.pageReference
                ? `<div style="font-size: 10.5px; color: #6b7280; margin-top: 3px;">
                    <em>Rujukan: ${ans.pageReference}</em>
                   </div>`
                : ''
            }
          </td>
          <td style="padding: 10px 8px; text-align: center; vertical-align: top;">${statusBadge}</td>
        </tr>
      `;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Rapor Kuis SKI - ${escapeHtml(studentName)}</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Times New Roman', Times, serif, system-ui, -apple-system, sans-serif;
      color: #111827;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 13px;
      line-height: 1.5;
    }
    .print-bar {
      background: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 999;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      font-family: system-ui, -apple-system, sans-serif;
    }
    .print-btn {
      background: #f59e0b;
      color: #0f172a;
      border: none;
      font-weight: 700;
      padding: 8px 18px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .print-btn:hover {
      background: #d97706;
    }
    .page-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;
      background: #ffffff;
    }
    /* KOP MADRASAH */
    .kop-header {
      text-align: center;
      border-bottom: 3px double #000000;
      padding-bottom: 12px;
      margin-bottom: 16px;
      position: relative;
    }
    .kop-instansi {
      font-size: 13px;
      font-weight: bold;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #1f2937;
    }
    .kop-madrasah {
      font-size: 17px;
      font-weight: 900;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-top: 2px;
      color: #111827;
    }
    .kop-judul {
      font-size: 14px;
      font-weight: 700;
      margin-top: 2px;
      color: #047857;
    }
    .kop-sub {
      font-size: 11px;
      color: #4b5563;
      margin-top: 2px;
    }
    /* INFO META */
    .meta-box {
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 16px;
      background: #f9fafb;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
    }
    .meta-table td {
      padding: 3px 6px;
      vertical-align: top;
    }
    .meta-label {
      width: 130px;
      color: #4b5563;
      font-weight: 600;
    }
    .meta-sep {
      width: 15px;
      color: #4b5563;
    }
    .meta-val {
      font-weight: 700;
      color: #111827;
    }
    /* SCORE RECAP */
    .recap-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 16px;
      text-align: center;
    }
    .recap-card {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 10px 6px;
      background: #ffffff;
    }
    .recap-card.highlight {
      background: #fef3c7;
      border-color: #f59e0b;
    }
    .recap-num {
      font-size: 22px;
      font-weight: 900;
      color: #111827;
      line-height: 1.1;
    }
    .recap-label {
      font-size: 10.5px;
      font-weight: 600;
      color: #4b5563;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }
    .predikat-box {
      border: 1.5px solid #d97706;
      background: #fffbeb;
      border-radius: 6px;
      padding: 10px;
      text-align: center;
      margin-bottom: 20px;
    }
    .predikat-arab {
      font-size: 18px;
      font-weight: bold;
      color: #92400e;
    }
    .predikat-desc {
      font-size: 12px;
      color: #78350f;
      font-weight: 600;
      margin-top: 2px;
    }
    /* SOAL TABLE */
    .soal-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .soal-table th {
      background: #f3f4f6;
      color: #111827;
      font-weight: 700;
      font-size: 12px;
      padding: 8px 10px;
      border-top: 1px solid #d1d5db;
      border-bottom: 2px solid #9ca3af;
      text-align: left;
    }
    /* TTD */
    .ttd-section {
      margin-top: 28px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
      padding: 0 20px;
    }
    .ttd-box {
      text-align: center;
      width: 220px;
    }
    .ttd-space {
      height: 60px;
    }
    .ttd-name {
      font-weight: bold;
      border-bottom: 1px solid #111827;
      padding-bottom: 2px;
    }
    .ttd-role {
      font-size: 11px;
      color: #4b5563;
      margin-top: 2px;
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
  <div class="print-bar">
    <div>
      <strong>Lembar Rapor Hasil Kuis Siswa</strong>
      <span style="opacity: 0.75; font-size: 12px; margin-left: 8px;">(${escapeHtml(studentName)} - ${escapeHtml(packageName)})</span>
    </div>
    <button class="print-btn" onclick="window.print()">
      🖨️ Cetak Dokumen / Simpan PDF
    </button>
  </div>

  <div class="page-container">
    <!-- KOP -->
    <div class="kop-header">
      <div class="kop-instansi">KEMENTERIAN AGAMA REPUBLIK INDONESIA</div>
      <div class="kop-madrasah">LEMBAR HASIL EVALUASI PEMBELAJARAN MANDIRI</div>
      <div class="kop-judul">MATA PELAJARAN SEJARAH KEBUDAYAAN ISLAM (SKI)</div>
      <div class="kop-sub">Sesuai Kurikulum Madrasah Aliyah Kemenag RI · Sistem Pembelajaran Interaktif</div>
    </div>

    <!-- IDENTITAS -->
    <div class="meta-box">
      <table class="meta-table">
        <tr>
          <td class="meta-label">Nama Siswa</td>
          <td class="meta-sep">:</td>
          <td class="meta-val">${escapeHtml(studentName)}</td>
          <td class="meta-label">Materi Pelajaran</td>
          <td class="meta-sep">:</td>
          <td class="meta-val">${escapeHtml(packageName)}</td>
        </tr>
        <tr>
          <td class="meta-label">Jenjang / Tingkat</td>
          <td class="meta-sep">:</td>
          <td class="meta-val">${escapeHtml(gradeLabel)}</td>
          <td class="meta-label">Waktu Pengerjaan</td>
          <td class="meta-sep">:</td>
          <td class="meta-val">${dateString}</td>
        </tr>
      </table>
    </div>

    <!-- STATISTIK -->
    <div class="recap-grid">
      <div class="recap-card highlight">
        <div class="recap-num" style="color: #b45309;">${percentage}</div>
        <div class="recap-label">Nilai Akhir (0-100)</div>
      </div>
      <div class="recap-card">
        <div class="recap-num" style="color: #059669;">${soloState.correctCount} / ${totalQuestions}</div>
        <div class="recap-label">Jawaban Benar</div>
      </div>
      <div class="recap-card">
        <div class="recap-num" style="color: #dc2626;">${soloState.wrongCount}</div>
        <div class="recap-label">Jawaban Salah</div>
      </div>
      <div class="recap-card">
        <div class="recap-num" style="color: #2563eb;">${avgTimeSeconds}s</div>
        <div class="recap-label">Rata-rata Waktu</div>
      </div>
    </div>

    <!-- PREDIKAT -->
    <div class="predikat-box">
      <div class="predikat-arab">${escapeHtml(predikatArab)}</div>
      <div class="predikat-desc">${escapeHtml(predikatIndo)}</div>
    </div>

    <!-- DETAIL SOAL -->
    <h3 style="font-size: 13px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">
      Rincian Jawaban & Analisis Butir Soal
    </h3>

    <table class="soal-table">
      <thead>
        <tr>
          <th style="width: 35px; text-align: center;">No</th>
          <th>Pertanyaan & Jawaban</th>
          <th style="width: 75px; text-align: center;">Hasil</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <!-- TANDA TANGAN -->
    <div class="ttd-section">
      <div class="ttd-box">
        <div style="font-size: 12px; margin-bottom: 4px;">Mengetahui,</div>
        <div style="font-size: 12px; font-weight: 600;">Guru Mata Pelajaran SKI</div>
        <div class="ttd-space"></div>
        <div class="ttd-name">...................................................</div>
        <div class="ttd-role">NIP. ..........................................</div>
      </div>

      <div class="ttd-box">
        <div style="font-size: 12px; margin-bottom: 4px;">Siswa Peserta Kuis,</div>
        <div style="font-size: 12px; font-weight: 600;">Madrasah Aliyah</div>
        <div class="ttd-space"></div>
        <div class="ttd-name">${escapeHtml(studentName)}</div>
        <div class="ttd-role">Peserta Evaluasi Mandiri</div>
      </div>
    </div>
  </div>

  <script>
    // Auto-focus window for printing
    window.onload = function() {
      // ready
    };
  </script>
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
 * Directly generates and downloads a real, crisp PDF file (.pdf)
 * using jsPDF and html2canvas from a DOM element or rendered report.
 */
export async function exportReportToPdf(
  element: HTMLElement,
  filename: string
): Promise<boolean> {
  try {
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas'),
    ]);

    // Render DOM node to high-res canvas (scale 2 for retina / print clarity)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
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
    heightLeft -= (pdfHeight - 16);

    // Additional pages if report spans multiple pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 8;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 8, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= (pdfHeight - 16);
    }

    pdf.save(filename);
    return true;
  } catch (err) {
    console.error('Failed to generate PDF via jsPDF/html2canvas:', err);
    return false;
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
