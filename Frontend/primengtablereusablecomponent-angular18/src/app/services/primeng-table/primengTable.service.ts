import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '../shared/shared.service';
import { IprimengTableDataPost } from '../../interfaces/primeng/iprimeng-table-data-post';
import { IprimengTableDataReturn } from '../../interfaces/primeng/iprimeng-table-data-return';
import { IprimengColumnsAndAllowedPagination } from '../../interfaces/primeng/iprimeng-columns-and-allowed-pagination';
import { enumDataType, IprimengColumnsMetadata } from '../../interfaces/primeng/iprimeng-columns-metadata';
import { SafeHtml } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root',
})
export class PrimengTableService {
    constructor(private sharedService: SharedService) {}
    fetchTableColumnsAndAllowedPaginations(url: string): Observable<HttpResponse<IprimengColumnsAndAllowedPagination>>{
        return this.sharedService.handleHttpGetRequest<IprimengColumnsAndAllowedPagination>(url);
    }
    fetchTableData(url: string, postData: IprimengTableDataPost): Observable<HttpResponse<IprimengTableDataReturn>> {
        return this.sharedService.handleHttpPostRequest<IprimengTableDataReturn>(url, postData);
    }
    getIconBlob(url: string): Observable<HttpResponse<Blob>> {
      return this.sharedService.handleHttpGetRequest<Blob>(url,null,false);
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
    if (colMetadata.dataType !== enumDataType.Boolean && globalSearchText !== null) { // Check if the column data type is not boolean and global search text is not null
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
}