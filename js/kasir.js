document.addEventListener("DOMContentLoaded", () => {
    const products = {
      drinks: [
        "Cappuccino",
        "Hot Chocolate",
        "Caramel Latte",
        "Smoothie",
        "Espresso"
      ],
      food: ["Burger", "Pizza", "Sandwich", "Pasta", "Salad"]
    };
  
    const productList = document.getElementById("product-list");
    const categoryButtons = document.querySelectorAll(".category-btn");
  
    categoryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.category;
        displayProducts(products[category]);
      });
    });
  
    function displayProducts(productArray) {
      productList.innerHTML = "";
      productArray.forEach((product) => {
        const productButton = document.createElement("button");
        productButton.className = "product-btn";
        productButton.textContent = product;
        productList.appendChild(productButton);
      });
    }
  });
  