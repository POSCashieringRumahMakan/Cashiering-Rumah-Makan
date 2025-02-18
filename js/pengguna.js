let members = []; // Variabel global untuk menyimpan data anggota

// Fungsi untuk mengambil data dari API
async function fetchData() {
    try {
        const response = await fetch('http://localhost:8000/api/pengguna.php');

        if (!response.ok) {
            throw new Error('Gagal mengambil data pengguna');
        }

        const textResponse = await response.text();

        // Cek dan hapus pesan jika ada
        const jsonResponse = textResponse.includes("Koneksi berhasil!")
            ? textResponse.replace("Koneksi berhasil!", "").trim()
            : textResponse.trim();

        const data = JSON.parse(jsonResponse);
        members = data;
        displayMembers(members);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Fungsi untuk menampilkan daftar pelanggan
function displayMembers(members) {
    const memberList = document.getElementById('member-list');
    memberList.innerHTML = '';

    if (members.length === 0) {
        memberList.innerHTML = '<p>Tidak ada data pelanggan.</p>';
        return;
    }

    members.forEach((member) => {
        const card = document.createElement('div');
        card.classList.add('member-card');
        card.setAttribute('data-id', member.id);

        // Ambil status dari database secara langsung
        const status = member.status === 'Lunas' ? 'Lunas' : 'Belum Dibayar';
        const actionButton = status === 'Belum Dibayar'
            ? `<button class="pay-btn" onclick="handlePayment(${member.id})">Pembayaran</button>`
            : '';

        card.innerHTML = `
            <div class="card-container">
                <div class="print-container" onclick="printCard(${member.id})">
                    <i class="fa-solid fa-print print-icon" title="Cetak"></i>
                    <span class="print-text">Cetak</span>
                </div>
                <h3>${member.nama}</h3>
            </div>
            <p><strong>Email:</strong> ${member.email}</p>
            <p><strong>No. Telepon:</strong> ${member.noTelepon}</p>
            <p><strong>Tingkatan:</strong> ${member.tingkatan}</p>
            <p><strong>Harga:</strong> ${member.harga ? member.harga.toLocaleString('id-ID') : '-'}</p>
            <p><strong>Metode Pembayaran:</strong> <span class="payment-method">${member.metode_pembayaran ?? '-'}</span></p>
            <p><strong>Status:</strong> <span class="order-status">${status}</span></p>
            <div class="actions">
                <button class="edit-btn" onclick="editMember(${member.id})">Edit</button>
                <button class="delete-btn" onclick="deleteMember(${member.id})">Hapus</button>
                ${actionButton}
            </div>
        `;
        

        memberList.appendChild(card);
    });
}

// Fungsi untuk mencetak kartu member
function printCard(id) {
    if (!id) {
        alert('ID tidak valid!');
        return;
    }

    // Ambil data pengguna dari backend
    fetch(`http://localhost:8000/api/pengguna.php?id=${id}`)
        .then(response => response.text())  // Ambil respons sebagai teks
        .then(data => {
            // Menghapus bagian "Koneksi berhasil!" dari respons
            const jsonData = data.replace('Koneksi berhasil!', '').trim();

            try {
                // Parsing data JSON
                const pengguna = JSON.parse(jsonData);
                console.log('Data Pengguna:', pengguna);  // Debugging

                if (pengguna.error) {
                    alert(pengguna.error);
                    return;
                }

                // Membuka jendela baru untuk menampilkan kartu pengguna
                let printWindow = window.open("", "", "width=600,height=400");
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Cetak Kartu Pengguna</title>
                            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"> <!-- Menyertakan Font Awesome -->
                            <style>
                                body { font-family: Arial, sans-serif; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f4f4f4; }
                                .card {
                                    width: 350px;
                                    height: 210px;
                                    border: 1px solid #333;
                                    border-radius: 8px;
                                    padding: 15px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                    background-color: white;
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: space-between;
                                }
                                .card-header {
                                    text-align: center;
                                    font-size: 20px;
                                    font-weight: bold;
                                    margin-bottom: 15px;
                                }
                                .card-body {
                                    flex-grow: 1;
                                    font-size: 14px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: flex-start;
                                }
                                .card-body p {
                                    margin: 5px 0;
                                }
                                .card-footer {
                                    text-align: center;
                                    font-size: 12px;
                                    margin-top: 10px;
                                    font-weight: bold;
                                }
                                .btn-print { display: none; } /* Sembunyikan tombol saat dicetak */
                                .card-footer .status {
                                    font-size: 14px;
                                    color: green;
                                }
                                .card-body p strong {
                                    color: #333;
                                }

                                /* Styling untuk ikon avatar (Font Awesome) */
                                .avatar {
                                    font-size: 80px;  /* Ukuran ikon lebih besar */
                                    color: #ccc;
                                    margin-right: 20px; /* Memberikan jarak lebih antara ikon dan teks */
                                }

                                /* Menata elemen agar ikon di kiri dan teks di kanan */
                                .card-body .info {
                                    flex-grow: 1;
                                }

                            </style>
                        </head>
                        <body>
                            <div class="card">
                                <div class="card-header">
                                    Kartu Member
                                </div>
                                <div class="card-body">
                                    <div class="avatar">
                                        <i class="fas fa-user"></i> <!-- Ikon pengguna dari Font Awesome -->
                                    </div>
                                    <div class="info">
                                        <p><strong>Nama:</strong> ${pengguna.nama}</p>
                                        <p><strong>Email:</strong> ${pengguna.email}</p>
                                        <p><strong>No. Telepon:</strong> ${pengguna.noTelepon}</p>
                                        <p><strong>Tingkatan:</strong> ${pengguna.tingkatan}</p>
                                        <p><strong>Harga:</strong> ${pengguna.harga ? pengguna.harga.toLocaleString('id-ID') : '-'}</p>
                                        <p><strong>Metode Pembayaran:</strong> ${pengguna.metode_pembayaran ?? '-'}</p>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <span class="status">${pengguna.status ?? '-'}</span>
                                </div>
                            </div>
                        </body>
                    </html>
                `);
                printWindow.document.close();

                // Tunggu dokumen selesai dimuat, kemudian cetak
                printWindow.onload = () => {
                    printWindow.print();
                };
            } catch (error) {
                console.error("Error parsing JSON:", error);
                alert("Terjadi kesalahan saat memproses data pengguna.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat memuat data pengguna.");
        });
}


// Fungsi untuk mengedit pelanggan
function editMember(id) {
    const member = members.find((member) => member.id === id);
    if (member) {
        document.getElementById('member-id').value = member.id;
        document.getElementById('nama').value = member.nama;
        document.getElementById('email').value = member.email;
        document.getElementById('noTelepon').value = member.noTelepon;
        document.getElementById('tingkatan').value = member.tingkatan;
        document.getElementById('harga').value = member.harga; // Tambahkan ini
        document.getElementById('metodePembayaran').value = member.metode_pembayaran; // Tambahkan ini
        document.querySelector('aside h3').textContent = 'Form Edit Data Pelanggan';
        document.getElementById('submit-btn').textContent = 'Simpan Perubahan';
    }
}

// Fungsi untuk menambah atau memperbarui pelanggan
async function saveMember(event) {
    event.preventDefault();

    const memberId = document.getElementById('member-id').value.trim();
    const nama = document.getElementById('nama').value.trim();
    const email = document.getElementById('email').value.trim();
    const noTelepon = document.getElementById('noTelepon').value.trim();
    const tingkatan = document.getElementById('tingkatan').value.trim();
    const harga = document.getElementById('harga').value.trim().replace(/[^\d]/g, ''); // Ambil angka saja
    const metodePembayaran = document.getElementById('metodePembayaran').value.trim();

    if (!nama || !email || !noTelepon || !tingkatan || !harga || !metodePembayaran) {
        alert('Harap isi semua data pelanggan.');
        return;
    }

    const memberData = { nama, email, noTelepon, tingkatan, harga, metode_pembayaran: metodePembayaran };

    try {
        let url = 'http://localhost:8000/api/pengguna.php';
        let method = 'POST';

        if (memberId) {
            url = `http://localhost:8000/api/pengguna.php?id=${memberId}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(memberData),
        });

        if (!response.ok) {
            throw new Error(`Gagal menyimpan data pengguna: ${response.statusText}`);
        }

        document.getElementById('member-form').reset();
        document.getElementById('member-id').value = '';
        document.querySelector('aside h3').textContent = 'Form Tambah Pelanggan';

        // Mengubah kembali teks tombol ke 'Simpan'
        document.getElementById('submit-btn').textContent = 'Simpan';

        fetchData();
        alert('Data pelanggan berhasil disimpan!');
    } catch (error) {
        console.error('Error saving member:', error);
        alert('Terjadi kesalahan saat menyimpan data pelanggan.');
    }
}


// Fungsi menghapus pelanggan
async function deleteMember(id) {
    if (!confirm(`Anda yakin ingin menghapus pelanggan dengan ID ${id}?`)) {
        return;
    }
    try {
        const response = await fetch(`http://localhost:8000/api/pengguna.php?id=${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Gagal menghapus pelanggan');
        }

        fetchData();
        alert(`Pelanggan dengan ID ${id} berhasil dihapus.`);
    } catch (error) {
        console.error('Error deleting member:', error);
        alert('Terjadi kesalahan saat menghapus pelanggan.');
    }
}

document.addEventListener('DOMContentLoaded', fetchData);

document.getElementById('metodePembayaran').addEventListener('change', function () {
    const metodePembayaran = this.value;
    if (metodePembayaran === 'Dana') {  // Jika menggunakan Dana
        // document.getElementById('statusPembayaran').textContent = 'Status: Lunas';
    } else {  // Jika menggunakan Cash
        // document.getElementById('statusPembayaran').textContent = 'Status: Belum Dibayar';
    }
});


let selectedMemberId = null; // Variabel untuk menyimpan ID anggota yang dipilih

// Fungsi untuk menampilkan modal dan mengisi data pelanggan
function handlePayment(id) {
    // Cari data member berdasarkan ID
    currentMember = members.find(member => member.id === id);
    if (!currentMember) return;

    // Isi popup dengan data anggota yang dipilih
    document.getElementById('payment-name').textContent = currentMember.nama;
    document.getElementById('payment-price').textContent = currentMember.harga.toLocaleString('id-ID');
    document.getElementById('payment-id').value = currentMember.id; // Menyimpan ID anggota di input tersembunyi

    // Reset nilai input uang yang diberikan dan kembalian
    document.getElementById('cash-given').value = '';
    document.getElementById('change').textContent = '0';

    // Tampilkan popup
    document.getElementById('payment-popup').style.display = 'flex';

    // Event listener untuk menghitung kembalian
    document.getElementById('cash-given').addEventListener('input', function () {
        const cashGiven = parseInt(this.value) || 0;
        const price = currentMember.harga;

        // Hitung kembalian
        const change = cashGiven - price;
        document.getElementById('change').textContent = change < 0 ? 'Kurang' : change.toLocaleString('id-ID');
    });
}


function closePopup() {
    // Tutup popup
    document.getElementById('payment-popup').style.display = 'none';
}

// Solusi agar status pembayaran langsung diperbarui di tampilan setelah berhasil:
async function updateMemberStatus(memberId) {
    const memberIndex = members.findIndex(member => member.id === memberId);
    if (memberIndex !== -1) {
        members[memberIndex].metode_pembayaran = 'Dana'; // Atur langsung ke metode "Dana" agar status menjadi "Lunas"
        displayMembers(members);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchData(); // Ambil data awal
});

async function confirmPayment() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
    if (!paymentMethod) return alert("Silakan pilih metode pembayaran!");

    const memberId = document.getElementById('payment-id').value;
    const selectedMethod = paymentMethod.value;
    const cashGiven = parseFloat(document.getElementById('cash-given').value);
    const price = parseFloat(document.getElementById('payment-price').innerText.replace(/\D/g, ''));

    if (isNaN(cashGiven) || cashGiven < price) return alert("Jumlah uang tidak cukup!");

    try {
        const response = await fetch(`http://localhost:8000/api/pengguna.php?id=${memberId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                metode_pembayaran: selectedMethod,
                pembayaran_berhasil: true
            })
        });

        if (!response.ok) throw new Error('Gagal memperbarui status pembayaran');

        alert("Pembayaran berhasil!");
        updateMemberStatus(memberId); // Update tampilan langsung
        closePopup();
        // Tambahkan ini agar halaman otomatis refresh setelah alert
        setTimeout(() => window.location.reload(), 500);
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat memperbarui status pembayaran.');
    }
}



