import { Injectable } from '@angular/core';
import { IPrimengSaveState, IPrimengSaveStateList } from '../../interfaces/primeng/iprimeng-save-state';
import { DomHandler } from 'primeng/dom';
import { Table } from 'primeng/table';
import { SharedService } from '../shared/shared.service';
import { enumTableStateSaveMode } from '../../components/primeng-table/primeng-table.component';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
@Injectable({
    providedIn: 'root',
})
export class PrimengTableStateService {
    constructor(private sharedService: SharedService) {}
    generateSaveData(dt: Table, globalSearchText: string | null, currentPage: number, currentRowsPerPage: number, modifyFiltersFn: (filters: any) => any): IPrimengSaveState{
        let widths: number[] = [];
        let headers = DomHandler.find(dt.containerViewChild?.nativeElement, '.p-datatable-thead > tr > th');
        headers.forEach((header) => widths.push(DomHandler.getOuterWidth(header)));
        let colWidth = widths.join(',');
        let tableWidth = 0;
        if (dt.columnResizeMode === 'expand') {
          tableWidth = DomHandler.getOuterWidth(dt.tableViewChild?.nativeElement);
        }
        const filtersWithoutGlobalAndSelectedRows = {...modifyFiltersFn(JSON.parse(JSON.stringify(dt.filters)))};
        if (filtersWithoutGlobalAndSelectedRows['id']) {
            filtersWithoutGlobalAndSelectedRows['id'][0].value = null;
        }
        if (filtersWithoutGlobalAndSelectedRows['selector']) {
            filtersWithoutGlobalAndSelectedRows['selector'][0].value = null;
        }
        const tableState: IPrimengSaveState = {
          columnsShown: [...dt.columns!],
          multiSortMeta: dt.multiSortMeta,
          filters: {...filtersWithoutGlobalAndSelectedRows},
          globalSearchText: globalSearchText,
          currentPage: currentPage,
          currentRowsPerPage: currentRowsPerPage,
          tableWidth: tableWidth,
          columnsWidth: colWidth
        }
        return tableState;
    }
    get(tableSaveStateList: IPrimengSaveStateList[], aliasToFind: string): IPrimengSaveStateList | undefined {
        return tableSaveStateList.find(state => 
            state.stateAlias.toLowerCase() === aliasToFind.toLowerCase()
        );
    }
    recoverList(tableStateSaveAs: enumTableStateSaveMode, recoverListEndpoint: string, username: string, tableStateSaveKey: string): IPrimengSaveStateList[] | Observable<HttpResponse<IPrimengSaveStateList[]>>{
        let tableStateList: IPrimengSaveStateList[] = [];
        let tableStateNotParsed: string | null = null;
        if(tableStateSaveKey !== ""){
            switch(tableStateSaveAs){
                case enumTableStateSaveMode.sessionStorage:
                    tableStateNotParsed = sessionStorage.getItem(tableStateSaveKey);
                break;
                case enumTableStateSaveMode.localStorage:
                    tableStateNotParsed = localStorage.getItem(tableStateSaveKey);
                break;
                case enumTableStateSaveMode.databaseStorage:
                    const postData: any = {
                        username: username,
                        tableStateSaveKey: tableStateSaveKey
                    };
                    return this.sharedService.handleHttpPostRequest<IPrimengSaveStateList[]>(recoverListEndpoint,postData);
                default:
                    this.sharedService.showToast("error","NOT IMPLEMENTED", "This type os save state has not been implemented yet.");
            }
        }
        tableStateList = tableStateNotParsed ? JSON.parse(tableStateNotParsed) : [];
        this.sort(tableStateList);
        return tableStateList;
    }
    databaseSaveList(tableSaveStateList: IPrimengSaveStateList[], setListEndpoint: string, username: string, tableStateSaveKey: string): Observable<HttpResponse<any>>{
        const serializedSaveStates = tableSaveStateList.map(state => ({
            stateAlias: state.stateAlias,
            state: JSON.stringify(state.state)
        }));
        const postData: any = {
            username: username,
            tableStateSaveKey: tableStateSaveKey,
            saveStates: serializedSaveStates
        };
        return this.sharedService.handleHttpPostRequest<any>(setListEndpoint,postData);
    }
    updateMenuItems(tableSaveStateList: IPrimengSaveStateList[], loadTableStateFn: (aliasToSet?: string) => void, deleteTableStateFn: (aliasToDelete: string) => void): MenuItem[]{
        return tableSaveStateList.map(item => ({
            label: item.stateAlias,
            items: [
                {
                    label: 'LOAD',
                    icon: 'pi pi-upload',
                    command: () => {
                        loadTableStateFn(item.stateAlias); 
                    }
                },
                {
                    label: 'DELETE',
                    icon: 'pi pi-trash',
                    command: () => {
                        deleteTableStateFn(item.stateAlias); 
                    }
                }
            ]
            
        }));
    }
    sort(tableSaveStateList: IPrimengSaveStateList[]): void{
        tableSaveStateList.sort((a, b) => 
            a.stateAlias.toLowerCase().localeCompare(b.stateAlias.toLowerCase())
        );
    }
}