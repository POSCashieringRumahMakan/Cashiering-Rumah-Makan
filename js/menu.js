let categories = [];
let products = [];

// Fungsi untuk mendapatkan data kategori dari API
async function fetchCategories() {
    try {
        const response = await fetch("http://localhost:8000/api/kategori.php");
        const rawText = await response.text();
        console.log("Server Response (Kategori):", rawText);

        const jsonStart = rawText.indexOf("[");
        if (jsonStart !== -1) {
            categories = JSON.parse(rawText.substring(jsonStart));
            console.log("Data Kategori Terparse:", categories);
            populateCategoryDropdown(categories);
        } else {
            throw new Error("Response kategori tidak valid");
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
        alert("Terjadi kesalahan saat mengambil data kategori: " + error.message);
    }
}

// Fungsi untuk mendapatkan data produk dari API
async function fetchProducts() {
    try {
        const response = await fetch("http://localhost:8000/api/menu.php");
        const textResponse = await response.text();
        console.log("Raw Response dari API Produk:", textResponse);

        const jsonStart = textResponse.indexOf("[");
        if (jsonStart !== -1) {
            products = JSON.parse(textResponse.substring(jsonStart));
            console.log("Data Produk setelah parsing:", products);
            renderProducts();
        } else {
            throw new Error("Respons produk tidak valid");
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        alert("Terjadi kesalahan saat mengambil data produk: " + error.message);
    }
}

// Fungsi untuk mengisi dropdown kategori
function populateCategoryDropdown(categories) {
    const kategoriSelect = document.getElementById("kategori");
    kategoriSelect.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Pilih Kategori";
    kategoriSelect.appendChild(defaultOption);

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id_kategori;
        option.textContent = category.nama_kategori;
        kategoriSelect.appendChild(option);
    });
}

// Fungsi untuk menampilkan data produk ke dalam halaman
function renderProducts() {
    const menuList = document.getElementById('menu-list');
    menuList.innerHTML = '';

    products.forEach(product => {
        console.log(`Cocokkan kategori untuk ${product.nama} (ID Kategori: ${product.id_kategori})`);

        const kategoriProduk = categories.find(cat => String(cat.id_kategori) === String(product.id_kategori));
        const namaKategori = kategoriProduk ? kategoriProduk.nama_kategori : "Tidak diketahui";

        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <h3>${product.nama}</h3>
            <p>Kategori: ${namaKategori}</p>
            <p>Harga: Rp ${product.harga}</p>
            <p>Status: ${product.status}</p>
            <button class="edit-btn" onclick="editProduct(${product.id})">Edit</button>
            <button class="delete-btn" onclick="deleteProduct(${product.id})">Hapus</button>
        `;
        menuList.appendChild(productCard);
    });
}

// Fungsi untuk menyimpan produk
async function saveProduct(event) {
    event.preventDefault();

    const id = document.getElementById('product-id').value;
    const nama = document.getElementById('namaProduk').value;
    const kategori = document.getElementById('kategori').value; // ✅ Perbaikan ID dropdown
    const harga = document.getElementById('harga').value;
    const status = document.getElementById('status').value;

    console.log("📌 ID Kategori yang dipilih:", kategori);

    if (!nama || !kategori || kategori === "" || !harga || isNaN(harga)) {
        alert("Harap isi semua kolom dengan benar.");
        return;
    }

    const productData = {
        nama,
        id_kategori: parseInt(kategori),
        harga: parseFloat(harga),
        status,
    };

    try {
        let method = id ? 'PUT' : 'POST';
        let url = "http://localhost:8000/api/menu.php";

        if (id) {
            productData.id = parseInt(id);
        }

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });

        const responseText = await response.text();
        let jsonStart = responseText.indexOf("{");
        if (jsonStart === -1) {
            throw new Error("Response bukan JSON yang valid: " + responseText);
        }
        let responseData = JSON.parse(responseText.substring(jsonStart));

        if (!response.ok || responseData.error) {
            throw new Error(responseData.error || "Gagal menyimpan produk");
        }

        alert("✅ Produk berhasil disimpan!");
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        fetchProducts();
    } catch (error) {
        console.error("❌ Error saving product:", error);
        alert("Terjadi kesalahan saat menyimpan produk: " + error.message);
    }
}

// Fungsi untuk mengedit produk
// Fungsi untuk mengedit produk
function editProduct(id) {
    const product = products.find(p => p.id == id);
    if (!product) {
        alert("Produk tidak ditemukan.");
        return;
    }

    // Isi form dengan data produk yang akan diedit
    document.getElementById('product-id').value = product.id;
    document.getElementById('namaProduk').value = product.nama;
    document.getElementById('kategori').value = product.id_kategori;
    document.getElementById('harga').value = product.harga;
    document.getElementById('status').value = product.status;

    // Ubah teks tombol dan judul form
    document.querySelector('button[type="submit"]').textContent = 'Perbarui Produk';
    document.querySelector('.order-summary h3').textContent = 'Form Edit Produk'; // Ubah judul

    // Pastikan form ditampilkan jika sebelumnya tersembunyi
    document.getElementById('product-form').style.display = 'block';
}


// Fungsi untuk menghapus produk
async function deleteProduct(id) {
    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus produk ini?");
    if (!confirmDelete) return;

    try {
        const url = `http://localhost:8000/api/menu.php?id=${id}`;
        const response = await fetch(url, { method: 'DELETE' });

        const responseText = await response.text();
        let jsonStart = responseText.indexOf("{");
        if (jsonStart === -1) {
            throw new Error("Response bukan JSON yang valid: " + responseText);
        }
        let responseData = JSON.parse(responseText.substring(jsonStart));

        if (!response.ok || responseData.error) {
            throw new Error(responseData.error || "Gagal menghapus produk");
        }

        alert("✅ Produk berhasil dihapus!");
        fetchProducts();
    } catch (error) {
        console.error("❌ Error deleting product:", error);
        alert("Terjadi kesalahan saat menghapus produk: " + error.message);
    }
}

// Panggil data kategori sebelum produk
document.addEventListener('DOMContentLoaded', async () => {
    await fetchCategories();
    await fetchProducts();
});
