import PocketBase from 'pocketbase';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import select2 from 'select2';
select2();

// PocketBase SDK initialization
const pb = new PocketBase('http://ddmpmc.duckdns.org:8090');

const DEFAULT_PAGE_LEN = 50;






/**
 * Base class for filters.
*/
class Filter {
    constructor() {
        
    }

    /**
     * Formats the value for filtering based on its type.
     * @param {any} item - The item to format.
     * @returns {string} The formatted value.
    */
    formatValue(item) {
        if (item == null) {
            return null
        }
        else if (this.isNumber) {
            return `${item}`;
        }
        else {
            return `'${item}'`;
        }
    }
}



/**
 * A filter that includes all values that are in this filter's set.
 * @extends Filter
*/
class SetFilter extends Filter {
    /**
     * Creates an instance of SetFilter.
     * @param {string} column - The column to filter on.
     * @param {boolean} isNumber - Indicates if the column value is a number.
     * @param {Array} [set=[]] - The set of values for the filter.
     * @param {boolean} [isFiltered=true] - Indicates if the filter is active.
    */
    constructor(column, isNumber, set=[], isFiltered=true) {
        super();
        this.column = column;
        this.isFiltered = isFiltered;
        this.isNumber = isNumber;
        this._set = set;
    }


    /**
     * Adds an item to the filter set.
     * @param {any} item - The item to add.
    */
    push(item) {
        this.set.push(item);
        this.set = this.set;    // update set
    }


    /**
     * Removes an item from the filter set.
     * @param {any} item - The item to remove.
    */
    remove(item) {
        this.set.splice(this.set.findIndex(item), 1);
        this.set = this.set;    // update set
    }

    /**
     * Constructs the filter string for querying.
     * @returns {string} The constructed filter string.
    */
    getFilter() {
        if (!this.isFiltered || this.set.length == 0) {
            return "";
        }
        
        let result = Object.values(this.set)
                        .map(value => `${this.column} = ${this.formatValue(value)}`)
                        .join(' || ');
        return result;
    }


    set set(list) {
        this._set = list;
        this.isFiltered = true;
    }


    get set() {
        return this._set;
    }




}


/**
 * A filter that includes values within a specific range.
 * @extends Filter
*/
class RangeFilter extends Filter {


    /**
     * Creates an instance of RangeFilter.
     * @param {string} column - The column to filter on.
     * @param {boolean} isNumber - Indicates if the column value is a number.
     * @param {any} [start=null] - The start value of the range.
     * @param {any} [end=null] - The end value of the range.
     * @param {boolean} [isFiltered=true] - Indicates if the filter is active.
    */
    constructor(column, isNumber, start=null, end=null, isFiltered=true) {
        super();
        this.column = column;
        this.isFiltered = isFiltered;
        this.isNumber = isNumber;
        this.start = start;
        this.end = end;
    }

    /**
     * Constructs the filter string for querying.
     * @returns {string} The constructed filter string.
    */
    getFilter() {
        if (!this.isFiltered) {
            return "";
        }
        let result;
        if (this.start !== null && this.end !== null) {
            result = `${this.column} >= ${this.start} && ${this.column} <= ${this.end}`;
        } 
        else if (this.start !== null) {
            result = `${this.column} >= ${this.start}`;
        } 
        else if (this.end !== null) {
            result = `${this.column} <= ${this.end}`;
        }
        return result;
    }


    set start(value) {

        this._start = this.formatValue(value);
        this.isFiltered = true;

        
    }

    set end(value) {
        
        this._end = this.formatValue(value);

        this.isFiltered = true;
        
    }

    get start() {
        return this._start;
    }

    get end() {
        return this._end;
    }


}



/**
 * A filter for a column that contains a set of values. it checks if any of 
 * the values in this filter's set are present.
 * @extends SetFilter
*/
class HasAnyFilter extends SetFilter {
    /**
     * Creates an instance of HasAnyFilter.
     * @param {string} column - The column to filter on.
     * @param {boolean} isNumber - Indicates if the column value is a number.
     * @param {Array} [set=[]] - The set of values for the filter.
     * @param {boolean} [isFiltered=true] - Indicates if the filter is active.
    */
    constructor(column, isNumber, set=[], isFiltered=true) {
        super(column, isNumber, set, isFiltered);
    }

