// Mendapatkan elemen-elemen DOM
const categoryList = document.getElementById('category-list');
const categoryForm = document.getElementById('category-form');
const categoryIdField = document.getElementById('category-id');
const categoryNameField = document.getElementById('namaKategori');

// Mengambil data kategori dari localStorage
function getCategories() {
    let categories = localStorage.getItem('categories');
    return categories ? JSON.parse(categories) : [];
}

// Menyimpan data kategori ke localStorage
function saveCategories(categories) {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Render data kategori ke dalam tabel
function renderCategories() {
    const categories = getCategories();
    categoryList.innerHTML = ''; // Kosongkan isi tabel sebelum di-render ulang

    categories.forEach((category, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${category.name}</td>
            <td>
                <button class="edit-button" onclick="editCategory(${index})">Edit</button>
                <button class="delete-button" onclick="deleteCategory(${index})">Hapus</button>
            </td>
        `;
        categoryList.appendChild(row);
    });
}

// Fungsi untuk menyimpan kategori
function saveCategory(event) {
    event.preventDefault(); // Mencegah form untuk reload halaman

    const name = categoryNameField.value;
    const categories = getCategories();

    if (categoryIdField.value) {
        // Update kategori
        const categoryId = parseInt(categoryIdField.value, 10);
        categories[categoryId] = { name };
    } else {
        // Tambah kategori baru
        categories.push({ name });
    }

    saveCategories(categories);
    clearForm();
    renderCategories();
}

// Fungsi untuk menghapus kategori
function deleteCategory(index) {
    const categories = getCategories();
    categories.splice(index, 1); // Hapus kategori pada index yang diberikan
    saveCategories(categories);
    renderCategories();
}

// Fungsi untuk mengedit kategori
function editCategory(index) {
    const categories = getCategories();
    const category = categories[index];

    categoryIdField.value = index; // Menyimpan ID kategori yang akan diedit
    categoryNameField.value = category.name;
}

// Fungsi untuk mengosongkan form
function clearForm() {
    categoryIdField.value = '';
    categoryNameField.value = '';
}

// Inisialisasi halaman dengan data kategori
renderCategories();
