document.addEventListener('DOMContentLoaded', function () {
  const categoryForm = document.getElementById('category-form');
  const categoryTableBody = document.getElementById('category-body');
  const categoryNameInput = document.getElementById('category-name');
  const categoryTypeInput = document.getElementById('category-type');

  // Muat kategori dari localStorage jika ada
  let categories = JSON.parse(localStorage.getItem('categories')) || [];

  // Fungsi untuk menambah kategori baru
  categoryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const categoryName = categoryNameInput.value;
      const categoryType = categoryTypeInput.value;

      if (categoryName && categoryType) {
          const category = { name: categoryName, type: categoryType };
          categories.push(category);

          // Simpan kategori ke localStorage
          localStorage.setItem('categories', JSON.stringify(categories));

          // Reset form
          categoryNameInput.value = '';
          categoryTypeInput.value = '';

          // Render kategori yang baru
          renderCategories();
      }
  });

  // Fungsi untuk render kategori di tabel
  function renderCategories() {
      categoryTableBody.innerHTML = '';

      categories.forEach((category, index) => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
              <td>${category.name}</td>
              <td>${category.type}</td>
              <td>
                  <button class="edit-btn" onclick="editCategory(${index})">Edit</button>
                  <button class="delete-btn" onclick="deleteCategory(${index})">Delete</button>
              </td>
          `;
          categoryTableBody.appendChild(tr);
      });
  }

  // Fungsi untuk mengedit kategori
  window.editCategory = function (index) {
      const category = categories[index];
      categoryNameInput.value = category.name;
      categoryTypeInput.value = category.type;

      // Hapus kategori dari array setelah edit
      deleteCategory(index);
  }

  // Fungsi untuk menghapus kategori
  window.deleteCategory = function (index) {
      categories.splice(index, 1);
      
      // Simpan perubahan kategori ke localStorage
      localStorage.setItem('categories', JSON.stringify(categories));

      renderCategories();
  }

  // Render kategori yang ada saat halaman dimuat
  renderCategories();
});
