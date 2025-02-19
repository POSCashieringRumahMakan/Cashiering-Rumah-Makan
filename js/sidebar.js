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
          <li><a href="absensi.html" class="sidebar-link" data-page="absensi"><i class="fas fa-clock"></i><span>Absensi</span></a></li>
          <li><a href="kategori.html" class="sidebar-link" data-page="kategori"><i class="fas fa-list"></i><span>Kategori</span></a></li>
          <li><a href="menu.html" class="sidebar-link" data-page="menu"><i class="fas fa-utensils"></i><span>Menu</span></a></li>
          <li><a href="kasir.html" class="sidebar-link" data-page="kasir"><i class="fas fa-cash-register"></i><span>Kasir</span></a></li>
          <li><a href="pengguna.html" class="sidebar-link" data-page="pengguna"><i class="fas fa-users"></i><span>Pengguna</span></a></li>
          <li><a href="pegawai.html" class="sidebar-link" data-page="pegawai"><i class="fa-solid fa-address-card"></i><span>Pegawai</span></a></li>
          <li><a href="meja.html" class="sidebar-link" data-page="meja"><i class="fas fa-chair"></i><span>Meja</span></a></li>
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
