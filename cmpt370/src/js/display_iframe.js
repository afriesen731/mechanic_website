

// Show the correct page based on the menu clicked
export function showPage(page) {
    const pages = document.querySelectorAll('.content-page'); // Select all content pages
    pages.forEach(p => p.style.display = 'none'); // Hide all pages
    document.getElementById(`${page}-page`).style.display = 'block'; // Show selected page
}

// Function to show the Create Work Order iframe and save frameId to the URL
export function showIframe(frameId) {
    const pages = document.querySelectorAll('.content-page'); // Select all content pages
    pages.forEach(p => p.style.display = 'none'); // Hide all pages
    
    const iframe = document.getElementById(frameId); // Select the iframe
    iframe.style.display = 'block'; // Show the iframe container

    // Update the URL to include the frameId
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('frameId', frameId);
    window.history.pushState(null, '', newUrl);
}


// def Default frame to show
export function reloadFrame(def) {
    const params = new URLSearchParams(window.location.search); 
    const frameId = params.get('frameId'); 
    if (frameId) {
        showIframe(frameId);
    }
    else {
        showIframe(def);
    }

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



/**
 * Observes resizing of the page and notifies the parent page with the updated height.
 */
export function detectSize() {
    // Detect resizing of the body or main content and send the height to the parent
    const resizeObserver = new ResizeObserver(() => {
        const height = document.documentElement.scrollHeight;
        window.parent.postMessage({ height }, '*');
    });
  
  // Observe the body or main content area
  resizeObserver.observe(document.body);
}



/**
 * Updates the size of iframes based on messages from child frames.
 *
 * @param {HTMLIFrameElement[]} iframes - Array of iframe elements to monitor for size updates.
 */
export function updateIframeSize(iframes) {
    window.addEventListener('message', (event) => {
        if (!event.data.height) return;

        iframes.forEach((iframe) => {
            if (iframe.contentWindow === event.source) {
                iframe.style.height = `${event.data.height}px`;
            }
        });
    });
}



/**
 * Navigates back to the previous iframe and scrolls the parent window to the previous position.
 *
 * @param {String} prevFrame - The ID or identifier of the previous iframe to show.
 * @param {Number} prevScrollPosition - The scroll position to restore in the parent window.
 */
export function navigateBack(prevFrame, prevScrollPosition) {
    parent.showIframe(prevFrame);
    parent.window.scrollTo({
        top: prevScrollPosition,
    });
}
