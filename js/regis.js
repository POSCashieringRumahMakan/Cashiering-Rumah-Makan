// URL API untuk registrasi
const API_URL = "http://localhost:8000/public/registrasi";

// Tangani pengiriman form
document.getElementById("registrationForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    if (!nama || !email || !password) {
        message.textContent = "Semua field harus diisi!";
        message.style.color = "red";
        return;
    }

    const formData = { nama, email, password };

    try {
        const checkEmailResponse = await fetch(`${API_URL}/check-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const checkEmailText = await checkEmailResponse.text();
        try {
            const checkEmailResult = JSON.parse(checkEmailText);
            if (checkEmailResult.message === "Email sudah terdaftar.") {
                message.textContent = "Email sudah terdaftar!";
                message.style.color = "red";
                return;
            }
        } catch {
            console.error("Respons cek email bukan JSON:", checkEmailText);
            throw new Error("Kesalahan respons cek email.");
        }

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const responseText = await response.text();
        try {
            const result = JSON.parse(responseText);
            if (result.message === "Registrasi berhasil!") {
                message.textContent = result.message;
                message.style.color = "green";
                setTimeout(() => {
                    window.location.href = "masuk.html";
                }, 2000);
            } else {
                message.textContent = result.message || "Registrasi gagal.";
                message.style.color = "red";
            }
        } catch {
            console.error("Respons registrasi bukan JSON:", responseText);
            throw new Error("Kesalahan respons registrasi.");
        }
    } catch (error) {
        message.textContent = "Terjadi kesalahan saat menghubungi server.";
        message.style.color = "red";
        console.error("Error:", error);
    }
});
