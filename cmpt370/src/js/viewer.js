// Show the correct page based on the menu clicked
function showPage(page) {
    const pages = document.querySelectorAll('.content-page'); // Select all content pages
    pages.forEach(p => p.style.display = 'none'); // Hide all pages
    document.getElementById(`${page}-page`).style.display = 'block'; // Show selected page
}


