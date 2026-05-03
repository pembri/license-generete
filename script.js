const SECURITY_PIN = "Anjing526";
let qrCodeObj = null;

/* =========================
   LOGIN
========================= */
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

document.getElementById('password-input')
.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPassword();
});

/* =========================
   HELPER
========================= */
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

/* =========================
   UPDATE PREVIEW
========================= */
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
    document.getElementById('tampil-ttd-tanggal').innerText =
        tanggalFormat !== "......................................." ? tanggalFormat : "........................";
    document.getElementById('tampil-nomor').innerText = nomorUnik;
    document.getElementById('tampil-album').innerText =
        data.album.trim() === "" ? "- (Single)" : data.album;

    // QR
    document.getElementById('qrcode').innerHTML = "";
    const qrText = `NO: ${nomorUnik}
PENCIPTA: ${data.pencipta}
HAK CIPTA: ${data.pemegang}
JUDUL: ${data.judul}
ALBUM: ${data.album || 'Single'}
TANGGAL: ${tanggalFormat}`;

    const qrContainer = document.getElementById("qrcode");
qrContainer.innerHTML = "";

// Buat QR sementara
const tempQR = document.createElement("div");
new QRCode(tempQR, {
    text: qrText,
    width: 128,
    height: 128
});

// Tunggu render → ambil jadi IMG
setTimeout(() => {
    const canvas = tempQR.querySelector("canvas");
    if (canvas) {
        const img = document.createElement("img");
        img.src = canvas.toDataURL("image/png");
        img.style.width = "68px";
        img.style.height = "68px";

        qrContainer.innerHTML = "";
        qrContainer.appendChild(img);
    }
}, 100);
}

function initGenerator() {
    const inputs = document.querySelectorAll('form input');
    inputs.forEach(input => input.addEventListener('input', updatePreview));
    updatePreview();
}

/* =========================
   🔥 CORE FIX EXPORT
========================= */
function cloneForExport() {
    const original = document.getElementById('certificate-canvas');

    const clone = original.cloneNode(true);

    // Bungkus clone biar bersih (tanpa scale)
    const wrapper = document.createElement('div');
    wrapper.style.position = "fixed";
    wrapper.style.top = "-9999px";
    wrapper.style.left = "-9999px";
    wrapper.style.width = "794px";
    wrapper.style.height = "1123px";
    wrapper.style.background = "#ffffff";

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    return wrapper;
}

/* =========================
   EXPORT JPG
========================= */
function downloadImage() {
    const wrapper = cloneForExport();

    html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
    }).then(canvas => {

        const link = document.createElement('a');
        const fileName = document.getElementById('input-judul').value
            .replace(/[^a-zA-Z0-9]/g, '_') || 'SAI_Roots';

        link.download = `Sertifikat_${fileName}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 1.0);
        link.click();

        document.body.removeChild(wrapper);
    });
}

/* =========================
   EXPORT PDF
========================= */
function downloadPDF() {
    const wrapper = cloneForExport();

    const { jsPDF } = window.jspdf;

    html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
    }).then(canvas => {

        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        const pdf = new jsPDF('p', 'px', [794, 1123]);
        pdf.addImage(imgData, 'JPEG', 0, 0, 794, 1123);

        const fileName = document.getElementById('input-judul').value
            .replace(/[^a-zA-Z0-9]/g, '_') || 'SAI_Roots';

        pdf.save(`Lisensi_${fileName}.pdf`);

        document.body.removeChild(wrapper);
    });
}
