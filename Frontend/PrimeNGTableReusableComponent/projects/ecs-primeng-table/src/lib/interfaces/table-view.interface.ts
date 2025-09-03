import { ITableViewData } from "./table-view-data.interface";

export interface ITableView {
    lastActive: boolean;
    viewAlias: string;
    viewData: ITableViewData;
}