const SECURITY_PIN = "Anjing526";

// =========================================
// 1. SISTEM KEAMANAN
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
    }
}

// Support Enter Key
document.getElementById('password-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPassword();
});

// =========================================
// 2. LOGIKA MODAL & SCALING (ANTI-POTONG)
// =========================================
function openPreview() {
    updatePreview();
    const modal = document.getElementById('preview-modal');
    const cert = document.getElementById('certificate-canvas');
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Hitung skala otomatis agar pas di layar (Responsive Scaling)
    const padding = 40;
    const availableWidth = window.innerWidth - padding;
    const certWidth = 794;
    
    if (availableWidth < certWidth) {
        const scaleVal = availableWidth / certWidth;
        cert.style.transform = `scale(${scaleVal})`;
        cert.style.transformOrigin = 'top center';
    } else {
        cert.style.transform = 'scale(1)';
    }
}

function closePreview() {
    document.getElementById('preview-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// =========================================
// 3. GENERATOR DATA & QR CODE
// =========================================
function generateUniqueID(judul) {
    if (!judul || judul === ".......................................") return "SRM-0000-0000";
    const datePart = new Date().toISOString().slice(2, 7).replace('-', '');
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
        tanggal: document.getElementById('input-tanggal').value
    };

    // Format Tanggal Indonesia
    let tglIndo = ".......................................";
    if (data.tanggal) {
        tglIndo = new Date(data.tanggal).toLocaleDateString('id-ID', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });
    }

    const nomorID = generateUniqueID(data.judul);

    // Update Elemen Sertifikat
    document.getElementById('tampil-pencipta').innerText = data.pencipta;
    document.getElementById('tampil-pemegang').innerText = data.pemegang;
    document.getElementById('tampil-alamat').innerText = data.alamat;
    document.getElementById('tampil-judul').innerText = data.judul;
    document.getElementById('tampil-tanggal').innerText = tglIndo;
    document.getElementById('tampil-ttd-tanggal').innerText = (data.tanggal) ? tglIndo : "........................";
    document.getElementById('tampil-nomor').innerText = nomorID;
    document.getElementById('tampil-album').innerText = data.album.trim() === "" ? "- (Single)" : data.album;

    // Generate QR Code
    const qrDiv = document.getElementById('qrcode');
    qrDiv.innerHTML = "";
    new QRCode(qrDiv, {
        text: `VERIFIED: ${nomorID}\nTITLE: ${data.judul}\nBY: ${data.pencipta}\n(C) SAI ROOTS MUSIC`,
        width: 68,
        height: 68,
        correctLevel: QRCode.CorrectLevel.H
    });
}

function initGenerator() {
    // Inisialisasi awal jika diperlukan
    updatePreview();
}

// =========================================
// 4. ENGINE EXPORT PNG HD & PDF (ANTI-AMBURADUL)
// =========================================

async function captureHighRes() {
    updatePreview();
    const cert = document.getElementById('certificate-canvas');
    const modal = document.getElementById('preview-modal');
    
    // Simpan status asli
    const originalStyle = cert.style.transform;
    const wasHidden = modal.classList.contains('hidden');

    // STEP 1: Persiapan Render Bersih
    modal.classList.remove('hidden');
    cert.style.transform = "scale(1)"; // Reset ke ukuran asli A4
    cert.style.transformOrigin = "top left";

    // Berikan waktu (delay) 300ms agar QR Code & Image Bingkai ter-load sempurna
    await new Promise(resolve => setTimeout(resolve, 300));

    // STEP 2: Pemotretan PNG HD
    const canvas = await html2canvas(cert, {
        scale: 4, // Kualitas Tinggi
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 794,
        height: 1123,
        scrollX: 0,
        scrollY: 0
    });

    // STEP 3: Kembalikan tampilan preview
    cert.style.transform = originalStyle;
    if (wasHidden) modal.classList.add('hidden');

    return canvas;
}

async function downloadImage() {
    const canvas = await captureHighRes();
    const judul = document.getElementById('input-judul').value || "Sertifikat";
    const link = document.createElement('a');
    link.download = `SAI-ROOTS-${judul.toUpperCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
}

async function downloadPDF() {
    const canvas = await captureHighRes();
    const { jsPDF } = window.jspdf;
    const judul = document.getElementById('input-judul').value || "Sertifikat";
    
    // PDF ukuran A4 (794x1123 px ≈ 210x297 mm)
    const pdf = new jsPDF('p', 'px', [794, 1123]);
    const imgData = canvas.toDataURL('image/png');
    
    pdf.addImage(imgData, 'PNG', 0, 0, 794, 1123);
    pdf.save(`LISENSI-SAI-ROOTS-${judul.toUpperCase().replace(/\s+/g, '-')}.pdf`);
}
