import { pb } from "../js/import_pb.js"; // PocketBase instance
import { verify } from "../js/redirect.js";

// Verify the user's role is "mechanic"
verify('mechanic');

document.addEventListener("DOMContentLoaded", async () => {
    const iframe = document.getElementById("workorders-iframe");

    // Fetch the logged-in mechanic's ID
    const mechanicId = pb.authStore.model?.id;

    if (!mechanicId) {
        console.error("Mechanic ID is missing. Redirecting to login...");
        window.location.href = "index.html";
        return;
    }

    // Set iframe source dynamically to show mechanic's work orders
    iframe.src = `../html/workorders.html?role=mechanic&assignedTo=${mechanicId}`;
    
    // Add event listener for "My Work-Orders" menu
    document.getElementById('my-workorders-link').addEventListener('click', () => {
        iframe.src = `../html/workorders.html?role=mechanic&assignedTo=${mechanicId}`;
    });
});