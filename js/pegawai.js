// Variabel global untuk menyimpan ID pegawai yang sedang diedit
let editingEmployeeId = null;

// Fungsi menampilkan daftar pegawai
function displayEmployees(employees) {
    const employeeList = document.getElementById('employee-list');
    employeeList.innerHTML = ''; // Kosongkan daftar sebelumnya

    if (employees.length === 0) {
        employeeList.innerHTML = '<p>Tidak ada data pegawai.</p>';
        return;
    }

    employees.forEach((employee) => {
        addEmployeeCard(employee, employeeList);
    });
}

// Fungsi untuk menambahkan kartu pegawai
function addEmployeeCard(employee, employeeList) {
    const card = document.createElement('div');
    card.classList.add('member-card');

    card.innerHTML = `
        <h3>${employee.nama}</h3>
        <p><strong>Jabatan:</strong> ${employee.jabatan}</p>
        <p><strong>Email:</strong> ${employee.email}</p>
        <p><strong>No. Telepon:</strong> ${employee.no_telepon}</p>
        <p><strong>Status:</strong> ${employee.status}</p>
        <div class="actions">
            <button class="edit-btn" onclick="editEmployee(${employee.id_pegawai})">Edit</button>
            <button class="delete-btn" onclick="deleteEmployee(${employee.id_pegawai})">Hapus</button>
        </div>
    `;
    employeeList.appendChild(card);
}