    /**
     * Constructs the filter string for querying.
     * @returns {string} The constructed filter string.
    */
    getFilter() {
        if (!this.isFiltered || this.set.length == 0) {
            return "";
        }
        const result = this._set
            .map(item => `${this.column} ~ ${this.formatValue(item)}`)
            .join(' || ');
        return result;
    }
}


/**
 * A filter for a column that contains a set of values. 
 * The set can include more values than in the set.
 * @extends SetFilter
*/
class ContainsAllFilter extends SetFilter {
    /**
     * Creates an instance of ContainsAllFilter.
     * @param {string} column - The column to filter on.
     * @param {boolean} isNumber - Indicates if the column value is a number.
     * @param {Array} [set=[]] - The set of values for the filter.
     * @param {boolean} [isFiltered=true] - Indicates if the filter is active.
    */
    constructor(column, isNumber, set=[], isFiltered=true) {
        super(column, isNumber, set, isFiltered);
    }

    /**
     * Constructs the filter string for querying.
     * @returns {string} The constructed filter string.
    */
    getFilter() {
        if (!this.isFiltered || this.set.length == 0) {
            return "";
        }
        const result = this._set
            .map(item => `${this.column} ~ ${this.formatValue(item)}`)
            .join(' && ');
        return result;
    }
}

/**
 * A filter for a column that contains a set of values. It checks if the column
 * is identical to the set in the filter.
 * @extends SetFilter
*/
class EqualSetsFilter extends SetFilter {
    /**
     * Creates an instance of EqualSetsFilter.
     * @param {string} column - The column to filter on.
     * @param {boolean} isNumber - Indicates if the column value is a number.
     * @param {Array} [set=[]] - The set of values for the filter.
     * @param {boolean} [isFiltered=true] - Indicates if the filter is active.
    */
    constructor(column, isNumber, set=[], isFiltered=true) {
        super(column, isNumber, set, isFiltered);
    }

    /**
     * Constructs the filter string for querying.
     * @returns {string} The constructed filter string.
    */
    getFilter() {
        if (!this.isFiltered || this.set.length == 0) {
            return "";
        }
        // Return a filter string for exact match condition
        const conditions = this._set
            .map(item => `${this.column} ~ ${this.formatValue(item)}`)
            .join(' && ');
        return `(${conditions}) && ${this.column}:length = ${this._set.length}`;
    }
}





/**
 * Represents a filtered dataset that manages data and its filters.
*/
export class FilteredDataset {
    /**
     * Creates an instance of FilteredDataset.
     * @param {string} dataset - The name of the dataset.
     * @param {Array} [observers=[]] - The observers to notify on data changes.
    */
    constructor(dataset, observers=[]) {        
        this.dataset = dataset;
        this.pageLen = DEFAULT_PAGE_LEN;
        this._page = 1;
        this.totalPages = 0;
        this.items = null;
        this.filters = [];
        this.observers = observers;
    }


    /**
     * Adds a SetFilter to the dataset.
     * A SetFilter includes all values that are in this filter's set.
     * 
     * @param {string} column - The column to filter on.
     * @param {boolean} isNumber - Indicates if the column value is a number.
     * @param {Array} [set=[]] - The set of values for the filter.
     * @param {boolean} [isFiltered=true] - Indicates if the filter is active.
    */
    addSetFilter(column, isNumber, set=[], isFiltered=true) {
        let newFilter = new SetFilter(column, isNumber, set, isFiltered);
        this.filters.push(newFilter);

    }



    /**
     * Adds a RangeFilter to the dataset.
     * A RangeFilter includes values within a specific range.
     * 
     * @param {string} column - The column to filter on.
     * @param {boolean} isNumber - Indicates if the column value is a number.
     * @param {Array} [set=[]] - The set of values for the filter.
     * @param {boolean} [isFiltered=true] - Indicates if the filter is active.
    */
    addRangeFilter(column, isNumber, start=null, end=null, isFiltered=true) {
        let newFilter = new RangeFilter(column, isNumber, start, end, isFiltered);
        this.filters.push(newFilter);
        
    }

