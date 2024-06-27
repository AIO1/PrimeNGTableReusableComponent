import { Table, TableLazyLoadEvent } from 'primeng/table';
import { Component, Input, ViewChild} from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

// Import services
import { SharedService } from '../../services/shared/shared.service';
import { PrimengSharedService } from '../../services/shared/primengShared.service';

// Import interfaces
import { IprimengColumnsMetadata } from '../../interfaces/primeng/iprimeng-columns-metadata';
import { IprimengTableDataPost } from '../../interfaces/primeng/iprimeng-table-data-post';
import { IprimengTableDataReturn } from '../../interfaces/primeng/iprimeng-table-data-return';
import { IprimengColumnsAndAllowedPagination } from '../../interfaces/primeng/iprimeng-columns-and-allowed-pagination';
import { IprimengActionButtons } from '../../interfaces/primeng/iprimeng-action-buttons';
import { IPrimengPredifinedFilter } from '../../interfaces/primeng/iprimeng-predifined-filter';

// Import other
import { Constants } from '../../../constants';
import { FilterMetadata } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'ecs-primeng-table', // Component selector used in HTML to render this component
  templateUrl: './primeng-table.component.html' // Path to the HTML template for this component
})
export class PrimengTableComponent {
  constructor(
    private primengSharedService: PrimengSharedService,
    private sharedService: SharedService, 
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer){}

  @Input() canPerformActions: boolean = true; // Used to avoid upon entering to perform the searchs. Its usefull when its needed to retrieve other values firsts and then call "updateDataExternal"
  @Input() globalSearchEnabled: boolean = true; // Used to enable or disable the global search (by default enabled)
  @Input() globalSearchPlaceholder: string = "Search keyword"; // The placeholder text to show if global search is enabled
  @Input() rowActionButtons: IprimengActionButtons[] = []; // A list that contains all buttons that will appear in the actions column
  @Input() headerActionButtons: IprimengActionButtons[] = []; // A list that contains all buttons that will appear in the right side of the header of the table
  @Input() columnsSourceURL!: string; // The URL (without the base API URL) that will be used to fetch all the information related to the columns
  @Input() dataSoureURL!: string; // The URL (without the base API URL) that will be used to fetch all the information related to the data
  @Input() predifinedFiltersCollection: { [key: string]: IPrimengPredifinedFilter[] } = {}; // Contains a collection of the values that need to be shown for predifined column filters
  @Input() predifinedFiltersNoSelectionPlaceholder: string = "Any value"; // A text to be displayed in the dropdown if no value has been selected in a column that uses predifined filters
  @Input() predifinedFiltersCollectionSelectedValuesText: string = "items selected"; // A text to display in the predifined filters dropdown footer indicating the number of items that have been selected
  @Input() selectedColumnsDropdownPlaceholder: string = "Select columns to show"; // A placeholder to show when no columns have been selected to be shown
  @Input() selectedColumnsDropdownSelectedPlaceholder: string = "selected columns"; // The text to be shown when a group of columns that doesn't fit the dropdown has been selected
  @Input() noDataFoundText: string = "No data found for the current filter criteria."; // The text to be shown when no data has been returned
  @Input() showingRecordsText: string = "Showing records"; // The text that must be displayed as part of "Showing records"
  @Input() applyingFiltersText: string = "Available records after applying filters"; // The text that is shown next to the number of records after applying filter rules
  @Input() notApplyingFiltersText: string = "Number of available records"; // The text to be shown next to the number of total records available (not applying filters)
  @Input() actionColumnName: string = "Actions" // The column name were the action buttons will appear
  
  @ViewChild('dt') dt!: Table; // Get the reference to the object table

  dateFormat: string = "dd-MMM-yyyy HH:mm:ss zzzz";
  dateTimezone: string = "+00:00";
  dateCulture: string = "en-US";
  globalSearchText: string | null = null; // The text used by the global search

