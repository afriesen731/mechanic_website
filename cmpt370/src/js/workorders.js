import '../js/filter.js';
import '../js/table.js';
import PocketBase from 'pocketbase';
// PocketBase SDK initialization
const pb = new PocketBase('http://ddmpmc.duckdns.org:8090');




/**
 * Creates a table that can observe a FilteredDataset for work orders
 */
class OrderTable extends Table {
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
    buildRow(row) {
        const rowElement = document.createElement('tr');
        


        this.columns.forEach(column => {
            const cell = document.createElement('td');
            cell.textContent = row[column];
            rowElement.appendChild(cell);
        });
        
        return rowElement;
    }

}


document.addEventListener("DOMContentLoaded", async function() {
    const tableElement = document.getElementById('table');
    // TODO: set up table
    const authData = await pb.collection('users')
                                .authWithPassword('password', 'password');
    
    const columns = ['date_created', 'mechanics', 'licence', 'service_type', 'vehicle_type', 'status'];
    const table = new OrderTable(tableElement, columns);
    
    const filteredDataset = new FilteredDataset("work_orders", [table]);



});