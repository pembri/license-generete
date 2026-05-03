const SECURITY_PIN = "Anjing526";
let qrCodeObj = null;

// ==========================================
// 1. SISTEM KEAMANAN & LOGIN
// ==========================================
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

document.getElementById('password-input').addEventListener('keypress', (e) => { 
    if (e.key === 'Enter') checkPassword(); 
});

// ==========================================
// 2. HELPER (FORMAT TANGGAL & ID UNIK)
// ==========================================
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

// ==========================================
// 3. ENGINE GENERATOR & QR CODE FIX
// ==========================================
function initGenerator() {
    // FIX QR CODE: Inisialisasi HANYA SEKALI di awal untuk mencegah memory leak/crash
    qrCodeObj = new QRCode(document.getElementById("qrcode"), {
        text: "SAI ROOTS MUSIC VERIFIED",
        width: 68,
        height: 68,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.M
    });

    const inputs = document.querySelectorAll('form input');
    inputs.forEach(input => input.addEventListener('input', updatePreview));
    updatePreview(); 
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

    // Tulis Text ke Kertas
    document.getElementById('tampil-pencipta').innerText = data.pencipta;
    document.getElementById('tampil-pemegang').innerText = data.pemegang;
    document.getElementById('tampil-alamat').innerText = data.alamat;
    document.getElementById('tampil-judul').innerText = data.judul;
    document.getElementById('tampil-tanggal').innerText = tanggalFormat;
    document.getElementById('tampil-ttd-tanggal').innerText = tanggalFormat !== "......................................." ? tanggalFormat : "........................";
    document.getElementById('tampil-nomor').innerText = nomorUnik;
    document.getElementById('tampil-album').innerText = data.album.trim() === "" ? "- (Single)" : data.album;

    // FIX QR CODE: Update text QR saja tanpa membuat elemen baru
    const qrText = `NO: ${nomorUnik}\nPENCIPTA: ${data.pencipta}\nHAK CIPTA: ${data.pemegang}\nJUDUL: ${data.judul}\nALBUM: ${data.album || 'Single'}\nTANGGAL: ${tanggalFormat}`;
    if (qrCodeObj) {
        qrCodeObj.makeCode(qrText);
    }
}

// ==========================================
// 4. LOGIKA MODAL PREVIEW (ANTI KEPOTONG)
// ==========================================
function openPreview() {
    const modal = document.getElementById('preview-modal');
    const wrapper = document.querySelector('.preview-wrapper');
    
    modal.style.display = 'block';
    
    // Auto-scale preview agar muat di layar HP/Laptop tanpa mengubah ukuran asli canvas untuk download
    const scale = Math.min(
        (window.innerWidth - 40) / 794,
        (window.innerHeight - 100) / 1123
    );
    
    if (scale < 1) {
        wrapper.style.transform = `scale(${scale})`;
    } else {
        wrapper.style.transform = `scale(1)`;
    }
}

function closePreview() {
    document.getElementById('preview-modal').style.display = 'none';
}

// ==========================================
// 5. ENGINE EKSPOR MUTLAK (ANTI BERBAYANG)
// ==========================================

// Fungsi inti untuk render canvas dengan aman
async function captureCanvas() {
    window.scrollTo(0, 0); // Cegah bug scroll
    const element = document.getElementById('certificate-canvas');
    
    return await html2canvas(element, { 
        scale: 2, // Kualitas tinggi (Retina/Print Ready)
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794, // Paksa lebar asli A4
        height: 1123, // Paksa tinggi asli A4
        onclone: (clonedDoc) => {
            // FIX BERBAYANG: Pastikan elemen clone bersih dari efek CSS Transform sebelum difoto
            const clonedElement = clonedDoc.getElementById('certificate-canvas');
            clonedElement.style.transform = 'none';
        }
    });
}

function downloadImage() {
    // Ubah teks tombol sementara
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = "Memproses... ⏳";
    btn.disabled = true;

    captureCanvas().then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const link = document.createElement('a');
        const fileName = document.getElementById('input-judul').value.replace(/[^a-zA-Z0-9]/g, '_') || 'SAI_Roots';
        link.download = `Sertifikat_${fileName}.jpg`;
        link.href = imgData;
        link.click();
        
        // Kembalikan tombol
        btn.innerHTML = originalText;
        btn.disabled = false;
    }).catch(err => {
        console.error("Gagal Render:", err);
        alert("Gagal menyimpan gambar. Coba lagi.");
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
}

function downloadPDF() {
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = "Memproses... ⏳";
    btn.disabled = true;

    const { jsPDF } = window.jspdf;
    
    captureCanvas().then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'px', [794, 1123]);
        pdf.addImage(imgData, 'JPEG', 0, 0, 794, 1123);
        const fileName = document.getElementById('input-judul').value.replace(/[^a-zA-Z0-9]/g, '_') || 'SAI_Roots';
        pdf.save(`Lisensi_${fileName}.pdf`);
        
        btn.innerHTML = originalText;
        btn.disabled = false;
    }).catch(err => {
        console.error("Gagal Render PDF:", err);
        alert("Gagal menyimpan PDF. Coba lagi.");
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
}
