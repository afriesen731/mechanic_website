import { showPage, showIframe, updateIframes } from "../js/display_iframe.js";
import { verify } from "../js/redirect.js";
import { pb } from "../js/import_pb.js"; // Ensure PocketBase is imported

// Verify the user's permissions
verify(['mechanic', 'viewer']);

// Dynamically set the iframe source based on the user's role
document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('workorder-table-iframe');

    // Ensure the user is authenticated
    const user = pb.authStore.model;
    if (user?.role === 'viewer') {
        // Set iframe for viewers
        iframe.src = "../html/workorders.html?role=viewer&type=completed";
    } else if (user?.role === 'mechanic') {
        // Set iframe for mechanics
        iframe.src = "../html/workorders.html?role=mechanic&type=mechanic";
    } else {
        console.error("Unauthorized user. Redirecting to login...");
        window.location.href = "index.html"; // Redirect to login if unauthorized
    }

    // Allow function to be accessed by other Iframes
    window.showIframe = showIframe;

    // Update iframes dynamically
    updateIframes();

    // Show the initial iframe content
    showIframe('iframe-container-order-table');
});

// Add event listeners to elements
document.getElementById('main-dashboard-link').addEventListener('click', () => {
    showIframe('iframe-container-order-table');
});

document.getElementById('order-link').addEventListener('click', () => {
    showIframe('iframe-container-order-table');
});