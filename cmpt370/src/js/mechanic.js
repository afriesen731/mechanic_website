import { showIframe, updateIframes, reloadFrame, updateIframeSize } from "../js/display_iframe.js";
import { verify } from "../js/redirect.js"
import { pb } from "../js/import_pb.js"; // Ensure PocketBase is imported

// Verify the user's permissions
verify('mechanic');

// Dynamically set the iframe source based on the user's role
document.addEventListener('DOMContentLoaded', () => {


    // Allow function to be accessed by other Iframes
    window.showIframe = showIframe;

    // Update iframes dynamically
    updateIframes();

    // Show the initial iframe content
    reloadFrame('iframe-container-my-workorders');
});

const iframes = document.querySelectorAll('iframe');
updateIframeSize(iframes);