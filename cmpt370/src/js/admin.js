import { verify } from "../js/redirect.js"
import { showIframe, reloadFrame, updateIframeSize } from "./display_iframe.js";




// Allow function to be accessed by other Iframes
window.showIframe = showIframe;

// Default page for admin: Show In Progress Work Orders
document.addEventListener('DOMContentLoaded', () => {
    reloadFrame('iframe-container-in-progress-orders');
});




// verify that the user is an admin
verify('admin');

const iframes = document.querySelectorAll('iframe');

updateIframeSize(iframes);

// add EventListener to each link
document.getElementById('employee-link').addEventListener('click', () => {
    showIframe('iframe-container-employee-table');
});

document.getElementById('create-employee-link').addEventListener('click', () => {
    showIframe('iframe-container-employee-create');
});

document.getElementById('order-link').addEventListener('click', () => {
    showIframe('iframe-container-in-progress-orders');
});

document.getElementById('create-work-order-link').addEventListener('click', () => {
    showIframe('iframe-container');
});

document.getElementById('in-progress-orders-logo').addEventListener('click', () => {
    showIframe('iframe-container-in-progress-orders');
});



