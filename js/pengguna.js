// Data awal pelanggan
const members = [
    { id: 1, nama: 'Balqis Rosa', email: 'balqisrosa@example.com', noTelepon: '08123456789', tingkatan: 'Gold' },
    { id: 2, nama: 'Audyardha', email: 'audyardha@example.com', noTelepon: '08987654321', tingkatan: 'Silver' },
];

// Fungsi menampilkan daftar pelanggan
function displayMembers() {
    const memberList = document.getElementById('member-list');
    memberList.innerHTML = ''; // Kosongkan daftar sebelumnya

    if (members.length === 0) {
        memberList.innerHTML = '<p>Tidak ada data pelanggan.</p>';
        return;
    }

    members.forEach((member) => {
        const card = document.createElement('div');
        card.classList.add('member-card');

        card.innerHTML = `
            <h3>${member.nama}</h3>
            <p><strong>Email:</strong> ${member.email}</p>
            <p><strong>No. Telepon:</strong> ${member.noTelepon}</p>
            <p><strong>Tingkatan:</strong> ${member.tingkatan}</p>
            <div class="actions">
                <button class="edit-btn" onclick="editMember(${member.id})">Edit</button>
                <button class="delete-btn" onclick="deleteMember(${member.id})">Hapus</button>
            </div>
        `;
        memberList.appendChild(card);
    });
}

// Fungsi menambah atau memperbarui pelanggan
function saveMember(event) {
    event.preventDefault();

    const memberId = document.getElementById('member-id').value;
    const nama = document.getElementById('nama').value;
    const email = document.getElementById('email').value;
    const noTelepon = document.getElementById('noTelepon').value;
    const tingkatan = document.getElementById('tingkatan').value;

    if (memberId) {
        // Perbarui pelanggan
        const index = members.findIndex((member) => member.id == memberId);
        if (index !== -1) {
            members[index] = { id: parseInt(memberId), nama, email, noTelepon, tingkatan };
        }
    } else {
        // Tambah pelanggan baru
        const newMember = {
            id: Date.now(),
            nama,
            email,
            noTelepon,
            tingkatan,
        };
        members.push(newMember);
    }

    document.getElementById('member-form').reset();
    document.getElementById('member-id').value = '';
    displayMembers();
}

// Fungsi menghapus pelanggan
function deleteMember(id) {
    const index = members.findIndex((member) => member.id === id);
    if (index !== -1) {
        members.splice(index, 1);
        alert(`Pelanggan dengan ID ${id} berhasil dihapus.`);
        displayMembers();
    }
}

// Fungsi mengedit pelanggan
function editMember(id) {
    const member = members.find((member) => member.id === id);
    if (member) {
        document.getElementById('member-id').value = member.id;
        document.getElementById('nama').value = member.nama;
        document.getElementById('email').value = member.email;
        document.getElementById('noTelepon').value = member.noTelepon;
        document.getElementById('tingkatan').value = member.tingkatan;
    }
}

// Fungsi pencarian pelanggan
function searchMembers() {
    const query = document.getElementById('search').value.toLowerCase();
    const filteredMembers = members.filter((member) =>
        member.nama.toLowerCase().includes(query)
    );

    const memberList = document.getElementById('member-list');
    memberList.innerHTML = '';

    if (filteredMembers.length === 0) {
        memberList.innerHTML = '<p>Tidak ada pelanggan ditemukan.</p>';
        return;
    }

    filteredMembers.forEach((member) => {
        const card = document.createElement('div');
        card.classList.add('member-card');
        card.innerHTML = `
            <h3>${member.nama}</h3>
            <p><strong>Email:</strong> ${member.email}</p>
            <p><strong>No. Telepon:</strong> ${member.noTelepon}</p>
            <p><strong>Tingkatan:</strong> ${member.tingkatan}</p>
            <div class="actions">
                <button class="edit-btn" onclick="editMember(${member.id})">Edit</button>
                <button class="delete-btn" onclick="deleteMember(${member.id})">Hapus</button>
            </div>
        `;
        memberList.appendChild(card);
    });
}

function printPage() {
    window.print();
}

// Tampilkan pelanggan saat halaman dimuat
document.addEventListener('DOMContentLoaded', displayMembers);
