// Fungsi untuk mencari produk
function searchProducts() {
  const query = document.getElementById("search").value.toLowerCase();
  const productList = document.getElementById("product-list");

  // Ambil kategori aktif
  const activeCategory = document.querySelector(".categories button.active").textContent.toLowerCase();
  const productsInCategory = products[activeCategory];

  // Filter produk berdasarkan input pencarian
  const filteredProducts = productsInCategory.filter(product =>
    product.name.toLowerCase().includes(query)
  );

  // Render produk hasil pencarian
  productList.innerHTML = "";
  filteredProducts.forEach(product => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `<h4>${product.name}</h4><p>Rp. ${product.price.toLocaleString()}</p>`;
    productCard.addEventListener("click", () => addToOrder(product));
    productList.appendChild(productCard);
  });
}

// Data Produk
const products = {
  food: [
    { name: "Rendang Daging", price: 45000 },
    { name: "Gulai Ikan Patin", price: 40000 },
    { name: "Ayam Pop", price: 35000 },
    { name: "Sate Padang", price: 30000 },
    { name: "Nasi Padang Komplit", price: 50000 },
    { name: "Gulai Kambing", price: 45000 },
    { name: "Ikan Bakar Padang", price: 40000 },
    { name: "Paket Nasi Padang (Porsi Besar)", price: 65000 },
    { name: "Dendeng Balado", price: 50000 },
    { name: "Sop Iga Padang", price: 40000 }
  ],
  drinks: [
    { name: "Teh Talua", price: 10000 },
    { name: "Es Cendol Padang", price: 12000 },
    { name: "Es Kelapa Muda", price: 20000 },
    { name: "Air Tebu", price: 12000 },
    { name: "Es Jeruk", price: 15000 },
    { name: "Bandrek", price: 10000 },
    { name: "Kopi Padang", price: 12000 },
    { name: "Sirsak Juice", price: 15000 },
  ],
  snack: [
    { name: "Kue Cubir", price: 5000 },
    { name: "Pisang Salai", price: 10000 },
    { name: "Keripik Balado", price: 15000 },
    { name: "Panada", price: 7000 },
    { name: "Rendang Crispy", price: 20000 },
    { name: "Sate Padang Mini", price: 15000 },
    { name: "Tahu Tempe Padang", price: 10000 },
    { name: "Gorengan", price: 5000 },
    { name: "Kue Talam", price: 50000 },
  ]
};

// Order List
let order = [];
let activeCategory = "food"; // Default ke "food"

// Fungsi untuk menampilkan kategori produk
function showCategory(category) {
  activeCategory = category; // Simpan kategori aktif
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  // Highlight tombol aktif
  document.querySelectorAll(".categories button").forEach(btn => {
    btn.classList.remove("active");
  });
  document.querySelector(`.categories button[onclick="showCategory('${category}')"]`).classList.add("active");

  // Menampilkan produk
  products[category].forEach(product => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    // Cek apakah produk sudah ada di order
    const existing = order.find(item => item.name === product.name);
    const quantity = existing ? existing.quantity : 0;

    productCard.innerHTML = `
      <h4>${product.name}</h4>
      <p>Rp. ${product.price.toLocaleString()}</p>
      <div class="quantity-control">
        <button onclick="decreaseQuantity('${product.name}')">-</button>
        <span class="quantity">${quantity}</span>
        <button onclick="increaseQuantity('${product.name}')">+</button>
      </div>
    `;
    productList.appendChild(productCard);
  });
}

// Fungsi untuk menambah jumlah pesanan
function increaseQuantity(productName) {
  const product = Object.values(products)
    .flat()
    .find(item => item.name === productName);

  const existing = order.find(item => item.name === product.name);
  if (existing) {
    existing.quantity++;
  } else {
    order.push({ ...product, quantity: 1 });
  }

  saveOrderToLocalStorage();
  showCategory(activeCategory); // Gunakan kategori aktif
  renderOrder();
}

// Fungsi untuk mengurangi jumlah pesanan
function decreaseQuantity(productName) {
  const existing = order.find(item => item.name === productName);
  if (existing) {
    existing.quantity--;
    if (existing.quantity === 0) {
      order = order.filter(item => item.name !== productName); // Hapus dari order jika jumlah 0
    }
  }

  saveOrderToLocalStorage();
  showCategory(activeCategory); // Gunakan kategori aktif
  renderOrder();
}

