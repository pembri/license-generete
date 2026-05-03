const SECURITY_PIN = "Anjing526";
let qrCodeObj = null;

// Keamanan
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

// Helper
function formatDate(dateString) {
    if (!dateString) return ".......................................";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function generateUniqueID(judul) {
    if (!judul) return "SRM-0000-0000";
    const datePart = new Date().toISOString().slice(2, 7).replace('-', '');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `SRM-${datePart}-${randomPart}`;
}

// Engine Update
function updatePreview() {
    const pencipta = document.getElementById('input-pencipta').value || ".......................................";
    const pemegang = document.getElementById('input-pemegang').value || "SAI Roots Music";
    const alamat = document.getElementById('input-alamat').value || ".......................................";
    const judul = document.getElementById('input-judul').value || ".......................................";
    const album = document.getElementById('input-album').value;
    const tanggalOri = document.getElementById('input-tanggal').value;
    const tanggalFormat = formatDate(tanggalOri);
    const nomorUnik = generateUniqueID(judul);

    // Tulis Text
    document.getElementById('tampil-pencipta').innerText = pencipta;
    document.getElementById('tampil-pemegang').innerText = pemegang;
    document.getElementById('tampil-alamat').innerText = alamat;
    document.getElementById('tampil-judul').innerText = judul;
    document.getElementById('tampil-tanggal').innerText = tanggalFormat;
    document.getElementById('tampil-ttd-tanggal').innerText = tanggalFormat !== "......................................." ? tanggalFormat : "........................";
    document.getElementById('tampil-nomor').innerText = nomorUnik;
    document.getElementById('tampil-album').innerText = album.trim() === "" ? "- (Single)" : album;

    // Reset & Buat ulang QR Code
    document.getElementById('qrcode').innerHTML = "";
    const qrData = `NO: ${nomorUnik}\nPENCIPTA: ${pencipta}\nHAK CIPTA: ${pemegang}\nJUDUL: ${judul}\nALBUM: ${album || 'Single'}\nTANGGAL: ${tanggalFormat}`;
    
    qrCodeObj = new QRCode(document.getElementById("qrcode"), {
        text: qrData,
        width: 68, // Ukuran Pas Kertas
        height: 68, // Ukuran Pas Kertas
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.M
    });
}

function initGenerator() {
    const inputs = document.querySelectorAll('form input');
    inputs.forEach(input => input.addEventListener('input', updatePreview));
    updatePreview(); 
}

// Ekspor ke Gambar JPG Resolusi Tinggi (Anti Kepotong)
function downloadImage() {
    window.scrollTo(0, 0); // Cegah bug html2canvas kepotong saat di-scroll
    const element = document.getElementById('certificate-canvas');
    html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: "#ffffff"
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const link = document.createElement('a');
        const fileName = document.getElementById('input-judul').value.replace(/[^a-zA-Z0-9]/g, '_') || 'SAI_Roots';
        link.download = `Sertifikat_${fileName}.jpg`;
        link.href = imgData;
        link.click();
    });
}

// Ekspor ke PDF (Ukuran Standar A4)
function downloadPDF() {
    window.scrollTo(0, 0); // Cegah bug html2canvas
    const { jsPDF } = window.jspdf;
    const element = document.getElementById('certificate-canvas');
    html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: "#ffffff"
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'px', [794, 1123]); // Paksakan ke ukuran pixel kertas
        pdf.addImage(imgData, 'JPEG', 0, 0, 794, 1123);
        const fileName = document.getElementById('input-judul').value.replace(/[^a-zA-Z0-9]/g, '_') || 'SAI_Roots';
        pdf.save(`Lisensi_${fileName}.pdf`);
    });
}
