import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, timeout  } from 'rxjs/operators';
import { Observable, throwError, map, OperatorFunction } from 'rxjs';
import { Router } from '@angular/router';
import { Constants } from '../../../constants';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private messageService: MessageService, private http: HttpClient, private router: Router) {}
    // #region showToast
    /**
     * Shows a customizable toast message. Can also close all toast messages before showing the current one.
     * @param {string} severity The severity of the message, severities can be:
     * - success
     * - info
     * - warn
     * - error
     * @param {string} title The title to display in the toast message.
     * @param {string} message The message to be displayed.
     * @param {number} duration The amount (in milis) that the toast has to be displayed.
     * @param {boolean} keepToast If true, it will keep the toast message even after its lifetime has passed.
     * @param {boolean} closable If true, the user will be able to close the toas message.
     * @param {boolean} clearPrevious If true, all existing toast messages will be closed before showing the current one.
     */
        showToast(severity: string, title: string, message: string, duration: number = 5000, keepToast:boolean = false, closable:boolean = true, clearPrevious: boolean = true){
            if(clearPrevious){//If we have to clear the previous toasts
                this.clearToasts();
            }
            if(severity==="success" || severity==="info" || severity==="warn" || severity==="error"){
                this.messageService.add({severity: severity, summary: title, detail: message, life: duration, sticky: keepToast, closable: closable});
            }
        }
    //#endregion
    // #region clearToasts
    /**
     * Clears all toast messages that are being shown.
     */
        clearToasts(){
            this.messageService.clear();
        }
        dataFecthError(title: string, err: Error, routeToOther: boolean = true): void{
          this.showToast("error", title, err.message);
          if(routeToOther){
            this.router.navigate(['/error']);
          }
          Constants.waitingHTTP = false;
        }
    //#endregion

    private getHttpOptions(customhttpOptions?: HttpHeaders | null): HttpHeaders {
      let httpOptions = new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json'
      });
      if (customhttpOptions) {
        httpOptions = customhttpOptions;
      }
      return httpOptions;
    }
    handleHttpGetRequest<T>(servicePoint: string, httpOptions: HttpHeaders | null = null, customErrorHandler: ((error: any) => Observable<any>) | null = null, showAPIError: boolean = false): Observable<HttpResponse<T>> {
      return this.http.get<T>(`${Constants.APIbaseURL}${servicePoint}`, { ...this.getHttpOptions(httpOptions), observe: 'response' }).pipe(
        timeout(Constants.timeoutTime) as OperatorFunction<HttpResponse<T>, HttpResponse<T>>,
        catchError(error => this.handleHttpError(error, customErrorHandler, showAPIError))
      );
    }
    handleHttpPostRequest<T>(servicePoint: string, data: any, httpOptions: HttpHeaders | null = null, customErrorHandler: ((error: any) => Observable<any>) | null = null, showAPIError: boolean = false): Observable<HttpResponse<T>> {
      return this.http.post<T>(`${Constants.APIbaseURL}${servicePoint}`, data, { ...this.getHttpOptions(httpOptions), observe: 'response' }).pipe(
        timeout(Constants.timeoutTime) as OperatorFunction<HttpResponse<T>, HttpResponse<T>>,
        catchError(error => this.handleHttpError(error, customErrorHandler, showAPIError))
      );
    }
    private handleHttpError(error: any, customErrorHandler: ((error: any) => Observable<any>) | null = null, showAPIError = false): Observable<any> {
      if (error.name === 'TimeoutError') {
        return throwError(() => new Error('Exceeded max timeout time of request.'));
      } else {
        if (customErrorHandler) {
          return customErrorHandler(error);
        }
        if (showAPIError) {
          return throwError(() => new Error(error.error));
        }
        return throwError(() => new Error('Unexpected error'));
      }
    }
    handleHttpResponse<T>(observable: Observable<HttpResponse<T>>, okStatusCode = 200, checkBody = true): Observable<T> {
      return observable.pipe(
        catchError(err => {
          throw new Error(err.message);
        }),
        map(response => {
          if (response.status !== okStatusCode) {
            throw new Error(`Unexpected response status. Expected ${okStatusCode} and got ${response.status}.`);
          }
          if (checkBody && !response.body) {
            throw new Error('Response body is null or undefined and it was expected to be informed.');
          }
          return response.body as T;
        })
      );
    }
}