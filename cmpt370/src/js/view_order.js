// view_order.js

import { pb } from "../js/import_pb.js";
import { downloadElement, displayOrder } from "./save_order.js";

const container = document.getElementById("order-container");
const backButton = document.getElementById("back-button");

// Url parameters
const params = new URLSearchParams(window.location.search);
const orderId = params.get("order");
const prevFrame = params.get("prevFrame");
// Save scroll position
const prevScrollPosition = params.get("prevScroll");

document.addEventListener("DOMContentLoaded", async e => {
    try {
        const order = await pb.collection("work_orders").getOne(orderId, {
            expand: 'mechanics' // Ensure mechanics' names are expanded
        });
        // Scroll to top
        parent.window.scrollTo({
            top: 0,
        });

        // Use the updated displayOrder to show all fields
        const orderDetails = displayOrder(order);
        container.innerHTML = '';
        container.appendChild(orderDetails);

        // Download/print order
        document.getElementById('download-button').addEventListener('click', () => {
            downloadElement(orderDetails, `order_${order.work_order_number || order.created}`);
        });
    }
    catch (error) {
        container.innerHTML = error;
    }
});

backButton.addEventListener("click", () => {
    parent.showIframe(prevFrame);
    parent.window.scrollTo({ top: prevScrollPosition });
});