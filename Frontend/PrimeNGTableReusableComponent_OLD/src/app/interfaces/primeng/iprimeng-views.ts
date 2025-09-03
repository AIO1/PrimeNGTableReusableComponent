import { SortMeta } from "primeng/api";
import { IprimengColumnsMetadata } from "./iprimeng-columns-metadata";
export interface IPrimeNgView {
    viewAlias: string;
    viewData: IPrimeNgViewData;
}
export interface IPrimeNgViewData {
    columnsShown: IprimengColumnsMetadata[];
    tableWidth: any;
    columnsWidth: string;
    multiSortMeta: SortMeta[] | null | undefined;
    filters: any;
    globalSearchText: string | null;
    currentPage: number;
    currentRowsPerPage: number;
}