let tables = [
    { id: 1, number: 'A1', capacity: 4, status: 'Tersedia', customer: null },
    { id: 2, number: 'A2', capacity: 2, status: 'Tidak Tersedia', customer: null },
    { id: 3, number: 'B1', capacity: 6, status: 'Tersedia', customer: null },
];

const pengguna = JSON.parse(localStorage.getItem('pengguna')) || [];

document.addEventListener('DOMContentLoaded', () => {
    displayTables();
});

function displayTables() {
    const tableContainer = document.getElementById('table-data');
    tableContainer.innerHTML = '';

    tables.forEach(table => {
        const card = document.createElement('div');
        card.classList.add('table-card');
        card.innerHTML = `
            <h3>Meja ${table.number}</h3>
            <p>Kapasitas: ${table.capacity}</p>
            <p class="status ${table.status === 'Tidak Tersedia' ? 'taken' : ''}">${table.status}</p>
        `;
        
        // Tombol 'Booking' hanya muncul jika meja 'Tersedia'
        if (table.status === 'Tersedia') {
            card.innerHTML += `
                <button onclick="bookTable(${table.id})">Booking</button>
            `;
        }
        
        // Tombol 'Edit' selalu muncul
        card.innerHTML += `
            <button onclick="editTable(${table.id})">Edit</button>
        `;
        
        // Tombol 'Delete' dan 'Detail' selalu tampil
        card.innerHTML += `
            <button onclick="deleteTable(${table.id})">Delete</button>
            <button onclick="viewTableDetails(${table.id})">Detail</button>
        `;
        
        tableContainer.appendChild(card);
    });
}

function displayFilteredTables(filteredTables) {
    const tableContainer = document.getElementById('table-data');
    tableContainer.innerHTML = '';
    filteredTables.forEach(table => {
        const card = document.createElement('div');
        card.classList.add('table-card');
        card.innerHTML = `
            <h3>Meja ${table.number}</h3>
            <p>Kapasitas: ${table.capacity}</p>
            <p class="status ${table.status === 'Tidak Tersedia' ? 'taken' : ''}">${table.status}</p>
        `;
        
        // Tombol 'Booking' hanya muncul jika meja 'Tersedia'
        if (table.status === 'Tersedia') {
            card.innerHTML += `
                <button onclick="bookTable(${table.id})">Booking</button>
            `;
        }
        
        // Tombol 'Edit' selalu muncul
        card.innerHTML += `
            <button onclick="editTable(${table.id})">Edit</button>
        `;
        
        // Tombol 'Delete' dan 'Detail' selalu tampil
        card.innerHTML += `
            <button onclick="deleteTable(${table.id})">Delete</button>
            <button onclick="viewTableDetails(${table.id})">Detail</button>
        `;
        
        tableContainer.appendChild(card);
    });
}

function searchTables() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const filteredTables = tables.filter(table =>
        table.number.toLowerCase().includes(searchInput)
    );
    displayFilteredTables(filteredTables);
}

function openModal() {
    const modal = document.getElementById('add-table-modal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('add-table-modal');
    modal.style.display = 'none';
}

document.getElementById('add-table-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const number = document.getElementById('table-number').value;
    const capacity = document.getElementById('capacity').value;
    const status = document.getElementById('status').value;

    const newTable = { id: tables.length + 1, number, capacity, status };
    tables.push(newTable);

    displayTables();
    closeModal();
});

function bookTable(tableId) {
    const modal = document.getElementById('booking-modal');
    modal.style.display = 'block';

    document.getElementById('booking-form').onsubmit = function(event) {
        event.preventDefault();

        const customerName = document.getElementById('customer-name').value;
        const customerPhone = document.getElementById('customer-phone').value;
        const customerEmail = document.getElementById('customer-email').value;
        const bookingDate = document.getElementById('booking-date').value;

        const table = tables.find(t => t.id === tableId);
        table.status = 'Tidak Tersedia';
        table.customer = { customerName, customerPhone, customerEmail, bookingDate };

        displayTables();
        closeBookingModal();
    };
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    modal.style.display = 'none';
}

function viewTableDetails(tableId) {
    const table = tables.find(t => t.id === tableId);
    const modal = document.getElementById('detail-modal');
    const tableDetail = document.getElementById('table-detail');

    tableDetail.innerHTML = `
        <h3>Meja ${table.number}</h3>
        <p>Kapasitas: ${table.capacity}</p>
        <p>Status: ${table.status}</p>
        ${table.customer ? `
            <h4>Customer Info:</h4>
            <p>Nama: ${table.customer.customerName}</p>
            <p>No HP: ${table.customer.customerPhone}</p>
            <p>Email: ${table.customer.customerEmail}</p>
            <p>Tanggal Booking: ${table.customer.bookingDate}</p>
        ` : '<p>Tidak ada pemesanan untuk meja ini.</p>'}
    `;
    
    modal.style.display = 'block';
}

function closeDetailModal() {
    const modal = document.getElementById('detail-modal');
    modal.style.display = 'none';
}

function editTable(tableId) {
    const table = tables.find(t => t.id === tableId);
    
    // Mengisi form dengan data meja yang ada
    document.getElementById('edit-table-number').value = table.number;
    document.getElementById('edit-capacity').value = table.capacity;
    document.getElementById('edit-status').value = table.status;

    // Menyimpan ID meja yang sedang diedit
    document.getElementById('edit-table-form').onsubmit = function(event) {
        event.preventDefault();

        // Mengambil data dari form
        const number = document.getElementById('edit-table-number').value;
        const capacity = document.getElementById('edit-capacity').value;
        const status = document.getElementById('edit-status').value;

        // Memperbarui data meja
        table.number = number;
        table.capacity = capacity;
        table.status = status;

        // Menutup modal dan memperbarui tampilan meja
        displayTables();
        closeEditModal();
    };

    // Menampilkan modal
    const modal = document.getElementById('edit-table-modal');
    modal.style.display = 'block';
}

function closeEditModal() {
    const modal = document.getElementById('edit-table-modal');
    modal.style.display = 'none';
}


function deleteTable(tableId) {
    tables = tables.filter(table => table.id !== tableId);
    displayTables();
}
