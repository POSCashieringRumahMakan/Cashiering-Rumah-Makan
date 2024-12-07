// Data Produk dan Kategori
let products = JSON.parse(localStorage.getItem("products")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [];
let editingProductIndex = -1;  // Untuk melacak produk yang sedang diedit

// Simpan ke Local Storage
const saveToLocalStorage = () => {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("categories", JSON.stringify(categories));
};

// Render Produk
const renderProducts = () => {
  const productTable = document.querySelector("#productTable tbody");
  productTable.innerHTML = "";

  products.forEach((product, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${product.photo}" alt="${product.name}" width="50"></td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(product.price)}</td>
      <td>${product.isActive ? "Tersedia" : "Tidak Tersedia"}</td>
      <td>
        <button onclick="editProduct(${index})">Edit</button>
        <button onclick="deleteProduct(${index})">Hapus</button>
      </td>
    `;
    productTable.appendChild(row);
  });
};

// Tambah atau Edit Produk
document.querySelector("#productForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.querySelector("#productName").value;
  const category = document.querySelector("#productCategory").value;
  const price = parseFloat(document.querySelector("#productPrice").value);
  const photo = document.querySelector("#productPhoto").files[0] ? URL.createObjectURL(document.querySelector("#productPhoto").files[0]) : "";
  const isActive = document.querySelector("#productStatus").value === "true";

  if (editingProductIndex >= 0) {
    // Update Produk yang sudah ada
    products[editingProductIndex] = { name, category, price, photo, isActive };
    editingProductIndex = -1;  // Reset untuk menambahkan produk baru
  } else {
    // Tambah Produk Baru
    products.push({ name, category, price, photo, isActive });
  }

  saveToLocalStorage();
  renderProducts();
  resetProductForm();
});

// Edit Produk
const editProduct = (index) => {
  const product = products[index];
  editingProductIndex = index;  // Set indeks produk yang sedang diedit

  document.querySelector("#productName").value = product.name;
  document.querySelector("#productCategory").value = product.category;
  document.querySelector("#productPrice").value = product.price;
  document.querySelector("#productStatus").value = product.isActive ? "true" : "false";
  // Foto produk tidak bisa diubah langsung, hanya bisa dihapus atau ditambah ulang
  document.querySelector("#productForm button").textContent = "Update Produk";  // Ubah teks tombol menjadi "Update Produk"
};

// Hapus Produk
const deleteProduct = (index) => {
  if (confirm("Yakin ingin menghapus produk ini?")) {
    products.splice(index, 1);
    saveToLocalStorage();
    renderProducts();
  }
};

// Reset Form Produk
const resetProductForm = () => {
  document.querySelector("#productForm").reset();
  document.querySelector("#productForm button").textContent = "Tambah Produk";  // Reset tombol
};

// Render Kategori
const renderCategories = () => {
  const categoryList = document.querySelector("#categoryList");
  categoryList.innerHTML = "";

  categories.forEach((category) => {
    const li = document.createElement("li");
    li.textContent = category;
    categoryList.appendChild(li);
  });

  // Tambah kategori ke dropdown Produk
  const productCategory = document.querySelector("#productCategory");
  productCategory.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
};

// Tambah Kategori
document.querySelector("#categoryForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const categoryName = document.querySelector("#categoryName").value;
  categories.push(categoryName);
  saveToLocalStorage();
  renderCategories();
});

// Tampilkan Tab
const showTab = (tabName) => {
  const tabs = document.querySelectorAll(".tab-content");
  const buttons = document.querySelectorAll(".tab-button");

  tabs.forEach((tab) => tab.classList.remove("active"));
  buttons.forEach((button) => button.classList.remove("active"));

  if (tabName === "product") {
    document.querySelector("#productTab").classList.add("active");
    document.querySelector(".tab-button:nth-child(1)").classList.add("active");
  } else if (tabName === "category") {
    document.querySelector("#categoryTab").classList.add("active");
    document.querySelector(".tab-button:nth-child(2)").classList.add("active");
  }
};

// Inisialisasi
renderProducts();
renderCategories();
showTab('product');
