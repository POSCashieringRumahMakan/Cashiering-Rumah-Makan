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
        card.setAttribute('data-id', member.id); // Tambahkan atribut data-id
        card.classList.add('member-card');

        // Tentukan status
        const status = member.metode_pembayaran === 'Dana' ? 'Lunas' : 'Belum Dibayar';
        const actionButton = status === 'Belum Dibayar'
            ? `<button class="pay-btn" onclick="handlePayment(${member.id})">Pembayaran</button>`
            : ''; // Tidak ada tombol jika sudah lunas

        card.innerHTML = `
            <h3>${member.nama}</h3>
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

function confirmPayment() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
    if (!paymentMethod) {
        alert("Silakan pilih metode pembayaran!");
        return;
    }

    const selectedMethod = paymentMethod.value;
    const cashGiven = parseFloat(document.getElementById('cash-given').value);

    if (isNaN(cashGiven) || cashGiven <= 0) {
        alert("Masukkan jumlah uang yang diberikan dengan benar!");
        return;
    }

    const price = parseFloat(document.getElementById('payment-price').innerText.replace(/[^\d]/g, ''));
    const change = cashGiven - price;

    if (change < 0) {
        alert("Uang yang diberikan tidak cukup!");
        return;
    }

    document.getElementById('change').innerText = "Rp " + change.toLocaleString();

    const memberId = document.getElementById('payment-id').value;

    // Update status langsung di DOM
    const card = document.querySelector(`.member-card[data-id="${memberId}"]`);
    if (card) {
        const statusElement = card.querySelector('.order-status');
        const paymentMethodElement = card.querySelector('.payment-method');
        
        if (statusElement) statusElement.textContent = "Lunas";
        if (paymentMethodElement) paymentMethodElement.textContent = selectedMethod;
    }

    // Kirim PUT request ke backend
    updatePaymentStatus(memberId, selectedMethod, "Lunas");

    alert("Pembayaran berhasil!");
    closePopup();
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

        const jsonString = text.replace(/^Koneksi berhasil!/, ''); // Hapus pesan tambahan
        const json = JSON.parse(jsonString);

        if (!response.ok) {
            throw new Error(json.message || 'Gagal mengupdate status pembayaran');
        }

        console.log('Status pembayaran berhasil diperbarui:', json.message);
    } catch (error) {
        console.error('Error updating payment status:', error);
        alert('Terjadi kesalahan saat mengupdate status pembayaran.');
    }
} // ← Tambahkan kurung kurawal ini

// Fungsi untuk menampilkan popup pembayaran
function openPaymentPopup(name, price, id) {
    document.getElementById('payment-name').innerText = name;
    document.getElementById('payment-price').innerText = 'Rp ' + price.toLocaleString();
    document.getElementById('payment-id').value = id;

    // Menampilkan popup
    document.getElementById('payment-popup').style.display = 'block';
}

