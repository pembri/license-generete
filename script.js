const SECURITY_PIN = "Anjing526";

// =========================================
// 1. SISTEM KEAMANAN & AKSES
// =========================================
function checkPassword() {
    const input = document.getElementById('password-input').value;
    const errorMsg = document.getElementById('login-error');
    
    if (input === SECURITY_PIN) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        document.getElementById('main-app').classList.add('flex');
        initGenerator();
    } else {
        errorMsg.classList.remove('hidden');
        setTimeout(() => errorMsg.classList.add('hidden'), 3000);
    }
}

// Support Enter key for login
document.getElementById('password-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPassword();
});

// =========================================
// 2. LOGIKA MODAL PRATINJAU
// =========================================
function openPreview() {
    updatePreview();
    document.getElementById('preview-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Lock scroll
}

function closePreview() {
    document.getElementById('preview-modal').classList.add('hidden');
    document.body.style.overflow = 'auto'; // Unlock scroll
}

// =========================================
// 3. ENGINE GENERATOR DATA
// =========================================
function formatDate(dateString) {
    if (!dateString) return ".......................................";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function generateUniqueID(judul) {
    if (!judul || judul === ".......................................") return "SRM-0000-0000";
    const now = new Date();
    const datePart = now.toISOString().slice(2, 7).replace('-', '');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `SRM-${datePart}-${randomPart}`;
}

function updatePreview() {
    const data = {
        pencipta: document.getElementById('input-pencipta').value || ".......................................",
        pemegang: document.getElementById('input-pemegang').value || "SAI Roots Music",
        alamat: document.getElementById('input-alamat').value || ".......................................",
        judul: document.getElementById('input-judul').value || ".......................................",
        album: document.getElementById('input-album').value,
        tanggalOri: document.getElementById('input-tanggal').value
    };
    
    const tanggalFormat = formatDate(data.tanggalOri);
    const nomorUnik = generateUniqueID(data.judul);

    // Update Teks di Sertifikat
    document.getElementById('tampil-pencipta').innerText = data.pencipta;
    document.getElementById('tampil-pemegang').innerText = data.pemegang;
    document.getElementById('tampil-alamat').innerText = data.alamat;
    document.getElementById('tampil-judul').innerText = data.judul;
    document.getElementById('tampil-tanggal').innerText = tanggalFormat;
    document.getElementById('tampil-ttd-tanggal').innerText = (data.tanggalOri) ? tanggalFormat : "........................";
    document.getElementById('tampil-nomor').innerText = nomorUnik;
    document.getElementById('tampil-album').innerText = data.album.trim() === "" ? "- (Single)" : data.album;

    // Update QR Code
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = "";
    const qrText = `REG: ${nomorUnik}\nKARYA: ${data.judul}\nPENCIPTA: ${data.pencipta}\nLABEL: ${data.pemegang}`;
    
    new QRCode(qrContainer, {
        text: qrText,
        width: 68,
        height: 68,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.M
    });
}

function initGenerator() {
    const inputs = document.querySelectorAll('#cert-form input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            // Kita tidak update live ke modal yang tertutup untuk hemat performa
            // Cukup update saat modal dibuka atau saat tombol download ditekan
        });
    });
}

// =========================================
// 4. SISTEM EXPORT (FIX ANTI-AMBURADUL)
// =========================================

async function getHighResCanvas() {
    updatePreview(); // Pastikan data terbaru
    const element = document.getElementById('certificate-canvas');
    const modal = document.getElementById('preview-modal');
    
    // Simpan status modal asli
    const wasHidden = modal.classList.contains('hidden');
    
    // STEP 1: Munculkan elemen secara transparan agar bisa di-capture 1:1 (Tanpa Scaling CSS)
    modal.classList.remove('hidden');
    const originalTransform = element.style.transform;
    element.style.transform = "none"; // Reset scale ke 100%
    
    // STEP 2: Capture dengan skala tinggi
    const canvas = await html2canvas(element, { 
        scale: 3, // Sangat tajam untuk cetak
        useCORS: true, 
        logging: false,
        backgroundColor: "#ffffff",
        width: 794,
        height: 1123
    });
    
    // STEP 3: Kembalikan tampilan seperti semula
    element.style.transform = originalTransform;
    if (wasHidden) modal.classList.add('hidden');
    
    return canvas;
}

async function downloadImage() {
    const canvas = await getHighResCanvas();
    const judulLagu = document.getElementById('input-judul').value || "Sertifikat";
    const link = document.createElement('a');
    link.download = `SAI-ROOTS-${judulLagu.toUpperCase().replace(/\s+/g, '-')}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
}

async function downloadPDF() {
    const canvas = await getHighResCanvas();
    const { jsPDF } = window.jspdf;
    const judulLagu = document.getElementById('input-judul').value || "Sertifikat";
    
    // Ukuran A4 dalam poin (pixel 96dpi ke point)
    const pdf = new jsPDF('p', 'px', [794, 1123]);
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    
    pdf.addImage(imgData, 'JPEG', 0, 0, 794, 1123);
    pdf.save(`Lisensi-${judulLagu.toUpperCase().replace(/\s+/g, '-')}.pdf`);
}
