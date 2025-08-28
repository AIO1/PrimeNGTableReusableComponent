import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ECSPrimengTableHttpService, ECSPrimengTableNotificationService } from '../../services';
import { IColumnMetadata, IExcelExportRequest, ITableConfiguration, ITablePagedResponse, ITableView } from '../../interfaces';
import { CellOverflowBehaviour, FrozenColumnAlign, TableViewSaveMode } from '../../enums';
import { ITableQueryRequest } from '../../interfaces/table-query-request.interface';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ECSPrimengTableService {
  constructor(
    private http: ECSPrimengTableHttpService,
    private notification: ECSPrimengTableNotificationService
  ) {}
  
  fetchTableConfiguration(url: string): Observable<HttpResponse<ITableConfiguration>>{
      return this.http.handleHttpGetRequest<ITableConfiguration>(url);
  }
  fetchTableData(url: string, postData: ITableQueryRequest): Observable<HttpResponse<ITablePagedResponse>>{
      return this.http.handleHttpPostRequest<ITablePagedResponse>(url, postData);
  }
  fetchExcelReport(url: string, postData: IExcelExportRequest): Observable<HttpResponse<Blob>>{
    let httpOptions = new HttpHeaders({
      'accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Type': 'application/json'
    });
    return this.http.handleHttpPostRequest<Blob>(url, postData, httpOptions, true, null, true, 'blob');
  }

  downloadFile(data: Blob, fileName: string, contentType: string) {
    const blob = new Blob([data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  handleTableError(
    error: any,
    customTitle: string = 'Data Loading Error'
  ): void {
    const message = error.message || 'Unknown error occurred';
    this.notification.showToast('error', customTitle, message);
  }

  orderColumnsWithFrozens(colsToOrder: IColumnMetadata[]): IColumnMetadata[]{
    const frozenLeftColumns = colsToOrder.filter(col => col.frozenColumnAlign === FrozenColumnAlign.Left);
    const frozenRightColumns = colsToOrder.filter(col => col.frozenColumnAlign === FrozenColumnAlign.Right);
    const nonFrozenColumns = colsToOrder.filter(col => col.frozenColumnAlign === FrozenColumnAlign.Noone);
    return [...frozenLeftColumns, ...nonFrozenColumns, ...frozenRightColumns];
  }

  /**
   * Handles click events on action buttons in a row of data.
   * 
   * @param {function} action - The action function to be executed when the button is clicked. It should accept one parameter, which is the row data.
   * @param {any} [rowData=null] - The data of the row corresponding to the clicked button. Defaults to null.
   * 
   * @returns {void}
   * 
   * @example
   * // Define an action for a button
   * const deleteAction = (rowData) => {
   *   console.log(`Delete row with id: ${rowData.rowID}`);
   * };
   * 
   * // Use handleButtonsClick with row data
   * handleButtonsClick(deleteAction, { rowID: 1, name: 'John Doe' });
   */
  handleButtonsClick(action: (rowData: any) => void, rowData: any = null): void {
    if (action) { // If the button has an assigned action
      action(rowData); // Perform the action
    }
  }

  getColumnStyle(col: any, headerCols: boolean = false): Record<string, string> {
    let styles: Record<string, string> = {};
    if(!headerCols){
      styles = {
          'white-space': col.cellOverflowBehaviour === CellOverflowBehaviour.Wrap ? 'normal' : 'nowrap',
          'word-wrap': col.cellOverflowBehaviour === CellOverflowBehaviour.Wrap ? 'break-word' : 'normal',
          'word-break': col.cellOverflowBehaviour === CellOverflowBehaviour.Wrap ? 'break-all' : 'normal'
      };
    }
    if (col.initialWidth > 0) {
        styles['max-width'] = col.initialWidth + 'px';
        styles['min-width'] = col.initialWidth + 'px';
        styles['width'] = col.initialWidth + 'px';
    }
    return styles;
  }

  fetchTableViews(tableViewSaveAs: TableViewSaveMode, recoverListEndpoint: string, tableViewSaveKey: string): ITableView[] | Observable<HttpResponse<ITableView[]>>{
    let tableViewList: ITableView[] = [];
    let tableViewNotParsed: string | null = null;
    if(tableViewSaveKey !== "" && tableViewSaveKey !== ''){
        switch(tableViewSaveAs){
            case TableViewSaveMode.noone:
                tableViewNotParsed = null;
            break;
            case TableViewSaveMode.sessionStorage:
                tableViewNotParsed = sessionStorage.getItem(tableViewSaveKey);
            break;
            case TableViewSaveMode.localStorage:
                tableViewNotParsed = localStorage.getItem(tableViewSaveKey);
            break;
            case TableViewSaveMode.databaseStorage:
                const postData: any = {
                    tableViewSaveKey: tableViewSaveKey
                };
                return this.http.handleHttpPostRequest<ITableView[]>(recoverListEndpoint,postData);
            default:
                this.notification.showToast("error","SAVE VIEW TYPE DOES NOT EXIST", "This type of save view does not exist.");
        }
    }
    tableViewList = tableViewNotParsed ? JSON.parse(tableViewNotParsed) : [];
    this.sortViews(tableViewList);
    return tableViewList;
  }
  sortViews(tableSaveViewList: ITableView[]): void{
      tableSaveViewList.sort((a, b) => 
          a.viewAlias.toLowerCase().localeCompare(b.viewAlias.toLowerCase())
      );
  }
  updateViewsMenuItems(tableSaveViewList: ITableView[]): MenuItem[]{
        return tableSaveViewList.map(item => ({
            label: item.viewAlias
        }));
    }
}