    /**
     * Adds a HasAnyFilter to the dataset.
     * A HasAnyFilter is a filter for a column that contains a set of values. 
     * It checks if any of the values in this filter's set are present.
     * @param {string} column - The column to filter on.
     * @param {boolean} isNumber - Indicates if the column value is a number.
     * @param {Array} [set=[]] - The set of values for the filter.
     * @param {boolean} [isFiltered=true] - Indicates if the filter is active.
    */
    addHasAnyFilter(column, isNumber, set=[], isFiltered=true) {
        let newFilter = new HasAnyFilter(column, isNumber, set, isFiltered);
        this.filters.push(newFilter);
    }

    /**
     * Adds a ContainsAllFilter to the dataset.
     * A ContainsAllFilter is a filter for a column that contains a set of values. 
     * It checks if the column includes all of the values in the filter. 
     * The column can contain more values than in the filter.
     * @param {string} column - The column to filter on.
     * @param {boolean} isNumber - Indicates if the column value is a number.
     * @param {Array} [set=[]] - The set of values for the filter.
     * @param {boolean} [isFiltered=true] - Indicates if the filter is active.
    */
    addContainsAllFilter(column, isNumber, set=[], isFiltered=true) {
        let newFilter = new ContainsAllFilter(column, isNumber, set, isFiltered);
        this.filters.push(newFilter);
    }

    /**
     * Adds a EqualSetsFilter to the dataset.
     * A EqualSetsFilter is a filter for a column that contains a set of values. 
     * It checks if the column is identical to the set in the filter.
     * @param {string} column - The column to filter on.
     * @param {boolean} isNumber - Indicates if the column value is a number.
     * @param {Array} [set=[]] - The set of values for the filter.
     * @param {boolean} [isFiltered=true] - Indicates if the filter is active.
    */
    addEqualSetsFilter(column, isNumber, set=[], isFiltered=true) {
        let newFilter = new EqualSetsFilter(column, isNumber, set, isFiltered);
        this.filters.push(newFilter);
    }



    /**
     * Retrieves the filter for a specified column and filter type.
     * If a filter for the column already exists, it checks its type. 
     * If the type does not match the specified filter type, it removes the old filter.
     * If no filter exists for the column, it creates a new one.
     *
     * @param {string} column - The name of the column to filter.
     * @param {Function} FilterType - The class of the filter type to create or retrieve.
     * @returns {Filter} The filter for the specified column.
    */
    getFilter(column, FilterType) {
        let filter = null;

        // check if filter exists
        this.filters.forEach(f => {
            if (f.column == column) {
                
                // if the filter is the wrong type, remove it
                if (!(f instanceof FilterType)) {
                    let index = this.filters.indexOf(f);
                    this.filters.splice(index, 1);
                } else {
                    filter = f;
                    return;
                }
            }
        });

        // create a new filter if none exist
        if (filter == null) {
            filter = new FilterType(column);
            this.filters.push(filter);
        }

        return filter;
    }


    /**
     * Retrieves a SetFilter for the specified column.
     *
     * @param {string} column - The name of the column to filter.
     * @returns {SetFilter} The SetFilter for the specified column.
    */
    getSetFilter(column) {
        return this.getFilter(column, SetFilter);
    }

    /**
     * Retrieves a RangeFilter for the specified column.
     *
     * @param {string} column - The name of the column to filter.
     * @returns {RangeFilter} The RangeFilter for the specified column.
    */
    getRangeFilter(column) {
        return this.getFilter(column, RangeFilter);
        
    }

    /**
     * Retrieves a HasAnyFilter for the specified column.
     *
     * @param {string} column - The name of the column to filter.
     * @returns {HasAnyFilter} The HasAnyFilter for the specified column.
    */
    getHasAnyFilter(column) {
        return this.getFilter(column, HasAnyFilter);
    }

    /**
     * Retrieves a ContainsAllFilter for the specified column.
     *
     * @param {string} column - The name of the column to filter.
     * @returns {ContainsAllFilter} The ContainsAllFilter for the specified column.
    */
    getContainsAllFilter(column) {
        return this.getFilter(column, ContainsAllFilter);
    }

    /**
     * Retrieves an EqualSetsFilter for the specified column.
     *
     * @param {string} column - The name of the column to filter.
     * @returns {EqualSetsFilter} The EqualSetsFilter for the specified column.
    */
    getEqualSetsFilter(column) {
        return this.getFilter(column, EqualSetsFilter);
    }


