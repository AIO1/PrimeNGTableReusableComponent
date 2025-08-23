import { ITableQueryRequest } from "./table-query-request.interface";

export interface IExcelExportRequest extends ITableQueryRequest {
    filename: string;
    allColumns: boolean;
    applyFilters: boolean;
    applySorts: boolean;
}