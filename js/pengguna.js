// Contoh data pelanggan (dapat diganti dengan data dinamis dari API atau database)
const members = [
    {id: 1, nama: 'Balqis Rosa', email: 'balqisrosa@example.com', noTelepon: '08123456789', tingkatan: 'Gold'},
    {id: 2, nama: 'Audyardha', email: 'audyardha@example.com', noTelepon: '08987654321', tingkatan: 'Silver'},
    // Tambahkan data lainnya...
];

// Fungsi untuk menghapus pengguna
function deleteMember(id) {
    const index = members.findIndex(member => member.id === id);
    if (index !== -1) {
        members.splice(index, 1); // Menghapus anggota berdasarkan ID
        displayMembers(); // Tampilkan ulang daftar anggota setelah penghapusan
    }
}

// Fungsi untuk menampilkan kartu anggota
function displayMembers() {
    const memberList = document.getElementById('member-list');
    memberList.innerHTML = ''; // Bersihkan daftar yang ada

    members.forEach((member) => {
        const memberCard = document.createElement('div');
        memberCard.classList.add('member-card');
        
        memberCard.innerHTML = `
            <h3>${member.nama}</h3>
            <p><strong>Email:</strong> ${member.email}</p>
            <p><strong>No. Telepon:</strong> ${member.noTelepon}</p>
            <p><strong>Tingkatan:</strong> ${member.tingkatan}</p>
            <div class="actions">
                <button class="edit-btn" onclick="editMember(${member.id})">Edit</button>
                <button class="delete-btn" onclick="deleteMember(${member.id})">Hapus</button>
            </div>
        `;
        
        memberList.appendChild(memberCard);
    });
}


// Fungsi untuk menambah pengguna baru
function saveMember(event) {
    event.preventDefault(); // Mencegah form untuk refresh halaman

    const memberId = document.getElementById("member-id").value;
    const nama = document.getElementById("nama").value;
    const email = document.getElementById("email").value;
    const noTelepon = document.getElementById("noTelepon").value;
    const tingkatan = document.getElementById("tingkatan").value;

    if (memberId) {
        // Update member
        const index = members.findIndex(member => member.id == memberId);
        if (index !== -1) {
            members[index] = { id: memberId, nama, email, noTelepon, tingkatan };
        }
    } else {
        // Add new member
        const newMember = {
            id: Date.now(), // Menggunakan timestamp sebagai ID unik
            nama,
            email,
            noTelepon,
            tingkatan
        };
        members.push(newMember);
    }

    // Reset form and display members
    document.getElementById("member-form").reset();
    document.getElementById("member-id").value = ''; // Clear hidden input
    displayMembers();
}

// Fungsi untuk mengedit pengguna
function editMember(id) {
    const member = members.find(member => member.id === id);
    if (member) {
        document.getElementById("member-id").value = member.id;
        document.getElementById("nama").value = member.nama;
        document.getElementById("email").value = member.email;
        document.getElementById("noTelepon").value = member.noTelepon;
        document.getElementById("tingkatan").value = member.tingkatan;
    }
}

// Fungsi untuk menghapus pengguna
function deleteMember(id) {
    const index = members.findIndex(member => member.id === id);
    if (index !== -1) {
        members.splice(index, 1);
        displayMembers(); // Tampilkan ulang daftar pengguna setelah penghapusan
    }
}

// Fungsi pencarian pengguna
function searchMembers() {
    const query = document.getElementById("search").value.toLowerCase();
    const filteredMembers = members.filter(member => member.nama.toLowerCase().includes(query));

    // Tampilkan data yang sudah difilter
    const memberList = document.getElementById("member-list");
    memberList.innerHTML = ''; // Kosongkan daftar sebelum menambahkan yang baru

    filteredMembers.forEach(member => {
        const card = document.createElement("div");
        card.classList.add("member-card");
        card.innerHTML = `
            <h4>${member.nama}</h4>
            <p>Email: ${member.email}</p>
            <p>No. Telepon: ${member.noTelepon}</p>
            <p>Tingkatan: ${member.tingkatan}</p>
            <button onclick="editMember(${member.id})">Edit</button>
            <button onclick="deleteMember(${member.id})">Hapus</button>
        `;
        memberList.appendChild(card);
    });
}

// Menampilkan anggota saat halaman pertama kali dimuat
displayMembers();