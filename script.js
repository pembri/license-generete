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

document.getElementById('password-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') checkPassword(); });

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

    // Reset & Buat ulang QR Code
    document.getElementById('qrcode').innerHTML = "";
    const qrText = `NO: ${nomorUnik}\nPENCIPTA: ${data.pencipta}\nHAK CIPTA: ${data.pemegang}\nJUDUL: ${data.judul}\nALBUM: ${data.album || 'Single'}\nTANGGAL: ${tanggalFormat}`;
    
    qrCodeObj = new QRCode(document.getElementById("qrcode"), {
        text: qrText,
        width: 68,
        height: 68,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.M
    });
}

function initGenerator() {
    const inputs = document.querySelectorAll('#main-app input');
    inputs.forEach(input => input.addEventListener('input', updatePreview));
    updatePreview(); 
}

// Preview Modal
function openPreview() {
    updatePreview();
    document.getElementById('preview-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closePreview() {
    document.getElementById('preview-modal').classList.add('hidden');
    document.body.style.overflow = '';
}

// Tutup modal jika klik di luar area
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('preview-modal').addEventListener('click', function(e) {
        if (e.target === this) closePreview();
    });
});

// Engine Ekspor - capture langsung dari elemen asli tanpa transform
function captureCanvas() {
    return new Promise((resolve) => {
        updatePreview();
        // Sedikit delay agar QR Code selesai render
        setTimeout(() => {
            const element = document.getElementById('certificate-canvas');
            // Simpan & reset transform sementara agar html2canvas capture ukuran asli
            const wrapper = element.closest('.preview-scale-wrapper');
            const prevTransform = wrapper ? wrapper.style.transform : null;
            if (wrapper) wrapper.style.transform = 'scale(1)';

            html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
                logging: false,
                width: 794,
                height: 1123,
                scrollX: 0,
                scrollY: 0
            }).then(canvas => {
                if (wrapper && prevTransform !== null) wrapper.style.transform = prevTransform;
                resolve(canvas);
            });
        }, 300);
    });
}

function downloadImage() {
    captureCanvas().then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const link = document.createElement('a');
        const fileName = document.getElementById('input-judul').value.replace(/[^a-zA-Z0-9]/g, '_') || 'SAI_Roots';
        link.download = `Sertifikat_${fileName}.jpg`;
        link.href = imgData;
        link.click();
    });
}

function downloadPDF() {
    captureCanvas().then(canvas => {
        const { jsPDF } = window.jspdf;
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'px', [794, 1123]);
        pdf.addImage(imgData, 'JPEG', 0, 0, 794, 1123);
        const fileName = document.getElementById('input-judul').value.replace(/[^a-zA-Z0-9]/g, '_') || 'SAI_Roots';
        pdf.save(`Lisensi_${fileName}.pdf`);
    });
}

