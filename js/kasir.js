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
    { name: "Sample Cheese Cake Slice", price: 22000 },
    { name: "Sample Brownies", price: 25000 },
    { name: "Sample Cappuccino Medium", price: 45000 }
  ],
  drinks: [
    { name: "Iced Coffee", price: 15000 },
    { name: "Milk Tea", price: 18000 },
    { name: "Green Tea Latte", price: 20000 }
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

// Tampilkan kategori Food saat pertama kali
showCategory("food");

// Muat data order dari localStorage saat halaman pertama kali dimuat
loadOrderFromLocalStorage();