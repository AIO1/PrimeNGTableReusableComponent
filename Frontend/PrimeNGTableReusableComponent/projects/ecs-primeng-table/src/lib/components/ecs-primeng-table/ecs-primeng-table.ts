import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// PrimeNG imports
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';

import { CellOverflowBehaviour, DataAlignHorizontal, DataAlignVertical, DataType, FrozenColumnAlign, TableViewSaveMode } from '../../enums';

import { ActionButton, ColumnMetadata, PredifinedFilter, TableConfiguration } from '../../interfaces';

import { ECSPrimengTableService } from './ecs-primeng-table.service';
import { FormsModule } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { FilterMetadata } from 'primeng/api';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { ECSPrimengTableNotificationService } from '../../services';


@Component({
  selector: 'ecs-primeng-table',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,
    SkeletonModule,
    TagModule,
    CheckboxModule
  ],
  standalone: true,
  templateUrl: './ecs-primeng-table.html',
  styles: ''
})
export class ECSPrimengTable implements OnInit {
  constructor(
    private tableService: ECSPrimengTableService,
    private sanitizer: DomSanitizer,
    private notification: ECSPrimengTableNotificationService,
    private datePipe: DatePipe,
  ) {}
  @Input() data: any[] = []; // The array of data to be displayed
  @Input() columnsToShow: ColumnMetadata[] = []; // The combination of the non-selectable columns + selected columns that must be shown
  @Input() computeScrollHeight: boolean = true; // If true, the table will try not to grow more than the total height of the window vertically
  @Input() globalSearchEnabled: boolean = true; // Used to enable or disable the global search (by default enabled)
  @Input() globalSearchMaxLength: number = 50; // The maximun number of characters that can be input in the global filter
  @Input() globalSearchPlaceholder: string = "Search keyword"; // The placeholder text to show if global search is enabled
  @Input() columnEditorEnabled: boolean = true; // If the user can modify the columns thorugh the column editor
  @Input() urlColumnsSource!: string; // The source URL to get data from columns
  @Input() reportSourceURL: string | null = null;
  @Input() predifinedFiltersCollection: { [key: string]: PredifinedFilter[] } = {}; // Contains a collection of the values that need to be shown for predifined column filters
  @Input() predifinedFiltersNoSelectionPlaceholder: string = "Any value"; // A text to be displayed in the dropdown if no value has been selected in a column that uses predifined filters
  @Input() predifinedFiltersCollectionSelectedValuesText: string = "items selected"; // A text to display in the predifined filters dropdown footer indicating the number of items that have been selected
  @Input() rowActionButtons: ActionButton[] = []; // A list that contains all buttons that will appear in the actions column
  @Input() headerActionButtons: ActionButton[] = []; // A list that contains all buttons that will appear in the right side of the header of the table
  @Input() copyCellDataToClipboardTimeSecs: number = 0.5; // The amount of time since mouse down in a cell for its content to be copied to the clipboard. If you want to disable this functionality, put it to a value less than or equal to 0.
  @Input() actionsColumnAligmentRight: boolean = true; // If actions column is put at the right end of the table (or false if its at the left)
  @Input() actionsColumnWidth: number = 150; // The amount in pixels for the size of the actions column
  @Input() actionsColumnFrozen: boolean = true; // If the actions column should be frozen
  @Input() rowSelectorColumnActive: boolean = false; // By default false. If true, a column will be shown to the user that includes a checkbox per row. This selection and filtering that the user can do is all managed by the table component. You can fetch the selected rows through the output selectedRows.
  @Input() rowSelectorColumName: string = "Selected"; // The title of the row selection column. By default is "Selected"
  @Input() rowSelectorColumnAligmentRight: boolean = true; // By default true. If true, the row selector column is put at the right end of the table (or false if its at the left).
  @Input() rowSelectorColumnWidth: number = 150; // The amount in pixels for the size of the selector column
  @Input() rowSelectorColumnFrozen: boolean = true; // By default true. If true, the row selector column will be frozen.
  @Input() actionsColumnResizable: boolean = false; // If the action column can be resized by the user
  @Input() actionColumnName: string = "Actions" // The column name were the action buttons will appear
  @Input() rowselectorColumnResizable: boolean = false;
  @Output() selectedRowsChange = new EventEmitter<{
    rowID: any,
    selected: boolean
  }>(); // Emitter that returns the column selected and if it was selected or unselected
  
  selectedRows: any[] = []; // An array to keep all the selected rows
  @ViewChild('dt') dt!: Table; // Get the reference to the object table
  showRefreshData=true;
  scrollHeight: string = "0px"; // Used to get the table height
  globalSearchText: string | null = null; // The text used by the global search

