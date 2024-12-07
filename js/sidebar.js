// sidebar.js
document.addEventListener("DOMContentLoaded", function () {
    // Sidebar HTML structure
    const sidebarHTML = `
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>Pos Cashiering Rumah Makan</h2>
        </div>
        <nav class="sidebar-nav">
          <ul>
            <li><a href="dashboard.html" class="sidebar-link" data-page="dashboard"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
            <li><a href="kategori.html" class="sidebar-link" data-page="kategori"><i class="fas fa-list"></i> Kategori</a></li>
            <li><a href="produk.html" class="sidebar-link" data-page="produk"><i class="fas fa-box"></i> Produk</a></li>
            <li><a href="kasir.html" class="sidebar-link" data-page="kasir"><i class="fas fa-cash-register"></i> Kasir</a></li>
            <li><a href="pengguna.html" class="sidebar-link" data-page="pengguna"><i class="fas fa-users"></i> Pengguna</a></li>
            <li><a href="meja.html" class="sidebar-link" data-page="meja"><i class="fas fa-chair"></i> Meja</a></li>
          </ul>
        </nav>
      </aside>
    `;
  
    // Inject sidebar into the page
    document.body.insertAdjacentHTML("afterbegin", sidebarHTML);
  
    // Highlight the active link
    const currentPage = document.body.getAttribute("data-page");
    if (currentPage) {
      const activeLink = document.querySelector(`.sidebar-link[data-page="${currentPage}"]`);
      if (activeLink) {
        activeLink.classList.add("active");
      }
    }
  });
  