import { Injectable } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export abstract class ECSPrimengTableHttpService {

  abstract handleHttpGetRequest<T>(
    servicePoint: string,
    responseType?: 'json' | 'blob'
  ): Observable<HttpResponse<T>>;

  abstract handleHttpPostRequest<T>(
    servicePoint: string,
    data: any,
    httpOptions?: HttpHeaders | null,
    responseType?: 'json' | 'blob'
  ): Observable<HttpResponse<T>>;
}