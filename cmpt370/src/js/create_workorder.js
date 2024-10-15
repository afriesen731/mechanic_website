import PocketBase from 'pocketbase';
// PocketBase SDK initialization
const pb = new PocketBase('http://ddmpmc.duckdns.org:8090');

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

    if (!workOrderNumber.trim()) {
        alert("Work Order # is required!");
        return;
    }

    // Reefer Information
    const reeferVinNumber = document.getElementById('reeferVinNumber').value;
    const reeferMake = document.getElementById('reeferMake').value;
    const reeferModel = document.getElementById('reeferModel').value;
    const reeferHours = document.getElementById('reeferHours').value;

    // Type of Service (get checked values)
    const checkboxes = document.querySelectorAll('input[name="typeOfService"]:checked');
    const typeOfService = Array.from(checkboxes).map(checkbox => checkbox.value);

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
    submitButton.addEventListener('click', submitWorkOrder);
});