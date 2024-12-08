// Data pelanggan disimpan dalam localStorage
const memberList = JSON.parse(localStorage.getItem('members')) || [];

// Menampilkan data pelanggan di tabel
function displayMembers() {
    const memberListElement = document.getElementById('member-list');
    memberListElement.innerHTML = ''; // Bersihkan tabel

    memberList.forEach((member, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${member.nama}</td>
            <td>${member.email}</td>
            <td>${member.noTelepon}</td>
            <td>${member.tingkatan}</td>
            <td>
                <button class="edit-btn" onclick="editMember(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteMember(${index})">Hapus</button>
            </td>
        `;
        memberListElement.appendChild(row);
    });
}
// Fungsi untuk menyimpan pelanggan baru atau mengupdate pelanggan yang sudah ada
function saveMember(event) {
    event.preventDefault(); // Mencegah form untuk refresh halaman

    const memberId = document.getElementById('member-id').value;
    const nama = document.getElementById('nama').value;
    const email = document.getElementById('email').value;
    const noTelepon = document.getElementById('noTelepon').value;
    const tingkatan = document.getElementById('tingkatan').value;

    if (memberId) {
        // Update member
        memberList[memberId] = { nama, email, noTelepon, tingkatan };
    } else {
        // Add new member
        memberList.push({ nama, email, noTelepon, tingkatan });
    }

    // Simpan perubahan di localStorage
    localStorage.setItem('members', JSON.stringify(memberList));

    // Reset form dan tampilkan data terbaru
    document.getElementById('member-form').reset();
    document.getElementById('member-id').value = '';
    displayMembers();
}

// Fungsi untuk mengedit data pelanggan
function editMember(index) {
    const member = memberList[index];
    document.getElementById('member-id').value = index;
    document.getElementById('nama').value = member.nama;
    document.getElementById('email').value = member.email;
    document.getElementById('noTelepon').value = member.noTelepon;
    document.getElementById('tingkatan').value = member.tingkatan;
}

// Fungsi untuk menghapus data pelanggan
function deleteMember(index) {
    if (confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
        memberList.splice(index, 1); // Hapus member dari array
        localStorage.setItem('members', JSON.stringify(memberList)); // Simpan perubahan
        displayMembers(); // Tampilkan ulang data
    }
}

// Menampilkan semua data saat halaman pertama kali dimuat
window.onload = function() {
    displayMembers();
};
