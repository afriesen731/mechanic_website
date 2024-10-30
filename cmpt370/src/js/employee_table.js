import { FilteredDataset, FilterElements, HasAnyFilter, SetFilter } from '../js/filter.js';
import { Table } from '../js/table.js';
import { WorkOrderServiceTypes, WorkOrderStatus } from '../js/pb_select_options';
import $ from 'jquery';

import { pb } from "../js/import_pb.js"


/**
 * Creates a table that can observe a FilteredDataset for employees
 */
export class EmployeeTable extends Table {
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
        


        let i;
        for (i=0; i < this.columns.length; i++) {
            let column = this.columns[i];
            let cell = document.createElement('td');
            if (column == "mechanics") {
                if (row[column].length != 0) {
                    const name = await pb.collection('users').getOne(row[column], {
                        fields: 'name'
                    });
                    cell.textContent = name['name'];
                }
                
            }
            else if (column == "actions") {
                const removeButton = document.createElement('button');
                removeButton.textContent = "Edit";
                removeButton.classList = "action-btn";
                cell.appendChild(removeButton);
            }
            else {
                cell.textContent = row[column];
                
            }

            rowElement.appendChild(cell);


        };
        
        return rowElement;
    }

}



document.addEventListener("DOMContentLoaded", async function() {
    const tableElement = document.getElementById('table');
    const employeeSelect = document.getElementById('employee-select');
    const pageSelect = document.getElementById('page-select');
    const pageLenSelector = document.getElementById('page-len-selector');

    
    
    const columns = ['name', 'id', 'created', 'username', 'actions'];
    const users = await pb.collection('users').getFullList({
        fields: 'id, name'
    });

    const userOptions = users.map(user => ({
        text: user.name,
        value: user.id
    }));

    const table = new EmployeeTable(tableElement, columns);
    
    const filteredDataset = new FilteredDataset('users', [table]);
    
    const filterElements = new FilterElements(filteredDataset);
    // filterElements.initDateSelector(startDate, endDate, 'created');
    // filterElements.initStatusSelector(statusSelect, 'status');
    
    filterElements.initSelect2Filter(
                                        employeeSelect, 'id', 
                                        userOptions, 'Search', 
                                        SetFilter
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
  
