document.getElementById('registerBtn').addEventListener('click', async function() {
    
   
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    const message = document.getElementById('regMessage');
    const role = document.getElementById('regRole')?.value || "Student";

    
    if (name === "" || email === "" || pass === "") {
        message.innerText = "All fields are required!";
        message.style.color = "red";
        return;
    } 
    
    if (pass !== confirmPass) {
        message.innerText = "Passwords do not match!";
        message.style.color = "red";
        return;
    }

    if (pass.length < 6) {
        message.innerText = "Password must be at least 6 characters!";
        message.style.color = "red";
        return;
    }

    const scholarNo = document.getElementById('scholarNo')?.value || "N/A"; 
    const userData = { name, email, password: pass, scholarNo, role };

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        message.innerText = data.message;
        message.style.color = response.ok ? "green" : "red";
        
        if (response.ok) {
            setTimeout(() => { window.location.href = "login.html"; }, 2000);
        }
    } catch (err) {
        message.innerText = "Error connecting to server.";
        message.style.color = "red";
        console.error('Registration error:', err);
    }
});
