let members = []; // Variabel global untuk menyimpan data anggota

// Fungsi untuk mengambil data dari API
async function fetchData() {
    try {
        const response = await fetch('http://localhost:8000/api/pengguna.php');
        
        if (!response.ok) {
            throw new Error('Gagal mengambil data pengguna');
        }

        // Ambil respons sebagai teks
        const textResponse = await response.text();
        console.log(textResponse); // Cek respons di console

        // Pisahkan data JSON dengan menghapus bagian pesan "Koneksi berhasil!"
        const jsonResponse = textResponse.replace("Koneksi berhasil!", "").trim();
        
        // Coba parsing data JSON
        const data = JSON.parse(jsonResponse);

        // Simpan data anggota ke dalam variabel global
        members = data;

        // Tampilkan data pengguna di UI
        displayMembers(members);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Fungsi untuk menampilkan daftar pelanggan
function displayMembers(members) {
    const memberList = document.getElementById('member-list');
    memberList.innerHTML = ''; // Kosongkan daftar sebelumnya

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
    // Cari member berdasarkan id
    const member = members.find((member) => member.id === id);
    if (member) {
        // Isi form dengan data member yang dipilih
        document.getElementById('member-id').value = member.id;
        document.getElementById('nama').value = member.nama;
        document.getElementById('email').value = member.email;
        document.getElementById('noTelepon').value = member.noTelepon;
        document.getElementById('tingkatan').value = member.tingkatan;
    }
}

// Fungsi untuk menambah atau memperbarui pelanggan
async function saveMember(event) {
    event.preventDefault();

    const memberId = document.getElementById('member-id').value;
    const nama = document.getElementById('nama').value;
    const email = document.getElementById('email').value;
    const noTelepon = document.getElementById('noTelepon').value;
    const tingkatan = document.getElementById('tingkatan').value;

    const memberData = {
        nama,
        email,
        noTelepon,
        tingkatan
    };

    try {
        let url = 'http://localhost:8000/api/pengguna.php';
        let method = 'POST';

        // Jika ada memberId, berarti kita akan melakukan update
        if (memberId) {
            url += `?id=${memberId}`;
            method = 'PUT'; // Gunakan PUT untuk memperbarui data
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memberData)
        });

        if (!response.ok) {
            throw new Error('Gagal menyimpan data pengguna');
        }

        // Jika berhasil, reset form dan reload data
        document.getElementById('member-form').reset();
        document.getElementById('member-id').value = '';
        fetchData(); // Muat ulang data pengguna
        alert('Data pelanggan berhasil disimpan!');
    } catch (error) {
        console.error('Error saving member:', error);
        alert('Terjadi kesalahan saat menyimpan data pelanggan.');
    }
}

// Tampilkan data pengguna saat halaman dimuat
document.addEventListener('DOMContentLoaded', fetchData);

// Fungsi menghapus pelanggan
async function deleteMember(id) {
    try {
        // Mengirimkan permintaan DELETE ke API
        const response = await fetch(`http://localhost:8000/api/pengguna.php?id=${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Gagal menghapus pelanggan');
        }

        // Setelah data berhasil dihapus, ambil data terbaru
        fetchData(); // Muat ulang data pengguna

        alert(`Pelanggan dengan ID ${id} berhasil dihapus.`);
    } catch (error) {
        console.error('Error deleting member:', error);
        alert('Terjadi kesalahan saat menghapus pelanggan.');
    }
}
