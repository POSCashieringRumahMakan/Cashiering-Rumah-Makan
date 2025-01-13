// Fungsi untuk menarik data kategori dari API
async function fetchCategories() {
    try {
        // Melakukan fetch ke API
        const response = await fetch('http://localhost:8000/api/kategori.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Periksa apakah respons HTTP berhasil
        if (!response.ok) {
            throw new Error(`Gagal mengambil data dari server: ${response.statusText}`);
        }

        // Ambil respons mentah dalam bentuk teks
        const responseText = await response.text();
        console.log('Raw API Response:', responseText); // Debugging respons mentah

        // Hilangkan pesan tambahan dari respons jika ada
        const jsonStart = responseText.indexOf('[');
        if (jsonStart === -1) throw new Error('Response bukan JSON yang valid');

        const validJson = responseText.substring(jsonStart);
        const categories = JSON.parse(validJson);

        // Jika berhasil, perbarui tabel kategori
        updateCategoryTable(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Terjadi kesalahan saat mengambil data kategori: ' + error.message);
    }
}

// Fungsi untuk memperbarui tampilan tabel kategori
function updateCategoryTable(categories) {
    const tableBody = document.querySelector('.category-table tbody');
    tableBody.innerHTML = ''; // Kosongkan tabel sebelum menambahkan data baru

    // Periksa apakah data kategori kosong
    if (!categories || categories.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3">Tidak ada kategori ditemukan.</td></tr>';
        return;
    }

    // Iterasi setiap kategori dan tambahkan ke tabel
    categories.forEach((category, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${category.nama_kategori}</td>
            <td>
                <button class="edit-button" onclick="editCategory(${category.id_kategori})">Edit</button>
                <button class="delete-button" onclick="deleteCategory(${category.id_kategori})">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function saveCategory(event) {
    event.preventDefault();

    // Ambil nilai input dari form
    const idKategori = document.getElementById('category-id').value;
    const jenisKategori = document.getElementById('jenisKategori').value;
    const namaKategori = document.getElementById('namaKategori').value;

    // Validasi input
    if (!jenisKategori || !namaKategori) {
        alert('Harap isi semua kolom.');
        return;
    }

    const url = idKategori
        ? `http://localhost:8000/api/kategori.php?id=${idKategori}`
        : 'http://localhost:8000/api/kategori.php';
    const method = idKategori ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jenis_kategori: jenisKategori,
                nama_kategori: namaKategori,
            }),
        });

        const responseText = await response.text();
        console.log('Response:', responseText);

        // Ekstrak hanya bagian JSON
        const jsonStart = responseText.indexOf('{');
        if (jsonStart === -1) throw new Error('Respons server tidak valid');
        const validJson = JSON.parse(responseText.substring(jsonStart));

        alert(validJson.message);
        fetchCategories();

        // Reset form
        document.getElementById('category-form').reset();
        document.getElementById('category-id').value = '';
        document.querySelector('button[type="submit"]').textContent = 'Simpan';
    } catch (error) {
        console.error('Error saving category:', error);
        alert('Gagal menyimpan data kategori: ' + error.message);
    }
}


// Fungsi untuk menangani aksi edit kategori
async function editCategory(id) {
    try {
        const response = await fetch(`http://localhost:8000/api/kategori.php?id=${id}`);

        if (!response.ok) {
            throw new Error('Gagal mengambil data kategori');
        }

        const responseText = await response.text();
        console.log('Edit API Response:', responseText);

        // Ekstrak hanya bagian JSON
        const jsonStart = responseText.indexOf('{');
        if (jsonStart === -1) throw new Error('Response bukan JSON yang valid');
        const validJson = JSON.parse(responseText.substring(jsonStart));

        document.getElementById('category-id').value = validJson.id_kategori;
        document.getElementById('jenisKategori').value = validJson.jenis_kategori;
        document.getElementById('namaKategori').value = validJson.nama_kategori;
        document.querySelector('button[type="submit"]').textContent = 'Perbarui';
    } catch (error) {
        console.error('Error editing category:', error);
        alert('Gagal mengambil data kategori: ' + error.message);
    }
}

// Fungsi untuk menangani aksi hapus kategori
async function deleteCategory(id) {
    const confirmDelete = confirm('Apakah Anda yakin ingin menghapus kategori ini?');
    if (!confirmDelete) return;

    try {
        // Kirim permintaan DELETE ke API
        const response = await fetch(`http://localhost:8000/api/kategori.php?id=${id}`, {
            method: 'DELETE',
        });

        // Ambil respons mentah dalam bentuk teks
        const responseText = await response.text();
        console.log('Delete API Response:', responseText); // Debugging respons mentah

        // Ekstrak bagian JSON dari respons
        const jsonStart = responseText.indexOf('{');
        if (jsonStart === -1) throw new Error('Respons server bukan JSON yang valid');

        const validJson = responseText.substring(jsonStart);
        const result = JSON.parse(validJson);

        // Tampilkan pesan berhasil atau gagal
        alert(result.message);
        fetchCategories(); // Refresh daftar kategori setelah penghapusan
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Gagal menghapus kategori: ' + error.message);
    }
}


// Panggil fungsi fetchCategories saat halaman dimuat
window.onload = fetchCategories;
