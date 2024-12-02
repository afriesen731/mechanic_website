



/**
 * Creates a table that can observe a FilteredDataset.
 */
export class Table {
    /**
     * Createst an instance of Table.
     * @param {HTMLElement} table html element with tag "table".
     * @param {Array<String>} columns List of columns in the database to display. 
     *                                  In the order they should be displayed.
     */
    constructor(table, columns) {
        this.columns = columns;
        this.table = table;
    }


    /**
     * Updates the contents of the table.
     * @param {FilteredDataset} dataset A dataset containing all of the information for the table.
     */
    async update(dataset) {
        let i;
        let tbody = document.createElement('tbody');
        
        // build the table row by row
        for (i=0; i < dataset.items.length; i++) {
            tbody.appendChild(
                await this.buildRow(dataset.items[i], this.columns),
                tbody.firstChild
            );
        }

        // remove the old table body if it exists
        if (this.table.querySelector('tbody') != null) {
            this.table.removeChild(
                this.table.querySelector('tbody')
            );
        }

        this.table.appendChild(tbody);


    }

    /**
     * Creates a row for the table
     * @param {Dictionary} row A row of a filtered dataset from the database.
     * @returns {HTMLElement} The 'td' element for a new row.
     */
    async buildRow(row={}) {
        return new HTMLElement();
    }



    



}





