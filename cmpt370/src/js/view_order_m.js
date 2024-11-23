import { pb } from "../js/import_pb.js" 






function displayOrderMechanic(parent, order) {
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

        displayOrderMechanic(container, order);
        
    }
    catch (error) {
        container.innerHTML = error;
    }
});


backButton.addEventListener("click", e => {
    parent.showIframe(prevFrame);
    parent.window.scrollTo({
        top: prevScrollPosition,
    });
});