  DataType = DataType;
  CellOverflowBehaviour = CellOverflowBehaviour;
  DataAlignHorizontal = DataAlignHorizontal;
  DataAlignVertical = DataAlignVertical;
  FrozenColumnAlign = FrozenColumnAlign;
  TableViewSaveMode = TableViewSaveMode;

  currentPage: number = 0; // The current page we are at
  currentRowsPerPage: number = 0; // The current rows per page selected
  allowedRowsPerPage: number[] = []; // The different values of rows per page allowed
  totalRecords: number = 0; // The number of total records that are available (taking into account the filters)
  totalRecordsNotFiltered: number = 0; // The total number of records available if no filters were applied

  dateFormat: string = "dd-MMM-yyyy HH:mm:ss zzzz";
  dateTimezone: string = "+00:00";
  dateCulture: string = "en-US";

  columns: ColumnMetadata[] = [];
  columnsCantBeHidden: ColumnMetadata[] = [];
  columnsSelected: ColumnMetadata[] = [];
  predifinedFiltersSelectedValuesCollection: { [key: string]: any[] } = {}; // Contains a collection of the predifined column filters selection (possible values come from 'predifinedFiltersCollection')
  private copyCellDataTimer: any; // A timer that handles the amount of time left to copy the cell data to the clipboard
  
  ngOnInit(): void {
    this.fetchTableConfiguration();
  }

  fetchTableConfiguration(): void {
    this.tableService.fetchTableConfiguration(this.urlColumnsSource).subscribe({
      next: (response: HttpResponse<TableConfiguration>) => this.handleTableColumnsResponse(response.body!),
      error: (err) => this.tableService.handleTableError(err, 'Columns Error')
    });
  }

  fetchTableData(): void {
    
  }

  private handleTableColumnsResponse(body: TableConfiguration): void {
    this.allowedRowsPerPage = body.allowedItemsPerPage; // Update the number of rows allowed per page
    this.currentRowsPerPage = Math.min(...this.allowedRowsPerPage); // Update the current rows per page to use the minimum value of allowed rows per page by default
    this.columns = body.columnsInfo; // Update columns with fetched data
    this.columnsCantBeHidden = this.columns.filter((col: any) => !col.canBeHidden); // Filter columns that cannot be hidden
    this.columnsSelected = this.columns.filter((col: any) => !col.startHidden && col.canBeHidden); // Selected columns that are not hidden by default
    this.columnsToShow = this.tableService.orderColumnsWithFrozens(this.columnsCantBeHidden.concat(this.columnsSelected));
    this.dateFormat = body.dateFormat;
    this.dateTimezone = body.dateTimezone;
    this.dateCulture = body.dateCulture;
    this.currentPage = 0;
  }

  updateData(event: any): void {

  }

  clearFilters(a: any, b?: any, c?: any): void {

  }

  showColumnModal(): void {

  }

  clearSorts(dt: any): void {

  }
  hasToClearSorts(dt: any): boolean {
    return false;
  }
  hasToClearFilters(dt: any, globalSearchText: any): boolean {
    return false;
  }
  openExcelReport(): void {

  }

  getColumnStyle(col: any, headerCols: boolean = false): Record<string, string> {
    let styles: Record<string, string> = {};
    if(!headerCols){
      styles = {
          'white-space': col.cellOverflowBehaviour === CellOverflowBehaviour.Wrap ? 'normal' : 'nowrap',
          'word-wrap': col.cellOverflowBehaviour === CellOverflowBehaviour.Wrap ? 'break-word' : 'normal',
          'word-break': col.cellOverflowBehaviour === CellOverflowBehaviour.Wrap ? 'break-all' : 'normal'
      };
    }
    if (col.initialWidth > 0) {
        styles['max-width'] = col.initialWidth + 'px';
        styles['min-width'] = col.initialWidth + 'px';
        styles['width'] = col.initialWidth + 'px';
    }
    return styles;
  }

  getPredifinedFilterValues(columnKeyName: string): PredifinedFilter[] {
    return this.predifinedFiltersCollection[columnKeyName] || []; // Return the predefined filter values or an empty array if the option name does not exist
  }

  getFrozenColumnAlignAsText(frozenColumnAlign: FrozenColumnAlign): string {
    switch (frozenColumnAlign) {
      case FrozenColumnAlign.Left:
        return 'left';
      case FrozenColumnAlign.Right:
        return 'right';
      default:
        return 'left';
    }
  }

