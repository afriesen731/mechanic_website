import { pb } from "../js/import_pb.js";

async function loadInProgressWorkOrders() {
    try {
        console.log("Fetching in-progress work orders...");

        // Fetch in-progress work orders with 'mechanics' expanded
        const workOrders = await pb.collection('work_orders').getFullList({
            filter: 'status="In Progress"',
            expand: 'mechanics',
        });

        console.log("Fetched work orders:", workOrders);

        // Check if table body exists
        const tableBody = document.getElementById('inProgressTable').querySelector('tbody');
        if (!tableBody) {
            console.error("Table body not found. Ensure the table ID 'inProgressTable' is correct.");
            return;
        }

        tableBody.innerHTML = ''; // Clear existing rows

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
            if (order.expand && order.expand.mechanics && order.expand.mechanics.length > 0) {
                mechanicCell.textContent = order.expand.mechanics.map(mechanic => mechanic.name).join(', ');
            } else {
                mechanicCell.textContent = "Not assigned";
            }
            row.appendChild(mechanicCell);

            // Service Type
            const serviceTypeCell = document.createElement('td');
            serviceTypeCell.textContent = Array.isArray(order.type_of_service) ? order.type_of_service.join(', ') : 'N/A';
            row.appendChild(serviceTypeCell);

            // Status
            const statusCell = document.createElement('td');
            statusCell.textContent = order.status || 'N/A';
            row.appendChild(statusCell);

            tableBody.appendChild(row);
        });

        console.log("In-progress work orders loaded successfully.");

    } catch (error) {
        console.error("Error loading in-progress work orders:", error);
    }
}

// Load the data when the page is loaded
document.addEventListener("DOMContentLoaded", loadInProgressWorkOrders);