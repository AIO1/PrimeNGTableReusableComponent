/**
 * Interface representing the return structure for PrimeNG post requests when gathering data to represent in a table.
 */
export interface TablePagedResponse {
    /** The current page number.*/
    page: number;

    /** Total number of records available from filter.*/
    totalRecords: number;

    /** Total number of records available (without filters).*/
    totalRecordsNotFiltered: number;
    
    /** Dynamic data representing the response content of data for the table.*/
    data: any;
}