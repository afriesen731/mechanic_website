import html2pdf from "html2pdf.js";

/**
 * Download a dom element as a file 
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
    }
    else {
        html2pdf().set(options).from(element).save();

    }
    
}


export function displayOrder(order) {
    // Clear the parent element


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

    if (order.jobs && Object.keys(order.jobs).length > 0) {
        const jobsList = document.createElement('ul');

        order.jobs.forEach(job => {
            const jobItem = document.createElement('li');
            jobItem.innerHTML = `<strong>${job.title || 'Job'}:</strong> ${job.description || 'No description provided'}`;
            jobsList.appendChild(jobItem);
        });

        jobsSection.appendChild(jobsList);
    } else {
        const noJobs = document.createElement('p');
        noJobs.textContent = 'No jobs assigned.';
        jobsSection.appendChild(noJobs);
    }

    container.appendChild(jobsSection);

    // Append the container to the parent element
    return container;
}