// Fungsi untuk menambahkan produk ke daftar order
function addToOrder(product) {
  const existing = order.find(item => item.name === product.name);
  if (existing) {
    existing.quantity++;
  } else {
    order.push({ ...product, quantity: 1 });
  }
  saveOrderToLocalStorage();
  renderOrder();
}

// Fungsi untuk menampilkan daftar order
function renderOrder() {
  const orderItems = document.getElementById("order-items");
  const totalElement = document.getElementById("total");

  // Cek apakah elemen ada untuk menghindari error
  if (!orderItems || !totalElement) {
    console.error("Elemen order-items atau total tidak ditemukan!");
    return;
  }

  orderItems.innerHTML = "";
  let total = 0;

  // Menampilkan setiap item dalam pesanan
  order.forEach((item, index) => {
    total += item.price * item.quantity;

    const li = document.createElement("li");
    li.innerHTML = `
    ${item.quantity}x ${item.name} - Rp. ${(item.price * item.quantity).toLocaleString()}
    <i class="fas fa-trash-alt remove-icon" onclick="removeFromOrder(${index})"></i>
  `;
    orderItems.appendChild(li);
  });

  // Memperbarui total
  totalElement.innerHTML = `Total: Rp. ${total.toLocaleString()}`;
}

// Fungsi untuk menghapus item dari pesanan
function removeFromOrder(index) {
  order.splice(index, 1); // Menghapus item berdasarkan indeks
  saveOrderToLocalStorage();
  renderOrder();
}

// Fungsi untuk menyimpan order ke localStorage
function saveOrderToLocalStorage() {
  localStorage.setItem("order", JSON.stringify(order));
}

// Fungsi untuk memuat order dari localStorage
function loadOrderFromLocalStorage() {
  const storedOrder = localStorage.getItem("order");
  if (storedOrder) {
    order = JSON.parse(storedOrder);
    renderOrder();
  }
}

// Mengambil elemen dari HTML
const payButton = document.getElementById('pay-button');
const orderItems = document.getElementById('order-items');
const totalElement = document.getElementById('total');

// Fungsi untuk menangani pemilihan filter kartu
const filterCards = document.querySelectorAll('.filter-card');
filterCards.forEach(card => {
  card.addEventListener('click', () => {
    // Menghapus class 'selected' dari semua kartu
    filterCards.forEach(c => c.classList.remove('selected'));

    // Menambahkan class 'selected' pada kartu yang dipilih
    card.classList.add('selected');
    // Buka pop-up yang sesuai
    if (card.id === 'dine-in-filter') {
      const totalAmount = order.reduce((total, item) => total + (item.price * item.quantity), 0);
      document.getElementById("dine-in-total").textContent = totalAmount.toLocaleString();
      document.getElementById("dine-in-popup").style.display = "flex";
    } else if (card.id === 'takeaway-filter') {
      const totalAmount = order.reduce((total, item) => total + (item.price * item.quantity), 0);
      document.getElementById("takeaway-total").textContent = totalAmount.toLocaleString();
      document.getElementById("takeaway-popup").style.display = "flex";
    }
  });
});

