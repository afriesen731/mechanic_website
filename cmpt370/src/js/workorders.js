import { FilteredDataset, FilterElements, HasAnyFilter, SetFilter } from '../js/filter.js';
import { Table } from '../js/table.js';
import PocketBase from 'pocketbase';
import { WorkOrderServiceTypes, WorkOrderStatus } from '../js/pb_select_options';
import Pagination from 'pagination-js';

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

function loadDataForPage(pageNumber, pageSize, dataset) {
    dataset.pageLen = pageSize;
    dataset.setPage(pageNumber);
}





document.addEventListener("DOMContentLoaded", async function() {
    const tableElement = document.getElementById('table');
    const employeeSelect = document.getElementById('employee-select');
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    const statusSelect = document.getElementById('status-select');
    const serviceSelect = document.getElementById('service-select')
    const authData = await pb.collection('users')
                                .authWithPassword('password', 'password');

    
    
    const columns = ['created', 'mechanics', 'license_plate', 'type_of_service', 'model', 'status'];
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

    await filteredDataset.updatePageCount()
    const pagination = new Pagination({
        totalNumber: filteredDataset.totalItems,        
        pageSize: filteredDataset.pageLen,
        showSizeChanger: true,
        container: "#page-select",
        callback: function(data, pagination) {
        
            loadDataForPage(pagination.pageNumber, pagination.pageSize, filteredDataset);
        }
    });

    
    filteredDataset.update();

    
    

});


