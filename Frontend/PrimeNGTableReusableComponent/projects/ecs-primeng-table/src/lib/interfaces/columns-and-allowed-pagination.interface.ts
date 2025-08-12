import { ECSPrimengTableColumnMetadata } from "./columns-metadata.interface";
export interface ECSPrimengTablePrimengColumnsAndAllowedPagination {
    columnsInfo: ECSPrimengTableColumnMetadata[];
    allowedItemsPerPage: number[];
    dateFormat: string;
    dateTimezone: string;
    dateCulture: string;
}