  currentPage: number = 0; // The current page we are at
  currentRowsPerPage: number = 0; // The current rows per page selected
  allowedRowsPerPage: number[] = []; // The different values of rows per page allowed
  totalRecords: number = 0; // The number of total records that are available (taking into account the filters)
  totalRecordsNotFiltered: number = 0; // The total number of records available if no filters were applied
  
  private columnsFetched: boolean = false; // Used to indicate if the columns data has at least been obtained once
  private columns: IprimengColumnsMetadata[] = []; // All the columns with all their data (not segmented into selectable and non-selectable)
  columnsSelectable: IprimengColumnsMetadata[] = []; // Columns which can be selected to be displayed or not by the user
  columnsSelected: IprimengColumnsMetadata[] = []; // The columns (from the selectables) which are currently selected by the user
  private columnsNonSelectable: IprimengColumnsMetadata[] = []; // Columns which are always displayed
  columnsToShow: IprimengColumnsMetadata[] = []; // The combination of the non-selectable columns + selected columns that must be shown

  predifinedFiltersSelectedValuesCollection: { [key: string]: any[] } = {}; // Contains a collection of the predifined column filters selection (possible values come from 'predifinedFiltersCollection')

  tableLazyLoadEventInformation: TableLazyLoadEvent = {}; // Data of the last lazy load event of the table
  data: any[] = []; // The array of data to be displayed

  /**
   * Updates the filters of a PrimeNG data table based on predefined filter changes.
   *
   * @param {string} filterName - The name of the filter to be updated.
   * @param {IPrimengPredifinedFilter[]} selectedValues - An array of selected predefined filter values.
   */
  onPredifinedFilterChange(filterName: string, selectedValues: IPrimengPredifinedFilter[]): void {
    const filters = { ...this.dt.filters }; // Create a shallow copy of the current filters to avoid mutating the original filters directly
    if (Array.isArray(filters[filterName])) { // Check if the filter for the given filterName is an array
        (filters[filterName] as FilterMetadata[]).forEach(criteria => { // If it is an array, iterate over each filter criteria
            criteria.value = selectedValues.map(value => value.value); // Update the value of each criteria with the values from selectedValues
        });
    } else if (filters[filterName]) { // Check if the filter for the given filterName exists and is not an array
        const criteria = filters[filterName] as FilterMetadata; // Cast the filter criteria to FilterMetadata
        criteria.value = selectedValues.map(value => value.value); // Update the value of the criteria with the values from selectedValues
    }
    this.dt.filters = filters; // Update the data table's filters with the modified filters object
    this.dt._filter(); // Trigger the filtering operation on the data table to apply the new filters
  }

  /**
   * Checks if the provided column metadata matches a specific style of the predefined filters 
   * that need to be applied to an item on a row.
   *
   * @param {IprimengColumnsMetadata} colMetadata - The metadata of the column being checked.
   * @param {any} value - The value to be matched against the predefined filter values.
   * @returns {any} The matching predefined filter value if found, otherwise null.
   */
  getPredfinedFilterMatch(colMetadata: IprimengColumnsMetadata, value: any): any {
    if (colMetadata.filterUsesPredifinedValues) { // Check if the column uses predefined filter values
        const options = this.getPredifinedFilterValues(colMetadata.filterPredifinedValuesName); // Get the predefined filter values based on the name
        return options.find(option => option.value === value); // Return the matching option if found
    }
    return null; // Return null if the column does not use predefined filter values
  }

  /**
   * Gets the list of values available for a predefined filter in a column.
   *
   * @param {string} columnKeyName - The name of the predefined filter option to retrieve values for.
   * @returns {IPrimengPredifinedFilter[]} An array of predefined filter values associated with the given option name. 
   * If the option name does not exist, an empty array is returned.
   */
  getPredifinedFilterValues(columnKeyName: string): IPrimengPredifinedFilter[] {
    return this.predifinedFiltersCollection[columnKeyName] || []; // Return the predefined filter values or an empty array if the option name does not exist
  }

