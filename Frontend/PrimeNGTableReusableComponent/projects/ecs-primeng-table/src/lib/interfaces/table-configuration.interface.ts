import { IColumnMetadata } from "../interfaces";
export interface ITableConfiguration {
    columnsInfo: IColumnMetadata[];
    allowedItemsPerPage: number[];
    dateFormat: string;
    dateTimezone: string;
    dateCulture: string;
    maxViews: number;
}