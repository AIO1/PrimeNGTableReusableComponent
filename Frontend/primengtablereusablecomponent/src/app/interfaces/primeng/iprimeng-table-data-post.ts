/**
 * Interface representing the request structure for PrimeNG post requests.
 */
export interface IprimengTableDataPost {
    /** Gets or sets the current page number.*/
    page: number;
  
    /** Gets or sets the number of items to display per page.*/
    pageSize: number;
  
    /** Gets or sets a list of sorting configurations for the table.*/
    sort?: any
  
    /** Gets or sets a dictionary containing filter configurations for each column.*/
    filter: any;
  
    /** Gets or sets a global filter string applied to all columns.*/
    globalFilter?: string | null;
  
    /** Gets or sets a list of columns to be included in the response.*/
    columns?: string[];
}