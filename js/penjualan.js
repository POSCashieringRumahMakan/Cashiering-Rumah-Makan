document.addEventListener("DOMContentLoaded", function() {
    // Contoh data transaksi (ini bisa diambil dari backend nanti)
    let transaksi = [
        { id: "TRX001", waktu: "10:30 AM", total: 50000, metode: "Cash", pajak: 5000, diskon: 0 },
        { id: "TRX002", waktu: "11:15 AM", total: 75000, metode: "QRIS", pajak: 7500, diskon: 5000 },
        { id: "TRX003", waktu: "12:45 PM", total: 100000, metode: "Debit", pajak: 10000, diskon: 0 }
    ];

    // Mengisi tabel transaksi
    let tbody = document.getElementById("riwayat-transaksi");
    let totalHarian = 0, totalCash = 0, totalCard = 0, totalEwallet = 0;

    transaksi.forEach(trx => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${trx.id}</td>
            <td>${trx.waktu}</td>
            <td>Rp ${trx.total.toLocaleString()}</td>
            <td>${trx.metode}</td>
            <td>Rp ${trx.pajak.toLocaleString()}</td>
            <td>Rp ${trx.diskon.toLocaleString()}</td>
        `;
        tbody.appendChild(row);

        // Menghitung total penjualan
        totalHarian += trx.total;
        if (trx.metode === "Cash") totalCash += trx.total;
        if (trx.metode === "Debit") totalCard += trx.total;
        if (trx.metode === "QRIS") totalEwallet += trx.total;
    });

    // Menampilkan total harian
    document.getElementById("total-harian").textContent = `Rp ${totalHarian.toLocaleString()}`;
    document.getElementById("cash-total").textContent = `Rp ${totalCash.toLocaleString()}`;
    document.getElementById("card-total").textContent = `Rp ${totalCard.toLocaleString()}`;
    document.getElementById("ewallet-total").textContent = `Rp ${totalEwallet.toLocaleString()}`;

    // Fungsi filter transaksi
    window.filterTransaksi = function() {
        let filter = document.getElementById("filter").value;
        console.log(`Menampilkan transaksi untuk: ${filter}`); // Bisa disambungkan ke backend nanti
    };
});
