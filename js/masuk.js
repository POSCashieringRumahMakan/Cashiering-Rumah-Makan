// URL API untuk login
const API_URL = "http://localhost/toko-api/public/login";  // Ganti dengan URL login Anda

// Tangani pengiriman form
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Mencegah pengiriman form default

    // Ambil data dari form
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    // Validasi input
    if (!email || !password) {
        message.textContent = "Semua field harus diisi!";
        message.style.color = "red";
        return;
    }

    // Data yang akan dikirim ke API
    const formData = {
        email: email,
        password: password,
    };

    try {
        // Kirim data ke API menggunakan fetch
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        // Tampilkan pesan dari respons API
        if (response.ok) {
            message.textContent = "Login berhasil!";
            message.style.color = "green";
            console.log("Response dari API:", result);
            // Arahkan pengguna ke halaman beranda atau dashboard setelah login berhasil
            // window.location.href = 'dashboard.html';  // Ganti dengan URL dashboard Anda
        } else {
            message.textContent = result.message || "Login gagal.";
            message.style.color = "red";
        }
    } catch (error) {
        message.textContent = "Terjadi kesalahan saat menghubungi server.";
        message.style.color = "red";
        console.error("Error:", error);
    }
});
