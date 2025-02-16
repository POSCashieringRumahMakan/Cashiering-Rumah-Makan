// Elemen produk dan pesanan
const productList = document.getElementById("product-list");
const orderItems = document.getElementById("order-items");
const totalElement = document.getElementById("total");

// Elemen filter dan pop-up
const takeawayCard = document.getElementById("takeaway-card");
const dineinCard = document.getElementById("dinein-card");
const takeawayPopup = document.getElementById("takeaway-popup");
const dineinPopup = document.getElementById("dine-in-popup");
const popupOverlay = document.querySelector(".popup-overlay");
const closeTakeaway = document.getElementById("close-takeaway");

// Objek untuk menyimpan pesanan
const order = {};

async function fetchKasirData() {
  try {
      const response = await fetch("http://localhost:8000/api/kasir.php");
      if (!response.ok) throw new Error("Gagal mengambil data transaksi");

      const textData = await response.text();
      console.log("Respons dari server:", textData);

      let jsonStartIndex = textData.indexOf("[");
      if (jsonStartIndex === -1) throw new Error("JSON tidak ditemukan dalam respons");

      let cleanJsonText = textData.substring(jsonStartIndex).trim();
      let transactions = JSON.parse(cleanJsonText);

      console.log("Data JSON setelah parsing:", transactions);

      // Ambil detail menu untuk setiap transaksi
      const transactionsWithMenu = await Promise.all(
          transactions.map(async (transaction) => {
              const menuResponse = await fetch(`http://localhost:8000/api/menu.php?transaksi_id=${transaction.id}`);
              if (!menuResponse.ok) return { ...transaction, menu: [] };

              const menuData = await menuResponse.json();
              return { ...transaction, menu: menuData };
          })
      );

      console.log("Transaksi dengan menu:", transactionsWithMenu);
      displayKasirData(transactionsWithMenu);
  } catch (error) {
      console.error("Error:", error);
      document.getElementById("order-items").innerHTML = `<p>Gagal memuat transaksi.</p>`;
  }
}


function displayKasirData(transactions) {
  console.log("Menampilkan transaksi:", transactions);

  const orderItems = document.getElementById("order-items");
  orderItems.innerHTML = "";

  if (!transactions || transactions.length === 0) {
    orderItems.innerHTML = "<p>Tidak ada transaksi ditemukan.</p>";
    return;
  }

  let totalKeseluruhan = 0;

  transactions.forEach(transaction => {
      console.log("Proses transaksi:", transaction);

      const orderDiv = document.createElement("div");
      orderDiv.classList.add("order");

      let menuList = "";
      if (transaction.menu && Array.isArray(transaction.menu)) {
          menuList = transaction.menu.map(item => {
              totalKeseluruhan += parseFloat(item.subtotal || 0);
              return `${item.nama_menu} x ${item.kuantitas} = Rp. ${parseFloat(item.subtotal || 0).toLocaleString()}`;
          }).join("<br>");
      } else {
          menuList = "<i>Data menu tidak tersedia.</i>";
      }

      orderDiv.innerHTML = `
          <h4>Transaksi ID: ${transaction.id}</h4>
          <p>Nama: ${transaction.nama_pengguna || "Tidak Diketahui"}</p>
          <p>Meja: ${transaction.table_id}</p>
          <p>Metode Pembayaran: ${transaction.metode_pembayaran}</p>
          <p>Total: Rp. ${parseFloat(transaction.total_harga).toLocaleString()}</p>
          <p>Waktu: ${transaction.created_at}</p>
          <p><strong>Pesanan:</strong></p>
          <p>${menuList}</p>
      `;

      orderItems.appendChild(orderDiv);
  });

  document.getElementById("total").textContent = `Total: Rp. ${totalKeseluruhan.toLocaleString()}`;
}



// Panggil fetchKasirData saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchKasirData);

