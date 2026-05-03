/* =========================================
   A. Tampilan Panel Input
   ========================================= */
.ui-input {
    width: 100%;
    background-color: #374151;
    color: #ffffff;
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    margin-top: 0.25rem;
}
.ui-input:focus {
    outline: none;
    box-shadow: 0 0 0 2px #ca8a04;
}

/* =========================================
   B. Kertas Sertifikat (A4 FIX)
   ========================================= */
.cert-paper {
    position: relative;
    width: 794px;
    height: 1123px;

    background-image: url('assets/bingkai.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #ffffff;

    color: #000000;
    font-family: 'Times New Roman', Times, serif;

    overflow: hidden;
    box-sizing: border-box;
    display: block;
    margin: 0 auto;
}

/* Area Konten */
.cert-content {
    position: absolute;
    top: 130px;
    left: 110px;
    width: 574px;
    height: 800px;
}

/* Header */
.cert-header {
    text-align: center;
    margin-bottom: 25px;
}
.cert-header h2 {
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 1px;
    margin-bottom: 5px;
}
.cert-header h1 {
    font-size: 20px;
    font-weight: bold;
    text-decoration: underline;
    letter-spacing: 2px;
}

/* Preamble */
.cert-preamble {
    text-align: justify;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 25px;
}

/* Tabel */
.cert-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}
.cert-table td {
    padding-bottom: 8px;
    vertical-align: top;
}

.c-num { width: 30px; font-weight: bold; }
.c-lbl { width: 170px; }
.c-tik { width: 15px; text-align: center; }
.c-val { width: 359px; }

/* Sub Table */
.sub-table {
    width: 100%;
    border-collapse: collapse;
}
.sub-table td {
    padding-bottom: 3px;
}
.s-lbl { width: 130px; color: #333; }
.s-tik { width: 15px; text-align: center; }

/* Utility */
.cert-bold { font-weight: bold; }
.cert-upper { text-transform: uppercase; }
.cert-mono { font-family: 'Courier New', monospace; letter-spacing: 1px; }
.cert-blue { color: #000080; }

/* Disclaimer */
.cert-disclaimer {
    margin-top: 35px;
    padding-top: 15px;
    border-top: 1px solid #cccccc;
    text-align: justify;
    font-size: 12px;
    line-height: 1.5;
}

/* =========================================
   C. Footer (QR & TTD)
   ========================================= */
.cert-barcode-box {
    position: absolute;
    bottom: 120px;
    left: 110px;
    text-align: center;
}
#qrcode {
    border: 2px solid #b8860b;
    padding: 4px;
    background: #fff;
    width: 76px;
    height: 76px;
    margin-bottom: 5px;
}
.cert-verify-text {
    font-size: 9px;
    font-weight: bold;
    color: #b8860b;
    letter-spacing: 1px;
}

/* TTD */
.cert-ttd-box {
    position: absolute;
    bottom: 120px;
    right: 110px;
    width: 250px;
    text-align: center;
}
.ttd-kota {
    font-size: 14px;
    margin-bottom: 70px;
}
.ttd-jabatan {
    font-size: 14px;
    font-weight: bold;
    text-decoration: underline;
}
.ttd-nama {
    font-size: 12px;
}

/* Stempel */
.cert-stempel {
    position: absolute;
    bottom: 120px;
    right: 160px;
    width: 140px;
    opacity: 0.85;
    transform: rotate(-12deg);
    mix-blend-mode: multiply;
}

/* =========================================
   D. PREVIEW SYSTEM (FIX UTAMA)
   ========================================= */
.preview-container {
    width: 100%;
    height: 100vh;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20px;
}

/* Yang di-scale cuma wrapper */
.preview-wrapper {
    transform: scale(0.75);
    transform-origin: top center;
}

/* Responsive */
@media (max-width: 1024px) {
    .preview-wrapper { transform: scale(0.6); }
}
@media (max-width: 768px) {
    .preview-wrapper { transform: scale(0.5); }
}
@media (max-width: 480px) {
    .preview-wrapper { transform: scale(0.4); }
}
