import { pb } from "../js/import_pb.js";


// Function to open the modal with work order details
function openModal(content) {
    document.getElementById('modal-content').innerText = content;
    document.getElementById('modal').style.display = 'flex';
}

// Function to close the modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}





/*

async function loadInProgressWorkOrders() {
    try {
        const workOrders = await pb.collection('work_orders').getFullList({
            filter: 'status="In Progress"',
            expand: 'mechanics'
        });

        const tableBody = document.getElementById('inProgressTable').querySelector('tbody');
        tableBody.innerHTML = '';

        workOrders.forEach(order => {
            const row = document.createElement('tr');

            // Work Order Number
            const workOrderCell = document.createElement('td');
            workOrderCell.textContent = order.work_order_number || 'N/A';
            row.appendChild(workOrderCell);

            // Unit Number
            const unitCell = document.createElement('td');
            unitCell.textContent = order.unit_number || 'N/A';
            row.appendChild(unitCell);

            // Mechanic(s)
            const mechanicCell = document.createElement('td');
            if (order.expand && order.expand.mechanics) {
                mechanicCell.textContent = order.expand.mechanics.map(mechanic => mechanic.name).join(', ');
            } else {
                mechanicCell.textContent = "Not assigned";
            }
            row.appendChild(mechanicCell);

            // Service Type
            const serviceTypeCell = document.createElement('td');
            serviceTypeCell.textContent = order.type_of_service.join(', ');
            row.appendChild(serviceTypeCell);

            // Status
            const statusCell = document.createElement('td');
            statusCell.textContent = order.status;
            row.appendChild(statusCell);

            // Actions - View Button
            const actionsCell = document.createElement('td');
            const viewButton = document.createElement('button');
            viewButton.textContent = 'View';
            viewButton.onclick = () => openModal(`
                Work Order #: ${order.work_order_number || 'N/A'}\n
                Unit #: ${order.unit_number || 'N/A'}\n
                Mechanic: ${order.expand?.mechanics?.map(m => m.name).join(', ') || 'Not assigned'}\n
                Service Type: ${order.type_of_service.join(', ')}\n
                Status: ${order.status}
            `);
            actionsCell.appendChild(viewButton);
            row.appendChild(actionsCell);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading in-progress work orders:", error);
    }
}
*/











document.addEventListener("DOMContentLoaded", loadInProgressWorkOrders);