  /**
   * Retrieves the number of values selected for a predefined filter.
   *
   * This function checks the collection of selected values for a specified column key name and returns a string
   * indicating the number of selected items along with a predefined text.
   *
   * @param {string} columnKeyName - The key name of the column for which to retrieve the number of selected values.
   * @returns {string} A string indicating the number of selected values for the specified column.
   */
  predifinedFiltersSelectedValuesText(columnKeyName: string): string {
    let numbItemsSelected = 0; // Initialize the count of selected items to zero
    if (this.predifinedFiltersSelectedValuesCollection[columnKeyName]) { // Check if there are selected values for the specified column key
        numbItemsSelected = this.predifinedFiltersSelectedValuesCollection[columnKeyName].length; // Get the number of selected items
    }
    return `${numbItemsSelected} ${this.predifinedFiltersCollectionSelectedValuesText}`; // Return the number of selected items concatenated with the predefined text
  }

  /**
   * Used to update the data of a table externally outside the component. Use this method instead of 'updateData' to force the data updata of a table
   *
   * @param {(optionalData?: any) => void} [continueAction] - Optional action to execute after data retrieval if it succeeded.
   * @param {boolean} [uponContinueActionEndModalHttp=false] - Optional flag to set the loading indicator to inactive after data retrieval.
   */
  updateDataExternal(continueAction?: (optionalData?: any) => void, uponContinueActionEndModalHttp: boolean = false): void {
    this.canPerformActions = true; // Indicate that the table has been enabled to perform actions
    this.updateData(this.tableLazyLoadEventInformation, continueAction, uponContinueActionEndModalHttp); // Force the data of the table to be updated
  }

  /**
   * @warning This function is intended for internal use within the component. Do not call it directly from outside the component.
   * To trigger a data update from outside the component use 'updateDataExternal' instead.
   * 
   * Updates the data of a table if `canPerformActions` is true and the columns have already been fetched.
   * If the columns have not been fetched yet, it will attempt to get them.
   * A `continueAction` can be specified to execute something upon data retrieval if it succeeded and `canPerformActions` is true.
   * `uponContinueActionEndModalHttp` can be used to set the loading indicator to active or inactive after the query ended successfully.
   *
   * @param {TableLazyLoadEvent} event - The event object containing pagination, sorting, and filtering information.
   * @param {(optionalData?: any) => void} [continueAction] - Optional action to execute after data retrieval if it succeeded.
   * @param {boolean} [uponContinueActionEndModalHttp=false] - Optional flag to set the loading indicator to inactive after data retrieval and if there is a 'continueAction' defined.
   * 
   * @example
   * // Example usage of updateData function
   * const event: TableLazyLoadEvent = { eventdata };
   * const continueAction = (optionalData?: any) => {
   *   console.log('Continue action executed.');
   * };
   * const uponContinueActionEndModalHttp = true;
   * 
   * updateData(event, continueAction, uponContinueActionEndModalHttp);
   */
  updateData(event: TableLazyLoadEvent, continueAction?: (optionalData?: any) => void, uponContinueActionEndModalHttp: boolean = false): void {
    this.tableLazyLoadEventInformation = event; // Store the event information for later use
    if (!this.canPerformActions) { // Check if actions can be performed
      return; // Exit if actions cannot be performed
    }
    if (!this.columnsFetched) { // Check if columns have been fetched
      this.getColumns(continueAction, uponContinueActionEndModalHttp); // Fetch columns if not already fetched
      return; // Exit after fetching columns (when columns load the lazy load event of the table will be triggered again)
    }
    Constants.waitingHTTP = true; // Set the loading indicator to active
    const filtersWithoutGlobal = this.createFiltersWithoutGlobal(event.filters); // Create filters excluding the global filter
    const requestData: IprimengTableDataPost = {
      page: this.currentPage, // Set the current page number
      pageSize: this.currentRowsPerPage, // Set the number of rows per page
      sort: event.multiSortMeta, // Set the sorting information
      filter: filtersWithoutGlobal, // Set the filters excluding the global filter
      globalFilter: this.globalSearchText, // Set the global filter text
      columns: this.columnsToShow.map(col => col.field), // Set the columns to show
      dateFormat: this.dateFormat,
      dateTimezone: this.dateTimezone,
      dateCulture: this.dateCulture
    };
    this.sharedService.handleHttpResponse(
      this.primengSharedService.fetchTableData(this.dataSoureURL, requestData) // Fetch table data from the server
    ).subscribe({
      next: (responseData: IprimengTableDataReturn) => { // Handle the successful data retrieval
        this.data = responseData.data; // Update the table data
        this.totalRecords = responseData.totalRecords; // Update the total number of records
        this.totalRecordsNotFiltered = responseData.totalRecordsNotFiltered; // Update the total records not filtered
        this.currentPage = responseData.page; // Update the current page
        if (continueAction) { // Check if a continue action is specified
          continueAction(); // Execute the continue action
          if (uponContinueActionEndModalHttp) { // Check if the loading indicator should be set to inactive
              Constants.waitingHTTP = false; // Set the loading indicator to inactive
          }
        } else { // If a continue action has not been specified
          Constants.waitingHTTP = false; // Set the loading indicator to inactive
        }
      },
      error: err => { // Handle errors during data retrieval
        this.sharedService.dataFecthError("ERROR FETCHING DATA", err); // Display an error message
      }
    });
  }

