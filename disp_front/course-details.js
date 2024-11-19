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
            <p> <strong>Description: </strong> ${course.description}</p>
        `;

        // Populate course materials
        const courseMaterials = document.getElementById('course-materials');
        courseMaterials.innerHTML = '<h3>Course Materials</h3>';

        if (course.chapters.length === 0 && course.additionalDocs.length === 0) {
            courseMaterials.innerHTML += '<p>No materials available.</p>';
        } else {
            // Display chapters with required structure and styling
            course.chapters.forEach((chapter) => {
                const chapterDiv = document.createElement('div');
                chapterDiv.classList.add('chapter-material');

                chapterDiv.innerHTML = `
                    <h4 class="chapter-title">${chapter.title}</h4>
                    ${chapter.videoUrl ? `
                        <video controls class="chapter-video">
                            <source src="${chapter.videoUrl}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    ` : '<p class="no-video">No video available for this chapter.</p>'}
                    <p class="chapter-description">Chapter summary: ${chapter.description || 'No description provided.'}</p>
                    ${chapter.fileUrl ? `
                        <a class="chapter-download" href="${chapter.fileUrl}" target="_blank">Download Chapter Material</a>
                    ` : '<p class="no-download">No downloadable materials for this chapter.</p>'}
                `;

                courseMaterials.appendChild(chapterDiv);
            });

            // Display additional documents
            if (course.additionalDocs.length > 0) {
                const docSection = document.createElement('div');
                docSection.innerHTML = '<h3>Additional Documents</h3>';
                course.additionalDocs.forEach((doc) => {
                    docSection.innerHTML += `
                        <div class="additional-doc">
                            <h4>${doc.title}</h4>
                            <a href="${doc.fileUrl}" target="_blank">Download Document</a>
                        </div>
                    `;
                });
                courseMaterials.appendChild(docSection);
            }
        }
    } catch (error) {
        console.error('Error fetching course details:', error);
        alert('Failed to load course details. Please try again later.');
    }
}

document.addEventListener('DOMContentLoaded', fetchCourseDetails);
