let absensi = [];

function checkIn() {
    let jamMasuk = new Date().toLocaleTimeString();
    let tanggal = new Date().toLocaleDateString();

    absensi.push({ tanggal, jamMasuk, jamKeluar: "-", totalJam: "-" });

    document.getElementById("btnCheckIn").disabled = true;
    document.getElementById("btnCheckOut").disabled = false;

    updateTable();
}

function checkOut() {
    let jamKeluar = new Date().toLocaleTimeString();
    let indexTerakhir = absensi.length - 1;

    let jamMasuk = new Date("1970/01/01 " + absensi[indexTerakhir].jamMasuk);
    let jamKeluarDate = new Date("1970/01/01 " + jamKeluar);
    let totalJamKerja = (jamKeluarDate - jamMasuk) / (1000 * 60 * 60);

    absensi[indexTerakhir].jamKeluar = jamKeluar;
    absensi[indexTerakhir].totalJam = totalJamKerja.toFixed(2) + " Jam";

    document.getElementById("btnCheckIn").disabled = false;
    document.getElementById("btnCheckOut").disabled = true;

    updateTable();
}

function updateTable() {
    let tbody = document.getElementById("absensiTable");
    tbody.innerHTML = "";

    absensi.forEach(data => {
        let row = `<tr>
            <td>${data.tanggal}</td>
            <td>${data.jamMasuk}</td>
            <td>${data.jamKeluar}</td>
            <td>${data.totalJam}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}
