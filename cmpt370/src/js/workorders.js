import { FilteredDataset, FilterElements, HasAnyFilter, SetFilter } from '../js/filter.js';
import { Table } from '../js/table.js';
import { WorkOrderServiceTypes, WorkOrderStatus } from '../js/pb_select_options';
import $ from 'jquery';

import { pb } from "../js/import_pb.js"
import { verify } from './redirect.js';



async function assignMechanic(workOrderId, mechanicId) {
    try {
        console.log("Assigning mechanic with workOrderId:", workOrderId, "and mechanicId:", mechanicId);

        // Fetch the current work order to get the existing list of mechanics
        const currentWorkOrder = await pb.collection('work_orders').getOne(workOrderId);

        // Append the new mechanicId to the existing mechanics array
        const updatedMechanics = currentWorkOrder.mechanics ? [...currentWorkOrder.mechanics, mechanicId] : [mechanicId];

        // Corrected payload with status set to "In Progress"
        const payload = {
            "mechanics": updatedMechanics, // Append the new mechanicId
            "status": "In Progress"       // Update status to "In Progress"
        };

        const response = await pb.collection('work_orders').update(workOrderId, payload);

        // alert('Mechanic assigned successfully!');
        await filteredDataset.update();
        // loadWorkOrders(); // Reload the table to reflect changes
    } catch (error) {
        console.error('Error assigning mechanic:', error);
        alert('There was an error assigning the mechanic. Please try again.');
    }
}



async function removeMechanic(workOrderId, mechanicId) {
    try {
        console.log("Removing mechanic with workOrderId:", workOrderId, "and mechanicId:", mechanicId);

        // Fetch the current work order to get the existing list of mechanics
        const currentWorkOrder = await pb.collection('work_orders').getOne(workOrderId);

        // Filter out the mechanicId to be removed
        const updatedMechanics = currentWorkOrder.mechanics.filter(id => id !== mechanicId);

        // Update the work order with the modified mechanics list
        const payload = {
            "mechanics": updatedMechanics
        };

        const response = await pb.collection('work_orders').update(workOrderId, payload);

        await filteredDataset.update();
    } catch (error) {
        console.error('Error removing mechanic:', error);
        alert('There was an error removing the mechanic. Please try again.');
    }
}






/**
 * Creates a table that can observe a FilteredDataset for work orders
 */
export class AdminOrderTable extends Table {
    /**
     * Creates an instance of Table.
     * @param {HTMLElement} table - The HTML element with the tag "table".
     * @param {Array<String>} columns - List of columns in the database to display, in the order they should be displayed.
     * @param {Array<Object>} users - List of user objects retrieved from the database, where each object contains user data.
     * @param {FilteredDataset} filteredDataset dataset the table is displaying
    */
    constructor(table, columns, users, filteredDataset) {
        super(table, columns);
        this.users = users;
        this.mechanicSelect = document.createElement('select');
        this.mechanicSelect.multiple = true;
        // build userOptions
        this.users.forEach(option => {
            const opt = document.createElement('option');
            opt.selected = false;
            opt.text = option.text || option;
            opt.value = option.value || option;
            this.mechanicSelect.appendChild(opt);
        });

        this.filteredDataset = filteredDataset
    }


    /**
     * Creates a row for the table
     * @param {Dictionary} row A row of a filtered dataset from the database.
     * @returns {HTMLElement} The 'td' element for a new row.
     */
    async buildRow(row) {
        const rowElement = document.createElement('tr');

        
        let i;
        for (i=0; i < this.columns.length; i++) {
            const column = this.columns[i];
            const cell = document.createElement('td');

            if (column === "mechanics") {
                if (row[column] && row[column].length > 0) {
                    cell.innerHTML = ''; // Clear existing content
                    
                    // Create and append mechanic names with remove buttons
                    row[column].forEach(mechId => {
                        const mechanic = this.users.find(user => user.value === mechId);
                        if (mechanic) {
                            // Create a container for the mechanic and the button
                            const mechanicContainer = document.createElement('div');
                            mechanicContainer.style.display = 'inline-flex';
                            mechanicContainer.style.alignItems = 'center';
                            mechanicContainer.style.marginRight = '5px';
        
                            // Create a span for the mechanic's name
                            const mechanicName = document.createElement('span');
                            mechanicName.textContent = mechanic.text;
        
                            // Create a small "x" button
                            const removeButton = document.createElement('button');
                            removeButton.textContent = 'x';
                            removeButton.style.marginLeft = '3px';
                            removeButton.style.fontSize = '0.8em';
                            removeButton.onclick = async () => {
                                await removeMechanic(row.id, mechId);
                            };
        
                            // Append the name and button to the container
                            mechanicContainer.appendChild(mechanicName);
                            mechanicContainer.appendChild(removeButton);
        
                            // Append the container to the cell
                            cell.appendChild(mechanicContainer);
                        }
                    });
                } else {
                    cell.textContent = "Not assigned";
                }


                




            } else if (column === "actions") {
                const mechanicSelect = this.mechanicSelect.cloneNode(true);
                
                // Initialize Select2 on the select element
                
                cell.appendChild(mechanicSelect);
                $(mechanicSelect).select2({
                    placeholder: 'Select Mechanic',
                });

                const assignButton = document.createElement('button');
                assignButton.classList = "action-btn";
                assignButton.textContent = "Assign";

                assignButton.onclick = async () => {
                    const selectedMechanicsId = $(mechanicSelect).val();
                    for (const selectedMechanicId of selectedMechanicsId) {
                        if (selectedMechanicId) {
                            await assignMechanic(row.id, selectedMechanicId);

                        } else {
                            alert("Please select a mechanic.");
                        }
                    }

                    this.filteredDataset.update()

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
     * @param {FilteredDataset} filteredDataset dataset the table is displaying
     *                                  In the order they should be displayed.
     */
    constructor(table, columns, filteredDataset) {
        super(table, columns);
        this.filteredDataset = filteredDataset;
    }


    /**
     * Creates a row for the table
     * @param {Dictionary} row A row of a filtered dataset from the database.
     * @returns {HTMLElement} The 'td' element for a new row.
     */
    async buildRow(row) {
        const rowElement = document.createElement('tr');
        
        let i;
        for (i=0; i < this.columns.length; i++) {
            const column = this.columns[i];
            const cell = document.createElement('td');

            if (column === "mechanics") {
                if (row[column] && row[column].length > 0) {
                    const mechanic = users.find(mech => mech.id === row[column][0]);
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
                    this.filteredDataset.update();
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


let users = null;

let userOptions = null;



document.addEventListener("DOMContentLoaded", async function() {


    
    // Set up page parameters
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    const type = params.get("type");
    const columns = ['created', 'mechanics', 'license_plate', 'type_of_service', 'model', 'status', 'actions'];
    let defaultMechanic = {};
    let defaultStatus= {};


    const users = await pb.collection('users').getFullList({
        fields: 'id, name'
    });

    
    const userOptions = users.map(user => ({
        text: user.name,
        value: user.id
    }));


    if (role == "admin") {
        verify("admin")
        table = new AdminOrderTable(tableElement, columns, userOptions, filteredDataset);
        
    }
    else if (role == "mechanic" || role == "viewer") {
        verify(["mechanic", "viewer"]);
        table = new EmployeeOrderTable(tableElement, columns, filteredDataset)
    }




    

    


    
    
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
  
