import { Injectable } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ECSPrimengTableHttpService } from 'ecs-primeng-table';
import { SharedService } from './shared.service';

@Injectable({ providedIn: 'root' })
export class HttpService extends ECSPrimengTableHttpService {
  constructor(private sharedService: SharedService) {
    super();
  }

  handleHttpGetRequest<T>(
    servicePoint: string,
    httpOptions: HttpHeaders | null = null,
    showSpinner: boolean = true,
    customErrorHandler: ((error: any) => Observable<any>) | null = null,
    showAPIError: boolean = false,
    responseType: 'json' | 'blob' = 'json'
  ): Observable<HttpResponse<T>> {
    return this.sharedService.handleHttpGetRequest(servicePoint, httpOptions, showSpinner, customErrorHandler, showAPIError, responseType);
  }
}