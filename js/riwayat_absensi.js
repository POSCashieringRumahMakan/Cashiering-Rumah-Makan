document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Anda harus login terlebih dahulu!");
        window.location.href = "masuk.html";
        return;
    }
    
    const penggunaId = user.id; // Ambil ID pengguna dari localStorage
    const apiUrl = `http://localhost:8000/api/absensi.php?pengguna_id=${penggunaId}`;

    fetch(apiUrl)
        .then(response => response.text()) // Ambil response sebagai teks untuk membersihkan teks tambahan
        .then(data => {
            // Hilangkan "Koneksi berhasil!" dengan mengambil bagian JSON sebenarnya
            const jsonData = JSON.parse(data.replace("Koneksi berhasil!", "").trim());

            const absensiTable = document.getElementById("absensiTable");
            absensiTable.innerHTML = ""; // Kosongkan tabel sebelum mengisi data

            jsonData.forEach(item => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${item.tanggal}</td>
                    <td>${item.jam_masuk}</td>
                    <td>${item.jam_keluar ? item.jam_keluar : "-"}</td>
                    <td>${item.total_jam ? item.total_jam : "-"}</td>
                `;

                absensiTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Gagal mengambil data absensi.");
        });
});
