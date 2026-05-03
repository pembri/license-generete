// Konfigurasi Sandi
const SECURITY_PIN = "Anjing526";

let qrCodeObj = null;

// Fungsi Mengecek Sandi
function checkPassword() {
    const input = document.getElementById('password-input').value;
    if (input === SECURITY_PIN) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        document.getElementById('main-app').classList.add('flex');
        initGenerator();
    } else {
        document.getElementById('login-error').classList.remove('hidden');
    }
}

document.getElementById('password-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') checkPassword();
});

// Format Tanggal
function formatDate(dateString) {
    if (!dateString) return ".......................................";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Buat Hash Unik
function generateUniqueID(judul) {
    if (!judul) return "SRM-0000-0000";
    const datePart = new Date().toISOString().slice(2, 7).replace('-', '');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `SRM-${datePart}-${randomPart}`;
}

// Real-Time Update
function updatePreview() {
    const pencipta = document.getElementById('input-pencipta').value || ".......................................";
    const pemegang = document.getElementById('input-pemegang').value || ".......................................";
    const alamat = document.getElementById('input-alamat').value || ".......................................";
    const kewarganegaraan = document.getElementById('input-kewarganegaraan').value || "Indonesia";
    const judul = document.getElementById('input-judul').value || ".......................................";
    const album = document.getElementById('input-album').value;
    const tanggalOri = document.getElementById('input-tanggal').value;
    const tanggalFormat = formatDate(tanggalOri);
    
    const nomorUnik = generateUniqueID(document.getElementById('input-judul').value);

    // Tulis ke UI Kertas
    document.getElementById('tampil-pencipta').innerText = pencipta;
    document.getElementById('tampil-pemegang').innerText = pemegang;
    document.getElementById('tampil-alamat').innerText = alamat;
    document.getElementById('tampil-kewarganegaraan-1').innerText = kewarganegaraan;
    document.getElementById('tampil-kewarganegaraan-2').innerText = kewarganegaraan;
    document.getElementById('tampil-judul').innerText = judul;
    document.getElementById('tampil-tanggal').innerText = tanggalFormat;
    document.getElementById('tampil-ttd-tanggal').innerText = tanggalFormat !== "......................................." ? tanggalFormat : "........................";
    document.getElementById('tampil-nomor').innerText = nomorUnik;

    if (album.trim() === "") {
        document.getElementById('tampil-album').innerText = "- (Single)";
    } else {
        document.getElementById('tampil-album').innerText = album;
    }

    // QR Data
    const qrData = `NO: ${nomorUnik}\nPENCIPTA: ${pencipta}\nHAK CIPTA: ${pemegang}\nJUDUL: ${judul}\nALBUM: ${album || 'Single'}\nTANGGAL: ${tanggalFormat}`;
    
    document.getElementById('qrcode').innerHTML = "";
    qrCodeObj = new QRCode(document.getElementById("qrcode"), {
        text: qrData,
        width: 80,
        height: 80,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.L
    });
}

function initGenerator() {
    const inputs = document.querySelectorAll('form input');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
    updatePreview(); 
}

// Download PNG
function downloadImage() {
    const canvasElement = document.getElementById('certificate-canvas');
    html2canvas(canvasElement, { scale: 2, useCORS: true }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Sertifikat_${document.getElementById('input-judul').value || 'SAI_Roots'}.png`;
        link.href = imgData;
        link.click();
    });
}

// Download PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const canvasElement = document.getElementById('certificate-canvas');
    html2canvas(canvasElement, { scale: 2, useCORS: true }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Lisensi_${document.getElementById('input-judul').value || 'SAI_Roots'}.pdf`);
    });
}
