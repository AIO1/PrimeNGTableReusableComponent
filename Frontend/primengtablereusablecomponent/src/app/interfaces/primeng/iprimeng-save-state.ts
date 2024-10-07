import { SortMeta } from "primeng/api";
import { IprimengColumnsMetadata } from "./iprimeng-columns-metadata";

export interface IPrimengSaveState {
    columnsShown: IprimengColumnsMetadata[];
    tableWidth: any;
    columnsWidth: string;
    multiSortMeta: SortMeta[] | null | undefined;
    filters: any;
    globalSearchText: string | null;
    currentPage: number;
    currentRowsPerPage: number;
}
