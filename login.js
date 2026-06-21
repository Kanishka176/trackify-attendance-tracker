document.getElementById('loginBtn').addEventListener('click', async function() {
    const role = document.getElementById('role').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    if (email === "" || password === "") {
        message.innerText = "Please fill in all fields.";
        message.style.color = "red";
        return;
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role })
        });

        const data = await response.json();

        if (response.ok) {
            // CRITICAL: Save the user data (including scholarNo) for the dashboard
            localStorage.setItem('user', JSON.stringify(data.user));
            
            message.innerText = "Login successful! Redirecting...";
            message.style.color = "green";

            setTimeout(() => {
                if (role === "Teacher") window.location.href = "teacher_dashboard.html";
                else if (role === "Student") window.location.href = "student_dashboard.html";
                else window.location.href = "admin_dashboard.html";
            }, 1000);
        } else {
            message.innerText = data.message;
            message.style.color = "red";
        }
    } catch (error) {
        message.innerText = "Server connection failed.";
    }
});
