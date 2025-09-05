import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler,  HttpEvent} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '../services/spinner.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private spinnerService: SpinnerService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const showSpinner = req.headers.get('X-Show-Spinner') !== 'false';
    if (showSpinner) {
      this.spinnerService.show();
    }
    return next.handle(req).pipe(
      finalize(() => {
        if (showSpinner) {
          this.spinnerService.hide();
        }
      })
    );
  }
}