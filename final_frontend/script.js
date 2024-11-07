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
    } else {
        alert(data.msg || "Login failed");
    }
};

const handleSignup = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = new URLSearchParams(window.location.search).get('role');

    const res = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
    });

    const data = await res.json();
    if (data.msg) {
        alert("Signup successful!");
    } else {
        alert("Signup failed");
    }
};
