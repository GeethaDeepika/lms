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
                `;
                courseGrid.appendChild(courseCard);
            });
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
        courseGrid.innerHTML = '<p>Failed to load courses. Try again later.</p>';
    }
}
