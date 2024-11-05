

// Show the correct page based on the menu clicked
export function showPage(page) {
    const pages = document.querySelectorAll('.content-page'); // Select all content pages
    pages.forEach(p => p.style.display = 'none'); // Hide all pages
    document.getElementById(`${page}-page`).style.display = 'block'; // Show selected page
}


// Function to show the Create Work Order iframe
export function showIframe(frameId) {
    const pages = document.querySelectorAll('.content-page'); // Select all content pages
    pages.forEach(p => p.style.display = 'none'); // Hide all pages
    
    const iframe = document.getElementById(frameId); // Select the iframe
    document.getElementById(frameId).style.display = 'block'; // Show the iframe container
}


export function updateIframes() {
    const iframes = document.querySelectorAll('iframe');


    // update the size of the iframe window
    window.addEventListener('message', (event) => {
        if (!event.data.height) return;
    
        iframes.forEach((iframe) => {
            if (iframe.contentWindow === event.source) {
            iframe.style.height = `${event.data.height}px`;
            }
        });
    });
}
