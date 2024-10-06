import PocketBase from 'pocketbase';
// PocketBase SDK initialization
const pb = new PocketBase('http://ddmpmc.duckdns.org:8090');



const table = document.getElementById('table');






class SetFilter {
    constructor(isFiltered=false, set={}) {
        this.isFiltered = isFiltered;
        this.set = set;
        
    }

}

class RangeFilter {
    constructor(isFiltered=false, start=null, end=NULL) {
        this.isFiltered = isFiltered;
        this.start = start;
        this.end = end;
    }
}



class Table {
    constructor() {
        this.page = 1;
        this.pageLen = 50;
        // TODO: find out how many pages there are and dont allow to go max page len
        this.totalPages = 0;
        this.date = new RangeFilter();
        this.mechanics = new SetFilter();
        this.license = new SetFilter();
        this.serviceType = new SetFilter();
        this.status = new SetFilter();
        this.items = NULL;
        this.update();
    }

    update() {
        

        let result = pb.collections('work_orders').getList(this.page, this.pageLen, {
            
            // TODO: make it so that it adds the filters
            filter: filter

        }).then(response => {
            this.items = response.items;

        }).catch(error => {
            console.error('Error fetching work orders:', error);

        });

    }



    // TODO: add paging functions
    nextPage() {

    }

    prevPage() {

    }

    setPage(pageNumber) {

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


document.addEventListener("DOMContentLoaded", function() {

    // TODO: set up table


}

