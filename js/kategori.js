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

        // Coba parsing teks ke JSON
        let categories;
        try {
            categories = JSON.parse(responseText);
        } catch (error) {
            throw new Error('Response bukan JSON yang valid');
        }

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

// Fungsi untuk menangani aksi edit kategori
function editCategory(id) {
    console.log('Edit kategori dengan ID:', id);
    // Implementasikan logika edit kategori di sini
    alert(`Fungsi edit untuk ID kategori ${id} masih dalam pengembangan.`);
}

// Fungsi untuk menangani aksi hapus kategori
function deleteCategory(id) {
    console.log('Hapus kategori dengan ID:', id);
    // Implementasikan logika hapus kategori di sini
    alert(`Fungsi hapus untuk ID kategori ${id} masih dalam pengembangan.`);
}

// Panggil fungsi fetchCategories saat halaman dimuat
window.onload = fetchCategories;
