document.addEventListener("DOMContentLoaded", () => {
    const productTable = document.querySelector("#productTable tbody");
    const productForm = document.querySelector("#productForm");
  
    // Array to store products
    let products = JSON.parse(localStorage.getItem("products")) || [];
  
    // Format currency to Rupiah
    const formatRupiah = (value) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(value);
    };
  
    // Function to save data to Local Storage
    const saveToLocalStorage = () => {
      localStorage.setItem("products", JSON.stringify(products));
    };
  
    // Function to render products in the table
    const renderProducts = () => {
      productTable.innerHTML = ""; // Clear the table
  
      products.forEach((product, index) => {
        const row = document.createElement("tr");
  
        row.innerHTML = `
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>${formatRupiah(product.price)}</td>
          <td>${product.isActive ? "Active" : "Inactive"}</td>
          <td>
            <button class="edit" onclick="editProduct(${index})">Edit</button>
            <button class="delete" onclick="deleteProduct(${index})">Delete</button>
          </td>
        `;
  
        productTable.appendChild(row);
      });
    };
  
    // Function to add a new product
    productForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const newProduct = {
        name: document.querySelector("#productName").value,
        category: document.querySelector("#productCategory").value,
        price: parseFloat(document.querySelector("#productPrice").value),
        isActive: document.querySelector("#productStatus").value === "true",
      };
  
      products.push(newProduct);
      saveToLocalStorage(); // Save updated data to Local Storage
      renderProducts();
      productForm.reset(); // Clear the form
    });
  
    // Edit product
    window.editProduct = (index) => {
      const product = products[index];
  
      document.querySelector("#productName").value = product.name;
      document.querySelector("#productCategory").value = product.category;
      document.querySelector("#productPrice").value = product.price;
      document.querySelector("#productStatus").value = product.isActive.toString();
  
      products.splice(index, 1); // Remove the product being edited
      saveToLocalStorage(); // Update Local Storage
      renderProducts();
    };
  
    // Delete product
    window.deleteProduct = (index) => {
      if (confirm("Are you sure you want to delete this product?")) {
        products.splice(index, 1);
        saveToLocalStorage(); // Update Local Storage
        renderProducts();
      }
    };
  
    // Initial render
    renderProducts();
  });
  