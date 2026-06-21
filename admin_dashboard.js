
const tableBody = document.getElementById('tableBody');


async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:3000/api/users');
        const users = await response.json();
        renderTable(users);
    } catch (err) {
        console.error("Failed to load users:", err);
    }
}

function renderTable(data) {
    tableBody.innerHTML = "";
    data.forEach((user) => {
        
        const userId = user._id; 
        tableBody.innerHTML += `
            <tr>
                <td>${user.scholarNo || 'N/A'}</td>
                <td>${user.name}</td>
                <td>${user.role}</td>
                <td>${user.email}</td>
                <td>
                    <button onclick="editUser('${userId}', '${user.name}')" style="color: blue; border:none; background:none; cursor:pointer;">Edit</button>
                    <button onclick="deleteUser('${userId}')" style="color: red; border:none; background:none; cursor:pointer; margin-left:10px;">Remove</button>
                </td>
            </tr>
        `;
    });
}


async function deleteUser(id) {
    if(confirm("Permanently remove this user?")) {
        const response = await fetch(`http://localhost:3000/api/users/${id}`, { method: 'DELETE' });
        if(response.ok) fetchUsers(); 
    }
}


async function editUser(id, oldName) {
    const newName = prompt("Enter new name:", oldName);
    if (newName && newName !== oldName) {
        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        });
        if(response.ok) fetchUsers();
    }
}


fetchUsers();





document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || 
        user.id.toLowerCase().includes(searchTerm)
    );
    renderTable(filtered);
});


async function resetUserPassword() {
    const email = prompt("Enter the Email Address of the user to reset their password:");

    if (email) {
        const newPassword = prompt(`Enter new password for ${email}:`);
        
        if (newPassword) {
            try {
                const response = await fetch('http://localhost:3000/api/users/reset-password', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, newPassword })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message);
                } else {
                    alert("Error: " + data.message);
                }
            } catch (err) {
                console.error("Connection error:", err);
                alert("Could not connect to the server.");
            }
        } else {
            alert("Password reset cancelled.");
        }
    }
}