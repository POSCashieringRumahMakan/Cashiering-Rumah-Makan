// Array untuk menyimpan produk
let products = [
    {
        id: 1,
        nama: "Nasi Padang Ayam",
        kategori: "Makanan Berat",
        harga: 25000,
        status: "Tersedia"
    },
    {
        id: 2,
        nama: "Nasi Padang Rendang",
        kategori: "Makanan Berat",
        harga: 30000,
        status: "Tersedia"
    }
];

   // Fungsi untuk merender produk ke dalam halaman
   function renderProducts() {
    const menuList = document.getElementById('menu-list');
    menuList.innerHTML = ''; // Mengosongkan daftar produk sebelumnya

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <h3>${product.nama}</h3>
            <p>Kategori: ${product.kategori}</p>
            <p>Harga: Rp ${product.harga}</p>
            <p>Status: ${product.status}</p>
            <button class="edit-btn" onclick="editProduct(${product.id})">Edit</button>
            <button class="delete-btn" onclick="deleteProduct(${product.id})">Hapus</button>
        `;
        menuList.appendChild(productCard);
    });
}
 // Fungsi untuk menambah atau mengedit produk
 function saveProduct(event) {
    event.preventDefault(); // Mencegah form disubmit

    const id = document.getElementById('product-id').value;
    const nama = document.getElementById('namaProduk').value;
    const kategori = document.getElementById('kategori').value;
    const harga = document.getElementById('harga').value;
    const status = document.getElementById('status').value;

    if (id) {
        // Mengedit produk yang sudah ada
        const product = products.find(p => p.id == id);
        product.nama = nama;
        product.kategori = kategori;
        product.harga = harga;
        product.status = status;
    } else {
      // Menambah produk baru
      const newProduct = {
        id: products.length + 1,
        nama: nama,
        kategori: kategori,
        harga: parseInt(harga),
        status: status
    };
    products.push(newProduct);
}

// Menyembunyikan form dan merender ulang produk
document.getElementById('product-form').reset();
document.getElementById('product-id').value = '';
renderProducts();
}

// Fungsi untuk mengedit produk
function editProduct(id) {
    const product = products.find(p => p.id == id);

    document.getElementById('product-id').value = product.id;
    document.getElementById('namaProduk').value = product.nama;
    document.getElementById('kategori').value = product.kategori;
    document.getElementById('harga').value = product.harga;
    document.getElementById('status').value = product.status;
}

// Fungsi untuk menghapus produk
function deleteProduct(id) {
    products = products.filter(product => product.id != id);
    renderProducts();
}

// Fungsi untuk mencari produk
function searchProducts() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const filteredProducts = products.filter(product => product.nama.toLowerCase().includes(searchTerm));
    renderFilteredProducts(filteredProducts);
}

// Fungsi untuk merender produk yang sudah difilter
function renderFilteredProducts(filteredProducts) {
    const menuList = document.getElementById('menu-list');
    menuList.innerHTML = ''; // Mengosongkan daftar produk sebelumnya

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <h3>${product.nama}</h3>
            <p>Kategori: ${product.kategori}</p>
            <p>Harga: Rp ${product.harga}</p>
            <p>Status: ${product.status}</p>
            <button class="edit-btn" onclick="editProduct(${product.id})">Edit</button>
            <button class="delete-btn" onclick="deleteProduct(${product.id})">Hapus</button>
        `;
        menuList.appendChild(productCard);
    });
}

// Memanggil renderProducts saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', renderProducts);
