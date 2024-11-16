function confirmLogout() {
    const confirmation = confirm("Are you sure you want to logout?");
    if (confirmation) {
        window.location.href = "home.html";
    }
}

// Handle photo upload preview
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

// Add Chapter
function addChapter() {
    const chapterList = document.getElementById('chapter-list');
    const chapterId = `chapter-${Date.now()}`;
    const chapterItem = document.createElement('div');
    chapterItem.className = 'chapter-item';
    chapterItem.innerHTML = `
        <input type="text" name="chapters[]" placeholder="Chapter Title" required>
        <input type="file" name="chapterFiles[]" accept=".pdf,.doc,.docx" required>
        <button type="button" onclick="removeItem('${chapterId}')">Remove</button>
    `;
    chapterItem.id = chapterId;
    chapterList.appendChild(chapterItem);
}

// Add Document
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

// Remove Item
function removeItem(itemId) {
    const item = document.getElementById(itemId);
    item.remove();
}

// Handle form submission
document.getElementById('add-course-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    

    alert(JSON.stringify(formData))

    
        const response = await fetch('http://localhost:5001/add-course', {
            method: 'POST',  
            body: formData,
        });

        if (response.ok) {
            alert('Course added successfully!');
        }
    
});
