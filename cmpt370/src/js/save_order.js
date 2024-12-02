// save_order.js

import html2pdf from "html2pdf.js";

/**
 * Download a DOM element as a file
 * @param {HTMLElement} element element to download the contents of
 * @param {String} fileName the name of the file that will be downloaded
 */
export async function downloadElement(element, fileName) {
    const options = {
        margin:       0.5,
        filename:     `${fileName}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    if (element.style.display == 'none') {
        element.style.display == '';
        await html2pdf().set(options).from(element).save();
    } else {
        html2pdf().set(options).from(element).save();
    }
}

/**
 * Formats time in seconds to HH:MM:SS.
 * @param {Number} seconds - The time in seconds.
 * @returns {String} - The formatted time.
 */
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function displayOrder(order) {
    // Create a container for the order details
    const container = document.createElement('div');
    container.classList.add('order-container');

    /*** General Information Section ***/
    const generalSection = document.createElement('section');
    generalSection.classList.add('order-section');

    const generalHeader = document.createElement('h2');
    generalHeader.textContent = 'General Information';
    generalSection.appendChild(generalHeader);

    const workOrderNumber = document.createElement('p');
    workOrderNumber.innerHTML = `<strong>Work Order #:</strong> ${order.work_order_number || 'N/A'}`;
    generalSection.appendChild(workOrderNumber);

    const status = document.createElement('p');
    status.innerHTML = `<strong>Status:</strong> ${order.status || 'N/A'}`;
    generalSection.appendChild(status);

    const mechanics = document.createElement('p');
    const mechanicsList = order.expand?.mechanics?.map(m => m.name).join(', ') || 'Not assigned';
    mechanics.innerHTML = `<strong>Mechanics:</strong> ${mechanicsList}`;
    generalSection.appendChild(mechanics);

    const serviceType = document.createElement('p');
    serviceType.innerHTML = `<strong>Type of Service:</strong> ${order.type_of_service?.join(', ') || 'N/A'}`;
    generalSection.appendChild(serviceType);

    container.appendChild(generalSection);

    /*** Vehicle Information Section ***/
    const vehicleSection = document.createElement('section');
    vehicleSection.classList.add('order-section');

    const vehicleHeader = document.createElement('h2');
    vehicleHeader.textContent = 'Vehicle Information';
    vehicleSection.appendChild(vehicleHeader);

    const fields = [
        { label: 'Unit #', value: order.unit_number },
        { label: 'Make', value: order.make },
        { label: 'Model', value: order.model },
        { label: 'Year', value: order.year },
        { label: 'License Plate', value: order.license_plate },
        { label: 'VIN Number', value: order.vin_number },
        { label: 'Retorque Number', value: order.retorque_number },
        { label: 'KMs', value: order.kms },
    ];

    fields.forEach(field => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${field.label}:</strong> ${field.value || 'N/A'}`;
        vehicleSection.appendChild(p);
    });

    container.appendChild(vehicleSection);

    /*** Reefer Information Section ***/
    const reeferSection = document.createElement('section');
    reeferSection.classList.add('order-section');

    const reeferHeader = document.createElement('h2');
    reeferHeader.textContent = 'Reefer Information';
    reeferSection.appendChild(reeferHeader);

    const reeferFields = [
        { label: 'Reefer VIN Number', value: order.reefer_vin_number },
        { label: 'Reefer Make', value: order.reefer_make },
        { label: 'Reefer Model', value: order.reefer_model },
        { label: 'Reefer Hours', value: order.reefer_hours },
    ];

    reeferFields.forEach(field => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${field.label}:</strong> ${field.value || 'N/A'}`;
        reeferSection.appendChild(p);
    });

    container.appendChild(reeferSection);

    /*** Jobs Section ***/
    const jobsSection = document.createElement('section');
    jobsSection.classList.add('order-section');

    const jobsHeader = document.createElement('h2');
    jobsHeader.textContent = 'Jobs';
    jobsSection.appendChild(jobsHeader);

    if (order.jobs && order.jobs.length > 0) {
        let totalTime = 0;

        order.jobs.forEach((job, index) => {
            const jobContainer = document.createElement('div');
            jobContainer.classList.add('job-container');

            const jobTitle = document.createElement('h3');
            jobTitle.textContent = `Job ${index + 1}: ${job.description || 'No description provided'}`;
            jobContainer.appendChild(jobTitle);

            const jobStatus = document.createElement('p');
            jobStatus.innerHTML = `<strong>Status:</strong> ${job.status || 'N/A'}`;
            jobContainer.appendChild(jobStatus);

            const jobComment = document.createElement('p');
            jobComment.innerHTML = `<strong>Comment:</strong> ${job.comment || 'No comment provided'}`;
            jobContainer.appendChild(jobComment);

            const jobPartsUsed = document.createElement('p');
            jobPartsUsed.innerHTML = `<strong>Parts Used:</strong> ${job.partsUsed || 'No parts used'}`;
            jobContainer.appendChild(jobPartsUsed);

            const jobTime = document.createElement('p');
            const formattedTime = formatTime(job.hours || 0);
            jobTime.innerHTML = `<strong>Time Spent:</strong> ${formattedTime}`;
            jobContainer.appendChild(jobTime);

            totalTime += job.hours || 0;

            jobsSection.appendChild(jobContainer);
        });

        // Display total time
        const totalTimeElement = document.createElement('h3');
        totalTimeElement.textContent = `Total Time Spent: ${formatTime(totalTime)}`;
        jobsSection.appendChild(totalTimeElement);
        const hourlyRate = 50; // Replace with your rate or fetch from settings
        const totalHours = totalTime / 3600;
        const totalCost = totalHours * hourlyRate;

        const totalCostElement = document.createElement('h3');
        totalCostElement.textContent = `Total Cost: $${totalCost.toFixed(2)}`;
        jobsSection.appendChild(totalCostElement);

    } else {
        const noJobs = document.createElement('p');
        noJobs.textContent = 'No jobs assigned.';
        jobsSection.appendChild(noJobs);
    }

    container.appendChild(jobsSection);

    // Return the container
    return container;
}