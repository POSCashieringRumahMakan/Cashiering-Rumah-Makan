// URL API untuk login
const API_URL = "http://localhost:8000/public/login";

// Tangani pengiriman form login
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

        // Ambil respons sebagai teks mentah
        const textResponse = await response.text();

        // Hapus teks tambahan sebelum JSON (jika ada)
        const jsonStart = textResponse.indexOf("{");
        const validJson = jsonStart !== -1 ? textResponse.substring(jsonStart) : "";

        let result;
        try {
            result = JSON.parse(validJson); // Parsing JSON
        } catch (error) {
            console.error("Error parsing JSON:", error);
            message.textContent = "Terjadi kesalahan pada respons server.";
            message.style.color = "red";
            return;
        }

        // Tampilkan pesan dari respons API
        if (response.ok) {
            message.textContent = "Login berhasil!";
            message.style.color = "green";

            // Simpan data user ke localStorage
            localStorage.setItem("user", JSON.stringify(result.user));

            // Tunggu sebentar, lalu arahkan ke halaman dashboard.html
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000); // Tunggu 2 detik
        } else {
            message.textContent = result.message || "Login gagal. Periksa email dan password Anda.";
            message.style.color = "red";
        }
    } catch (error) {
        message.textContent = "Terjadi kesalahan saat menghubungi server.";
        message.style.color = "red";
        console.error("Error:", error);
    }
});
