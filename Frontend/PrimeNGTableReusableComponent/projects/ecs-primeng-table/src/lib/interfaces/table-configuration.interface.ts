import { ColumnMetadata } from "../interfaces";
export interface TableConfiguration {
    columnsInfo: ColumnMetadata[];
    allowedItemsPerPage: number[];
    dateFormat: string;
    dateTimezone: string;
    dateCulture: string;
}