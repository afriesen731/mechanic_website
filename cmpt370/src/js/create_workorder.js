import PocketBase from 'pocketbase';
// PocketBase SDK initialization
const pb = new PocketBase('http://ddmpmc.duckdns.org:8090');

// Function to safely get the element by ID and avoid null reference errors
function getElementValue(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with ID '${id}' not found.`);
        return '';
    }
    return element.value;
}

export async function submitWorkOrder() {
    console.log("submitWorkOrder called");

    // Debugging logs to identify missing elements
    console.log(getElementValue('workOrderNumber'));  // Check if it logs the correct value
    console.log(getElementValue('unitNumber'));
    console.log(getElementValue('make'));
    console.log(getElementValue('model'));
    console.log(getElementValue('year'));  // Added the year field

    // Get the values from the work order form using the safer function
    const workOrderNumber = getElementValue('workOrderNumber');
    const unitNumber = getElementValue('unitNumber');
    const make = getElementValue('make');
    const model = getElementValue('model');
    const year = getElementValue('year');  // Added the year field
    const licensePlate = getElementValue('licensePlate');
    const vinNumber = getElementValue('vinNumber');
    const retorqueNumber = getElementValue('retorqueNumber');
    const kms = getElementValue('kms');

    if (!workOrderNumber.trim()) {
        alert("Work Order # is required!");
        return;
    }

    // Reefer Information
    const reeferVinNumber = getElementValue('reeferVinNumber');
    const reeferMake = getElementValue('reeferMake');
    const reeferModel = getElementValue('reeferModel');
    const reeferHours = getElementValue('reeferHours');

    // Type of Service (get checked values)
    const checkboxes = document.querySelectorAll('input[name="typeOfService"]:checked');
    const typeOfService = Array.from(checkboxes).map(checkbox => checkbox.value);

    // Job Table: Collect job descriptions and hours
    const jobs = [];
    for (let i = 1; i <= 10; i++) {
        const description = getElementValue(`jobDescription${i}`);
        const hours = getElementValue(`jobHours${i}`);
        if (description || hours) {
            jobs.push({ 
                jobNumber: i,
                description: description,
                hours: hours,
                status: "Pending"  // Initialize all job statuses as Pending
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
        jobs: jobs, // Jobs array
        status: 'Pending'
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

// Attach event listener
document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submitWorkOrderButton');
    if (submitButton) {
        submitButton.addEventListener('click', submitWorkOrder);
    }
});