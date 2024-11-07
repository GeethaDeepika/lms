// document.getElementById('loginForm').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const formData = new FormData(e.target);
//     const data = {
//         email: formData.get('email'),
//         password: formData.get('password')
//     };

//     const urlParams = new URLSearchParams(window.location.search);
//     const role = urlParams.get('role'); // Get the role from the query string

//     try {
//         const response = await fetch('http://localhost:5001/api/auth/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(data)
//         });

//         const result = await response.json();
//         if (response.ok) {
//             alert('Login successful!');
//             if (role === 'student') {
//                 window.location.href = 'student_dashboard.html';
//             } else if (role === 'instructor') {
//                 window.location.href = 'instructor_dashboard.html';
//             }
//         } else {
//             alert(result.error || 'Login failed');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred. Please try again.');
//     }
// });

// document.getElementById('signupForm').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const formData = new FormData(e.target);
//     const data = {
//         username: formData.get('username'),
//         email: formData.get('email'),
//         password: formData.get('password')
//     };

//     try {
//         const response = await fetch('http://localhost:5001/api/auth/register', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(data)
//         });

//         const result = await response.json();
//         if (response.ok) {
//             alert('Registration successful!');
//             const urlParams = new URLSearchParams(window.location.search);
//             const role = urlParams.get('role'); // Redirect based on the role from URL
//             if (role === 'student') {
//                 window.location.href = 'student_dashboard.html';
//             } else if (role === 'instructor') {
//                 window.location.href = 'instructor_dashboard.html';
//             }
//         } else {
//             alert(result.error || 'Registration failed');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred during registration. Please try again.');
//     }
// });

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