// async function updatePaymentStatus(memberId, paymentMethod, status) {
//     const updateData = {
//         metode_pembayaran: paymentMethod,
//         status_pembayaran: status
//     };

//     try {
//         const response = await fetch(`http://localhost:8000/api/pengguna.php?id=${memberId}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(updateData)
//         });

//         if (!response.ok) {
//             throw new Error('Gagal mengupdate status pembayaran');
//         }

//         console.log('Status pembayaran berhasil diperbarui');
//     } catch (error) {
//         console.error('Error updating payment status:', error);
//         alert('Terjadi kesalahan saat mengupdate status pembayaran.');
//     }
// }

async function updatePaymentStatus(memberId, paymentMethod, paymentSuccess = false) {
    const updateData = {
        metode_pembayaran: paymentMethod,
        pembayaran_berhasil: paymentSuccess
    };

    try {
        const response = await fetch(`http://localhost:8000/api/pengguna.php?id=${memberId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });

        const text = await response.text(); // Ambil respons mentah
        console.log('Raw Response:', text); // Lihat respons sebelum parse JSON

        // Coba potong bagian yang nggak perlu
        const jsonString = text.replace(/^Koneksi berhasil!/, ''); // Hapus "Koneksi berhasil!" jika ada
        const json = JSON.parse(jsonString); // Parse sisa respons

        if (!response.ok) {
            throw new Error(json.message || 'Gagal mengupdate status pembayaran');
        }

        console.log('Status pembayaran berhasil diperbarui:', json.message);
    } catch (error) {
        console.error('Error updating payment status:', error);
        alert('Terjadi kesalahan saat mengupdate status pembayaran.');
    }



    // Fungsi untuk menampilkan popup pembayaran
    function openPaymentPopup(name, price, id) {
        document.getElementById('payment-name').innerText = name;
        document.getElementById('payment-price').innerText = 'Rp ' + price.toLocaleString();
        document.getElementById('payment-id').value = id;

        // Menampilkan popup
        document.getElementById('payment-popup').style.display = 'block';
    }
}

