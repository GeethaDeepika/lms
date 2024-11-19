// Function to log out the user and clear local storage
function confirmLogout() {
    const confirmation = confirm("Are you sure you want to logout?");
    if (confirmation) {
        localStorage.removeItem('user_data'); // Clear user data from local storage
        window.location.href = "home.html"; // Redirect to home page
    }
}

// Function to fetch and display enrolled courses
async function fetchEnrolledCourses() {
    const courseGrid = document.getElementById('course-grid'); // Locate the container for courses

    try {
        // Retrieve user data from local storage
        const userData = JSON.parse(localStorage.getItem('user_data'));
        const studentId = userData?._id;

        if (!studentId) {
            throw new Error('User not logged in or student ID missing.');
        }

        // Fetch enrolled courses for the logged-in student
        const response = await fetch(`http://localhost:5001/my-courses/${studentId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch enrolled courses.');
        }

        const enrollments = await response.json();
        courseGrid.innerHTML = ''; // Clear any existing content

        if (enrollments.length === 0) {
            // If no courses are enrolled, display a message
            courseGrid.innerHTML = '<p>No enrolled courses.</p>';
        } else {
            // Loop through each enrolled course and render it
            enrollments.forEach(({ courseId }) => {
                if (!courseId) return; // Skip if courseId is not populated

                const courseCard = document.createElement('div');
                courseCard.classList.add('course-card');
                courseCard.innerHTML = `
                    <img src="${courseId.photoUrl || './assets/default-course.jpg'}" alt="Course Image">
                    <h3>${courseId.title || 'Untitled Course'}</h3>
                `;
                courseGrid.appendChild(courseCard);
            });
        }
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        courseGrid.innerHTML = '<p>Failed to load enrolled courses. Try again later.</p>';
    }
}

// Event listener to ensure fetchEnrolledCourses runs after DOM is loaded
document.addEventListener('DOMContentLoaded', fetchEnrolledCourses);