// Fungsi untuk mengambil data pegawai dari API
function fetchEmployees() {
    fetch('http://localhost:8000/api/pegawai.php')
        .then(response => response.text())  // Ambil data sebagai teks dulu
        .then(data => {
            console.log('Data yang diterima:', data);  // Cek isi data yang diterima

            // Mencari posisi pertama JSON setelah pesan yang tidak diperlukan
            const jsonStart = data.indexOf('[{');  // Mencari tanda pertama array JSON
            if (jsonStart !== -1) {
                const jsonData = data.substring(jsonStart);  // Ambil hanya bagian JSON
                try {
                    const parsedData = JSON.parse(jsonData);  // Parsing data JSON yang valid
                    console.log(parsedData);
                    // Pastikan objek parsedData memiliki properti 'data' yang berisi array pegawai
                    if (Array.isArray(parsedData)) {
                        displayEmployees(parsedData);  // Tampilkan daftar pegawai
                    } else {
                        throw new Error('Data tidak mengandung array pegawai yang valid');
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            } else {
                console.error('Data tidak mengandung array JSON yang valid');
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}


// Fungsi menyimpan data pegawai baru
function saveEmployee(event) {
    event.preventDefault();

    const nama = document.getElementById('nama').value;
    const jabatan = document.getElementById('jabatan').value;
    const email = document.getElementById('email').value;
    const noTelepon = document.getElementById('noTelepon').value;
    const status = document.getElementById('status').value;

    const url = editingEmployeeId
        ? `http://localhost:8000/api/pegawai.php?id=${editingEmployeeId}`
        : 'http://localhost:8000/api/pegawai.php';

    const method = editingEmployeeId ? 'PUT' : 'POST';

    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nama,
            jabatan,
            email,
            no_telepon: noTelepon,
            status,
        }),
    })
        .then(response => response.text()) // Ambil respons sebagai teks
        .then(data => {
            console.log('Respons dari server:', data); // Debugging respons

            // Hanya ambil bagian JSON dari respons
            const jsonStart = data.indexOf('{');
            if (jsonStart !== -1) {
                const jsonData = data.substring(jsonStart); // Ambil JSON saja
                try {
                    const json = JSON.parse(jsonData); // Parse JSON
                    if (json.message === "Pegawai berhasil ditambahkan!" || json.message === "Pegawai berhasil diperbarui!") {
                        alert(json.message);
                        fetchEmployees(); // Refresh daftar pegawai

                        // Reset form dan kembalikan ke mode tambah
                        const formElement = document.getElementById('member-form');
                        if (formElement) {
                            formElement.reset();
                            const saveButton = document.getElementById('save-button');
                            if (saveButton) saveButton.textContent = 'Simpan';
                        }

                        // Hapus ID editing
                        editingEmployeeId = null;
                    } else {
                        alert(`Gagal menyimpan data: ${json.message}`);
                    }
                } catch (error) {
                    console.error("Kesalahan parsing JSON:", error);
                }
            } else {
                console.error("Data respons server tidak valid.");
            }
        })
        .catch(error => {
            console.error("Gagal menyimpan data:", error);
            alert("Gagal menyimpan data. Periksa koneksi atau API.");
        });
}

function editEmployee(id) {
    console.log("ID pegawai yang dikirim:", id); // Debugging ID

    fetch(`http://localhost:8000/api/pegawai.php?id=${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Gagal memuat data pegawai. Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log("Data yang diterima dari server:", data); // Debugging data

            // Hilangkan pesan tambahan dari respons
            let jsonData = data.replace(/^Koneksi berhasil!/, '').trim();

            // Parse JSON
            let parsedData;
            try {
                parsedData = JSON.parse(jsonData);
            } catch (error) {
                console.error("Kesalahan parsing JSON:", error);
                alert("Data yang diterima bukan JSON yang valid.");
                return;
            }

            console.log("Parsed data:", parsedData); // Debugging parsed data

            // Jika data berupa array, cari pegawai berdasarkan ID
            if (Array.isArray(parsedData)) {
                const employee = parsedData.find(emp => emp.id_pegawai == id);
                if (employee) {
                    fillFormWithEmployeeData(employee);
                } else {
                    alert(`Pegawai dengan ID ${id} tidak ditemukan.`);
                }
            }
            // Jika data langsung berupa objek pegawai
            else if (parsedData && parsedData.id_pegawai == id) {
                fillFormWithEmployeeData(parsedData);
            } else {
                console.error('Pegawai dengan ID ' + id + ' tidak ditemukan.');
                alert('Data pegawai tidak ditemukan.');
            }
        })
        .catch(error => {
            console.error('Error fetching employee data:', error);
            alert('Gagal mengambil data pegawai. Periksa koneksi atau API.');
        });
}

// Fungsi untuk mengisi form dengan data pegawai
function fillFormWithEmployeeData(employee) {
    document.getElementById('nama').value = employee.nama || '';
    document.getElementById('jabatan').value = employee.jabatan || '';
    document.getElementById('email').value = employee.email || '';
    document.getElementById('noTelepon').value = employee.no_telepon || '';
    document.getElementById('status').value = employee.status || '';

    // Simpan ID pegawai untuk referensi edit
    editingEmployeeId = employee.id_pegawai;

    // Ubah teks tombol 'Save' menjadi 'Perbarui'
    const saveButton = document.getElementById('save-button');
    if (saveButton) saveButton.textContent = 'Perbarui';
}

// Fungsi untuk menghapus data pegawai
function deleteEmployee(id) {
    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus data pegawai ini?");
    if (!confirmDelete) return;

    fetch(`http://localhost:8000/api/pegawai.php?id=${id}`, {
        method: 'DELETE',
    })
        .then(response => response.text()) // Ambil respons sebagai teks
        .then(data => {
            console.log("Respons dari server:", data); // Debugging respons

            // Hanya ambil bagian JSON dari respons
            const jsonStart = data.indexOf('{');
            if (jsonStart !== -1) {
                const jsonData = data.substring(jsonStart); // Ambil JSON saja
                try {
                    const json = JSON.parse(jsonData); // Parse JSON
                    if (json.message === "Pegawai berhasil dihapus!") {
                        alert(json.message);
                        fetchEmployees(); // Refresh daftar pegawai
                    } else {
                        alert(`Gagal menghapus data: ${json.message}`);
                    }
                } catch (error) {
                    console.error("Kesalahan parsing JSON:", error);
                }
            } else {
                console.error("Data respons server tidak valid.");
            }
        })
        .catch(error => {
            console.error("Gagal menghapus data:", error);
            alert("Gagal menghapus data. Periksa koneksi atau API.");
        });
}

// Panggil fungsi fetchEmployees saat halaman dimuat
document.addEventListener('DOMContentLoaded', fetchEmployees);