    /**
     * Notifies all registered observers about updates in the dataset.
    */
    notifyObservers(){
        this.observers.forEach(observer => {
            observer.update(this);
        });
    }

    /**
     * Updates the dataset by fetching data from the PocketBase collection 
     * based on the current filters and pagination settings.
     * 
     * @returns {Promise<void>}
    */
    async update() {
        
        let filter = this.getFilters();
        
        try {

            // fetch dataset
            const response = await pb.collection(this.dataset)
                                    .getList(this._page, this.pageLen, {
                                        filter: filter
                                    });

            this.items = response.items;

            // update the total page number
            this.totalPages = Math.ceil(response.totalItems / this.pageLen);
            
            this.notifyObservers();
        } 
        catch (error) {
            console.error('Error fetching work orders:', error);
        }

        

    }




    getFilters() {
        let result = [];

        // combine each of the filters into a string
        this.filters.forEach(filter => {
            const filterStr = filter.getFilter();
            if (filterStr != "") {
                result.push(filterStr);
            }
            



        });

        // return the filter as a string
        if ( result.length == 0 ) {
            result = '';
        }
        else {
            result = result.join(' && ');
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




export class FilterElements {
    constructor(filteredDataset) {
        this.filteredDataset = filteredDataset;

    }


    async initMechanicSelector(select, mechanicField) {
        let filterElements = this;
        let users = await pb.collection('users').getFullList({
            fields: 'id, name'
        });        
        
        users.forEach(user => {
            let option = document.createElement('option');
            option.text = user['name'];
            option.value = user['id'];
            select.appendChild(option);
        });
        
        
        $(`#${select.id}`).select2({
            placeholder: "Select Employees"
        });
        $(`#${select.id}`).on('select2:select', function (e) {
            // Submit the form when an option is selected
            // e.preventDefault();
   
            let selected = $(`#${select.id}`).val();

            let filter = filterElements.filteredDataset.getHasAnyFilter(mechanicField);
            filter.set = selected;
            filterElements.filteredDataset.update();
        });

        $(`#${select.id}`).on('select2:unselect', function (e) {
            let selected = $(`#${select.id}`).val();

            let filter = filterElements.filteredDataset.getHasAnyFilter(mechanicField);
            if (selected.length == 0) {
                filter.set = [];
                filter.isFiltered = false;
            }            
            else {
                filter.set = selected;
            }
            filterElements.filteredDataset.update();

        });




        
    }

    async initDateSelector(startElement, endElement, dateField) {
        let filterElements = this;
        startElement.addEventListener('change', e => {
            const startDate = e.target.value;
            filterElements.filteredDataset.getRangeFilter(dateField).start = startDate;
            filterElements.filteredDataset.update();
        });

        endElement.addEventListener('change', e => {
            let endDate = new Date(e.target.value);
            endDate.setDate(endDate.getDate() + 1);
            endDate = endDate.toISOString().split('T')[0];
            filterElements.filteredDataset.getRangeFilter(dateField).end = endDate;
            filterElements.filteredDataset.update();
        });

    }

    async initStatusSelector(select, statusField) {
        let filterElements = this;
        let collection = await pb.collection('users');
        console.log(collection);


        
        
        // users.forEach(user => {
        //     let option = document.createElement('option');
        //     option.text = user['name'];
        //     option.value = user['id'];
        //     select.appendChild(option);
        // });
        
        
        // $(`#${select.id}`).select2({
        //     placeholder: "Select Employees"
        // });
        // $(`#${select.id}`).on('select2:select', function (e) {
        //     // Submit the form when an option is selected
        //     // e.preventDefault();
   
        //     let selected = $(`#${select.id}`).val();

        //     let filter = filterElements.filteredDataset.getHasAnyFilter(mechanicField);
        //     filter.set = selected;
        //     filterElements.filteredDataset.update();
        // });

        // $(`#${select.id}`).on('select2:unselect', function (e) {
        //     let selected = $(`#${select.id}`).val();

        //     let filter = filterElements.filteredDataset.getHasAnyFilter(mechanicField);
        //     if (selected.length == 0) {
        //         filter.set = [];
        //         filter.isFiltered = false;
        //     }            
        //     else {
        //         filter.set = selected;
        //     }
        //     filterElements.filteredDataset.update();

        // });
    }


}


