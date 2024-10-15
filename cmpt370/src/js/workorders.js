import { FilteredDataset, FilterElements } from '../js/filter.js';
import { Table } from '../js/table.js';
import PocketBase from 'pocketbase';


// PocketBase SDK initialization
const pb = new PocketBase('http://ddmpmc.duckdns.org:8090');




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
    const employeeSelect = document.getElementById("employee-select");
    const employeeSelectForm = document.getElementById("employee-select-form");
    // TODO: set up table
    const authData = await pb.collection('users')
                                .authWithPassword('password', 'password');
    
    const columns = ['created', 'mechanics', 'license_plate', 'type_of_service', 'model', 'status'];
    const table = new OrderTable(tableElement, columns);
    
    const filteredDataset = new FilteredDataset("work_orders", [table]);
    
    const filterElements = new FilterElements(filteredDataset);
    filterElements.initMechanicSelector(employeeSelect, "mechanics");
    filteredDataset.update();


    

});


