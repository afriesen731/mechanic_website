console.log("app.js loaded");
import PocketBase from 'pocketbase';
// PocketBase SDK initialization
const pb = new PocketBase('http://ddmpmc.duckdns.org:8090');

const loginButton = document.getElementById('login-button');


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
        console.log(authData);
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
// ** Function to Submit Work Order **
export async function submitWorkOrder() {
    console.log("submitWorkOrder called");
    // Get the values from the work order form
    const workOrderNumber = document.getElementById('workOrderNumber').value;
    const unitNumber = document.getElementById('unitNumber').value;
    const make = document.getElementById('make').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const licensePlate = document.getElementById('licensePlate').value;
    const vinNumber = document.getElementById('vinNumber').value;
    const retorqueNumber = document.getElementById('retorqueNumber').value;
    const kms = document.getElementById('kms').value;

    // Reefer Information
    const reeferVinNumber = document.getElementById('reeferVinNumber').value;
    const reeferMake = document.getElementById('reeferMake').value;
    const reeferModel = document.getElementById('reeferModel').value;
    const reeferHours = document.getElementById('reeferHours').value;

    // Type of Service (get checked values)
    const checkboxes = document.querySelectorAll('input[name="typeOfService"]:checked');
    const typeOfService = Array.from(checkboxes).map(checkbox => checkbox.value); // Get all checked values


    // Job Table: Collect job descriptions and hours
    const jobs = [];
    for (let i = 1; i <= 20; i++) {
        const description = document.getElementById(`jobDescription${i}`).value;
        const hours = document.getElementById(`jobHours${i}`).value;
        if (description || hours) {
            jobs.push({ 
                jobNumber: i,
                description: description,
                hours: hours,
                staus: "Pending"    // Initialize all job statuses as Pending
            });
        }
    }

    // Construct the work order object
    const workOrderData = {
        work_order_number: workOrderNumber,
        unit_number: unitNumber,
        make: make,
        model: model,
        year: year,
        license_plate: licensePlate,
        vin_number: vinNumber,
        retorque_number: retorqueNumber,
        kms: kms,
        reefer_vin_number: reeferVinNumber,
        reefer_make: reeferMake,
        reefer_model: reeferModel,
        reefer_hours: reeferHours,
        type_of_service: typeOfService,
        jobs: jobs, // Jobs is an array of job descriptions and hours
        status: 'Pending' // Set the initial status to 'Pending'
    };

    try {
        // Send the work order data to PocketBase
        const response = await pb.collection('work_orders').create(workOrderData);
        alert('Work order created successfully!');
    } catch (error) {
        console.error('Error creating work order:', error);
        alert('There was an error creating the work order. Please try again.');
    }
}

// Event listener for the submit button
document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submitWorkOrderButton');
    submitButton.addEventListener('click', submitWorkOrder);
});

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

if (loginButton) {
    loginButton.addEventListener('click', function(event) {
        login();
    });
}