const handleSignup = async () => {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = new URLSearchParams(window.location.search).get('role');

    const res = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role })
    });

    const data = await res.json();
    if (data.msg) {
        alert("Signup successful!");
        window.location.href = `login.html?role=${role}`; // Redirect to login page after signup
    } else {
        alert(data.msg || "Signup failed");
    }
};

const handleLogin = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = new URLSearchParams(window.location.search).get('role');

    const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.token) {
        alert("Login successful!");
        window.location.href = `${role}.html`; // Redirect to student.html or instructor.html based on role
    } else {
        alert(data.msg || "Login failed");
    }
};
