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

// Fungsi untuk menampilkan kategori produk
function showCategory(category) {
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
    productCard.innerHTML = `<h4>${product.name}</h4><p>Rp. ${product.price.toLocaleString()}</p>`;
    productCard.onclick = () => addToOrder(product);
    productList.appendChild(productCard);
  });
}

// Fungsi untuk menambahkan produk ke daftar order
function addToOrder(product) {
  const existing = order.find(item => item.name === product.name);
  if (existing) {
    existing.quantity++;
  } else {
    order.push({ ...product, quantity: 1 });
  }
  renderOrder();
}

// Fungsi untuk menampilkan daftar order
function renderOrder() {
  const orderItems = document.getElementById("order-items");
  const totalElement = document.getElementById("total");
  orderItems.innerHTML = "";
  let total = 0;

  order.forEach(item => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.innerHTML = `${item.quantity}x ${item.name} - Rp. ${(item.price * item.quantity).toLocaleString()}`;
    orderItems.appendChild(li);
  });

  totalElement.innerHTML = `Total: Rp. ${total.toLocaleString()}`;
}

// Tampilkan kategori Food saat pertama kali
showCategory("food");