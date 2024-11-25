import { pb } from "../js/import_pb.js" 
import { returnToFrame } from "../js/redirect.js"
import { downloadElement } from "./save_order.js";



function displayOrder(parent, order) {
    parent.innerText = `Work Order #: ${order.work_order_number || 'N/A'}\n
    Unit #: ${order.unit_number || 'N/A'}\n
    Mechanic: ${order.expand?.mechanics?.map(m => m.name).join(', ') || 'Not assigned'}\n
    Service Type: ${order.type_of_service.join(', ')}\n
    Status: ${order.status} `;




}



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
        const order = await pb.collection("work_orders").getOne(orderId);
        // Scroll to top
        parent.window.scrollTo({
            top: 0,
        });

        displayOrder(container, order);
        // Download/print order
        document.getElementById('download-button').addEventListener('click', () => {
            downloadElement(container, `order_${order.created}`);
        });
    }
    catch (error) {
        container.innerHTML = error;
    }
});


backButton.addEventListener("click", e => {
    returnToFrame(prevFrame, prevScrollPosition);
});

