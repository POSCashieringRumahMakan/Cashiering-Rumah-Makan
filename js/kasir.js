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

// Fetch data menu dari API
async function fetchMenu() {
  try {
    const response = await fetch("http://localhost:8000/api/menu.php");
    if (!response.ok) throw new Error("Gagal mengambil data menu.");

    // Ambil respon sebagai teks
    const textData = await response.text();

    // Hilangkan teks "Koneksi berhasil!" sebelum JSON
    const jsonData = textData.replace(/^Koneksi berhasil!/, "");

    // Parse JSON
    const data = JSON.parse(jsonData);

    // Tampilkan menu
    displayMenu(data);
  } catch (error) {
    console.error("Error:", error);
    productList.innerHTML = `<p>Gagal memuat menu. Coba lagi nanti.</p>`;
  }
}

// Fungsi untuk menampilkan semua menu
function displayMenu(menu) {
  productList.innerHTML = ""; // Bersihkan daftar produk

  menu.forEach(item => {
    if (item.status === "Tersedia") { // Hanya tampilkan item yang tersedia
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.innerHTML = `
        <h4>${item.nama}</h4>
        <p>Rp. ${parseInt(item.harga).toLocaleString()}</p>
        <p><strong>Status:</strong> ${item.status}</p>
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
