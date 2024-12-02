import { pb } from "../js/import_pb.js" 
import { downloadElement, displayOrder } from "../js/save_order.js"
import { detectSize, navigateBack } from "../js/display_iframe.js"


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

        
        // Download/print order
        document.getElementById('download-button').addEventListener('click', () => {
            downloadElement(displayOrder(order), `order_${order.created}`);
        });

        
    }
    catch (error) {
        container.innerHTML = error;
    }
});


backButton.addEventListener("click", e => {
    navigateBack(prevFrame, prevScrollPosition);
});

window.addEventListener('beforeunload', (event) => {
    navigateBack(prevFrame, prevScrollPosition);
});

detectSize();