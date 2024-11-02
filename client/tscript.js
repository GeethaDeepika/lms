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
