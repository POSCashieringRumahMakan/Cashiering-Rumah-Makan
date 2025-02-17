// Elemen produk dan pesanan
const productList = document.getElementById("product-list");
const orderItems = document.getElementById("order-items");
const totalElement = document.getElementById("total");

// Elemen pop-up pembayaran
const btnBayar = document.getElementById("btnBayar");
const popupBayar = document.getElementById("popupBayar");
const closePopup = popupBayar.querySelector(".close-btn");
const detailPesanan = document.getElementById("detailPesanan");
const totalPesanan = document.getElementById("totalPesanan");
// Elemen metode pembayaran dan jumlah tunai
const metodePembayaran = document.getElementById("metodePembayaran");
const jumlahTunaiContainer = document.getElementById("jumlahTunai").parentElement;
const uangKembalianContainer = document.getElementById("uangKembalian").parentElement;

// Objek untuk menyimpan pesanan
const order = {};

// Fungsi untuk mengambil dan menampilkan kategori dari API
async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:8000/api/menu.php");
    if (!response.ok) throw new Error("Gagal mengambil data menu.");

    const textData = await response.text();

    // Cari awal JSON dan potong teks di depannya
    const jsonStart = textData.indexOf("[");
    if (jsonStart === -1) throw new Error("Format JSON tidak valid.");

    const jsonData = textData.substring(jsonStart).trim();
    const data = JSON.parse(jsonData);

    // Ambil kategori unik dari data menu
    const categories = {};
    data.forEach(item => {
      if (!categories[item.id_kategori]) {
        categories[item.id_kategori] = {
          name: item.nama_kategori,
          count: 0
        };
      }
      categories[item.id_kategori].count++; // Hitung jumlah item per kategori
    });

    // Tampilkan kategori
    displayCategories(categories);

    // Pilih kategori pertama secara otomatis
    const firstCategoryId = Object.keys(categories)[0];
    if (firstCategoryId) {
      showCategory(firstCategoryId);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Fungsi untuk menampilkan kategori di UI dengan tampilan sesuai class yang ada
function displayCategories(categories) {
  const categoriesContainer = document.querySelector(".categories");
  categoriesContainer.innerHTML = ""; // Bersihkan kategori sebelumnya

  Object.entries(categories).forEach(([id, category]) => {
    const categoryCard = document.createElement("button");
    categoryCard.classList.add("category-card");
    categoryCard.setAttribute("onclick", `showCategory('${id}')`);

    categoryCard.innerHTML = `
      <i class="fas fa-folder category-icon"></i>
      <h3 class="category-title">${category.name}</h3>
      <p class="category-items">${category.count} item</p>
    `;

    categoriesContainer.appendChild(categoryCard);
  });

  // Set kategori pertama sebagai active
  const firstCategory = categoriesContainer.querySelector(".category-card");
  if (firstCategory) firstCategory.classList.add("active");
}

// Panggil fungsi untuk mengambil kategori saat halaman dimuat
fetchCategories();

// Fungsi untuk menampilkan menu sesuai kategori
function showCategory(categoryId) {
  // Hapus kelas 'active' dari semua kategori
  document.querySelectorAll(".category-card").forEach(card => card.classList.remove("active"));

  // Tambahkan kelas 'active' ke kategori yang diklik
  const selectedCategory = document.querySelector(`button[onclick="showCategory('${categoryId}')"]`);
  if (selectedCategory) selectedCategory.classList.add("active");

  // Panggil ulang fetchMenu dengan kategori yang dipilih
  fetchMenu(categoryId);
}

// Fungsi untuk mengambil dan menampilkan menu dari API
async function fetchMenu(selectedCategoryId = null) {
  try {
    const response = await fetch("http://localhost:8000/api/menu.php");
    if (!response.ok) throw new Error("Gagal mengambil data menu.");

    const textData = await response.text();

    // Ambil JSON dari response
    const jsonStart = textData.indexOf("[");
    if (jsonStart === -1) throw new Error("Format JSON tidak valid.");

    const jsonData = textData.substring(jsonStart).trim();
    const data = JSON.parse(jsonData);

    // Filter menu berdasarkan kategori yang dipilih
    const filteredMenu = data.filter(item => item.id_kategori == selectedCategoryId);

    // Tampilkan menu di UI
    displayMenu(filteredMenu);
  } catch (error) {
    console.error("Error:", error);
    productList.innerHTML = `<p>Gagal memuat menu. Coba lagi nanti.</p>`;
  }
}

// Fungsi untuk menampilkan menu di UI
function displayMenu(menu) {
  productList.innerHTML = ""; // Bersihkan daftar produk

  if (menu.length === 0) {
    productList.innerHTML = "<p>Tidak ada menu dalam kategori ini.</p>";
    return;
  }

  menu.forEach(item => {
    if (item.status.toLowerCase() === "tersedia") { // Hanya tampilkan item yang tersedia
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.innerHTML = `
        <h4>${item.nama}</h4>
        <p>Rp. ${parseInt(item.harga).toLocaleString()}</p>
        <div class="quantity-control">
          <button onclick="decreaseQuantity('${item.id}', '${item.nama}', ${item.harga})">-</button>
          <span class="quantity" id="quantity-${item.id}">0</span>
          <button onclick="increaseQuantity('${item.id}', '${item.nama}', ${item.harga})">+</button>
        </div>
      `;
      productList.appendChild(productCard);
    }
  });
}

// Fungsi untuk mengurangi kuantitas
function decreaseQuantity(productId, productName, productPrice) {
  if (!order[productId]) return; // Jika belum ada di pesanan, abaikan

  order[productId].quantity--;
  if (order[productId].quantity <= 0) {
    delete order[productId]; // Hapus item dari pesanan jika kuantitas 0
  }

  updateOrderSummary();
}

// Fungsi untuk menambah kuantitas
function increaseQuantity(productId, productName, productPrice) {
  if (!order[productId]) {
    order[productId] = {
      name: productName,
      price: productPrice,
      quantity: 0,
    };
  }

  order[productId].quantity++;

  updateOrderSummary();
}

// Fungsi untuk memperbarui ringkasan pesanan
function updateOrderSummary() {
  orderItems.innerHTML = ""; // Bersihkan daftar pesanan
  let total = 0;

  Object.values(order).forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x ${item.quantity} = Rp. ${(item.price * item.quantity).toLocaleString()}`;
    orderItems.appendChild(li);

    total += item.price * item.quantity;
  });

  // Perbarui total harga
  totalElement.textContent = `Total: Rp. ${total.toLocaleString()}`;

  // Perbarui kuantitas di kartu produk
  Object.keys(order).forEach(productId => {
    const quantitySpan = document.getElementById(`quantity-${productId}`);
    if (quantitySpan) {
      quantitySpan.textContent = order[productId].quantity;
    }
  });
}

// Fungsi untuk menampilkan pop-up dan menampilkan detail pesanan
btnBayar.addEventListener("click", () => {
  tampilkanPopupPembayaran();
});

async function ambilDataMeja() {
  try {
    const response = await fetch("http://localhost:8000/api/table.php");
    const data = await response.json();

    // Pastikan elemen dropdown ditemukan
    const dropdownMeja = document.getElementById("nomorMeja");
    if (!dropdownMeja) {
      console.error("Elemen dropdownMeja tidak ditemukan!");
      return;
    }

    // Kosongkan dropdown sebelum diisi ulang
    dropdownMeja.innerHTML = "";

    // Tambahkan pilihan meja ke dropdown
    data.forEach(meja => {
      const option = document.createElement("option");
      option.value = meja.id;
      option.textContent = `${meja.location} - ${meja.number} (Kapasitas: ${meja.capacity})`;
      dropdownMeja.appendChild(option);
    });

  } catch (error) {
    console.error("Gagal mengambil data meja:", error);
  }
}

// Event listener untuk metode pembayaran
metodePembayaran.addEventListener("change", function () {
  if (metodePembayaran.value === "dana") {
    jumlahTunaiContainer.style.display = "none";
    uangKembalianContainer.style.display = "none";
  } else {
    jumlahTunaiContainer.style.display = "block";
    uangKembalianContainer.style.display = "block";
  }
});

// Pastikan kondisi awal sesuai dengan opsi yang dipilih
metodePembayaran.dispatchEvent(new Event("change"));

function hitungKembalian() {
  let totalHarga = parseInt(totalPesanan.textContent.replace(/\D/g, "")) || 0; // Ambil total dan ubah ke angka
  let jumlahTunai = parseInt(document.getElementById("jumlahTunai").value) || 0; // Ambil jumlah tunai yang diberikan

  let kembalian = jumlahTunai - totalHarga;
  document.getElementById("uangKembalian").textContent = `Rp ${kembalian.toLocaleString()}`;
}

function tampilkanPopupPembayaran() {
  // Bersihkan daftar pesanan di pop-up sebelum ditampilkan
  detailPesanan.innerHTML = "";

  let total = 0;

  // Loop melalui pesanan dan tambahkan ke daftar dalam pop-up
  for (const item of Object.values(order)) {
    const listItem = document.createElement("li");
    listItem.textContent = `${item.name} x ${item.quantity} - Rp ${(item.price * item.quantity).toLocaleString()}`;
    detailPesanan.appendChild(listItem);
    total += item.price * item.quantity;
  }

  // Tampilkan total di pop-up
  totalPesanan.textContent = `Rp ${total.toLocaleString()}`;

  // Ambil data meja sebelum pop-up ditampilkan
  ambilDataMeja();

  // Tampilkan pop-up
  popupBayar.style.display = "block";
}

document.getElementById("btnProsesBayar").addEventListener("click", async function () {
  // Ambil nilai dari input pop-up
  const namaPengguna = document.getElementById("namaPemesan").value.trim();
  const metodePembayaran = document.getElementById("metodePembayaran").value;
  const tableId = parseInt(document.getElementById("nomorMeja").value);

  if (!namaPengguna) {
    alert("Nama pemesan tidak boleh kosong!");
    return;
  }

  if (Object.keys(order).length === 0) {
    alert("Pesanan tidak boleh kosong!");
    return;
  }

  // Format data menu sesuai API
  const menuData = Object.entries(order).map(([menuId, item]) => ({
    menu_id: parseInt(menuId),
    kuantitas: item.quantity
  }));

  // Bentuk body JSON untuk dikirim ke API
  const dataTransaksi = {
    nama_pengguna: namaPengguna,
    table_id: tableId,
    metode_pembayaran: metodePembayaran,
    menu: menuData
  };

  try {
    const response = await fetch("http://localhost:8000/api/kasir.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataTransaksi)
    });

    const textResponse = await response.text();
    const jsonMatch = textResponse.match(/{.*}/s); // Ambil bagian JSON saja

    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]); // Parse JSON yang valid
      if (response.ok) {
        alert("Pembayaran berhasil!");
        resetOrder();
      } else {
        alert("Gagal melakukan transaksi: " + result.message);
      }
    } else {
      alert("Respon dari server tidak valid.");
    }


    if (response.ok) {
      alert("Pembayaran berhasil!");
      // Reset pesanan setelah pembayaran
      resetOrder();
    } else {
      alert("Gagal melakukan transaksi: " + result.message);
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    alert("Terjadi kesalahan saat melakukan transaksi.");
  }
});

// Fungsi untuk mereset pesanan setelah transaksi berhasil
function resetOrder() {
  for (const key in order) {
    delete order[key];
  }
  updateOrderSummary();
  document.getElementById("namaPemesan").value = "";
  document.getElementById("popupBayar").style.display = "none";
}

// Fungsi untuk menutup pop-up
closePopup.addEventListener("click", () => {
  popupBayar.style.display = "none";
});

// Panggil fungsi fetch menu saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchMenu);
