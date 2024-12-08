// Mendapatkan elemen-elemen DOM
const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const productIdField = document.getElementById('product-id');
const productNameField = document.getElementById('namaProduk');
const productCategoryField = document.getElementById('kategori');
const productPriceField = document.getElementById('harga');
const productStatusField = document.getElementById('status');

// Mengambil data produk dari localStorage
function getProducts() {
    let products = localStorage.getItem('products');
    if (!products) {
        products = [];
    } else {
        products = JSON.parse(products);
    }
    return products;
}

// Menyimpan data produk ke localStorage
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Render data produk ke dalam tabel
function renderProducts() {
    const products = getProducts();
    productList.innerHTML = ''; // Kosongkan isi tabel sebelum di-render ulang

    products.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.status}</td>
            <td>
                <button class="edit-button" onclick="editProduct(${index})">Edit</button>
                <button class="delete-button" onclick="deleteProduct(${index})">Hapus</button>
            </td>
        `;
        productList.appendChild(row);
    });
}


// Fungsi untuk menambah produk
function saveProduct(event) {
    event.preventDefault(); // Mencegah form untuk reload halaman

    const name = productNameField.value;
    const category = productCategoryField.value;
    const price = productPriceField.value;
    const status = productStatusField.value;

    const products = getProducts();

    if (productIdField.value) {
        // Update produk
        const productId = productIdField.value;
        products[productId].name = name;
        products[productId].category = category;
        products[productId].price = price;
        products[productId].status = status;
    } else {
        // Tambah produk baru
        products.push({
            name,
            category,
            price,
            status
        });
    }

    saveProducts(products);
    clearForm();
    renderProducts();
}

// Fungsi untuk menghapus produk
function deleteProduct(index) {
    const products = getProducts();
    products.splice(index, 1); // Hapus produk pada index yang diberikan
    saveProducts(products);
    renderProducts();
}

// Fungsi untuk mengedit produk
function editProduct(index) {
    const products = getProducts();
    const product = products[index];

    productIdField.value = index; // Menyimpan ID produk yang akan diedit
    productNameField.value = product.name;
    productCategoryField.value = product.category;
    productPriceField.value = product.price;
    productStatusField.value = product.status;
}

// Fungsi untuk mengosongkan form
function clearForm() {
    productIdField.value = '';
    productNameField.value = '';
    productCategoryField.value = '';
    productPriceField.value = '';
    productStatusField.value = 'Tersedia';
}

// Inisialisasi halaman dengan data produk
renderProducts();
