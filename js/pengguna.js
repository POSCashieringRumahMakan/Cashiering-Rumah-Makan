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

        card.innerHTML = `
            <h3>${member.nama}</h3>
            <p><strong>Email:</strong> ${member.email}</p>
            <p><strong>No. Telepon:</strong> ${member.noTelepon}</p>
            <p><strong>Tingkatan:</strong> ${member.tingkatan}</p>
            <div class="actions">
                <button class="edit-btn" onclick="editMember(${member.id})">Edit</button>
                <button class="delete-btn" onclick="deleteMember(${member.id})">Hapus</button>
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

    if (!nama || !email || !noTelepon || !tingkatan) {
        alert('Harap isi semua data pelanggan.');
        return;
    }

    const memberData = { nama, email, noTelepon, tingkatan };

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