  getDataTypeAsText(dataType: DataType): string {
    switch (dataType) {
      case DataType.Text:
        return 'text';
      case DataType.Numeric:
        return 'numeric';
      case DataType.Boolean:
        return 'boolean';
      case DataType.Date:
        return 'date';
      default:
        return 'text';
    }
  }

  /**
   * Updates the filters of a PrimeNG data table based on predefined filter changes.
   *
   * @param {string} filterName - The name of the filter to be updated.
   * @param {IPrimengPredifinedFilter[]} selectedValues - An array of selected predefined filter values.
   */
  onPredifinedFilterChange(filterName: string, selectedValues: PredifinedFilter[]): void {
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
   *   console.log(`Delete row with id: ${rowData.rowID}`);
   * };
   * 
   * // Use handleButtonsClick with row data
   * handleButtonsClick(deleteAction, { rowID: 1, name: 'John Doe' });
   */
  handleButtonsClick(action: (rowData: any) => void, rowData: any = null): void {
    if (action) { // If the button has an assigned action
      action(rowData); // Perform the action
    }
  }

  /**
   * Checks if the provided column metadata matches a specific style of the predefined filters 
   * that need to be applied to an item on a row.
   *
   * @param {IprimengColumnsMetadata} colMetadata - The metadata of the column being checked.
   * @param {any} value - The value to be matched against the predefined filter values.
   * @returns {any} The matching predefined filter value if found, otherwise null.
   */
  getPredfinedFilterMatch(colMetadata: ColumnMetadata, value: any): any {
    if (colMetadata.filterPredifinedValuesName && colMetadata.filterPredifinedValuesName.length > 0) { // Check if the column uses predefined filter values
        const options = this.getPredifinedFilterValues(colMetadata.filterPredifinedValuesName); // Get the predefined filter values based on the name
        return options.find(option => option.value === value); // Return the matching option if found
    }
    return null; // Return null if the column does not use predefined filter values
  }

  copyToClipboardStart(event: MouseEvent) {
    if(this.copyCellDataToClipboardTimeSecs>0) {
      const cellContent = (event.target as HTMLElement).innerText;
      this.copyCellDataTimer = setTimeout(() => {
        navigator.clipboard.writeText(cellContent).then(() => {
          this.notification.clearToasts();
          this.notification.showToast("info", "CELL CONTENT COPIED", "The cell content has been copied to your clipboard.");
        }).catch(err => {
          this.notification.clearToasts();
          this.notification.showToast("error", "CELL CONTENT COPIED", `The cell content failed to copy to your clipboard with error: ${err}`);
        });
      }, this.copyCellDataToClipboardTimeSecs*1000 );
    }
  }

  copyToClipboardCancel(){
    if(this.copyCellDataToClipboardTimeSecs>0) {
      clearTimeout(this.copyCellDataTimer);
    }
  }

  getDataAlignHorizontalAsText(dataAlignHorizontal: DataAlignHorizontal): string {
    switch (dataAlignHorizontal) {
      case DataAlignHorizontal.Left:
        return 'left';
      case DataAlignHorizontal.Center:
        return 'center';
      case DataAlignHorizontal.Right:
        return 'right';
      default:
        return 'center';
    }
  }

  getDataAlignVerticalAsText(dataAlignVertical: DataAlignVertical): string {
    switch (dataAlignVertical) {
      case DataAlignVertical.Top:
        return 'top';
      case DataAlignVertical.Middle:
        return 'middle';
      case DataAlignVertical.Bottom:
        return 'bottom';
      default:
        return 'middle';
    }
  }

  highlightText(cellValue: any, colMetadata: ColumnMetadata, globalSearchText: string | null): SafeHtml {
    return this.tableService.highlightText(cellValue, colMetadata, globalSearchText);
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
      formattedDate = this.datePipe.transform(value, this.dateFormat, this.dateTimezone, this.dateCulture); // Perform the date masking
    }
    return formattedDate ?? ''; // Returns the date formatted, or as empty string if an issue was found (or value was undefined).
  }

  isRowSelected(rowID: any): boolean {
    return this.selectedRows.includes(rowID);
  }

  onRowSelectChange(event: any, rowID: any): void {
    if (event.checked) { // Add the selected item
        this.selectedRows.push(rowID);
    } else { // Remove the selected item
        this.selectedRows = this.selectedRows.filter(selectedId => selectedId !== rowID);
    }
    this.selectedRowsChange.emit({
      rowID: rowID,
      selected: event.checked
    });
  }
}