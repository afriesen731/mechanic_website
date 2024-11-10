import { FilteredDataset, FilterElements, HasAnyFilter, SetFilter } from '../js/filter.js';
import { Table } from '../js/table.js';
import { WorkOrderServiceTypes, WorkOrderStatus } from '../js/pb_select_options';
import $ from 'jquery';

import { pb } from "../js/import_pb.js"
import { verify } from './redirect.js';



async function assignMechanic(workOrderId, mechanicId) {
    try {
        console.log("Assigning mechanic with workOrderId:", workOrderId, "and mechanicId:", mechanicId);

        // Corrected payload with status set to "In Progress"
        const payload = {
            "mechanics": [mechanicId], // Wrap mechanicId in an array
            "status": "In Progress"    // Update status to "In Progress"
        };
        const response = await pb.collection('work_orders').update(workOrderId, payload);
        
        alert('Mechanic assigned successfully!');
        await filteredDataset.update();
        // loadWorkOrders(); // Reload the table to reflect changes
    } catch (error) {
        console.error('Error assigning mechanic:', error);
        alert('There was an error assigning the mechanic. Please try again.');
    }
}


let cachedMechanics = null;

async function loadMechanics() {
    if (cachedMechanics) {
        return cachedMechanics;
    }

    try {
        const mechanics = await pb.collection('users').getFullList({
            filter: 'role="mechanic"',
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
export class AdminOrderTable extends Table {
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
                if (row[column] && row[column].length > 0) {
                    const mechanic = mechanics.find(mech => mech.id === row[column][0]);
                    cell.textContent = mechanic ? mechanic.name : "Not assigned";
                } else {
                    cell.textContent = "Not assigned";
                }
            } else if (column === "actions") {
                const mechanicSelect = document.createElement('select');
                mechanicSelect.innerHTML = `<option value="">Select Mechanic</option>`;
    
                mechanics.forEach(mechanic => {
                    const option = document.createElement('option');
                    option.value = mechanic.id;
                    option.textContent = mechanic.name;
                    mechanicSelect.appendChild(option);
                });
                
                const assignButton = document.createElement('button');
                assignButton.textContent = "Assign";
                assignButton.onclick = async () => {
                    if (mechanicSelect.value) {
                        await assignMechanic(row.id, mechanicSelect.value);
                    } else {
                        alert("Please select a mechanic.");
                    }
                };



                // View Button
                const viewButton = document.createElement('button');
                viewButton.textContent = "View";
                viewButton.classList = "action-btn";
                viewButton.onclick = async () => {
                    const iframe = parent.document.getElementById("view-order-iframe");
                    const scrollPosition = parent.window.pageYOffset || parent.document.documentElement.scrollTop || parent.document.body.scrollTop;

                    iframe.src = `../html/view_order.html?order=${row.id}&prevFrame=${window.frameElement.parentNode.id}&prevScroll=${scrollPosition}`;
                    parent.showIframe("iframe-container-view-order");
                };

                // Append elements to actions cell
                cell.appendChild(mechanicSelect);
                cell.appendChild(assignButton);
                cell.appendChild(viewButton);
            } else {
                // Default case for other columns
                cell.textContent = row[column];

            }

            rowElement.appendChild(cell);
        }

        return rowElement;
    }

}

/**
 * Creates a table that can observe a FilteredDataset for work orders
 */
export class EmployeeOrderTable extends Table {
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
                if (row[column] && row[column].length > 0) {
                    const mechanic = mechanics.find(mech => mech.id === row[column][0]);
                    cell.textContent = mechanic ? mechanic.name : "Not assigned";
                } else {
                    cell.textContent = "Not assigned";
                }
            } else if (column === "actions") {
                
                const joinButton = document.createElement('button');
                joinButton.textContent = "Join";
                joinButton.onclick = async () => {
                    if (mechanicSelect.value) {
                        await assignMechanic(row.id, pb.authStore.model.id);
                    }
                };

                // Append elements to actions cell
                cell.appendChild(joinButton);
            } else {
                // Default case for other columns
                cell.textContent = row[column];

            }

            rowElement.appendChild(cell);
        }

        return rowElement;
    }

}










const tableElement = document.getElementById('table');
const employeeSelect = document.getElementById('employee-select');
const startDate = document.getElementById('start-date');
const endDate = document.getElementById('end-date');
const statusSelect = document.getElementById('status-select');
const serviceSelect = document.getElementById('service-select');
const pageSelect = document.getElementById('page-select');
const pageLenSelector = document.getElementById('page-len-selector');
let table = null;
let filteredDataset = null;
let filterElements = null;



document.addEventListener("DOMContentLoaded", async function() {


    
    // Set up page parameters
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    const type = params.get("type");
    const columns = ['created', 'mechanics', 'license_plate', 'type_of_service', 'model', 'status', 'actions'];
    let defaultMechanic = {};
    let defaultStatus= {};

    if (role == "admin") {
        verify("admin")
        table = new AdminOrderTable(tableElement, columns);
        
    }
    else if (role == "mechanic" || role == "viewer") {
        verify(["mechanic", "viewer"]);
        table = new EmployeeOrderTable(tableElement, columns)
    }



    
    

    
    const users = await pb.collection('users').getFullList({
        fields: 'id, name'
    });

    const userOptions = users.map(user => ({
        text: user.name,
        value: user.id
    }));

    
    
    filteredDataset = new FilteredDataset('work_orders', [table]);
    
    filterElements = new FilterElements(filteredDataset);
    filterElements.initDateSelector(startDate, endDate, 'created');
    


    // set default values for select2
    if (type == "in_progress") {
        defaultStatus = ["In Progress"];
    }


    
    filterElements.initSelect2Filter(
                                        employeeSelect, 'mechanics', 
                                        userOptions, 'Select Mechanics', 
                                        HasAnyFilter, defaultMechanic
                                    );
    filterElements.initSelect2Filter(
                                    statusSelect, 'status', 
                                    WorkOrderStatus, 'Select Order Status', 
                                    SetFilter, defaultStatus
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
  