  /**
   * Fetches table columns and allowed paginations, then updates the state with the fetched data.
   * Optionally continues with a specified action after the data is fetched.
   *
   * @param {Function} [continueAction] - (Optional) A function to be executed after fetching the columns and allowed paginations. The function can take optional data as a parameter.
   * @param {boolean} [uponContinueActionEndModalHttp=false] - (Optional) A boolean indicating whether to end the modal HTTP waiting state upon the completion of the continue action. Defaults to false.
   */
  getColumns(continueAction?: (optionalData?: any) => void, uponContinueActionEndModalHttp: boolean = false) {
    Constants.waitingHTTP = true; // Set the HTTP waiting state to true
    this.sharedService.handleHttpResponse(this.primengSharedService.fetchTableColumnsAndAllowedPaginations(this.columnsSourceURL)).subscribe({
        next: (responseData: IprimengColumnsAndAllowedPagination) => { // Handle successful response
            this.allowedRowsPerPage = responseData.allowedItemsPerPage; // Update the number of rows allowed per page
            this.currentRowsPerPage = Math.min(...this.allowedRowsPerPage); // Update the current rows per page to use the minimum value of allowed rows per page by default
            this.columns = responseData.columnsInfo; // Update columns with fetched data
            this.columnsSelectable = this.columns.filter((col: any) => col.canBeHidden); // Filter columns that can be hidden
            this.columnsNonSelectable = this.columns.filter((col: any) => !col.canBeHidden); // Filter columns that cannot be hidden
            this.columnsSelected = this.columnsSelectable.filter((col: any) => !col.startHidden); // Select columns that are not hidden by default
            this.columnsToShow = this.columnsNonSelectable.concat(this.columnsSelected); // Combine non-selectable and selected columns to show
            this.columnsSelectable = this.columnsSelectable.slice().sort((a: any, b: any) => { // Sort selectable columns by header
                const fieldA = a.header.toUpperCase();
                const fieldB = b.header.toUpperCase();
                return fieldA.localeCompare(fieldB);
            });
            this.dateFormat = responseData.dateFormat;
            this.dateTimezone = responseData.dateTimezone;
            this.dateCulture = responseData.dateCulture;
            this.columnsFetched = true; // Indicate that we have fetched the columns
            this.updateData(this.tableLazyLoadEventInformation, continueAction, uponContinueActionEndModalHttp); // Update data with the fetched columns and execute continue action if provided
        },
        error: err => { // Handle error response
            this.sharedService.dataFecthError("ERROR IN GET COLUMNS AND ALLOWED PAGINATIONS", err); // Log the error
        }
    });
  }

