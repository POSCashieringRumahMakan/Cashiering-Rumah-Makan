let absensi = JSON.parse(localStorage.getItem("absensi")) || [];
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    alert("Anda harus login terlebih dahulu!");
    window.location.href = "masuk.html";
}

document.querySelector(".absensi-container p strong").textContent = user.nama;

let absensiStatus = JSON.parse(localStorage.getItem("absensiStatus")) || {};

document.getElementById("btnCheckIn").disabled = absensiStatus.checkIn;
document.getElementById("btnCheckOut").disabled = !absensiStatus.checkIn;

function saveAbsensiToLocalStorage() {
    localStorage.setItem("absensi", JSON.stringify(absensi));
}

function renderAbsensiTable() {
    let tbody = document.getElementById("absensiTable");
    tbody.innerHTML = "";

    absensi.forEach(item => {
        let row = `<tr>
            <td>${item.tanggal}</td>
            <td>${item.jam_masuk}</td>
            <td>${item.jam_keluar || "-"}</td>
            <td>${item.total_jam || "-"}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

renderAbsensiTable();

function getCurrentTime() {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta' // Sesuaikan zona waktu jika perlu
    }).format(new Date()).replaceAll("/", "-");
}

async function checkIn() {
    let now = new Date();
    let jamMasuk = getCurrentTime().split(" ")[1];
    let tanggal = getCurrentTime().split(" ")[0];

    try {
        const response = await fetch("http://localhost:8000/api/absensi.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                pengguna_id: user.id,
                tanggal: tanggal,
                jam_masuk: jamMasuk,
            }),
        });

        if (!response.ok) throw new Error("Gagal melakukan check-in");

        absensiStatus = { checkIn: true, jamMasuk, tanggal };
        localStorage.setItem("absensiStatus", JSON.stringify(absensiStatus));

        document.getElementById("btnCheckIn").disabled = true;
        document.getElementById("btnCheckOut").disabled = false;

        absensi.push({ tanggal, jam_masuk: jamMasuk, jam_keluar: "-", total_jam: "-" });
        saveAbsensiToLocalStorage();
        renderAbsensiTable();
    } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan saat check-in.");
    }
}

async function checkOut() {
    let now = new Date();
    let jamKeluar = getCurrentTime().split(" ")[1];

    if (!absensiStatus.jamMasuk) {
        alert("Anda belum melakukan check-in!");
        return;
    }

    try {
        let response = await fetch(`http://localhost:8000/api/absensi.php?id=${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                pengguna_id: user.id,
                jam_keluar: jamKeluar
            }),
        });

        if (!response.ok) throw new Error("Gagal check-out");

        localStorage.removeItem("absensiStatus");
        document.getElementById("btnCheckIn").disabled = false;
        document.getElementById("btnCheckOut").disabled = true;

        absensi = absensi.map(item => {
            if (item.tanggal === absensiStatus.tanggal && item.jam_masuk === absensiStatus.jamMasuk) {
                let jamMasukTime = new Date(`1970-01-01T${absensiStatus.jamMasuk}`);
                let jamKeluarTime = new Date(`1970-01-01T${jamKeluar}`);
                let totalMilliseconds = jamKeluarTime - jamMasukTime;
                let totalMenit = Math.floor(totalMilliseconds / (1000 * 60));
                let totalJam = Math.floor(totalMenit / 60);
                let sisaMenit = totalMenit % 60;
                let totalWaktu = totalJam > 0 ? `${totalJam} jam ${sisaMenit} menit` : `${sisaMenit} menit`;
                return { ...item, jam_keluar: jamKeluar, total_jam: totalWaktu };
            }
            return item;
        });

        saveAbsensiToLocalStorage();
        renderAbsensiTable();
    } catch (error) {
        console.error("Error saat check-out:", error);
        alert("Terjadi kesalahan saat check-out.");
    }
}

async function fetchAbsensi() {
    try {
        const response = await fetch(`http://localhost:8000/api/absensi.php?pengguna_id=${user.id}`);
        if (!response.ok) throw new Error("Gagal mengambil data absensi");
        const data = await response.json();
        absensi = data;
        saveAbsensiToLocalStorage();
        renderAbsensiTable();
    } catch (error) {
        console.error("Error fetching absensi:", error);
        renderAbsensiTable();
    }
}

fetchAbsensi();
