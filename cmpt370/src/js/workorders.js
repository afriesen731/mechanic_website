import { FilteredDataset, FilterElements, HasAnyFilter, SetFilter } from '../js/filter.js';
import { Table } from '../js/table.js';
import { WorkOrderServiceTypes, WorkOrderStatus } from '../js/pb_select_options';
import $ from 'jquery';

import { pb } from "../js/import_pb.js"



// Function to assign a mechanic to a work order
async function assignMechanic(workOrderId, mechanicId) {
    try {
        await pb.collection('work_orders').update(workOrderId, {
            mechanics: [mechanicId], // Adds the mechanic to the work order
            status: "Active"         // Sets the status to Active
        });
        alert('Mechanic assigned successfully!');
        loadWorkOrders(); // Reload the table to reflect changes
    } catch (error) {
        console.error('Error assigning mechanic:', error);
        alert('There was an error assigning the mechanic. Please try again.');
    }
}
// Cached mechanics list
let cachedMechanics = null;

async function loadMechanics() {
    if (cachedMechanics) return cachedMechanics; // Return cached data if available
    try {
        const mechanics = await pb.collection('users').getFullList({
            filter: 'role="Mechanic"',
            fields: 'id, name'
        });
        cachedMechanics = mechanics;
        return mechanics;
    } catch (error) {
        console.error('Error loading mechanics:', error);
        alert('Failed to load mechanics. Check console for details.');
        return [];
    }
}




/**
 * Creates a table that can observe a FilteredDataset for work orders
 */
export class OrderTable extends Table {
    /**
     * Createst an instance of Table.
     * @param {HTMLElement} table html element with tag "table".
     * @param {Array<String>} columns List of columns in the database to display. 
     *                                  In the order they should be displayed.
     */
    constructor(table, columns) {
        super(table, columns);
    }


    /**
     * Creates a row for the table
     * @param {Dictionary} row A row of a filtered dataset from the database.
     * @returns {HTMLElement} The 'td' element for a new row.
     */
    async buildRow(row) {
        const rowElement = document.createElement('tr');
        const mechanics = await loadMechanics();
        
        let i;
        for (i=0; i < this.columns.length; i++) {
            const column = this.columns[i];
            const cell = document.createElement('td');
            if (column === "mechanics") {
                // Display assigned mechanic or "Not assigned"
                if (row[column] && row[column].length > 0) {
                    const assignedMechanic = await pb.collection('users').getOne(row[column][0], { fields: 'name' });
                    cell.textContent = assignedMechanic.name;
                } else {
                    cell.textContent = "Not assigned";
                }
            } else if (column === "actions") {
                // Mechanic Dropdown for assignment
                const mechanicSelect = document.createElement('select');
                mechanicSelect.innerHTML = `<option value="">Select Mechanic</option>`;
                
                mechanics.forEach(mechanic => {
                    const option = document.createElement('option');
                    option.value = mechanic.id;
                    option.textContent = mechanic.name;
                    mechanicSelect.appendChild(option);
                });

                // Assign Button
                const assignButton = document.createElement('button');
                assignButton.textContent = "Assign";
                assignButton.onclick = async () => {
                    if (mechanicSelect.value) {
                        await assignMechanic(row.id, mechanicSelect.value);
                    } else {
                        alert("Please select a mechanic.");
                    }
                };

                // Remove Button
                const removeButton = document.createElement('button');
                removeButton.textContent = "Remove";
                removeButton.classList = "action-btn";
                removeButton.onclick = async () => {
                    // Here, add your logic for removing the work order or mechanic assignment
                    alert('Remove functionality not yet implemented.');
                };

                // Append elements to actions cell
                cell.appendChild(mechanicSelect);
                cell.appendChild(assignButton);
                cell.appendChild(removeButton);
            } else {
                // Default case for other columns
                cell.textContent = row[column];

            }

            rowElement.appendChild(cell);
        }

        return rowElement;
    }

}







document.addEventListener("DOMContentLoaded", async function() {
    const tableElement = document.getElementById('table');
    const employeeSelect = document.getElementById('employee-select');
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    const statusSelect = document.getElementById('status-select');
    const serviceSelect = document.getElementById('service-select');
    const pageSelect = document.getElementById('page-select');
    const pageLenSelector = document.getElementById('page-len-selector');

    
    
    const columns = ['created', 'mechanics', 'license_plate', 'type_of_service', 'model', 'status', 'actions'];
    

    
    const users = await pb.collection('users').getFullList({
        fields: 'id, name'
    });

    const userOptions = users.map(user => ({
        text: user.name,
        value: user.id
    }));

    const table = new OrderTable(tableElement, columns);
    
    const filteredDataset = new FilteredDataset('work_orders', [table]);
    
    const filterElements = new FilterElements(filteredDataset);
    filterElements.initDateSelector(startDate, endDate, 'created');
    // filterElements.initStatusSelector(statusSelect, 'status');
    
    filterElements.initSelect2Filter(
                                        employeeSelect, 'mechanics', 
                                        userOptions, 'Select Mechanics', 
                                        HasAnyFilter
                                    );
    filterElements.initSelect2Filter(
                                    statusSelect, 'status', 
                                    WorkOrderStatus, 'Select Order Status', 
                                    SetFilter
                                );

    filterElements.initSelect2Filter(
                                        serviceSelect, 'type_of_service', 
                                        WorkOrderServiceTypes, 'Select Service Types', 
                                        HasAnyFilter
                                    );


    filterElements.initPageLenSelect(pageLenSelector)

    
    filteredDataset.update();

    // impliment pagination
    filterElements.initPagination(pageSelect);
    
    
    

});


// Detect resizing of the body or main content and send the height to the parent
const resizeObserver = new ResizeObserver(() => {
    const height = document.documentElement.scrollHeight;
    window.parent.postMessage({ height }, '*');
  });
  
  // Observe the body or main content area
  resizeObserver.observe(document.body);
  
