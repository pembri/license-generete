const SECURITY_PIN = "Anjing526";

let qrCodeObj = null;
let currentID = null;

// ==========================
// LOGIN
// ==========================
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

// ==========================
// HELPER
// ==========================
function formatDate(dateString) {
    if (!dateString) return ".......................................";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function generateUniqueID() {
    const datePart = new Date().toISOString().slice(2, 7).replace('-', '');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `SRM-${datePart}-${randomPart}`;
}

// ==========================
// UPDATE PREVIEW
// ==========================
function updatePreview() {
    const data = {
        pencipta: document.getElementById('input-pencipta').value || ".......................................",
        pemegang: document.getElementById('input-pemegang').value || "SAI Roots Music",
        alamat: document.getElementById('input-alamat').value || ".......................................",
        judul: document.getElementById('input-judul').value || ".......................................",
        album: document.getElementById('input-album').value || "",
        tanggalOri: document.getElementById('input-tanggal').value
    };

    // ID hanya dibuat sekali
    if (!currentID) currentID = generateUniqueID();

    const tanggalFormat = formatDate(data.tanggalOri);

    // ======================
    // UPDATE TEXT
    // ======================
    document.getElementById('tampil-pencipta').innerText = data.pencipta;
    document.getElementById('tampil-pemegang').innerText = data.pemegang;
    document.getElementById('tampil-alamat').innerText = data.alamat;
    document.getElementById('tampil-judul').innerText = data.judul;
    document.getElementById('tampil-tanggal').innerText = tanggalFormat;
    document.getElementById('tampil-ttd-tanggal').innerText =
        tanggalFormat !== "......................................." ? tanggalFormat : "........................";
    document.getElementById('tampil-nomor').innerText = currentID;

    document.getElementById('tampil-album').innerText =
        (!data.album || data.album.trim() === "") ? "- (Single)" : data.album;

    // ======================
    // QR CODE (ANTI GLITCH)
    // ======================
    const qrText = `NO: ${currentID}
PENCIPTA: ${data.pencipta}
HAK CIPTA: ${data.pemegang}
JUDUL: ${data.judul}
ALBUM: ${data.album || 'Single'}
TANGGAL: ${tanggalFormat}`;

    const qrContainer = document.getElementById('qrcode');

    // Hapus isi lama TANPA numpuk
    qrContainer.innerHTML = "";

    qrCodeObj = new QRCode(qrContainer, {
        text: qrText,
        width: 68,
        height: 68,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
    });
}

// ==========================
// INIT
// ==========================
function initGenerator() {
    const inputs = document.querySelectorAll('#cert-form input');
    inputs.forEach(input => input.addEventListener('input', updatePreview));

    updatePreview();
}

// ==========================
// EXPORT IMAGE
// ==========================
function downloadImage() {
    window.scrollTo(0, 0);

    const element = document.getElementById('certificate-canvas');

    html2canvas(element, {
        scale: 3, // 🔥 lebih tajam
        useCORS: true,
        backgroundColor: "#ffffff",
        width: 794,
        height: 1123,
        logging: false
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        const link = document.createElement('a');
        const fileName = document.getElementById('input-judul').value.replace(/[^a-zA-Z0-9]/g, '_') || 'SAI_Roots';

        link.download = `Sertifikat_${fileName}.jpg`;
        link.href = imgData;
        link.click();
    });
}

// ==========================
// EXPORT PDF
// ==========================
function downloadPDF() {
    window.scrollTo(0, 0);

    const { jsPDF } = window.jspdf;
    const element = document.getElementById('certificate-canvas');

    html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: 794,
        height: 1123,
        logging: false
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        const pdf = new jsPDF('p', 'px', [794, 1123]);
        pdf.addImage(imgData, 'JPEG', 0, 0, 794, 1123);

        const fileName = document.getElementById('input-judul').value.replace(/[^a-zA-Z0-9]/g, '_') || 'SAI_Roots';

        pdf.save(`Lisensi_${fileName}.pdf`);
    });
}
