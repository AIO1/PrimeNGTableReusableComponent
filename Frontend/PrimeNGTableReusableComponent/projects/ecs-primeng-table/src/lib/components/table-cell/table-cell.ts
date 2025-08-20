import { Component, Input } from '@angular/core';
import { DataAlignHorizontal, DataAlignVertical, DataType } from '../../enums';
import { CommonModule, DatePipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { dataAlignHorizontalAsText, dataAlignVerticalAsText, highlightText } from '../../utils';
import { ColumnMetadata, PredifinedFilter } from '../../interfaces';
import { SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'ecs-table-cell',
  imports: [
    CommonModule,
    TooltipModule
  ],
  standalone: true,
  templateUrl: './table-cell.html'
})
export class TableCell {
  constructor(
    private datePipe: DatePipe
  ) {}
  @Input() col: any; // aquí pondrías tu tipo ColumnMetadata
  @Input() rowData: any;
  @Input() globalSearchText: string | null = null;
  @Input() predifinedFiltersCollection: { [key: string]: PredifinedFilter[] } = {}; // Contains a collection of the values that need to be shown for predifined column filters
  @Input() dateFormat: string = "dd-MMM-yyyy HH:mm:ss zzzz";
  @Input() dateTimezone: string = "+00:00";
  @Input() dateCulture: string = "en-US";

  DataType = DataType;

  get value() {
    return this.rowData[this.col.field];
  }

  get tooltipText() {
    if (this.col.dataTooltipCustomColumnSource && this.col.dataTooltipCustomColumnSource.length > 0) {
      return this.rowData[this.col.dataTooltipCustomColumnSource];
    }
    return this.value;
  }

  getDataAlignHorizontalAsText(dataAlignHorizontal: DataAlignHorizontal){
      dataAlignHorizontalAsText(dataAlignHorizontal);
  }
  getDataAlignVerticalAsText(dataAlignVertical: DataAlignVertical){
      dataAlignVerticalAsText(dataAlignVertical);
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
  getPredifinedFilterValues(columnKeyName: string): PredifinedFilter[] {
    return this.predifinedFiltersCollection[columnKeyName] || []; // Return the predefined filter values or an empty array if the option name does not exist
  }

    highlightText(cellValue: any, colMetadata: ColumnMetadata, globalSearchText: string | null): SafeHtml {
        return highlightText(cellValue, colMetadata, globalSearchText);
    }
}