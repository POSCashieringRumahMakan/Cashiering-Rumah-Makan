// Data awal pegawai
const employees = [
    { id: 1, nama: 'Balqis Rosa', jabatan: 'Kasir', email: 'balqisrosa@example.com', noTelepon: '08123456789', status: 'Aktif' },
    { id: 2, nama: 'Audyardha', jabatan: 'Manajer', email: 'audyardha@example.com', noTelepon: '08987654321', status: 'Aktif' },
];

// Fungsi menampilkan daftar pegawai
function displayEmployees() {
    const employeeList = document.getElementById('employee-list');
    employeeList.innerHTML = ''; // Kosongkan daftar sebelumnya

    if (employees.length === 0) {
        employeeList.innerHTML = '<p>Tidak ada data pegawai.</p>';
        return;
    }

    employees.forEach((employee) => {
        const card = document.createElement('div');
        card.classList.add('member-card');

        card.innerHTML = `
            <h3>${employee.nama}</h3>
            <p><strong>Jabatan:</strong> ${employee.jabatan}</p>
            <p><strong>Email:</strong> ${employee.email}</p>
            <p><strong>No. Telepon:</strong> ${employee.noTelepon}</p>
            <p><strong>Status:</strong> ${employee.status}</p>
            <div class="actions">
                <button class="edit-btn" onclick="editEmployee(${employee.id})">Edit</button>
                <button class="delete-btn" onclick="deleteEmployee(${employee.id})">Hapus</button>
            </div>
        `;
        employeeList.appendChild(card);
    });
}

// Fungsi menambah atau memperbarui pegawai
function saveEmployee(event) {
    event.preventDefault();

    const employeeId = document.getElementById('employee-id').value;
    const nama = document.getElementById('nama').value;
    const jabatan = document.getElementById('jabatan').value;
    const email = document.getElementById('email').value;
    const noTelepon = document.getElementById('noTelepon').value;
    const status = document.getElementById('status').value;

    if (employeeId) {
        // Perbarui pegawai
        const index = employees.findIndex((employee) => employee.id == employeeId);
        if (index !== -1) {
            employees[index] = { id: parseInt(employeeId), nama, jabatan, email, noTelepon, status };
        }
    } else {
        // Tambah pegawai baru
        const newEmployee = {
            id: Date.now(),
            nama,
            jabatan,
            email,
            noTelepon,
            status,
        };
        employees.push(newEmployee);
    }

    document.getElementById('employee-form').reset();
    document.getElementById('employee-id').value = '';
    displayEmployees();
}

// Fungsi menghapus pegawai
function deleteEmployee(id) {
    const index = employees.findIndex((employee) => employee.id === id);
    if (index !== -1) {
        employees.splice(index, 1);
        alert(`Pegawai dengan ID ${id} berhasil dihapus.`);
        displayEmployees();
    }
}

// Fungsi mengedit pegawai
function editEmployee(id) {
    const employee = employees.find((employee) => employee.id === id);
    if (employee) {
        document.getElementById('employee-id').value = employee.id;
        document.getElementById('nama').value = employee.nama;
        document.getElementById('jabatan').value = employee.jabatan;
        document.getElementById('email').value = employee.email;
        document.getElementById('noTelepon').value = employee.noTelepon;
        document.getElementById('status').value = employee.status;
    }
}

// Fungsi pencarian pegawai
function searchEmployees() {
    const query = document.getElementById('search').value.toLowerCase();
    const filteredEmployees = employees.filter((employee) =>
        employee.nama.toLowerCase().includes(query)
    );

    const employeeList = document.getElementById('employee-list');
    employeeList.innerHTML = '';

    if (filteredEmployees.length === 0) {
        employeeList.innerHTML = '<p>Tidak ada pegawai ditemukan.</p>';
        return;
    }

    filteredEmployees.forEach((employee) => {
        const card = document.createElement('div');
        card.classList.add('employee-card');
        card.innerHTML = `
            <h3>${employee.nama}</h3>
            <p><strong>Jabatan:</strong> ${employee.jabatan}</p>
            <p><strong>Email:</strong> ${employee.email}</p>
            <p><strong>No. Telepon:</strong> ${employee.noTelepon}</p>
            <p><strong>Status:</strong> ${employee.status}</p>
            <div class="actions">
                <button class="edit-btn" onclick="editEmployee(${employee.id})">Edit</button>
                <button class="delete-btn" onclick="deleteEmployee(${employee.id})">Hapus</button>
            </div>
        `;
        employeeList.appendChild(card);
    });
}

// Tampilkan pegawai saat halaman dimuat
document.addEventListener('DOMContentLoaded', displayEmployees);