// Fungsi event listener untuk pembayaran
document.addEventListener('DOMContentLoaded', function () {
  // Tombol bayar untuk Bawa Pulang
  const payButton = document.getElementById('pay-button');
  if (payButton) {
    payButton.addEventListener('click', function () {
      const selectedCard = document.querySelector('.filter-card.selected');
      if (selectedCard) {
        const totalAmount = order.reduce((total, item) => total + (item.price * item.quantity), 0);
        document.getElementById("takeaway-name").value = "";
        document.getElementById("takeaway-note").value = "";
        document.getElementById("takeaway-total").textContent = totalAmount.toLocaleString();
        document.getElementById("takeaway-popup").style.display = "flex";
      } else {
        alert('Pilih jenis pesanan terlebih dahulu!');
      }
    });
  } else {
    console.error('Pay button not found!');
  }

  // Tombol bayar untuk makan di tempat
  const payDineInButton = document.getElementById('pay-dine-in');
  if (payDineInButton) {
    payDineInButton.addEventListener('click', function () {
      const name = document.getElementById('dine-in-name').value;
      const tableNumber = document.getElementById('table-number').value;
      const paymentMethod = document.getElementById('dine-in-payment-method').value;
      const cashAmount = document.getElementById('dine-in-cash-amount').value; // Ambil input jumlah uang
      const totalAmount = order.reduce((total, item) => total + (item.price * item.quantity), 0); // Hitung total pesanan

      if (paymentMethod === "cash") {
        if (cashAmount >= totalAmount) {
          const change = cashAmount - totalAmount; // Hitung kembalian
          alert(`Pembayaran berhasil!\nNama: ${name}\nMeja: ${tableNumber}\nKembalian Anda: Rp. ${change.toLocaleString()}`);
          document.getElementById("dine-in-popup").style.display = "none"; // Tutup pop-up setelah pembayaran
          order = []; // Reset pesanan
          renderOrder(); // Perbarui tampilan pesanan
        } else {
          alert(`Uang yang diberikan kurang. Total pesanan: Rp. ${totalAmount.toLocaleString()}`);
        }
      } else {
        alert("Pembayaran berhasil tanpa tunai.");
        document.getElementById("dine-in-popup").style.display = "none"; // Tutup pop-up setelah pembayaran
        order = []; // Reset pesanan
        renderOrder(); // Perbarui tampilan pesanan
      }
    });

    // Pop-up untuk Makan di Tempat
    const dineInFilterCard = document.getElementById("dinein-card");
    dineInFilterCard.addEventListener('click', () => {
      const totalAmount = order.reduce((total, item) => total + (item.price * item.quantity), 0);
      document.getElementById("dine-in-total").textContent = totalAmount.toLocaleString();
      document.getElementById("dine-in-popup").style.display = "flex"; // Tampilkan pop-up "Makan di Tempat"
    });

    // Elemen untuk 'Takeaway'
    const paymentMethodTakeaway = document.getElementById("payment-method");
    const cashAmountTakeaway = document.getElementById("cash-amount");
    const cashAmountLabelTakeaway = document.getElementById("cash-amount-label");

    // Elemen untuk 'Dine In'
    const paymentMethodDineIn = document.getElementById("dine-in-payment-method");
    const cashAmountDineIn = document.getElementById("dine-in-cash-amount");
    const cashAmountLabelDineIn = document.getElementById("dine-in-cash-amount-label");

    // Fungsi untuk toggle input jumlah tunai
    function toggleCashAmount(paymentMethod, cashAmount, cashLabel) {
      if (paymentMethod.value === "cash") {
        cashAmount.style.display = "block";
        cashLabel.style.display = "block";
      } else {
        cashAmount.style.display = "none";
        cashLabel.style.display = "none";
        cashAmount.value = ""; // Reset input tunai
      }
    }
    // Event listener untuk 'Takeaway'
    paymentMethodTakeaway.addEventListener("change", () => {
      toggleCashAmount(paymentMethodTakeaway, cashAmountTakeaway, cashAmountLabelTakeaway);
    });

    // Event listener untuk 'Dine In'
    paymentMethodDineIn.addEventListener("change", () => {
      if (paymentMethodDineIn.value === "cash") {
        cashAmountDineIn.style.display = "block";
        cashAmountLabelDineIn.style.display = "block";
      } else {
        cashAmountDineIn.style.display = "none";
        cashAmountLabelDineIn.style.display = "none";
        cashAmountDineIn.value = ""; // Reset input tunai
      }
    });

    // Panggil fungsi awal untuk memastikan tampilan input sesuai saat halaman dimuat
    toggleCashAmount(paymentMethodTakeaway, cashAmountTakeaway, cashAmountLabelTakeaway);
    toggleCashAmount(paymentMethodDineIn, cashAmountDineIn, cashAmountLabelDineIn);

    // Tombol close untuk pop-up "Takeaway"
    const closeTakeawayBtn = document.getElementById('close-takeaway');
    if (closeTakeawayBtn) {
      closeTakeawayBtn.addEventListener('click', function () {
        document.getElementById('takeaway-popup').style.display = 'none';
      });
    }

    // Tombol close untuk pop-up "Dine In"
    const closeDineInBtn = document.getElementById('close-dine-in');
    if (closeDineInBtn) {
      closeDineInBtn.addEventListener('click', function () {
        document.getElementById('dine-in-popup').style.display = 'none';
      });
    }

    // Fungsi umum untuk pembayaran
    function processPayment(paymentMethod, cashAmountInput, totalAmount) {
      const cashAmount = parseFloat(cashAmountInput.value) || 0;

      if (paymentMethod === "cash") {
        if (cashAmount < totalAmount) {
          // Validasi jika jumlah tunai kurang
          alert(`Jumlah uang tunai kurang! Total: Rp. ${totalAmount.toLocaleString()}, Anda hanya memberikan Rp. ${cashAmount.toLocaleString()}.`);
        } else {
          // Jika jumlah tunai mencukupi
          const change = cashAmount - totalAmount;
          alert(`Pembayaran berhasil! Kembalian Anda adalah Rp. ${change.toLocaleString()}.`);
          cashAmountInput.value = ''; // Reset input uang tunai
        }
      } else if (paymentMethod) {
        // Pembayaran dengan metode selain tunai
        alert(`Pembayaran berhasil menggunakan ${paymentMethod}!`);
      } else {
        // Jika metode pembayaran belum dipilih
        alert("Silakan pilih metode pembayaran terlebih dahulu.");
      }
    }

    document.getElementById('pay-now').addEventListener('click', () => {
      const paymentMethod = paymentMethodTakeaway.value; // Ambil metode pembayaran
      const cashAmountInput = cashAmountTakeaway; // Ambil input jumlah tunai
      const totalAmount = parseFloat(document.getElementById("takeaway-total").textContent.replace(/,/g, '')
      ) || 0; // Total belanja (konversi dari string)
      const cashAmount = parseFloat(cashAmountInput.value) || 0; // Ambil jumlah tunai

      if (paymentMethod === "cash") {
        if (cashAmount < totalAmount) {
          // Validasi jika jumlah tunai kurang
          alert(`Jumlah uang tunai kurang! Total: Rp. ${totalAmount.toLocaleString()}, Anda hanya memberikan Rp. ${cashAmount.toLocaleString()}.`);
        } else {
          // Jika jumlah tunai mencukupi
          const change = cashAmount - totalAmount;
          alert(`Pembayaran berhasil! Kembalian Anda adalah Rp. ${change.toLocaleString()}.`);
          cashAmountInput.value = ''; // Reset input uang tunai
        }
      } else if (paymentMethod) {
        // Validasi untuk metode pembayaran non-tunai
        alert(`Pembayaran berhasil menggunakan ${paymentMethod}!`);
      } else {
        // Jika metode pembayaran belum dipilih
        alert("Silakan pilih metode pembayaran terlebih dahulu.");
      }



      // Reset data atau logika tambahan lainnya
      order = []; // Kosongkan pesanan
      saveOrderToLocalStorage(); // Simpan perubahan ke localStorage
      renderOrder(); // Render ulang daftar pesanan
      document.getElementById("takeaway-popup").style.display = "none"; // Tutup popup


      // Pastikan elemen dengan ID lain juga ada
      if (dineInButton) {
        dineInButton.addEventListener("click", function () {
          // Tindakan saat klik Makan di Tempat
          console.log("Makan di Tempat dipilih");
          // Memunculkan pop-up untuk Makan di Tempat
        });
      } else {
        console.error("Dine-in button not found!");
      }
    });

    // Listener untuk tombol bayar
    document.getElementById('pay-button').addEventListener('click', () => {
      const selectedFilter = document.querySelector('.filter-card.selected');

      if (!selectedFilter) {
        alert('Pilih jenis pesanan terlebih dahulu!');
        return;
      }

      const totalAmount = order.reduce((total, item) => total + (item.price * item.quantity), 0);
      if (selectedFilter.id === 'dine-in-filter') {
        document.getElementById("dine-in-total").textContent = totalAmount.toLocaleString();
        document.getElementById("dine-in-popup").style.display = "flex"; // Pop-up Makan di Tempat
      } else if (selectedFilter.id === 'takeaway-filter') {
        document.getElementById("takeaway-total").textContent = totalAmount.toLocaleString();
        document.getElementById("takeaway-popup").style.display = "flex"; // Pop-up Bawa Pulang
      }
    });

    // Listener untuk tombol "Makan di Tempat"
    document.getElementById('dinein-card').addEventListener('click', () => {
      const totalAmount = order.reduce((total, item) => total + (item.price * item.quantity), 0);
      document.getElementById("dine-in-total").textContent = totalAmount.toLocaleString();
      document.getElementById("dine-in-popup").style.display = "flex"; // Menampilkan pop-up Makan di Tempat
    });
  }

  // Tombol close untuk pop-up Bawa Pulang
  const closeTakeawayBtn = document.getElementById('close-takeaway');
  if (closeTakeawayBtn) {
    closeTakeawayBtn.addEventListener('click', function () {
      const takeawayPopup = document.getElementById('takeaway-popup');
      takeawayPopup.style.display = 'none';
    });
  }

  // Tombol close untuk pop-up Makan di Tempat
  const closeDineInBtn = document.getElementById('close-dine-in');
  if (closeDineInBtn) {
    closeDineInBtn.addEventListener('click', function () {
      const dineInPopup = document.getElementById('dine-in-popup');
      dineInPopup.style.display = 'none';
    });
  }

  document.getElementById('dinein-card').addEventListener('click', () => {
    const totalAmount = order.reduce((total, item) => total + (item.price * item.quantity), 0);
    document.getElementById("dine-in-total").textContent = totalAmount.toLocaleString();
    document.getElementById("dine-in-popup").style.display = "flex";
  });

  // Inisialisasi saat halaman dimuat
  window.onload = function () {
    loadOrderFromLocalStorage();
    showCategory("food"); // Tampilkan kategori makanan pertama kali
  };

  // Fungsi Cetak Dinamis
  function printOrderDynamic(orderType) {
    // Ambil data berdasarkan jenis pesanan (bawa pulang atau makan di tempat)
    let name, note, paymentMethod, cashAmount, total, extraInfo = "";

    if (orderType === "takeaway") {
      name = document.getElementById("takeaway-name").value || "Tidak Diketahui";
      note = document.getElementById("takeaway-note").value || "-";
      paymentMethod = document.getElementById("payment-method").value || "-";
      cashAmount = document.getElementById("cash-amount").value || "0";
      total = document.getElementById("takeaway-total").textContent || "0";
    } else if (orderType === "dinein") {
      name = document.getElementById("dine-in-name").value || "Tidak Diketahui";
      note = document.getElementById("dine-in-note").value || "-";
      paymentMethod = document.getElementById("dine-in-payment-method").value || "-";
      cashAmount = document.getElementById("dine-in-cash-amount").value || "0";
      total = document.getElementById("dine-in-total").textContent || "0";
      extraInfo = `<p><strong>Nomor Meja:</strong> ${document.getElementById("table-number").value || "-"}</p>`;
    }

    // Ambil total dan jumlah tunai dari elemen tanpa mengubah formatnya
    const formattedCashAmount = document.getElementById(orderType === "takeaway" ? "cash-amount" : "dine-in-cash-amount").value || "0";
    const formattedTotal = document.getElementById(orderType === "takeaway" ? "takeaway-total" : "dine-in-total").textContent || "0";

    // Jendela Cetak
    const printWindow = window.open("", "", "width=600,height=400");

    printWindow.document.write(`
    <html>
      <head>
        <title>Struk Pesanan</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <h1>Struk Pesanan</h1>
        <p><strong>Nama Pemesan:</strong> ${name}</p>
        <p><strong>Catatan:</strong> ${note}</p>
        <p><strong>Metode Pembayaran:</strong> ${paymentMethod}</p>
        <p><strong>Jumlah Tunai:</strong> ${formattedCashAmount}</p>
        <p><strong>Total:</strong> ${formattedTotal}</p>
        ${extraInfo}
        <script>
          window.print();
          window.onafterprint = function () { window.close(); }
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  }

  // Event Listener untuk Tombol Cetak
  document.getElementById("print-takeaway").addEventListener("click", () => {
    printOrderDynamic("takeaway");
  });

  document.getElementById("print-dinein").addEventListener("click", () => {
    printOrderDynamic("dinein");
  });
}
)

