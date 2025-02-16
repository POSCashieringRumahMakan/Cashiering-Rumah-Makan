document.addEventListener("DOMContentLoaded", function () {
    fetchBookings();
});

function fetchBookings() {
    fetch("http://localhost:8000/api/booking.php")
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("booking-container");
            container.innerHTML = ""; // Bersihkan isi sebelum menambahkan data baru

            data.forEach(booking => {
                const card = document.createElement("div");
                card.classList.add("booking-card");
                card.innerHTML = `
                    <h3>Meja: ${booking.table_id}</h3>
                    <p><strong>Pelanggan:</strong> ${booking.customer_name}</p>
                    <p><strong>Waktu:</strong> ${booking.booking_time}</p>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => console.error("Error fetching data:", error));
}
