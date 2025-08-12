import { Injectable } from '@angular/core';
import { ECSPrimengTableHttpService } from '../../services/http.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ECSPrimengTablePrimengColumnsAndAllowedPagination } from '../../interfaces/columns-and-allowed-pagination.interface';
import { ECSPrimengTableNotificationService } from '../../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ECSPrimengTableService {
  constructor(
    private http: ECSPrimengTableHttpService,
    private notification: ECSPrimengTableNotificationService
  ) {}
  
  fetchTableColumns(url: string): Observable<HttpResponse<ECSPrimengTablePrimengColumnsAndAllowedPagination>>{
      return this.http.handleHttpGetRequest<ECSPrimengTablePrimengColumnsAndAllowedPagination>(url);
  }
  
  handleTableError(
    error: any,
    customTitle: string = 'Data Loading Error'
  ): void {
    const message = error.message || 'Unknown error occurred';
    this.notification.showToast('error', customTitle, message);
  }
}