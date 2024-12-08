document.addEventListener("DOMContentLoaded", function () {
  // Sidebar HTML structure
  const sidebarHTML = `
    <aside class="sidebar">
      <div class="sidebar-header">
        <img src="img/logopadang.png" alt="Logo Rumah Makan Padang">
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li><a href="index.html" class="sidebar-link" data-page="beranda"><i class="fas fa-tachometer-alt"></i><span>Beranda</span></a></li>
          <li><a href="kategori.html" class="sidebar-link" data-page="kategori"><i class="fas fa-list"></i><span>Kategori</span></a></li>
          <li><a href="menu.html" class="sidebar-link" data-page="menu"><i class="fas fa-box"></i><span>Menu</span></a></li>
          <li><a href="kasir.html" class="sidebar-link" data-page="kasir"><i class="fas fa-cash-register"></i><span>Kasir</span></a></li>
          <li><a href="pengguna.html" class="sidebar-link" data-page="pengguna"><i class="fas fa-users"></i><span>Pengguna</span></a></li>
          <li><a href="meja.html" class="sidebar-link" data-page="meja"><i class="fas fa-chair"></i><span>Meja</span></a></li>
          <li><a href="riwayat.html" class="sidebar-link" data-page="riwayat"><i class="fas fa-history"></i><span>Riwayat</span></a></li>

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
