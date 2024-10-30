import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import select2 from 'select2';
import '../js/pb_select_options'

select2();

import { pb } from "../js/import_pb.js"

const DefaultPageLen = 10;


// the maximum number of pages to select from at one time in the pagenation
const MaxPagesSelectable = 5;






/**
 * Base class for filters.
*/
export class Filter {
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
export class SetFilter extends Filter {
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
export class RangeFilter extends Filter {


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
export class HasAnyFilter extends SetFilter {
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
export class ContainsAllFilter extends SetFilter {
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
export class EqualSetsFilter extends SetFilter {
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
        this.pageLen = DefaultPageLen;
        this.prevPageLen = DefaultPageLen;
        this._page = 1;
        this.totalPages = 0;
        this.totalItems = 0;
        this.items = null;
        this.filters = [];
        this.prevFilter = "";
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
     * @param {typeof Filter} FilterType - The class of the filter type to create or retrieve.
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
            // if the filter or page length changes jump to the first page
            if (this.prevFilter != filter || this.prevPageLen != this.pageLen) {
                this.page = 1;
            }
            this.prevFilter = filter;
            this.prevPageLen = this.pageLen;


            // fetch dataset
            const response = await pb.collection(this.dataset)
                                    .getList(this._page, this.pageLen, {
                                        filter: filter
                                    });
            
            
            this.items = response.items;
            
            // update the total page number
            this.totalItems = response.totalItems;
            this.totalPages = Math.ceil(this.totalItems / this.pageLen);
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
                result.push(`( ${filterStr} )`);
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
        
    }

    prevPage() {
        // check if page number is too small
        if (this._page <= 1) {
            return;
        }
        this._page--;
        
    }

    setPage(pageNumber) {
        pageNumber = Number(pageNumber)

        // check if page number is in proper range
        if (pageNumber < 1 && pageNumber >= this.totalPages) {
            return;
        }
        this._page = pageNumber;
        
    }


    async updatePageCount() {


        const response = await pb.collection(this.dataset)
                        .getList(1, 0, {
                            filter: this.getFilters() 
                        });
        this.totalItems = response.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.pageLen);


    }

    set page(number) {
        this.setPage(number);
    }
    get page() {
        return this._page;
    }

}




export class FilterElements {
    constructor(filteredDataset) {
        this.filteredDataset = filteredDataset;
        this.pageSelect = null;
        this.pageLenOptions = [1, 5, 10, 25, 50];
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
            if (isNaN(endDate.getTime())) {
                endDate = null;
            }
            else {
                endDate.setDate(endDate.getDate() + 1);
                endDate = endDate.toISOString().split('T')[0];
            }

            filterElements.filteredDataset.getRangeFilter(dateField).end = endDate;
            filterElements.filteredDataset.update();
        });

    }




    /**
     * Initializes a `select2` dropdown with options and applies a filter to the dataset when an option is selected or unselected.
     *
     * @param {HTMLElement} select - The `select` DOM element to initialize.
     * @param {string} field - The dataset field to filter based on selected options.
     * @param {Array<Object|string>} options - Options for the dropdown, as strings or objects with `text` and `value` keys.
     * @param {string} placeholder - The placeholder text for the dropdown.
     * @param {typeof Filter} FilterType - The type of filter to create.
     * @example
     * initSelect2Filter(document.getElementById('statusSelect'), 'status', statusOptions, 'Select Status');
    */
    async initSelect2Filter(select, field, options, placeholder, FilterType) {
        let filterElements = this;
    
        // Add options to the select element
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.text = option.text || option;
            opt.value = option.value || option;
            select.appendChild(opt);
        });
    
        // Initialize select2 with the provided placeholder
        $(`#${select.id}`).select2({
            placeholder: placeholder
        });
    
        // Handle option selection
        $(`#${select.id}`).on('select2:select', function () {
            let selected = $(`#${select.id}`).val();
    
            let filter = filterElements.filteredDataset.getFilter(field, FilterType);
            filter.set = selected;
            filterElements.filteredDataset.update();
        });
    
