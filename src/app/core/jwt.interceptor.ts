import { Inject, Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { EMPTY, Observable, throwError } from "rxjs";
import { AppConfig, APP_CONFIG } from './../app-config.module';
import { AuthenticationService } from "./services/authentication.service";
import { catchError, finalize, map } from 'rxjs/operators';
import { LoaderService } from "./components/loader/loader.service";
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(@Inject(APP_CONFIG) private config: AppConfig,
        private _ls: LoaderService, public toastr: ToastrService, private router: Router,
        private authenticationService: AuthenticationService) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.token) {
            if (request.body instanceof FormData)
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                });
            else
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`,
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "application/json; charset=utf-8"
                    },
                });
        }
        this._ls.show();
        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => { // Type the error as HttpErrorResponse
                this._ls.hide();
                if (err.status == 401) {
                    if (err.url.endsWith('/login/get-menus')) {
                        return EMPTY;
                    }
                    else {
                        this.toastr.error(err.error.message, 'Authentication !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                        this.router.navigate(["/unauthorize"]);
                    }
                }
                else if (err.status == 403) {
                    this.toastr.error(err.error.message, 'Authentication !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                    this.router.navigate(["/forbidden"]);
                } else if (err.status === 0 || err.status === 500) {
                    this.toastr.error('Unable to connect to the server. Please try again later.', 'Server !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
                return throwError(() => err); // Return an Observable using throwError
            }),
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    this._ls.hide();
                }
                return event;
            }),
            finalize(() => { // Use finalize for cleanup, even after errors
                this._ls.hide();
            })
        );

        // return next.handle(request).pipe(map(event => {
        //     if (event instanceof HttpResponse) {
        //         this._ls.hide();
        //     }
        //     return event;
        // }));
        //return next.handle(request);
    }
}