import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ECSPrimengTableHttpService, ECSPrimengTableNotificationService } from '../../services';
import { ColumnMetadata, TableConfiguration } from '../../interfaces';
import { FrozenColumnAlign } from '../../enums';

@Injectable({
  providedIn: 'root'
})
export class ECSPrimengTableService {
  constructor(
    private http: ECSPrimengTableHttpService,
    private notification: ECSPrimengTableNotificationService
  ) {}
  
  fetchTableConfiguration(url: string): Observable<HttpResponse<TableConfiguration>>{
      return this.http.handleHttpGetRequest<TableConfiguration>(url);
  }
  
  handleTableError(
    error: any,
    customTitle: string = 'Data Loading Error'
  ): void {
    const message = error.message || 'Unknown error occurred';
    this.notification.showToast('error', customTitle, message);
  }

  orderColumnsWithFrozens(colsToOrder: ColumnMetadata[]): ColumnMetadata[]{
    const frozenLeftColumns = colsToOrder.filter(col => col.frozenColumnAlign === FrozenColumnAlign.Left);
    const frozenRightColumns = colsToOrder.filter(col => col.frozenColumnAlign === FrozenColumnAlign.Right);
    const nonFrozenColumns = colsToOrder.filter(col => col.frozenColumnAlign === FrozenColumnAlign.Noone);
    return [...frozenLeftColumns, ...nonFrozenColumns, ...frozenRightColumns];
  }
}