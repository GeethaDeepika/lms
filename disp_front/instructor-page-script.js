document.addEventListener('DOMContentLoaded', () => {
    // Handle Logout Confirmation
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            const confirmation = confirm("Are you sure you want to logout?");
            if (confirmation) {
                window.location.href = "home.html";
            }
        });
    }

    // Handle Photo Upload Preview
    const fileInput = document.getElementById('course-photo');
    if (fileInput) {
        fileInput.addEventListener('change', handlePhotoUpload);
    }

    const deletePhotoButton = document.getElementById('delete-photo-btn');
    if (deletePhotoButton) {
        deletePhotoButton.addEventListener('click', deletePhoto);
    }

    // Add Chapter Functionality
    const addChapterButton = document.getElementById('add-chapter-btn');
    if (addChapterButton) {
        addChapterButton.addEventListener('click', addChapter);
    }

    // Add Document Functionality
    const addDocumentButton = document.getElementById('add-document-btn');
    if (addDocumentButton) {
        addDocumentButton.addEventListener('click', addDocument);
    }

    // Handle Form Submission
    const form = document.getElementById('add-course-form');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const userData = JSON.parse(localStorage.getItem('user_data'));

            const formData = new FormData(event.target);
            formData.append('instructorId', userData._id);

            try {
                const response = await fetch('http://localhost:5001/add-course', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    alert('Course added successfully!');
                }

                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Failed to add course. Please try again later.');
            }
        });
    }

    // Fetch Courses and Display
    const courseList = document.getElementById('course-list');
    if (courseList) {
        fetchCourses(courseList);
    }
});

// Fetch Courses from the Backend
async function fetchCourses(courseList) {
    try {
        // Get the instructor ID from local storage
        const userData = JSON.parse(localStorage.getItem('user_data'));
        const instructorId = userData ? userData._id : null;

        if (!instructorId) {
            alert('Instructor ID is missing. Please log in again.');
            window.location.href = 'login.html'; // Redirect to login page if ID is missing
            return;
        }

        // Fetch courses for the logged-in instructor using the instructorId
        const response = await fetch(`http://localhost:5001/courses?instructorId=${instructorId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }

        const courses = await response.json();

        if (courses.length === 0) {
            courseList.innerHTML = '<tr><td>No courses added yet.</td></tr>';
        } else {
            courseList.innerHTML = ''; // Clear any previous content
            courses.forEach((course) => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${course.title}</td>`;
                courseList.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
        courseList.innerHTML = '<tr><td>Failed to load courses. Please try again later.</td></tr>';
    }
}

// Photo Upload Handler
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('photo-preview');
    const placeholderText = document.getElementById('photo-placeholder-text');
    const deleteButton = document.getElementById('delete-photo-btn');

    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            preview.src = reader.result;
            preview.classList.remove('hidden');
            placeholderText.classList.add('hidden');
            deleteButton.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

// Delete Photo Handler
function deletePhoto() {
    const fileInput = document.getElementById('course-photo');
    const preview = document.getElementById('photo-preview');
    const placeholderText = document.getElementById('photo-placeholder-text');
    const deleteButton = document.getElementById('delete-photo-btn');

    fileInput.value = '';
    preview.src = '';
    preview.classList.add('hidden');
    placeholderText.classList.remove('hidden');
    deleteButton.classList.add('hidden');
}

// Add Chapter Handler
function addChapter() {
    const chapterList = document.getElementById('chapter-list');
    const chapterId = `chapter-${Date.now()}`;
    const chapterItem = document.createElement('div');
    chapterItem.className = 'chapter-item';
    chapterItem.innerHTML = `
        <input type="text" name="chapters[]" placeholder="Chapter Title" required>
        <textarea name="chapterDescriptions[]" rows="4" placeholder="Chapter Description" required></textarea>
        <input type="file" name="chapterFiles[]" accept=".pdf,.doc,.docx,.pptx">
        <input type="file" name="chapterVideos[]" accept="video/*">
        <button type="button" onclick="removeItem('${chapterId}')">Remove</button>
    `;
    chapterItem.id = chapterId;
    chapterList.appendChild(chapterItem);
}

// Add Document Handler
function addDocument() {
    const docList = document.getElementById('additional-doc-list');
    const docId = `doc-${Date.now()}`;
    const docItem = document.createElement('div');
    docItem.className = 'document-item';
    docItem.innerHTML = `
        <input type="text" name="documents[]" placeholder="Document Title" required>
        <input type="file" name="docFiles[]" accept=".pdf,.doc,.docx" required>
        <button type="button" onclick="removeItem('${docId}')">Remove</button>
    `;
    docItem.id = docId;
    docList.appendChild(docItem);
}

// Remove Item Handler
function removeItem(itemId) {
    const item = document.getElementById(itemId);
    if (item) {
        item.remove();
    }
}