        // Handle option unselect
        $(`#${select.id}`).on('select2:unselect', function () {
            let selected = $(`#${select.id}`).val();
    
            let filter = filterElements.filteredDataset.getFilter(field, FilterType);
            if (selected.length === 0) {
                filter.set = [];
                filter.isFiltered = false;
            } else {
                filter.set = selected;
            }
            filterElements.filteredDataset.update();
        });
    }


    async initPagination(pageSelect) {
        const filteredDataset = this.filteredDataset;
        const filterElements = this;
        this.pageSelect = pageSelect;

        this.updatePagination();
        
        pageSelect.addEventListener('submit', async function(e) {
            e.preventDefault(); 

            const pageVal = document.activeElement.value;
            await filteredDataset.setPage(pageVal);
            await filteredDataset.update();
            filterElements.updatePagination();

        });


        // make filter an observer so it can be updated every time the page count is
        this.filteredDataset.observers.push(this);



    }

    /**
     * Called by filter observer. Updates page selection
     */
    update(filteredDataset) {
        if (filteredDataset instanceof FilteredDataset ) {
            if (this.pageSelect != null) {

                this.updatePagination();
            }
        }
    }


    updatePagination() {
        const filteredDataset = this.filteredDataset;
        const pageSelect = this.pageSelect;

        // remove old page selector
        while (pageSelect.firstChild) {
            pageSelect.removeChild(pageSelect.firstChild);
        }
        

        // create ... button
        const ellipsisButton = document.createElement("button");
        ellipsisButton.innerText = "...";
        ellipsisButton.disabled = true;
        

        // create previous page button
        const prevButtton = document.createElement("button");           
        prevButtton.value = filteredDataset.page - 1;
        prevButtton.type = "submit";
        prevButtton.innerText = "<";
        if (filteredDataset.page == 1) {
            prevButtton.disabled = true
        }
        pageSelect.appendChild(prevButtton);


        let i;
        let pageStart = Math.min(
                                    filteredDataset.totalPages - Math.ceil(MaxPagesSelectable / 2) + 1, 
                                    filteredDataset.page
                                );
        pageStart = Math.max(1, pageStart - Math.floor(MaxPagesSelectable / 2));
    
        // create jump to start page button
        if (pageStart > 1) {
            const startButton = document.createElement("button");           
            startButton.value = 1;
            startButton.type = "submit";
            startButton.innerText = "1";
            pageSelect.appendChild(startButton);
            pageSelect.appendChild(ellipsisButton);
        }


        let pageOptions = Math.min(filteredDataset.totalPages, MaxPagesSelectable);
        for ( i=pageStart; i <= pageOptions + pageStart - 1; i++) {
            let newPage = document.createElement("button");
            newPage.value = i;
            newPage.type = "submit";
            newPage.innerText = i;
            if ( i == filteredDataset.page) {
                newPage.style.border = '1px solid black';
                newPage.disabled = true;
            }
            pageSelect.appendChild(newPage);
            
        }

        // create jump to end page button
        if (pageStart + pageOptions < filteredDataset.totalPages) {
            const startButton = document.createElement("button");           
            startButton.value = filteredDataset.totalPages;
            startButton.type = "submit";
            startButton.innerText = filteredDataset.totalPages;
            pageSelect.appendChild(ellipsisButton.cloneNode(true));
            pageSelect.appendChild(startButton);
        }


        // create next page button
        const nextButtton = document.createElement("button");           
        nextButtton.value = filteredDataset.page + 1;
        nextButtton.type = "submit";
        nextButtton.innerText = ">";
        if (filteredDataset.page == this.filteredDataset.totalPages) {
            nextButtton.disabled = true
        }
        pageSelect.appendChild(nextButtton);


    }



    
    initPageLenSelect(pageLenSelector) {
        const filteredDataset = this.filteredDataset;
        
        this.pageLenOptions.forEach(len => {
            const option = document.createElement('option');
            option.text = len;
            option.value = len;
            if (this.filteredDataset.pageLen == len) {
                option.selected = true;
            }
            pageLenSelector.appendChild(option);
        });

        pageLenSelector.addEventListener('change', e => {
            filteredDataset.pageLen = pageLenSelector.value;
            
            filteredDataset.update();
        });

        
        
    }    


}