  /**
   * Handles the change of selected columns in the table, keeping the order of the columns that were already present, and adding the new ones at the end.
   */
  columnsChanged(): void {
    const existingColumns = this.dt.columns!; // Get the currently selected columns (will be used to determine the final order)
    const columnsToKeep = new Set<string>(); // Used to track all the columns that must be kept
    this.columnsNonSelectable.concat(this.columnsSelected).forEach(column => {
        columnsToKeep.add(column.field);
    }); // Add columns from this.columnsNonSelectable.concat(this.columnsSelected) to columnsToKeep
    const finalColumns: IprimengColumnsMetadata[] = []; // Used to store the final result of columns (ordered)
    existingColumns.forEach(column => {
        if (columnsToKeep.has(column.field)) {
            finalColumns.push(column);
        }
    }); // Filter the existing columns to only keep those ones that are in columnsToKeep
    this.columnsNonSelectable.concat(this.columnsSelected).forEach(column => {
        if (!finalColumns.find(c => c.field === column.field)) {
            finalColumns.push(column);
        }
    }); // Add the new columns that are in columnsToKeep but not in finalColumns
    this.columnsToShow=finalColumns; // Set the columnsToShow to the finalColumns
    this.clearSortsAndFilters(this.dt, true); // Perform a clear of the sort and filters (which will also force the table data to be updated)
  }

  /**
   * Clears sorts and filters in a table based on specific conditions, with an optional force option.
   *
   * This function checks if sorts and filters need to be cleared by calling `hasToClearSortsAndFilters`.
   * If clearing is necessary, it resets the global search text and clears the table's sorts and filters.
   *
   * @param {Table} dt - A PrimeNG Table object representing the table to which the clearing operations will be applied.
   * @param {boolean} [force=false] - (Optional) A boolean value indicating whether to force the clear operation even if there are no specific conditions. Defaults to false.
   */
  clearSortsAndFilters(dt: Table, force: boolean = false) { 
    let hasToClear = this.hasToClearSortsAndFilters(dt, this.globalSearchText, force); // Get if we have to clear sorts and filters
    this.predifinedFiltersSelectedValuesCollection = {}; // Reset the collection of predefined filter values
    if (hasToClear) { // If sorts and filters must be cleared
        this.globalSearchText = null; // Reset the global search text
        dt.clear(); // Clear sorts and filters in the table
    }
  }

  /**
   * Creates a copy of a set of filters by removing the global filter.
   *
   * @param {any} filters - An object representing the current filters, where the properties are column names and the values are associated filter rules.
   * @returns {any} An object that is a copy of the original filters but without the global filter.
   * 
   * @example
   * // Example filters object
   * const filters = {
   *   name: { value: 'John', matchMode: 'contains' },
   *   age: { value: 30, matchMode: 'equals' },
   *   global: 'something'
   * };
   * 
   * // Use createFiltersWithoutGlobal to get filters without the global filter
   * const newFilters = createFiltersWithoutGlobal(filters);
   * 
   * // Output: { name: { value: 'John', matchMode: 'contains' }, age: { value: 30, matchMode: 'equals' } }
   */
  private createFiltersWithoutGlobal(filters: any): any {
    if (this.globalSearchText === "") { // If the global search text is an empty string
      this.globalSearchText = null; // Set it to null
    }
    const filtersWithoutGlobal = { ...filters }; // Create a copy of filters to delete the global.
    if (filtersWithoutGlobal.hasOwnProperty('global')) { // If there is an entry with the global filter
      delete filtersWithoutGlobal['global']; // Remove the global filter
    }
    return filtersWithoutGlobal; // Return the filters without global array
  }

