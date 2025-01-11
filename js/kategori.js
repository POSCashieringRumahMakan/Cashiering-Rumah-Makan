// Fungsi untuk menarik data kategori
async function fetchCategories() {
    try {
        // Melakukan fetch ke URL API
        const response = await fetch('http://localhost:8000/api/kategori.php');

        // Tampilkan respons mentah untuk debugging
        const responseText = await response.text();
        console.log('API Response:', responseText);  // Menampilkan respons mentah

        // Cek apakah status HTTP berhasil (200 OK)
        if (!response.ok) {
            throw new Error('Gagal mengambil data dari server');
        }

        // Pastikan respons yang diterima adalah valid JSON
        let categories;
        try {
            categories = JSON.parse(responseText);
        } catch (error) {
            throw new Error('Response bukan JSON yang valid');
        }

        // Jika data kategori berhasil diterima, perbarui tampilan tabel
        updateCategoryTable(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Terjadi kesalahan saat mengambil data kategori');
    }
}

// Fungsi untuk memperbarui tampilan tabel kategori
function updateCategoryTable(categories) {
    const tableBody = document.querySelector('.category-table tbody');
    tableBody.innerHTML = ''; // Kosongkan tabel sebelum memasukkan data baru

    // Pastikan data kategori tidak kosong
    if (categories.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3">Tidak ada kategori ditemukan.</td></tr>';
        return;
    }

    categories.forEach((category, index) => {
        // Membuat baris baru untuk setiap kategori
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

// Fungsi untuk menangani aksi edit kategori
function editCategory(id) {
    console.log('Edit kategori dengan ID:', id);
    // Implementasikan logika edit kategori di sini
}

// Fungsi untuk menangani aksi hapus kategori
function deleteCategory(id) {
    console.log('Hapus kategori dengan ID:', id);
    // Implementasikan logika hapus kategori di sini
}

// Panggil fungsi fetchCategories saat halaman dimuat
window.onload = fetchCategories;
