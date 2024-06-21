import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';
import { IprimengTableDataPost } from '../../interfaces/primeng/iprimeng-table-data-post';
import { IprimengTableDataReturn } from '../../interfaces/primeng/iprimeng-table-data-return';
import { IprimengColumnsAndAllowedPagination } from '../../interfaces/primeng/iprimeng-columns-and-allowed-pagination';
@Injectable({
  providedIn: 'root',
})
export class PrimengSharedService {
    constructor(private sharedService: SharedService) {}
    fetchTableColumnsAndAllowedPaginations(url: string): Observable<HttpResponse<IprimengColumnsAndAllowedPagination>>{
        return this.sharedService.handleHttpGetRequest<IprimengColumnsAndAllowedPagination>(url);
    }
    fetchTableData(url: string, postData: IprimengTableDataPost): Observable<HttpResponse<IprimengTableDataReturn>> {
        return this.sharedService.handleHttpPostRequest<IprimengTableDataReturn>(url, postData);
    }
}