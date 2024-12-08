let tables = [
    { id: 1, number: 'A1', capacity: 4, status: 'Tersedia', customer: null },
    { id: 2, number: 'A2', capacity: 2, status: 'Tidak Tersedia', customer: null },
    { id: 3, number: 'B1', capacity: 6, status: 'Tersedia', customer: null },
];

const pengguna = {
    name: "Sindy",
    phone: "081234567890",
    email: "sindyy.doe@example.com",
};

function displayTables() {
    const tableDataContainer = document.getElementById('table-data');
    tableDataContainer.innerHTML = '';

    tables.forEach(table => {
        const row = document.createElement('tr');
        let actionButtons = `
            <button onclick="viewTableDetails(${table.id})">Detail</button>
            <button onclick="editTable(${table.id})">Edit</button>
            <button onclick="deleteTable(${table.id})">Hapus</button>
        `;
        
        if (table.status === 'Tersedia') {
            actionButtons = `<button onclick="bookTable(${table.id})">Booking</button>` + actionButtons;
        }

        row.innerHTML = `
            <td>${table.number}</td>
            <td>${table.capacity}</td>
            <td>${table.status}</td>
            <td>${actionButtons}</td>
        `;
        tableDataContainer.appendChild(row);
    });
}

function openModal() {
    document.getElementById("add-table-modal").style.display = "block";
}

function closeModal() {
    document.getElementById("add-table-modal").style.display = "none";
}

document.getElementById("add-table-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const tableNumber = document.getElementById('table-number').value;
    const capacity = document.getElementById('capacity').value;
    const status = document.getElementById('status').value;

    const newTable = {
        id: tables.length + 1,
        number: tableNumber,
        capacity: parseInt(capacity),
        status: status,
        customer: null,
    };

    tables.push(newTable);
    displayTables();
    closeModal();
    document.getElementById("add-table-form").reset();
});

function editTable(id) {
    const table = tables.find(t => t.id === id);
    if (table) {
        document.getElementById('edit-table-number').value = table.number;
        document.getElementById('edit-capacity').value = table.capacity;
        document.getElementById('edit-status').value = table.status;

        const form = document.getElementById('edit-table-form');
        
        form.onsubmit = function(event) {
            event.preventDefault();

            const newCapacity = parseInt(document.getElementById('edit-capacity').value);
            if (isNaN(newCapacity) || newCapacity <= 0) {
                alert("Kapasitas harus berupa angka yang valid.");
                return;
            }

            table.number = document.getElementById('edit-table-number').value;
            table.capacity = newCapacity;
            table.status = document.getElementById('edit-status').value;

            displayTables();
            closeEditModal();
            form.reset();
        };

        openEditModal();
    }
}

function openEditModal() {
    document.getElementById("edit-table-modal").style.display = "block";
}

function closeEditModal() {
    document.getElementById("edit-table-modal").style.display = "none";
}

function deleteTable(id) {
    tables = tables.filter(table => table.id !== id);
    displayTables();
}

function viewTableDetails(id) {
    const table = tables.find(t => t.id === id);
    if (table) {
        let customerDetails = 'Belum ada booking.';
        if (table.customer) {
            customerDetails = `
                Nama: ${table.customer.name}\n
                No HP: ${table.customer.phone}\n
                Email: ${table.customer.email}\n
                Tanggal Booking: ${table.customer.date}
            `;
        }

        alert(`Detail Meja: ${table.number}\nKapasitas: ${table.capacity}\nStatus: ${table.status}\n\nCustomer:\n${customerDetails}`);
    }
}

function openBookingModal(tableId) {
    const bookingModal = document.getElementById('booking-modal');
    bookingModal.style.display = 'block';
    bookingModal.dataset.tableId = tableId;

    if (pengguna) {
        document.getElementById('customer-name').value = pengguna.name || '';
        document.getElementById('customer-phone').value = pengguna.phone || '';
        document.getElementById('customer-email').value = pengguna.email || '';
    }
}

function closeBookingModal() {
    const bookingModal = document.getElementById('booking-modal');
    bookingModal.style.display = 'none';
    document.getElementById('booking-form').reset();
}

function bookTable(id) {
    openBookingModal(id);
}

document.getElementById('booking-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const bookingModal = document.getElementById('booking-modal');
    const tableId = parseInt(bookingModal.dataset.tableId);

    const customerName = document.getElementById('customer-name').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const customerEmail = document.getElementById('customer-email').value;
    const bookingDate = document.getElementById('booking-date').value;

    const table = tables.find(t => t.id === tableId);
    if (table) {
        table.status = 'Tidak Tersedia';
        table.customer = {
            name: customerName,
            phone: customerPhone,
            email: customerEmail,
            date: bookingDate,
        };

        displayTables();
        alert(`Booking berhasil!\nMeja: ${table.number}\nNama: ${customerName}\nNo HP: ${customerPhone}\nEmail: ${customerEmail}\nTanggal: ${bookingDate}`);
    }

    closeBookingModal();
});

displayTables();
