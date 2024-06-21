import { IprimengColumnsMetadata } from "./iprimeng-columns-metadata";
export interface IprimengColumnsAndAllowedPagination {
    columnsInfo: IprimengColumnsMetadata[];
    allowedItemsPerPage: number[];
    dateFormat: string;
    dateTimezone: string;
    dateCulture: string;
}