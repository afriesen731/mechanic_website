import { updateIframeSize, showIframe, updateIframes, reloadFrame } from "../js/display_iframe.js";
import { verify } from "../js/redirect.js";
import { pb } from "../js/import_pb.js"; // Ensure PocketBase is imported

// Verify the user's permissions
verify('viewer');

// Dynamically set the iframe source based on the user's role
document.addEventListener('DOMContentLoaded', () => {



    // Allow function to be accessed by other Iframes
    window.showIframe = showIframe;

    // Update iframes dynamically
    updateIframes();

    // Show the initial iframe content
    reloadFrame('iframe-container-order-table');
});

// Add event listeners to elements
document.getElementById('main-dashboard-link').addEventListener('click', () => {
    showIframe('iframe-container-order-table');
});

document.getElementById('order-link').addEventListener('click', () => {
    showIframe('iframe-container-order-table');
});



const iframes = document.querySelectorAll('iframe');
updateIframeSize(iframes);