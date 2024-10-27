import { Injectable } from '@angular/core';
import { IPrimeNgViewData, IPrimeNgView } from '../../interfaces/primeng/iprimeng-views';
import { DomHandler } from 'primeng/dom';
import { Table } from 'primeng/table';
import { SharedService } from '../shared/shared.service';
import { enumTableViewSaveMode } from '../../components/primeng-table/primeng-table.component';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
@Injectable({
    providedIn: 'root',
})
export class PrimengTableViewsService {
    constructor(private sharedService: SharedService) {}
    computeColumnWidths(dt: Table): any {
        let widths: number[] = [];
        let headers = DomHandler.find(dt.containerViewChild?.nativeElement, '.p-datatable-thead > tr > th');
        headers.forEach((header) => widths.push(DomHandler.getOuterWidth(header)));
        return widths.join(',');
    }
    computeTableWidth(dt: Table): any {
        let tableWidth = 0;
        if (dt.columnResizeMode === 'expand') {
            tableWidth = DomHandler.getOuterWidth(dt.tableViewChild?.nativeElement);
        }
        return tableWidth;
    }
    generateSaveData(dt: Table, globalSearchText: string | null, currentPage: number, currentRowsPerPage: number, modifyFiltersFn: (filters: any) => any): IPrimeNgViewData{
        let colsWidth = this.computeColumnWidths(dt);
        let tableWidth = this.computeTableWidth(dt);
        const filtersWithoutGlobalAndSelectedRows = {...modifyFiltersFn(JSON.parse(JSON.stringify(dt.filters)))};
        if (filtersWithoutGlobalAndSelectedRows['rowID']) {
            filtersWithoutGlobalAndSelectedRows['rowID'][0].value = null;
        }
        if (filtersWithoutGlobalAndSelectedRows['selector']) {
            filtersWithoutGlobalAndSelectedRows['selector'][0].value = null;
        }
        const tableView: IPrimeNgViewData = {
          columnsShown: [...dt.columns!],
          multiSortMeta: dt.multiSortMeta,
          filters: {...filtersWithoutGlobalAndSelectedRows},
          globalSearchText: globalSearchText,
          currentPage: currentPage,
          currentRowsPerPage: currentRowsPerPage,
          tableWidth: tableWidth,
          columnsWidth: colsWidth
        }
        return tableView;
    }
    get(tableSaveViewList: IPrimeNgView[], aliasToFind: string): IPrimeNgView | undefined {
        return tableSaveViewList.find(view => 
            view.viewAlias.toLowerCase() === aliasToFind.toLowerCase()
        );
    }
    recoverList(tableViewSaveAs: enumTableViewSaveMode, recoverListEndpoint: string, tableViewSaveKey: string): IPrimeNgView[] | Observable<HttpResponse<IPrimeNgView[]>>{
        let tableViewList: IPrimeNgView[] = [];
        let tableViewNotParsed: string | null = null;
        if(tableViewSaveKey !== "" && tableViewSaveKey !== ''){
            switch(tableViewSaveAs){
                case enumTableViewSaveMode.noone:
                    tableViewNotParsed = null;
                break;
                case enumTableViewSaveMode.sessionStorage:
                    tableViewNotParsed = sessionStorage.getItem(tableViewSaveKey);
                break;
                case enumTableViewSaveMode.localStorage:
                    tableViewNotParsed = localStorage.getItem(tableViewSaveKey);
                break;
                case enumTableViewSaveMode.databaseStorage:
                    const postData: any = {
                        tableViewSaveKey: tableViewSaveKey
                    };
                    return this.sharedService.handleHttpPostRequest<IPrimeNgView[]>(recoverListEndpoint,postData);
                default:
                    this.sharedService.showToast("error","NOT IMPLEMENTED", "This type os save view has not been implemented yet.");
            }
        }
        tableViewList = tableViewNotParsed ? JSON.parse(tableViewNotParsed) : [];
        this.sort(tableViewList);
        return tableViewList;
    }
    databaseSaveList(tableSaveViewList: IPrimeNgView[], setListEndpoint: string, tableViewSaveKey: string): Observable<HttpResponse<any>>{
        const serializedSaveViews = tableSaveViewList.map(view => ({
            viewAlias: view.viewAlias,
            viewData: JSON.stringify(view.viewData)
        }));
        const postData: any = {
            tableViewSaveKey: tableViewSaveKey,
            views: serializedSaveViews
        };
        return this.sharedService.handleHttpPostRequest<any>(setListEndpoint,postData);
    }
    updateMenuItems(tableSaveViewList: IPrimeNgView[]): MenuItem[]{
        return tableSaveViewList.map(item => ({
            label: item.viewAlias
        }));
    }
    sort(tableSaveViewList: IPrimeNgView[]): void{
        tableSaveViewList.sort((a, b) => 
            a.viewAlias.toLowerCase().localeCompare(b.viewAlias.toLowerCase())
        );
    }
}