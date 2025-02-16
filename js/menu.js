let categories = []; // Simpan daftar kategori global

// Fungsi untuk mendapatkan data produk dari API
async function fetchProducts() {
    try {
        const response = await fetch("http://localhost:8000/api/menu.php");
        const textResponse = await response.text();
        console.log("Raw Response dari API Produk:", textResponse);

        const jsonStart = textResponse.indexOf("[");
        if (jsonStart !== -1) {
            const validJson = textResponse.substring(jsonStart);
            const data = JSON.parse(validJson);
            console.log("Data Produk setelah parsing:", data);
            products = data;
            renderProducts();
        } else {
            console.error("Respons produk tidak valid:", textResponse);
            alert("Terjadi kesalahan: Respons tidak valid.");
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        alert("Terjadi kesalahan saat mengambil data produk: " + error.message);
    }
}

// Fungsi untuk menampilkan data produk ke dalam halaman
function renderProducts() {
    const menuList = document.getElementById('menu-list');
    menuList.innerHTML = '';

    console.log("Produk yang akan dirender:", products);
    console.log("Kategori yang tersedia:", categories);

    products.forEach(product => {
        console.log(`Cocokkan kategori untuk ${product.nama} (ID Kategori: ${product.kategori})`);

        const kategoriProduk = categories.find(cat => String(cat.id_kategori) === String(product.kategori));
        console.log(`Hasil pencarian kategori:`, kategoriProduk);

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

    console.log("Produk berhasil dirender.");
}



// Fungsi untuk menyimpan (menambah atau mengedit) produk
async function saveProduct(event) {
    event.preventDefault();

    const id = document.getElementById('product-id').value;
    const nama = document.getElementById('namaProduk').value;
    const kategori = document.getElementById('kategori').value; // Ambil value ID kategori
    const harga = document.getElementById('harga').value;
    const status = document.getElementById('status').value;

    console.log("📌 ID Kategori yang dipilih:", kategori); // Debugging

    if (!nama || !kategori || kategori === "" || !harga || isNaN(harga)) {
        alert("Harap isi semua kolom dengan benar.");
        return;
    }

    const productData = {
        nama,
        id_kategori: parseInt(kategori), // Kirim ID kategori sesuai dengan backend
        harga: parseFloat(harga),
        status,
    };

    console.log("📌 Data yang dikirim ke API:", productData); // Debugging

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
        console.log("📌 Response dari server (sebelum parsing JSON):", responseText);

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



// Fungsi untuk mengisi form edit produk
function editProduct(id) {
    const product = products.find(p => p.id == id);

    if (!product) {
        alert("Produk tidak ditemukan.");
        return;
    }

    // 🔹 Pastikan nilai kategori diisi dengan benar
    document.getElementById('product-id').value = product.id;
    document.getElementById('namaProduk').value = product.nama;
    document.getElementById('kategori').value = product.id_kategori; // ✅ Sesuaikan dengan backend
    document.getElementById('harga').value = product.harga;
    document.getElementById('status').value = product.status;

    console.log("📌 Edit Produk - ID Kategori:", product.id_kategori); // ✅ Debugging
}




// Fungsi untuk menghapus produk
async function deleteProduct(id) {
    // 🔹 Konfirmasi sebelum menghapus
    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus produk ini?");
    if (!confirmDelete) return;

    try {
        console.log("📌 Menghapus produk dengan ID:", id);

        // 🔹 Perbaikan: Kirim ID sebagai Query String (`?id=10`)
        const url = `http://localhost:8000/api/menu.php?id=${id}`;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' } // Bisa dihapus jika tidak diperlukan
        });

        const responseText = await response.text();
        console.log("📌 Response dari server (sebelum parsing JSON):", responseText);

        // 🔹 Menghindari pesan tambahan sebelum JSON (contoh: "Koneksi berhasil!")
        let jsonStart = responseText.indexOf("{");
        if (jsonStart === -1) {
            throw new Error("Response bukan JSON yang valid: " + responseText);
        }
        let responseData = JSON.parse(responseText.substring(jsonStart));

        if (!response.ok || responseData.error) {
            throw new Error(responseData.error || "Gagal menghapus produk");
        }

        alert("✅ Produk berhasil dihapus!");
        fetchProducts(); // 🔹 Refresh daftar produk setelah penghapusan
    } catch (error) {
        console.error("❌ Error deleting product:", error);
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

// Fungsi untuk mendapatkan data kategori dari API
async function fetchCategories() {
    try {
        const response = await fetch("http://localhost:8000/api/kategori.php", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const rawText = await response.text();
        console.log("Server Response (Kategori):", rawText);

        const jsonStart = rawText.indexOf("[");
        if (jsonStart !== -1) {
            const validJson = rawText.substring(jsonStart);
            categories = JSON.parse(validJson); // Simpan ke variabel global

            console.log("Data Kategori Terparse:", categories); // Debugging
            populateCategoryDropdown(categories);
        } else {
            console.error("Response kategori tidak valid JSON:", rawText);
            alert("Terjadi kesalahan: Respons kategori tidak valid.");
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
        alert("Terjadi kesalahan saat mengambil data kategori: " + error.message);
    }
}


// Fungsi untuk mengisi dropdown kategori
function populateCategoryDropdown(categories) {
    const kategoriSelect = document.getElementById("kategori");
    kategoriSelect.innerHTML = ""; // Kosongkan dropdown sebelum mengisi ulang

    // Tambahkan opsi default
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Pilih Kategori";
    kategoriSelect.appendChild(defaultOption);

    // Pastikan format data API benar sebelum digunakan
    if (!Array.isArray(categories) || categories.length === 0) {
        console.error("Data kategori tidak ditemukan atau format salah:", categories);
        return;
    }

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id_kategori; // Pastikan sesuai dengan struktur API
        option.textContent = category.nama_kategori; // Gunakan nama kategori dari API
        kategoriSelect.appendChild(option);
    });

    console.log("Kategori berhasil dimasukkan:", kategoriSelect.innerHTML); // Debugging
}


// Panggil fetchCategories saat halaman pertama kali dimuat
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    fetchCategories();
});
