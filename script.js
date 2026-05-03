const SECURITY_PIN = "Anjing526";
let qrCodeObj = null;

// =========================================
// 1. KEAMANAN AKSES
// =========================================
function checkPassword() {
    const input = document.getElementById('password-input').value;
    if (input === SECURITY_PIN) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        document.getElementById('main-app').classList.add('flex');
        initGenerator();
    } else {
        const err = document.getElementById('login-error');
        err.classList.remove('hidden');
        setTimeout(() => err.classList.add('hidden'), 3000);
    }
}

document.getElementById('password-input').addEventListener('keypress', (e) => { 
    if (e.key === 'Enter') checkPassword(); 
});

// =========================================
// 2. HELPER & FORMATTING
// =========================================
function formatDate(dateString) {
    if (!dateString) return ".......................................";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function generateUniqueID() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `SRM-${year}${month}-${random}`;
}

// =========================================
// 3. CORE ENGINE (UPDATE DATA & QR)
// =========================================
function updateAllData() {
    const fields = {
        'pencipta': 'input-pencipta',
        'pemegang': 'input-pemegang',
        'alamat': 'input-alamat',
        'judul': 'input-judul',
        'album': 'input-album',
        'tanggal': 'input-tanggal'
    };

    const val = {};
    for (let key in fields) {
        val[key] = document.getElementById(fields[key]).value;
    }

    // Update Teks di Source Render (Hidden)
    document.getElementById('tampil-pencipta').innerText = val.pencipta || ".......................................";
    document.getElementById('tampil-pemegang').innerText = val.pemegang || "SAI ROOTS MUSIC";
    document.getElementById('tampil-alamat').innerText = val.alamat || "Jombang, Jawa Timur";
    document.getElementById('tampil-judul').innerText = val.judul || ".......................................";
    document.getElementById('tampil-album').innerText = val.album ? val.album : "- (Single)";
    
    const tglFormatted = formatDate(val.tanggal);
    document.getElementById('tampil-tanggal').innerText = tglFormatted;
    document.getElementById('tampil-ttd-tanggal').innerText = val.tanggal ? tglFormatted : "........................";
    
    // ID Unik (Hanya ganti jika judul diisi)
    if (val.judul && document.getElementById('tampil-nomor').innerText === "SRM-0000-0000") {
        document.getElementById('tampil-nomor').innerText = generateUniqueID();
    }

    // Update QR Code (Kunci Keamanan)
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = "";
    const metaData = `VERIFIED BY SAI ROOTS\nID: ${document.getElementById('tampil-nomor').innerText}\nKarya: ${val.judul}\nPencipta: ${val.pencipta}`;
    
    new QRCode(qrContainer, {
        text: metaData,
        width: 85,
        height: 85,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

function initGenerator() {
    const inputs = document.querySelectorAll('#cert-form input');
    inputs.forEach(input => {
        input.addEventListener('input', updateAllData);
    });
    updateAllData();
}

// =========================================
// 4. PREVIEW MODAL LOGIC (MOBILE FRIENDLY)
// =========================================
function openPreview() {
    const modal = document.getElementById('preview-modal');
    const visualArea = document.getElementById('visual-preview-area');
    const source = document.getElementById('certificate-render-source');

    // Clone source ke dalam modal
    visualArea.innerHTML = "";
    const clone = source.cloneNode(true);
    clone.id = "preview-clone";
    visualArea.appendChild(clone);

    // Hitung scaling agar pas di layar HP/Desktop
    const wrapper = document.getElementById('modal-content-wrapper');
    const screenWidth = window.innerWidth;
    const scale = screenWidth < 850 ? (screenWidth - 40) / 794 : 1;
    wrapper.style.transform = `scale(${scale})`;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // Lock scroll
}

function closePreview() {
    document.getElementById('preview-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// =========================================
// 5. DOWNLOAD ENGINE (HIGH-RES CAPTURE)
// =========================================
async function captureHandle() {
    // Selalu ambil dari SOURCE asli yang tersembunyi (1:1 scale)
    const source = document.getElementById('certificate-render-source');
    
    return await html2canvas(source, {
        scale: 2, // Double DPI biar tajam pas dicetak
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123
    });
}

async function downloadImage() {
    const btn = event.target;
    btn.innerText = "PROCESSING...";
    
    const canvas = await captureHandle();
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const link = document.createElement('a');
    const judul = document.getElementById('input-judul').value || 'Sertifikat';
    
    link.download = `SAI_ROOTS_${judul.replace(/\s+/g, '_')}.jpg`;
    link.href = imgData;
    link.click();
    
    btn.innerHTML = "🖼️ DOWNLOAD JPG";
}

async function downloadPDF() {
    const btn = event.target;
    btn.innerText = "PROCESSING...";

    const canvas = await captureHandle();
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const { jsPDF } = window.jspdf;
    
    // A4 Portrait: 210mm x 297mm
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    
    const judul = document.getElementById('input-judul').value || 'Sertifikat';
    pdf.save(`Lisensi_SAI_ROOTS_${judul.replace(/\s+/g, '_')}.pdf`);
    
    btn.innerHTML = "📄 DOWNLOAD PDF";
}
