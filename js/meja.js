const API_URL = "http://localhost:8000/api/table.php";

document.addEventListener("DOMContentLoaded", () => {
    fetchTables();
    document.getElementById("add-table-form").addEventListener("submit", addTable);
    document.getElementById("edit-table-form").addEventListener("submit", saveEditTable);
    document.getElementById("booking-form").addEventListener("submit", bookTable);
});

// Ambil semua meja dari API
function fetchTables() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector(".table-cards-container");
            container.innerHTML = "";
            data.forEach(table => {
                const tableCard = document.createElement("div");
                tableCard.className = "table-card";
                tableCard.innerHTML = `
                    <h3>Meja ${table.number}</h3>
                    <p>Kapasitas: ${table.capacity}</p>
                    <p>Lokasi: ${table.location}</p>
                    <p>Status: ${table.status}</p>
                    <button onclick="editTable(${table.id}, '${table.number}', '${table.capacity}', '${table.status}', '${table.location}')">Edit</button>
                    <button onclick="deleteTable(${table.id})">Hapus</button>
                    ${table.status === "Tersedia" ? `<button onclick="openBookingModal(${table.id})">Booking</button>` : ""}
                `;
                container.appendChild(tableCard);
            });
        });
}

// Tambah meja
function addTable(event) {
    event.preventDefault();
    const data = {
        number: document.getElementById("table-number").value,
        capacity: document.getElementById("capacity").value,
        status: document.getElementById("status").value,
        location: document.getElementById("location").value,  // Ambil nilai dari dropdown
    };
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then(() => {
        closeModal();
        fetchTables();
        alert("Perubahan meja berhasil ditambahkan");
    });
}

// Simpan perubahan meja
function saveEditTable(event) {
    event.preventDefault();
    const id = document.getElementById("edit-table-form").dataset.id;
    const data = {
        id,
        number: document.getElementById("edit-table-number").value,
        capacity: document.getElementById("edit-capacity").value,
        status: document.getElementById("edit-status").value,
        location: document.getElementById("edit-location").value, // Ambil nilai dari dropdown
    };
    fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then(() => {
        closeEditModal();
        fetchTables();
        alert("Perubahan meja berhasil diupdate");
    });
}

// Hapus meja
function deleteTable(id) {
    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus meja ini?");
    if (confirmDelete) {
        fetch(API_URL, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        }).then(() => {
            fetchTables();
            alert("Meja berhasil dihapus!");
        });
    } else {
        alert("Penghapusan meja dibatalkan.");
    }
}


// Edit meja (buka modal edit)
function editTable(id, number, capacity, status, location) {
    document.getElementById("edit-table-number").value = number;
    document.getElementById("edit-capacity").value = capacity;
    document.getElementById("edit-status").value = status;
    document.getElementById("edit-location").value = location; // Pilih lokasi yang sesuai
    document.getElementById("edit-table-form").dataset.id = id;
    document.getElementById("edit-table-modal").style.display = "block";
}

// Simpan perubahan meja
function saveEditTable(event) {
    event.preventDefault();
    const id = document.getElementById("edit-table-form").dataset.id;
    const data = {
        id,
        number: document.getElementById("edit-table-number").value,
        capacity: document.getElementById("edit-capacity").value,
        status: document.getElementById("edit-status").value,
        location: document.getElementById("edit-location").value,
    };
    fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then(() => {
        closeEditModal();
        fetchTables();
        alert("Perubahan meja berhasil diupdate");
    });
}

// Buka modal booking
function openBookingModal(id) {
    document.getElementById("booking-modal").dataset.id = id;
    document.getElementById("booking-modal").style.display = "block";
}

// Booking meja
function bookTable(event) {
    event.preventDefault();
    const id = document.getElementById("booking-modal").dataset.id;
    const data = {
        id,
        status: "Tidak Tersedia"
    };
    fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then(() => {
        closeBookingModal();
        fetchTables();
        alert("Meja berhasil diupdate!");
    });
}




document.addEventListener("DOMContentLoaded", function () {
    const bookingForm = document.getElementById("booking-form");

    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Mencegah reload halaman

        // Ambil data dari form
        const tableId = document.getElementById("table-id").value; // Pastikan ada input hidden dengan id 'table-id'
        const customerName = document.getElementById("customer-name").value;
        const customerPhone = document.getElementById("customer-phone").value;
        const customerEmail = document.getElementById("customer-email").value;
        const bookingDate = document.getElementById("booking-date").value;

        // Validasi input tidak boleh kosong
        if (!tableId || !customerName || !bookingDate) {
            alert("Mohon lengkapi semua data!");
            return;
        }

        // Data yang akan dikirim ke API
        const requestData = {
            table_id: tableId,
            customer_name: customerName,
            customer_phone: customerPhone,
            customer_email: customerEmail,
            booking_time: bookingDate
        };

        // Kirim data ke API menggunakan Fetch
        fetch("http://localhost:8000/api/booking.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message); // Tampilkan pesan dari server
            if (data.message.includes("Booking berhasil")) {
                closeBookingModal(); // Tutup modal setelah booking sukses
                bookingForm.reset(); // Reset form setelah sukses
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Terjadi kesalahan, silakan coba lagi.");
        });
    });
});









function openBookingModal(tableId) {
    document.getElementById("table-id").value = tableId; // Set ID meja ke input hidden
    document.getElementById("booking-modal").style.display = "block"; // Tampilkan modal
}

function closeBookingModal() {
    document.getElementById("booking-modal").style.display = "none"; // Sembunyikan modal
}





// Fungsi modal
function openModal() {
    document.getElementById("add-table-modal").style.display = "block";
}
function closeModal() {
    document.getElementById("add-table-modal").style.display = "none";
}
function closeEditModal() {
    document.getElementById("edit-table-modal").style.display = "none";
}
function closeBookingModal() {
    document.getElementById("booking-modal").style.display = "none";
}