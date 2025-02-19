// Fungsi untuk mengambil data booking berdasarkan filter
// Fungsi untuk mengambil data booking berdasarkan filter
function fetchBookings(filter) {
    // Menyembunyikan semua div booking terlebih dahulu
    document.getElementById('today-bookings').style.display = 'none';
    document.getElementById('tomorrow-bookings').style.display = 'none';
    document.getElementById('all-bookings').style.display = 'none';
  
    // Memanggil API dengan filter yang sesuai
    fetch(`http://localhost:8000/api/booking.php?filter=${filter}`)
      .then(response => response.json())
      .then(data => {
        // Kontainer sesuai filter
        const bookingContainer = document.getElementById(`${filter}-bookings-container`);
  
        // Menampilkan data booking jika ada
        if (data.length > 0) {
          bookingContainer.innerHTML = data.map(booking => `
            <div class="booking-card">
              <p><strong>Nama:</strong> ${booking.customer_name}</p>
              <p><strong>No Meja:</strong> ${booking.table_id}</p>
              <p><strong>Waktu Booking:</strong> ${booking.booking_time}</p>
              <button class="delete-btn" onclick="deleteBooking(${booking.id})">Hapus</button>
            </div>
          `).join('');
        } else {
          bookingContainer.innerHTML = '<p>Tidak ada booking untuk kategori ini.</p>';
        }
  
        // Menampilkan div yang sesuai dengan filter yang dipilih
        document.getElementById(`${filter}-bookings`).style.display = 'block';
      })
      .catch(error => console.error('Error:', error));
}

// Fungsi untuk menghapus booking
// Fungsi untuk menghapus booking
function deleteBooking(bookingId) {
    // Konfirmasi sebelum menghapus data
    if (confirm('Apakah Anda yakin ingin menghapus booking ini?')) {
        // Mengirim request DELETE untuk menghapus booking
        fetch(`http://localhost:8000/api/booking.php`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: bookingId })  // Mengirim ID booking dalam body request
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Booking berhasil dihapus") {
                alert('Booking berhasil dihapus');
                // Memanggil kembali data booking setelah dihapus
                fetchBookings('all');
            } else {
                alert('Gagal menghapus booking');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}


// Menambahkan event listener untuk memulai tampilan data booking
document.addEventListener('DOMContentLoaded', function () {
    // Memanggil data booking default (semua booking)
    fetchBookings('all');
    
    // Menambahkan event listeners untuk setiap tombol filter
    document.getElementById('today-bookings-btn').addEventListener('click', () => fetchBookings('today'));
    document.getElementById('tomorrow-bookings-btn').addEventListener('click', () => fetchBookings('tomorrow'));
    document.getElementById('all-bookings-btn').addEventListener('click', () => fetchBookings('all'));
});

  
  // Menambahkan event listener untuk memulai tampilan data booking
  document.addEventListener('DOMContentLoaded', function () {
    // Memanggil data booking default (semua booking)
    fetchBookings('all');
    
    // Menambahkan event listeners untuk setiap tombol filter
    document.getElementById('today-bookings-btn').addEventListener('click', () => fetchBookings('today'));
    document.getElementById('tomorrow-bookings-btn').addEventListener('click', () => fetchBookings('tomorrow'));
    document.getElementById('all-bookings-btn').addEventListener('click', () => fetchBookings('all'));
  });
  