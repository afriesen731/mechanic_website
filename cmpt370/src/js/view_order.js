// view_order.js

import { pb } from "../js/import_pb.js";
import { downloadElement, displayOrder } from "./save_order.js";
import { detectSize } from "../js/display_iframe.js"



const container = document.getElementById("order-container");
const backButton = document.getElementById("back-button");
const costPerHourInput = document.getElementById("cost-per-hour");
const updateCostButton = document.getElementById("update-cost-button");
const downloadButton = document.getElementById("download-button");

// Url parameters
const params = new URLSearchParams(window.location.search);
const orderId = params.get("order");
const prevFrame = params.get("prevFrame");
// Save scroll position
const prevScrollPosition = params.get("prevScroll");

// Variable to store the current order
let currentOrder = null;

// Variable to store the current cost per hour
let currentCostPerHour = null;

document.addEventListener("DOMContentLoaded", async e => {
    try {
        currentOrder = await pb.collection("work_orders").getOne(orderId, {
            expand: 'mechanics' // Ensure mechanics' names are expanded
        });
        // Scroll to top
        parent.window.scrollTo({
            top: 0,
        });

        // Initially display the order without cost per hour
        renderOrder();

        // Add event listener for "Update Cost" button
        updateCostButton.addEventListener('click', () => {
            const costPerHourValue = parseFloat(costPerHourInput.value);
            if (!isNaN(costPerHourValue) && costPerHourValue >= 0) {
                currentCostPerHour = costPerHourValue;
            } else {
                alert("Please enter a valid non-negative number for Cost per Hour.");
                costPerHourInput.value = '';
                currentCostPerHour = null; // Reset if invalid
            }
            renderOrder();
        });

        // Download/print order
        downloadButton.addEventListener('click', () => {
            const orderDetails = displayOrder(currentOrder, currentCostPerHour);
            downloadElement(orderDetails, `order_${currentOrder.work_order_number || currentOrder.created}`);
        });
    }
    catch (error) {
        container.innerHTML = error;
    }
});

function renderOrder() {
    const orderDetails = displayOrder(currentOrder, currentCostPerHour);
    container.innerHTML = '';
    container.appendChild(orderDetails);
}

backButton.addEventListener("click", () => {
    parent.showIframe(prevFrame);
    parent.window.scrollTo({ top: prevScrollPosition });
});


detectSize();