import { Injectable } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export abstract class ECSPrimengTableHttpService {

  abstract handleHttpGetRequest<T>(
    servicePoint: string,
    httpOptions?: HttpHeaders | null,
    showSpinner?: boolean,
    customErrorHandler?: ((error: any) => Observable<any>) | null,
    showAPIError?: boolean,
    responseType?: 'json' | 'blob'
  ): Observable<HttpResponse<T>>;
}