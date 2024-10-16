console.log("app.js loaded");
import PocketBase from 'pocketbase';
// PocketBase SDK initialization
const pb = new PocketBase('http://ddmpmc.duckdns.org:8090');



// Mechanic functionality (load work orders, start/stop fault, etc.)
async function loadWorkOrder() {
    const workOrderNumber = document.getElementById('workOrderNumber').value;
    
    // Fetch work order details by work order number
    const workOrder = await pb.collection('work_orders').getFirstListItem(`work_order_number="${workOrderNumber}"`);
    
    // Display work order details and faults to the mechanic
}



//  --------------- future ---------------

// Admin functionality (create work orders, view work orders, etc.)
async function createWorkOrder() {
    // Logic for creating a new work order goes here
}

async function viewWorkOrders() {
    // Logic for viewing work orders (admin-specific) goes here
}



async function startWork(faultIndex) {
    // Logic to log start time for a specific job
}

async function stopWork(faultIndex) {
    // Logic to log stop time and complete work on a job
}

// Viewer functionality (download work orders)
async function downloadWorkOrders() {
    // Logic to download completed work orders (PDF or CSV)
}