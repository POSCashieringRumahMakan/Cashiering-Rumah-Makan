// Mendapatkan elemen-elemen DOM
const categoryList = document.getElementById('category-list');
const categoryForm = document.getElementById('category-form');
const categoryIdField = document.getElementById('category-id');
const categoryNameField = document.getElementById('namaKategori');
const categoryTypeField = document.getElementById('jenisKategori');

// Mengambil data kategori dari localStorage
function getCategories() {
    let categories = localStorage.getItem('categories');
    if (!categories) {
        categories = [];
    } else {
        categories = JSON.parse(categories);
    }
    return categories;
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
            <td>${category.type}</td>
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
    const type = categoryTypeField.value;

    const categories = getCategories();

    if (categoryIdField.value) {
        // Update kategori
        const categoryId = categoryIdField.value;
        categories[categoryId].name = name;
        categories[categoryId].type = type;
    } else {
        // Tambah kategori baru
        categories.push({
            name,
            type
        });
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
    categoryTypeField.value = category.type;
}

// Fungsi untuk mengosongkan form
function clearForm() {
    categoryIdField.value = '';
    categoryNameField.value = '';
    categoryTypeField.value = '';
}

// Inisialisasi halaman dengan data kategori
renderCategories();
