import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { SpinnerService } from './services/spinner.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

    constructor(private _loading: SpinnerService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this._loading.setLoading(true);
        return next.handle(request).pipe(
            finalize(() => {
                this._loading.setLoading(false);
            })
        );
    }
}