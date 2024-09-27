// PocketBase SDK initialization
const pb = new PocketBase('http://127.0.0.1:8090');

// Function to handle user login
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Authenticate user via PocketBase
        const authData = await pb.collection('users').authWithPassword(username, password);
        
        // Redirect user based on role (admin, mechanic, viewer)
        if (authData.record.role === 'Admin') {
            window.location.href = 'admin.html';
        } else if (authData.record.role === 'Mechanic') {
            window.location.href = 'mechanic.html';
        } else if (authData.record.role === 'Viewer') {
            window.location.href = 'viewer.html';
        }
    } catch (error) {
        document.getElementById('login-status').innerText = 'Login failed. Please try again.';
    }
}

// Admin functionality (create work orders, view work orders, etc.)
async function createWorkOrder() {
    // Logic for creating a new work order goes here
}

async function viewWorkOrders() {
    // Logic for viewing work orders (admin-specific) goes here
}

// Mechanic functionality (load work orders, start/stop fault, etc.)
async function loadWorkOrder() {
    const workOrderNumber = document.getElementById('workOrderNumber').value;
    
    // Fetch work order details by work order number
    const workOrder = await pb.collection('work_orders').getFirstListItem(`work_order_number="${workOrderNumber}"`);
    
    // Display work order details and faults to the mechanic
}

async function startWork(faultIndex) {
    // Logic to log start time for a specific fault
}

async function stopWork(faultIndex) {
    // Logic to log stop time and complete work on a fault
}

// Viewer functionality (download work orders)
async function downloadWorkOrders() {
    // Logic to download completed work orders (PDF or CSV)
}