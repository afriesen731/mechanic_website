import { pb } from "../js/import_pb.js"

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

    // Get the values from the work order form using the safer function
    const workOrderNumber = getElementValue('workOrderNumber');
    const unitNumber = getElementValue('unitNumber');
    const make = getElementValue('make');
    const model = getElementValue('model');
    const year = getElementValue('year');
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
    const jobRows = document.querySelectorAll('[id^="jobDescription"]'); // Selects all job descriptions
    jobRows.forEach((jobRow, index) => {
        const jobNumber = index + 1;
        const description = getElementValue(`jobDescription${jobNumber}`);
        const hours = getElementValue(`jobHours${jobNumber}`);
        if (description || hours) {
            jobs.push({ 
                jobNumber: jobNumber,
                description: description,
                hours: hours,
                status: "Pending"  // Initialize all job statuses as Pending
            });
        }
    });

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
        document.querySelectorAll("input[type='text'], input[type='number'], input[type='checkbox']").forEach(input => {
            if (input.type === "checkbox") {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
        alert('Work order created successfully!');
    } catch (error) {
        console.error('Error creating work order:', error);
        alert('There was an error creating the work order. Please try again.');
    }
}

// Function to dynamically add job descriptions
document.getElementById('addJobButton').addEventListener('click', () => {
    const jobTableBody = document.getElementById('jobTableBody');
    const newRowNumber = jobTableBody.getElementsByTagName('tr').length + 1;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${newRowNumber}</td>
        <td><input type="text" id="jobDescription${newRowNumber}"></td>
        <td><input type="number" id="jobHours${newRowNumber}" style="width: 60px;"></td>
    `;

    jobTableBody.appendChild(newRow);
});

// Attach event listener for submitting the form
document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submitWorkOrderButton');
    if (submitButton) {
        submitButton.addEventListener('click', submitWorkOrder);
    }    

});