  /**
   * Determines whether sorts and filters in a table should be cleared based on specific conditions, with an optional force option.
   *
   * @param {Table} dt - A PrimeNG Table object representing the table to which the clearing operations will be applied.
   * @param {string | null} globalSearchText - A string representing the global search text. Can be null.
   * @param {boolean} [force=false] - (Optional) A boolean value indicating whether to force the clear operation even if there are no specific conditions. Defaults to false.
   * @returns {boolean} A boolean value indicating whether sorts and filters should be cleared. Returns true if clearing is necessary; otherwise, false.
   */
  hasToClearSortsAndFilters(dt: Table, globalSearchText: string | null, force: boolean = false) : boolean { 
    let hasToClear : boolean = false; // Initialize the flag to indicate if clearing is needed
    const filtersWithoutGlobal = this.createFiltersWithoutGlobal(dt.filters); // Create a copy of filters excluding the global filter
    const hasFilters = this.hasFilters(filtersWithoutGlobal); // Check if there are active filters
    const hasSorts = (dt.multiSortMeta && dt.multiSortMeta.length > 0); // Check if there are active sorts
    const hasGlobalFilter = (globalSearchText && globalSearchText.trim() !== ""); // Check if there is a global filter with non-empty text
    if (force || hasSorts || hasFilters || hasGlobalFilter) { // If the clearing is forced or if there are active sorts, filters, or a global filter
        hasToClear = true; // Indicate that everything must be cleared
    }
    return hasToClear; // Return if everything must be cleared or not
  }

  /**
   * Determines whether there are active filters based on the provided filter rules.
   *
   * @param {any} filterRules An object representing filter rules for each column.
   *   The keys are column names, and the values are arrays of filter rules.
   *   Each filter rule has the following properties:
   *     - `field`: The field or property name of the column.
   *     - `value`: The filter value entered by the user.
   *     - Other properties depending on the type of filter (e.g., `matchMode` for string filters).
   * @returns {boolean} `true` if at least one active filter is found, otherwise `false`.
   */
  private hasFilters(filterRules: any): boolean {
    for (const columnName of Object.keys(filterRules)) { // Iterate over each column name in the filter rules
        const columnFilters = filterRules[columnName]; // Get the filter rules for the current column
        for (const filterRule of columnFilters) { // Iterate over each filter rule for the current column
            if (filterRule.value !== null && filterRule.value !== "") { // Check if the filter value is not null or an empty string
                return true; // At least one active filter found
            }
        }
    }
    return false; // No active filters found
  }

  /**
   * Handles click events on action buttons in a row of data.
   * 
   * @param {function} action - The action function to be executed when the button is clicked. It should accept one parameter, which is the row data.
   * @param {any} [rowData=null] - The data of the row corresponding to the clicked button. Defaults to null.
   * 
   * @returns {void}
   * 
   * @example
   * // Define an action for a button
   * const deleteAction = (rowData) => {
   *   console.log(`Delete row with id: ${rowData.id}`);
   * };
   * 
   * // Use handleButtonsClick with row data
   * handleButtonsClick(deleteAction, { id: 1, name: 'John Doe' });
   */
  handleButtonsClick(action: (rowData: any) => void, rowData: any = null): void {
    if (action) { // If the button has an assigned action
      action(rowData); // Perform the action
    }
  }

  /**
   * Handles the change of page and/or rows per page in the table.
   * 
   * @param {PaginatorState} event - The event object containing page and rows information.
   */
  pageChange(event: PaginatorState): void {
    this.currentPage = event.page!; // Update the current page
    this.currentRowsPerPage = event.rows!; // Update the number of rows per page
    this.updateData(this.tableLazyLoadEventInformation); // Force the data to be updated
  }

