// Function to log out the user
function confirmLogout() {
    const confirmation = confirm("Are you sure you want to logout?");
    if (confirmation) {
        localStorage.removeItem('user_data');
        window.location.href = "home.html";
    }
}

// Function to fetch course details
async function fetchCourseDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('courseId'); // Extract courseId from query params

    if (!courseId) {
        alert('Invalid course.');
        window.location.href = './my-courses-student.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:5001/course/${courseId}`);
        if (!response.ok) throw new Error('Failed to fetch course details.');

        const course = await response.json();

        // Populate course details
        document.getElementById('course-title').innerText = course.title;
        document.getElementById('course-description').innerHTML = `
            <p><strong>Category:</strong> ${course.category}</p>
            <p>${course.description}</p>
        `;

        // Populate course materials
        const courseMaterials = document.getElementById('course-materials');
        courseMaterials.innerHTML = '<h3>Course Materials</h3>';

        if (course.chapters.length === 0 && course.additionalDocs.length === 0) {
            courseMaterials.innerHTML += '<p>No materials available.</p>';
        } else {
            course.chapters.forEach((chapter) => {
                courseMaterials.innerHTML += `
                    <div class="material">
                        <h4>${chapter.title}</h4>
                        <a href="${chapter.fileUrl}" target="_blank">Download Chapter</a>
                    </div>
                `;
            });

            course.additionalDocs.forEach((doc) => {
                courseMaterials.innerHTML += `
                    <div class="material">
                        <h4>${doc.title}</h4>
                        <a href="${doc.fileUrl}" target="_blank">Download Document</a>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error('Error fetching course details:', error);
        alert('Failed to load course details. Please try again later.');
    }
}

document.addEventListener('DOMContentLoaded', fetchCourseDetails);
