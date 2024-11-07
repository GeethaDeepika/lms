document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role'); // Get the role from the query string

    try {
        const response = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Login successful!');
            if (role === 'student') {
                window.location.href = 'student_dashboard.html';
            } else if (role === 'instructor') {
                window.location.href = 'instructor_dashboard.html';
            }
        } else {
            alert(result.error || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});
