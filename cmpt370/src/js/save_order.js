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

export function displayOrder(order, costPerHour = null) {
    // Create a container for the order details
    const container = document.createElement('div');
    container.classList.add('order-container');

    /*** Top Section: Work Order Title ***/
    const titleSection = document.createElement('section');
    titleSection.classList.add('title-section');

    const workOrderTitle = document.createElement('h1');
    workOrderTitle.textContent = `Work Order #${order.work_order_number || 'N/A'}`;
    titleSection.appendChild(workOrderTitle);

    container.appendChild(titleSection);

    /*** Middle Section: Two Columns ***/
    const middleSection = document.createElement('section');
    middleSection.classList.add('middle-section');

    // Left Column
    const leftColumn = document.createElement('div');
    leftColumn.classList.add('left-column');

    /*** General Information Section ***/
    const generalSection = document.createElement('section');
    generalSection.classList.add('order-section');

    const generalHeader = document.createElement('h2');
    generalHeader.textContent = 'General Information';
    generalSection.appendChild(generalHeader);

    const status = document.createElement('p');
    status.innerHTML = `<strong>Status:</strong> ${order.status || 'N/A'}`;
    generalSection.appendChild(status);

    const serviceType = document.createElement('p');
    serviceType.innerHTML = `<strong>Type of Service:</strong> ${order.type_of_service?.join(', ') || 'N/A'}`;
    generalSection.appendChild(serviceType);

    leftColumn.appendChild(generalSection);

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

    leftColumn.appendChild(vehicleSection);

    // Right Column
    const rightColumn = document.createElement('div');
    rightColumn.classList.add('right-column');

    /*** Mechanics Information Section ***/
    const mechanicsSection = document.createElement('section');
    mechanicsSection.classList.add('order-section');

    const mechanicsHeader = document.createElement('h2');
    mechanicsHeader.textContent = 'Mechanics';
    mechanicsSection.appendChild(mechanicsHeader);

    const mechanicsList = document.createElement('p');
    const mechanicsNames = order.expand?.mechanics?.map(m => m.name).join(', ') || 'Not assigned';
    mechanicsList.innerHTML = `<strong>Assigned Mechanics:</strong> ${mechanicsNames}`;
    mechanicsSection.appendChild(mechanicsList);

    rightColumn.appendChild(mechanicsSection);

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

    rightColumn.appendChild(reeferSection);

    // Append columns to middle section
    middleSection.appendChild(leftColumn);
    middleSection.appendChild(rightColumn);

    container.appendChild(middleSection);

    /*** Jobs Section ***/
    const jobsSection = document.createElement('section');
    jobsSection.classList.add('order-section', 'jobs-section');

    const jobsHeader = document.createElement('h2');
    jobsHeader.textContent = 'Jobs';
    jobsSection.appendChild(jobsHeader);

    if (order.jobs && order.jobs.length > 0) {
        let totalTime = 0;

        // Create a table for jobs
        const jobsTable = document.createElement('table');
        jobsTable.classList.add('jobs-table');

        // Table Header
        const tableHeader = document.createElement('tr');
        const headers = ['Job #', 'Description', 'Status', 'Comment', 'Parts Used', 'Time Spent'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            tableHeader.appendChild(th);
        });
        jobsTable.appendChild(tableHeader);

        // Table Rows
        order.jobs.forEach((job, index) => {
            const tr = document.createElement('tr');

            const jobNumberCell = document.createElement('td');
            jobNumberCell.textContent = index + 1;
            tr.appendChild(jobNumberCell);

            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = job.description || 'No description provided';
            tr.appendChild(descriptionCell);

            const statusCell = document.createElement('td');
            statusCell.textContent = job.status || 'N/A';
            tr.appendChild(statusCell);

            const commentCell = document.createElement('td');
            commentCell.textContent = job.comment || 'No comment provided';
            tr.appendChild(commentCell);

            const partsUsedCell = document.createElement('td');
            partsUsedCell.textContent = job.partsUsed || 'No parts used';
            tr.appendChild(partsUsedCell);

            const timeSpentCell = document.createElement('td');
            const formattedTime = formatTime(job.hours || 0);
            timeSpentCell.textContent = formattedTime;
            tr.appendChild(timeSpentCell);

            jobsTable.appendChild(tr);

            totalTime += job.hours || 0;
        });

        jobsSection.appendChild(jobsTable);

        // Display total time and cost
        const totalTimeElement = document.createElement('p');
        totalTimeElement.classList.add('total-time');
        totalTimeElement.textContent = `Total Time Spent: ${formatTime(totalTime)}`;
        jobsSection.appendChild(totalTimeElement);

        if (costPerHour !== null && !isNaN(costPerHour) && costPerHour >= 0) {
            const totalHours = totalTime / 3600;
            const totalCost = totalHours * costPerHour;

            const totalCostElement = document.createElement('p');
            totalCostElement.classList.add('total-cost');
            totalCostElement.textContent = `Total Cost: $${totalCost.toFixed(2)}`;
            jobsSection.appendChild(totalCostElement);
        }
    } else {
        const noJobs = document.createElement('p');
        noJobs.textContent = 'No jobs assigned.';
        jobsSection.appendChild(noJobs);
    }

    container.appendChild(jobsSection);

    // Return the container
    return container;
}