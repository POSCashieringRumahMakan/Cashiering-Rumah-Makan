document.addEventListener("DOMContentLoaded", fetchOrderHistory);

async function fetchOrderHistory() {
  try {
      const response = await fetch("http://localhost:8000/api/kasir.php");
      let textData = await response.text(); // Ambil sebagai teks terlebih dahulu

      // Hilangkan "Koneksi berhasil!" jika ada
      let jsonData = textData.replace(/^Koneksi berhasil!\s*/, ''); 

      const orders = JSON.parse(jsonData); // Ubah ke JSON
      displayOrders(orders);
  } catch (error) {
      console.error("Error:", error);
  }
}

function displayOrders(orders) {
  const orderContainer = document.getElementById("order-data");
  orderContainer.innerHTML = ""; // Kosongkan kontainer sebelum menambahkan elemen baru

  orders.forEach(order => {
      const orderCard = document.createElement("div");
      orderCard.classList.add("order-card");
      orderCard.innerHTML = `
          <h3>${order.nama_pengguna}</h3>
          <p>Meja: ${order.table_id}</p>
          <p>Metode Pembayaran: ${order.metode_pembayaran}</p>
          <p>Total: Rp ${parseFloat(order.total_harga).toLocaleString()}</p>
          <p>Tanggal: ${order.created_at}</p>
      `;
      orderContainer.appendChild(orderCard);
  });
}

function viewDetail(orderId) {
    alert("Menampilkan detail untuk pesanan #" + orderId);
}

// Panggil fungsi saat halaman dimuat
fetchOrderHistory();