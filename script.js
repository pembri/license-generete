const SECURITY_PIN = "Anjing526";

let qrCode = null;
let fixedID = null;

// ==========================
// LOGIN
// ==========================
function checkPassword() {
    const input = document.getElementById("password-input").value;

    if (input === SECURITY_PIN) {
        document.getElementById("login-screen").classList.add("hidden");
        document.getElementById("main-app").classList.remove("hidden");
        document.getElementById("main-app").classList.add("flex");
        init();
    } else {
        document.getElementById("login-error").classList.remove("hidden");
    }
}

document.getElementById("password-input")
.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkPassword();
});

// ==========================
// HELPER
// ==========================
function formatDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function generateID() {
    const d = new Date();
    return "SRM-" + d.getFullYear().toString().slice(2) +
        (d.getMonth()+1) + "-" +
        Math.floor(1000 + Math.random()*9000);
}

// ==========================
// UPDATE PREVIEW
// ==========================
function updatePreview() {

    if (!fixedID) fixedID = generateID();

    const pencipta = document.getElementById("input-pencipta").value || "-";
    const pemegang = document.getElementById("input-pemegang").value || "SAI Roots Music";
    const judul = document.getElementById("input-judul").value || "-";
    const album = document.getElementById("input-album").value || "-";
    const tanggal = formatDate(document.getElementById("input-tanggal").value);

    document.getElementById("tampil-pencipta").innerText = pencipta;
    document.getElementById("tampil-pemegang").innerText = pemegang;
    document.getElementById("tampil-judul").innerText = judul;
    document.getElementById("tampil-album").innerText = album.trim() === "" ? "-" : album;
    document.getElementById("tampil-tanggal").innerText = tanggal;
    document.getElementById("tampil-ttd-tanggal").innerText = tanggal;
    document.getElementById("tampil-nomor").innerText = fixedID;

    // QR
    const qrText = `NO: ${fixedID}
PENCIPTA: ${pencipta}
JUDUL: ${judul}`;

    const qrBox = document.getElementById("qrcode");
    qrBox.innerHTML = "";

    qrCode = new QRCode(qrBox, {
        text: qrText,
        width: 68,
        height: 68
    });
}

// ==========================
// INIT
// ==========================
function init() {
    document.querySelectorAll("#cert-form input")
        .forEach(i => i.addEventListener("input", updatePreview));

    updatePreview();
}

// ==========================
// EXPORT ENGINE (ANTI ERROR)
// ==========================
function renderCanvas(callback) {

    const el = document.getElementById("certificate-canvas");

    // clone biar aman
    const clone = el.cloneNode(true);

    clone.style.position = "fixed";
    clone.style.top = "0";
    clone.style.left = "0";
    clone.style.width = "794px";
    clone.style.height = "1123px";
    clone.style.background = "#fff";
    clone.style.zIndex = "9999";

    document.body.appendChild(clone);

    html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
    }).then(canvas => {
        document.body.removeChild(clone);
        callback(canvas);
    });
}

// ==========================
// JPG
// ==========================
function downloadImage() {
    renderCanvas((canvas) => {
        const link = document.createElement("a");
        link.download = "sertifikat.jpg";
        link.href = canvas.toDataURL("image/jpeg", 1.0);
        link.click();
    });
}

// ==========================
// PDF
// ==========================
function downloadPDF() {
    const { jsPDF } = window.jspdf;

    renderCanvas((canvas) => {
        const img = canvas.toDataURL("image/jpeg", 1.0);

        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(img, "JPEG", 0, 0, 210, 297);
        pdf.save("sertifikat.pdf");
    });
}
