function filterCourses() {
    const filter = document.getElementById('courseFilter').value.toUpperCase();
    const rows = document.getElementById('courseList').getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const titleCell = rows[i].getElementsByTagName('td')[0];
        if (titleCell) {
            const title = titleCell.textContent || titleCell.innerText;
            rows[i].style.display = title.toUpperCase().indexOf(filter) > -1 ? '' : 'none';
        }
    }
}

function confirmLogout() {
    const confirmation = confirm("Are you sure you want to logout?");
    if (confirmation) {
        window.location.href = "index.html";
    }
}

function filterCourses() {
    const input = document.getElementById('courseFilter');
    const filter = input.value.toLowerCase();
    const table = document.getElementById('courseList');
    const rows = table.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let found = false;

        for (let j = 0; j < cells.length; j++) {
            if (cells[j]) {
                const textValue = cells[j].textContent || cells[j].innerText;
                if (textValue.toLowerCase().indexOf(filter) > -1) {
                    found = true;
                    break;
                }
            }
        }

        // Show or hide the row based on the search input
        if (found) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}

function openEditPage(courseTitle) {
    // Redirect to the edit course page
    window.location.href = 'edit-course.html?course=' + encodeURIComponent(courseTitle);
}
