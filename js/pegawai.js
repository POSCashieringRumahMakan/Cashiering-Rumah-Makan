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
            <button class="edit-btn" onclick="editEmployee(${employee.id})">Edit</button>
            <button class="delete-btn" onclick="deleteEmployee(${employee.id})">Hapus</button>
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

    fetch('http://localhost:8000/api/pegawai.php', {
        method: 'POST',
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

            // Cari bagian JSON dari respons
            const jsonStart = data.indexOf('{');
            if (jsonStart !== -1) {
                const jsonData = data.substring(jsonStart); // Ambil bagian JSON saja
                try {
                    const json = JSON.parse(jsonData); // Parse JSON valid
                    if (json.message === "Pegawai berhasil ditambahkan!") {
                        alert("Data berhasil disimpan!");
                        const newEmployee = {
                            nama,
                            jabatan,
                            email,
                            no_telepon: noTelepon,
                            status,
                            id: json.id || Date.now()
                        };
                        addEmployeeCard(newEmployee, document.getElementById('employee-list'));

                        // Reset form dan kembalikan fokus ke input pertama
                        const formElement = document.getElementById('member-form');
                        if (formElement) {
                            formElement.reset();
                            formElement.querySelector('input, select').focus(); // Fokus ke elemen pertama
                        }
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


// Panggil fungsi fetchEmployees saat halaman dimuat
document.addEventListener('DOMContentLoaded', fetchEmployees);