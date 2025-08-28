import { ITableViewData } from "./table-view-data.interface";

export interface ITableView {
    viewAlias: string;
    viewData: ITableViewData;
}