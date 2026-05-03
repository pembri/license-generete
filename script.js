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
    qrCodeObj = new QRCode(document.getElementById("qrcode"), {
        text: "SAI ROOTS MUSIC VERIFIED",
        width: 256,
        height: 256,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.L
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

    document.getElementById('tampil-pencipta').innerText = data.pencipta;
    document.getElementById('tampil-pemegang').innerText = data.pemegang;
    document.getElementById('tampil-alamat').innerText = data.alamat;
    document.getElementById('tampil-judul').innerText = data.judul;
    document.getElementById('tampil-tanggal').innerText = tanggalFormat;
    document.getElementById('tampil-ttd-tanggal').innerText = tanggalFormat !== "......................................." ? tanggalFormat : "........................";
    document.getElementById('tampil-nomor').innerText = nomorUnik;
    document.getElementById('tampil-album').innerText = data.album.trim() === "" ? "- (Single)" : data.album;

    const qrText = `NO: ${nomorUnik}\nPENCIPTA: ${data.pencipta}\nHAK CIPTA: ${data.pemegang}\nJUDUL: ${data.judul}\nALBUM: ${data.album || 'Single'}\nTANGGAL: ${tanggalFormat}`;
    if (qrCodeObj) {
        qrCodeObj.makeCode(qrText);
    }
}

// ==========================================
// 4. LOGIKA MODAL PREVIEW 
// ==========================================
function openPreview() {
    const modal = document.getElementById('preview-modal');
    const wrapper = document.querySelector('.preview-wrapper');
    
    modal.style.display = 'block';
    
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
// 5. ENGINE EKSPOR (ANTI BLANK & ANTI TEKS NUMPUK)
// ==========================================

async function captureCanvas() {
    window.scrollTo(0, 0); 
    const modal = document.getElementById('preview-modal');
    const wrapper = document.querySelector('.preview-wrapper');
    const element = document.getElementById('certificate-canvas');

    // Simpan posisi asli biar bisa dibalikin nanti
    const oldDisplay = modal.style.display;
    const oldTransform = wrapper.style.transform;
    const oldOpacity = modal.style.opacity;

    // Tampilkan ukuran 1:1, tapi kasih opacity 0.01 biar gak kedip jelas di layar lu
    modal.style.display = 'block';
    modal.style.opacity = '0.01'; 
    wrapper.style.transform = 'scale(1)'; 

    // WAJIB: Kasih waktu browser 300ms buat nyiapin rendering pikselnya (Solusi layar blank)
    await new Promise(r => setTimeout(r, 300));

    try {
        const canvas = await html2canvas(element, { 
            scale: 2, // Resolusi tinggi
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
            width: 794, 
            height: 1123, 
            windowWidth: 794,
            windowHeight: 1123,
            onclone: (clonedDoc) => {
                // SOLUSI TEKS KESURUPAN/NUMPUK: Matikan CSS yang bikin bug html2canvas
                const allElements = clonedDoc.querySelectorAll('*');
                allElements.forEach(el => {
                    const style = window.getComputedStyle(el);
                    if (style.letterSpacing !== 'normal') {
                        el.style.letterSpacing = 'normal';
                    }
                    if (style.textAlign === 'justify') {
                        el.style.textAlign = 'left';
                    }
                });
            }
        });
        return canvas;
    } finally {
        // Balikin kondisi UI kaya semula
        modal.style.display = oldDisplay;
        modal.style.opacity = oldOpacity || '1';
        wrapper.style.transform = oldTransform;
    }
}

function downloadImage() {
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = "Memproses... ⏳";
    btn.disabled = true;

    captureCanvas().then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        const fileName = document.getElementById('input-judul').value.replace(/[^a-zA-Z0-9]/g, '_') || 'SAI_Roots';
        link.download = `Sertifikat_${fileName}.png`;
        link.href = imgData;
        link.click();
        
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
