import { SortMeta } from "primeng/api";
import { IColumnMetadata } from "./columns-metadata.interface";

export interface ITableViewData {
    columnsShown: IColumnMetadata[];
    tableWidth: any;
    columnsWidth: string;
    multiSortMeta: SortMeta[] | null | undefined;
    filters: any;
    globalSearchText: string | null;
    currentPage: number;
    currentRowsPerPage: number;
}