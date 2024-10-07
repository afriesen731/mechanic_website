import PocketBase from 'pocketbase';
// PocketBase SDK initialization
const pb = new PocketBase('http://ddmpmc.duckdns.org:8090');

const table = document.getElementById('table');
const DEFAULT_PAGE_LEN = 50;





class SetFilter {
    constructor(column, isFiltered=false, set=[]) {
        this.column = column;
        this.isFiltered = isFiltered;
        this.set = set;
        
    }


    this

}

class RangeFilter {
    constructor(column, isFiltered=false, start=null, end=null) {
        this.column = column;
        this.isFiltered = isFiltered;
        this.start = start;
        this.end = end;
    }
}



class FilteredDataset {
    constructor(dataset) {        
        this.dataset = dataset;
        this.pageLen = DEFAULT_PAGE_LEN;
        this._page = 1;
        this.totalPages = 0;
        this.items = null;
        this.filters = [];
    }

    addSetFilter(column, isSet=false, set=[]) {
        let newfilter = new SetFilter(column, isSet, set);
        this.filters.push(newfilter);

    }

    addRangeFilter(column, isSet=false, start=null, end=null) {
        let newfilter = new RangeFilter(column, isSet, start, end);
        this.filters.push(newfilter);
        
    }


    getfilter(column) {
        this.filters.forEach(filter => {
            if (filter.column == column) {
                return filter;
            }


        });

        return null
    }



    async update() {
        
        let filter = this.getFilters();
        
        try {

            // fetch dataset
            const response = await pb.collection('work_orders').getList(this._page, this.pageLen, {
                filter: filter
            });
            this.items = response.items;

            // update the total page number
            this.totalPages = Math.ceil(response.totalItems / this.pageLen);
        } 
        catch (error) {
            console.error('Error fetching work orders:', error);
        }

    }


    getFilters() {
        let result = [];

        // combine each of the filters into a string
        this.filters.forEach(filter => {
            if (filter.isFiltered) {

                // create filter for set filter
                if (filter instanceof SetFilter) {
                    
                    let setValues = Object.values(filter.set)
                                    .map(value => `"${value}"`).join(',');
                    result.push(`${filter.column} IN [${setValues}]`);
                }

                // create filter for range filter
                else if (filter instanceof RangeFilter) {
                    if (filter.start !== null && filter.end !== null) {
                        result.push(`${filter.column} >= ${filter.start} AND ${filter.name} <= ${filter.end}`);
                    } 
                    else if (filter.start !== null) {
                        result.push(`${filter.column} >= ${filter.start}`);
                    } 
                    else if (filter.end !== null) {
                        result.push(`${filter.column} <= ${filter.end}`);
                    }
                }
            }



        });

        // return the filter as a string
        if ( result.length > 0 ) {
            result = '';
        }
        else {
            result = result.join(' AND ');
        }
        
        return result;


    }



    nextPage() {
        // check if page number is too large
        if (this._page >= this.totalPages) {
            return;
        }
        this._page++;
        this.update();
    }

    prevPage() {
        // check if page number is too small
        if (this._page <= 1) {
            return;
        }
        this._page--;
        this.update();
    }

    setPage(pageNumber) {
        // check if page number is in proper range
        if (pageNumber < 1 && pageNumber >= this.totalPages) {
            return;
        }
        this._page = pageNumber;
        this.update();
    }

}

function addRow(date, mechanics, license, serviceType, status) {

    const row = document.createElement('tr');
    

    [date, mechanics, license, serviceType, status].forEach(text => {
        const cell = document.createElement('td');
        cell.textContent = text;
        row.appendChild(cell);
    });

    table.querySelector('tbody').appendChild(row);
}


document.addEventListener("DOMContentLoaded", async function() {

    // TODO: set up table

    const authData = await pb.collection('users')
                                .authWithPassword('password', 'password');
    console.log(authData);
    let tableData = new FilteredDataset('work_orders');
    await tableData.update();
    console.log("first page:");
    console.log(tableData.items);

    tableData.getfilter("unit_number").set.append("11111");
    tableData.update();
    console.log("unit number: 11111");
    console.log(tableData.items);



});

