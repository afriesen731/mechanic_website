import { showPage, showIframe, updateIframes } from "../js/display_iframe.js"
import {verify} from "../js/redirect.js"


// Verify the users permissions
verify(['mechanic', 'viewer']);

updateIframes();



// Add event listeners to elements
document.getElementById('main-dashboard-link').addEventListener('click', () => {
    showPage('main-dashboard');
});

document.getElementById('order-link').addEventListener('click', () => {
    showIframe('iframe-container-order-table');
});


document.getElementById('sort-select').addEventListener('change', (event) => {
    sortEmployees(event.target.value);
});
