// Fungsi untuk mendapatkan data produk dari API
async function fetchProducts() {
    try {
        const response = await fetch("http://localhost:8000/api/menu.php", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const rawText = await response.text(); // Ambil respons mentah
        console.log("Server Response:", rawText); // Debug respons dari server

        // Pisahkan pesan dari JSON
        const jsonStart = rawText.indexOf("["); // Mencari awal array JSON
        if (jsonStart !== -1) {
            const validJson = rawText.substring(jsonStart); // Ambil bagian JSON saja
            const data = JSON.parse(validJson); // Parse JSON
            products = data; // Update produk
            renderProducts(); // Render produk
        } else {
            // Jika tidak ditemukan JSON, tampilkan pesan error
            console.error("Response is not valid JSON:", rawText);
            alert("Terjadi kesalahan: Respons tidak valid.");
        }
    } catch (error) {
        console.error("Error fetching products:", error); // Tampilkan error
        alert("Terjadi kesalahan saat mengambil data produk: " + error.message);
    }
}

// Fungsi untuk menampilkan data produk ke dalam halaman
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

// Fungsi untuk menyimpan (menambah atau mengedit) produk
async function saveProduct(event) {
    event.preventDefault(); // Mencegah form dikirim secara default

    const id = document.getElementById('product-id').value;
    const nama = document.getElementById('namaProduk').value;
    const kategori = document.getElementById('kategori').value;
    const harga = document.getElementById('harga').value;
    const status = document.getElementById('status').value;

    // Validasi data input
    if (!nama || !kategori || !harga || isNaN(harga)) {
        alert("Harap isi semua kolom dengan benar.");
        return;
    }

    const productData = {
        nama,
        kategori,
        harga: parseInt(harga),
        status,
    };

    try {
        let method = 'POST';
        let url = "http://localhost:8000/api/menu.php";

        if (id) {
            // Edit produk jika ID ada
            method = 'PUT';
            productData.id = parseInt(id);
        }

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            throw new Error("Gagal menyimpan produk.");
        }

        alert("Produk berhasil disimpan.");
        document.getElementById('product-form').reset(); // Reset form
        document.getElementById('product-id').value = ''; // Kosongkan ID
        document.querySelector('button[type="submit"]').textContent = "Simpan Produk"; // Kembali ke teks awal
        fetchProducts(); // Refresh daftar produk
    } catch (error) {
        console.error("Error saving product:", error);
        alert("Terjadi kesalahan saat menyimpan produk: " + error.message);
    }
}

// Fungsi untuk mengisi form edit produk
function editProduct(id) {
    const product = products.find(p => p.id == id);

    if (!product) {
        alert("Produk tidak ditemukan.");
        return;
    }
    // Isi form dengan data produk yang akan diedit
    document.getElementById('product-id').value = product.id;
    document.getElementById('namaProduk').value = product.nama;
    document.getElementById('kategori').value = product.kategori;
    document.getElementById('harga').value = product.harga;
    document.getElementById('status').value = product.status;

    // Ubah teks tombol untuk menunjukkan bahwa ini adalah proses edit
    document.querySelector('button[type="submit"]').textContent = "Perbarui Produk";
    document.querySelector('.order-summary h3').textContent = 'Form Edit Kategori'; // Ubah judul
}


// Fungsi untuk menghapus produk
async function deleteProduct(id) {
    // Tampilkan dialog konfirmasi
    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus produk ini?");
    if (!confirmDelete) {
        return; // Batalkan jika pengguna memilih "Batal"
    }

    try {
        const response = await fetch("http://localhost:8000/api/menu.php", {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }) // Kirimkan ID produk yang akan dihapus
        });

        if (!response.ok) {
            throw new Error("Gagal menghapus produk");
        }

        alert("Produk berhasil dihapus."); // Tampilkan pesan sukses
        fetchProducts(); // Refresh daftar produk
    } catch (error) {
        console.error("Error deleting product:", error);
        alert("Terjadi kesalahan saat menghapus produk: " + error.message);
    }
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

// Memanggil fetchProducts saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', fetchProducts);