// Fetch data menu dari API
async function fetchMenu() {
  try {
    const response = await fetch("http://localhost:8000/api/menu.php");
    if (!response.ok) throw new Error("Gagal mengambil data menu.");

    // Ambil respon sebagai teks
    let textData = await response.text();

    // Cetak respons ke konsol untuk debugging
    console.log("Respons dari server:", textData);

    // Hilangkan semua teks tambahan sebelum JSON dimulai
    let jsonStartIndex = textData.indexOf("["); // Mencari awal array JSON
    if (jsonStartIndex === -1) throw new Error("JSON tidak ditemukan dalam respons");

    let cleanJsonText = textData.substring(jsonStartIndex).trim();

    // Cek apakah JSON sudah valid sebelum parsing
    let data;
    try {
      data = JSON.parse(cleanJsonText);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      throw new Error("Format JSON tidak valid");
    }

    // Cetak data hasil parsing ke konsol
    console.log("Data JSON setelah parsing:", data);

    // Tampilkan menu di frontend
    displayMenu(data);
  } catch (error) {
    console.error("Error:", error);
    productList.innerHTML = `<p>Gagal memuat menu. Coba lagi nanti.</p>`;
  }
}


// Fungsi untuk menampilkan menu ke frontend
function displayMenu(menuItems) {
  const productList = document.getElementById("product-list"); // Sesuaikan dengan ID di HTML
  productList.innerHTML = ""; // Kosongkan isi sebelumnya

  if (menuItems.length === 0) {
      productList.innerHTML = "<p>Tidak ada menu tersedia.</p>";
      return;
  }

  menuItems.forEach(item => {
      const menuItem = document.createElement("div");
      menuItem.classList.add("menu-item");
      menuItem.innerHTML = `
          <h3>${item.nama}</h3>
          <p>Harga: Rp${item.harga.toLocaleString()}</p>
          <p>Kategori: ${item.nama_kategori}</p>
          <p>Status: ${item.status}</p>
      `;
      productList.appendChild(menuItem);
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
  console.log(`Menambahkan ${productName} ke pesanan`);

  if (!order[productId]) {
    order[productId] = {
      name: productName,
      price: productPrice,
      quantity: 0,
    };
  }

  order[productId].quantity++;

  updateOrderSummary(); // Perbarui total setelah menambahkan item
}


// Fungsi untuk memperbarui ringkasan pesanan
function updateOrderSummary() {
  orderItems.innerHTML = ""; // Bersihkan daftar pesanan
  let total = 0;

  console.log("Data Order:", order); // 🛠️ Debugging: cek isi order

  Object.values(order).forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x ${item.quantity} = Rp. ${(item.price * item.quantity).toLocaleString()}`;
    orderItems.appendChild(li);

    total += item.price * item.quantity;
  });

  // Perbarui total harga
  console.log("Total Harga:", total); // 🛠️ Debugging: cek total harga
  totalElement.textContent = `Total: Rp. ${total.toLocaleString()}`;

  // Pastikan total juga muncul di modal pembayaran
  document.getElementById("takeaway-total").textContent = `Rp. ${total.toLocaleString()}`;
  document.getElementById("dine-in-total").textContent = `Rp. ${total.toLocaleString()}`;
}



// Fungsi untuk membuka pop-up
function openPopup(popup, totalId) {
  popup.style.display = "block";
  // popupOverlay.style.display = "block";

  // Perbarui total harga
  const totalPrice = Object.values(order).reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById(totalId).textContent = totalPrice.toLocaleString();

  // Perbarui daftar pesanan
  const orderList = popup.querySelector(".order-items");
  if (orderList) {
    orderList.innerHTML = ""; // Bersihkan daftar sebelumnya
    Object.values(order).forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.name} x ${item.quantity} = Rp. ${(item.price * item.quantity).toLocaleString()}`;
      orderList.appendChild(li);
    });
  }
}

// Event Listener untuk "Bawa Pulang"
takeawayCard.addEventListener("click", () => openPopup(takeawayPopup, "takeaway-total"));

// Event Listener untuk "Makan di Tempat"
dineinCard.addEventListener("click", () => openPopup(dineinPopup, "dine-in-total"));

// Tutup Pop-Up
closeTakeaway.addEventListener("click", () => {
  takeawayPopup.style.display = "none";
  popupOverlay.style.display = "none";
});
popupOverlay.addEventListener("click", () => {
  takeawayPopup.style.display = "none";
  dineinPopup.style.display = "none";
  popupOverlay.style.display = "none";
});



// Panggil fungsi fetch menu saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchMenu);

document.addEventListener("DOMContentLoaded", () => {
  fetchMenu();  // Ambil menu
  fetchKasirData();  // Ambil data transaksi
  updateOrderSummary();  // 🔹 Pastikan total langsung diperbarui saat halaman dimuat
});
