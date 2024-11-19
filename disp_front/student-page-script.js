document.addEventListener('DOMContentLoaded', () => {
    fetchCourses();

    // Add event listener to the logout button
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            const confirmation = confirm("Are you sure you want to logout?");
            if (confirmation) {
                window.location.href = "home.html";
            }
        });
    }
});
async function fetchCourses() {
    const courseGrid = document.getElementById('course-grid');
    try {
        const response = await fetch('http://localhost:5001/allcourses');
        if (!response.ok) throw new Error('Failed to fetch courses.');

        const courses = await response.json();
        courseGrid.innerHTML = '';

        if (courses.length === 0) {
            courseGrid.innerHTML = '<p>No courses available.</p>';
        } else {
            courses.forEach((course) => {
                const courseCard = document.createElement('div');
                courseCard.classList.add('course-card');
                courseCard.innerHTML = `
                    <img src="${course.photoUrl}" alt="Course Image">
                    <h3>${course.title}</h3>
                    <button class="enroll-btn" data-course-id="${course._id}">Enroll Now</button>
                `;
                courseGrid.appendChild(courseCard);
            });

            // Attach event listeners to all enroll buttons
            const enrollButtons = document.querySelectorAll('.enroll-btn');
            enrollButtons.forEach((button) =>
                button.addEventListener('click', () => enrollCourse(button.dataset.courseId))
            );
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
        courseGrid.innerHTML = '<p>Failed to load courses. Try again later.</p>';
    }
}

async function enrollCourse(courseId) {
    try {
        const userData = JSON.parse(localStorage.getItem('user_data'));
        const studentId = userData?._id; 

        if (!studentId) {
            alert('User not logged in.');
            // window.location.href = 'login.html';
            return;
        }

        const response = await fetch('http://localhost:5001/enroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, courseId }),
        });

        if (!response.ok) {
            const { message } = await response.json();
            alert(message || 'Failed to enroll in course');
            return;
        }

        alert('Enrollment successful!');
    } catch (error) {
        console.error('Error enrolling in course:', error);
        alert('Enrollment failed. Please try again later.');
    }
}