  /**
   * Generates SafeHtml with highlighted text based on global search criteria.
   *
   * @param {any} cellValue - The value of the cell to be highlighted.
   * @param {IprimengColumnsMetadata} colMetadata - The column configuration for the cell.
   * @param {string | null} globalSearchText - The global search text to highlight within the cell value.
   * @returns {SafeHtml} - HTML content with highlighted text if it matches the global search criteria.
   * 
   * @example
   * // Define column configuration
   * const colMetadata: IprimengColumnsMetadata = { dataType: 'string', canBeGlobalFiltered: true, etc... };
   * 
   * // Cell value to be highlighted
   * const cellValue: string = 'Example text';
   * 
   * // Global search text
   * const globalSearchText: string = 'text';
   * 
   * // Use highlightText to get SafeHtml with highlighted text
   * const highlightedHtml: SafeHtml = highlightText(cellValue, colMetadata, globalSearchText);
   */
  highlightText(cellValue: any, colMetadata: IprimengColumnsMetadata, globalSearchText: string | null): SafeHtml {
    if (colMetadata.dataType !== "boolean" && globalSearchText !== null) { // Check if the column data type is not boolean and global search text is not null
      const valueToUse = String(cellValue); // Convert cell value to string
      if (colMetadata.canBeGlobalFiltered) { // Check if the column can be globally filtered
        const searchLowerCase = globalSearchText.toUpperCase(); // Convert global search text to uppercase for case-insensitive comparison
        const cellValueLowerCase = valueToUse.toUpperCase(); // Convert cell value to uppercase for case-insensitive comparison
        if (cellValueLowerCase.includes(searchLowerCase)) { // Check if the cell value contains the search text
          // Determine the start and end indices of the search text within the cell value
          const startIndex = cellValueLowerCase.indexOf(searchLowerCase);
          const endIndex = startIndex + globalSearchText.length;
          // Extract the prefix, highlight, and suffix of the cell value
          const prefix = valueToUse.substring(0, startIndex);
          const highlight = valueToUse.substring(startIndex, endIndex);
          const suffix = valueToUse.substring(endIndex);
          return `${prefix}<span class="highlighted-text">${highlight}</span>${suffix}`; // Construct SafeHtml with highlighted text using the <mark> element
        }
      }
    }
    return cellValue; // Return the original cell value if it doesn't meet the highlighting conditions
  }

  /**
   * Formats a date value to a specific string format. Provided date will be assumed to be in UTC
   *
   * @param {any} value - The date value to be formatted.
   * @returns {string} - The formatted date string in 'dd-MMM-yyyy HH:mm:ss' format followed by the timezone, or empty string if the provided value is invalid or undefined.
   * 
   * @example
   * // Example date value
   * const dateValue: Date = new Date();
   * 
   * // Use formatDate to get the formatted date string
   * const formattedDate: string = formatDate(dateValue);
   * 
   * // Output might be: '18-Jun-2024 14:30:00 GMT+0000'
   */
  formatDate(value: any): string{
    let formattedDate = undefined; // By default, formattedDate will be undefined
    if(value){ // If value is not undefined
      formattedDate = this.datePipe.transform(value + 'Z', this.dateFormat, this.dateTimezone, this.dateCulture); // Perform the date masking
    }
    return formattedDate ?? ''; // Returns the date formatted, or as empty string if an issue was found (or value was undefined).
  }

  /**
   * Converts a blob from the database to a safe URL that can be used to display an image.
   *
   * This function takes a `Blob` object, converts it to a base64 encoded string, and returns a `SafeUrl` 
   * that can be used in an HTML template to display the image securely. The `SafeUrl` ensures that 
   * Angular's security mechanisms are bypassed correctly, preventing potential security risks.
   *
   * @param {Blob} blob - The blob object representing the image data from the database.
   * @returns {SafeUrl} A safe URL that can be used to display the image in an HTML template.
   * 
   * @example
   * // Example usage in a component
   * const imageBlob = new Blob([binaryData], { type: 'image/jpeg' });
   * const imageUrl = this.getBlobIconAsUrl(imageBlob);
   * 
   * // In your HTML template
   * <img [src]="imageUrl" alt="Image">
   */
  getBlobIconAsUrl(blob: Blob): SafeUrl {
    let objectURL = `data:image/jpeg;base64,${blob}`; // Create a base64 encoded string from the blob data
    return this.sanitizer.bypassSecurityTrustUrl(objectURL); // Bypass Angular's security mechanisms to create a SafeUrl
  }
}