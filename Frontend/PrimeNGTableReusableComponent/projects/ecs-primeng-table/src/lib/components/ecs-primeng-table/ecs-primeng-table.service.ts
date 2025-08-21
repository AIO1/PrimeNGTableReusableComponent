import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ECSPrimengTableHttpService, ECSPrimengTableNotificationService } from '../../services';
import { IColumnMetadata, ITableConfiguration, ITablePagedResponse } from '../../interfaces';
import { CellOverflowBehaviour, DataType, FrozenColumnAlign } from '../../enums';
import { SafeHtml } from '@angular/platform-browser';
import { ITableQueryRequest } from '../../interfaces/table-query-request.interface';

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
}