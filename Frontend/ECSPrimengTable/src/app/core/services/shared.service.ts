import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, timeout  } from 'rxjs/operators';
import { Observable, throwError, map, OperatorFunction } from 'rxjs';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Constants, log } from '../../../constants';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  constructor(private messageService: MessageService, private http: HttpClient, private router: Router, private sanitizer: DomSanitizer) {}
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
        showToast(severity: string, title: string, message: string, duration: number = 4000, keepToast:boolean = false, closable:boolean = true, clearPrevious: boolean = true){
            if(clearPrevious){//If we have to clear the previous toasts
                this.clearToasts();
            }
            if(severity!="success" && severity!="info" && severity!="warn" && severity!="error"){//If severity is not an expected value
                log(2, `The provided seveirty ${severity} is not within the expected values.`);
            }else{//Severity is an expected value
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
        dataFecthError(title: string, err: Error, routeToHome: boolean = true): void{
          log(2, `${title}: ${err.message}`);
          this.showToast("error", title, err.message);
          if(routeToHome){
            this.router.navigate(['/']);
          }
        }
    //#endregion

    private getHttpOptions(showSpinner: boolean, customhttpOptions?: HttpHeaders | null): HttpHeaders {
      let httpOptions = new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json'
      });
      if (customhttpOptions) {
        httpOptions = customhttpOptions;
      }
      if (showSpinner) {
        httpOptions = httpOptions.set('X-Show-Spinner', 'true');
      } else {
        httpOptions = httpOptions.set('X-Show-Spinner', 'false');
      }
      return httpOptions;
    }
    handleHttpGetRequest<T>(servicePoint: string, httpOptions: HttpHeaders | null = null, showSpinner: boolean = true, customErrorHandler: ((error: any) => Observable<any>) | null = null, showAPIError: boolean = false, responseType: 'json' | 'blob' = 'json'): Observable<HttpResponse<T>> {
      return this.http.get<T>(`${Constants.APIbaseURL}${servicePoint}`, { ...this.getHttpOptions(showSpinner, httpOptions), observe: 'response', responseType: responseType as any}).pipe(
        timeout(Constants.timeoutTime) as OperatorFunction<HttpResponse<T>, HttpResponse<T>>,
        catchError(error => this.handleHttpError(error, customErrorHandler, showAPIError))
      );
    }
    handleHttpPostRequest<T>(servicePoint: string, data: any, httpOptions: HttpHeaders | null = null, showSpinner: boolean = true, customErrorHandler: ((error: any) => Observable<any>) | null = null, showAPIError: boolean = false, responseType: 'json' | 'blob' = 'json'): Observable<HttpResponse<T>> {
      return this.http.post<T>(`${Constants.APIbaseURL}${servicePoint}`, data, { ...this.getHttpOptions(showSpinner, httpOptions), observe: 'response', responseType: responseType as any}).pipe(
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
          return throwError(() => new Error(error.error.message));
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
    goToURL(url: string | undefined, errorTitle: string = "Empty URL", errorMessage: string = "The URL is empty and can't be opened") {
      if (url) {
        window.open(url, '_blank');
      } else {
        this.showToast("error", errorTitle, errorMessage);
      }
    }
    /**
   * Converts a blob from the database to a safe URL that can be used to display an image.
   *
   * This function takes a `Blob` object, converts it to a base64 encoded string, and returns a `SafeUrl` 
   * that can be used in an HTML template to display the image securely. The `SafeUrl` ensures that 
   * Angular's security mechanisms are bypassed correctly, preventing potential security risks.
   *
   * @param {Blob} blob - The blob object representing the image data from the database.
   * @returns {SafeUrl} A safe URL that can be used to display the image in an HTML template.
   * 
   * @example
   * // Example usage in a component
   * const imageBlob = new Blob([binaryData], { type: 'image/jpeg' });
   * const imageUrl = this.getBlobIconAsUrl(imageBlob);
   * 
   * // In your HTML template
   * <img [src]="imageUrl" alt="Image">
   */
  getBlobIconAsUrl(blob: Blob): SafeUrl {
    let objectURL = `data:image/jpeg;base64,${blob}`; // Create a base64 encoded string from the blob data
    return this.sanitizer.bypassSecurityTrustUrl(objectURL); // Bypass Angular's security mechanisms to create a SafeUrl
  }
}