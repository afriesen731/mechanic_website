import { pb } from "../js/import_pb.js"; // PocketBase instance
import { verify } from "../js/redirect.js";

// Verify the user's role is "mechanic"
verify('mechanic');

document.addEventListener("DOMContentLoaded", async () => {
    const iframe = document.getElementById("workorders-iframe");
    const workordersContainer = document.getElementById("iframe-container-my-workorders");
    const workorderDetailsContainer = document.getElementById("iframe-container-workorder-details");
    const workorderDetailsIframe = document.getElementById("workorder-details-iframe");

    // Fetch the logged-in mechanic's ID
    const mechanicId = pb.authStore.model?.id;

    if (!mechanicId) {
        console.error("Mechanic ID is missing. Redirecting to login...");
        window.location.href = "index.html";
        return;
    }

    // Set iframe source dynamically to show mechanic's work orders
    iframe.src = `../html/workorders.html?role=mechanic&assignedTo=${mechanicId}`;

    /**
     * Show the work orders list
     */
    function showWorkOrders() {
        workordersContainer.style.display = "block";
        workorderDetailsContainer.style.display = "none";
    }

    /**
     * Show the work order details
     * @param {string} workorderId - The ID of the work order to display.
     */
    function showWorkOrderDetails(workorderId) {
        workorderDetailsIframe.src = `../html/workorder_details.html?order=${workorderId}&prevFrame=iframe-container-my-workorders`;
        workordersContainer.style.display = "none";
        workorderDetailsContainer.style.display = "block";
    }

    // Add event listener for "My Work-Orders" menu
    document.getElementById('my-workorders-link').addEventListener('click', showWorkOrders);

    // Listen for messages from the work orders iframe
    window.addEventListener("message", (event) => {
        if (event.data.action === "viewWorkOrder") {
            const workorderId = event.data.workorderId;
            if (workorderId) {
                showWorkOrderDetails(workorderId);
            } else {
                console.error("Work order ID is missing in the message data.");
            }
        }
    });
});